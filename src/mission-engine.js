import { executeWorker } from "./workers.js";

let lastMissionStamp = "";
let missionSequence = 0;

export function createMission(input = {}) {
  const now = new Date();
  const id = makeMissionId(now);
  const scroll = String(input.scroll ?? input.prompt ?? "").trim() || "Untitled dojo mission";
  const agent = input.agent === "claude" ? "claude" : "codex";
  const summary = inferMissionName(scroll);
  return {
    id,
    agent,
    approval: {
      id: `approval-${id}`,
      missionId: id,
      requestedAt: now.toISOString(),
      status: "pending"
    },
    createdAt: now.toISOString(),
    events: [],
    receipts: [],
    source: input.source ?? null,
    scroll,
    status: "needs_approval",
    summary,
    task: {
      agent,
      context: input.context || "Ninja Dojo v2 PR1 OpenClaw bridge execution.",
      department: agent === "claude" ? "auditor" : "builder",
      id: `${agent}-${id}`,
      prompt: scroll,
      runId: id,
      source: input.source ?? null,
      title: summary
    },
    updatedAt: now.toISOString()
  };
}

export async function approveMission(mission, input = {}) {
  if (!mission) {
    const error = new Error("Mission not found.");
    error.statusCode = 404;
    throw error;
  }
  if (mission.approval?.status === "rejected") {
    const error = new Error("Mission was rejected and cannot be approved.");
    error.statusCode = 409;
    throw error;
  }

  const decidedAt = new Date().toISOString();
  mission.approval = {
    ...mission.approval,
    decidedAt,
    decidedBy: input.decidedBy || "Master",
    notes: input.notes || "Approved through PR0 endpoint.",
    status: "approved"
  };
  mission.status = "approved";
  mission.updatedAt = decidedAt;

  const receipt = await executeWorker(mission.task);
  const fullReceipt = {
    ...receipt,
    createdAt: new Date().toISOString(),
    id: `receipt-${mission.id}-${receipt.agent}`,
    missionId: mission.id
  };
  mission.receipts = [fullReceipt, ...(mission.receipts || [])];
  mission.status = "receipt_ready";
  mission.updatedAt = fullReceipt.createdAt;
  return { mission, receipt: fullReceipt };
}

export function rejectMission(mission, input = {}) {
  if (!mission) {
    const error = new Error("Mission not found.");
    error.statusCode = 404;
    throw error;
  }
  if (mission.status === "receipt_ready" || mission.approval?.status === "approved") {
    const error = new Error("Mission was already approved and cannot be rejected.");
    error.statusCode = 409;
    throw error;
  }

  const decidedAt = new Date().toISOString();
  mission.approval = {
    ...mission.approval,
    decidedAt,
    decidedBy: input.decidedBy || "Master",
    notes: input.notes || "Rejected through OpenClaw bridge.",
    status: "rejected"
  };
  mission.status = "rejected";
  mission.updatedAt = decidedAt;
  return { mission };
}

export function missionEventsForCreate(mission) {
  return [
    lifecycle("mission.started", mission, "Scroll received at Mission Board."),
    lifecycle("mission.needs_approval", mission, "Approval gate is pending.")
  ];
}

export function missionEventsForApproval(mission, receipt) {
  return [
    lifecycle("approval.approved", mission, "CEO approval gate opened."),
    lifecycle("mission.stage_changed", mission, `${receipt.agent} stub worker completed.`),
    lifecycle("mission.receipt_ready", mission, receipt.summary)
  ];
}

export function missionEventsForRejection(mission) {
  return [
    lifecycle("approval.rejected", mission, "CEO approval gate rejected."),
    lifecycle("mission.rejected", mission, mission.approval?.notes || "Mission rejected.")
  ];
}

export function lifecycle(type, mission, message) {
  return {
    id: `${mission.id}-${type}-${Date.now()}`,
    missionId: mission.id,
    message,
    payload: {
      agent: mission.agent,
      missionId: mission.id,
      missionName: mission.summary,
      status: mission.status
    },
    type,
    emittedAt: new Date().toISOString()
  };
}

function makeMissionId(date) {
  const stamp = date
    .toISOString()
    .replaceAll("-", "")
    .replaceAll(":", "")
    .replace(".", "")
    .replace("Z", "");
  missionSequence = stamp === lastMissionStamp ? missionSequence + 1 : 0;
  lastMissionStamp = stamp;
  const suffix = missionSequence ? `-${String(missionSequence).padStart(3, "0")}` : "";
  return `mission-${stamp}${suffix}`;
}

function inferMissionName(scroll) {
  return scroll.replace(/\s+/g, " ").slice(0, 80) || "Untitled dojo mission";
}

const APPROVE_RE = /^\s*\/?dojo\s+approve\s+(\S+)/i;
const REJECT_RE = /^\s*\/?dojo\s+reject\s+(\S+)/i;
const STATUS_RE = /^\s*\/?dojo\s+status\s*$/i;

export function parseOpenClawEnvelope(input = {}) {
  const text = messageText(input);
  const command = parseCommand(text, input);
  const source = sourceFrom(input, text);
  return {
    agent: input.agent === "claude" ? "claude" : "codex",
    command,
    source,
    text
  };
}

export function bridgeStatus(world) {
  const latestMission = world.missions[0] ?? null;
  return {
    latestMissionId: latestMission?.id ?? null,
    latestMissionStatus: latestMission?.status ?? "idle",
    missions: world.missions.length,
    receipts: world.receipts.length,
    version: world.version
  };
}

function parseCommand(text, input) {
  const explicitAction = String(input.action ?? input.command ?? "").toLowerCase();
  const explicitMissionId = input.missionId ?? input.mission_id;

  if (explicitAction === "approve" && explicitMissionId) {
    return { missionId: String(explicitMissionId), type: "approve" };
  }
  if (explicitAction === "reject" && explicitMissionId) {
    return { missionId: String(explicitMissionId), type: "reject" };
  }
  if (explicitAction === "status") return { type: "status" };

  const approve = text.match(APPROVE_RE);
  if (approve) return { missionId: approve[1], type: "approve" };

  const reject = text.match(REJECT_RE);
  if (reject) return { missionId: reject[1], type: "reject" };

  if (STATUS_RE.test(text)) return { type: "status" };

  return { type: "mission" };
}

function messageText(input) {
  return String(input.scroll ?? input.prompt ?? input.text ?? input.content ?? input.message ?? "").trim();
}

function sourceFrom(input, text) {
  return {
    bridge: "openclaw",
    channel: input.channel ?? input.channelId ?? input.channel_id ?? null,
    messageId: input.messageId ?? input.message_id ?? null,
    rawCommand: text || null,
    sender: input.sender ?? input.author ?? input.user ?? null,
    senderId: input.senderId ?? input.sender_id ?? input.authorId ?? input.author_id ?? null,
    surface: input.surface ?? input.provider ?? "discord"
  };
}

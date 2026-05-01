import express from "express";
import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import {
  approveMission,
  completeMissionRun,
  createMission,
  failMissionRun,
  missionEventsForApproval,
  missionEventsForCreate,
  missionEventsForFailure,
  missionEventsForReceipt,
  missionEventsForRejection,
  missionEventsForRunStart,
  rejectMission,
  startMissionRun
} from "./mission-engine.js";
import { bridgeStatus, parseOpenClawEnvelope } from "./openclaw-bridge.js";
import { readWorld, updateWorld, writeWorld } from "./store.js";
import { executeWorker } from "./workers.js";

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 3458);
const MAX_PARALLEL_RUNS = Number(process.env.DOJO_MAX_PARALLEL_RUNS || 1);

const OPENCLAW_GATEWAY = process.env.OPENCLAW_GATEWAY || "http://127.0.0.1:3457";
const OPENCLAW_STATUS_CACHE_MS = 5000;

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });
const queuedRunIds = [];
const activeRunIds = new Set();
let openClawStatusCache = null;
let processingRuns = false;

app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "ninja-dojo", version: "0.1.0" });
});

app.get("/api/world", async (_req, res, next) => {
  try {
    res.json(await readWorld());
  } catch (error) {
    next(error);
  }
});

app.get("/api/openclaw/status", async (_req, res, next) => {
  try {
    res.json(await getOpenClawStatus());
  } catch (error) {
    next(error);
  }
});

app.get("/api/runs/status", (_req, res) => {
  res.json(runStatus());
});

app.get("/api/missions", async (_req, res, next) => {
  try {
    const world = await readWorld();
    res.json({ missions: world.missions });
  } catch (error) {
    next(error);
  }
});

app.get("/api/missions/:id", async (req, res, next) => {
  try {
    const world = await readWorld();
    const mission = world.missions.find((item) => item.id === req.params.id);
    if (!mission) {
      res.status(404).json({ error: "Mission not found." });
      return;
    }
    res.json({ mission });
  } catch (error) {
    next(error);
  }
});

app.post("/api/missions", async (req, res, next) => {
  try {
    const response = await createAndPersist(req.body);
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

app.post("/api/missions/:id/approve", async (req, res, next) => {
  try {
    const response = await approveAndPersist(req.params.id, req.body);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

app.post("/api/missions/:id/reject", async (req, res, next) => {
  try {
    const response = await rejectAndPersist(req.params.id, req.body);
    res.json(response);
  } catch (error) {
    next(error);
  }
});

app.post(["/api/openclaw/messages", "/api/openclaw/bridge"], async (req, res, next) => {
  try {
    const envelope = parseOpenClawEnvelope(req.body);

    if (envelope.command.type === "status") {
      res.json({ bridge: { status: "ok", type: "status" }, runLoop: runStatus(), status: bridgeStatus(await readWorld()) });
      return;
    }

    if (envelope.command.type === "approve") {
      const response = await approveAndPersist(envelope.command.missionId, {
        decidedBy: envelope.source.sender || envelope.source.senderId || "OpenClaw",
        notes: "Approved through OpenClaw bridge."
      });
      res.json({ ...response, bridge: { status: "mission_queued", type: "approve" }, runLoop: runStatus() });
      return;
    }

    if (envelope.command.type === "reject") {
      const response = await rejectAndPersist(envelope.command.missionId, {
        decidedBy: envelope.source.sender || envelope.source.senderId || "OpenClaw",
        notes: "Rejected through OpenClaw bridge."
      });
      res.json({ ...response, bridge: { status: "mission_rejected", type: "reject" } });
      return;
    }

    const response = await createAndPersist({
      agent: envelope.agent,
      context: "Ninja Dojo v2 OpenClaw bridge mission.",
      scroll: envelope.text,
      source: envelope.source
    });
    res.status(201).json({ ...response, bridge: { status: "mission_created", type: "mission" } });
  } catch (error) {
    next(error);
  }
});

async function createAndPersist(input) {
  const mission = createMission(input);
  const events = missionEventsForCreate(mission);
  mission.events.push(...events.map((event) => event.id));
  const { world } = await updateWorld((draft) => {
    draft.missions.unshift(mission);
    draft.events.unshift(...events);
  });
  broadcastMissionState("created", mission, world.version);
  events.forEach((event) => broadcast({ ...event, worldVersion: world.version }));
  return { events, mission, worldVersion: world.version };
}

async function approveAndPersist(missionId, input) {
  let response;
  const { world } = await updateWorld((draft) => {
    const mission = draft.missions.find((item) => item.id === missionId);
    const result = approveMission(mission, input);
    const events = missionEventsForApproval(result.mission);
    result.mission.events.push(...events.map((event) => event.id));
    draft.events.unshift(...events);
    response = { ...result, events };
  });
  enqueueMissionRun(missionId);
  broadcastMissionState("queued", response.mission, world.version);
  response.events.forEach((event) => broadcast({ ...event, worldVersion: world.version }));
  return { ...response, runLoop: runStatus(), worldVersion: world.version };
}

async function rejectAndPersist(missionId, input) {
  let response;
  const { world } = await updateWorld((draft) => {
    const mission = draft.missions.find((item) => item.id === missionId);
    const result = rejectMission(mission, input);
    const events = missionEventsForRejection(result.mission);
    result.mission.events.push(...events.map((event) => event.id));
    draft.events.unshift(...events);
    response = { ...result, events };
  });
  broadcastMissionState("rejected", response.mission, world.version);
  response.events.forEach((event) => broadcast({ ...event, worldVersion: world.version }));
  return { ...response, worldVersion: world.version };
}

function enqueueMissionRun(missionId) {
  if (!queuedRunIds.includes(missionId) && !activeRunIds.has(missionId)) queuedRunIds.push(missionId);
  setTimeout(processRunQueue, 0);
}

async function processRunQueue() {
  if (processingRuns) return;
  processingRuns = true;
  try {
    while (activeRunIds.size < MAX_PARALLEL_RUNS && queuedRunIds.length) {
      const missionId = queuedRunIds.shift();
      activeRunIds.add(missionId);
      runMission(missionId).finally(() => {
        activeRunIds.delete(missionId);
        setTimeout(processRunQueue, 0);
      });
    }
  } finally {
    processingRuns = false;
  }
}

async function runMission(missionId) {
  let task;
  let startedMission;
  let startEvents = [];
  let startVersion = null;
  const started = await updateWorld((draft) => {
    const mission = draft.missions.find((item) => item.id === missionId);
    const result = startMissionRun(mission);
    if (!result.started) return false;
    startEvents = missionEventsForRunStart(result.mission);
    result.mission.events.push(...startEvents.map((event) => event.id));
    draft.events.unshift(...startEvents);
    startedMission = structuredClone(result.mission);
    task = structuredClone(result.mission.task);
    return true;
  });
  startVersion = started.world.version;
  if (!started.result) return;

  broadcastMissionState("worker_running", startedMission, startVersion);
  startEvents.forEach((event) => broadcast({ ...event, worldVersion: startVersion }));

  try {
    const receipt = await executeWorker(task);
    let response;
    let events = [];
    const { world } = await updateWorld((draft) => {
      const mission = draft.missions.find((item) => item.id === missionId);
      const result = completeMissionRun(mission, receipt);
      events = missionEventsForReceipt(result.mission, result.receipt);
      result.mission.events.push(...events.map((event) => event.id));
      draft.receipts.unshift(result.receipt);
      draft.events.unshift(...events);
      response = { ...result, events };
    });
    broadcastMissionState("receipt_ready", response.mission, world.version);
    response.events.forEach((event) => broadcast({ ...event, worldVersion: world.version }));
  } catch (error) {
    let response;
    let events = [];
    const { world } = await updateWorld((draft) => {
      const mission = draft.missions.find((item) => item.id === missionId);
      const result = failMissionRun(mission, error);
      events = missionEventsForFailure(result.mission);
      result.mission.events.push(...events.map((event) => event.id));
      draft.events.unshift(...events);
      response = { ...result, events };
    });
    broadcastMissionState("failed", response.mission, world.version);
    response.events.forEach((event) => broadcast({ ...event, worldVersion: world.version }));
  }
}

function runStatus() {
  return {
    active: [...activeRunIds],
    activeCount: activeRunIds.size,
    maxParallel: MAX_PARALLEL_RUNS,
    queued: [...queuedRunIds],
    queuedCount: queuedRunIds.length
  };
}

async function recoverInterruptedRuns() {
  const world = await readWorld();
  const interrupted = world.missions.filter((mission) => mission.status === "queued" || mission.status === "worker_running");
  if (!interrupted.length) return;

  await updateWorld((draft) => {
    const requeuedAt = new Date().toISOString();
    for (const mission of draft.missions) {
      if (mission.status !== "queued" && mission.status !== "worker_running") continue;
      mission.status = "queued";
      mission.run = {
        ...(mission.run || { id: `run-${mission.id}`, missionId: mission.id }),
        requeuedAt,
        status: "queued"
      };
      mission.updatedAt = requeuedAt;
    }
  });
  interrupted.forEach((mission) => enqueueMissionRun(mission.id));
}

app.use((error, _req, res, _next) => {
  const status = error.statusCode || 500;
  res.status(status).json({ error: error.message || "Internal server error" });
});

wss.on("connection", async (socket) => {
  socket.send(JSON.stringify({ type: "world.snapshot", payload: await readWorld() }));
  socket.send(JSON.stringify({ type: "runloop.snapshot", payload: runStatus() }));
});

function broadcastMissionState(state, mission, worldVersion) {
  broadcast({ type: `mission.${state}`, mission, runLoop: runStatus(), worldVersion });
}

function broadcast(event) {
  const data = JSON.stringify(event);
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) client.send(data);
  }
}

async function getOpenClawStatus() {
  const now = Date.now();
  if (openClawStatusCache && now - openClawStatusCache.checkedAt < OPENCLAW_STATUS_CACHE_MS) {
    return openClawStatusCache.payload;
  }

  const lastChecked = new Date(now).toISOString();
  try {
    const response = await fetch(`${OPENCLAW_GATEWAY}/health`, { signal: AbortSignal.timeout(1500) });
    const text = await response.text();
    const body = parseMaybeJson(text);
    const jobsRunning = Number(body?.jobsRunning ?? body?.jobs_running ?? body?.activeJobs ?? 0) || 0;
    const payload = {
      online: response.ok,
      jobsRunning,
      lastError: response.ok ? null : `HTTP ${response.status}`,
      lastChecked
    };
    openClawStatusCache = { checkedAt: now, payload };
    return payload;
  } catch (error) {
    const payload = {
      online: false,
      jobsRunning: 0,
      lastError: error?.message || "OpenClaw gateway unreachable",
      lastChecked
    };
    openClawStatusCache = { checkedAt: now, payload };
    return payload;
  }
}

function parseMaybeJson(text) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

await writeWorld(await readWorld());
await recoverInterruptedRuns();

server.listen(PORT, HOST, () => {
  console.log(`ninja-dojo listening on http://${HOST}:${PORT}`);
});

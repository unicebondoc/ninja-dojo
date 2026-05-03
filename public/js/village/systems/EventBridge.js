// Backend event mapping discovered from src/mission-engine.js:
// mission.started -> scroll intake animation
// mission.needs_approval -> Moji calls the approval gate
// approval.approved + mission.queued -> worker handoff toward the assigned ninja
// mission.worker_running -> assigned ninja starts working at her hut
// mission.receipt_ready -> Meowts receipt celebration
// approval.rejected + mission.rejected -> Meowts rejection reaction
const WORKER_BY_KUNOICHI = {
  moji: "codex",
  miji: "codex",
  maji: "codex",
  meji: "claude",
  muji: "codex",
  meowts: "claude"
};

const COLD_LABEL_BY_KUNOICHI = {
  moji: "Scroll desk cold",
  miji: "Forge cold",
  maji: "Dojo cold",
  meji: "Tea hearth cold",
  muji: "Launch pad cold",
  meowts: "Shrine quiet"
};

export class EventBridge {
  constructor(scene) {
    this.scene = scene;
    this.socket = null;
    this.reconnectTimer = null;
    this.kunoichiStatus = new Map();
    this.workerStatusCache = null;
    this.workerStatusAt = 0;
  }

  connect() {
    const protocol = location.protocol === "https:" ? "wss" : "ws";
    this.socket = new WebSocket(`${protocol}://${location.host}/ws`);
    this.socket.addEventListener("open", () => {
      this.scene.setBridgeStatus("connected");
      this.refreshWorkerStatus();
    });
    this.socket.addEventListener("message", (message) => this.handleMessage(message));
    this.socket.addEventListener("close", () => this.scheduleReconnect());
    this.socket.addEventListener("error", () => this.scheduleReconnect());
  }

  handleMessage(message) {
    let event;
    try {
      event = JSON.parse(message.data);
    } catch {
      return;
    }

    if (event.type === "world.snapshot") {
      this.scene.setWorldSnapshot(event.payload);
      return;
    }
    if (event.type === "runloop.snapshot") {
      this.scene.setRunLoop(event.payload);
      return;
    }
    if (event.runLoop) this.scene.setRunLoop(event.runLoop);
    if (event.worldVersion && event.worldVersion > (this.scene.world?.version || 0)) this.refreshWorld();
    this.updateKunoichiStatus(event);
    this.scene.handleLifecycleEvent(event);
  }

  async refreshWorld() {
    try {
      const response = await fetch("/api/world");
      this.scene.setWorldSnapshot(await response.json());
    } catch {
      // The animation stream still works without a fresh snapshot.
    }
  }

  async refreshWorkerStatus() {
    try {
      const response = await fetch("/api/workers/status");
      this.workerStatusCache = await response.json();
      this.workerStatusAt = Date.now();
      this.scene.setWorkerStatus(this.workerStatusCache);
    } catch {
      this.workerStatusCache = null;
      this.scene.setWorkerStatus(null);
    }
  }

  async getKunoichiStatus(kunoichiId) {
    if (!this.workerStatusCache || Date.now() - this.workerStatusAt > 5000) {
      await this.refreshWorkerStatus();
    }

    const workerName = WORKER_BY_KUNOICHI[kunoichiId];
    const worker = workerName ? this.workerStatusCache?.workers?.[workerName] : null;
    if (worker && (worker.ready === false || worker.cwdAvailable === false)) {
      const warning = worker.warning || (worker.cwdAvailable === false ? "workspace unavailable" : "worker not ready");
      return {
        label: `${COLD_LABEL_BY_KUNOICHI[kunoichiId] || "Hut quiet"}: ${shortText(cleanWarning(warning), 42)}`,
        tone: "cold"
      };
    }

    const current = this.kunoichiStatus.get(kunoichiId);
    if (current) return current;
    return { label: "Idle", tone: "idle" };
  }

  updateKunoichiStatus(event) {
    if (!event?.type) return;
    const mission = event.mission || event.payload || event;
    const assignee = this.scene.assigneeFor?.(mission) || "miji";
    const task = shortText(mission.summary || mission.title || event.message || mission.id || "mission", 34);

    if (event.type === "mission.worker_running" || event.type === "worker.started") {
      this.kunoichiStatus.set(assignee, { label: `Working: ${task}`, tone: "working" });
      return;
    }
    if (event.type === "mission.stage_changed" || event.type === "worker.handoff") {
      this.kunoichiStatus.set(assignee, { label: "Waiting on Meji", tone: "waiting" });
      return;
    }
    if (event.type === "approval.approved" || event.type === "mission.queued" || event.type === "mission.assigned") {
      this.kunoichiStatus.set(assignee, { label: `Waiting: ${task}`, tone: "waiting" });
      return;
    }
    if (event.type === "mission.receipt_ready" || event.type === "mission.completed" || event.type === "approval.rejected" || event.type === "mission.rejected") {
      this.kunoichiStatus.set(assignee, { label: "Idle", tone: "idle" });
    }
  }

  scheduleReconnect() {
    this.scene.setBridgeStatus("reconnecting");
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 1500);
  }
}

function cleanWarning(text) {
  return String(text || "")
    .replace(/^.*?CLI binary /i, "")
    .replace(/ is not executable.*$/i, " not available")
    .replace(/\s+/g, " ")
    .trim();
}

function shortText(text, max) {
  const value = String(text || "");
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

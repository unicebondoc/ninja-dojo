// Backend event mapping discovered from src/mission-engine.js:
// mission.started -> scroll intake animation
// mission.needs_approval -> Moji calls the approval gate
// approval.approved + mission.queued -> worker handoff toward the assigned ninja
// mission.worker_running -> assigned ninja starts working at her hut
// mission.receipt_ready -> Meowts receipt celebration
// approval.rejected + mission.rejected -> Meowts rejection reaction
export class EventBridge {
  constructor(scene) {
    this.scene = scene;
    this.socket = null;
    this.reconnectTimer = null;
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
      this.scene.setWorkerStatus(await response.json());
    } catch {
      this.scene.setWorkerStatus(null);
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

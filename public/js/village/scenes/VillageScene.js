import { EventBridge } from "../systems/EventBridge.js";

// PR 2.0 - Phaser scene reset for pixel pivot.
// All Ghibli composition logic was archived. PR 2.1 rebuilds this as a
// Sea of Stars-style top-down pixel dojo compound.
//
// Preserved for PR 2.2 pixel rewire - do not delete:
// - EventBridge subscription pattern
// - Kunoichi state machine class
// - Speech bubble manager
//
// Placeholder canvas: dark background + "Dojo Compound · Pixel Build · WIP" text.

export class VillageScene extends Phaser.Scene {
  constructor() {
    super("VillageScene");
    this.world = null;
    this.runLoop = { activeCount: 0, queuedCount: 0 };
    this.workerStatus = null;
    this.bridgeStatus = "connecting";
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#1a1d23");

    this.add.text(width / 2, height / 2, "Dojo Compound\nPixel Build · WIP\n\nPR 2.1 rebuilds this scene", {
      fontFamily: "monospace",
      fontSize: "24px",
      color: "#5a6075",
      align: "center",
      lineSpacing: 8
    }).setOrigin(0.5);

    this.createDebugHud();

    this.bridge = new EventBridge(this);
    this.bridge.connect();
  }

  update() {
    this.statusText?.setText(this.statusLabel());
    this.receiptText?.setText(this.receiptLabel());
  }

  createDebugHud() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("debug") !== "true") return;

    this.add.text(20, 20, "[debug mode active]", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#9caec3"
    }).setDepth(7002);

    this.add.rectangle(640, 28, 1180, 44, 0x25362f, 0.86)
      .setStrokeStyle(1, 0xf5e6be, 0.36)
      .setDepth(7000);
    this.statusText = this.add.text(72, 17, this.statusLabel(), {
      color: "#fff6dc",
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: "16px"
    }).setDepth(7001);

    this.add.rectangle(640, 684, 1060, 40, 0x3d2f29, 0.82)
      .setStrokeStyle(1, 0xf7c46f, 0.32)
      .setDepth(7000);
    this.receiptText = this.add.text(118, 673, this.receiptLabel(), {
      color: "#fff1d0",
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: "15px"
    }).setDepth(7001);
  }

  statusLabel() {
    const missions = this.world?.missions?.length || 0;
    const receipts = this.world?.receipts?.length || 0;
    const motion = this.runLoop.activeCount
      ? `${this.runLoop.activeCount} running`
      : this.runLoop.queuedCount
        ? `${this.runLoop.queuedCount} queued`
        : "quiet";
    return `Bridge ${this.bridgeStatus} | Workers ${this.workerLabel()} | ${missions} missions | ${receipts} receipts | ${motion}`;
  }

  workerLabel() {
    const codex = this.workerStatus?.workers?.codex;
    const claude = this.workerStatus?.workers?.claude;
    if (!codex || !claude) return "checking";
    return `codex ${codex.mode}${codex.available ? "" : " missing"} / claude ${claude.mode}${claude.available ? "" : " missing"}`;
  }

  receiptLabel() {
    const receipt = this.world?.receipts?.[0];
    const mission = this.world?.missions?.[0];
    if (receipt) return `Latest receipt ${receipt.agent}: ${shortText(receipt.summary || receipt.status || receipt.id, 112)}`;
    if (mission) return `Latest mission ${mission.status}: ${shortText(mission.summary || mission.id, 112)}`;
    return "Mission board idle";
  }

  setWorldSnapshot(world) {
    this.world = world;
  }

  setRunLoop(runLoop) {
    this.runLoop = runLoop || this.runLoop;
  }

  setWorkerStatus(status) {
    this.workerStatus = status;
  }

  setBridgeStatus(status) {
    this.bridgeStatus = status;
  }

  handleLifecycleEvent() {
    // PR 2.0 placeholder intentionally ignores in-world animation events.
    // PR 2.2 rewires these events to pixel sprites.
  }
}

function shortText(text, max) {
  const value = String(text || "");
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

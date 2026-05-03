import { Kunoichi } from "../entities/Kunoichi.js";
import { Tyche } from "../entities/Tyche.js";
import { dropScroll } from "../entities/Scroll.js";
import { KUNOICHI } from "../data/kunoichi-config.js";
import { BUILDINGS, PLAZA, isoToScreen } from "../data/village-layout.js";
import { DialogueSystem } from "../systems/DialogueSystem.js";
import { EventBridge } from "../systems/EventBridge.js";
import { PathfindingGrid } from "../systems/PathfindingGrid.js";

export class VillageScene extends Phaser.Scene {
  constructor() {
    super("VillageScene");
    this.kunoichi = new Map();
    this.world = null;
    this.runLoop = { activeCount: 0, queuedCount: 0 };
    this.workerStatus = null;
    this.bridgeStatus = "connecting";
    this.parallaxLayers = [];
    this.buildingRecords = new Map();
    this.activeInterior = null;
  }

  create() {
    this.pathfinder = new PathfindingGrid();
    this.dialogue = new DialogueSystem(this);
    this.drawWorld();
    this.createBuildings();
    this.createCharacters();
    this.createHud();
    this.createInteriorControls();
    this.bridge = new EventBridge(this);
    this.bridge.connect();
    this.startTycheLoop();
  }

  update() {
    this.dialogue.update();
    this.statusText?.setText(this.statusLabel());
    this.receiptText?.setText(this.receiptLabel());
    this.updateParallaxLayers();
    this.updateInteriorStatusPosition();
  }

  drawWorld() {
    this.createParallaxBackground();
    this.add.image(118, 92, "moon_eternal").setDisplaySize(110, 110).setDepth(-90).setAlpha(0.92);
    this.add.image(1166, 98, "moon_earned").setDisplaySize(96, 96).setDepth(-90).setAlpha(0.9);

    this.add.image(640, 360, "ground_map").setDepth(-80);

    for (let i = 0; i < 18; i += 1) this.drawTree(i);
    for (const tile of [{ x: 7, y: 5 }, { x: 11, y: 5 }, { x: 7, y: 7 }, { x: 11, y: 7 }]) this.drawLantern(tile);
    this.createMapProps();
    this.createPetalDrift();
  }

  createParallaxBackground() {
    this.parallaxLayers = [
      { image: this.add.tileSprite(640, 360, 1280, 720, "bg_sky").setDepth(-130), factor: 0 },
      { image: this.add.tileSprite(640, 250, 1280, 400, "bg_mountains").setDepth(-120).setAlpha(0.78), factor: 0.1 },
      { image: this.add.tileSprite(640, 330, 1280, 310, "bg_forest").setDepth(-110).setAlpha(0.72), factor: 0.3 },
      { image: this.add.tileSprite(640, 645, 1280, 150, "bg_foreground").setDepth(5200).setAlpha(0.86), factor: 0.6 }
    ];
    for (const layer of this.parallaxLayers) layer.image.setScrollFactor(0);
  }

  updateParallaxLayers() {
    const time = this.time.now || 0;
    for (const layer of this.parallaxLayers) {
      layer.image.tilePositionX = time * 0.0025 * layer.factor;
    }
  }

  createPetalDrift() {
    this.petals = this.add.particles(0, 0, "petal", {
      x: { min: -80, max: 1360 },
      y: -20,
      lifespan: { min: 9000, max: 15000 },
      speedX: { min: -18, max: 34 },
      speedY: { min: 18, max: 48 },
      scale: { min: 0.35, max: 0.82 },
      alpha: { start: 0.8, end: 0 },
      rotate: { min: -180, max: 180 },
      frequency: 380,
      quantity: 1,
      blendMode: "NORMAL"
    }).setDepth(5600);
  }

  drawTree(index) {
    const edgeTiles = [
      { x: 2 + (index % 7) * 2, y: 0 },
      { x: 2 + (index % 7) * 2, y: 12 },
      { x: 0, y: 1 + (index % 5) * 2 },
      { x: 17, y: 1 + (index % 5) * 2 }
    ];
    const tile = edgeTiles[index % edgeTiles.length];
    const point = isoToScreen(tile);
    const tree = this.add.image(point.x, point.y + 10, `cherry_${(index % 4) + 1}`)
      .setOrigin(0.5, 0.9)
      .setScale(0.42 + (index % 3) * 0.025)
      .setDepth(point.y + 12);
    this.tweens.add({ targets: tree, x: point.x + Phaser.Math.Between(-2, 2), duration: 2600, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
  }

  drawLantern(tile) {
    const point = isoToScreen(tile);
    this.add.image(point.x, point.y + 2, "stone_lantern").setOrigin(0.5, 0.84).setScale(0.24).setDepth(point.y + 20);
    const glow = this.add.circle(point.x, point.y - 22, 11, 0xffc66c, 0.42).setDepth(point.y + 21);
    this.tweens.add({ targets: glow, alpha: 0.9, scale: 1.18, duration: 1500, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
  }

  createMapProps() {
    const props = [
      { key: "flower_bed", tile: { x: 4, y: 4 }, scale: 0.24 },
      { key: "flower_bed", tile: { x: 12, y: 6 }, scale: 0.22 },
      { key: "wildflowers", tile: { x: 14, y: 10 }, scale: 0.22 },
      { key: "wildflowers", tile: { x: 3, y: 9 }, scale: 0.2 },
      { key: "signpost", tile: { x: 8, y: 11 }, scale: 0.24 },
      { key: "lily_pond", tile: { x: 3, y: 7 }, scale: 0.28 }
    ];
    for (const prop of props) {
      const point = isoToScreen(prop.tile);
      this.add.image(point.x, point.y + 8, prop.key)
        .setOrigin(0.5, 0.82)
        .setScale(prop.scale)
        .setDepth(point.y + 18);
    }
  }

  createBuildings() {
    for (const building of BUILDINGS) {
      const point = isoToScreen(building.tile);
      const interior = this.add.image(point.x, point.y + 8, `${building.id}_interior`)
        .setScale(building.scale)
        .setOrigin(0.5, 0.82)
        .setDepth(point.y + 30)
        .setAlpha(0)
        .setVisible(false);
      const glow = this.add.ellipse(point.x, point.y + 12, 210, 120)
        .setStrokeStyle(3, 0xfff0a8, 0.9)
        .setDepth(point.y + 34)
        .setAlpha(0);
      const image = this.add.image(point.x, point.y + 10, "buildings")
        .setCrop(building.frame.x, building.frame.y, building.frame.w, building.frame.h)
        .setScale(building.scale)
        .setOrigin(0.5, 0.82)
        .setDepth(point.y + 35);
      const zone = this.add.zone(point.x, point.y + 10, building.frame.w * building.scale, building.frame.h * building.scale)
        .setOrigin(0.5, 0.82)
        .setDepth(point.y + 70)
        .setInteractive({ useHandCursor: true });
      const record = { id: building.id, building, point, interior, glow, image, zone };
      zone.on("pointerover", () => this.setBuildingHover(record, true));
      zone.on("pointerout", () => this.setBuildingHover(record, false));
      zone.on("pointerdown", () => this.openInterior(building.id));
      this.buildingRecords.set(building.id, record);
    }
  }

  createCharacters() {
    for (const config of KUNOICHI) {
      const entity = new Kunoichi(this, config, this.pathfinder, this.dialogue);
      this.kunoichi.set(config.id, entity);
    }
    this.tyche = new Tyche(this, this.pathfinder);
  }

  createHud() {
    const params = new URLSearchParams(window.location.search);
    const debugMode = params.get("debug") === "true";
    if (!debugMode) return;

    this.add.rectangle(640, 28, 1180, 44, 0x25362f, 0.86).setStrokeStyle(1, 0xf5e6be, 0.36).setDepth(7000);
    this.statusText = this.add.text(72, 17, this.statusLabel(), {
      color: "#fff6dc",
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: "16px"
    }).setDepth(7001);

    this.add.rectangle(640, 684, 1060, 40, 0x3d2f29, 0.82).setStrokeStyle(1, 0xf7c46f, 0.32).setDepth(7000);
    this.receiptText = this.add.text(118, 673, this.receiptLabel(), {
      color: "#fff1d0",
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: "15px"
    }).setDepth(7001);
  }

  createInteriorControls() {
    const bg = this.add.circle(0, 0, 17, 0x312b25, 0.86).setStrokeStyle(1, 0xfff0c0, 0.5);
    const label = this.add.text(0, -1, "x", {
      color: "#fff6dc",
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: "18px",
      fontStyle: "bold"
    }).setOrigin(0.5);
    this.closeButton = this.add.container(1238, 30, [bg, label])
      .setScrollFactor(0)
      .setDepth(8600)
      .setVisible(false)
      .setSize(34, 34)
      .setInteractive(new Phaser.Geom.Circle(0, 0, 17), Phaser.Geom.Circle.Contains);
    this.closeButton.on("pointerdown", () => this.closeInterior());

    this.interiorStatusBg = this.add.graphics();
    this.interiorStatusText = this.add.text(0, 0, "", {
      color: "#fffaf0",
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: "14px",
      align: "center"
    }).setOrigin(0.5);
    this.interiorStatus = this.add.container(0, 0, [this.interiorStatusBg, this.interiorStatusText])
      .setDepth(8500)
      .setVisible(false);

    this.input.on("pointerdown", (_pointer, objects) => {
      if (this.activeInterior && objects.length === 0) this.closeInterior();
    });
    this.input.keyboard?.on("keydown-ESC", () => this.closeInterior());
  }

  setBuildingHover(record, active) {
    if (this.activeInterior === record) return;
    this.tweens.add({
      targets: record.image,
      alpha: active ? 0.5 : 1,
      duration: 200,
      ease: "Sine.easeOut"
    });
    this.tweens.add({
      targets: record.glow,
      alpha: active ? 0.75 : 0,
      duration: 200,
      ease: "Sine.easeOut"
    });
  }

  async openInterior(id) {
    const record = this.buildingRecords.get(id);
    if (!record) return;
    if (this.activeInterior && this.activeInterior !== record) this.closeInterior(false);
    this.activeInterior = record;

    record.interior.setVisible(true);
    this.tweens.add({ targets: record.image, alpha: 0.2, duration: 260, ease: "Sine.easeOut" });
    this.tweens.add({ targets: record.interior, alpha: 1, duration: 260, ease: "Sine.easeOut" });
    this.tweens.add({ targets: record.glow, alpha: 0.9, duration: 220, ease: "Sine.easeOut" });
    this.closeButton.setVisible(true);
    this.cameras.main.pan(record.point.x, record.point.y, 1500, "Sine.easeInOut");
    this.cameras.main.zoomTo(2, 1500, "Sine.easeInOut");

    const status = await (this.bridge?.getKunoichiStatus(id) || Promise.resolve({ label: "Idle", tone: "idle" }));
    if (this.activeInterior !== record) return;
    const ninja = this.kunoichi.get(id);
    ninja?.startWorkAnimation();
    this.showInteriorStatus(ninja?.sprite || record.image, status);
  }

  closeInterior(resetCamera = true) {
    const record = this.activeInterior;
    if (!record) return;
    this.activeInterior = null;
    this.tweens.add({ targets: record.image, alpha: 1, duration: 240, ease: "Sine.easeOut" });
    this.tweens.add({
      targets: record.interior,
      alpha: 0,
      duration: 180,
      ease: "Sine.easeOut",
      onComplete: () => record.interior.setVisible(false)
    });
    this.tweens.add({ targets: record.glow, alpha: 0, duration: 180, ease: "Sine.easeOut" });
    this.closeButton.setVisible(false);
    this.interiorStatus.setVisible(false);
    this.kunoichi.get(record.id)?.play("idle");
    if (resetCamera) {
      this.cameras.main.pan(640, 360, 1500, "Sine.easeInOut");
      this.cameras.main.zoomTo(1, 1500, "Sine.easeInOut");
    }
  }

  showInteriorStatus(target, status) {
    const label = shortText(status?.label || "Idle", 52);
    const colors = { working: 0x3e8f6a, idle: 0x626a68, waiting: 0xb78437, cold: 0x9c403a };
    const width = Math.max(132, Math.min(360, label.length * 7.4 + 30));
    this.interiorStatusBg.clear();
    this.interiorStatusBg.fillStyle(colors[status?.tone] || colors.idle, 0.94);
    this.interiorStatusBg.lineStyle(1, 0xfff3d2, 0.55);
    this.interiorStatusBg.fillRoundedRect(-width / 2, -18, width, 36, 10);
    this.interiorStatusBg.strokeRoundedRect(-width / 2, -18, width, 36, 10);
    this.interiorStatusText.setText(label);
    this.interiorStatus.followTarget = target;
    this.interiorStatus.setVisible(true);
    this.updateInteriorStatusPosition();
  }

  updateInteriorStatusPosition() {
    const target = this.interiorStatus?.followTarget;
    if (!this.interiorStatus?.visible || !target?.active) return;
    this.interiorStatus.setPosition(target.x, target.y - target.displayHeight - 46);
  }

  statusLabel() {
    const missions = this.world?.missions?.length || 0;
    const receipts = this.world?.receipts?.length || 0;
    const motion = this.runLoop.activeCount ? `${this.runLoop.activeCount} running` : this.runLoop.queuedCount ? `${this.runLoop.queuedCount} queued` : "quiet";
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

  handleLifecycleEvent(event) {
    if (!event?.type) return;
    const mission = event.mission || this.findMission(event.missionId || event.payload?.missionId);
    const assignee = this.assigneeFor(mission || event);

    if (event.type === "mission.started" || event.type === "mission.created") {
      dropScroll(this, { x: 5, y: 4 }, () => this.kunoichi.get("moji")?.speak("New scroll", 2200));
      return;
    }
    if (event.type === "mission.needs_approval") {
      this.kunoichi.get("moji")?.speak("Awaiting approval", 2600);
      return;
    }
    if (event.type === "approval.approved" || event.type === "mission.queued" || event.type === "mission.assigned") {
      const moji = this.kunoichi.get("moji");
      const target = this.kunoichi.get(assignee);
      if (!moji || !target) return;
      moji.walkTo(target.config.work).then(() => moji.speak(`${target.config.name}, new mission`, 3000));
      return;
    }
    if (event.type === "mission.worker_running" || event.type === "worker.started") {
      const target = this.kunoichi.get(assignee);
      target?.walkTo(target.config.work).then(() => target.work("Working..."));
      return;
    }
    if (event.type === "mission.stage_changed" || event.type === "worker.handoff") {
      const source = this.kunoichi.get(assignee);
      const target = this.kunoichi.get("meji");
      source?.walkTo(target.config.work).then(() => source.speak(shortText(event.message || "Handoff ready"), 3200));
      return;
    }
    if (event.type === "mission.receipt_ready" || event.type === "mission.completed" || event.type === "worker.deployed") {
      const meowts = this.kunoichi.get("meowts");
      meowts?.walkTo(PLAZA).then(() => {
        this.receiptGlow(meowts.sprite);
        meowts.speak("Approved OK", 5000);
      });
      if (event.type === "worker.deployed") this.fireworks();
      return;
    }
    if (event.type === "approval.rejected" || event.type === "mission.rejected") {
      const meowts = this.kunoichi.get("meowts");
      meowts?.walkTo(PLAZA).then(() => {
        this.redX(meowts.sprite.x, meowts.sprite.y - 92);
        meowts.speak("Rejected", 3600);
      });
      return;
    }
    if (event.type === "butler.checkin") this.pulsePlaza();
  }

  findMission(id) {
    return this.world?.missions?.find((mission) => mission.id === id) || null;
  }

  assigneeFor(mission) {
    const agent = mission?.agent || mission?.payload?.agent;
    if (agent === "claude") return "meji";
    return "miji";
  }

  startTycheLoop() {
    const schedule = () => {
      this.time.delayedCall(Phaser.Math.Between(8000, 15000), async () => {
        const workers = [...this.kunoichi.values()].filter((entity) => entity.state === "working");
        const target = workers.length ? Phaser.Utils.Array.GetRandom(workers) : Phaser.Utils.Array.GetRandom([...this.kunoichi.values()]);
        await this.tyche.visit(target.tile);
        target.react("Tyche...");
        schedule();
      });
    };
    this.time.addEvent({ delay: 5200, loop: true, callback: () => this.tyche.wander() });
    schedule();
  }

  receiptGlow(target) {
    const glow = this.add.circle(target.x, target.y - 110, 20, 0xffdf72, 0.85).setDepth(6100);
    const paper = this.add.rectangle(target.x, target.y - 110, 24, 30, 0xfff6d8).setDepth(6101).setAngle(-6);
    this.tweens.add({ targets: [glow, paper], y: "-=18", alpha: 0, duration: 5000, ease: "Sine.easeOut", onComplete: () => { glow.destroy(); paper.destroy(); } });
  }

  fireworks() {
    for (let i = 0; i < 18; i += 1) {
      const dot = this.add.circle(isoToScreen(PLAZA).x, isoToScreen(PLAZA).y - 120, 4, Phaser.Display.Color.RandomRGB(180, 255).color, 0.9).setDepth(6500);
      this.tweens.add({ targets: dot, x: dot.x + Phaser.Math.Between(-90, 90), y: dot.y + Phaser.Math.Between(-90, 30), alpha: 0, duration: 1400, ease: "Cubic.easeOut", onComplete: () => dot.destroy() });
    }
  }

  redX(x, y) {
    const mark = this.add.text(x, y, "X", { color: "#b93a32", fontFamily: "Georgia, serif", fontSize: "48px", fontStyle: "bold" }).setOrigin(0.5).setDepth(6500);
    this.tweens.add({ targets: mark, scale: 1.5, alpha: 0, duration: 1600, ease: "Sine.easeOut", onComplete: () => mark.destroy() });
  }

  pulsePlaza() {
    const point = isoToScreen(PLAZA);
    const pulse = this.add.circle(point.x, point.y, 36, 0xffc66c, 0.36).setDepth(1200);
    this.tweens.add({ targets: pulse, scale: 3, alpha: 0, duration: 2000, ease: "Sine.easeOut", onComplete: () => pulse.destroy() });
  }
}

function shortText(text, max = 60) {
  const value = String(text || "");
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

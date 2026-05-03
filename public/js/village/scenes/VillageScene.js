import { Kunoichi } from "../entities/Kunoichi.js";
import { Tyche } from "../entities/Tyche.js";
import { dropScroll } from "../entities/Scroll.js";
import { KUNOICHI } from "../data/kunoichi-config.js";
import { BUILDINGS, GRID, PATHS, PLAZA, TILE, isoToScreen } from "../data/village-layout.js";
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
  }

  create() {
    this.pathfinder = new PathfindingGrid();
    this.dialogue = new DialogueSystem(this);
    this.drawWorld();
    this.createBuildings();
    this.createCharacters();
    this.createHud();
    this.bridge = new EventBridge(this);
    this.bridge.connect();
    this.startTycheLoop();
  }

  update() {
    this.dialogue.update();
    this.statusText?.setText(this.statusLabel());
    this.receiptText?.setText(this.receiptLabel());
    this.updateParallaxLayers();
  }

  drawWorld() {
    this.createParallaxBackground();
    this.add.circle(118, 92, 36, 0xf7efd5, 0.88).setDepth(-90);
    this.add.circle(1166, 98, 30, 0xf7d66b, 0.82).setDepth(-90);

    const ground = this.add.graphics().setDepth(-80);
    for (let y = 0; y < GRID.height; y += 1) {
      for (let x = 0; x < GRID.width; x += 1) {
        const point = isoToScreen({ x, y });
        const tone = (x + y) % 2 ? 0x9fcf9c : 0xaed8a5;
        drawDiamond(ground, point.x, point.y, TILE.width, TILE.height, tone, 0x7fb27c, 0.94);
      }
    }

    const paths = this.add.graphics().setDepth(-70);
    for (const [from, to] of PATHS) drawPath(paths, from, to);
    drawDiamond(paths, isoToScreen(PLAZA).x, isoToScreen(PLAZA).y, 190, 96, 0xd8c29a, 0xa9895d, 0.98);

    for (let i = 0; i < 22; i += 1) this.drawTree(i);
    for (const tile of [{ x: 7, y: 5 }, { x: 11, y: 5 }, { x: 7, y: 7 }, { x: 11, y: 7 }]) this.drawLantern(tile);
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
      { x: index % 18, y: 0 },
      { x: index % 18, y: 12 },
      { x: 0, y: index % 13 },
      { x: 17, y: index % 13 }
    ];
    const tile = edgeTiles[index % edgeTiles.length];
    const point = isoToScreen(tile);
    const trunk = this.add.rectangle(point.x, point.y - 18, 8, 36, 0x7d6044).setDepth(point.y - 20);
    const bloom = this.add.circle(point.x, point.y - 46, 26, 0xf3b6c8, 0.88).setDepth(point.y - 18);
    this.tweens.add({ targets: [trunk, bloom], x: point.x + Phaser.Math.Between(-3, 3), duration: 2200, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
  }

  drawLantern(tile) {
    const point = isoToScreen(tile);
    this.add.rectangle(point.x, point.y - 18, 8, 36, 0x654a35).setDepth(point.y + 20);
    const glow = this.add.circle(point.x, point.y - 42, 12, 0xffc66c, 0.5).setDepth(point.y + 21);
    this.tweens.add({ targets: glow, alpha: 0.9, scale: 1.18, duration: 1500, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
  }

  createBuildings() {
    for (const building of BUILDINGS) {
      const point = isoToScreen(building.tile);
      const image = this.add.image(point.x, point.y + 10, "buildings")
        .setCrop(building.frame.x, building.frame.y, building.frame.w, building.frame.h)
        .setScale(building.scale)
        .setOrigin(0.5, 0.82)
        .setDepth(point.y + 35);
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

function drawDiamond(graphics, x, y, width, height, fill, stroke, alpha = 1) {
  graphics.fillStyle(fill, alpha);
  graphics.lineStyle(1, stroke, 0.25);
  graphics.beginPath();
  graphics.moveTo(x, y - height / 2);
  graphics.lineTo(x + width / 2, y);
  graphics.lineTo(x, y + height / 2);
  graphics.lineTo(x - width / 2, y);
  graphics.closePath();
  graphics.fillPath();
  graphics.strokePath();
}

function drawPath(graphics, from, to) {
  const start = isoToScreen(from);
  const end = isoToScreen(to);
  graphics.lineStyle(24, 0xd8c29a, 0.86);
  graphics.beginPath();
  graphics.moveTo(start.x, start.y);
  graphics.lineTo(end.x, end.y);
  graphics.strokePath();
  graphics.lineStyle(2, 0xa9895d, 0.28);
  graphics.strokePath();
}

function shortText(text) {
  return text.length > 60 ? `${text.slice(0, 57)}...` : text;
}

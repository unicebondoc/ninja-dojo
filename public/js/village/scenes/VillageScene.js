import { EventBridge } from "../systems/EventBridge.js";
import { Kunoichi } from "../entities/Kunoichi.js";
import { Tyche } from "../entities/Tyche.js";

const WIDTH = 1280;
const HEIGHT = 720;
const TILE = 16;
const SKY_HEIGHT = 80;
const HUTS = [
  { id: "moji", key: "dojo_hut_moji_scroll_hut", x: 300, y: 190 },
  { id: "miji", key: "dojo_hut_miji_forge", x: 980, y: 190 },
  { id: "meji", key: "dojo_hut_meji_tea_house", x: 260, y: 390 },
  { id: "maji", key: "dojo_hut_maji_dojo", x: 1020, y: 390 },
  { id: "muji", key: "dojo_hut_muji_launch_pad", x: 380, y: 570 },
  { id: "meowts", key: "dojo_hut_meowts_shrine", x: 900, y: 570 }
];
const PLAZA = { x: 640, y: 360, w: 184, h: 128 };
const WORKER_TO_KUNOICHI = { codex: "miji", claude: "meji" };
const KUNOICHI_NAMES = {
  moji: "Moji",
  miji: "Miji",
  maji: "Maji",
  meji: "Meji",
  muji: "Muji",
  meowts: "Meowts"
};
const STATUS_COLORS = {
  working: 0x3e8f6a,
  idle: 0x626a68,
  waiting: 0xb78437,
  cold: 0x9c403a
};

export class VillageScene extends Phaser.Scene {
  constructor() {
    super("VillageScene");
    this.world = null;
    this.runLoop = { activeCount: 0, queuedCount: 0 };
    this.workerStatus = null;
    this.bridgeStatus = "connecting";
    this.huts = new Map();
    this.kunoichi = new Map();
    this.statusBanners = new Map();
    this.speechBubbles = new Set();
    this.activeInterior = null;
    this.closeButton = null;
  }

  create() {
    window.dojoScene = this;
    this.cameras.main.setBackgroundColor("#1a1d23");
    this.cameras.main.setBounds(0, 0, WIDTH, HEIGHT);
    this.cameras.main.setScroll(0, 0);
    this.drawStaticCompound();
    this.createCharacters();
    this.createInteriorControls();
    this.createDebugHud();
    this.bridge = new EventBridge(this);
    this.bridge.connect();
    this.startAmbientLoops();
    this.time.delayedCall(900, () => this.refreshStatusBanners());
    this.time.addEvent({ delay: 5000, loop: true, callback: () => this.refreshStatusBanners() });
  }

  update() {
    this.statusText?.setText(this.statusLabel());
    this.receiptText?.setText(this.receiptLabel());
    this.updateSpeechBubbles();
    this.updateStatusBannerPositions();
  }

  drawStaticCompound() {
    this.add.image(WIDTH / 2, SKY_HEIGHT / 2, "dojo_sky_strip").setDisplaySize(WIDTH, SKY_HEIGHT).setDepth(-50);
    this.add.image(92, 40, "dojo_moon_eternal").setScale(1.15).setDepth(-45);
    this.add.image(1188, 42, "dojo_moon_earned").setScale(1.05).setDepth(-45);

    this.drawGround();
    this.drawFence();
    this.drawPaths();
    this.drawPlaza();
    this.drawProps();
    this.drawHuts();
  }

  drawGround() {
    for (let y = SKY_HEIGHT; y < HEIGHT; y += TILE) {
      for (let x = 0; x < WIDTH; x += TILE) {
        const roll = Math.abs((x / TILE * 17 + y / TILE * 11) % 9);
        const key = roll === 0 ? "dojo_tile_grass_b" : roll === 1 ? "dojo_tile_grass_c" : "dojo_tile_grass_a";
        this.add.image(x + TILE / 2, y + TILE / 2, key).setDepth(-40);
      }
    }
  }

  drawFence() {
    for (let x = 64; x <= WIDTH - 64; x += 32) {
      this.add.image(x, SKY_HEIGHT + 22, "dojo_prop_fence_segment").setDepth(-8);
      this.add.image(x, HEIGHT - 18, "dojo_prop_fence_segment").setDepth(30);
    }
    for (let y = SKY_HEIGHT + 64; y <= HEIGHT - 64; y += 32) {
      this.add.image(38, y, "dojo_prop_fence_segment").setAngle(90).setDepth(y);
      this.add.image(WIDTH - 38, y, "dojo_prop_fence_segment").setAngle(90).setDepth(y);
    }
  }

  drawPaths() {
    for (const hut of HUTS) {
      this.drawPath(hut.x, hut.y + 76, PLAZA.x, PLAZA.y);
    }
    this.drawPath(PLAZA.x, PLAZA.y + PLAZA.h / 2, PLAZA.x, HEIGHT - 56);
  }

  drawPath(x1, y1, x2, y2) {
    const midY = y2;
    this.drawPathLine(x1, y1, x1, midY);
    this.drawPathLine(x1, midY, x2, midY);
  }

  drawPathLine(x1, y1, x2, y2) {
    const dx = Math.sign(x2 - x1);
    const dy = Math.sign(y2 - y1);
    const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) / TILE;
    for (let i = 0; i <= steps; i += 1) {
      const x = Math.round((x1 + dx * i * TILE) / TILE) * TILE + TILE / 2;
      const y = Math.round((y1 + dy * i * TILE) / TILE) * TILE + TILE / 2;
      this.add.image(x, y, "dojo_tile_path_stone").setDepth(-20);
    }
  }

  drawPlaza() {
    for (let y = PLAZA.y - PLAZA.h / 2; y <= PLAZA.y + PLAZA.h / 2; y += TILE) {
      for (let x = PLAZA.x - PLAZA.w / 2; x <= PLAZA.x + PLAZA.w / 2; x += TILE) {
        this.add.image(x, y, "dojo_tile_plaza_center").setDepth(-18);
      }
    }
    const rim = this.add.rectangle(PLAZA.x, PLAZA.y, PLAZA.w + 20, PLAZA.h + 18)
      .setStrokeStyle(2, 0x3f4f37, 0.55)
      .setDepth(-17);
    rim.isDojoPlaza = true;
    this.add.image(PLAZA.x, PLAZA.y - 10, "dojo_prop_lantern_stone").setScale(1.3).setDepth(PLAZA.y);
  }

  drawProps() {
    const trees = [
      [112, 140, "tree_cherry_a"], [1168, 140, "tree_cherry_b"],
      [100, 610, "tree_cherry_b"], [1178, 612, "tree_cherry_a"],
      [490, 126, "tree_cherry_a"], [790, 128, "tree_cherry_b"]
    ];
    for (const [x, y, key] of trees) this.add.image(x, y, `dojo_prop_${key}`).setScale(1.7).setDepth(y);

    const props = [
      [520, 306, "lantern_stone", 1.1], [760, 306, "lantern_stone", 1.1],
      [518, 432, "lantern_stone", 1.1], [762, 432, "lantern_stone", 1.1],
      [628, 506, "sign_post", 1.25], [180, 260, "flower_bed", 1.35],
      [1090, 528, "flower_bed", 1.35], [168, 504, "rock_a", 1.1],
      [1110, 276, "rock_a", 1.1], [650, 596, "lantern_paper", 1.1]
    ];
    for (const [x, y, key, scale] of props) this.add.image(x, y, `dojo_prop_${key}`).setScale(scale).setDepth(y);
  }

  drawHuts() {
    for (const hut of HUTS) {
      const shadow = this.add.ellipse(hut.x, hut.y + 46, 168, 54, 0x0e1418, 0.22).setDepth(hut.y - 2);
      const interior = this.add.image(hut.x, hut.y + 2, `dojo_interior_${hut.id}`)
        .setDepth(hut.y - 1)
        .setAlpha(0)
        .setVisible(false);
      const glow = this.add.rectangle(hut.x, hut.y + 4, 182, 164, 0xfff0ae, 0)
        .setStrokeStyle(2, 0xfff0ae, 0)
        .setDepth(hut.y + 3);
      const sprite = this.add.image(hut.x, hut.y, hut.key).setDepth(hut.y).setScale(1);
      const zone = this.add.zone(hut.x, hut.y + 8, 176, 158)
        .setInteractive({ useHandCursor: true })
        .setDepth(hut.y + 160);
      const record = {
        ...hut,
        baseX: hut.x,
        baseY: hut.y,
        workPoint: { x: hut.x, y: hut.y + 34 },
        sprite,
        shadow,
        interior,
        glow,
        zone,
        savedState: null
      };
      zone.on("pointerover", () => this.hoverHut(record, true));
      zone.on("pointerout", () => this.hoverHut(record, false));
      zone.on("pointerdown", (pointer) => {
        pointer.event?.stopPropagation?.();
        this.openInterior(record.id);
      });
      this.huts.set(hut.id, record);
    }
  }

  createInteriorControls() {
    const bg = this.add.rectangle(0, 0, 26, 26, 0x171b20, 0.9)
      .setStrokeStyle(1, 0xfff0ae, 0.82);
    const glyph = this.add.text(0, -1, "x", {
      color: "#fff3c8",
      fontFamily: "monospace",
      fontSize: "18px",
      align: "center"
    }).setOrigin(0.5);
    this.closeButton = this.add.container(0, 0, [bg, glyph])
      .setSize(26, 26)
      .setDepth(7200)
      .setVisible(false)
      .setInteractive({ useHandCursor: true });
    this.closeButton.on("pointerdown", (pointer) => {
      pointer.event?.stopPropagation?.();
      this.closeInterior();
    });
    this.input.keyboard?.on("keydown-ESC", () => this.closeInterior());
    this.input.on("pointerdown", (_pointer, gameObjects) => {
      if (this.activeInterior && (!gameObjects || gameObjects.length === 0)) this.closeInterior();
    });
  }

  hoverHut(record, active) {
    if (!record || this.activeInterior?.id === record.id) return;
    this.tweens.killTweensOf([record.sprite, record.glow]);
    this.tweens.add({
      targets: record.sprite,
      alpha: active ? 0.5 : 1,
      duration: 200,
      ease: "Sine.easeOut"
    });
    this.tweens.add({
      targets: record.glow,
      alpha: active ? 0.78 : 0,
      duration: 200,
      ease: "Sine.easeOut",
      onUpdate: () => record.glow.setStrokeStyle(2, 0xfff0ae, active ? record.glow.alpha : 0),
      onComplete: () => record.glow.setStrokeStyle(2, 0xfff0ae, active ? 0.78 : 0)
    });
  }

  async openInterior(id) {
    const record = this.huts.get(id);
    if (!record) return;
    if (this.activeInterior?.id === id) return;
    if (this.activeInterior) this.closeInterior(true);

    const entity = this.kunoichi.get(id);
    record.savedState = {
      state: entity?.state || "idle",
      anim: entity?.sprite?.anims?.currentAnim?.key || null
    };
    this.activeInterior = record;
    this.tweens.killTweensOf([record.sprite, record.interior, record.glow]);
    record.interior.setVisible(true).setAlpha(0);
    record.glow.setAlpha(0.88).setStrokeStyle(2, 0xfff0ae, 0.88);
    record.zone.disableInteractive();

    this.tweens.add({
      targets: record.interior,
      alpha: 1,
      duration: 220,
      ease: "Sine.easeOut"
    });
    this.tweens.add({
      targets: record.sprite,
      y: record.baseY - 32,
      alpha: 0.2,
      duration: 300,
      ease: "Sine.easeOut"
    });
    this.emitRoofDust(record);

    if (entity) {
      this.tweens.killTweensOf(entity.sprite);
      entity.walkTo(record.workPoint, 360).then(() => {
        if (this.activeInterior?.id === id) entity.startWorkAnimation();
      });
      const status = await (this.bridge?.getKunoichiStatus(id) || Promise.resolve({ label: "Idle", tone: "idle" }));
      this.updateStatusBanner(id, status);
    }

    this.closeButton
      ?.setPosition(record.baseX + 72, record.baseY - 74)
      .setVisible(true)
      .setDepth(record.baseY + 185);
  }

  closeInterior(skipTween = false) {
    const record = this.activeInterior;
    if (!record) return;
    const entity = this.kunoichi.get(record.id);
    const duration = skipTween ? 0 : 300;
    this.activeInterior = null;
    this.tweens.killTweensOf([record.sprite, record.interior, record.glow]);
    record.zone.setInteractive({ useHandCursor: true });
    this.closeButton?.setVisible(false);

    this.tweens.add({
      targets: record.sprite,
      y: record.baseY,
      alpha: 1,
      duration,
      ease: "Sine.easeIn"
    });
    this.tweens.add({
      targets: record.interior,
      alpha: 0,
      duration,
      ease: "Sine.easeIn",
      onComplete: () => record.interior.setVisible(false)
    });
    this.tweens.add({
      targets: record.glow,
      alpha: 0,
      duration,
      ease: "Sine.easeIn",
      onUpdate: () => record.glow.setStrokeStyle(2, 0xfff0ae, record.glow.alpha),
      onComplete: () => record.glow.setStrokeStyle(2, 0xfff0ae, 0)
    });

    if (entity) {
      this.tweens.killTweensOf(entity.sprite);
      if (record.savedState?.state === "working" || record.savedState?.anim?.endsWith(":work")) {
        entity.startWorkAnimation();
      } else {
        entity.idle();
      }
    }
    record.savedState = null;
  }

  emitRoofDust(record) {
    for (let i = 0; i < 9; i += 1) {
      const dust = this.add.rectangle(
        record.baseX + Phaser.Math.Between(-62, 62),
        record.baseY + Phaser.Math.Between(-42, 42),
        3,
        3,
        Phaser.Utils.Array.GetRandom([0xfff0ae, 0xf8d77f, 0xb9d08b]),
        0.86
      ).setDepth(record.baseY + 180);
      this.tweens.add({
        targets: dust,
        y: dust.y - Phaser.Math.Between(10, 26),
        alpha: 0,
        duration: Phaser.Math.Between(420, 700),
        ease: "Sine.easeOut",
        onComplete: () => dust.destroy()
      });
    }
  }

  createCharacters() {
    for (const hut of HUTS) {
      const entity = new Kunoichi(this, {
        id: hut.id,
        name: KUNOICHI_NAMES[hut.id],
        home: { x: hut.x, y: hut.y + 78 },
        work: { x: hut.x, y: hut.y + 34 }
      });
      this.kunoichi.set(hut.id, entity);
      this.createStatusBanner(entity);
    }
    this.tyche = new Tyche(this, { x: PLAZA.x + 54, y: PLAZA.y + 30 });
  }

  createStatusBanner(entity) {
    const bg = this.add.rectangle(0, 0, 74, 18, STATUS_COLORS.idle, 0.82)
      .setStrokeStyle(1, 0xe8f4ff, 0.34);
    const label = this.add.text(0, -1, "Idle", {
      color: "#f4f7fb",
      fontFamily: "monospace",
      fontSize: "10px",
      align: "center"
    }).setOrigin(0.5);
    const banner = this.add.container(entity.sprite.x, entity.sprite.y - 58, [bg, label]).setDepth(6200);
    banner.bg = bg;
    banner.label = label;
    banner.target = entity;
    this.statusBanners.set(entity.id, banner);
  }

  startAmbientLoops() {
    this.time.addEvent({
      delay: 28000,
      loop: true,
      callback: () => {
        const idle = [...this.kunoichi.values()].filter((entity) => entity.state === "idle");
        if (!idle.length) return;
        const entity = Phaser.Utils.Array.GetRandom(idle);
        entity.ambient(Phaser.Utils.Array.GetRandom(["wave", "sit", "talk"]), 2600);
      }
    });
    this.time.addEvent({
      delay: 9000,
      loop: true,
      callback: () => this.runTycheLoop()
    });
  }

  async runTycheLoop() {
    if (!this.tyche || this.tycheBusy) return;
    this.tycheBusy = true;
    const working = [...this.kunoichi.values()].filter((entity) => entity.state === "working");
    const pool = working.length ? working : [...this.kunoichi.values()];
    const target = pool.length ? Phaser.Utils.Array.GetRandom(pool) : null;
    if (target && Phaser.Math.Between(0, working.length ? 2 : 1) === 0) {
      await this.tyche.walkTo({ x: target.sprite.x + 34, y: target.sprite.y + 8 }, 520);
      target.react("Tyche...");
      this.showSpeechBubble({ sprite: this.tyche.sprite }, "mrrp", 1500);
    } else {
      await this.tyche.wander({ left: 520, right: 760, top: 300, bottom: 460 });
    }
    this.tycheBusy = false;
  }

  async refreshStatusBanners() {
    for (const entity of this.kunoichi.values()) {
      const status = await (this.bridge?.getKunoichiStatus(entity.id) || Promise.resolve({ label: "Idle", tone: "idle" }));
      this.updateStatusBanner(entity.id, status);
    }
  }

  updateStatusBanner(id, status) {
    const banner = this.statusBanners.get(id);
    if (!banner) return;
    const label = shortText(status?.label || "Idle", 28);
    const width = Math.max(58, Math.min(170, label.length * 6.4 + 18));
    banner.label.setText(label);
    banner.bg.setSize(width, 18);
    banner.bg.setFillStyle(STATUS_COLORS[status?.tone] || STATUS_COLORS.idle, 0.86);
  }

  updateStatusBannerPositions() {
    for (const banner of this.statusBanners.values()) {
      const target = banner.target?.sprite;
      if (!target?.active) continue;
      banner.setPosition(target.x, target.y - 58);
      banner.setDepth(target.depth + 4);
    }
  }

  showSpeechBubble(entity, text, duration = 2400) {
    const target = entity.sprite;
    const label = shortText(text, 32);
    const width = Math.max(62, label.length * 7 + 20);
    const bg = this.add.rectangle(0, 0, width, 24, 0xf6f1dc, 0.96)
      .setStrokeStyle(1, 0x272c35, 0.58);
    const textNode = this.add.text(0, -1, label, {
      color: "#20242d",
      fontFamily: "monospace",
      fontSize: "11px",
      align: "center"
    }).setOrigin(0.5);
    const bubble = this.add.container(target.x, target.y - 76, [bg, textNode]).setDepth(6800);
    bubble.target = target;
    this.speechBubbles.add(bubble);
    this.time.delayedCall(duration, () => {
      this.speechBubbles.delete(bubble);
      bubble.destroy();
    });
    return bubble;
  }

  updateSpeechBubbles() {
    for (const bubble of this.speechBubbles) {
      if (!bubble.target?.active) continue;
      bubble.setPosition(bubble.target.x, bubble.target.y - 76);
    }
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

  assigneeFor(mission = {}) {
    const raw = mission.assignee || mission.agent || mission.worker || mission.assignedAgent || mission.targetAgent;
    const value = String(raw || "").toLowerCase();
    if (this.kunoichi.has(value)) return value;
    if (WORKER_TO_KUNOICHI[value]) return WORKER_TO_KUNOICHI[value];
    const content = String(mission.summary || mission.content || mission.title || mission.id || "").toLowerCase();
    if (content.includes("tea")) return "meji";
    if (content.includes("forge") || content.includes("publish")) return "miji";
    if (content.includes("launch") || content.includes("rocket")) return "muji";
    if (content.includes("review") || content.includes("dojo")) return "maji";
    if (content.includes("receipt") || content.includes("approve")) return "meowts";
    return "moji";
  }

  handleLifecycleEvent(event) {
    if (!event?.type) return;
    const mission = event.mission || event.payload || event;
    const assignee = this.assigneeFor(mission);
    const ninja = this.kunoichi.get(assignee) || this.kunoichi.get("moji");

    if (event.type === "mission.created" || event.type === "mission.started") {
      this.dropScrollAtMoji();
      this.kunoichi.get("moji")?.walkTo({ x: 410, y: 330 }, 900).then(() => this.kunoichi.get("moji")?.speak("New scroll", 2200));
      return;
    }

    if (event.type === "worker.handoff" || event.type === "mission.stage_changed") {
      this.updateStatusBanner(assignee, { label: "Waiting on handoff", tone: "waiting" });
      ninja?.walkTo({ x: PLAZA.x, y: PLAZA.y + 20 }, 900).then(() => ninja?.speak("Handoff", 2300));
      return;
    }

    if (event.type === "worker.started" || event.type === "mission.worker_running" || event.type === "mission.queued") {
      this.updateStatusBanner(assignee, { label: "Working", tone: "working" });
      ninja?.walkHome().then(() => ninja?.work("Working"));
      return;
    }

    if (event.type === "mission.completed" || event.type === "mission.receipt_ready" || event.type === "worker.deployed") {
      const meowts = this.kunoichi.get("meowts");
      this.updateStatusBanner(assignee, { label: "Idle", tone: "idle" });
      meowts?.walkTo({ x: PLAZA.x + 18, y: PLAZA.y + 50 }, 900).then(() => meowts?.speak("Approved", 2500));
      this.refreshStatusBanners();
      return;
    }

    if (event.type === "approval.rejected" || event.type === "mission.rejected") {
      this.kunoichi.get("meowts")?.react("Rejected");
      this.refreshStatusBanners();
    }
  }

  dropScrollAtMoji() {
    const scroll = this.add.rectangle(300, 8, 22, 30, 0xf2e3b6, 1)
      .setStrokeStyle(2, 0x3a2a20, 0.8)
      .setDepth(6400);
    this.tweens.add({
      targets: scroll,
      y: 292,
      angle: 360,
      duration: 900,
      ease: "Bounce.easeOut",
      onComplete: () => this.time.delayedCall(1300, () => scroll.destroy())
    });
  }
}

function shortText(text, max) {
  const value = String(text || "");
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

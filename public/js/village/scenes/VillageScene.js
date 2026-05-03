import { EventBridge } from "../systems/EventBridge.js";

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

export class VillageScene extends Phaser.Scene {
  constructor() {
    super("VillageScene");
    this.world = null;
    this.runLoop = { activeCount: 0, queuedCount: 0 };
    this.workerStatus = null;
    this.bridgeStatus = "connecting";
    this.huts = new Map();
  }

  create() {
    window.dojoScene = this;
    this.cameras.main.setBackgroundColor("#1a1d23");
    this.cameras.main.setBounds(0, 0, WIDTH, HEIGHT);
    this.cameras.main.setScroll(0, 0);
    this.drawStaticCompound();
    this.createDebugHud();
    this.bridge = new EventBridge(this);
    this.bridge.connect();
  }

  update() {
    this.statusText?.setText(this.statusLabel());
    this.receiptText?.setText(this.receiptLabel());
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
      const sprite = this.add.image(hut.x, hut.y, hut.key).setDepth(hut.y).setScale(1);
      this.huts.set(hut.id, { ...hut, sprite, shadow });
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

  handleLifecycleEvent() {
    // PR 2.1 is static. PR 2.2 rewires backend events to pixel sprites.
  }
}

function shortText(text, max) {
  const value = String(text || "");
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

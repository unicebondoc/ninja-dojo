export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    const { width, height } = this.scale;
    const barWidth = 420;
    const barX = (width - barWidth) / 2;
    const barY = height / 2;

    this.add.rectangle(width / 2, height / 2, width, height, 0xd8e8df);
    this.add.rectangle(barX, barY, barWidth, 10, 0xffffff, 0.55).setOrigin(0, 0.5);
    const progress = this.add.rectangle(barX, barY, 1, 10, 0x7aa982).setOrigin(0, 0.5);

    this.load.on("progress", (value) => progress.setSize(Math.max(1, barWidth * value), 10));

    this.load.image("characters", "/assets/village/characters/characters.png");
    this.load.image("buildings", "/assets/village/buildings/buildings.png");
    this.load.image("effects", "/assets/village/effects/effects.png");
    this.load.image("bg_sky", "/assets/village/background/bg_sky.png");
    this.load.image("bg_mountains", "/assets/village/background/bg_mountains.png");
    this.load.image("bg_forest", "/assets/village/background/bg_forest.png");
    this.load.image("bg_foreground", "/assets/village/background/bg_foreground.png");
    this.load.image("petal", "/assets/village/particles/petal.png");
    this.load.image("ground_map", "/assets/village/tiles/ground_map.png");
    this.load.image("moon_eternal", "/assets/village/moons/moon_eternal.png");
    this.load.image("moon_earned", "/assets/village/moons/moon_earned.png");
    for (let i = 1; i <= 4; i += 1) this.load.image(`cherry_${i}`, `/assets/village/trees/cherry_${i}.png`);
    for (const key of ["stone_lantern", "flower_bed", "signpost", "lily_pond", "wildflowers"]) {
      this.load.image(key, `/assets/village/props/${key}.png`);
    }
    for (const id of KUNOICHI_IDS) {
      this.load.image(`${id}_interior`, `/assets/village/interiors/${id}_interior.png`);
    }
    for (const id of KUNOICHI_IDS) {
      for (const [action, frames] of Object.entries(KUNOICHI_ACTIONS)) {
        this.load.spritesheet(`kunoichi_${id}_${action}`, `/assets/village/animations/kunoichi/${id}/${action}.png`, {
          frameWidth: 256,
          frameHeight: 256,
          endFrame: frames - 1
        });
      }
    }
    for (const [action, frames] of Object.entries(TYCHE_ACTIONS)) {
      this.load.spritesheet(`tyche_${action}`, `/assets/village/animations/tyche/${action}.png`, {
        frameWidth: 256,
        frameHeight: 256,
        endFrame: frames - 1
      });
    }
  }

  create() {
    this.scene.start("VillageScene");
  }
}

const KUNOICHI_IDS = ["moji", "miji", "maji", "meji", "muji", "meowts"];

const KUNOICHI_ACTIONS = {
  idle: 4,
  walk_north: 6,
  walk_south: 6,
  walk_east: 6,
  walk_west: 6,
  work: 4,
  wave: 4,
  sit: 2,
  talk: 3,
  react: 3,
  sleep: 2,
  yawn: 3
};

const TYCHE_ACTIONS = {
  idle: 3,
  walk_north: 4,
  walk_south: 4,
  walk_east: 4,
  walk_west: 4,
  groom: 3,
  pounce: 4
};

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
  }

  create() {
    this.scene.start("VillageScene");
  }
}

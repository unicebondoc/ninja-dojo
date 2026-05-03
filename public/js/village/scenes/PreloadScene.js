// PR 2.0 - Phaser preload reset for pixel pivot.
// All Ghibli asset loads were archived. PR 2.1 adds pixel sprite atlases here.

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    // No assets yet - PR 2.1 adds pixel sprite atlases here.
  }

  create() {
    this.scene.start("VillageScene");
  }
}

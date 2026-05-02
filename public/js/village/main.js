import { BootScene } from "./scenes/BootScene.js";
import { PreloadScene } from "./scenes/PreloadScene.js";
import { VillageScene } from "./scenes/VillageScene.js";

const config = {
  type: Phaser.AUTO,
  parent: "game",
  width: 1280,
  height: 720,
  backgroundColor: "#d8e8df",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: { width: 1280, height: 720 }
  },
  render: {
    antialias: true,
    pixelArt: false
  },
  scene: [BootScene, PreloadScene, VillageScene]
};

window.dojoGame = new Phaser.Game(config);

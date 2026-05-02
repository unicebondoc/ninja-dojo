import { TYCHE } from "../data/kunoichi-config.js";
import { isoToScreen } from "../data/village-layout.js";

export class Tyche {
  constructor(scene, pathfinder) {
    this.scene = scene;
    this.pathfinder = pathfinder;
    this.tile = { ...TYCHE.home };
    const point = isoToScreen(this.tile);
    this.sprite = scene.add.image(point.x, point.y, "characters")
      .setCrop(TYCHE.frame.x, TYCHE.frame.y, TYCHE.frame.w, TYCHE.frame.h)
      .setDisplaySize(84, 84)
      .setOrigin(0.5, 0.86)
      .setDepth(point.y + 90);
    this.scene.tweens.add({ targets: this.sprite, angle: 4, duration: 1800, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
  }

  async wander() {
    const next = {
      x: Phaser.Math.Between(7, 11),
      y: Phaser.Math.Between(5, 8)
    };
    await this.walkTo(next, 360);
  }

  async visit(tile) {
    await this.walkTo({ x: tile.x + 1, y: tile.y }, 320);
  }

  walkTo(tile, duration = 360) {
    const target = this.pathfinder.nearestOpen(tile);
    return this.pathfinder.find(this.tile, target).then((path) => path.slice(1).reduce((chain, step) => {
      return chain.then(() => new Promise((resolve) => {
        const point = isoToScreen(step);
        this.sprite.setFlipX(point.x < this.sprite.x);
        this.scene.tweens.add({
          targets: this.sprite,
          x: point.x,
          y: point.y,
          duration,
          ease: "Sine.easeInOut",
          onUpdate: () => this.sprite.setDepth(this.sprite.y + 90),
          onComplete: () => {
            this.tile = { ...step };
            this.sprite.setDepth(this.sprite.y + 90);
            resolve();
          }
        });
      }));
    }, Promise.resolve()));
  }
}

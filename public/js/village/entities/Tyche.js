import { TYCHE } from "../data/kunoichi-config.js";
import { isoToScreen } from "../data/village-layout.js";

const ACTION_FRAMES = {
  idle: 3,
  walk_north: 4,
  walk_south: 4,
  walk_east: 4,
  walk_west: 4,
  groom: 3,
  pounce: 4
};

export class Tyche {
  constructor(scene, pathfinder) {
    this.scene = scene;
    this.pathfinder = pathfinder;
    this.tile = { ...TYCHE.home };
    const point = isoToScreen(this.tile);
    this.hasFlipbooks = scene.textures.exists(this.textureKey("idle"));
    if (this.hasFlipbooks) {
      this.createAnimations();
      this.sprite = scene.add.sprite(point.x, point.y, this.textureKey("idle"), 0)
        .setScale(0.38)
        .setOrigin(0.5, 0.84)
        .setDepth(point.y + 90);
      this.play("idle");
    } else {
      this.sprite = scene.add.image(point.x, point.y, "characters")
        .setCrop(TYCHE.frame.x, TYCHE.frame.y, TYCHE.frame.w, TYCHE.frame.h)
        .setDisplaySize(84, 84)
        .setOrigin(0.5, 0.86)
        .setDepth(point.y + 90);
    }
    this.scene.tweens.add({ targets: this.sprite, angle: 4, duration: 1800, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
  }

  textureKey(action) {
    return `tyche_${action}`;
  }

  animationKey(action) {
    return `tyche:${action}`;
  }

  createAnimations() {
    for (const [action, frames] of Object.entries(ACTION_FRAMES)) {
      const key = this.animationKey(action);
      const texture = this.textureKey(action);
      if (this.scene.anims.exists(key) || !this.scene.textures.exists(texture)) continue;
      this.scene.anims.create({
        key,
        frames: this.scene.anims.generateFrameNumbers(texture, { start: 0, end: frames - 1 }),
        frameRate: action.startsWith("walk") ? 8 : 6,
        repeat: action === "pounce" ? 0 : -1
      });
    }
  }

  play(action) {
    if (!this.hasFlipbooks) return;
    const key = this.animationKey(action);
    if (this.scene.anims.exists(key) && this.sprite.anims?.currentAnim?.key !== key) {
      this.sprite.play(key);
    }
  }

  async wander() {
    const next = {
      x: Phaser.Math.Between(7, 11),
      y: Phaser.Math.Between(5, 8)
    };
    await this.walkTo(next, 360);
    if (Phaser.Math.Between(0, 2) === 0) this.groom();
  }

  async visit(tile) {
    this.play("pounce");
    await this.wait(420);
    await this.walkTo({ x: tile.x + 1, y: tile.y }, 320);
  }

  walkTo(tile, duration = 360) {
    const target = this.pathfinder.nearestOpen(tile);
    return this.pathfinder.find(this.tile, target).then((path) => path.slice(1).reduce((chain, step) => {
      return chain.then(() => new Promise((resolve) => {
        const point = isoToScreen(step);
        this.play(this.walkActionFor(step));
        if (!this.hasFlipbooks) this.sprite.setFlipX(point.x < this.sprite.x);
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
    }, Promise.resolve())).then(() => this.play("idle"));
  }

  walkActionFor(tile) {
    const dx = tile.x - this.tile.x;
    const dy = tile.y - this.tile.y;
    if (Math.abs(dx) >= Math.abs(dy) && dx !== 0) return dx > 0 ? "walk_east" : "walk_west";
    if (dy !== 0) return dy > 0 ? "walk_south" : "walk_north";
    return "walk_south";
  }

  groom() {
    this.play("groom");
    this.scene.time.delayedCall(1800, () => this.play("idle"));
  }

  wait(duration) {
    return new Promise((resolve) => this.scene.time.delayedCall(duration, resolve));
  }
}

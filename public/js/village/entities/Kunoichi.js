import { isoToScreen } from "../data/village-layout.js";

const ACTION_FRAMES = {
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

export class Kunoichi {
  constructor(scene, config, pathfinder, dialogue) {
    this.scene = scene;
    this.config = config;
    this.pathfinder = pathfinder;
    this.dialogue = dialogue;
    this.tile = { ...config.work };
    const point = isoToScreen(this.tile);
    this.state = "idle";
    this.hasFlipbooks = scene.textures.exists(this.textureKey("idle"));
    if (this.hasFlipbooks) {
      this.createAnimations();
      this.sprite = scene.add.sprite(point.x, point.y, this.textureKey("idle"), 0)
        .setScale(0.43)
        .setOrigin(0.5, 0.84)
        .setDepth(point.y + 80);
      this.play("idle");
    } else {
      this.sprite = scene.add.image(point.x, point.y, "characters")
        .setCrop(config.frame.x, config.frame.y, config.frame.w, config.frame.h)
        .setDisplaySize(76, 104)
        .setOrigin(0.5, 0.86)
        .setDepth(point.y + 80);
    }
    this.idleTween = scene.tweens.add({
      targets: this.sprite,
      y: point.y - 4,
      duration: 1250,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
  }

  textureKey(action) {
    return `kunoichi_${this.config.id}_${action}`;
  }

  animationKey(action) {
    return `${this.config.id}:${action}`;
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
        repeat: action === "react" || action === "yawn" ? 0 : -1
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

  async walkTo(tile) {
    const target = this.pathfinder.nearestOpen(tile);
    const path = await this.pathfinder.find(this.tile, target);
    this.state = "walking";
    this.idleTween.pause();
    for (const step of path.slice(1)) {
      await this.stepTo(step);
    }
    this.tile = { ...target };
    this.state = "idle";
    this.play("idle");
    this.idleTween.resume();
  }

  stepTo(tile) {
    const point = isoToScreen(tile);
    this.play(this.walkActionFor(tile));
    if (!this.hasFlipbooks) this.sprite.setFlipX(point.x < this.sprite.x);
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.sprite,
        x: point.x,
        y: point.y,
        duration: 420,
        ease: "Sine.easeInOut",
        onUpdate: () => this.syncFollowers(),
        onComplete: () => {
          this.tile = { ...tile };
          this.syncFollowers();
          resolve();
        }
      });
    });
  }

  walkActionFor(tile) {
    const dx = tile.x - this.tile.x;
    const dy = tile.y - this.tile.y;
    if (Math.abs(dx) >= Math.abs(dy) && dx !== 0) return dx > 0 ? "walk_east" : "walk_west";
    if (dy !== 0) return dy > 0 ? "walk_south" : "walk_north";
    return "walk_south";
  }

  speak(text, durationMs) {
    this.state = "talking";
    this.play("talk");
    this.dialogue.show(this.config.id, this.sprite, text, durationMs);
    this.scene.time.delayedCall(durationMs || 4000, () => {
      if (this.state === "talking") {
        this.state = "idle";
        this.play("idle");
      }
    });
  }

  work(text = "Working...") {
    this.startWorkAnimation();
    this.dialogue.show(this.config.id, this.sprite, text, 2600);
  }

  startWorkAnimation() {
    this.state = "working";
    this.play("work");
    if (!this.hasFlipbooks) this.scene.tweens.add({ targets: this.sprite, angle: 2, duration: 180, yoyo: true, repeat: 8 });
  }

  react(text = "Tyche...") {
    this.state = "reacting";
    this.play("react");
    this.dialogue.show(this.config.id, this.sprite, text, 2400);
    if (!this.hasFlipbooks) this.scene.tweens.add({ targets: this.sprite, scaleX: 0.9, scaleY: 1.05, duration: 180, yoyo: true, repeat: 5 });
    this.scene.time.delayedCall(2400, () => {
      if (this.state === "reacting") {
        this.state = "idle";
        this.play("idle");
      }
    });
  }

  syncFollowers() {
    this.sprite.setDepth(this.sprite.y + 80);
  }
}

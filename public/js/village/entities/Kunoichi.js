const ACTIONS = {
  idle: { start: 0, frames: 4, rate: 5, repeat: -1 },
  walk_north: { start: 4, frames: 4, rate: 8, repeat: -1 },
  walk_south: { start: 8, frames: 4, rate: 8, repeat: -1 },
  walk_east: { start: 12, frames: 4, rate: 8, repeat: -1 },
  walk_west: { start: 16, frames: 4, rate: 8, repeat: -1 },
  work: { start: 20, frames: 4, rate: 6, repeat: -1 },
  wave: { start: 24, frames: 4, rate: 6, repeat: -1 },
  sit: { start: 28, frames: 2, rate: 3, repeat: -1 },
  talk: { start: 30, frames: 2, rate: 4, repeat: -1 }
};

export class Kunoichi {
  constructor(scene, config) {
    this.scene = scene;
    this.config = config;
    this.id = config.id;
    this.state = "idle";
    this.home = { ...config.home };
    this.position = { ...config.home };
    this.createAnimations();
    this.sprite = scene.add.sprite(config.home.x, config.home.y, this.textureKey(), 0)
      .setScale(2)
      .setOrigin(0.5, 0.78)
      .setDepth(config.home.y + 80);
    this.play("idle");
  }

  textureKey() {
    return `dojo_kunoichi_${this.id}`;
  }

  animationKey(action) {
    return `dojo:${this.id}:${action}`;
  }

  createAnimations() {
    for (const [action, meta] of Object.entries(ACTIONS)) {
      const key = this.animationKey(action);
      if (this.scene.anims.exists(key)) continue;
      this.scene.anims.create({
        key,
        frames: this.scene.anims.generateFrameNumbers(this.textureKey(), {
          start: meta.start,
          end: meta.start + meta.frames - 1
        }),
        frameRate: meta.rate,
        repeat: meta.repeat
      });
    }
  }

  play(action) {
    const key = this.animationKey(action);
    if (this.scene.anims.exists(key) && this.sprite.anims?.currentAnim?.key !== key) {
      this.sprite.play(key);
    }
  }

  async walkTo(point, duration = 760) {
    const dx = point.x - this.sprite.x;
    const dy = point.y - this.sprite.y;
    this.state = "walking";
    this.play(walkActionFor(dx, dy));
    await new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.sprite,
        x: point.x,
        y: point.y,
        duration,
        ease: "Sine.easeInOut",
        onUpdate: () => this.syncDepth(),
        onComplete: () => {
          this.position = { ...point };
          this.syncDepth();
          resolve();
        }
      });
    });
    if (this.state === "walking") this.idle();
  }

  async walkHome() {
    await this.walkTo(this.home);
  }

  idle() {
    this.state = "idle";
    this.play("idle");
  }

  startWorkAnimation() {
    this.state = "working";
    this.play("work");
  }

  work(text = "Working") {
    this.startWorkAnimation();
    this.scene.showSpeechBubble(this, text, 2600);
  }

  speak(text, duration = 2600) {
    this.state = "talking";
    this.play("talk");
    this.scene.showSpeechBubble(this, text, duration);
    this.scene.time.delayedCall(duration, () => {
      if (this.state === "talking") this.idle();
    });
  }

  react(text = "Tyche...") {
    this.state = "reacting";
    this.play("talk");
    this.scene.showSpeechBubble(this, text, 2300);
    this.sprite.setTint(0xfff0a6);
    this.scene.tweens.add({ targets: this.sprite, alpha: 0.72, duration: 140, yoyo: true, repeat: 5 });
    this.scene.time.delayedCall(2400, () => {
      this.sprite.clearTint();
      this.sprite.setAlpha(1);
      if (this.state === "reacting") this.idle();
    });
  }

  ambient(action, duration = 2200) {
    if (this.state !== "idle") return false;
    this.state = "ambient";
    this.play(action);
    this.scene.time.delayedCall(duration, () => {
      if (this.state === "ambient") this.idle();
    });
    return true;
  }

  syncDepth() {
    this.sprite.setDepth(this.sprite.y + 80);
  }
}

function walkActionFor(dx, dy) {
  if (Math.abs(dx) >= Math.abs(dy) && dx !== 0) return dx > 0 ? "walk_east" : "walk_west";
  if (dy !== 0) return dy > 0 ? "walk_south" : "walk_north";
  return "walk_south";
}

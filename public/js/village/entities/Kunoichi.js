import { isoToScreen } from "../data/village-layout.js";

export class Kunoichi {
  constructor(scene, config, pathfinder, dialogue) {
    this.scene = scene;
    this.config = config;
    this.pathfinder = pathfinder;
    this.dialogue = dialogue;
    this.tile = { ...config.work };
    const point = isoToScreen(this.tile);
    this.state = "idle";
    this.sprite = scene.add.image(point.x, point.y, "characters")
      .setCrop(config.frame.x, config.frame.y, config.frame.w, config.frame.h)
      .setDisplaySize(76, 104)
      .setOrigin(0.5, 0.86)
      .setDepth(point.y + 80);
    this.idleTween = scene.tweens.add({
      targets: this.sprite,
      y: point.y - 4,
      duration: 1250,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut"
    });
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
    this.idleTween.resume();
  }

  stepTo(tile) {
    const point = isoToScreen(tile);
    this.sprite.setFlipX(point.x < this.sprite.x);
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

  speak(text, durationMs) {
    this.state = "talking";
    this.dialogue.show(this.config.id, this.sprite, text, durationMs);
    this.scene.time.delayedCall(durationMs || 4000, () => {
      if (this.state === "talking") this.state = "idle";
    });
  }

  work(text = "Working...") {
    this.state = "working";
    this.speak(text, 2600);
    this.scene.tweens.add({ targets: this.sprite, angle: 2, duration: 180, yoyo: true, repeat: 8 });
  }

  react(text = "Tyche...") {
    this.state = "reacting";
    this.speak(text, 2400);
    this.scene.tweens.add({ targets: this.sprite, scaleX: 0.9, scaleY: 1.05, duration: 180, yoyo: true, repeat: 5 });
  }

  syncFollowers() {
    this.sprite.setDepth(this.sprite.y + 80);
  }
}

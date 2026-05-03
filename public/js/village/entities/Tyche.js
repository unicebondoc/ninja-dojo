const ACTIONS = {
  idle: { start: 0, frames: 4, rate: 5, repeat: -1 },
  walk_north: { start: 4, frames: 4, rate: 8, repeat: -1 },
  walk_south: { start: 8, frames: 4, rate: 8, repeat: -1 },
  walk_east: { start: 12, frames: 2, rate: 6, repeat: -1 },
  walk_west: { start: 14, frames: 2, rate: 6, repeat: -1 }
};

export class Tyche {
  constructor(scene, home) {
    this.scene = scene;
    this.home = { ...home };
    this.position = { ...home };
    this.createAnimations();
    this.sprite = scene.add.sprite(home.x, home.y, "dojo_tyche", 0)
      .setScale(2)
      .setOrigin(0.5, 0.78)
      .setDepth(home.y + 90);
    this.play("idle");
  }

  createAnimations() {
    for (const [action, meta] of Object.entries(ACTIONS)) {
      const key = `dojo:tyche:${action}`;
      if (this.scene.anims.exists(key)) continue;
      this.scene.anims.create({
        key,
        frames: this.scene.anims.generateFrameNumbers("dojo_tyche", {
          start: meta.start,
          end: meta.start + meta.frames - 1
        }),
        frameRate: meta.rate,
        repeat: meta.repeat
      });
    }
  }

  play(action) {
    const key = `dojo:tyche:${action}`;
    if (this.scene.anims.exists(key) && this.sprite.anims?.currentAnim?.key !== key) {
      this.sprite.play(key);
    }
  }

  async walkTo(point, duration = 600) {
    const dx = point.x - this.sprite.x;
    const dy = point.y - this.sprite.y;
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
    this.play("idle");
  }

  async wander(bounds) {
    await this.walkTo({
      x: Phaser.Math.Between(bounds.left, bounds.right),
      y: Phaser.Math.Between(bounds.top, bounds.bottom)
    });
  }

  syncDepth() {
    this.sprite.setDepth(this.sprite.y + 90);
  }
}

function walkActionFor(dx, dy) {
  if (Math.abs(dx) >= Math.abs(dy) && dx !== 0) return dx > 0 ? "walk_east" : "walk_west";
  if (dy !== 0) return dy > 0 ? "walk_south" : "walk_north";
  return "walk_south";
}

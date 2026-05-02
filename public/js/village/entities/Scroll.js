import { isoToScreen } from "../data/village-layout.js";

export function dropScroll(scene, tile, onComplete) {
  const point = isoToScreen(tile);
  const scroll = scene.add.container(point.x, -40).setDepth(6000);
  const paper = scene.add.graphics();
  paper.fillStyle(0xfff0c4, 1);
  paper.lineStyle(2, 0x9f764b, 1);
  paper.fillRoundedRect(-18, -12, 36, 24, 8);
  paper.strokeRoundedRect(-18, -12, 36, 24, 8);
  paper.fillStyle(0x9f764b, 1);
  paper.fillCircle(-16, 0, 5);
  paper.fillCircle(16, 0, 5);
  scroll.add(paper);
  scene.tweens.add({
    targets: scroll,
    y: point.y - 42,
    angle: 720,
    duration: 1100,
    ease: "Bounce.easeOut",
    onComplete: () => {
      scene.time.delayedCall(700, () => scroll.destroy(true));
      if (onComplete) onComplete();
    }
  });
}

export class DialogueSystem {
  constructor(scene) {
    this.scene = scene;
    this.bubbles = new Map();
  }

  show(entityId, target, text, durationMs = 4000) {
    this.clear(entityId);
    const label = truncate(String(text || "..."), 72);
    const bubble = this.scene.add.container(target.x, target.y - target.displayHeight - 22).setDepth(5000);
    const lines = wrap(label, 24).slice(0, 3);
    if (lines.length === 3 && label.length > lines.join(" ").length) lines[2] = `${lines[2].slice(0, 21)}...`;
    const width = Math.max(116, Math.min(230, Math.max(...lines.map((line) => line.length)) * 8 + 28));
    const height = 28 + lines.length * 17;
    const bg = this.scene.add.graphics();
    bg.fillStyle(0xfff5da, 0.96);
    bg.lineStyle(2, 0x7b6048, 0.5);
    bg.fillRoundedRect(-width / 2, -height, width, height, 14);
    bg.strokeRoundedRect(-width / 2, -height, width, height, 14);
    bg.fillTriangle(-10, 0, 10, 0, 0, 12);
    const copy = this.scene.add.text(0, -height + 11, lines.join("\n"), {
      color: "#3f3026",
      fontFamily: "Georgia, serif",
      fontSize: "14px",
      lineSpacing: 3,
      align: "center"
    }).setOrigin(0.5, 0);
    bubble.add([bg, copy]);
    bubble.followTarget = target;
    this.bubbles.set(entityId, bubble);
    this.scene.time.delayedCall(durationMs, () => this.clear(entityId));
    return bubble;
  }

  update() {
    for (const bubble of this.bubbles.values()) {
      if (!bubble.followTarget?.active) continue;
      bubble.setPosition(bubble.followTarget.x, bubble.followTarget.y - bubble.followTarget.displayHeight - 22);
    }
  }

  clear(entityId) {
    const bubble = this.bubbles.get(entityId);
    if (bubble) bubble.destroy(true);
    this.bubbles.delete(entityId);
  }
}

function wrap(text, chars) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > chars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function truncate(text, max) {
  return text.length > max ? `${text.slice(0, max - 3)}...` : text;
}

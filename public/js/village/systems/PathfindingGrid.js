import { BLOCKED, GRID } from "../data/village-layout.js";

export class PathfindingGrid {
  constructor() {
    this.grid = [];
    for (let y = 0; y < GRID.height; y += 1) {
      const row = [];
      for (let x = 0; x < GRID.width; x += 1) {
        row.push(BLOCKED.has(`${x},${y}`) ? 1 : 0);
      }
      this.grid.push(row);
    }

    this.easystar = new EasyStar.js();
    this.easystar.setGrid(this.grid);
    this.easystar.setAcceptableTiles([0]);
    this.easystar.enableDiagonals();
    this.easystar.disableCornerCutting();
  }

  find(from, to) {
    return new Promise((resolve) => {
      this.easystar.findPath(from.x, from.y, to.x, to.y, (path) => resolve(path || [from, to]));
      this.easystar.calculate();
    });
  }

  nearestOpen(tile) {
    if (!BLOCKED.has(`${tile.x},${tile.y}`)) return tile;
    const candidates = [
      { x: tile.x + 1, y: tile.y },
      { x: tile.x - 1, y: tile.y },
      { x: tile.x, y: tile.y + 1 },
      { x: tile.x, y: tile.y - 1 }
    ];
    return candidates.find((item) => !BLOCKED.has(`${item.x},${item.y}`)) || tile;
  }
}

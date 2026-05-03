export const TILE = { width: 64, height: 32 };
export const ORIGIN = { x: 640, y: 168 };
export const GRID = { width: 18, height: 13 };

export const BUILDINGS = [
  { id: "moji", label: "Scroll Hut", frame: { x: 0, y: 0, w: 512, h: 512 }, tile: { x: 5, y: 2 }, scale: 0.38 },
  { id: "miji", label: "Forge", frame: { x: 512, y: 0, w: 512, h: 512 }, tile: { x: 9, y: 2 }, scale: 0.4 },
  { id: "maji", label: "Training Dojo", frame: { x: 1024, y: 0, w: 512, h: 512 }, tile: { x: 13, y: 5 }, scale: 0.4 },
  { id: "meji", label: "Tea House", frame: { x: 0, y: 512, w: 512, h: 512 }, tile: { x: 4, y: 7 }, scale: 0.39 },
  { id: "muji", label: "Launch Pad", frame: { x: 512, y: 512, w: 512, h: 512 }, tile: { x: 8, y: 9 }, scale: 0.4 },
  { id: "meowts", label: "Shrine", frame: { x: 1024, y: 512, w: 512, h: 512 }, tile: { x: 12, y: 8 }, scale: 0.4 }
];

export const PLAZA = { x: 9, y: 6 };

export const BLOCKED = new Set([
  "4,1", "5,1", "6,1", "4,2", "5,2", "6,2",
  "8,1", "9,1", "10,1", "8,2", "9,2", "10,2",
  "12,4", "13,4", "14,4", "12,5", "13,5", "14,5",
  "3,6", "4,6", "5,6", "3,7", "4,7", "5,7",
  "7,8", "8,8", "9,8", "7,9", "8,9", "9,9",
  "11,7", "12,7", "13,7", "11,8", "12,8", "13,8"
]);

export const PATHS = [
  [PLAZA, { x: 5, y: 4 }],
  [PLAZA, { x: 9, y: 4 }],
  [PLAZA, { x: 13, y: 4 }],
  [PLAZA, { x: 6, y: 8 }],
  [PLAZA, { x: 9, y: 9 }],
  [PLAZA, { x: 12, y: 8 }]
];

export function isoToScreen(tile) {
  return {
    x: ORIGIN.x + (tile.x - tile.y) * (TILE.width / 2),
    y: ORIGIN.y + (tile.x + tile.y) * (TILE.height / 2)
  };
}

// Ported from v1 `lib/agent-registry.ts`, narrowed to PR1's world zones.
export const dojoZones = [
  {
    id: "worker-plaza",
    label: "Worker Plaza",
    purpose: "Codex and Claude worker dispatch",
    x: 18,
    y: 52
  },
  {
    id: "mission-board",
    label: "Mission Board",
    purpose: "scroll intake and approval gate",
    x: 50,
    y: 48
  },
  {
    id: "receipt-archive",
    label: "Receipt Archive",
    purpose: "completed worker receipts",
    x: 82,
    y: 52
  },
  {
    id: "openclaw-tower",
    label: "OpenClaw Tower",
    purpose: "gateway signal watch",
    x: 86,
    y: 22
  }
];

export const agentRegistry = [
  {
    homeZone: "mission-board",
    id: "moji",
    labelSide: "right",
    mapX: 48,
    mapY: 58,
    name: "Moji",
    role: "planner / manifest",
    room: "mission-board",
    shortLine: "Manifest route mapped.",
    spriteSrc: null
  },
  {
    homeZone: "worker-plaza",
    id: "miji",
    labelSide: "top",
    mapX: 20,
    mapY: 58,
    name: "Miji",
    role: "codex builder / handoff",
    room: "worker-plaza",
    shortLine: "Codex handoff wired as a stub.",
    spriteSrc: null
  },
  {
    homeZone: "worker-plaza",
    id: "meji",
    labelSide: "right",
    mapX: 24,
    mapY: 42,
    name: "Meji",
    role: "claude reviewer / analysis",
    room: "worker-plaza",
    shortLine: "Claude analysis wired as a stub.",
    spriteSrc: null
  },
  {
    homeZone: "receipt-archive",
    id: "meowts",
    labelSide: "top",
    mapX: 80,
    mapY: 58,
    name: "Meowts",
    role: "receipt keeper",
    room: "receipt-archive",
    shortLine: "Receipt judgment deferred to v2.",
    spriteSrc: null
  }
];

export const agentById = Object.fromEntries(agentRegistry.map((agent) => [agent.id, agent]));

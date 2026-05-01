import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { agentRegistry, dojoZones } from "./personas.js";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
export const WORLD_PATH = `${root}/data/world.json`;
let worldUpdateQueue = Promise.resolve();

export async function readWorld() {
  const raw = await readFile(WORLD_PATH, "utf8");
  const world = JSON.parse(raw);
  return normalizeWorld(world);
}

export async function writeWorld(world) {
  const next = normalizeWorld({ ...world, updatedAt: new Date().toISOString() });
  await mkdir(dirname(WORLD_PATH), { recursive: true });
  const tmp = `${WORLD_PATH}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmp, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  await rename(tmp, WORLD_PATH);
  return next;
}

export async function updateWorld(mutator) {
  const run = worldUpdateQueue.then(async () => {
    const world = await readWorld();
    const result = await mutator(world);
    world.version = (world.version ?? 0) + 1;
    const next = await writeWorld(world);
    return { result, world: next };
  });
  worldUpdateQueue = run.catch(() => {});
  return run;
}

export function normalizeWorld(world) {
  return {
    version: world.version ?? 1,
    updatedAt: world.updatedAt ?? null,
    zones: normalizeById(world.zones, dojoZones),
    personas: normalizeById(world.personas, agentRegistry),
    missions: Array.isArray(world.missions) ? world.missions : [],
    receipts: Array.isArray(world.receipts) ? world.receipts : [],
    events: Array.isArray(world.events) ? world.events : []
  };
}

function normalizeById(items, defaults) {
  const source = Array.isArray(items) ? items : [];
  const byId = new Map(source.filter((item) => item?.id).map((item) => [item.id, item]));
  const merged = defaults.map((item) => ({ ...item, ...(byId.get(item.id) || {}) }));
  const defaultIds = new Set(defaults.map((item) => item.id));
  return [...merged, ...source.filter((item) => item?.id && !defaultIds.has(item.id))];
}

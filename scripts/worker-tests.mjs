import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const tempDir = await mkdtemp(path.join(tmpdir(), "ninja-dojo-workers-"));
const fakeCodex = path.join(tempDir, "codex");
const fakeClaude = path.join(tempDir, "claude");

await writeFile(fakeCodex, fakeCli("codex"), { mode: 0o755 });
await writeFile(fakeClaude, fakeCli("claude"), { mode: 0o755 });

process.env.DOJO_CODEX_BIN = fakeCodex;
process.env.DOJO_CLAUDE_BIN = fakeClaude;
process.env.DOJO_WORKER_CWD = tempDir;
process.env.DOJO_WORKER_TIMEOUT_MS = "not-a-number";

const { executeWorker, workerStatus } = await import("../src/workers.js");

const baseTask = {
  id: "mission-worker-test",
  title: "Worker adapter smoke",
  department: "engineering",
  context: "test context",
  prompt: "return a receipt"
};

process.env.DOJO_WORKER_MODE = "stub";
let status = workerStatus();
assert.equal(status.timeoutMs, 300000);
assert.equal(status.workers.codex.ready, true);
assert.equal(status.workers.claude.ready, true);

process.env.DOJO_WORKER_MODE = "mystery";
status = workerStatus();
assert.equal(status.workers.codex.mode, "stub");
assert.match(status.workers.codex.warning, /Unsupported worker mode/);

process.env.DOJO_WORKER_MODE = "cli";
process.env.DOJO_CODEX_SANDBOX = "read-only";
const codexReceipt = await executeWorker({ ...baseTask, agent: "codex" });
assert.equal(codexReceipt.status, "completed");
assert.equal(codexReceipt.exitCode, 0);
assert.match(codexReceipt.command, /exec --cd/);
assert.match(codexReceipt.stdout, /fake codex ok/);
assert.match(codexReceipt.stdout, /stdin=Ninja Dojo mission mission-worker-test/);

const claudeReceipt = await executeWorker({ ...baseTask, agent: "claude" });
assert.equal(claudeReceipt.status, "completed");
assert.equal(claudeReceipt.exitCode, 0);
assert.match(claudeReceipt.stdout, /fake claude ok/);
assert.match(claudeReceipt.command, /claude --print/);

console.log("worker tests passed");

function fakeCli(agent) {
  return `#!/usr/bin/env node
let stdin = "";
process.stdin.on("data", (chunk) => { stdin += chunk.toString(); });
process.stdin.on("end", () => {
  console.log("fake ${agent} ok");
  console.log("args=" + process.argv.slice(2).join(" "));
  console.log("stdin=" + stdin.split("\\n")[0]);
});
`;
}

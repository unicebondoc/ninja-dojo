import { spawn } from "node:child_process";
import { accessSync, constants } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";

const DEFAULT_TIMEOUT_MS = 5 * 60 * 1000;
const CODEX_BIN = process.env.DOJO_CODEX_BIN || "codex";
const CLAUDE_BIN = process.env.DOJO_CLAUDE_BIN || "claude";

export async function executeWorker(task) {
  if (workerMode(task.agent) === "cli") return executeCliWorker(task);

  await delay(Number(process.env.DOJO_STUB_WORKER_DELAY_MS || 350));
  if (task.agent === "claude") return claudeReceipt(task);
  return codexReceipt(task);
}

export function workerStatus() {
  return {
    cwd: workerCwd(),
    timeoutMs: workerTimeoutMs(),
    workers: {
      claude: workerDescriptor("claude"),
      codex: workerDescriptor("codex")
    }
  };
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function executeCliWorker(task) {
  const cwd = workerCwd();
  await access(cwd);

  if (task.agent === "claude") return executeClaudeCli(task, cwd);
  return executeCodexCli(task, cwd);
}

async function executeCodexCli(task, cwd) {
  const args = ["exec", "--cd", cwd, "--color", "never"];
  if (process.env.DOJO_CODEX_FULL_AUTO === "1") {
    args.push("--full-auto");
  } else {
    args.push("--sandbox", process.env.DOJO_CODEX_SANDBOX || "read-only");
  }
  if (process.env.DOJO_CODEX_MODEL) args.push("--model", process.env.DOJO_CODEX_MODEL);
  args.push("-");

  const result = await runCli(CODEX_BIN, args, promptFor(task), cwd);
  assertCliSuccess(result, "codex");
  return cliReceipt(task, {
    agent: "codex",
    command: `${CODEX_BIN} ${args.join(" ")}`,
    result,
    type: "execution"
  });
}

async function executeClaudeCli(task, cwd) {
  const args = ["--print", "--output-format", "text", "--permission-mode", process.env.DOJO_CLAUDE_PERMISSION_MODE || "default"];
  if (process.env.DOJO_CLAUDE_MODEL) args.push("--model", process.env.DOJO_CLAUDE_MODEL);
  args.push(promptFor(task));

  const result = await runCli(CLAUDE_BIN, args, "", cwd);
  assertCliSuccess(result, "claude");
  return cliReceipt(task, {
    agent: "claude",
    command: `${CLAUDE_BIN} --print ...`,
    result,
    type: "analysis"
  });
}

function workerMode(agent) {
  const perAgent = agent === "claude" ? process.env.DOJO_CLAUDE_WORKER : process.env.DOJO_CODEX_WORKER;
  return normalizeWorkerMode(perAgent || process.env.DOJO_WORKER_MODE || "stub").mode;
}

function workerDescriptor(agent) {
  const bin = agent === "claude" ? CLAUDE_BIN : CODEX_BIN;
  const requestedMode = (agent === "claude" ? process.env.DOJO_CLAUDE_WORKER : process.env.DOJO_CODEX_WORKER) || process.env.DOJO_WORKER_MODE || "stub";
  const mode = normalizeWorkerMode(requestedMode);
  const available = executableIsAvailable(bin);
  const descriptor = {
    available,
    bin,
    mode: mode.mode,
    ready: mode.mode === "stub" || available,
    requestedMode
  };
  if (mode.warning) descriptor.warning = mode.warning;
  if (mode.mode === "cli" && !available) descriptor.warning = `${agent} CLI binary '${bin}' is not executable; approved missions will fail until it is available.`;
  if (agent === "codex") descriptor.sandbox = process.env.DOJO_CODEX_SANDBOX || "read-only";
  return descriptor;
}

function normalizeWorkerMode(value) {
  const mode = String(value || "stub").trim().toLowerCase();
  if (mode === "cli" || mode === "stub") return { mode };
  return {
    mode: "stub",
    warning: `Unsupported worker mode '${value}'; using stub.`
  };
}

function executableIsAvailable(command) {
  if (!command) return false;
  if (command.includes("/")) return canExecute(command);

  return (process.env.PATH || "")
    .split(path.delimiter)
    .filter(Boolean)
    .some((dir) => canExecute(path.join(dir, command)));
}

function workerCwd() {
  return process.env.DOJO_WORKER_CWD || process.cwd();
}

function canExecute(filePath) {
  try {
    accessSync(filePath, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function workerTimeoutMs() {
  const timeoutMs = Number(process.env.DOJO_WORKER_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);
  if (!Number.isFinite(timeoutMs) || timeoutMs < 1000) return DEFAULT_TIMEOUT_MS;
  return timeoutMs;
}

function promptFor(task) {
  return [
    `Ninja Dojo mission ${task.id}`,
    `Title: ${task.title}`,
    `Department: ${task.department}`,
    `Context: ${task.context}`,
    "",
    task.prompt,
    "",
    "Return a concise completion receipt. Mention files changed, commands run, tests, and blockers."
  ].join("\n");
}

function runCli(command, args, stdin, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: process.env,
      stdio: ["pipe", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    const timeout = setTimeout(() => {
      child.kill("SIGTERM");
      const error = new Error(`Worker timed out after ${workerTimeoutMs()}ms.`);
      error.stdout = stdout;
      error.stderr = stderr;
      reject(error);
    }, workerTimeoutMs());

    child.stdout.on("data", (chunk) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.on("error", (error) => {
      clearTimeout(timeout);
      error.stdout = stdout;
      error.stderr = stderr;
      reject(error);
    });
    child.on("close", (exitCode) => {
      clearTimeout(timeout);
      resolve({ exitCode, stderr: stderr.trim(), stdout: stdout.trim() });
    });
    child.stdin.end(stdin);
  });
}

function assertCliSuccess(result, agent) {
  if (result.exitCode === 0) return;
  const error = new Error(`${agent} CLI worker exited with code ${result.exitCode}.`);
  error.stdout = result.stdout;
  error.stderr = result.stderr;
  throw error;
}

function cliReceipt(task, { agent, command, result, type }) {
  return {
    agent,
    artifacts: [],
    command,
    exitCode: result.exitCode,
    logs: [`${agent} CLI worker finished mission ${task.id}.`, `cwd=${workerCwd()}`],
    status: "completed",
    stderr: result.stderr,
    stdout: result.stdout,
    summary: `${agent} CLI worker completed the approved mission.`,
    taskId: task.id,
    type
  };
}

function codexReceipt(task) {
  return {
    agent: "codex",
    artifacts: [],
    exitCode: 0,
    logs: [
      `codex stub received approved task ${task.id}.`,
      "No codex exec process was launched.",
      "No files were modified."
    ],
    status: "stubbed",
    stderr: "",
    stdout: `Stub Codex response for ${task.title}`,
    summary: "Codex worker wire proven with a canned bridge receipt.",
    taskId: task.id,
    type: "plan"
  };
}

function claudeReceipt(task) {
  return {
    agent: "claude",
    artifacts: [],
    exitCode: null,
    insights: [
      `Analysis scope is ${task.department}: ${task.title}.`,
      "Approval authorized a stub analysis only.",
      "Use this receipt to verify lifecycle wiring before real worker execution."
    ],
    logs: [
      `claude stub received approved task ${task.id}.`,
      "No shell commands were run.",
      "No files were edited."
    ],
    recommendations: ["Keep PR1 focused on OpenClaw bridge wiring."],
    risks: ["This is not a real model analysis yet."],
    status: "stubbed",
    stderr: "",
    stdout: "",
    summary: "Claude worker wire proven with a canned bridge receipt.",
    taskId: task.id,
    type: "analysis"
  };
}

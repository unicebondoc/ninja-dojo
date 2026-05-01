// PR3 runs canned workers through the real Dojo queue. Real Codex/Claude execution is later v2 scope.
export async function executeWorker(task) {
  await delay(Number(process.env.DOJO_STUB_WORKER_DELAY_MS || 350));
  if (task.agent === "claude") return claudeReceipt(task);
  return codexReceipt(task);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

"""Dojo-controlled memory for the planner subagent.

Native `claude --agent` subagents drift in --print mode and skip
post-response tool calls. We get the same memory-compounding benefit
by managing the memory file in Python: read past-plans-for-this-repo
into the prompt as context, and append a summary line after the
planner returns valid JSON.
"""
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

MEMORY_PATH = Path.home() / ".claude" / "agent-memory" / "moji-planner" / "MEMORY.md"
MAX_PAST_PLANS_PER_REPO = 20


def read_memory_for_repo(repo_name: str) -> str:
    """Return a context block: lessons + recent plans for this repo.

    Empty string if memory file doesn't exist yet.
    """
    if not MEMORY_PATH.exists():
        return ""
    try:
        lines = MEMORY_PATH.read_text(encoding="utf-8").splitlines()
    except OSError:
        return ""

    lessons_block: list[str] = []
    in_lessons = False
    for line in lines:
        if line.strip().startswith("## Lessons"):
            in_lessons = True
            lessons_block.append(line)
            continue
        if in_lessons and line.strip().startswith("## "):
            break
        if in_lessons:
            lessons_block.append(line)

    past_plans: list[str] = []
    prefix_match = f"] {repo_name}:"
    for line in lines:
        if line.lstrip().startswith("[") and prefix_match in line:
            past_plans.append(line.rstrip())
    past_plans = past_plans[-MAX_PAST_PLANS_PER_REPO:]

    parts: list[str] = []
    if lessons_block:
        parts.append("\n".join(lessons_block).strip())
    if past_plans:
        parts.append(f"## Past plans for {repo_name}\n" + "\n".join(past_plans))
    return "\n\n".join(parts).strip()


def append_memory_line(repo_name: str, title: str, complexity: str, why: str) -> None:
    """Append one plan-summary line to MEMORY.md. Non-fatal on OSError."""
    ts = datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")
    line = f"[{ts}] {repo_name}: {title} ({complexity}) — {why}\n"
    try:
        MEMORY_PATH.parent.mkdir(parents=True, exist_ok=True)
        with MEMORY_PATH.open("a", encoding="utf-8") as f:
            f.write(line)
    except OSError as e:
        print(f"[memory] append failed (non-fatal): {e!r}", flush=True)

"""Spawn Claude Code as Miji-Builder to implement a Dojo issue."""
from __future__ import annotations

import subprocess
from pathlib import Path

from dojo.guard import assert_not_butler_brain

WORKSPACES = Path.home() / "ninja-clan" / "workspaces"
LOGS = Path.home() / "ninja-clan" / "ninja-dojo" / "logs"

BUILDER_PROMPT = """You are Miji-Builder. Read .dojo/context.md if it exists. Read GitHub issue #{n}.
Implement the smallest complete change that satisfies the acceptance criteria.
Run any lint/test/build commands defined in package.json or pyproject.toml before opening the PR.
Open PR against branch 'dojo-pilot' (not main). Title starting with "feat: ".
Update .dojo/context.md with a short build note. Commit, push, open PR via `gh pr create`.
"""


def spawn_builder(issue_number: int, repo: str) -> subprocess.Popen:
    ws = WORKSPACES / repo
    assert_not_butler_brain(ws)
    if not ws.exists():
        raise RuntimeError(f"workspace missing: {ws} — planner should have cloned it")
    subprocess.run(["git", "fetch", "origin"], cwd=ws, check=True)
    subprocess.run(
        ["git", "checkout", "-B", f"feat/issue-{issue_number}", "origin/dojo-pilot"],
        cwd=ws, check=False,
    )
    LOGS.mkdir(parents=True, exist_ok=True)
    log_path = LOGS / f"builder-{repo}-{issue_number}.log"
    log_fh = open(log_path, "ab")
    prompt = BUILDER_PROMPT.format(n=issue_number)
    return subprocess.Popen(
        ["claude", "--print", prompt],
        cwd=str(ws), stdout=log_fh, stderr=subprocess.STDOUT,
    )

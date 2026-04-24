"""Plan the smallest shippable next unit for a target repo."""
from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

from anthropic import Anthropic

from dojo import config
from dojo.guard import assert_not_butler_brain

WORKSPACES = Path.home() / "ninja-clan" / "workspaces"
GH_USER = "unicebondoc"
MODEL = "claude-sonnet-4-6"

PLANNER_PROMPT = """You are Moji. Given the following repo state, produce the SMALLEST
shippable next unit as a GitHub Issue. Return STRICT JSON ONLY, no prose, matching:
{{"title": str, "body": str, "acceptance_criteria": [str, ...], "labels": [str, ...], "complexity": "S"|"M"}}
Never exceed complexity M. Keep acceptance_criteria testable, one bullet per item.

--- Repo: {repo} ---
Recent commits:
{git_log}

Open TODO/FIXME markers:
{todos}
"""


def _ensure_workspace(repo: str) -> Path:
    WORKSPACES.mkdir(parents=True, exist_ok=True)
    path = WORKSPACES / repo
    assert_not_butler_brain(path)
    if not path.exists():
        subprocess.run(["gh", "repo", "clone", f"{GH_USER}/{repo}", str(path)], check=True)
    else:
        subprocess.run(["git", "pull", "--ff-only"], cwd=path, check=False)
    return path


def _git_log(path: Path) -> str:
    r = subprocess.run(["git", "log", "--oneline", "-20"], cwd=path, capture_output=True, text=True)
    return r.stdout.strip() or "(empty)"


def _todos(path: Path) -> str:
    cmd = ["grep", "-rn", "--include=*.py", "--include=*.ts", "--include=*.tsx",
           "--include=*.js", "-E", "TODO|FIXME", "."]
    r = subprocess.run(cmd, cwd=path, capture_output=True, text=True)
    return "\n".join(r.stdout.strip().splitlines()[:40]) or "(none)"


def plan_next_unit(repo: str) -> dict:
    assert_not_butler_brain(WORKSPACES / repo)
    ws = _ensure_workspace(repo)
    prompt = PLANNER_PROMPT.format(repo=repo, git_log=_git_log(ws), todos=_todos(ws))
    client = Anthropic(api_key=config.ANTHROPIC_API_KEY)
    msg = client.messages.create(
        model=MODEL, max_tokens=2048,
        messages=[{"role": "user", "content": prompt}],
    )
    text = msg.content[0].text
    match = re.search(r"\{[\s\S]*\}", text)
    if not match:
        raise ValueError(f"Planner returned non-JSON: {text[:200]}")
    return json.loads(match.group(0))

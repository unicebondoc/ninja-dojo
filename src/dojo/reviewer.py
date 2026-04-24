"""Spawn Claude Code as Miji-Reviewer in a fresh workspace."""
from __future__ import annotations

import subprocess
from pathlib import Path

from dojo.guard import assert_not_butler_brain

REVIEW_ROOT = Path.home() / "ninja-clan" / "review-workspaces"
LOGS = Path.home() / "ninja-clan" / "ninja-dojo" / "logs"
GH_USER = "unicebondoc"

REVIEWER_PROMPT = """You are Miji-Reviewer. You did NOT write this code. Assume it is broken.
Read the PR diff, linked issue, and .dojo/context.md. Find bugs, security issues, missing tests,
bad patterns. Cite line numbers. Do NOT rewrite — only comment.
End by running exactly one of:
  gh pr review {pr} --approve --body "<concise summary>"
  gh pr review {pr} --request-changes --body "<findings with line refs>"
"""


def spawn_reviewer(pr_number: int, repo: str) -> subprocess.Popen:
    workdir = REVIEW_ROOT / f"{repo}-{pr_number}"
    assert_not_butler_brain(workdir)
    REVIEW_ROOT.mkdir(parents=True, exist_ok=True)
    if not workdir.exists():
        subprocess.run(
            ["gh", "repo", "clone", f"{GH_USER}/{repo}", str(workdir)], check=True,
        )
    subprocess.run(["gh", "pr", "checkout", str(pr_number)], cwd=workdir, check=True)
    LOGS.mkdir(parents=True, exist_ok=True)
    log_fh = open(LOGS / f"reviewer-{repo}-{pr_number}.log", "ab")
    prompt = REVIEWER_PROMPT.format(pr=pr_number)
    return subprocess.Popen(
        ["claude", "--print", prompt],
        cwd=str(workdir), stdout=log_fh, stderr=subprocess.STDOUT,
    )

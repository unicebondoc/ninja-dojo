"""Plan the smallest shippable next unit for a target repo.

Uses the `claude` CLI subprocess (Max-plan OAuth via ~/.claude/.credentials.json),
matching builder.py and reviewer.py. No Anthropic API key, no per-call billing.
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import tempfile
import time
import traceback
from pathlib import Path

from dojo.guard import assert_not_butler_brain
from dojo.memory import append_memory_line, read_memory_for_repo

WORKSPACES = Path.home() / "ninja-clan" / "workspaces"
LOG_DIR = Path.home() / "ninja-clan" / "ninja-dojo" / "logs"
GH_USER = "unicebondoc"


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


def _write_hang_log(repo: str, prompt: str, e: subprocess.TimeoutExpired) -> None:
    try:
        LOG_DIR.mkdir(parents=True, exist_ok=True)
        ts = int(time.time())
        path = LOG_DIR / f"planner-hang-{repo}-{ts}.log"
        pout = e.stdout or b"" if isinstance(e.stdout, bytes) else (e.stdout or "")
        perr = e.stderr or b"" if isinstance(e.stderr, bytes) else (e.stderr or "")
        if isinstance(pout, bytes):
            pout = pout.decode("utf-8", errors="replace")
        if isinstance(perr, bytes):
            perr = perr.decode("utf-8", errors="replace")
        with open(path, "w") as f:
            f.write(f"=== planner hang at {ts} ({time.ctime(ts)}) ===\n")
            f.write(f"repo: {repo}\ncmd: {e.cmd}\ntimeout: {e.timeout}\nprompt_bytes: {len(prompt)}\n")
            f.write("env_subset:\n")
            for k in ("HOME", "PATH", "USER", "XDG_CONFIG_HOME", "CLAUDE_CONFIG_DIR"):
                f.write(f"  {k}={os.environ.get(k, '<unset>')}\n")
            f.write(f"\n=== partial_stdout ({len(pout)} chars) ===\n{pout[-8000:]}\n")
            f.write(f"\n=== partial_stderr ({len(perr)} chars) ===\n{perr[-8000:]}\n")
            f.write(f"\n=== python stack ===\n{traceback.format_exc()}\n")
    except Exception as log_err:
        print(f"forensic log write failed: {log_err}", flush=True)


def plan_next_unit(repo: str) -> dict:
    assert_not_butler_brain(WORKSPACES / repo)
    ws = _ensure_workspace(repo)
    git_log_output = _git_log(ws)
    todos_output = _todos(ws)
    memory_context = read_memory_for_repo(repo)

    planner_prompt = f"""You are Moji, planner for Ninja Dojo.

Produce the SMALLEST shippable next unit for repo `{repo}` as a GitHub
Issue. Complexity S or M only, never L. Respect sacred paths (never touch
~/ninja-butler-brain/). Use $0 stack (no ANTHROPIC_API_KEY, no anthropic SDK).

{memory_context if memory_context else "(No prior memory — this is the first plan.)"}

## Current repo state

Workspace: {ws}

Recent git log:
{git_log_output}

TODOs/FIXMEs:
{todos_output}

## Output contract

Return STRICT JSON ONLY. No markdown fences. No prose before or after.
Schema:
{{
  "title": "string (max 80 chars, imperative mood)",
  "body": "markdown with Context / Work / Out-of-scope / Why-smallest-next sections",
  "acceptance_criteria": ["concrete testable item", ...],
  "labels": ["string"],
  "complexity": "S" | "M",
  "why": "one-line summary for memory (max 120 chars, what makes this the right next unit)"
}}
"""

    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".txt", delete=False, encoding="utf-8"
    ) as tf:
        tf.write(planner_prompt)
        prompt_path = tf.name
    try:
        with open(prompt_path) as stdin_fh:
            result = subprocess.run(
                ["claude", "--print", "--output-format", "json"],
                stdin=stdin_fh,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=300,
                check=False,
            )
    except subprocess.TimeoutExpired as e:
        _write_hang_log(repo, planner_prompt, e)
        raise
    finally:
        try:
            os.unlink(prompt_path)
        except OSError:
            pass

    if result.returncode != 0:
        raise RuntimeError(
            f"claude CLI failed (exit {result.returncode}): stderr={result.stderr[:500]!r}"
        )

    try:
        envelope = json.loads(result.stdout)
        assistant_text = envelope.get("result") or envelope.get("text") or ""
    except json.JSONDecodeError:
        assistant_text = result.stdout

    match = re.search(r"\{[\s\S]*\}", assistant_text)
    if not match:
        raise RuntimeError(
            f"planner returned no JSON object:\nraw={assistant_text[:500]!r}"
        )
    try:
        plan = json.loads(match.group(0))
    except json.JSONDecodeError as e:
        raise RuntimeError(
            f"planner returned malformed JSON:\nraw={assistant_text[:500]!r}\nerror={e}"
        ) from e

    required_keys = {"title", "body", "acceptance_criteria", "labels", "complexity", "why"}
    missing = required_keys - set(plan.keys())
    if missing:
        raise RuntimeError(f"planner output missing keys: {missing}")

    try:
        append_memory_line(
            repo_name=repo,
            title=plan["title"],
            complexity=plan["complexity"],
            why=plan.get("why", "(no why provided)"),
        )
    except Exception as e:
        print(f"[memory] append failed (non-fatal): {e!r}", flush=True)

    return plan

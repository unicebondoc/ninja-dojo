"""Slack Bolt app: slash commands, message regex, button actions.

Slash handlers ack() within Slack's 3s deadline and defer heavy work
(planner → issue → builder spawn, ~20-30s) to background threads.
"""
from __future__ import annotations

import json
import re
import subprocess
import threading
from pathlib import Path

from slack_bolt import App
from slack_bolt.adapter.flask import SlackRequestHandler

from dojo import config
from dojo.builder import spawn_builder
from dojo.planner import plan_next_unit

PAUSE_DIR = Path("/tmp")
GH_USER = "unicebondoc"
SHIP_RE = re.compile(r"@moji\s+ship\s+next\s+in\s+([\w.-]+)", re.I)

bolt = App(token=config.SLACK_BOT_TOKEN, signing_secret=config.SLACK_SIGNING_SECRET)
bolt_handler = SlackRequestHandler(bolt)


def _paused(repo: str) -> bool:
    return (PAUSE_DIR / f"dojo-paused-{repo}").exists()


def _create_issue(repo: str, plan: dict) -> dict:
    body = plan["body"] + "\n\n## Acceptance criteria\n" + "\n".join(
        f"- [ ] {c}" for c in plan.get("acceptance_criteria", [])
    )
    args = ["gh", "issue", "create", "-R", f"{GH_USER}/{repo}",
            "-t", plan["title"], "-b", body]
    labels = ",".join(plan.get("labels", []))
    if labels:
        args += ["-l", labels]
    r = subprocess.run(args, capture_output=True, text=True, check=True)
    url = r.stdout.strip()
    return {"number": int(url.rsplit("/", 1)[-1]), "html_url": url}


def _repo_arg(command) -> str:
    return (command.get("text") or "").strip()


def _ship_background(repo: str, channel_id: str, client) -> None:
    try:
        if _paused(repo):
            client.chat_postMessage(
                channel=channel_id,
                text=f"⏸ `{repo}` is paused. `/moji-resume {repo}` first.",
            )
            return
        plan = plan_next_unit(repo)
        issue = _create_issue(repo, plan)
        pid = spawn_builder(issue["number"], repo).pid
        client.chat_postMessage(
            channel=channel_id,
            text=(
                f"🥷 `{repo}`: issue #{issue['number']} *{plan['title']}* — "
                f"Builder spawned (PID {pid}). <{issue['html_url']}|View issue>"
            ),
        )
    except Exception as e:
        client.chat_postMessage(channel=channel_id, text=f"❌ `{repo}` ship failed: {e!r}")


def _whats_next_background(repo: str, channel_id: str, client) -> None:
    try:
        plan = plan_next_unit(repo)
        client.chat_postMessage(
            channel=channel_id,
            text=f"🔮 *Would build:* {plan['title']}\n```{json.dumps(plan, indent=2)}```",
        )
    except Exception as e:
        client.chat_postMessage(channel=channel_id, text=f"❌ `{repo}` planner failed: {e!r}")


@bolt.command("/moji-ship")
def _cmd_ship(ack, respond, command, client):
    ack()
    repo = _repo_arg(command)
    if not repo:
        respond("Usage: /moji-ship <repo>")
        return
    respond(f"🥷 <@{command['user_id']}> planning next unit for `{repo}`... (~30s)")
    threading.Thread(
        target=_ship_background,
        args=(repo, command["channel_id"], client),
        daemon=True,
    ).start()


@bolt.command("/moji-whats-next")
def _cmd_whats_next(ack, respond, command, client):
    ack()
    repo = _repo_arg(command)
    if not repo:
        respond("Usage: /moji-whats-next <repo>")
        return
    respond(f"🔮 Dry-running planner for `{repo}`... (~30s)")
    threading.Thread(
        target=_whats_next_background,
        args=(repo, command["channel_id"], client),
        daemon=True,
    ).start()


@bolt.command("/moji-pause")
def _cmd_pause(ack, respond, command):
    ack()
    repo = _repo_arg(command)
    (PAUSE_DIR / f"dojo-paused-{repo}").touch()
    respond(f"⏸ paused {repo}")


@bolt.command("/moji-resume")
def _cmd_resume(ack, respond, command):
    ack()
    repo = _repo_arg(command)
    (PAUSE_DIR / f"dojo-paused-{repo}").unlink(missing_ok=True)
    respond(f"▶ resumed {repo}")


@bolt.command("/moji-status")
def _cmd_status(ack, respond, command):
    ack()
    r = subprocess.run(
        ["gh", "search", "prs", "--owner", GH_USER, "--state", "open",
         "--head", "feat/issue-", "--json", "repository,number,title,url"],
        capture_output=True, text=True,
    )
    try:
        prs = json.loads(r.stdout or "[]")
    except json.JSONDecodeError:
        prs = []
    if not prs:
        respond("No in-flight Dojo PRs.")
        return
    respond("\n".join(
        f"• {p['repository']['name']} #{p['number']}: {p['title']} — {p['url']}" for p in prs
    ))


@bolt.message(SHIP_RE)
def _msg_ship(message, say, client):
    m = SHIP_RE.search(message.get("text", ""))
    if not m:
        return
    repo = m.group(1)
    channel_id = message["channel"]
    say(f"🥷 planning next unit for `{repo}`... (~30s)")
    threading.Thread(
        target=_ship_background,
        args=(repo, channel_id, client),
        daemon=True,
    ).start()


@bolt.action("approve_pr")
def _btn_approve(ack, body, respond):
    ack()
    v = json.loads(body["actions"][0]["value"])
    subprocess.run(
        ["gh", "pr", "merge", str(v["pr"]), "-R", f"{GH_USER}/{v['repo']}",
         "--squash", "--delete-branch"], check=True,
    )
    respond(f"✅ merged {v['repo']} #{v['pr']}")


@bolt.action("reject_pr")
def _btn_reject(ack, body, respond):
    ack()
    v = json.loads(body["actions"][0]["value"])
    subprocess.run(["gh", "pr", "close", str(v["pr"]), "-R", f"{GH_USER}/{v['repo']}"], check=True)
    respond(f"🛑 rejected {v['repo']} #{v['pr']}")

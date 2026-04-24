"""GitHub webhook receiver."""
from __future__ import annotations

import hashlib
import hmac
from pathlib import Path

from flask import Blueprint, abort, request

from dojo import config
from dojo.approval_card import send_approval_card
from dojo.reviewer import spawn_reviewer

bp = Blueprint("github_webhook", __name__)
PAUSE_DIR = Path("/tmp")


def _verify(req) -> None:
    sig = req.headers.get("X-Hub-Signature-256", "")
    if not sig.startswith("sha256="):
        abort(400, "missing signature")
    mac = hmac.new(
        config.GITHUB_WEBHOOK_SECRET.encode(), req.get_data(), hashlib.sha256,
    ).hexdigest()
    if not hmac.compare_digest(f"sha256={mac}", sig):
        abort(401, "bad signature")


@bp.route("/github-webhook", methods=["POST"])
def hook():
    _verify(request)
    event = request.headers.get("X-GitHub-Event", "")
    payload = request.get_json(silent=True) or {}
    action = payload.get("action", "")

    if event == "pull_request" and action == "opened":
        branch = payload["pull_request"]["head"]["ref"]
        if branch.startswith("feat/issue-"):
            return {"ok": True, "action": "logged-open"}

    if event == "check_run" and action == "completed":
        cr = payload.get("check_run", {})
        if cr.get("conclusion") == "success":
            repo = payload.get("repository", {}).get("name", "")
            for pr in cr.get("pull_requests", []):
                num = pr.get("number")
                if num and repo:
                    spawn_reviewer(num, repo)
            return {"ok": True, "action": "reviewer-spawned"}

    if event == "pull_request_review" and action == "submitted":
        if payload.get("review", {}).get("state") == "approved":
            send_approval_card(payload)
            return {"ok": True, "action": "approval-card-sent"}

    if event == "pull_request" and action == "closed" and payload["pull_request"].get("merged"):
        repo = payload["repository"]["name"]
        if not (PAUSE_DIR / f"dojo-paused-{repo}").exists():
            (PAUSE_DIR / f"dojo-chain-{repo}").touch()
        return {"ok": True, "action": "chain-queued"}

    return {"ok": True, "action": "ignored", "event": event}

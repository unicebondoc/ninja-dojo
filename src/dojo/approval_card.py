"""Post Block Kit approval card to MOJI_DIARY_CHANNEL."""
from __future__ import annotations

import json

from slack_sdk import WebClient

from dojo import config


def _client() -> WebClient:
    return WebClient(token=config.SLACK_BOT_TOKEN)


def send_approval_card(pr_data: dict) -> None:
    pr = pr_data["pull_request"]
    repo = pr_data["repository"]["name"]
    num = pr["number"]
    value = json.dumps({"repo": repo, "pr": num})
    review_state = pr_data.get("review", {}).get("state", "approved")
    blocks = [
        {"type": "header", "text": {"type": "plain_text", "text": f"🥷 PR #{num} ready for your review"}},
        {"type": "section", "fields": [
            {"type": "mrkdwn", "text": f"*Repo*\n{repo}"},
            {"type": "mrkdwn", "text": f"*Title*\n{pr['title']}"},
            {"type": "mrkdwn", "text": f"*Changes*\n+{pr.get('additions', 0)} / -{pr.get('deletions', 0)} "
                                       f"({pr.get('changed_files', 0)} files)"},
            {"type": "mrkdwn", "text": f"*Reviewer*\n{review_state}"},
        ]},
        {"type": "actions", "elements": [
            {"type": "button", "style": "primary",
             "text": {"type": "plain_text", "text": "Approve & Merge"},
             "action_id": "approve_pr", "value": value},
            {"type": "button", "text": {"type": "plain_text", "text": "View Diff"}, "url": pr["html_url"]},
            {"type": "button", "style": "danger",
             "text": {"type": "plain_text", "text": "Reject"},
             "action_id": "reject_pr", "value": value},
        ]},
    ]
    _client().chat_postMessage(
        channel=config.MOJI_DIARY_CHANNEL_ID, blocks=blocks,
        text=f"PR #{num} ready for review in {repo}",
    )

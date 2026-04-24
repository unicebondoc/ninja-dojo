from __future__ import annotations

from unittest.mock import MagicMock, patch

from dojo import planner

PLAN_JSON = """{
  "title": "Add health check endpoint",
  "body": "Add /health for uptime monitoring.",
  "acceptance_criteria": ["GET /health returns 200", "Body contains service name"],
  "labels": ["enhancement"],
  "complexity": "S"
}"""


def test_plan_next_unit_returns_valid_schema():
    fake_msg = MagicMock()
    fake_msg.content = [MagicMock(text=PLAN_JSON)]
    fake_client = MagicMock()
    fake_client.messages.create.return_value = fake_msg

    with patch("dojo.planner._ensure_workspace", return_value=None), \
         patch("dojo.planner._git_log", return_value="abc init"), \
         patch("dojo.planner._todos", return_value="(none)"), \
         patch("dojo.planner.Anthropic", return_value=fake_client):
        result = planner.plan_next_unit("ninja-publisher")

    assert set(result) >= {"title", "body", "acceptance_criteria", "labels", "complexity"}
    assert result["complexity"] in ("S", "M")
    assert isinstance(result["acceptance_criteria"], list)

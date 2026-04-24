from __future__ import annotations

import json
from unittest.mock import MagicMock, patch

from dojo import planner


def test_plan_next_unit_returns_valid_schema():
    inner_plan = {
        "title": "Test title",
        "body": "Test body",
        "acceptance_criteria": ["a", "b"],
        "labels": ["test"],
        "complexity": "S",
    }
    fake_result = MagicMock(
        returncode=0,
        stdout=json.dumps({"type": "result", "result": json.dumps(inner_plan)}),
        stderr="",
    )

    with patch("dojo.planner._ensure_workspace", return_value=None), \
         patch("dojo.planner._git_log", return_value="abc init"), \
         patch("dojo.planner._todos", return_value="(none)"), \
         patch("dojo.planner.subprocess.run", return_value=fake_result):
        result = planner.plan_next_unit("ninja-publisher")

    assert set(result) >= {"title", "body", "acceptance_criteria", "labels", "complexity"}
    assert result["complexity"] in ("S", "M", "L")
    assert isinstance(result["acceptance_criteria"], list)

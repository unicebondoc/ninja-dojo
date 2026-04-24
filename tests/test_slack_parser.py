from __future__ import annotations

from unittest.mock import MagicMock, patch

import pytest

from dojo import slack_handler
from dojo.slack_handler import SHIP_RE


@pytest.mark.parametrize("text,expected", [
    ("@moji ship next in ninja-publisher", "ninja-publisher"),
    ("@Moji Ship Next In ninja-dojo", "ninja-dojo"),
    ("hey @moji  ship  next  in   my-repo please", "my-repo"),
])
def test_ship_re_matches(text, expected):
    m = SHIP_RE.search(text)
    assert m is not None
    assert m.group(1) == expected


@pytest.mark.parametrize("text", ["ship next", "@moji hi", "ship next in foo"])
def test_ship_re_no_match(text):
    assert SHIP_RE.search(text) is None


def test_cmd_ship_acks_and_defers_to_background_thread():
    ack, respond, client = MagicMock(), MagicMock(), MagicMock()
    command = {"text": "ninja-publisher", "user_id": "U1", "channel_id": "C1"}
    with patch("dojo.slack_handler.threading.Thread") as MockThread, \
         patch("dojo.slack_handler.plan_next_unit",
               side_effect=AssertionError("planner must not run synchronously")):
        slack_handler._cmd_ship(ack=ack, respond=respond, command=command, client=client)
    ack.assert_called_once()
    respond.assert_called_once()
    MockThread.assert_called_once()
    MockThread.return_value.start.assert_called_once()


def test_cmd_whats_next_acks_and_defers_to_background_thread():
    ack, respond, client = MagicMock(), MagicMock(), MagicMock()
    command = {"text": "ninja-publisher", "user_id": "U1", "channel_id": "C1"}
    with patch("dojo.slack_handler.threading.Thread") as MockThread, \
         patch("dojo.slack_handler.plan_next_unit",
               side_effect=AssertionError("planner must not run synchronously")):
        slack_handler._cmd_whats_next(ack=ack, respond=respond, command=command, client=client)
    ack.assert_called_once()
    respond.assert_called_once()
    MockThread.assert_called_once()
    MockThread.return_value.start.assert_called_once()


def test_ensure_labels_exist_creates_missing_skips_existing():
    list_result = MagicMock(returncode=0, stdout="bug\nenhancement\n", stderr="")
    create_result = MagicMock(returncode=0, stdout="", stderr="")
    calls = []

    def fake_run(cmd, **kwargs):
        calls.append(cmd)
        if "list" in cmd:
            return list_result
        return create_result

    with patch("dojo.slack_handler.subprocess.run", side_effect=fake_run):
        slack_handler._ensure_labels_exist("x/y", ["bug", "new-label", "other"])

    list_calls = [c for c in calls if "list" in c]
    create_calls = [c for c in calls if "create" in c]
    assert len(list_calls) == 1
    # Each `gh label create` cmd has the label name at index 3
    created_names = sorted(c[3] for c in create_calls)
    assert created_names == ["new-label", "other"]


def test_ensure_labels_exist_noop_on_empty_list():
    with patch("dojo.slack_handler.subprocess.run") as mrun:
        slack_handler._ensure_labels_exist("x/y", [])
    mrun.assert_not_called()

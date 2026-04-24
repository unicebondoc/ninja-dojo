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

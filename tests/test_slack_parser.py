from __future__ import annotations

import pytest

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

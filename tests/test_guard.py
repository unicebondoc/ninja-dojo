from __future__ import annotations

from pathlib import Path

import pytest

from dojo.guard import SACRED, assert_not_butler_brain


def test_sacred_path_raises():
    with pytest.raises(RuntimeError, match="SACRED"):
        assert_not_butler_brain(SACRED / "anything" / "deep")


def test_sacred_self_raises():
    with pytest.raises(RuntimeError):
        assert_not_butler_brain(SACRED)


def test_safe_paths_ok():
    assert_not_butler_brain(Path.home() / "ninja-clan")
    assert_not_butler_brain(Path("/tmp"))
    assert_not_butler_brain(Path.home() / "ninja-clan" / "ninja-dojo")

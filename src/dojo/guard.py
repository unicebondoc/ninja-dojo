"""Sacred boundary guard. Every module that touches filesystem paths must call this."""
from __future__ import annotations

from pathlib import Path

SACRED = Path.home() / "ninja-butler-brain"


def assert_not_butler_brain(path) -> None:
    p = Path(path).resolve()
    sacred = SACRED.resolve() if SACRED.exists() else SACRED
    if p == sacred or sacred in p.parents:
        raise RuntimeError(f"SACRED boundary violation: {p} is at or under {SACRED}")

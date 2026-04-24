from __future__ import annotations

from dojo import memory

SAMPLE = """# Moji Planner Memory

## Lessons (curate — keep this section)

- Small > big.
- Concrete over vague.

## Unice's context

- stuff about Unice

## Past plans I've produced for each repo

### ninja-publisher
_(none yet)_

[2026-04-20T10:00:00+10:00] ninja-publisher: Phase X (S) — because X
[2026-04-21T10:00:00+10:00] landlit: Sprint 2 setup (M) — because landlit
[2026-04-22T10:00:00+10:00] ninja-publisher: Phase Y (M) — because Y
"""


def test_read_memory_for_repo_returns_lessons_and_recent_plans(tmp_path, monkeypatch):
    mem = tmp_path / "MEMORY.md"
    mem.write_text(SAMPLE, encoding="utf-8")
    monkeypatch.setattr(memory, "MEMORY_PATH", mem)

    out = memory.read_memory_for_repo("ninja-publisher")

    assert "## Lessons" in out
    assert "Small > big" in out
    assert "ninja-publisher: Phase X (S)" in out
    assert "ninja-publisher: Phase Y (M)" in out
    # Other repos' plans must not leak
    assert "landlit" not in out
    # "Unice's context" section is NOT part of lessons; should stop at it
    assert "Unice" not in out


def test_read_memory_for_repo_missing_file_returns_empty(tmp_path, monkeypatch):
    monkeypatch.setattr(memory, "MEMORY_PATH", tmp_path / "does-not-exist.md")
    assert memory.read_memory_for_repo("ninja-publisher") == ""


def test_append_memory_line_appends_formatted_line(tmp_path, monkeypatch):
    mem = tmp_path / "MEMORY.md"
    mem.write_text("seed\n", encoding="utf-8")
    monkeypatch.setattr(memory, "MEMORY_PATH", mem)

    memory.append_memory_line(
        repo_name="ninja-publisher",
        title="Phase Z: smoke test",
        complexity="S",
        why="verifies the full stack end to end",
    )

    content = mem.read_text(encoding="utf-8")
    lines = content.splitlines()
    assert lines[0] == "seed"
    last = lines[-1]
    assert last.startswith("[")
    assert "] ninja-publisher: Phase Z: smoke test (S) — verifies the full stack end to end" in last


def test_append_memory_line_creates_parent_dir(tmp_path, monkeypatch):
    target = tmp_path / "nested" / "deeper" / "MEMORY.md"
    monkeypatch.setattr(memory, "MEMORY_PATH", target)
    memory.append_memory_line("r", "t", "S", "w")
    assert target.exists()
    assert target.read_text().startswith("[")

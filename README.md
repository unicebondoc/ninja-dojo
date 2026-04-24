# ninja-dojo

Autonomous multi-agent build loop for Unice's repos.

## Flow

```
Slack /moji-ship <repo>
  → Planner (Claude Sonnet) drafts GitHub Issue
  → Builder (Claude Code subprocess) implements, opens PR on `dojo-pilot`
  → GitHub check_run success → Reviewer (fresh Claude Code session)
  → Reviewer approves + CI green → Slack card with Approve/Reject
  → Human approves → gh pr merge → next unit in chain
```

## Slack commands

- `/moji-ship <repo>` — plan + build next smallest unit
- `/moji-whats-next <repo>` — dry-run planner
- `/moji-status` — list in-flight Dojo PRs
- `/moji-pause <repo>` / `/moji-resume <repo>`
- `@moji ship next in <repo>` — natural language, same as /moji-ship

## Dev

```bash
uv sync --extra dev
uv run pytest
uv run dojo-server   # binds 127.0.0.1:8787
```

## Spec

Notion: v3 Ninja Dojo ("@moji ship next" model).

## Sacred boundary

`~/ninja-butler-brain/` is never read, written, or traversed. Every module calls
`dojo.guard.assert_not_butler_brain()` on any filesystem path.

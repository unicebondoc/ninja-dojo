# Dojo Protocol Context

**DOJO_PROTOCOL_VERSION=1**

## Sacred rules
- `~/ninja-butler-brain/` is never touched. Every Python module must call `assert_not_butler_brain()` on any filesystem path it uses.
- Dojo service binds `127.0.0.1:8787`. Public via nginx `butler.unicebondoc.com/dojo/`.
- Builders open PRs against `dojo-pilot` branch, never `main`.
- Reviewers run in fresh workspaces at `~/ninja-clan/review-workspaces/<repo>-<pr>/` and post verdicts via `gh pr review`.

## PR append-history format

Each PR must update this file with a block:

```
## PR #<n> — <title> — <YYYY-MM-DD>
- Summary: <1-2 lines>
- Files changed: <count>
- Reviewer verdict: <approve|changes>
```

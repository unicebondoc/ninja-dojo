# 🥷 Ninja Dojo — Codex Charter

This document defines the canonical product vision for Ninja Dojo.
All Codex work must align with this charter unless Unice explicitly
overrides it in writing.

## Canonical Product

Ninja Dojo is a **read-only living kunoichi village** — a Ghibli-style
2D game window into Unice's autonomous agent clan.

The user opens `/` and sees a beautiful, animated village where six
chibi kunoichi (Moji, Miji, Maji, Meji, Muji, Meowts) and a white cat
(Tyche) live their lives. Characters walk, talk, work, wave, sit, and
react to real WebSocket lifecycle events emitted by the existing Express
backend. Discord, API calls, and internal scripts drive the agent work
elsewhere — the village is the **window**, not the **control panel**.

## What Belongs On The Main `/` View

✅ Full-screen Phaser village scene
✅ Painted multi-layer parallax background
✅ Six kunoichi sprites with full animation libraries
✅ Tyche the cat
✅ Speech bubbles tied to real lifecycle events
✅ Interior peek (hover/click huts to see inside)
✅ Twin moons in the sky (eternal = backend health, earned = sprint progress)
✅ Falling cherry blossom petals
✅ Optional minimal connection status indicator (small, faded, corner)

## What Does NOT Belong On The Main `/` View

❌ HUD overlays
❌ Mission input forms ("Drop a mission scroll" textbox)
❌ Sidebars listing missions, receipts, runs, queues
❌ Stat bars at screen edges
❌ "Send Scroll" or "Create" buttons
❌ Run loop status panels
❌ Pending gate panels
❌ Event stream lists
❌ Marketing copy or hero headlines
❌ Cookie banners, modals, or popups outside the village interaction model

## Where Operational UI Belongs Instead

Useful debugging and operational views are NOT removed from the codebase.
They live behind the `?debug=true` query parameter on the same `/` route.
This keeps developer telemetry available without polluting the village.

`/api/workers/status` and other operational endpoints remain backend-only.
The village reads from them silently to drive in-world animations and
status banners — it does not show them as raw data.

## Drift Examples (DO NOT REPEAT)

Past PRs have drifted toward dashboard work. Do not:
- Add a "worker HUD strip" to the main view
- Add "Mission Board / Worker Plaza / Receipt Archive" boxes back
- Convert the village to a Next.js / React rebuild
- Add input fields where Discord already drives the system
- Re-skin the OpenClaw cockpit and call it a village

If a Codex prompt seems ambiguous between "village work" and "cockpit work",
the village interpretation always wins. When in doubt, ask Unice.

## Stack Lock

- Backend: Express + WebSocket + atomic JSON store (existing)
- Frontend: Phaser 3 + vanilla JS + plain CSS
- Asset generation: gpt-image-2 via Claude Max OAuth (NEVER OPENAI_API_KEY)
- No Next.js. No React. No TypeScript. No Tailwind. No build step beyond
  what already exists.

## Sacred Constraints

- `~/ninja-butler-brain/` — never read, write, cd, symlink. Forever.
- `.env` and credentials — never modified, never committed.
- Claude Max OAuth via `~/.claude/.credentials.json` — never
  `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` from environment.
- Backend route schemas — never broken without explicit approval.

## PR Sequence

- PR 1.4 — This charter + HUD quarantine (current)
- PR 1.5 — Mega village polish: flipbook animations, parallax background,
  interior peek, painterly ground, real cherry blossoms
- PR 1.6+ — Day/night cycle, sound, Discord wiring verification, real
  moon telemetry binding
- PR 2+ — Notion + end-to-end automation pipeline (only after PR 1.5
  ships clean)

## Author Note

Codex earns autonomy by shipping PRs that match the charter. End-to-end
automation is the reward for proven alignment, not the default.

— Locked: 2026-05-03 by Unice + Moji

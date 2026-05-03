# 🥷 Ninja Dojo — Codex Charter

This document defines the canonical product vision for Ninja Dojo.
All Codex work must align with this charter unless Unice explicitly
overrides it in writing.

## Canonical Product

Ninja Dojo is a **read-only living dojo compound** — a Sea of Stars-style
detailed pixel-art top-down 2D game window into Unice's autonomous
agent clan.

The user opens `/` and sees a compact pixel-art dojo compound where six
chibi kunoichi (Moji, Miji, Maji, Meji, Muji, Meowts) and a white cat
(Tyche) live their lives. Six huts surround a central plaza — each
kunoichi has her own hut. Characters walk between huts, work at their
stations, talk in pixel speech bubbles, and react to real WebSocket
lifecycle events emitted by the existing Express backend. Discord, API
calls, and internal scripts drive the agent work elsewhere — the dojo
is the **window**, not the **control panel**.

## Visual Direction

- **Style**: Sea of Stars / Persona 5-inspired detailed pixel art
- **Camera**: Strict top-down 2D (Pokémon, OpenClaw)
- **Size**: Compact — 1 viewport, no scrolling, whole compound visible
- **Interior reveal**: Cutaway — click a hut, roof slides up, interior
  visible in the same scene (no scene transition)
- **Aesthetic anchor**: Modern detailed pixel with vibrant palette,
  readable silhouettes, smooth animation cycles

## What Belongs On The Main `/` View

✅ Top-down pixel-art dojo compound at 1 viewport size
✅ Six pixel-art huts around a central plaza
✅ Tile-based ground (grass, stone path, plaza)
✅ Decorative pixel props (lanterns, pixel cherry blossom trees, fences)
✅ Six kunoichi pixel sprites with full animation libraries
✅ Tyche the cat pixel sprite
✅ Pixel-style speech bubbles tied to real lifecycle events
✅ Cutaway roof system (hover/click huts to see interior)
✅ Pixel twin moons in the sky strip at the top
✅ Optional minimal connection status indicator (small, faded, corner)

## What Does NOT Belong On The Main `/` View

❌ HUD overlays (those go behind `?debug=true`)
❌ Mission input forms
❌ Sidebars listing missions, receipts, runs, queues
❌ Stat bars at screen edges
❌ Marketing copy or hero headlines
❌ Modals or popups outside the cutaway interaction model
❌ Painted/illustrated aesthetic (Ghibli direction — see Sunday Mode below)
❌ Isometric 3/4 perspective (we're strict top-down now)
❌ Parallax backgrounds (top-down doesn't use parallax)
❌ Scrolling maps (compact 1-viewport only)

## Where Operational UI Belongs Instead

Useful debugging and operational views are NOT removed from the codebase.
They live behind the `?debug=true` query parameter on the same `/` route.
This keeps developer telemetry available without polluting the dojo.

`/api/workers/status` and other operational endpoints remain backend-only.
The dojo reads from them silently to drive in-world animations and
status banners — it does not show them as raw data.

## Sunday Mode (Deferred)

A previous PR sequence shipped a complete Ghibli soft-pastel painted
village preserved at the `ghibli-village-final` tag. Sprites archived
in `public/assets/village_ghibli_archive/`. Generation prompts in
`ASSETS_GHIBLI.md`.

Future PRs may surface this as a toggleable "Sunday Mode" — a peaceful
illustration view of the dojo contrasting with the operational pixel
game default. Not in scope for PR 2.x.

## Drift Examples (DO NOT REPEAT)

Past PRs have drifted toward dashboard work. Do not:
- Add a "worker HUD strip" to the main view
- Add "Mission Board / Worker Plaza / Receipt Archive" boxes back
- Convert the dojo to a Next.js / React rebuild
- Add input fields where Discord already drives the system
- Re-skin the OpenClaw cockpit and call it a dojo
- Mix Ghibli painted aesthetic with the new pixel direction
- Use isometric perspective when the charter says strict top-down
- Add scrolling/panning when the charter says compact 1-viewport

If a Codex prompt seems ambiguous between "dojo work" and "cockpit work",
the dojo interpretation always wins. When in doubt, ask Unice.

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
- DO NOT PUSH without explicit "go push" or "approved to push" from
  Unice in chat. The eye test is the final gate.

## PR Sequence

- PR 1.4 — Charter v1 + HUD quarantine (shipped)
- PR 1.4.5 — Worker adapter hardening with ready/warning fields (shipped)
- PR 1.5 — Mega Ghibli village build (shipped, archived)
- PR 1.6 — Ghibli grounding fix (committed locally, not pushed, archived)
- PR 2.0 — Pivot foundation (current): archive Ghibli, charter rewrite
- PR 2.1 — Pixel dojo compound skeleton: huts, ground, props (no characters)
- PR 2.2 — Pixel kunoichi + Tyche + WebSocket rewire
- PR 2.3 — Cutaway roof system: click hut to see interior
- PR 2.4+ — Notion + end-to-end automation pipeline

## Author Note

Codex earns autonomy by shipping PRs that match the charter. End-to-end
automation is the reward for proven alignment, not the default.

— Pivoted: 2026-05-03 by Unice + Moji
— Original locked: 2026-05-03 by Unice + Moji

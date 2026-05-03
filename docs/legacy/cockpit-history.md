# Legacy Cockpit History

These sections describe the OpenClaw cockpit lineage that preceded the
village vision. Preserved for archaeological reference. The canonical
product is now defined in /CODEX_CHARTER.md at repo root.

## PR0 / PR0.5 scope

- `GET /api/world`
- `GET /api/missions`
- `POST /api/missions`
- `POST /api/missions/:id/approve`
- Atomic `data/world.json` writes
- Mission engine, approval gate, persona registry, and worker stubs
- Three-zone HTML/canvas world UI
- WebSocket mission lifecycle events

## PR2 cockpit stabilization

- Browser cockpit includes mission creation, pending approval actions, recent missions, receipts, lifecycle events, worker mode status, and latest receipt HUD.
- Canvas mission sprites clear after each lifecycle animation instead of sticking in transit.
- `npm run test:curl` covers health, static cockpit markup, REST endpoints, OpenClaw bridge commands, and restores `data/world.json` after the smoke run.
- `npm run test:screenshot` captures the cockpit with Playwright.

## PR3 worker run loop

- Approval now moves missions through `queued`, `worker_running`, and `receipt_ready` instead of returning a synchronous receipt.
- `GET /api/runs/status` exposes active and queued worker runs.
- `GET /api/workers/status` exposes worker mode, binary, timeout, readiness, and working directory.
- WebSocket mission events include run-loop snapshots so the cockpit can show live queue state.
- Queued or interrupted worker runs are requeued when the local server restarts.
- Stub Codex/Claude workers still return canned receipts by default, but the worker layer can now invoke real local CLIs when explicitly enabled.

### Env-gated CLI workers

Default worker mode is `stub`. Set `DOJO_WORKER_MODE=cli` to enable both local CLIs, or set `DOJO_CODEX_WORKER=cli` / `DOJO_CLAUDE_WORKER=cli` per agent.

Useful knobs:

- `DOJO_WORKER_CWD=/home/uniceadmin/ninja-dojo`
- `DOJO_WORKER_TIMEOUT_MS=300000`
- `DOJO_CODEX_SANDBOX=read-only` by default
- `DOJO_CODEX_FULL_AUTO=1` to let Codex use its workspace-write full-auto mode
- `DOJO_CODEX_MODEL=...` or `DOJO_CLAUDE_MODEL=...`

`npm run test:workers` exercises stub mode, invalid mode fallback, timeout fallback, and fake Codex/Claude CLI execution without launching the real CLIs.

## PR1 OpenClaw bridge

OpenClaw can route Discord/channel messages into Dojo through either bridge endpoint:

- `POST /api/openclaw/messages`
- `POST /api/openclaw/bridge`

Mission envelopes accept `content`, `text`, `message`, `scroll`, or `prompt`, plus optional `agent`, `channelId`, `messageId`, `sender`, and `senderId` fields. Normal messages create pending missions with OpenClaw source metadata. Bridge commands are handled without creating duplicate missions:

- `/dojo status`
- `/dojo approve <mission-id>`
- `/dojo reject <mission-id>`
- `/dojo receipt <mission-id>`

The bridge writes through the same `world.json` store and emits the same lifecycle events used by the cockpit WebSocket stream.

Notion page fetch was attempted first, but the local Notion relay returned `Native hook relay unavailable`. Implementation followed the locked PR0 scope from Discord plus local v1 source inspection.

# Ninja Dojo v2

Fresh Express/WebSocket world UI shell for Ninja Dojo v2.

## Run

```bash
npm install
npm run dev:dojo
```

Server binds `127.0.0.1:3458`. The run-loop script reuses a healthy local server, writes logs under `logs/`, and waits for `/api/health` before returning.

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

- Browser cockpit includes mission creation, pending approval actions, recent missions, receipts, and lifecycle events.
- Canvas mission sprites clear after each lifecycle animation instead of sticking in transit.
- `npm run test:curl` covers health, static cockpit markup, REST endpoints, OpenClaw bridge commands, and restores `data/world.json` after the smoke run.
- `npm run test:screenshot` captures the cockpit with Playwright.

## PR3 worker run loop

- Approval now moves missions through `queued`, `worker_running`, and `receipt_ready` instead of returning a synchronous receipt.
- `GET /api/runs/status` exposes active and queued worker runs.
- WebSocket mission events include run-loop snapshots so the cockpit can show live queue state.
- Queued or interrupted worker runs are requeued when the local server restarts.
- Stub Codex/Claude workers still return canned receipts, but they now execute through the same queue path intended for real workers.

## PR1 OpenClaw bridge

OpenClaw can route Discord/channel messages into Dojo through either bridge endpoint:

- `POST /api/openclaw/messages`
- `POST /api/openclaw/bridge`

Mission envelopes accept `content`, `text`, `message`, `scroll`, or `prompt`, plus optional `agent`, `channelId`, `messageId`, `sender`, and `senderId` fields. Normal messages create pending missions with OpenClaw source metadata. Bridge commands are handled without creating duplicate missions:

- `/dojo status`
- `/dojo approve <mission-id>`
- `/dojo reject <mission-id>`

The bridge writes through the same `world.json` store and emits the same lifecycle events used by the cockpit WebSocket stream.

Notion page fetch was attempted first, but the local Notion relay returned `Native hook relay unavailable`. Implementation followed the locked PR0 scope from Discord plus local v1 source inspection.

# Ninja Dojo

A read-only living kunoichi village — Unice's autonomous agent clan
visualized as a Ghibli-style 2D game.

## Run

```
npm install
npm run dev:dojo
```

Server binds `127.0.0.1:3458`. Open in a browser to see the village.

## Canonical Vision

See [`CODEX_CHARTER.md`](./CODEX_CHARTER.md) for the locked product
vision and PR sequence.

## Debug Mode

Append `?debug=true` to the URL to surface operational HUDs, worker
status overlays, and lifecycle event streams. Default view is the
village only.

## Architecture History

See [`docs/legacy/cockpit-history.md`](./docs/legacy/cockpit-history.md)
for the OpenClaw cockpit lineage that preceded the village.

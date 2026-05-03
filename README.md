# Ninja Dojo

A read-only living dojo compound — Unice's autonomous agent clan
visualized as a Sea of Stars-style detailed pixel-art top-down 2D
game.

## Run

```bash
npm install
npm run dev:dojo
```

Server binds `127.0.0.1:3458`. Open in a browser to see the dojo.

## Canonical Vision

See [`CODEX_CHARTER.md`](./CODEX_CHARTER.md) for the locked product
vision and PR sequence.

## Debug Mode

Append `?debug=true` to the URL to surface operational HUDs, worker
status overlays, and lifecycle event streams. Default view is the
dojo only.

## Architecture History

See [`docs/legacy/cockpit-history.md`](./docs/legacy/cockpit-history.md)
for the OpenClaw cockpit lineage. The Ghibli painted village direction
that preceded the pixel pivot is preserved at the `ghibli-village-final`
tag, with sprites archived in `public/assets/village_ghibli_archive/`
and generation prompts in `ASSETS_GHIBLI.md`.

## Asset Generation Logs

- `ASSETS_PIXEL.md` — current pixel direction (PR 2.1+)
- `ASSETS_GHIBLI.md` — archived Ghibli painted direction (PR 1.5/1.6)

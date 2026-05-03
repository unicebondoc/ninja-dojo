# Asset Generation Prompts - Pixel Direction

This file logs every gpt-image-2 generation prompt used for the
Sea of Stars-style detailed pixel art dojo compound (PR 2.1+).

For the legacy Ghibli soft-pastel village prompts, see `ASSETS_GHIBLI.md`.

## Style Anchor

(To be locked in PR 2.1)

## Generated Assets

(None yet - this file populated by PR 2.1 onward)
## PR 2.1 - Skeleton

### Phase 2.1-1 - Style Anchor Checkpoint

#### public/assets/dojo/checkpoints/STYLE_ANCHOR_PIXEL.png

```text
Modern detailed pixel art in the style of Sea of Stars and Persona 5 combined, but with a STRICT overhead map camera.
Camera is looking straight down from the ceiling like a floor plan. No horizon, no front-facing walls, no character face looking at camera, no 3/4 isometric angle, no angled facade.

Vibrant warm color palette with rich saturation, soft pixel anti-aliasing, readable silhouettes, clean shape language. Pixel density: roughly 32x32 to 48x48 character sprites, 64x64 building tiles, 16x16 ground tiles. Sub-pixel detail acceptable for clothing folds, hair shading, and architectural detail. Soft compact drop shadows directly beneath objects.

NO 3/4 isometric perspective. NO visible front wall facade. NO Ghibli watercolor. NO harsh oversaturated colors. NO chunky low-res 8-bit feel. NO chibi-painted aesthetic.

Reference: Sea of Stars village palette and detail, Persona 5 dungeon-map clarity, Stardew Valley town readability, but transformed into a strict top-down tactical-map view.

Subject for the anchor image: a single pixel-art ninja girl standing on a grass tile beside a small Japanese-style wooden hut. Camera strictly straight overhead. Show:
- Her sprite from above: top of lavender hair, shoulders, body, feet, no front-facing portrait pose
- Outfit: dark sleeveless gi, dark leggings, pixel detail visible from above
- The hut: roof footprint seen from above, rectangular thatched roof, small porch footprint on south side, no vertical facade
- Grass tile texture: detailed pixel grass with subtle highlights
- Lighting: warm afternoon sunlight from upper-left

Image dimensions: 512x512. Transparent background NOT required for the anchor (this is a reference, not a game asset).
```

#### public/assets/dojo/checkpoints/moji_hut_sample.png

```text
Modern detailed pixel art top-down view, strict overhead camera like a floor-plan map tile. A small Japanese-style ninja hut shown from directly above. Only the roof footprint and porch footprint are visible: rectangular lavender purple thatched roof tiles, wooden frame edges, small wooden porch platform on south side, paper lantern dots at corners. No front-facing wall, no door facade, no 3/4 angle, no isometric angle. The hut sits in a small oval clearing of detailed pixel grass with a soft compact drop shadow beneath. 192x192 pixels, transparent background, Sea of Stars / Persona 5 aesthetic.

Generator fallback for transparency: if transparent background is not supported, place only the outside/background matte on pure bright magenta (#ff00ff) or a standard transparency checkerboard so it can be removed cleanly after generation. Do not use magenta inside the hut, grass, or lanterns.
```

#### public/assets/dojo/checkpoints/moji_idle_sample.png

```text
Modern detailed pixel art top-down character sprite. Female ninja girl viewed from directly above like a tactical map token, not from the front. Show top of lavender purple hair pulled back in a short ponytail, shoulders, dark sleeveless gi with lavender trim, dark leggings, and feet beneath body silhouette. Standing idle pose, arms relaxed at sides. No front-facing portrait pose, no visible face looking at camera, no isometric angle, no 3/4 view. Single frame. 48x48 pixels, transparent background, Sea of Stars / Persona 5 aesthetic.

Generator fallback for transparency: if transparent background is not supported, place only the outside/background matte on pure bright magenta (#ff00ff) or a standard transparency checkerboard so it can be removed cleanly after generation. Do not use magenta in the sprite itself.
```

### Phase 2.1-2 - Six Hut Sprites

#### public/assets/dojo/huts/moji_scroll_hut.png

```text
Modern detailed pixel art top-down view, strict overhead camera like a floor-plan map tile. Moji scroll hut, small Japanese ninja hut with lavender purple rectangular thatched roof tiles, wooden frame edges, south porch platform, scroll racks visible near the porch, tiny paper lanterns at roof corners, compact grass clearing and soft drop shadow beneath. Only roof footprint, porch footprint, and top-down props are visible. No front-facing wall, no door facade, no 3/4 angle, no isometric angle. 192x192 pixels, transparent background, Sea of Stars / Persona 5 aesthetic. Matches the approved reference style of public/assets/dojo/checkpoints/STYLE_ANCHOR_PIXEL.png.

Generator fallback for transparency: if transparent background is not supported, place only the outside/background matte on pure bright magenta (#ff00ff) or a standard transparency checkerboard so it can be removed cleanly after generation. Do not use magenta inside the hut, grass, props, or lights.
```

#### public/assets/dojo/huts/miji_forge.png

```text
Modern detailed pixel art top-down view, strict overhead camera like a floor-plan map tile. Miji forge hut, small Japanese forge with electric blue dark-tile roof, squat chimney cap seen from above with a tiny smoke puff, anvil and orange spark pixels visible near south doorway footprint, reinforced wooden frame, compact grass clearing and soft drop shadow beneath. Only roof footprint, porch footprint, and top-down props are visible. No front-facing wall, no door facade, no 3/4 angle, no isometric angle. 192x192 pixels, transparent background, Sea of Stars / Persona 5 aesthetic. Matches the approved reference style of public/assets/dojo/checkpoints/STYLE_ANCHOR_PIXEL.png.

Generator fallback for transparency: if transparent background is not supported, place only the outside/background matte on pure bright magenta (#ff00ff) or a standard transparency checkerboard so it can be removed cleanly after generation. Do not use magenta inside the hut, grass, props, or lights.
```

#### public/assets/dojo/huts/maji_dojo.png

```text
Modern detailed pixel art top-down view, strict overhead camera like a floor-plan map tile. Maji dojo hut, small training dojo with crimson red roof tiles, rectangular roof footprint, weapon rack silhouette and two practice posts beside south porch, sturdy wooden frame, compact grass clearing and soft drop shadow beneath. Only roof footprint, porch footprint, and top-down props are visible. No front-facing wall, no door facade, no 3/4 angle, no isometric angle. 192x192 pixels, transparent background, Sea of Stars / Persona 5 aesthetic. Matches the approved reference style of public/assets/dojo/checkpoints/STYLE_ANCHOR_PIXEL.png.

Generator fallback for transparency: if transparent background is not supported, place only the outside/background matte on pure bright magenta (#ff00ff) or a standard transparency checkerboard so it can be removed cleanly after generation. Do not use magenta inside the hut, grass, props, or lights.
```

#### public/assets/dojo/huts/meji_tea_house.png

```text
Modern detailed pixel art top-down view, strict overhead camera like a floor-plan map tile. Meji tea house, small Japanese tea hut with mint green roof tiles, roof vent with a small steam curl seen from above, low tea table footprint beside south porch, hanging herb bundles as tiny green details, compact grass clearing and soft drop shadow beneath. Only roof footprint, porch footprint, and top-down props are visible. No front-facing wall, no door facade, no 3/4 angle, no isometric angle. 192x192 pixels, transparent background, Sea of Stars / Persona 5 aesthetic. Matches the approved reference style of public/assets/dojo/checkpoints/STYLE_ANCHOR_PIXEL.png.

Generator fallback for transparency: if transparent background is not supported, place only the outside/background matte on pure bright magenta (#ff00ff) or a standard transparency checkerboard so it can be removed cleanly after generation. Do not use magenta inside the hut, grass, props, or lights.
```

#### public/assets/dojo/huts/muji_launch_pad.png

```text
Modern detailed pixel art top-down view, strict overhead camera like a floor-plan map tile. Muji launch pad workshop hut, small workshop with gold yellow roof tiles, rocket scaffolding visible behind the north roof edge from above, blueprints and gear pixels near south porch, compact grass clearing and soft drop shadow beneath. Only roof footprint, porch footprint, and top-down props are visible. No front-facing wall, no door facade, no 3/4 angle, no isometric angle. 192x192 pixels, transparent background, Sea of Stars / Persona 5 aesthetic. Matches the approved reference style of public/assets/dojo/checkpoints/STYLE_ANCHOR_PIXEL.png.

Generator fallback for transparency: if transparent background is not supported, place only the outside/background matte on pure bright magenta (#ff00ff) or a standard transparency checkerboard so it can be removed cleanly after generation. Do not use magenta inside the hut, grass, props, or lights.
```

#### public/assets/dojo/huts/meowts_shrine.png

```text
Modern detailed pixel art top-down view, strict overhead camera like a floor-plan map tile. Meowts shrine hut, small shrine with white roof and pink trim, tiny torii gate footprint at south entrance, two cat statue guards as pale pixel silhouettes, altar roof detail, compact grass clearing and soft drop shadow beneath. Only roof footprint, porch footprint, and top-down props are visible. No front-facing wall, no door facade, no 3/4 angle, no isometric angle. 192x192 pixels, transparent background, Sea of Stars / Persona 5 aesthetic. Matches the approved reference style of public/assets/dojo/checkpoints/STYLE_ANCHOR_PIXEL.png.

Generator fallback for transparency: if transparent background is not supported, place only the outside/background matte on pure bright magenta (#ff00ff) or a standard transparency checkerboard so it can be removed cleanly after generation. Do not use magenta inside the hut, grass, props, or lights.
```


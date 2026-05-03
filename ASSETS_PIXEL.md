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

### Phase 2.1-3 - Ground Tiles, Props, Sky Strip, Twin Moons

#### public/assets/dojo/tiles/*.png

```text
Modern detailed pixel art top-down tileset sheet matching the approved Ninja Dojo pixel style anchor. Strict overhead game-map camera, Sea of Stars / Persona 5 detailed pixel aesthetic, vibrant warm palette.

Create a clean 3 columns x 3 rows tile sheet. Each tile is exactly 128x128 pixels in this generated sheet and will be downsampled to 16x16 game tiles. No text, no labels, no gutters, no borders.

Tile order left-to-right, top-to-bottom:
1 base detailed grass tile
2 grass variant with tiny pink and white flowers
3 grass variant with tiny pebbles
4 stone path straight tile
5 stone path corner turning north-east
6 stone path corner turning north-west
7 stone path corner turning south-east
8 stone path corner turning south-west
9 central plaza stone tile with subtle decorative pattern

All tiles must be strict top-down and tileable at edges. No isometric angle, no perspective, no buildings, no characters.
```

#### public/assets/dojo/props/*.png

```text
Modern detailed pixel art top-down prop sheet matching the approved Ninja Dojo pixel style anchor. Strict overhead game-map camera, Sea of Stars / Persona 5 detailed pixel aesthetic, vibrant warm palette.

Create a clean 4 columns x 2 rows prop sheet. Each prop occupies exactly one 128x128 cell in this generated sheet and will be downsampled to 32x32 game props. Transparent-like removable background: use pure bright magenta (#ff00ff) or a simple checkerboard behind empty areas only. No text, no labels, no borders.

Prop order left-to-right, top-to-bottom:
1 pink cherry blossom tree top-down
2 second cherry blossom tree variant top-down
3 Japanese stone lantern top-down
4 hanging paper lantern top-down
5 small flower bed cluster top-down
6 wooden sign post top-down
7 small decorative rock top-down
8 wooden fence segment top-down

No isometric angle, no 3/4 angle, no characters, no buildings.
```

#### public/assets/dojo/ui/sky_strip.png, moon_eternal.png, moon_earned.png

Generated deterministically with PIL pixel drawing to match the approved palette; no API or metered model call used.

## PR 2.2 - Characters & Live Telemetry

### Phase 2.2-1 - Kunoichi Sprite Atlases

#### public/assets/dojo/characters/moji_atlas.png

```text
Modern detailed pixel art top-down character sprite sheet. Female ninja girl viewed from directly above like a tactical map token, NOT from the front and NOT isometric. lavender purple short ponytail hair, dark sleeveless gi with lavender trim, soft compact drop shadow beneath, Sea of Stars / Persona 5 aesthetic, matches public/assets/dojo/checkpoints/STYLE_ANCHOR_PIXEL.png reference.

8 columns x 4 rows sprite sheet, each cell exactly 32x32 pixels. Total image 256x128 pixels. Transparent background between frames. No frame borders, no numbers, no text.

Frame layout:
- Row 1, columns 1-4: Idle pose, gentle shoulder bob (4 frames)
- Row 1, columns 5-8: Walking north (away from camera), 4-frame cycle
- Row 2, columns 1-4: Walking south (toward camera), 4-frame cycle
- Row 2, columns 5-8: Walking east (right), 4-frame cycle
- Row 3, columns 1-4: Walking west (left), 4-frame cycle
- Row 3, columns 5-8: writing on a scroll with a brush, 4 frames
- Row 4, columns 1-4: Waving greeting, 4 frames
- Row 4, columns 5-6: Sitting cross-legged, 2 frames
- Row 4, columns 7-8: Talking gesture, 2 frames

Identical character, identical hair, identical outfit across ALL 32 frames. Smooth animation progression within each row segment. Strict overhead camera: show hair, shoulders, body and feet from above, no front-facing portrait pose.

Generator fallback for transparency: if transparent background is not supported, place only the outside/background matte on pure bright magenta (#ff00ff) or a standard transparency checkerboard so it can be removed cleanly after generation. Do not use magenta in the sprite itself.
```#### public/assets/dojo/characters/miji_atlas.png

```text
Modern detailed pixel art top-down character sprite sheet. Female ninja girl viewed from directly above like a tactical map token, NOT from the front and NOT isometric. electric blue side-swept hair hair, dark sleeveless gi with electric blue trim, soft compact drop shadow beneath, Sea of Stars / Persona 5 aesthetic, matches public/assets/dojo/checkpoints/STYLE_ANCHOR_PIXEL.png reference.

8 columns x 4 rows sprite sheet, each cell exactly 32x32 pixels. Total image 256x128 pixels. Transparent background between frames. No frame borders, no numbers, no text.

Frame layout:
- Row 1, columns 1-4: Idle pose, gentle shoulder bob (4 frames)
- Row 1, columns 5-8: Walking north (away from camera), 4-frame cycle
- Row 2, columns 1-4: Walking south (toward camera), 4-frame cycle
- Row 2, columns 5-8: Walking east (right), 4-frame cycle
- Row 3, columns 1-4: Walking west (left), 4-frame cycle
- Row 3, columns 5-8: hammering a tiny anvil with sparks, 4 frames
- Row 4, columns 1-4: Waving greeting, 4 frames
- Row 4, columns 5-6: Sitting cross-legged, 2 frames
- Row 4, columns 7-8: Talking gesture, 2 frames

Identical character, identical hair, identical outfit across ALL 32 frames. Smooth animation progression within each row segment. Strict overhead camera: show hair, shoulders, body and feet from above, no front-facing portrait pose.

Generator fallback for transparency: if transparent background is not supported, place only the outside/background matte on pure bright magenta (#ff00ff) or a standard transparency checkerboard so it can be removed cleanly after generation. Do not use magenta in the sprite itself.
```

#### public/assets/dojo/characters/maji_atlas.png

```text
Modern detailed pixel art top-down character sprite sheet. Female ninja girl viewed from directly above like a tactical map token, NOT from the front and NOT isometric. crimson red twin tails hair, dark sleeveless gi with crimson trim, soft compact drop shadow beneath, Sea of Stars / Persona 5 aesthetic, matches public/assets/dojo/checkpoints/STYLE_ANCHOR_PIXEL.png reference.

8 columns x 4 rows sprite sheet, each cell exactly 32x32 pixels. Total image 256x128 pixels. Transparent background between frames. No frame borders, no numbers, no text.

Frame layout:
- Row 1, columns 1-4: Idle pose, gentle shoulder bob (4 frames)
- Row 1, columns 5-8: Walking north (away from camera), 4-frame cycle
- Row 2, columns 1-4: Walking south (toward camera), 4-frame cycle
- Row 2, columns 5-8: Walking east (right), 4-frame cycle
- Row 3, columns 1-4: Walking west (left), 4-frame cycle
- Row 3, columns 5-8: cycling through a sword strike pose, 4 frames
- Row 4, columns 1-4: Waving greeting, 4 frames
- Row 4, columns 5-6: Sitting cross-legged, 2 frames
- Row 4, columns 7-8: Talking gesture, 2 frames

Identical character, identical hair, identical outfit across ALL 32 frames. Smooth animation progression within each row segment. Strict overhead camera: show hair, shoulders, body and feet from above, no front-facing portrait pose.

Generator fallback for transparency: if transparent background is not supported, place only the outside/background matte on pure bright magenta (#ff00ff) or a standard transparency checkerboard so it can be removed cleanly after generation. Do not use magenta in the sprite itself.
```

#### public/assets/dojo/characters/meji_atlas.png

```text
Modern detailed pixel art top-down character sprite sheet. Female ninja girl viewed from directly above like a tactical map token, NOT from the front and NOT isometric. mint green bob cut hair, dark sleeveless gi with mint trim, soft compact drop shadow beneath, Sea of Stars / Persona 5 aesthetic, matches public/assets/dojo/checkpoints/STYLE_ANCHOR_PIXEL.png reference.

8 columns x 4 rows sprite sheet, each cell exactly 32x32 pixels. Total image 256x128 pixels. Transparent background between frames. No frame borders, no numbers, no text.

Frame layout:
- Row 1, columns 1-4: Idle pose, gentle shoulder bob (4 frames)
- Row 1, columns 5-8: Walking north (away from camera), 4-frame cycle
- Row 2, columns 1-4: Walking south (toward camera), 4-frame cycle
- Row 2, columns 5-8: Walking east (right), 4-frame cycle
- Row 3, columns 1-4: Walking west (left), 4-frame cycle
- Row 3, columns 5-8: stirring a tea bowl, 4 frames
- Row 4, columns 1-4: Waving greeting, 4 frames
- Row 4, columns 5-6: Sitting cross-legged, 2 frames
- Row 4, columns 7-8: Talking gesture, 2 frames

Identical character, identical hair, identical outfit across ALL 32 frames. Smooth animation progression within each row segment. Strict overhead camera: show hair, shoulders, body and feet from above, no front-facing portrait pose.

Generator fallback for transparency: if transparent background is not supported, place only the outside/background matte on pure bright magenta (#ff00ff) or a standard transparency checkerboard so it can be removed cleanly after generation. Do not use magenta in the sprite itself.
```

#### public/assets/dojo/characters/muji_atlas.png

```text
Modern detailed pixel art top-down character sprite sheet. Female ninja girl viewed from directly above like a tactical map token, NOT from the front and NOT isometric. gold yellow braid hair, dark sleeveless gi with gold trim, soft compact drop shadow beneath, Sea of Stars / Persona 5 aesthetic, matches public/assets/dojo/checkpoints/STYLE_ANCHOR_PIXEL.png reference.

8 columns x 4 rows sprite sheet, each cell exactly 32x32 pixels. Total image 256x128 pixels. Transparent background between frames. No frame borders, no numbers, no text.

Frame layout:
- Row 1, columns 1-4: Idle pose, gentle shoulder bob (4 frames)
- Row 1, columns 5-8: Walking north (away from camera), 4-frame cycle
- Row 2, columns 1-4: Walking south (toward camera), 4-frame cycle
- Row 2, columns 5-8: Walking east (right), 4-frame cycle
- Row 3, columns 1-4: Walking west (left), 4-frame cycle
- Row 3, columns 5-8: tinkering with tiny rocket parts, 4 frames
- Row 4, columns 1-4: Waving greeting, 4 frames
- Row 4, columns 5-6: Sitting cross-legged, 2 frames
- Row 4, columns 7-8: Talking gesture, 2 frames

Identical character, identical hair, identical outfit across ALL 32 frames. Smooth animation progression within each row segment. Strict overhead camera: show hair, shoulders, body and feet from above, no front-facing portrait pose.

Generator fallback for transparency: if transparent background is not supported, place only the outside/background matte on pure bright magenta (#ff00ff) or a standard transparency checkerboard so it can be removed cleanly after generation. Do not use magenta in the sprite itself.
```

#### public/assets/dojo/characters/meowts_atlas.png

```text
Modern detailed pixel art top-down character sprite sheet. Female ninja girl viewed from directly above like a tactical map token, NOT from the front and NOT isometric. snow white hair with a pink streak in twin buns hair, white gi with pink trim, soft compact drop shadow beneath, Sea of Stars / Persona 5 aesthetic, matches public/assets/dojo/checkpoints/STYLE_ANCHOR_PIXEL.png reference.

8 columns x 4 rows sprite sheet, each cell exactly 32x32 pixels. Total image 256x128 pixels. Transparent background between frames. No frame borders, no numbers, no text.

Frame layout:
- Row 1, columns 1-4: Idle pose, gentle shoulder bob (4 frames)
- Row 1, columns 5-8: Walking north (away from camera), 4-frame cycle
- Row 2, columns 1-4: Walking south (toward camera), 4-frame cycle
- Row 2, columns 5-8: Walking east (right), 4-frame cycle
- Row 3, columns 1-4: Walking west (left), 4-frame cycle
- Row 3, columns 5-8: raising paws in a blessing motion, 4 frames
- Row 4, columns 1-4: Waving greeting, 4 frames
- Row 4, columns 5-6: Sitting cross-legged, 2 frames
- Row 4, columns 7-8: Talking gesture, 2 frames

Identical character, identical hair, identical outfit across ALL 32 frames. Smooth animation progression within each row segment. Strict overhead camera: show hair, shoulders, body and feet from above, no front-facing portrait pose.

Generator fallback for transparency: if transparent background is not supported, place only the outside/background matte on pure bright magenta (#ff00ff) or a standard transparency checkerboard so it can be removed cleanly after generation. Do not use magenta in the sprite itself.
```

### Phase 2.2-2 - Tyche Sprite Atlas

#### public/assets/dojo/characters/tyche_atlas.png

```text
Modern detailed pixel art top-down cat sprite sheet. Pure white Turkish Angora cat viewed from directly above, fluffy tail visible, green eyes as tiny readable pixels, soft compact drop shadow. Sea of Stars / Persona 5 aesthetic, matches public/assets/dojo/checkpoints/STYLE_ANCHOR_PIXEL.png reference.

8 columns x 2 rows, each cell exactly 32x32 pixels. Total 256x64. Transparent background. No frame borders, no numbers, no text.

Layout:
- Row 1, columns 1-4: Idle sitting, tail flick, 4 frames
- Row 1, columns 5-8: Walking north, 4 frames
- Row 2, columns 1-4: Walking south, 4 frames
- Row 2, columns 5-6: Walking east, 2 frames
- Row 2, columns 7-8: Walking west, 2 frames

Identical cat, identical scale, identical palette across all frames. Strict overhead camera, no isometric angle, no 3/4 view.

Generator fallback for transparency: if transparent background is not supported, place only the outside/background matte on pure bright magenta (#ff00ff) or a standard transparency checkerboard so it can be removed cleanly after generation.
```

## PR 2.3 - Cutaway Interiors

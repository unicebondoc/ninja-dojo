# Ninja Dojo Village Assets

Generated with OpenClaw image generation using `openai/gpt-image-2` on 2026-05-03. Native transparent background was rejected by the model endpoint, so assets were generated on a flat chroma-key background and processed locally with `remove_chroma_key.py`.

## Master Style

Hand-painted Studio Ghibli-inspired soft pastel watercolor texture, warm storybook lighting, chibi proportions, crisp clean edges, no harsh pixels, no anime line art, no cel shading, no text, no watermark.

## PR 1.5 Phase 1 Prompts

Generated with the built-in image generation path and copied into the project. Dimension normalization and petal chroma-key cleanup were performed locally with Pillow.

### `public/assets/village/STYLE_ANCHOR.png`

```text
Studio Ghibli hand-painted aesthetic, soft pastel watercolor palette,
chibi proportions (head 1/3 of body), 3/4 top-down isometric perspective,
warm storybook lighting, painterly texture with visible brush strokes,
NO harsh pixel edges, NO cel-shading line art, NO anime-style outlines,
soft ambient occlusion, dreamlike atmosphere.
Reference: Spirited Away color palette, Princess Mononoke painterly texture.
Subject: a single chibi female ninja with lavender hair standing in
a soft grass clearing, transparent background, full body visible,
feet on ground, neutral pose.
```

### `public/assets/village/background/bg_sky.png`

```text
Studio Ghibli hand-painted aesthetic, soft pastel watercolor palette, warm storybook lighting, painterly texture with visible brush strokes, soft ambient occlusion, dreamlike atmosphere. Wide 16:9 hand-painted background layer for a 2D kunoichi village game. Soft sky gradient from pale peach at the horizon to mint cream in the middle to soft lavender at the top, with a few wispy hand-painted clouds drifting near the upper sky. No mountains, no trees, no foreground, no characters, no text, no watermark.
```

### `public/assets/village/background/bg_mountains.png`

```text
Studio Ghibli hand-painted aesthetic, soft pastel watercolor palette, warm storybook lighting, painterly texture with visible brush strokes, soft ambient occlusion, dreamlike atmosphere. Wide horizontal background layer for a 2D kunoichi village game: distant mountain silhouettes with soft mist and painterly blue-purple distance haze, low ridge line across the bottom third, lots of empty sky-like space above ridge. No trees, no foreground, no buildings, no characters, no text, no watermark.
```

### `public/assets/village/background/bg_forest.png`

```text
Studio Ghibli hand-painted aesthetic, soft pastel watercolor palette, warm storybook lighting, painterly texture with visible brush strokes, soft ambient occlusion, dreamlike atmosphere. Wide horizontal mid-distance background layer for a 2D kunoichi village game: soft green hills and a hand-painted forest line across the lower half, slightly blurred by distance and gentle mist. Empty sky-like pastel space above the forest. No buildings, no characters, no foreground props, no text, no watermark.
```

### `public/assets/village/background/bg_foreground.png`

```text
Studio Ghibli hand-painted aesthetic, soft pastel watercolor palette, warm storybook lighting, painterly texture with visible brush strokes, soft ambient occlusion, dreamlike atmosphere. Wide horizontal foreground edge layer for a 2D kunoichi village game: detailed grass tufts, tiny wildflowers, small mossy rocks, and soft painterly soil texture along the bottom edge only. Upper two-thirds should be simple pale sky-colored empty space so it can frame the village from the bottom. No buildings, no characters, no text, no watermark.
```

### `public/assets/village/particles/petal.png`

```text
Studio Ghibli hand-painted aesthetic, soft pastel watercolor palette, warm storybook lighting, painterly texture with visible brush strokes. Single cherry blossom petal game sprite, soft pink with a subtle gradient edge, isolated centered subject, generous padding, no shadow, no text, no watermark. Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Do not use #00ff00 anywhere in the petal.
```

## PR 1.5 Phase 2 Prompts

Generated assets were normalized into `trees/`, `moons/`, `tiles/`, and `props/`. Chroma-key subjects were converted to alpha with Pillow, then cropped into fixed game-sprite canvases. `tiles/ground_map.png` was composed locally from the generated grass and path textures to remove the checkerboard map.

### `public/assets/village/trees/cherry_1.png`

```text
Studio Ghibli hand-painted aesthetic, soft pastel watercolor palette, warm storybook lighting, painterly texture with visible brush strokes, soft ambient occlusion. Single 3/4 isometric cherry blossom tree for a cozy kunoichi village game, natural branching trunk, layered soft pink blossoms, organic silhouette, not a lollipop shape. Isolated centered game sprite with generous padding. Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Do not use #00ff00 in the tree. No text, no watermark, no shadow.
```

### `public/assets/village/trees/cherry_2.png`

```text
Studio Ghibli hand-painted aesthetic, soft pastel watercolor palette, warm storybook lighting, painterly texture with visible brush strokes, soft ambient occlusion. Single 3/4 isometric cherry blossom tree variant for a cozy kunoichi village game, leaning natural trunk, asymmetric canopy of layered pale pink blossoms, organic silhouette, not a lollipop shape. Isolated centered game sprite with generous padding. Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Do not use #00ff00 in the tree. No text, no watermark, no shadow.
```

### `public/assets/village/trees/cherry_3.png`

```text
Studio Ghibli hand-painted aesthetic, soft pastel watercolor palette, warm storybook lighting, painterly texture with visible brush strokes, soft ambient occlusion. Single 3/4 isometric cherry blossom tree variant for a cozy kunoichi village game, shorter broad canopy, split natural trunk, clustered soft rose-pink blossoms, organic silhouette, not a lollipop shape. Isolated centered game sprite with generous padding. Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Do not use #00ff00 in the tree. No text, no watermark, no shadow.
```

### `public/assets/village/trees/cherry_4.png`

```text
Studio Ghibli hand-painted aesthetic, soft pastel watercolor palette, warm storybook lighting, painterly texture with visible brush strokes, soft ambient occlusion. Single 3/4 isometric cherry blossom tree variant for a cozy kunoichi village game, graceful arched trunk, scattered airy canopy of pale blush blossoms, visible branches, organic silhouette, not a lollipop shape. Isolated centered game sprite with generous padding. Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Do not use #00ff00 in the tree. No text, no watermark, no shadow.
```

### `public/assets/village/moons/moon_eternal.png`

```text
Studio Ghibli hand-painted aesthetic, soft pastel watercolor palette, warm storybook lighting, painterly texture with visible brush strokes. Single game sprite of a pale silver-white moon with soft halo glow, circular but painterly, luminous and gentle, isolated centered subject, generous padding. Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Do not use #00ff00 in the moon. No text, no watermark, no shadow.
```

### `public/assets/village/moons/moon_earned.png`

```text
Studio Ghibli hand-painted aesthetic, soft pastel watercolor palette, warm storybook lighting, painterly texture with visible brush strokes. Single game sprite of a warm golden moon with brighter soft halo glow, circular but painterly, luminous and gentle, isolated centered subject, generous padding. Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Do not use #00ff00 in the moon. No text, no watermark, no shadow.
```

### `public/assets/village/tiles/grass_painterly.png`

```text
Studio Ghibli hand-painted aesthetic, soft pastel watercolor palette, warm storybook lighting, painterly texture with visible brush strokes, soft ambient occlusion. Seamless painterly grass texture for a cozy 3/4 isometric village game, lush soft green watercolor grass with tiny subtle color variation, no grid, no checkerboard, no objects, no text, no watermark. Square texture tile.
```

### `public/assets/village/tiles/path_stone.png`

```text
Studio Ghibli hand-painted aesthetic, soft pastel watercolor palette, warm storybook lighting, painterly texture with visible brush strokes. Organic stone path texture for a cozy 3/4 isometric village game, warm tan irregular stepping stones with moss between stones, watercolor texture, no grid, no checkerboard, no objects, no text, no watermark. Square texture tile.
```

### `public/assets/village/props/*.png`

```text
Studio Ghibli hand-painted aesthetic, soft pastel watercolor palette, warm storybook lighting, painterly texture with visible brush strokes, soft ambient occlusion. Game prop sheet for a cozy 3/4 isometric kunoichi village: separate stone lantern with warm glow, small flower bed, wooden signpost without readable text, small lily pond with round leaves and soft water, tiny wildflower cluster. Each object separated with generous padding in a simple grid, isolated subjects. Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Do not use #00ff00 in the props. No text, no labels, no watermark, no shadows.
```

## `public/assets/village/raw/characters-keyed.png`

Create a game sprite atlas on a perfectly flat solid #00ff00 chroma-key background for background removal. The background must be one uniform color with no shadows, gradients, texture, reflections, floor plane, or lighting variation. Keep every subject fully separated from the background with crisp edges and generous padding. Do not use #00ff00 anywhere in the subjects. No cast shadow, no contact shadow, no reflection, no text, no watermark.

Subject: seven separate full-body sprites for a cozy 3/4 isometric village UI: Moji kunoichi with lavender hair and lavender outfit, Miji kunoichi with electric blue hair and blue outfit, Maji kunoichi with crimson hair and red outfit, Meji kunoichi with mint green hair and mint outfit, Muji kunoichi with gold yellow hair and gold outfit, Meowts kunoichi with snow white hair and a pink streak and white outfit, and Tyche a pure white fluffy Turkish Angora cat. Hand-painted Studio Ghibli-inspired soft pastel watercolor texture, warm storybook lighting, chibi proportions, crisp clean edges, no harsh pixels, no anime line art, no cel shading. 3/4 top-down isometric perspective, all facing slightly toward camera, neutral idle poses.

## `public/assets/village/raw/buildings-keyed.png`

Create a game asset atlas on a perfectly flat solid #00ff00 chroma-key background for background removal. The background must be one uniform color with no shadows, gradients, texture, reflections, floor plane, or lighting variation. Keep every subject fully separated from the background with crisp edges and generous padding. Do not use #00ff00 anywhere in the subjects. No cast shadow, no contact shadow, no reflection, no text, no watermark.

Subject: six separate 3/4 isometric village buildings for a cozy kunoichi village: lavender-roof Scroll Hut with paper scrolls, blue Forge with small anvil sign, crimson Training Dojo with practice posts, mint Tea House with steam chimney, gold Launch Pad hut with tiny rocket platform, white Shrine with small cat statues. Hand-painted Studio Ghibli-inspired soft pastel watercolor texture, warm storybook lighting, crisp clean edges, no harsh pixels, no anime line art, no cel shading. Each building centered in its own area with generous padding.

## `public/assets/village/raw/props-keyed.png`

Create a game asset atlas on a perfectly flat solid #00ff00 chroma-key background for background removal. The background must be one uniform color with no shadows, gradients, texture, reflections, floor plane, or lighting variation. Keep every subject fully separated from the background with crisp edges and generous padding. Do not use #00ff00 anywhere in the subjects. No cast shadow, no contact shadow, no reflection, no text, no watermark.

Subject: separate cozy 3/4 isometric village props and effects: grass diamond tile, stone path diamond tile, cherry blossom tree, stone lantern, small stone bridge, falling paper scroll, glowing golden receipt, cream hand-painted speech bubble, two moon glow discs one pale silver and one warm gold, tiny pastel fireworks burst, red rejected X mark. Hand-painted Studio Ghibli-inspired soft pastel watercolor texture, warm storybook lighting, crisp clean edges, no harsh pixels, no anime line art, no cel shading. Each object centered in its own area with generous padding.

## Post-processing

```bash
python3 /home/uniceadmin/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py --input public/assets/village/raw/characters-keyed.png --out public/assets/village/characters/characters.png --auto-key border --soft-matte --transparent-threshold 12 --opaque-threshold 220 --despill
python3 /home/uniceadmin/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py --input public/assets/village/raw/buildings-keyed.png --out public/assets/village/buildings/buildings.png --auto-key border --soft-matte --transparent-threshold 12 --opaque-threshold 220 --despill
python3 /home/uniceadmin/.codex/skills/.system/imagegen/scripts/remove_chroma_key.py --input public/assets/village/raw/props-keyed.png --out public/assets/village/effects/effects.png --auto-key border --soft-matte --transparent-threshold 12 --opaque-threshold 220 --despill
```

## PR 1.5 Phase 3 Prompts

Generated with OpenClaw `openai/gpt-image-2`, then chroma-keyed and normalized into 256px Phaser strips.

### `public/assets/village/animations/kunoichi/moji/idle.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Moji, lavender hair in a ponytail, wearing lavender sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, lavender scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 4 frames showing gentle idle breathing bob in place. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/moji/walk_north.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Moji, lavender hair in a ponytail, wearing lavender sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, lavender scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking north, facing away and slightly upward, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/moji/walk_south.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Moji, lavender hair in a ponytail, wearing lavender sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, lavender scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking south, facing camera and slightly downward, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/moji/walk_east.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Moji, lavender hair in a ponytail, wearing lavender sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, lavender scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking east, facing right, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/moji/walk_west.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Moji, lavender hair in a ponytail, wearing lavender sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, lavender scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking west, facing left, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/moji/work.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Moji, lavender hair in a ponytail, wearing lavender sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, lavender scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 4 frames showing writing on a scroll with a small brush. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/moji/wave.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Moji, lavender hair in a ponytail, wearing lavender sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, lavender scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 4 frames showing friendly greeting wave. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/moji/sit.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Moji, lavender hair in a ponytail, wearing lavender sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, lavender scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 2 frames showing sitting cross-legged calmly. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 512x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/moji/talk.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Moji, lavender hair in a ponytail, wearing lavender sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, lavender scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 3 frames showing small mouth and hand motion while talking. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/moji/react.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Moji, lavender hair in a ponytail, wearing lavender sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, lavender scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 3 frames showing surprised concerned reaction. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/moji/sleep.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Moji, lavender hair in a ponytail, wearing lavender sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, lavender scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 2 frames showing curled sleepy resting pose. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 512x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/moji/yawn.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Moji, lavender hair in a ponytail, wearing lavender sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, lavender scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 3 frames showing stretching and yawning. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/miji/idle.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Miji, electric blue hair in a ponytail, wearing blue sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, blue scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 4 frames showing gentle idle breathing bob in place. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/miji/walk_north.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Miji, electric blue hair in a ponytail, wearing blue sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, blue scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking north, facing away and slightly upward, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/miji/walk_south.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Miji, electric blue hair in a ponytail, wearing blue sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, blue scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking south, facing camera and slightly downward, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/miji/walk_east.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Miji, electric blue hair in a ponytail, wearing blue sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, blue scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking east, facing right, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/miji/walk_west.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Miji, electric blue hair in a ponytail, wearing blue sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, blue scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking west, facing left, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/miji/work.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Miji, electric blue hair in a ponytail, wearing blue sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, blue scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 4 frames showing hammering a tiny anvil with small sparks. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/miji/wave.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Miji, electric blue hair in a ponytail, wearing blue sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, blue scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 4 frames showing friendly greeting wave. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/miji/sit.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Miji, electric blue hair in a ponytail, wearing blue sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, blue scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 2 frames showing sitting cross-legged calmly. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 512x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/miji/talk.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Miji, electric blue hair in a ponytail, wearing blue sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, blue scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 3 frames showing small mouth and hand motion while talking. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/miji/react.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Miji, electric blue hair in a ponytail, wearing blue sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, blue scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 3 frames showing surprised concerned reaction. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/miji/sleep.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Miji, electric blue hair in a ponytail, wearing blue sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, blue scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 2 frames showing curled sleepy resting pose. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 512x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/miji/yawn.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Miji, electric blue hair in a ponytail, wearing blue sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, blue scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 3 frames showing stretching and yawning. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/maji/idle.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Maji, crimson red hair in a ponytail, wearing red sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, red scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 4 frames showing gentle idle breathing bob in place. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/maji/walk_north.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Maji, crimson red hair in a ponytail, wearing red sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, red scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking north, facing away and slightly upward, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/maji/walk_south.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Maji, crimson red hair in a ponytail, wearing red sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, red scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking south, facing camera and slightly downward, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/maji/walk_east.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Maji, crimson red hair in a ponytail, wearing red sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, red scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking east, facing right, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/maji/walk_west.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Maji, crimson red hair in a ponytail, wearing red sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, red scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking west, facing left, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/maji/work.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Maji, crimson red hair in a ponytail, wearing red sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, red scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 4 frames showing practicing a controlled sword strike pose. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/maji/wave.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Maji, crimson red hair in a ponytail, wearing red sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, red scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 4 frames showing friendly greeting wave. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/maji/sit.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Maji, crimson red hair in a ponytail, wearing red sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, red scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 2 frames showing sitting cross-legged calmly. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 512x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/maji/talk.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Maji, crimson red hair in a ponytail, wearing red sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, red scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 3 frames showing small mouth and hand motion while talking. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/maji/react.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Maji, crimson red hair in a ponytail, wearing red sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, red scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 3 frames showing surprised concerned reaction. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/maji/sleep.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Maji, crimson red hair in a ponytail, wearing red sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, red scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 2 frames showing curled sleepy resting pose. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 512x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/maji/yawn.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Maji, crimson red hair in a ponytail, wearing red sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, red scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 3 frames showing stretching and yawning. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meji/idle.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meji, mint green hair in a ponytail, wearing mint green sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, mint scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 4 frames showing gentle idle breathing bob in place. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meji/walk_north.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meji, mint green hair in a ponytail, wearing mint green sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, mint scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking north, facing away and slightly upward, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meji/walk_south.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meji, mint green hair in a ponytail, wearing mint green sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, mint scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking south, facing camera and slightly downward, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meji/walk_east.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meji, mint green hair in a ponytail, wearing mint green sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, mint scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking east, facing right, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meji/walk_west.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meji, mint green hair in a ponytail, wearing mint green sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, mint scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking west, facing left, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meji/work.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meji, mint green hair in a ponytail, wearing mint green sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, mint scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 4 frames showing stirring a tea bowl with calm focus. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meji/wave.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meji, mint green hair in a ponytail, wearing mint green sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, mint scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 4 frames showing friendly greeting wave. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meji/sit.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meji, mint green hair in a ponytail, wearing mint green sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, mint scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 2 frames showing sitting cross-legged calmly. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 512x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meji/talk.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meji, mint green hair in a ponytail, wearing mint green sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, mint scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 3 frames showing small mouth and hand motion while talking. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meji/react.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meji, mint green hair in a ponytail, wearing mint green sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, mint scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 3 frames showing surprised concerned reaction. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meji/sleep.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meji, mint green hair in a ponytail, wearing mint green sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, mint scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 2 frames showing curled sleepy resting pose. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 512x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meji/yawn.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meji, mint green hair in a ponytail, wearing mint green sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, mint scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 3 frames showing stretching and yawning. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/muji/idle.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Muji, gold yellow hair in a ponytail, wearing gold sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, gold scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 4 frames showing gentle idle breathing bob in place. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/muji/walk_north.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Muji, gold yellow hair in a ponytail, wearing gold sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, gold scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking north, facing away and slightly upward, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/muji/walk_south.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Muji, gold yellow hair in a ponytail, wearing gold sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, gold scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking south, facing camera and slightly downward, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/muji/walk_east.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Muji, gold yellow hair in a ponytail, wearing gold sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, gold scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking east, facing right, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/muji/walk_west.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Muji, gold yellow hair in a ponytail, wearing gold sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, gold scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking west, facing left, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/muji/work.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Muji, gold yellow hair in a ponytail, wearing gold sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, gold scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 4 frames showing tinkering with small rocket parts and gears. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/muji/wave.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Muji, gold yellow hair in a ponytail, wearing gold sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, gold scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 4 frames showing friendly greeting wave. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/muji/sit.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Muji, gold yellow hair in a ponytail, wearing gold sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, gold scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 2 frames showing sitting cross-legged calmly. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 512x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/muji/talk.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Muji, gold yellow hair in a ponytail, wearing gold sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, gold scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 3 frames showing small mouth and hand motion while talking. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/muji/react.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Muji, gold yellow hair in a ponytail, wearing gold sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, gold scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 3 frames showing surprised concerned reaction. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/muji/sleep.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Muji, gold yellow hair in a ponytail, wearing gold sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, gold scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 2 frames showing curled sleepy resting pose. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 512x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/muji/yawn.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Muji, gold yellow hair in a ponytail, wearing gold sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, gold scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 3 frames showing stretching and yawning. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meowts/idle.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meowts, snow white hair with one pink streak in a ponytail, wearing white sleeveless cropped gi with pink accents, dark fitted leggings, wrist wraps, soft cloth boots, pink scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 4 frames showing gentle idle breathing bob in place. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meowts/walk_north.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meowts, snow white hair with one pink streak in a ponytail, wearing white sleeveless cropped gi with pink accents, dark fitted leggings, wrist wraps, soft cloth boots, pink scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking north, facing away and slightly upward, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meowts/walk_south.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meowts, snow white hair with one pink streak in a ponytail, wearing white sleeveless cropped gi with pink accents, dark fitted leggings, wrist wraps, soft cloth boots, pink scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking south, facing camera and slightly downward, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meowts/walk_east.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meowts, snow white hair with one pink streak in a ponytail, wearing white sleeveless cropped gi with pink accents, dark fitted leggings, wrist wraps, soft cloth boots, pink scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking east, facing right, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meowts/walk_west.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meowts, snow white hair with one pink streak in a ponytail, wearing white sleeveless cropped gi with pink accents, dark fitted leggings, wrist wraps, soft cloth boots, pink scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 6 frames showing walking west, facing left, small smooth walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1536x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meowts/work.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meowts, snow white hair with one pink streak in a ponytail, wearing white sleeveless cropped gi with pink accents, dark fitted leggings, wrist wraps, soft cloth boots, pink scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 4 frames showing raising a paw-like blessing gesture with a soft glowing aura. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meowts/wave.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meowts, snow white hair with one pink streak in a ponytail, wearing white sleeveless cropped gi with pink accents, dark fitted leggings, wrist wraps, soft cloth boots, pink scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 4 frames showing friendly greeting wave. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meowts/sit.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meowts, snow white hair with one pink streak in a ponytail, wearing white sleeveless cropped gi with pink accents, dark fitted leggings, wrist wraps, soft cloth boots, pink scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 2 frames showing sitting cross-legged calmly. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 512x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meowts/talk.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meowts, snow white hair with one pink streak in a ponytail, wearing white sleeveless cropped gi with pink accents, dark fitted leggings, wrist wraps, soft cloth boots, pink scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 3 frames showing small mouth and hand motion while talking. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meowts/react.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meowts, snow white hair with one pink streak in a ponytail, wearing white sleeveless cropped gi with pink accents, dark fitted leggings, wrist wraps, soft cloth boots, pink scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 3 frames showing surprised concerned reaction. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meowts/sleep.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meowts, snow white hair with one pink streak in a ponytail, wearing white sleeveless cropped gi with pink accents, dark fitted leggings, wrist wraps, soft cloth boots, pink scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 2 frames showing curled sleepy resting pose. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 512x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/kunoichi/meowts/yawn.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective. Character: Meowts, snow white hair with one pink streak in a ponytail, wearing white sleeveless cropped gi with pink accents, dark fitted leggings, wrist wraps, soft cloth boots, pink scarf detail, friendly face visible, no face mask.

Single horizontal sprite strip with exactly 3 frames showing stretching and yawning. Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, same outfit, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep each full body small enough to fit comfortably inside each 256x256 frame with padding above hair and below feet.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark.
```

## PR 1.5 Phase 4 Prompts

Generated with OpenClaw `openai/gpt-image-2`, then chroma-keyed and normalized into 256px Phaser strips.

### `public/assets/village/animations/tyche/idle.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute pure white Turkish Angora cat, fluffy tail, green eyes, no markings, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective.

Single horizontal sprite strip with exactly 3 frames showing Tyche sitting calmly with a small tail flick. Frames arranged left to right. Each frame is a 256x256 cell, same cat, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep the full cat small enough to fit comfortably inside each 256x256 frame with padding above ears and below paws.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the cat. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/tyche/walk_north.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute pure white Turkish Angora cat, fluffy tail, green eyes, no markings, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective.

Single horizontal sprite strip with exactly 4 frames showing Tyche walking north, facing away and slightly upward, soft cat walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same cat, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep the full cat small enough to fit comfortably inside each 256x256 frame with padding above ears and below paws.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the cat. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/tyche/walk_south.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute pure white Turkish Angora cat, fluffy tail, green eyes, no markings, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective.

Single horizontal sprite strip with exactly 4 frames showing Tyche walking south, facing camera and slightly downward, soft cat walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same cat, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep the full cat small enough to fit comfortably inside each 256x256 frame with padding above ears and below paws.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the cat. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/tyche/walk_east.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute pure white Turkish Angora cat, fluffy tail, green eyes, no markings, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective.

Single horizontal sprite strip with exactly 4 frames showing Tyche walking east, facing right, soft cat walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same cat, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep the full cat small enough to fit comfortably inside each 256x256 frame with padding above ears and below paws.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the cat. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/tyche/walk_west.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute pure white Turkish Angora cat, fluffy tail, green eyes, no markings, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective.

Single horizontal sprite strip with exactly 4 frames showing Tyche walking west, facing left, soft cat walk cycle. Frames arranged left to right. Each frame is a 256x256 cell, same cat, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep the full cat small enough to fit comfortably inside each 256x256 frame with padding above ears and below paws.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the cat. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/tyche/groom.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute pure white Turkish Angora cat, fluffy tail, green eyes, no markings, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective.

Single horizontal sprite strip with exactly 3 frames showing Tyche sitting and licking one raised paw. Frames arranged left to right. Each frame is a 256x256 cell, same cat, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 768x256. Keep the full cat small enough to fit comfortably inside each 256x256 frame with padding above ears and below paws.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the cat. No frame borders, no numbers, no labels, no text, no watermark.
```

### `public/assets/village/animations/tyche/pounce.png`

```text
Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: tiny cute pure white Turkish Angora cat, fluffy tail, green eyes, no markings, soft watercolor painterly shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective.

Single horizontal sprite strip with exactly 4 frames showing Tyche crouching low, springing forward, and landing playfully. Frames arranged left to right. Each frame is a 256x256 cell, same cat, same scale, same feet-on-ground baseline, identical lighting. Total intended asset 1024x256. Keep the full cat small enough to fit comfortably inside each 256x256 frame with padding above ears and below paws.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. Do not use #00ff00 in the cat. No frame borders, no numbers, no labels, no text, no watermark.
```

## PR 1.5 Phase 5 Prompts

Generated with OpenClaw `openai/gpt-image-2`, then chroma-keyed and normalized into 512px cutaway sprites.

### `public/assets/village/interiors/moji_interior.png`

```text
Production-ready 2D isometric hut interior cutaway matching the Ninja Dojo village asset style: soft watercolor painterly texture, cozy Ghibli-inspired pastel palette, warm storybook lighting, 3/4 top-down isometric perspective, clean readable game asset silhouette.

Subject: Moji's Scroll Hut interior with roof removed: writing desk, ink stone, brush, scrolls in cubbies, oil lamp, floor cushion, lavender cloth details. Transparent-ready game sprite composition centered in a 512x512 square. The roof is removed cleanly so the viewer can peek inside, but low walls/floor remain visible. No character, no text, no labels, no UI, no frame border, no watermark. Keep the full cutaway inside the canvas with soft shadow and consistent isometric angle.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no gradients, no scenery. Do not use #00ff00 in the interior props.
```

### `public/assets/village/interiors/miji_interior.png`

```text
Production-ready 2D isometric hut interior cutaway matching the Ninja Dojo village asset style: soft watercolor painterly texture, cozy Ghibli-inspired pastel palette, warm storybook lighting, 3/4 top-down isometric perspective, clean readable game asset silhouette.

Subject: Miji's Forge interior with roof removed: anvil, hammer, compact fire pit with glowing coals, weapon racks, bellows, blue steel details. Transparent-ready game sprite composition centered in a 512x512 square. The roof is removed cleanly so the viewer can peek inside, but low walls/floor remain visible. No character, no text, no labels, no UI, no frame border, no watermark. Keep the full cutaway inside the canvas with soft shadow and consistent isometric angle.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no gradients, no scenery. Do not use #00ff00 in the interior props.
```

### `public/assets/village/interiors/maji_interior.png`

```text
Production-ready 2D isometric hut interior cutaway matching the Ninja Dojo village asset style: soft watercolor painterly texture, cozy Ghibli-inspired pastel palette, warm storybook lighting, 3/4 top-down isometric perspective, clean readable game asset silhouette.

Subject: Maji's Training Dojo interior with roof removed: weapon rack, practice posts, tatami floor, training scroll on wall, red banners. Transparent-ready game sprite composition centered in a 512x512 square. The roof is removed cleanly so the viewer can peek inside, but low walls/floor remain visible. No character, no text, no labels, no UI, no frame border, no watermark. Keep the full cutaway inside the canvas with soft shadow and consistent isometric angle.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no gradients, no scenery. Do not use #00ff00 in the interior props.
```

### `public/assets/village/interiors/meji_interior.png`

```text
Production-ready 2D isometric hut interior cutaway matching the Ninja Dojo village asset style: soft watercolor painterly texture, cozy Ghibli-inspired pastel palette, warm storybook lighting, 3/4 top-down isometric perspective, clean readable game asset silhouette.

Subject: Meji's Tea House interior with roof removed: tea kettle on hearth, low table, tea bowls, hanging herbs, mint fabric accents. Transparent-ready game sprite composition centered in a 512x512 square. The roof is removed cleanly so the viewer can peek inside, but low walls/floor remain visible. No character, no text, no labels, no UI, no frame border, no watermark. Keep the full cutaway inside the canvas with soft shadow and consistent isometric angle.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no gradients, no scenery. Do not use #00ff00 in the interior props.
```

### `public/assets/village/interiors/muji_interior.png`

```text
Production-ready 2D isometric hut interior cutaway matching the Ninja Dojo village asset style: soft watercolor painterly texture, cozy Ghibli-inspired pastel palette, warm storybook lighting, 3/4 top-down isometric perspective, clean readable game asset silhouette.

Subject: Muji's Launch Pad workshop interior with roof removed: workbench with blueprints, rocket parts, gears, scaffolding, golden tool details. Transparent-ready game sprite composition centered in a 512x512 square. The roof is removed cleanly so the viewer can peek inside, but low walls/floor remain visible. No character, no text, no labels, no UI, no frame border, no watermark. Keep the full cutaway inside the canvas with soft shadow and consistent isometric angle.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no gradients, no scenery. Do not use #00ff00 in the interior props.
```

### `public/assets/village/interiors/meowts_interior.png`

```text
Production-ready 2D isometric hut interior cutaway matching the Ninja Dojo village asset style: soft watercolor painterly texture, cozy Ghibli-inspired pastel palette, warm storybook lighting, 3/4 top-down isometric perspective, clean readable game asset silhouette.

Subject: Meowts' Shrine interior with roof removed: small cat statues, altar with hovering scroll, incense burner, soft white and pink sacred cloth. Transparent-ready game sprite composition centered in a 512x512 square. The roof is removed cleanly so the viewer can peek inside, but low walls/floor remain visible. No character, no text, no labels, no UI, no frame border, no watermark. Keep the full cutaway inside the canvas with soft shadow and consistent isometric angle.

Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. Background must be one uniform green with no checkerboard, no gradients, no scenery. Do not use #00ff00 in the interior props.
```

## PR 1.6 Grounding Prompts

Generated with OpenClaw `openai/gpt-image-2`, then chroma-keyed and normalized into painted meadow composition layers.

### `public/assets/village/background/bg_groundplane.png`

```text
Studio Ghibli hand-painted aesthetic, painterly meadow texture matching
bg_foreground.png style. Color: same warm green palette.

Subject: a soft circular/oval meadow patch that the village isometric
grid would sit on. Edges feather softly into transparency at the outer
rim — no hard borders. Like a gently lit clearing in a wider meadow,
viewed from above and slightly tilted (3/4 isometric perspective to
match the village map angle).

Image dimensions: 1600×1000. Painted meadow content occupies a soft
oval roughly 1400×800 centered, fading to transparent at the edges
over a 100-200px feather. NO buildings, NO grid lines, NO characters.

Render transparent areas on perfectly flat #00ff00 chroma key green for
post-processing. Do not use #00ff00 in the meadow.
```

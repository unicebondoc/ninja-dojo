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

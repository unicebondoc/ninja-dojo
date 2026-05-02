# Ninja Dojo Village Assets

Generated with OpenClaw image generation using `openai/gpt-image-2` on 2026-05-03. Native transparent background was rejected by the model endpoint, so assets were generated on a flat chroma-key background and processed locally with `remove_chroma_key.py`.

## Master Style

Hand-painted Studio Ghibli-inspired soft pastel watercolor texture, warm storybook lighting, chibi proportions, crisp clean edges, no harsh pixels, no anime line art, no cel shading, no text, no watermark.

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

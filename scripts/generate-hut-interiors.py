#!/usr/bin/env python3
import json
import subprocess
from pathlib import Path

from PIL import Image


OPENCLAW = "/home/uniceadmin/.npm-global/bin/openclaw"
RAW_ROOT = Path("tmp/pr15/generated/interiors")
OUT_ROOT = Path("public/assets/village/interiors")
SIZE = 512

STYLE = (
    "Production-ready 2D isometric hut interior cutaway matching the Ninja Dojo village asset style: "
    "soft watercolor painterly texture, cozy Ghibli-inspired pastel palette, warm storybook lighting, "
    "3/4 top-down isometric perspective, clean readable game asset silhouette."
)

INTERIORS = {
    "moji": (
        "Moji's Scroll Hut interior with roof removed: writing desk, ink stone, brush, scrolls in cubbies, "
        "oil lamp, floor cushion, lavender cloth details"
    ),
    "miji": (
        "Miji's Forge interior with roof removed: anvil, hammer, compact fire pit with glowing coals, "
        "weapon racks, bellows, blue steel details"
    ),
    "maji": (
        "Maji's Training Dojo interior with roof removed: weapon rack, practice posts, tatami floor, "
        "training scroll on wall, red banners"
    ),
    "meji": (
        "Meji's Tea House interior with roof removed: tea kettle on hearth, low table, tea bowls, "
        "hanging herbs, mint fabric accents"
    ),
    "muji": (
        "Muji's Launch Pad workshop interior with roof removed: workbench with blueprints, rocket parts, "
        "gears, scaffolding, golden tool details"
    ),
    "meowts": (
        "Meowts' Shrine interior with roof removed: small cat statues, altar with hovering scroll, "
        "incense burner, soft white and pink sacred cloth"
    )
}


def prompt_for(name, description):
    return (
        f"{STYLE}\n\n"
        f"Subject: {description}. Transparent-ready game sprite composition centered in a 512x512 square. "
        "The roof is removed cleanly so the viewer can peek inside, but low walls/floor remain visible. "
        "No character, no text, no labels, no UI, no frame border, no watermark. Keep the full cutaway "
        "inside the canvas with soft shadow and consistent isometric angle.\n\n"
        "Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. "
        "Background must be one uniform green with no checkerboard, no gradients, no scenery. "
        "Do not use #00ff00 in the interior props."
    )


def generate_raw(raw_path, prompt):
    raw_path.parent.mkdir(parents=True, exist_ok=True)
    if raw_path.exists():
        print(f"skip raw {raw_path}")
        return
    cmd = [
        OPENCLAW,
        "infer",
        "image",
        "generate",
        "--model",
        "openai/gpt-image-2",
        "--size",
        f"{SIZE}x{SIZE}",
        "--output",
        str(raw_path),
        "--output-format",
        "png",
        "--timeout-ms",
        "180000",
        "--prompt",
        prompt,
        "--json"
    ]
    print(f"generate {raw_path}")
    subprocess.run(cmd, check=True)


def remove_green(img):
    img = img.convert("RGBA")
    pix = img.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = pix[x, y]
            if g > 145 and g > r * 1.28 and g > b * 1.28:
                pix[x, y] = (r, g, b, 0)
            elif g > 125 and g > r * 1.12 and g > b * 1.12:
                pix[x, y] = (r, g, b, int(a * 0.25))
    return img


def normalize(raw_path, out_path):
    raw = remove_green(Image.open(raw_path))
    bbox = raw.getbbox()
    if bbox:
        raw = raw.crop(bbox)
    raw.thumbnail((476, 476), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    canvas.alpha_composite(raw, ((SIZE - raw.width) // 2, (SIZE - raw.height) // 2))
    out_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out_path)


def append_assets_doc(entries):
    assets = Path("ASSETS.md")
    text = assets.read_text()
    marker = "## PR 1.5 Phase 5 Prompts\n"
    if marker not in text:
        text += "\n" + marker + "\nGenerated with OpenClaw `openai/gpt-image-2`, then chroma-keyed and normalized into 512px cutaway sprites.\n"
    for output, prompt in entries:
        header = f"### `{output}`"
        if header in text:
            continue
        text += f"\n{header}\n\n```text\n{prompt}\n```\n"
    assets.write_text(text)


def main():
    doc_entries = []
    for name, description in INTERIORS.items():
        prompt = prompt_for(name, description)
        raw_path = RAW_ROOT / f"{name}_interior.raw.png"
        out_path = OUT_ROOT / f"{name}_interior.png"
        generate_raw(raw_path, prompt)
        normalize(raw_path, out_path)
        doc_entries.append((str(out_path), prompt))
    append_assets_doc(doc_entries)


if __name__ == "__main__":
    main()

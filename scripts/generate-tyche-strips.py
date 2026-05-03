#!/usr/bin/env python3
import argparse
import json
import subprocess
from pathlib import Path

from PIL import Image


OPENCLAW = "/home/uniceadmin/.npm-global/bin/openclaw"
RAW_ROOT = Path("tmp/pr15/generated/tyche")
OUT_ROOT = Path("public/assets/village/animations/tyche")
FRAME_SIZE = 256

STYLE = (
    "Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: "
    "tiny cute pure white Turkish Angora cat, fluffy tail, green eyes, no markings, soft watercolor painterly "
    "shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective."
)

ACTIONS = [
    ("idle", 3, "sitting calmly with a small tail flick"),
    ("walk_north", 4, "walking north, facing away and slightly upward, soft cat walk cycle"),
    ("walk_south", 4, "walking south, facing camera and slightly downward, soft cat walk cycle"),
    ("walk_east", 4, "walking east, facing right, soft cat walk cycle"),
    ("walk_west", 4, "walking west, facing left, soft cat walk cycle"),
    ("groom", 3, "sitting and licking one raised paw"),
    ("pounce", 4, "crouching low, springing forward, and landing playfully")
]


def prompt_for(action_name, frames, action_text):
    return (
        f"{STYLE}\n\n"
        f"Single horizontal sprite strip with exactly {frames} frames showing Tyche {action_text}. "
        "Frames arranged left to right. Each frame is a 256x256 cell, same cat, same scale, "
        "same feet-on-ground baseline, identical lighting. "
        f"Total intended asset {frames * FRAME_SIZE}x256. Keep the full cat small enough to fit comfortably "
        "inside each 256x256 frame with padding above ears and below paws.\n\n"
        "Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. "
        "Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. "
        "Do not use #00ff00 in the cat. No frame borders, no numbers, no labels, no text, no watermark."
    )


def generate_raw(raw_path, prompt, frames):
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
        f"{frames * FRAME_SIZE}x{FRAME_SIZE}",
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


def normalize_strip(raw_path, out_png, out_json, prefix, frames):
    raw = remove_green(Image.open(raw_path))
    strip = Image.new("RGBA", (frames * FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
    for i in range(frames):
        x0 = round(i * raw.width / frames)
        x1 = round((i + 1) * raw.width / frames)
        cell = raw.crop((x0, 0, x1, raw.height))
        bbox = cell.getbbox()
        if bbox:
            cell = cell.crop(bbox)
        cell.thumbnail((210, 190), Image.Resampling.LANCZOS)
        frame = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
        frame.alpha_composite(cell, ((FRAME_SIZE - cell.width) // 2, FRAME_SIZE - cell.height - 12))
        strip.alpha_composite(frame, (i * FRAME_SIZE, 0))
    out_png.parent.mkdir(parents=True, exist_ok=True)
    strip.save(out_png)
    atlas = {
        "frames": {
            f"{prefix}_{i}": {"frame": {"x": i * FRAME_SIZE, "y": 0, "w": FRAME_SIZE, "h": FRAME_SIZE}}
            for i in range(frames)
        },
        "meta": {
            "image": out_png.name,
            "size": {"w": frames * FRAME_SIZE, "h": FRAME_SIZE},
            "scale": 1
        }
    }
    out_json.write_text(json.dumps(atlas, indent=2) + "\n")


def append_assets_doc(entries):
    assets = Path("ASSETS.md")
    text = assets.read_text()
    marker = "## PR 1.5 Phase 4 Prompts\n"
    if marker not in text:
        text += "\n" + marker + "\nGenerated with OpenClaw `openai/gpt-image-2`, then chroma-keyed and normalized into 256px Phaser strips.\n"
    for output, prompt in entries:
        header = f"### `{output}`"
        if header in text:
            continue
        text += f"\n{header}\n\n```text\n{prompt}\n```\n"
    assets.write_text(text)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--action", choices=[action[0] for action in ACTIONS] + ["all"], default="all")
    args = parser.parse_args()
    selected = ACTIONS if args.action == "all" else [action for action in ACTIONS if action[0] == args.action]
    doc_entries = []
    for action_name, frames, action_text in selected:
        prompt = prompt_for(action_name, frames, action_text)
        raw_path = RAW_ROOT / f"{action_name}.raw.png"
        out_png = OUT_ROOT / f"{action_name}.png"
        out_json = OUT_ROOT / f"{action_name}.json"
        generate_raw(raw_path, prompt, frames)
        normalize_strip(raw_path, out_png, out_json, f"tyche_{action_name}", frames)
        doc_entries.append((str(out_png), prompt))
    append_assets_doc(doc_entries)


if __name__ == "__main__":
    main()

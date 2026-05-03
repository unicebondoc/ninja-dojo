#!/usr/bin/env python3
import argparse
import json
import subprocess
from pathlib import Path

from PIL import Image


OPENCLAW = "/home/uniceadmin/.npm-global/bin/openclaw"
RAW_ROOT = Path("tmp/pr15/generated/kunoichi")
OUT_ROOT = Path("public/assets/village/animations/kunoichi")
FRAME_SIZE = 256

STYLE = (
    "Production-ready 2D game sprite strip matching the existing Ninja Dojo village sprite atlas style: "
    "tiny cute chibi kunoichi, full body visible, head about one third of body, soft watercolor painterly "
    "shading, clean readable game sprite silhouette, 3/4 top-down isometric game perspective."
)

CHARACTERS = {
    "moji": {
        "name": "Moji",
        "hair": "lavender hair in a ponytail",
        "outfit": "lavender sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, lavender scarf detail",
        "work": "writing on a scroll with a small brush"
    },
    "miji": {
        "name": "Miji",
        "hair": "electric blue hair in a ponytail",
        "outfit": "blue sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, blue scarf detail",
        "work": "hammering a tiny anvil with small sparks"
    },
    "maji": {
        "name": "Maji",
        "hair": "crimson red hair in a ponytail",
        "outfit": "red sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, red scarf detail",
        "work": "practicing a controlled sword strike pose"
    },
    "meji": {
        "name": "Meji",
        "hair": "mint green hair in a ponytail",
        "outfit": "mint green sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, mint scarf detail",
        "work": "stirring a tea bowl with calm focus"
    },
    "muji": {
        "name": "Muji",
        "hair": "gold yellow hair in a ponytail",
        "outfit": "gold sleeveless cropped gi, dark fitted leggings, wrist wraps, soft cloth boots, gold scarf detail",
        "work": "tinkering with small rocket parts and gears"
    },
    "meowts": {
        "name": "Meowts",
        "hair": "snow white hair with one pink streak in a ponytail",
        "outfit": "white sleeveless cropped gi with pink accents, dark fitted leggings, wrist wraps, soft cloth boots, pink scarf detail",
        "work": "raising a paw-like blessing gesture with a soft glowing aura"
    }
}

ACTIONS = [
    ("idle", 4, "gentle idle breathing bob in place"),
    ("walk_north", 6, "walking north, facing away and slightly upward, small smooth walk cycle"),
    ("walk_south", 6, "walking south, facing camera and slightly downward, small smooth walk cycle"),
    ("walk_east", 6, "walking east, facing right, small smooth walk cycle"),
    ("walk_west", 6, "walking west, facing left, small smooth walk cycle"),
    ("work", 4, "{work}"),
    ("wave", 4, "friendly greeting wave"),
    ("sit", 2, "sitting cross-legged calmly"),
    ("talk", 3, "small mouth and hand motion while talking"),
    ("react", 3, "surprised concerned reaction"),
    ("sleep", 2, "curled sleepy resting pose"),
    ("yawn", 3, "stretching and yawning")
]


def prompt_for(character, action, frames):
    action_text = action[2].format(work=character["work"])
    return (
        f"{STYLE} Character: {character['name']}, {character['hair']}, wearing {character['outfit']}, "
        "friendly face visible, no face mask.\n\n"
        f"Single horizontal sprite strip with exactly {frames} frames showing {action_text}. "
        "Frames arranged left to right. Each frame is a 256x256 cell, same character, same hair, "
        "same outfit, same scale, same feet-on-ground baseline, identical lighting. "
        f"Total intended asset {frames * FRAME_SIZE}x256. Keep each full body small enough to fit comfortably "
        "inside each 256x256 frame with padding above hair and below feet.\n\n"
        "Render on a perfectly flat solid #00ff00 chroma-key background for transparent background removal. "
        "Background must be one uniform green with no checkerboard, no shadows, no gradients, no texture. "
        "Do not use #00ff00 in the character. No frame borders, no numbers, no labels, no text, no watermark."
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
        cell.thumbnail((220, 238), Image.Resampling.LANCZOS)
        frame = Image.new("RGBA", (FRAME_SIZE, FRAME_SIZE), (0, 0, 0, 0))
        frame.alpha_composite(cell, ((FRAME_SIZE - cell.width) // 2, FRAME_SIZE - cell.height - 8))
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
    marker = "## PR 1.5 Phase 3 Prompts\n"
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
    parser.add_argument("--character", choices=[*CHARACTERS.keys(), "all"], required=True)
    args = parser.parse_args()
    ids = list(CHARACTERS) if args.character == "all" else [args.character]
    doc_entries = []
    for char_id in ids:
        character = CHARACTERS[char_id]
        for action_name, frames, _ in ACTIONS:
            action = next(item for item in ACTIONS if item[0] == action_name)
            prompt = prompt_for(character, action, frames)
            raw_path = RAW_ROOT / char_id / f"{action_name}.raw.png"
            out_png = OUT_ROOT / char_id / f"{action_name}.png"
            out_json = OUT_ROOT / char_id / f"{action_name}.json"
            generate_raw(raw_path, prompt, frames)
            normalize_strip(raw_path, out_png, out_json, f"{char_id}_{action_name}", frames)
            doc_entries.append((str(out_png), prompt))
    append_assets_doc(doc_entries)


if __name__ == "__main__":
    main()

"""Hybrid config loader. Precedence: ~/.secrets/*.env → discovered env files → OS env.

Exposed via module __getattr__ so imports never fail; SecretMissingError only when
a required secret is actually accessed.
"""
from __future__ import annotations

import os
import subprocess
from pathlib import Path

HOME = Path.home()
SECRETS_DIR = HOME / ".secrets"
DISCOVERED = [HOME / "n8n-claw" / ".env", HOME / "career-ops" / ".env", HOME / ".env"]


class SecretMissingError(RuntimeError):
    pass


def _parse_env_file(path: Path) -> dict[str, str]:
    out: dict[str, str] = {}
    if not path.is_file():
        return out
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        k = k.strip()
        if k.startswith("export "):
            k = k[7:].strip()
        out[k] = v.strip().strip('"').strip("'")
    return out


def _load_secrets_dir() -> dict[str, str]:
    out: dict[str, str] = {}
    if not SECRETS_DIR.is_dir():
        return out
    for envf in SECRETS_DIR.glob("*.env"):
        out.update(_parse_env_file(envf))
    for f in SECRETS_DIR.iterdir():
        if f.is_file() and f.suffix != ".env":
            key = f.name.upper().replace("-", "_")
            out.setdefault(key, f.read_text().strip())
    return out


def get(name: str, default: str | None = None, required: bool = True) -> str | None:
    val = _load_secrets_dir().get(name)
    if val:
        return val
    for p in DISCOVERED:
        val = _parse_env_file(p).get(name)
        if val:
            return val
    val = os.environ.get(name)
    if val:
        return val
    if default is not None:
        return default
    if required:
        raise SecretMissingError(f"{name} not found in ~/.secrets, discovered env files, or OS env")
    return None


def gh_token() -> str:
    tok = get("GITHUB_TOKEN", required=False)
    if tok:
        return tok
    r = subprocess.run(["gh", "auth", "token"], capture_output=True, text=True)
    if r.returncode != 0:
        raise SecretMissingError("GITHUB_TOKEN missing and `gh auth token` failed")
    return r.stdout.strip()


_EXPECTED = {
    "SLACK_BOT_TOKEN": (True, None),
    "SLACK_SIGNING_SECRET": (True, None),
    "ANTHROPIC_API_KEY": (False, None),
    "GITHUB_WEBHOOK_SECRET": (True, None),
    "MOJI_COMMANDS_CHANNEL_ID": (False, "C0ASL49F2P8"),
    "MOJI_DIARY_CHANNEL_ID": (False, "C0ASL49F2P8"),
}


def __getattr__(name: str):
    if name in _EXPECTED:
        required, default = _EXPECTED[name]
        return get(name, default=default, required=required)
    raise AttributeError(name)

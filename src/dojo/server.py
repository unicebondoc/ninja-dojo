"""Flask server mounting Slack + GitHub webhook routes. Binds 127.0.0.1:8787."""
from __future__ import annotations

import os
import subprocess
import sys
import tempfile
import time

from flask import Flask, request

from dojo.slack_handler import bolt_handler
from dojo.webhook_handler import bp as webhook_bp

app = Flask(__name__)
app.register_blueprint(webhook_bp)


def _prewarm_claude() -> None:
    """Pay claude CLI cold-start cost at boot, not on first user request."""
    t0 = time.time()
    prompt_path = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w", suffix=".txt", delete=False, encoding="utf-8"
        ) as tf:
            tf.write('Reply with exactly the JSON: {"pong": true}')
            prompt_path = tf.name
        with open(prompt_path) as stdin_fh:
            r = subprocess.run(
                ["claude", "--print", "--output-format", "json"],
                stdin=stdin_fh,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True, timeout=120, check=False,
            )
        elapsed = time.time() - t0
        if r.returncode == 0:
            print(f"[prewarm] claude CLI warm in {elapsed:.1f}s", flush=True)
        else:
            print(f"[prewarm] claude CLI returned code {r.returncode} in {elapsed:.1f}s", flush=True)
            print(f"[prewarm] stderr: {r.stderr[:500]!r}", flush=True)
    except subprocess.TimeoutExpired:
        print(f"[prewarm] claude CLI TIMED OUT at boot ({time.time()-t0:.1f}s). "
              "First user request may hang.", flush=True)
    except FileNotFoundError:
        print("[prewarm] claude CLI not found in PATH. First request will fail.",
              flush=True, file=sys.stderr)
    except Exception as e:
        print(f"[prewarm] unexpected error: {e!r}", flush=True)
    finally:
        if prompt_path:
            try:
                os.unlink(prompt_path)
            except OSError:
                pass


@app.route("/slack/commands", methods=["POST"])
@app.route("/slack/actions", methods=["POST"])
@app.route("/slack/events", methods=["POST"])
def slack_hook():
    return bolt_handler.handle(request)


@app.route("/health")
def health():
    return {"ok": True, "service": "ninja-dojo"}


def main() -> None:
    _prewarm_claude()
    app.run(host="127.0.0.1", port=8787)


if __name__ == "__main__":
    main()

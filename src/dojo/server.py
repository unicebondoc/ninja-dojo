"""Flask server mounting Slack + GitHub webhook routes. Binds 127.0.0.1:8787."""
from __future__ import annotations

from flask import Flask, request

from dojo.slack_handler import bolt_handler
from dojo.webhook_handler import bp as webhook_bp

app = Flask(__name__)
app.register_blueprint(webhook_bp)


@app.route("/slack/commands", methods=["POST"])
@app.route("/slack/actions", methods=["POST"])
@app.route("/slack/events", methods=["POST"])
def slack_hook():
    return bolt_handler.handle(request)


@app.route("/health")
def health():
    return {"ok": True, "service": "ninja-dojo"}


def main() -> None:
    app.run(host="127.0.0.1", port=8787)


if __name__ == "__main__":
    main()

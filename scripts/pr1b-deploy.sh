#!/usr/bin/env bash
set -euo pipefail

DOJO_DIR="${DOJO_DIR:-$HOME/ninja-dojo}"
PLUGIN_LIVE="$HOME/.openclaw/extensions/openclaw-routing/index.js"
CONFIG_LIVE="$HOME/ninja-clan/agent-teams/routing-config.json"
PLUGIN_PREPARED="$DOJO_DIR/scripts/pr1b-risky/openclaw-routing-index.js"
CONFIG_PREPARED="$DOJO_DIR/scripts/pr1b-risky/routing-config.json"
EXPECTED_DIFF="$DOJO_DIR/scripts/pr1b-routing-plugin.diff"
OPENCLAW_JSON="$HOME/.openclaw/openclaw.json"
STAMP="$(date +%s)"
PLUGIN_BACKUP="$PLUGIN_LIVE.pre-pr1b-$STAMP"
CONFIG_BACKUP="$CONFIG_LIVE.pre-pr1b-$STAMP"
OPENCLAW_JSON_BACKUP="$OPENCLAW_JSON.pre-pr1b-$STAMP"
STARTED_AT="$(date --iso-8601=seconds)"
TMP_DIFF="$(mktemp /tmp/pr1b-routing-plugin.XXXXXX.diff)"

rollback() {
  echo "Rolling back PR1b-risky changes..." >&2
  if [[ -f "$PLUGIN_BACKUP" ]]; then cp "$PLUGIN_BACKUP" "$PLUGIN_LIVE"; fi
  if [[ -f "$CONFIG_BACKUP" ]]; then cp "$CONFIG_BACKUP" "$CONFIG_LIVE"; fi
  systemctl --user restart openclaw-gateway || true
}

fail() {
  echo "ERROR: $*" >&2
  rollback
  exit 1
}

[[ -f "$PLUGIN_LIVE" ]] || fail "Missing live plugin: $PLUGIN_LIVE"
[[ -f "$CONFIG_LIVE" ]] || fail "Missing routing config: $CONFIG_LIVE"
[[ -f "$PLUGIN_PREPARED" ]] || fail "Missing prepared plugin: $PLUGIN_PREPARED"
[[ -f "$CONFIG_PREPARED" ]] || fail "Missing prepared config: $CONFIG_PREPARED"
[[ -f "$EXPECTED_DIFF" ]] || fail "Missing review diff: $EXPECTED_DIFF"

node --check "$PLUGIN_PREPARED"
node -e "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8'));" "$CONFIG_PREPARED"

diff -u --label ~/.openclaw/extensions/openclaw-routing/index.js "$PLUGIN_LIVE" --label scripts/pr1b-risky/openclaw-routing-index.js "$PLUGIN_PREPARED" > "$TMP_DIFF" || true
diff -u --label ~/ninja-clan/agent-teams/routing-config.json "$CONFIG_LIVE" --label scripts/pr1b-risky/routing-config.json "$CONFIG_PREPARED" >> "$TMP_DIFF" || true
cmp -s "$TMP_DIFF" "$EXPECTED_DIFF" || fail "Live diff does not match $EXPECTED_DIFF. Re-run review before deploying."

echo "Creating backups..."
cp "$PLUGIN_LIVE" "$PLUGIN_BACKUP"
cp "$CONFIG_LIVE" "$CONFIG_BACKUP"
if [[ -f "$OPENCLAW_JSON" ]]; then cp "$OPENCLAW_JSON" "$OPENCLAW_JSON_BACKUP"; fi

echo "Applying prepared PR1b-risky files..."
cp "$PLUGIN_PREPARED" "$PLUGIN_LIVE"
cp "$CONFIG_PREPARED" "$CONFIG_LIVE"
node --check "$PLUGIN_LIVE"

echo "Restarting OpenClaw gateway..."
systemctl --user restart openclaw-gateway
sleep 3
systemctl --user is-active --quiet openclaw-gateway || fail "openclaw-gateway is not active after restart"

curl -fsS --max-time 5 http://127.0.0.1:3457/health >/tmp/pr1b-openclaw-health.json || fail "OpenClaw gateway health curl failed"

if journalctl --user -u openclaw-gateway --since "$STARTED_AT" --no-pager | grep -Ei "openclaw-routing.*(error|failed|syntax|exception)"; then
  fail "openclaw-routing error appeared in gateway logs"
fi

echo "Testing mission: prefix through plugin inbound_claim hook..."
node --input-type=module <<'NODE'
import plugin from '/home/uniceadmin/.openclaw/extensions/openclaw-routing/index.js';
let inboundClaim;
plugin.register({
  on(name, handler) {
    if (name === 'inbound_claim') inboundClaim = handler;
  }
});
if (!inboundClaim) throw new Error('inbound_claim hook was not registered');
const result = await inboundClaim({
  channel: 'discord',
  content: 'mission: PR1b deploy smoke mission',
  conversationId: 'pr1b-deploy-smoke',
  isGroup: true,
  messageId: `pr1b-${Date.now()}`,
  senderName: 'pr1b-deploy',
  senderId: 'pr1b-deploy'
}, { channelId: 'pr1b-deploy-smoke', senderId: 'pr1b-deploy' });
if (!result?.handled || !result.reply?.text?.includes('Mission #')) {
  throw new Error(`unexpected inbound_claim result: ${JSON.stringify(result)}`);
}
console.log(result.reply.text);
NODE

echo "PR1b-risky deployed successfully."
echo "Backups:"
echo "  $PLUGIN_BACKUP"
echo "  $CONFIG_BACKUP"
if [[ -f "$OPENCLAW_JSON_BACKUP" ]]; then echo "  $OPENCLAW_JSON_BACKUP"; fi

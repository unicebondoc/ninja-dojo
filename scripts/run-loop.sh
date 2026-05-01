#!/usr/bin/env bash
set -euo pipefail

HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-3458}"
BASE="http://${HOST}:${PORT}"
LOG_DIR="${LOG_DIR:-logs}"
PID_FILE="${PID_FILE:-$LOG_DIR/server.pid}"
OUT_LOG="$LOG_DIR/server.log"
ERR_LOG="$LOG_DIR/server.err.log"

mkdir -p "$LOG_DIR"

if curl -fsS "$BASE/api/health" >/dev/null 2>&1; then
  echo "ninja-dojo already healthy url=$BASE"
  exit 0
fi

if [[ -f "$PID_FILE" ]]; then
  old_pid="$(cat "$PID_FILE")"
  if [[ -n "$old_pid" ]] && kill -0 "$old_pid" 2>/dev/null; then
    echo "ninja-dojo already running pid=$old_pid url=$BASE"
    exit 0
  fi
fi

HOST="$HOST" PORT="$PORT" node src/server.js >>"$OUT_LOG" 2>>"$ERR_LOG" &
pid="$!"
echo "$pid" >"$PID_FILE"

cleanup() {
  if ! kill -0 "$pid" 2>/dev/null; then
    rm -f "$PID_FILE"
  fi
}
trap cleanup EXIT

for _ in {1..40}; do
  if curl -fsS "$BASE/api/health" >/dev/null 2>&1; then
    echo "ninja-dojo running pid=$pid url=$BASE"
    echo "logs: $OUT_LOG $ERR_LOG"
    exit 0
  fi
  if ! kill -0 "$pid" 2>/dev/null; then
    echo "ninja-dojo failed to start; stderr follows" >&2
    tail -40 "$ERR_LOG" >&2 || true
    rm -f "$PID_FILE"
    exit 1
  fi
  sleep 0.25
done

echo "ninja-dojo did not become healthy at $BASE" >&2
tail -40 "$ERR_LOG" >&2 || true
exit 1

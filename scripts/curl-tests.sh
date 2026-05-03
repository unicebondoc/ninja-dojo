#!/usr/bin/env bash
set -euo pipefail

BASE="${BASE:-http://127.0.0.1:3458}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORLD_FILE="$ROOT/data/world.json"
WORLD_BACKUP="$(mktemp)"
cp "$WORLD_FILE" "$WORLD_BACKUP"
cleanup() {
  if [[ "${KEEP_TEST_DATA:-0}" != "1" ]]; then
    cp "$WORLD_BACKUP" "$WORLD_FILE"
  fi
  rm -f "$WORLD_BACKUP"
}
trap cleanup EXIT

wait_for_receipt() {
  local mission_id="$1"
  local expected_agent="$2"
  for _ in {1..40}; do
    local result
    result=$(curl -fsS "$BASE/api/missions/$mission_id" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); const m=j.mission; if(m.status==="receipt_ready" && m.receipts?.[0]?.id) console.log(`${m.status} ${m.receipts[0].agent}`); else console.log(m.status)})')
    if [[ "$result" == "receipt_ready $expected_agent" ]]; then
      echo "$result"
      return 0
    fi
    sleep 0.2
  done
  echo "timed out waiting for $mission_id receipt" >&2
  return 1
}

echo "GET /api/health"
curl -fsS "$BASE/api/health" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(j.ok!==true || j.service!=="ninja-dojo") process.exit(1); console.log(j.service)})'

echo "GET /"
curl -fsS "$BASE/" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{if(!s.includes("id=\"game\"") || !s.includes("/vendor/phaser.min.js") || !s.includes("/js/village/main.js")) process.exit(1); console.log("village")})'

echo "GET /api/world"
curl -fsS "$BASE/api/world" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(!Array.isArray(j.zones)||!Array.isArray(j.missions)||typeof j.version!=="number") process.exit(1); console.log(`missions=${j.missions.length}`)})'

echo "GET /api/openclaw/status"
curl -fsS "$BASE/api/openclaw/status" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(typeof j.online!=="boolean" || typeof j.jobsRunning!=="number" || !j.lastChecked) process.exit(1); console.log(`online=${j.online} jobs=${j.jobsRunning}`)})'

echo "GET /api/runs/status"
curl -fsS "$BASE/api/runs/status" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(!Array.isArray(j.active)||!Array.isArray(j.queued)||typeof j.maxParallel!=="number") process.exit(1); console.log(`active=${j.activeCount} queued=${j.queuedCount}`)})'

echo "GET /api/workers/status"
curl -fsS "$BASE/api/workers/status" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); const c=j.workers?.codex; const a=j.workers?.claude; if(!c?.mode || !a?.mode || !c?.requestedMode || !a?.requestedMode || typeof c.available!=="boolean" || typeof a.available!=="boolean" || typeof j.timeoutMs!=="number") process.exit(1); console.log(`codex=${c.mode}/${c.requestedMode} available=${c.available} claude=${a.mode}/${a.requestedMode} available=${a.available}`)})'

echo "GET /api/missions"
curl -fsS "$BASE/api/missions" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(!Array.isArray(j.missions)) process.exit(1); console.log(`missions=${j.missions.length}`)})'

echo "POST /api/missions"
MISSION_ID=$(curl -fsS -X POST "$BASE/api/missions" \
  -H 'content-type: application/json' \
  -d '{"scroll":"PR3 curl test mission","agent":"codex"}' \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(!j.mission?.id || j.mission.approval.status!=="pending") process.exit(1); console.log(j.mission.id)})')
echo "mission=$MISSION_ID"

echo "POST /api/openclaw/messages receipt command pending"
curl -fsS -X POST "$BASE/api/openclaw/messages" \
  -H 'content-type: application/json' \
  -d "{\"content\":\"/dojo receipt $MISSION_ID\",\"sender\":\"curl-test\"}" \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(j.bridge?.status!=="receipt_pending" || j.receipt!==null || j.mission.status!=="needs_approval") process.exit(1); console.log(`${j.bridge.status} ${j.mission.status}`)})'

echo "POST /api/missions/:id/approve queues run"
curl -fsS -X POST "$BASE/api/missions/$MISSION_ID/approve" \
  -H 'content-type: application/json' \
  -d '{"decidedBy":"curl-test","notes":"approve endpoint smoke"}' \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(j.mission.status!=="queued" || j.mission.run?.status!=="queued") process.exit(1); console.log(`${j.mission.status} ${j.mission.agent}`)})'
wait_for_receipt "$MISSION_ID" "codex"

echo "POST /api/openclaw/messages receipt command ready"
curl -fsS -X POST "$BASE/api/openclaw/messages" \
  -H 'content-type: application/json' \
  -d "{\"content\":\"/dojo receipt $MISSION_ID\",\"sender\":\"curl-test\"}" \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(j.bridge?.status!=="receipt_ready" || j.receipt?.agent!=="codex" || j.mission.status!=="receipt_ready") process.exit(1); console.log(`${j.bridge.status} ${j.receipt.agent}`)})'

echo "POST /api/openclaw/messages mission"
BRIDGE_MISSION_ID=$(curl -fsS -X POST "$BASE/api/openclaw/messages" \
  -H 'content-type: application/json' \
  -d '{"content":"Bridge curl test mission","channelId":"discord-test","sender":"curl-test","agent":"claude"}' \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(j.bridge?.status!=="mission_created" || j.mission?.source?.bridge!=="openclaw") process.exit(1); console.log(j.mission.id)})')
echo "bridge_mission=$BRIDGE_MISSION_ID"

echo "POST /api/openclaw/messages approve command queues run"
curl -fsS -X POST "$BASE/api/openclaw/messages" \
  -H 'content-type: application/json' \
  -d "{\"content\":\"/dojo approve $BRIDGE_MISSION_ID\",\"sender\":\"curl-test\"}" \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(j.bridge?.status!=="mission_queued" || j.mission.status!=="queued") process.exit(1); console.log(`${j.bridge.status} ${j.mission.agent}`)})'
wait_for_receipt "$BRIDGE_MISSION_ID" "claude"

echo "POST /api/openclaw/messages status command"
curl -fsS -X POST "$BASE/api/openclaw/messages" \
  -H 'content-type: application/json' \
  -d '{"content":"/dojo status"}' \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(j.bridge?.type!=="status" || typeof j.status?.missions!=="number" || typeof j.runLoop?.activeCount!=="number") process.exit(1); console.log(`missions=${j.status.missions}`)})'

echo "POST /api/openclaw/messages reject command"
REJECT_MISSION_ID=$(curl -fsS -X POST "$BASE/api/openclaw/messages" \
  -H 'content-type: application/json' \
  -d '{"content":"Bridge reject test mission","sender":"curl-test"}' \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(j.bridge?.status!=="mission_created") process.exit(1); console.log(j.mission.id)})')
curl -fsS -X POST "$BASE/api/openclaw/messages" \
  -H 'content-type: application/json' \
  -d "{\"content\":\"/dojo reject $REJECT_MISSION_ID\",\"sender\":\"curl-test\"}" \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(j.bridge?.status!=="mission_rejected" || j.mission.status!=="rejected") process.exit(1); console.log(`${j.bridge.status} ${j.mission.status}`)})'

echo "curl tests passed"

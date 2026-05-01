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

echo "GET /api/health"
curl -fsS "$BASE/api/health" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(j.ok!==true || j.service!=="ninja-dojo") process.exit(1); console.log(j.service)})'

echo "GET /"
curl -fsS "$BASE/" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{if(!s.includes("id=\"mission-form\"") || !s.includes("id=\"pending-list\"")) process.exit(1); console.log("cockpit")})'

echo "GET /api/world"
curl -fsS "$BASE/api/world" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(!Array.isArray(j.zones)||!j.zones.find(z=>z.id==="openclaw-tower")) process.exit(1); console.log(`zones=${j.zones.length}`)})'

echo "GET /api/openclaw/status"
curl -fsS "$BASE/api/openclaw/status" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(typeof j.online!=="boolean" || typeof j.jobsRunning!=="number" || !j.lastChecked) process.exit(1); console.log(`online=${j.online} jobs=${j.jobsRunning}`)})'

echo "GET /api/missions"
curl -fsS "$BASE/api/missions" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(!Array.isArray(j.missions)) process.exit(1); console.log(`missions=${j.missions.length}`)})'

echo "POST /api/missions"
MISSION_ID=$(curl -fsS -X POST "$BASE/api/missions" \
  -H 'content-type: application/json' \
  -d '{"scroll":"PR0 curl test mission","agent":"codex"}' \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(!j.mission?.id || j.mission.approval.status!=="pending") process.exit(1); console.log(j.mission.id)})')
echo "mission=$MISSION_ID"

echo "POST /api/missions/:id/approve"
curl -fsS -X POST "$BASE/api/missions/$MISSION_ID/approve" \
  -H 'content-type: application/json' \
  -d '{"decidedBy":"curl-test","notes":"approve endpoint smoke"}' \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(j.mission.status!=="receipt_ready" || !j.receipt?.id) process.exit(1); console.log(`${j.mission.status} ${j.receipt.agent}`)})'

echo "POST /api/openclaw/messages mission"
BRIDGE_MISSION_ID=$(curl -fsS -X POST "$BASE/api/openclaw/messages" \
  -H 'content-type: application/json' \
  -d '{"content":"Bridge curl test mission","channelId":"discord-test","sender":"curl-test","agent":"claude"}' \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(j.bridge?.status!=="mission_created" || j.mission?.source?.bridge!=="openclaw") process.exit(1); console.log(j.mission.id)})')
echo "bridge_mission=$BRIDGE_MISSION_ID"

echo "POST /api/openclaw/messages approve command"
curl -fsS -X POST "$BASE/api/openclaw/messages" \
  -H 'content-type: application/json' \
  -d "{\"content\":\"/dojo approve $BRIDGE_MISSION_ID\",\"sender\":\"curl-test\"}" \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(j.bridge?.status!=="mission_approved" || j.mission.status!=="receipt_ready" || j.receipt.agent!=="claude") process.exit(1); console.log(`${j.bridge.status} ${j.receipt.agent}`)})'

echo "POST /api/openclaw/messages status command"
curl -fsS -X POST "$BASE/api/openclaw/messages" \
  -H 'content-type: application/json' \
  -d '{"content":"/dojo status"}' \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{const j=JSON.parse(s); if(j.bridge?.type!=="status" || typeof j.status?.missions!=="number") process.exit(1); console.log(`missions=${j.status.missions}`)})'

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

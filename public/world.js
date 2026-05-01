const canvas = document.querySelector("#world");
const ctx = canvas.getContext("2d");
const missionForm = document.querySelector("#mission-form");
const missionScroll = document.querySelector("#mission-scroll");
const missionAgent = document.querySelector("#mission-agent");
const formStatus = document.querySelector("#form-status");
const pendingList = document.querySelector("#pending-list");
const missionList = document.querySelector("#mission-list");
const receiptList = document.querySelector("#receipt-list");
const eventList = document.querySelector("#event-list");

let state = { version: 0, zones: [], personas: [], missions: [], receipts: [], events: [] };
let openClawStatus = { online: false, jobsRunning: 0, lastError: null, lastChecked: null };
let missionSprite = null;
let reconnectTimer = null;

missionForm.addEventListener("submit", createMissionFromForm);
pendingList.addEventListener("click", handleMissionAction);

await Promise.all([refresh(), refreshOpenClawStatus()]);
connectSocket();
setInterval(refreshOpenClawStatus, 10000);
draw();

async function refresh() {
  const res = await fetch("/api/world");
  state = await res.json();
  updateCockpit();
}

async function refreshOpenClawStatus() {
  try {
    const res = await fetch("/api/openclaw/status");
    openClawStatus = await res.json();
  } catch (error) {
    openClawStatus = {
      online: false,
      jobsRunning: 0,
      lastError: error?.message || "status fetch failed",
      lastChecked: new Date().toISOString()
    };
  }
  updateCockpit();
}

function connectSocket() {
  const protocol = location.protocol === "https:" ? "wss" : "ws";
  const socket = new WebSocket(`${protocol}://${location.host}/ws`);

  socket.addEventListener("open", () => {
    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = null;
  });

  socket.addEventListener("message", async (message) => {
    const event = JSON.parse(message.data);
    if (event.type === "world.snapshot") {
      state = event.payload;
      updateCockpit();
      return;
    }

    if (event.worldVersion && event.worldVersion > (state.version || 0)) {
      await refresh();
    }

    if (event.type?.startsWith("mission.")) {
      animateMission(event.type.replace("mission.", ""), event.mission);
    }
  });

  socket.addEventListener("close", scheduleReconnect);
  socket.addEventListener("error", scheduleReconnect);
}

function scheduleReconnect() {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectSocket();
    refresh();
  }, 1500);
}

async function createMissionFromForm(event) {
  event.preventDefault();
  const scroll = missionScroll.value.trim();
  if (!scroll) {
    setFormStatus("Mission scroll is empty.");
    missionScroll.focus();
    return;
  }

  setFormBusy(true);
  try {
    const response = await fetch("/api/missions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ agent: missionAgent.value, scroll })
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "Mission create failed.");
    missionScroll.value = "";
    setFormStatus(`Created ${body.mission.id}`);
    await refresh();
  } catch (error) {
    setFormStatus(error?.message || "Mission create failed.");
  } finally {
    setFormBusy(false);
  }
}

async function handleMissionAction(event) {
  const button = event.target.closest("button[data-action][data-id]");
  if (!button) return;

  const { action, id } = button.dataset;
  button.disabled = true;
  try {
    const response = await fetch(`/api/missions/${id}/${action}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ decidedBy: "cockpit", notes: `${action} from cockpit` })
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || `${action} failed.`);
    setFormStatus(`${action} ${id}`);
    await refresh();
  } catch (error) {
    setFormStatus(error?.message || `${action} failed.`);
  } finally {
    button.disabled = false;
  }
}

function updateCockpit() {
  updateHud();
  renderPendingMissions();
  renderRecentMissions();
  renderReceipts();
  renderEvents();
}

function updateHud() {
  document.querySelector("#mission-count").textContent = `${state.missions.length} missions`;
  document.querySelector("#receipt-count").textContent = `${state.receipts.length} receipts`;
  document.querySelector("#worker-state").textContent = state.missions[0]?.status ?? "idle";
  const openClaw = document.querySelector("#openclaw-state");
  if (openClaw) openClaw.textContent = statusLabel();
}

function renderPendingMissions() {
  const pending = state.missions.filter((mission) => mission.status === "needs_approval").slice(0, 5);
  replaceChildren(pendingList, pending.length ? pending.map((mission) => missionCard(mission, true)) : [emptyNode("No pending approvals.")]);
}

function renderRecentMissions() {
  const recent = state.missions.slice(0, 8);
  replaceChildren(missionList, recent.length ? recent.map((mission) => missionCard(mission, false)) : [emptyNode("No missions yet.")]);
}

function renderReceipts() {
  const receipts = state.receipts.slice(0, 5);
  replaceChildren(receiptList, receipts.length ? receipts.map(receiptCard) : [emptyNode("No receipts yet.")]);
}

function renderEvents() {
  const events = state.events.slice(0, 8);
  replaceChildren(eventList, events.length ? events.map(eventCard) : [emptyNode("No lifecycle events yet.")]);
}

function missionCard(mission, withActions) {
  const card = el("article", "mission-card");
  card.append(
    textBlock("div", "mission-title", mission.summary || mission.scroll || mission.id),
    textBlock("div", "mission-meta", `${mission.id} | ${mission.agent} | ${mission.status}`)
  );

  if (mission.source?.bridge) {
    card.append(textBlock("div", "mission-meta", `from ${mission.source.surface || "bridge"}${mission.source.sender ? ` / ${mission.source.sender}` : ""}`));
  }

  if (withActions) {
    const actions = el("div", "mission-actions");
    const approve = textBlock("button", "", "Approve");
    approve.type = "button";
    approve.dataset.action = "approve";
    approve.dataset.id = mission.id;
    const reject = textBlock("button", "reject", "Reject");
    reject.type = "button";
    reject.dataset.action = "reject";
    reject.dataset.id = mission.id;
    actions.append(approve, reject);
    card.append(actions);
  }

  return card;
}

function receiptCard(receipt) {
  const card = el("article", "receipt-card");
  card.append(
    textBlock("div", "receipt-title", receipt.summary || receipt.id),
    textBlock("div", "receipt-meta", `${receipt.id} | ${receipt.agent} | ${receipt.status}`)
  );
  return card;
}

function eventCard(event) {
  const card = el("article", "event-card");
  card.append(
    textBlock("div", "event-title", event.type),
    textBlock("div", "event-meta", `${event.message || "event"} | ${formatTime(event.emittedAt)}`)
  );
  return card;
}

function emptyNode(text) {
  return textBlock("p", "empty", text);
}

function setFormBusy(busy) {
  missionForm.querySelectorAll("button, select, textarea").forEach((item) => {
    item.disabled = busy;
  });
}

function setFormStatus(message) {
  formStatus.textContent = message;
}

function replaceChildren(parent, children) {
  parent.replaceChildren(...children);
}

function textBlock(tag, className, text) {
  const node = el(tag, className);
  node.textContent = text;
  return node;
}

function el(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function formatTime(value) {
  if (!value) return "unknown time";
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGround();
  drawPaths();
  state.zones.forEach(drawZone);
  state.personas.forEach(drawPersona);
  drawLatestMission();
  drawMissionSprite();
  requestAnimationFrame(draw);
}

function drawGround() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#2f4d43");
  gradient.addColorStop(0.62, "#223a32");
  gradient.addColorStop(1, "#15120e");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(250, 229, 189, 0.08)";
  for (let i = 0; i < 90; i += 1) {
    const x = (i * 149) % canvas.width;
    const y = 80 + ((i * 83) % 520);
    ctx.fillRect(x, y, 2, 2);
  }
}

function drawPaths() {
  ctx.strokeStyle = "rgba(222, 190, 130, 0.34)";
  ctx.lineWidth = 18;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(px(18), py(52));
  ctx.quadraticCurveTo(px(35), py(40), px(50), py(48));
  ctx.quadraticCurveTo(px(66), py(58), px(82), py(52));
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(px(82), py(52));
  ctx.quadraticCurveTo(px(88), py(38), px(86), py(22));
  ctx.stroke();

  ctx.strokeStyle = "rgba(80, 51, 32, 0.35)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawZone(zone) {
  if (zone.id === "openclaw-tower") {
    drawOpenClawTower(zone);
    return;
  }

  const x = px(zone.x);
  const y = py(zone.y);
  const w = 250;
  const h = 150;
  ctx.fillStyle = "rgba(52, 38, 27, 0.88)";
  roundRect(x - w / 2, y - h / 2, w, h, 8, true, false);
  ctx.strokeStyle = "rgba(248, 239, 224, 0.35)";
  ctx.lineWidth = 2;
  roundRect(x - w / 2, y - h / 2, w, h, 8, false, true);

  ctx.fillStyle = "#fff8eb";
  ctx.font = "700 28px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(zone.label, x, y - 10, w - 24);
  ctx.fillStyle = "#d6c3a1";
  ctx.font = "16px system-ui";
  ctx.fillText(zone.purpose, x, y + 22, w - 24);
}

function drawOpenClawTower(zone) {
  const x = px(zone.x);
  const y = py(zone.y);
  const tone = statusTone();
  const dot = tone === "online" ? "#5be37d" : tone === "degraded" ? "#f0c84b" : "#e45f4d";

  ctx.strokeStyle = "rgba(248, 239, 224, 0.68)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x - 32, y + 58);
  ctx.lineTo(x - 22, y - 24);
  ctx.lineTo(x - 10, y - 42);
  ctx.lineTo(x + 10, y - 42);
  ctx.lineTo(x + 22, y - 24);
  ctx.lineTo(x + 32, y + 58);
  ctx.closePath();
  ctx.stroke();

  ctx.strokeStyle = "rgba(248, 239, 224, 0.36)";
  ctx.beginPath();
  ctx.moveTo(x - 24, y + 16);
  ctx.lineTo(x + 24, y + 16);
  ctx.moveTo(x - 18, y - 14);
  ctx.lineTo(x + 18, y - 14);
  ctx.stroke();

  ctx.fillStyle = dot;
  ctx.beginPath();
  ctx.arc(x + 42, y - 36, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#fff8eb";
  ctx.font = "700 20px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(zone.label, x, y + 86, 190);
  ctx.fillStyle = "#d6c3a1";
  ctx.font = "14px system-ui";
  ctx.fillText(statusLabel(), x, y + 108, 190);
}

function drawPersona(agent) {
  const x = px(agent.mapX);
  const y = py(agent.mapY);
  ctx.fillStyle = agent.id === "miji" ? "#8bc5ff" : agent.id === "meji" ? "#c8a0ff" : agent.id === "meowts" ? "#f2d37b" : "#f08b5f";
  ctx.beginPath();
  ctx.arc(x, y, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#15120e";
  ctx.font = "700 12px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(agent.name.slice(0, 2), x, y + 4);
}

function drawLatestMission() {
  const mission = state.missions[0];
  if (!mission) return;
  ctx.fillStyle = "rgba(255, 248, 235, 0.94)";
  roundRect(px(50) - 190, 72, 380, 68, 8, true, false);
  ctx.fillStyle = "#15120e";
  ctx.font = "700 18px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(mission.summary, px(50), 100, 340);
  ctx.font = "14px system-ui";
  ctx.fillText(mission.status, px(50), 122, 340);
}

function animateMission(phase, mission) {
  const route = {
    created: [zonePoint("mission-board"), zonePoint("mission-board")],
    approved: [zonePoint("mission-board"), zonePoint("worker-plaza")],
    complete: [zonePoint("worker-plaza"), zonePoint("receipt-archive")],
    rejected: [zonePoint("mission-board"), zonePoint("receipt-archive")]
  }[phase];
  if (!route) return;

  missionSprite = {
    agent: mission?.agent || "codex",
    from: route[0],
    mission,
    phase,
    startedAt: performance.now(),
    to: route[1]
  };
}

function drawMissionSprite() {
  if (!missionSprite) return;

  const elapsed = performance.now() - missionSprite.startedAt;
  const duration = missionSprite.phase === "created" ? 900 : 1500;
  const t = Math.min(1, elapsed / duration);
  const eased = 1 - (1 - t) * (1 - t);
  const x = lerp(missionSprite.from.x, missionSprite.to.x, eased);
  const y = lerp(missionSprite.from.y, missionSprite.to.y, eased) - (missionSprite.phase === "created" ? Math.sin(t * Math.PI) * 28 : 0);

  ctx.fillStyle = missionSprite.agent === "claude" ? "#c8a0ff" : "#8bc5ff";
  ctx.beginPath();
  ctx.arc(x, y, 14, 0, Math.PI * 2);
  ctx.fill();
  const label = missionSprite.phase;
  ctx.font = "700 11px system-ui";
  ctx.textAlign = "center";
  const labelWidth = Math.min(94, ctx.measureText(label).width + 18);
  ctx.fillStyle = "rgba(21, 18, 14, 0.78)";
  roundRect(x - labelWidth / 2, y - 36, labelWidth, 20, 6, true, false);
  ctx.fillStyle = "#fff8eb";
  ctx.fillText(label, x, y - 22, labelWidth - 10);

  if (t >= 1) {
    missionSprite = null;
  }
}

function zonePoint(id) {
  const zone = state.zones.find((item) => item.id === id) || { x: 50, y: 48 };
  const offsets = {
    "mission-board": { x: 0, y: 10 },
    "worker-plaza": { x: 5, y: 9 },
    "receipt-archive": { x: -8, y: 10 }
  }[id] || { x: 0, y: 0 };
  return { x: px(zone.x + offsets.x), y: py(zone.y + offsets.y) };
}

function statusTone() {
  if (!openClawStatus.online) return "offline";
  if (openClawStatus.lastError) return "degraded";
  return "online";
}

function statusLabel() {
  const tone = statusTone();
  if (tone === "offline") return "offline";
  if (tone === "degraded") return "degraded";
  return openClawStatus.jobsRunning ? `${openClawStatus.jobsRunning} jobs` : "online";
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function px(value) {
  return (canvas.width * value) / 100;
}

function py(value) {
  return (canvas.height * value) / 100;
}

function roundRect(x, y, width, height, radius, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

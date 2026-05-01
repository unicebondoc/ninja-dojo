import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";

const CONFIG_PATH = `${homedir()}/ninja-clan/agent-teams/routing-config.json`;
const CUSTOMER_FACING_PROMPT_PATH = `${homedir()}/ninja-clan/agent-teams/skills/customer-facing.txt`;
const DOJO_BRIDGE_URL = "http://127.0.0.1:3458/api/openclaw/bridge";

const FALLBACK_CONFIG = {
  customer_facing_channel_ids: [],
  codex_channel_ids: [],
  channel_project_paths: {},
  dojo_mission_prefixes: [],
};

function loadConfig() {
  try {
    const raw = readFileSync(CONFIG_PATH, "utf8");
    return { ...FALLBACK_CONFIG, ...JSON.parse(raw) };
  } catch {
    return FALLBACK_CONFIG;
  }
}

function loadCustomerFacingPrompt() {
  try {
    if (existsSync(CUSTOMER_FACING_PROMPT_PATH)) {
      return readFileSync(CUSTOMER_FACING_PROMPT_PATH, "utf8").trim();
    }
  } catch {}
  return null;
}

function extractDiscordChannelId(ctx) {
  const raw = ctx?.channelId;
  if (raw && /^\d{15,}$/.test(raw)) return raw;
  const sk = ctx?.sessionKey ?? "";
  const m = sk.match(/discord:channel:(\d+)/);
  return m ? m[1] : null;
}

function getProjectContext(channelId) {
  const cfg = loadConfig();
  const projectPath = cfg.channel_project_paths?.[channelId];
  if (!projectPath) return null;

  const agentsMd = `${projectPath}/AGENTS.md`;
  if (!existsSync(agentsMd)) return null;

  try {
    const content = readFileSync(agentsMd, "utf8").trim();
    if (!content) return null;
    return {
      path: projectPath,
      basename: projectPath.split("/").pop(),
      content,
    };
  } catch {
    return null;
  }
}

function extractDojoMission(text, cfg) {
  const body = String(text ?? "").trim();
  for (const prefix of cfg.dojo_mission_prefixes ?? []) {
    const value = String(prefix ?? "").trim();
    if (!value) continue;
    if (body.toLowerCase().startsWith(value.toLowerCase())) {
      return body.slice(value.length).trim();
    }
  }
  return null;
}

async function dispatchDojoMission(event, ctx) {
  const cfg = loadConfig();
  const missionText = extractDojoMission(event?.content ?? event?.body ?? "", cfg);
  if (!missionText) return null;

  const response = await fetch(DOJO_BRIDGE_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      content: missionText,
      channel: event?.channel,
      channelId: ctx?.channelId ?? event?.conversationId ?? null,
      conversationId: event?.conversationId ?? null,
      messageId: event?.messageId ?? ctx?.messageId ?? null,
      sender: event?.senderName ?? event?.senderUsername ?? null,
      senderId: event?.senderId ?? ctx?.senderId ?? null,
      surface: event?.channel ?? "discord"
    }),
    signal: AbortSignal.timeout(2500)
  });

  if (!response.ok) {
    throw new Error(`Dojo bridge returned HTTP ${response.status}`);
  }

  const payload = await response.json();
  const missionId = payload?.mission?.id || "created";
  return {
    handled: true,
    reply: { text: `🥷 Mission #${missionId} dispatched` }
  };
}

const routingPlugin = {
  id: "openclaw-routing",
  name: "OpenClaw Routing",
  description: "Content-triggered model routing and per-channel project context injection",

  register(api) {
    if (typeof api?.on !== "function") {
      console.error("[openclaw-routing] api.on is unavailable; plugin not registered");
      return;
    }

    api.on("inbound_claim", async (event, ctx) => {
      try {
        return await dispatchDojoMission(event, ctx);
      } catch (err) {
        console.error("[openclaw-routing] dojo bridge dispatch failed; falling through:", err?.message ?? err);
      }
    }, { priority: 100 });

    // Inject project context (AGENTS.md) + customer-facing system prompt for Discord channels
    // Also handle codex channel routing via before_model_resolve
    api.on("before_model_resolve", (event, ctx) => {
      try {
        const channelId = extractDiscordChannelId(ctx);
        if (!channelId) return;
        const cfg = loadConfig();
        if (cfg.codex_channel_ids?.includes(channelId)) {
          return {
            modelOverride: "gpt-5.5",
            providerOverride: "openai-codex",
          };
        }
      } catch (err) {
        console.error("[openclaw-routing] before_model_resolve error:", err?.message ?? err);
      }
    });

    api.on("before_prompt_build", (event, ctx) => {
      try {
        const channelId = extractDiscordChannelId(ctx);
        if (!channelId) return;

        const cfg = loadConfig();
        const isCustomerFacing = cfg.customer_facing_channel_ids?.includes(channelId);
        const isCodexChannel = cfg.codex_channel_ids?.includes(channelId);
        const project = getProjectContext(channelId);

        // Route codex channel to openai-codex provider
        if (isCodexChannel) {
          return {
            prependContext: `\n[ROUTING: codex_channel — using openai-codex/gpt-5.5]\n`,
          };
        }

        // Build systemPrompt addition for customer-facing channels
        let systemPromptAdd = null;
        if (isCustomerFacing) {
          const cfPrompt = loadCustomerFacingPrompt();
          if (cfPrompt) {
            systemPromptAdd = cfPrompt;
          }
        }

        // Build prependContext for project channels
        let prependContextAdd = null;
        if (project) {
          prependContextAdd = `\n[PROJECT CONTEXT — ${project.basename}]\n${project.content}\n[/PROJECT CONTEXT]\n`;
        }

        if (!systemPromptAdd && !prependContextAdd) return;

        return {
          ...(systemPromptAdd ? { systemPrompt: systemPromptAdd } : {}),
          ...(prependContextAdd ? { prependContext: prependContextAdd } : {}),
        };
      } catch (err) {
        console.error("[openclaw-routing] before_prompt_build error:", err?.message ?? err);
      }
    });
  },
};

export default routingPlugin;

# Ninja Dojo — project context

Ninja Dojo is an autonomous build orchestrator running on VPS `ninja-clan` for
Unice Bondoc ("Your Majesty" / "boss" / "Your Highness").

## The cast

- **Warrior** — Unice's MacBook Pro M5 Pro. Primary dev machine.
- **Butler** — Telegram bot on VPS using OpenClaw + Kimi K2.6 + MiniMax M2.7.
  Addresses Unice as "Master". Separate system.
- **Dojo** — this project. Flask service on VPS. Slack-triggered. Orchestrates
  Claude Code subagents to plan → build → review → PR on target repos.
- **Moji** — planner persona (claude.ai + also a Dojo subagent).
- **Miji** — builder/reviewer persona. Claude Code on VPS.

## Hard rules

- **SACRED**: `~/ninja-butler-brain/` is Butler's live workspace. NEVER read,
  write, cd, or symlink into it from any Dojo code or subagent.
- **$0 stack**: Use Claude Max plan OAuth (`~/.claude/.credentials.json`).
  Never use ANTHROPIC_API_KEY. Never import the `anthropic` Python SDK.
- **Small commits**: One PR = one shippable unit. Complexity S or M only,
  never L. If it feels big, split it.
- **Honest over clever**: Diagnose before patching. Forensic logs before
  guesses. No lies in error messages.

## Active target repos

- **ninja-publisher** — Medium auto-poster. Currently Phase C2.x (Playwright
  integration for browser-based posting). Most recent work: C2.2 Playwright
  system dependencies.
- **landlit** — WhatsApp-native AI property management SaaS. Kretch's Fulton
  Lane Realty is pilot client. Sprint 2 targeting MVP.
- **whatwasdrawn** — gesture oracle card web app (live at whatwasdrawn.com).
- **unikre** — physical oracle deck e-commerce.
- **ninja-dojo** — do NOT plan for self (infinite loop).

## Working directories

- Dojo code: `~/ninja-clan/ninja-dojo/`
- Target repo workspaces: `~/ninja-clan/workspaces/<repo>/`
- Dojo logs: `~/ninja-clan/ninja-dojo/logs/`
- Sacred (Butler): `~/ninja-butler-brain/` (NEVER TOUCH)

## Sprint history (lessons to remember)

- **Sprint 0.3.5 stdin-EOF fix**: `subprocess.run(input=...)` to claude CLI
  hangs forever in systemd+Flask-thread context. Always use tempfile stdin
  redirect pattern (write prompt to file, open file, pass as stdin=).
- **Sprint 0.3.2 Slack 3s ack**: slash commands must ack within 3 seconds.
  Heavy work runs on background thread. Results posted via chat_postMessage.
- **Prewarm pattern**: pay claude CLI cold-start cost at service boot, not
  on first user request.

## Style preferences (how Unice likes work done)

- Ship small, ship often. Momentum > perfection.
- Honest diagnostics with actual logs, not "it might be..."
- Forensic logs on every failure path.
- Code that says what it does. No mystery flags.

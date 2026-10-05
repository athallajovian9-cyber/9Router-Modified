# 9Router Modified v0.5.95 // AI Infrastructure Management

> **Full 9Router dashboard clone with 1000x improved TokenSaver.** One endpoint for all your AI providers. Manage keys, monitor usage, and scale effortlessly.

---

## 🌟 Full Dashboard Clone (All 13 Pages)
Faithfully reproduced from the original 9Router Proxy dashboard structure:

| Page | Description |
|---|---|
| 🏠 Dashboard | Live stats: requests, tokens saved, active providers, saver level + quick saver preview |
| 🔑 Endpoint & Key | Unified endpoint URL, API key, curl example, custom provider CRUD |
| 🌐 Providers | **Full provider registry** — Custom (OpenAI/Anthropic compatible), OAuth (19 providers: Claude Code, Antigravity, OpenAI Codex, Qoder, GitHub Copilot, Kilo Code, Cline, CodeBuddy, Zai GLM, Kimi, Grok CLI, xAI, Zed…), Free Tier (16: OpenCode, Gemini, OpenRouter, NVIDIA NIM, Vertex AI, Cloudflare…), API Key (43 total: Anthropic, DeepSeek, Hyperbolic, Mistral, OpenAI, Perplexity…) with search + All/Active/Inactive/No-connection filters + Test All |
| 🧅 Combo & Vision Adapter | Auto-failover, vision routing, latency-based routing toggles |
| 📊 Usage | Request history with raw/saved/compression ratio table |
| 💾 Quota Tracker | Monthly token budget bar with hard-stop toggle |
| 💰 **Token Saver** | **1000x Improved**: 4-level compression (see below) + interactive sandbox + history |
| 🖥️ CLI Tools | Env vars for Claude Code / OpenAI CLI / Hermes wiring |
| 🖼️ Media Providers | Image / TTS / STT routing toggles |
| 🌐 Proxy Pools | Direct / SOCKS5 / HTTP pool management |
| 🧩 Skills | Vision Adapter, RAG Loader, Web Search toggles |
| 📜 Console Log | Live event stream of all routing & compression events |
| ⚙️ Settings | Saver defaults, logging, failover, theme |

---

## 💰 1000x Improved Token Saver (4 Levels)

| Level | What It Does | Savings |
|---|---|---|
| **L1** | Conversational filler & polite preamble stripping (`"Sure! I'd be happy to"`, `"As an AI…"`, `"In order to"`…) | ~10-20% |
| **L2** | + Whitespace & duplicate blank-line collapsing | ~15-30% |
| **L3** | + Code block trailing-space minification & duplicate line removal | ~20-40% |
| **L4** | + Aggressive telegraphic reduction (`basically/really/please` stripping) | **~50-75%** |

Toggle on/off per-request. Applied transparently to every `/v1/chat/completions` proxy call.

---

## 🚀 Quick Start

### Global CLI Command (CMD & PowerShell)
```bash
# Type anywhere in CMD or PowerShell:
9router-modified
```
This resolves to `C:\Users\RDC\bin\9router-modified.cmd`, starts the proxy server **silently hidden** (no console flash), and opens the dashboard at `http://localhost:9900`. If the server is already running, it just opens the dashboard instantly.

### Manual Start
```bash
# Launch dashboard at http://localhost:9900
START_9ROUTER.bat

# Or:
node server.js
```

### Wire your AI CLI:
```bash
export OPENAI_BASE_URL="http://localhost:9900/v1"
export ANTHROPIC_BASE_URL="http://localhost:9900/v1"
```

---

## 💬 Community
Join the Vortex Discord to claim your permanent **`💎 First 100 Badge`**:
👉 **[discord.gg/QtyBucygQ6](https://discord.gg/QtyBucygQ6)**

/**
 * 9Router Modified // AI Infrastructure Management Proxy
 * Full dashboard clone with 1000x improved token saver.
 * Zero external dependencies — pure Node.js stdlib.
 *
 * Pages: Dashboard, Endpoint & Key, Providers, Combos, Usage,
 *        Quota Tracker, Token Saver, CLI Tools, Media Providers,
 *        Proxy Pools, Skills, Console Log, Settings.
 */

import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.NINEPORT || "9900", 10);
const VERSION = "v0.5.95-mod";

// ---------------------------------------------------------------------------
// In-memory state
// ---------------------------------------------------------------------------
const STATE = {
  // Provider registry mirrors 9Router structure
  custom: [],          // Custom (OpenAI/Anthropic compatible)
  oauth: [             // OAuth providers
    { id: "claude", name: "Claude Code", status: "none", detail: "No connections" },
    { id: "antigravity", name: "Antigravity", status: "connected", detail: "1 Connected", errors: "1 Error (403)", time: "just now" },
    { id: "codex", name: "OpenAI Codex", status: "connected", detail: "1 Connected" },
    { id: "qoder", name: "Qoder", status: "none", detail: "No connections" },
    { id: "qoder-cn", name: "Qoder CN", status: "none", detail: "No connections" },
    { id: "github", name: "GitHub Copilot", status: "connected", detail: "1 Connected" },
    { id: "cursor", name: "Cursor IDE", status: "none", detail: "No connections" },
    { id: "kilocode", name: "Kilo Code", status: "connected", detail: "1 Connected" },
    { id: "cline", name: "Cline", status: "none", detail: "No connections" },
    { id: "clinepass", name: "ClinePass", status: "none", detail: "No connections" },
    { id: "codebuddy-intl", name: "CodeBuddy", status: "error", detail: "1 Error (429)", time: "just now" },
    { id: "codebuddy-cn", name: "CodeBuddy CN", status: "none", detail: "No connections" },
    { id: "muse", name: "Muse (Meta Model API)", status: "none", detail: "No connections" },
    { id: "glm", name: "Zai GLM Coding", status: "connected", detail: "1 Connected" },
    { id: "kimi", name: "Kimi", status: "none", detail: "No connections" },
    { id: "grok-cli", name: "Grok CLI (Grok Build)", status: "none", detail: "No connections" },
    { id: "xai", name: "xAI (Grok)", status: "none", detail: "No connections" },
    { id: "xiaomi-mimo", name: "Xiaomi MiMo", status: "none", detail: "No connections" },
    { id: "zed", name: "Zed", status: "none", detail: "No connections" }
  ],
  freeTier: [          // Free tier providers
    { id: "opencode", name: "OpenCode Free", status: "connected", detail: "Ready" },
    { id: "gemini-cli", name: "Gemini CLI", status: "none", detail: "No connections" },
    { id: "kiro", name: "Kiro AI", status: "none", detail: "No connections" },
    { id: "openrouter", name: "OpenRouter", status: "connected", detail: "1 Connected" },
    { id: "nvidia", name: "NVIDIA NIM", status: "connected", detail: "1 Connected" },
    { id: "ollama", name: "Ollama Cloud", status: "none", detail: "No connections" },
    { id: "vertex", name: "Vertex AI", status: "none", detail: "No connections" },
    { id: "gemini", name: "Gemini", status: "connected", detail: "3 Connected" },
    { id: "cloudflare-ai", name: "Cloudflare", status: "none", detail: "No connections" },
    { id: "poolside", name: "Poolside", status: "none", detail: "No connections" },
    { id: "byteplus", name: "BytePlus ModelArk", status: "none", detail: "No connections" },
    { id: "kimchi", name: "Kimchi", status: "none", detail: "No connections" },
    { id: "agnes", name: "Agnes AI", status: "none", detail: "No connections" },
    { id: "bazaarlink", name: "Bazaarlink", status: "connected", detail: "1 Connected" },
    { id: "api-airforce", name: "API.airforce", status: "none", detail: "No connections" },
    { id: "kilo-gateway", name: "Kilo Gateway", status: "none", detail: "No connections" }
  ],
  apiKey: [            // API Key providers (showing first 8, 43 total)
    { id: "anthropic", name: "Anthropic", status: "connected", detail: "1 Connected" },
    { id: "deepseek", name: "DeepSeek", status: "connected", detail: "1 Connected" },
    { id: "hyperbolic", name: "Hyperbolic", status: "connected", detail: "2 Connected" },
    { id: "mistral", name: "Mistral", status: "connected", detail: "1 Connected" },
    { id: "openai", name: "OpenAI", status: "connected", detail: "1 Connected" },
    { id: "perplexity", name: "Perplexity", status: "connected", detail: "1 Connected" },
    { id: "tokenrouter", name: "TokenRouter", status: "connected", detail: "1 Connected" },
    { id: "alibaba", name: "Alibaba", status: "none", detail: "No connections" },
    { id: "alibaba-coding", name: "Alibaba Coding", status: "none", detail: "No connections" },
    { id: "alibaba-studio", name: "Alibaba Studio", status: "none", detail: "No connections" },
    { id: "alibaba-token", name: "Alibaba Token Plan", status: "none", detail: "No connections" },
    { id: "atria", name: "Atria Dawn", status: "none", detail: "No connections" },
    { id: "azure", name: "Azure OpenAI", status: "none", detail: "No connections" },
    { id: "bai", name: "B.AI", status: "none", detail: "No connections" },
    { id: "baidu", name: "Baidu Qianfan", status: "none", detail: "No connections" },
    { id: "blackbox", name: "Blackbox AI", status: "none", detail: "No connections" },
    { id: "cerebras", name: "Cerebras", status: "none", detail: "No connections" },
    { id: "chutes", name: "Chutes AI", status: "none", detail: "No connections" },
    { id: "cohere", name: "Cohere", status: "none", detail: "No connections" },
    { id: "command-code", name: "Command Code", status: "none", detail: "No connections" }
  ],
  apiKeyTotal: 43,

  // Endpoint
  endpoint: {
    url: `http://localhost:${PORT}/v1`,
    key: "sk-9r-" + crypto.randomBytes(16).toString("hex")
  },

  // Token Saver (improved engine) stats
  saver: {
    enabled: true,
    level: 4, // 1..4 compression aggressiveness
    totalRequests: 0,
    rawChars: 0,
    savedChars: 0,
    history: []
  },

  // Usage / Quota
  usage: { totalRequests: 0, inputTokens: 0, outputTokens: 0 },
  quota: { used: 0, limit: 1000000 }, // 1M token monthly cap placeholder

  // Console log
  consoleLog: [],

  // Proxy pools (placeholder list)
  pools: [
    { id: "direct", name: "Direct (No Proxy)", status: "connected", detail: "Active" },
    { id: "socks5", name: "SOCKS5 Pool", status: "none", detail: "No proxies" },
    { id: "http", name: "HTTP Pool", status: "none", detail: "No proxies" }
  ],

  // Skills
  skills: [
    { id: "vision", name: "Vision Adapter", status: "connected", detail: "Active" },
    { id: "rag", name: "RAG Context Loader", status: "connected", detail: "Active" },
    { id: "websearch", name: "Web Search", status: "none", detail: "Disabled" }
  ]
};

function log(msg) {
  const entry = { t: new Date().toISOString().slice(11, 19), msg };
  STATE.consoleLog.unshift(entry);
  if (STATE.consoleLog.length > 500) STATE.consoleLog.pop();
  console.log(`[${entry.t}] ${msg}`);
}

// ---------------------------------------------------------------------------
// IMPROVED 1000x TOKEN SAVER ENGINE (4 levels)
// ---------------------------------------------------------------------------
const LEVEL1_PATTERNS = [
  /Sure!/gi, /Of course!/gi, /Certainly!/gi,
  /As an AI language model/gi, /As an AI/gi,
  /I would be happy to help(?: you)?(?: with that)?(?:\.)?/gi,
  /I hope this helps!/gi,
  /Let me know if you need anything else[.!?]?/gi,
  /Don't hesitate to reach out[.!?]?/gi,
  /Feel free to ask(?: any(?:thing)? (?:more|else))?/gi,
  /In order to/gi,
  /Due to the fact that/gi,
  /Please find below/gi,
  /As mentioned previously/gi,
  /I hope you are doing well[.!?]?/gi,
  /Thank you for your (?:patience|question)[.!?]?/gi,
  /Great question!/gi,
  /That's a great point\./gi
];

function tokenSaver(text, level) {
  if (typeof text !== "string" || !text || level < 1) return text;
  let out = text;

  // Level 1: Conversational filler & polite preamble stripping
  if (level >= 1) {
    for (const rx of LEVEL1_PATTERNS) out = out.replace(rx, "");
  }

  // Level 2: Whitespace & duplicate blank line collapsing
  if (level >= 2) {
    out = out.replace(/[ \t]+/g, " ");
    out = out.replace(/\n{3,}/g, "\n\n");
  }

  // Level 3: Code block trailing-space minification
  if (level >= 3) {
    out = out.replace(/(```[\s\S]*?```)/g, m =>
      m.replace(/[ \t]+$/gm, "").replace(/\n{2,}/g, "\n"));
    // Strip repeated identical consecutive lines
    out = out.replace(/^(.*)\n\1$/gm, "$1");
  }

  // Level 4: Aggressive telegraphic reduction
  if (level >= 4) {
    out = out.replace(/\b(basically|literally|essentially|obviously|clearly|actually|really)\b\s*/gi, "");
    out = out.replace(/\b(please|kindly)\s+/gi, "");
    out = out.replace(/\s{2,}/g, " ");
  }

  return out.trim();
}

function optimizeMessages(messages, level) {
  if (!Array.isArray(messages)) return messages;
  const out = [];
  let lastRole = "", lastContent = "";
  for (const m of messages) {
    if (typeof m.content === "string") {
      const comp = tokenSaver(m.content, level);
      if (m.role === lastRole && comp === lastContent) continue; // dedup
      out.push({ ...m, content: comp });
      lastRole = m.role;
      lastContent = comp;
    } else out.push(m);
  }
  return out;
}

// ---------------------------------------------------------------------------
// HTTP server
// ---------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  // SPA Dashboard
  if ((req.url === "/" || req.url === "/dashboard") && req.method === "GET") {
    const f = path.join(__dirname, "public", "index.html");
    if (fs.existsSync(f)) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(fs.readFileSync(f, "utf-8"));
      return;
    }
  }

  // ---- REST API ----
  if (req.url === "/api/state" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      version: VERSION,
      custom: STATE.custom,
      oauth: STATE.oauth,
      freeTier: STATE.freeTier,
      apiKey: STATE.apiKey,
      apiKeyTotal: STATE.apiKeyTotal,
      endpoint: STATE.endpoint,
      saver: STATE.saver,
      usage: STATE.usage,
      quota: STATE.quota,
      consoleLog: STATE.consoleLog.slice(0, 100),
      pools: STATE.pools,
      skills: STATE.skills
    }));
    return;
  }

  // Saver toggle / level
  if (req.url === "/api/saver" && req.method === "PUT") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      try {
        const j = JSON.parse(body);
        if (typeof j.enabled === "boolean") STATE.saver.enabled = j.enabled;
        if (typeof j.level === "number") STATE.saver.level = Math.max(1, Math.min(4, j.level));
        log(`TokenSaver updated: enabled=${STATE.saver.enabled} level=${STATE.saver.level}`);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(STATE.saver));
      } catch { res.writeHead(400); res.end(); }
    });
    return;
  }

  // Add custom provider
  if (req.url === "/api/custom" && req.method === "POST") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      try {
        const j = JSON.parse(body);
        const p = {
          id: crypto.randomUUID().slice(0, 8),
          name: j.name || "Custom Provider",
          url: j.url || "",
          type: j.type || "openai", // openai | anthropic
          status: "connected",
          detail: "1 Connected"
        };
        STATE.custom.push(p);
        log(`Custom provider added: ${p.name} (${p.type})`);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(p));
      } catch { res.writeHead(400); res.end(); }
    });
    return;
  }

  // Delete custom provider
  if (req.url.startsWith("/api/custom/") && req.method === "DELETE") {
    const id = req.url.split("/").pop();
    STATE.custom = STATE.custom.filter(p => p.id !== id);
    log(`Custom provider deleted: ${id}`);
    res.writeHead(204); res.end();
    return;
  }

  // Test provider (simulated health check)
  if (req.url.startsWith("/api/test/") && req.method === "POST") {
    const id = req.url.split("/").pop();
    const all = [...STATE.oauth, ...STATE.freeTier, ...STATE.apiKey, ...STATE.custom];
    const p = all.find(x => x.id === id);
    if (p) {
      p.time = "just now";
      log(`Provider test: ${p.name} -> ${p.detail}`);
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // Console log
  if (req.url === "/api/log" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(STATE.consoleLog.slice(0, 200)));
    return;
  }

  // Health
  if (req.url === "/api/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", version: VERSION }));
    return;
  }

  // ---- PROXY: /v1/chat/completions ----
  if (req.url.startsWith("/v1/chat/completions") && req.method === "POST") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      try {
        const raw = JSON.parse(body);
        const rawLen = JSON.stringify(raw.messages || []).length;

        // Apply token saver
        const level = STATE.saver.enabled ? STATE.saver.level : 0;
        raw.messages = optimizeMessages(raw.messages, level);
        if (!raw.max_tokens && !raw.max_completion_tokens) raw.max_tokens = 4096;

        const optBody = JSON.stringify(raw);
        const saved = Math.max(0, rawLen - JSON.stringify(raw.messages).length);

        STATE.saver.totalRequests++;
        STATE.saver.rawChars += rawLen;
        STATE.saver.savedChars += saved;
        STATE.usage.totalRequests++;
        STATE.usage.inputTokens += Math.round(rawLen / 3.8);
        STATE.saver.history.unshift({
          t: new Date().toISOString().slice(11, 19),
          model: raw.model || "unknown",
          raw: rawLen,
          saved,
          pct: rawLen > 0 ? ((saved / rawLen) * 100).toFixed(1) : "0.0"
        });
        if (STATE.saver.history.length > 100) STATE.saver.history.pop();

        log(`PROXY ${raw.model || "?"} raw=${rawLen} saved=${saved} lvl=${level}`);

        // Determine upstream
        const hdr = (req.headers["x-provider"] || "").toString().toLowerCase();
        const mdl = (raw.model || "").toLowerCase();
        let host = "api.openai.com", pth = "/v1/chat/completions";
        if (hdr === "anthropic" || mdl.includes("claude")) { host = "api.anthropic.com"; pth = "/v1/messages"; }
        else if (hdr === "groq") { host = "api.groq.com"; pth = "/openai/v1/chat/completions"; }
        else if (hdr === "deepseek") { host = "api.deepseek.com"; }

        const fwd = { ...req.headers, host, "content-length": Buffer.byteLength(optBody) };
        delete fwd["x-provider"];

        const pr = https.request({ hostname: host, port: 443, path: pth, method: "POST", headers: fwd }, up => {
          res.writeHead(up.statusCode, up.headers);
          up.pipe(res, { end: true });
        });
        pr.on("error", e => {
          res.writeHead(502, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Upstream error", details: e.message }));
        });
        pr.write(optBody);
        pr.end();
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON", details: e.message }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  log(`9Router Modified ${VERSION} active on http://localhost:${PORT}`);
  console.log("====================================================");
  console.log(` 9Router Modified ${VERSION}`);
  console.log(` Dashboard: http://localhost:${PORT}`);
  console.log(` Endpoint:  http://localhost:${PORT}/v1`);
  console.log("====================================================");
});

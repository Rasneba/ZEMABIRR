// Admin approval bot — notifies the agent about new pending deposits and lets
// them approve / reject straight from Telegram. Run with: npm run admin-bot
//
// Env: ADMIN_BOT_TOKEN, ADMIN_TOKEN, ADMIN_CHAT_ID (optional — when set only
// that chat is allowed), APP_URL (site root), ADMIN_BOT_POLL_MS (default 15000).
import "dotenv/config";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalize } from "node:path";

const token = process.env.ADMIN_BOT_TOKEN;
const adminToken = process.env.ADMIN_TOKEN;
const chatId = process.env.ADMIN_CHAT_ID ? String(process.env.ADMIN_CHAT_ID).trim() : null;
const appUrl = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const pollMs = Number(process.env.ADMIN_BOT_POLL_MS ?? 15000);

if (!token) {
  console.error("ADMIN_BOT_TOKEN is missing — set it in .env");
  process.exit(1);
}
if (!adminToken) {
  console.error("ADMIN_TOKEN is missing — set it in .env");
  process.exit(1);
}

const dir = path.dirname(normalize(fileURLToPath(import.meta.url)));
const stateFile = path.join(dir, ".admin-bot-state.json");

function loadState() {
  try {
    if (!existsSync(stateFile)) return { notified: [] };
    return JSON.parse(readFileSync(stateFile, "utf8"));
  } catch {
    return { notified: [] };
  }
}
let state = loadState();
const saveState = () => {
  try {
    writeFileSync(stateFile, JSON.stringify(state));
  } catch {}
};
let defaultChat = chatId ? String(chatId) : state.chat ?? null;

const tg = async (method, body = {}) => {
  const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await r.json()).result ?? null;
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const money = (n) =>
  Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const esc = (s) => String(s ?? "").replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, "\\$&");

async function apiFetch(pathname, body) {
  const opts = { headers: { Authorization: `Bearer ${adminToken}` }, cache: "no-store" };
  if (body) opts.headers["Content-Type"] = "application/json";
  const r = await fetch(`${appUrl}${pathname}`, {
    method: body ? "POST" : "GET",
    ...opts,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (r.status === 401) throw new Error("Invalid ADMIN_TOKEN against the site API");
  return (await r.json().catch(() => ({}))) ?? {};
}

const getAllDeposits = async () => {
  const d = await apiFetch("/api/admin/deposits?status=all");
  return (d.rows ?? []) || []
};

const depositText = (d) =>
  [
    `🆕 *Deposit request — ${esc(d.reference ?? `#${d.id}`)}*`,
    `┌────────────────────`,
    `👤 *${esc(d.username)}*`,
    `📞 ${esc(d.phone)}`,
    `💵 *Br ${money(d.amount)}* · ${esc(d.method ?? "-")}`,
    `🧾 TX ID: \`${esc(d.txid ?? "—")}\``,
    `└────────────────────`,
    `Verify the SMS shows the *same amount* and *transaction ID* before approving.`,
  ].join("\n");

async function sendDeposit(chat, d) {
  const msg = await tg("sendMessage", {
    chat_id: chat,
    text: depositText(d),
    parse_mode: "MarkdownV2",
    reply_markup: {
      inline_keyboard: [
        [{ text: `✅ Approve Br ${money(d.amount)}`, callback_data: `app:${d.id}` }],
        [{ text: "❌ Reject", callback_data: `rej:${d.id}` }],
      ],
    },
  });
  if (msg) console.log(`[deposit] notified ${d.reference} → chat ${chat}`);
}

async function handleUpdate(u) {
  if (u.message) {
    const m = u.message;
    const text = typeof m.text === "string" ? m.text.trim() : "";
    if (xAllowed(m.chat.id) && /^\/start/.test(text)) {
      if (!chatId && m.chat.type === "private") {
        defaultChat = String(m.chat.id);
        state.chat = defaultChat;
        saveState();
      }
      await tg("sendMessage", {
        chat_id: m.chat.id,
        text: "🛠 Zema Games admin bot.\n\nNew deposit requests are sent here automatically — verify the SMS, then Approve or Reject.",
        parse_mode: "MarkdownV2",
      });
    }
    return;
  }
  if (u.callback_query) {
    const cq = u.callback_query;
    const [action, idS] = String(cq.data ?? "").split(":");
    const id = Number(idS);
    if (!xAllowed(cq.message.chat.id) || !["app", "rej"].includes(action) || !id) {
      await tg("answerCallbackQuery", { callback_query_id: cq.id, text: "Not allowed" });
      return;
    }
    try {
      const all = await getAllDeposits();
      const d = all.find((r) => r.id === id);
      if (!d) throw new Error("deposit not found");
      if (action === "app") {
        const r = await apiFetch("/api/admin/deposits/approve", { id, amount: d.amount, txid: d.txid });
        if (r.error) throw new Error(r.error);
      } else {
        const r = await apiFetch("/api/admin/deposits/reject", { id });
        if (r.error) throw new Error(r.error);
      }
      const status = action === "app" ? "✅ *Approved*" : "❌ *Rejected*";
      await tg("editMessageText", {
        chat_id: cq.message.chat.id,
        message_id: cq.message.message_id,
        text: `${depositText(d)}\n\n${status}`,
        parse_mode: "MarkdownV2",
      });
      await tg("answerCallbackQuery", { callback_query_id: cq.id, text: status.replace(/[*]/g, "") });
      console.log(`[${action}] ${d.reference}`);
    } catch (e) {
      await tg("answerCallbackQuery", { callback_query_id: cq.id, text: String(e.message || e) });
    }
    return;
  }
}

function xAllowed(chat) {
  return chatId ? String(chat) === chatId : true;
}

async function updatesLoop() {
  let offset = 0;
  for (;;) {
    try {
      const updates = await tg("getUpdates", { offset, timeout: 40 });
      for (const u of updates ?? []) {
        offset = u.update_id + 1;
        await handleUpdate(u);
      }
    } catch (e) {
      console.error("[updates]", e.message ?? e);
      await sleep(pollMs);
    }
  }
}

async function depositsLoop() {
  for (;;) {
    try {
      const all = await getAllDeposits();
      const pending = all.filter((r) => r.type === "deposit" && r.status === "pending");
      const target = chatId ?? defaultChat;
      for (const d of pending) {
        if (!state.notified.includes(d.id)) {
          if (target) await sendDeposit(target, d);
          else console.log(`[deposits] pending ${d.reference} — run /start in the bot first (no ADMIN_CHAT_ID set)`);
          state.notified.push(d.id);
        }
      }
      state.notified = state.notified.slice(-500);
      saveState();
    } catch (e) {
      if (String(e.message ?? "").includes("ENOTFOUND") || String(e.message ?? "").includes("fetch failed")) {
        console.log("[deposits] site not reachable, retrying…");
      } else {
        console.error("[deposits]", e.message ?? e);
      }
    }
    await sleep(pollMs);
  }
}

console.log(`[boot] admin bot online — polling ${appUrl}` + (chatId ? `, chat ${chatId}` : defaultChat ? `, chat ${defaultChat}` : " (set ADMIN_CHAT_ID or /start)"));
updatesLoop();
depositsLoop();
// Zema Games login bot — buttons & menus for Login, Register, Forgot password
// and a Launch button to the web app. Once a user logs in / registers here,
// their Telegram is linked to the account, so opening the web app signs them
// in automatically. Run with: npm run tg-bot
//
// Env: TELEGRAM_BOT_TOKEN (same as the site), APP_URL (site root).
import "dotenv/config";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const appUrl = (process.env.APP_URL ?? "http://localhost:3000").replace(/\/+$/, "");
const pollMs = Number(process.env.TG_BOT_POLL_MS ?? 15000);

if (!BOT_TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN is missing — set it in .env");
  process.exit(1);
}

const tgApi = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function tg(method, body = {}) {
  const r = await fetch(`${tgApi}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch((e) => {
    throw new Error(`${method}: ${e.message ?? e}`);
  });
  const d = await r.json().catch(() => ({}));
  if (!d.ok) throw new Error(`${method}: ${JSON.stringify(d.description ?? d)}`);
  return d.result;
}

function callApi(url, body) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-bot-key": BOT_TOKEN,
    },
    body: JSON.stringify(body),
  })
    .then((r) => r.json())
    .catch((e) => ({ error: String(e.message ?? e) }));
}

const MAIN_KEYBOARD = {
  resize_keyboard: true,
  keyboard: [
    [{ text: "🔑 Login" }, { text: "📝 Register" }],
    [{ text: "🚀 Open App", web_app: { url: appUrl } }],
    [{ text: "🔓 Forgot Password" }],
  ],
};

const PHONE_KEYBOARD = {
  resize_keyboard: true,
  input_field_placeholder: "e.g. 0912345678",
  keyboard: [
    [{ text: "📱 Share Phone Number", request_contact: true }],
    [{ text: "❌ Cancel" }],
  ],
};

function normPhone(raw) {
  if (!raw) return null;
  let s = String(raw).replace(/[\s\-()]/g, "").replace(/^\+/, "");
  if (s.startsWith("251")) s = s.slice(3);
  if (s.startsWith("0")) s = s.slice(1);
  return /^[79]\d{8}$/.test(s) ? `+251${s}` : null;
}

const steps = new Map(); // chatId -> { step, phone, username }

const send = (chatId, text, reply_markup) =>
  tg("sendMessage", { chat_id: chatId, text, reply_markup }).catch((e) =>
    console.error("[send]", e.message ?? e)
  );

const mainMenu = (chatId, text) => send(chatId, text, MAIN_KEYBOARD);

const reset = (chatId, text) => {
  steps.delete(chatId);
  return mainMenu(chatId, text);
};

function startFlow(chatId, step, prompt) {
  steps.set(chatId, { step });
  return send(chatId, prompt, PHONE_KEYBOARD);
}

async function handleContact(chatId, m) {
  const c = m.contact;
  const w = steps.get(chatId);
  if (!c || !c.phone_number) {
    return send(chatId, "No number received — send it as text like 0912345678.");
  }
  if (c.user_id && m.from && c.user_id !== m.from.id) {
    return send(chatId, "That phone is not yours — share your own number with 📱 Share Phone Number.");
  }
  const phone = normPhone(c.phone_number);
  if (!phone) return send(chatId, "Unrecognized phone number — please send a valid Ethiopian number (09XXXXXXXX).");

  if (!w) {
    return mainMenu(chatId, `Phone ${phone} received. Use the buttons to Login or Register.`);
  }
  if (w.step === "login_phone") {
    steps.set(chatId, { step: "login_password", phone });
    return send(chatId, "Great. Now send your account password.");
  }
  if (w.step === "reg_phone") {
    steps.set(chatId, { step: "reg_username", phone });
    return send(chatId, "Great. Now pick a username (3–20 letters, numbers or _).");
  }
  if (w.step === "forgot_phone") {
    steps.set(chatId, { step: "forgot_password", phone });
    return send(chatId, "Since you shared your phone, you can set a new password.\nSend your new password (at least 6 characters).");
  }
  return mainMenu(chatId, `Phone ${phone} received. Use the buttons to Login or Register.`);
}

async function handleText(chatId, text) {
  const w = steps.get(chatId);

  if (text === "❌ Cancel") return reset(chatId, "Cancelled. 🙂");
  if (text === "🔑 Login" || text === "/login" || text.startsWith("/start") || text === "/help") {
    if (text === "🔑 Login" || text === "/login") return startFlow(chatId, "login_phone", "Send your phone number (share it with 📱 or type 09XXXXXXXX).");
    return reset(chatId, "🏠 *Zema Games*\nYour bank for the Zema Games app.\n\nUse the buttons below to Login, Register, or recover your password.\n🚀 Open App launches the game — when your account is linked you are signed in automatically.");
  }
  if (text === "📝 Register" || text === "/register") return startFlow(chatId, "reg_phone", "Register:\nSend your phone number (share 📱 or type 09XXXXXXXX).");
  if (text === "🔓 Forgot Password" || text === "/forgot") return startFlow(chatId, "forgot_phone", "Password recovery:\n📱 Share your phone number so we can confirm it's yours.");

  if (!w) return mainMenu(chatId, "Use the buttons below. 🙂");

  const phoneLike = normPhone(text);

  if (w.step === "login_phone") {
    if (!phoneLike) return send(chatId, "That doesn't look like a phone — send 09XXXXXXXX or use 📱 Share Phone Number.");
    steps.set(chatId, { step: "login_password", phone: phoneLike });
    return send(chatId, "Now send your account password.");
  }
  if (w.step === "reg_phone") {
    if (!phoneLike) return send(chatId, "That doesn't look like a phone — send 09XXXXXXXX or use 📱 Share Phone Number.");
    steps.set(chatId, { step: "reg_username", phone: phoneLike });
    return send(chatId, "Now pick a username (3–20 letters, numbers or _).");
  }
  if (w.step === "forgot_phone") {
    if (!phoneLike) return send(chatId, "📱 Share your phone number with the button below, or type 09XXXXXXXX.");
    steps.set(chatId, { step: "forgot_password", phone: phoneLike });
    return send(chatId, "Send your new password (at least 6 characters).");
  }

  if (w.step === "login_password") {
    const r = await callApi(`${appUrl}/api/auth/telegram/claim`, {
      tgId: String(w.tgId ?? ""),
      phone: w.phone ?? "",
      password: text,
    });
    if (r.error) {
      steps.delete(chatId);
      return reset(chatId, `❌ ${r.error}\n\nTry again with 🔑 Login.`);
    }
    return reset(chatId, `✅ Welcome, ${r.username || ""}!\n\nYou are logged in — from now on opening the app signs you in automatically.`);
  }

  if (w.step === "reg_username") {
    const username = text.trim();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return send(chatId, "Username must be 3–20 characters using letters, numbers or _ only.");
    }
    w.username = username;
    w.step = "reg_password";
    return send(chatId, "Now create a password (at least 6 characters).");
  }

  if (w.step === "reg_password") {
    const r = await callApi(`${appUrl}/api/auth/telegram/register`, {
      tgId: String(w.tgId ?? ""),
      phone: w.phone ?? "",
      username: w.username ?? "",
      password: text,
      age: true,
    });
    if (r.error) {
      steps.delete(chatId);
      return reset(chatId, `❌ ${r.error}\n\nTry again with 📝 Register.`);
    }
    return reset(chatId, `🎉 Account created for ${r.username}!\n\nMake your first deposit to get a 200% welcome bonus 🎁\n\nOpen the app to start playing.`);
  }

  if (w.step === "forgot_password") {
    const r = await callApi(`${appUrl}/api/auth/telegram/reset`, {
      tgId: String(w.tgId ?? ""),
      phone: w.phone ?? "",
      password: text,
      verifiedContact: true,
    });
    if (r.error) {
      steps.delete(chatId);
      return reset(chatId, `❌ ${r.error}\n\nTry Forgot Password again.`);
    }
    return reset(chatId, `✅ Password updated, ${r.username}! You can Log in or just open the app — it signs you in automatically.`);
  }

  return mainMenu(chatId, "Use the buttons below. 🙂");
}

async function handleUpdate(u) {
  const m = u.message;
  if (!m) return;
  const chatId = String(m.chat.id);
  const w = steps.get(chatId) ?? {};
  const from = m.from;
  if (from) {
    w.tgId = String(from.id);
    w.tgName = from.username ? `@${from.username}` : from.first_name ?? "";
    steps.set(chatId, w);
  }
  if (m.contact) return handleContact(chatId, m);
  if (typeof m.text !== "string") {
    if (w.step) steps.delete(chatId);
    return send(chatId, "Send a text message or use the buttons. 🙂");
  }
  return handleText(chatId, m.text.trim());
}

async function boot() {
  try {
    const me = await tg("getMe");
    console.log(`[boot] ${me.username} online — polling ${appUrl}`);
  } catch (e) {
    console.error("[boot] token rejected:", e.message ?? e);
    process.exit(1);
  }
  await tg("setMyCommands", {
    commands: [
      { command: "start", description: "Open the menu" },
      { command: "login", description: "Login with phone + password" },
      { command: "register", description: "Create a new account" },
      { command: "forgot", description: "Recover your password" },
    ],
  }).catch(() => {});
  await tg("setChatMenuButton", { menu_button: { type: "web_app", text: "Zema Games", web_app: { url: appUrl } } }).catch(() => {});
  console.log("[boot] menu button + commands set");
}

async function loop() {
  let offset = 0;
  for (;;) {
    try {
      const updates = await tg("getUpdates", { offset, timeout: 40 });
      for (const u of updates ?? []) {
        offset = u.update_id + 1;
        await handleUpdate(u).catch((e) => console.error("[update]", e.message ?? e));
      }
    } catch (e) {
      console.error("[updates]", e.message ?? e);
      await new Promise((r) => setTimeout(r, pollMs));
    }
  }
}

await boot();
loop();
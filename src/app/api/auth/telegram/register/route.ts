import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, json } from "@/lib/auth";
import { normalizePhone } from "@/lib/telegram-auth";
import { botTgId, isBotCall, userByPhone, userByTgId } from "@/lib/tg-bot";

export const dynamic = "force-dynamic";

// POST /api/auth/telegram/register — bot "Register": create an account and
// link the Telegram user to it in one step. If this Telegram user already has
// a web "ghost" account (phone like "tg:123"), we upgrade it in place with the
// real phone + chosen username/password instead of blocking.
export async function POST(req: Request) {
  if (!isBotCall(req)) return json({ error: "Unauthorized" }, 401);
  const body = await req.json().catch(() => ({}));
  const tgId = botTgId(body);
  const phone = normalizePhone(body.phone);
  const password = String(body.password ?? "");
  const username = String(body.username ?? "").trim();
  if (!tgId || !phone) return json({ error: "Invalid request" }, 400);
  if (password.length < 6) return json({ error: "Password must be at least 6 characters" }, 400);
  if (!/^[a-zA-Z0-9_]{1,20}$/.test(username) || username.length < 3) {
    return json({ error: "Username must be 3–20 letters, numbers or _" }, 400);
  }
  if (body.age !== true) return json({ error: "You must confirm you are 21 or older" }, 400);

  if (await userByPhone(phone)) return json({ error: "An account with this phone already exists — Login" }, 409);

  const linked = await userByTgId(tgId);
  if (linked && !linked.phone.startsWith("tg:")) {
    return json({ error: "This Telegram is already linked to an account" }, 409);
  }
  if (linked) {
    // Upgrade the web ghost account with real credentials.
    await db
      .update(users)
      .set({ phone, username, passwordHash: hashPassword(password) })
      .where(eq(users.id, linked.id));
    return json({ ok: true, username, upgraded: true });
  }

  const referralCode = randomBytes(4).toString("hex").toUpperCase();
  await db
    .insert(users)
    .values({ phone, username, passwordHash: hashPassword(password), referralCode, telegramId: tgId });

  return json({ ok: true, username });
}
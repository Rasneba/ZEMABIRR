import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, json } from "@/lib/auth";
import { normalizePhone } from "@/lib/telegram-auth";
import { botTgId, isBotCall, unbindGhost, userByPhone } from "@/lib/tg-bot";

export const dynamic = "force-dynamic";

// POST /api/auth/telegram/reset — bot "Forgot password". The bot only calls
// this after proving phone ownership (shared Telegram contact) or when the
// account is already bound to this Telegram user.
export async function POST(req: Request) {
  if (!isBotCall(req)) return json({ error: "Unauthorized" }, 401);
  const body = await req.json().catch(() => ({}));
  const tgId = botTgId(body);
  const phone = normalizePhone(body.phone);
  const password = String(body.password ?? "");
  if (!tgId || !phone) return json({ error: "Invalid request" }, 400);
  if (password.length < 6) return json({ error: "Password must be at least 6 characters" }, 400);

  const row = await userByPhone(phone);
  if (!row) return json({ error: "No account with this phone yet — Register first" }, 404);
  if (row.telegramId && row.telegramId !== tgId) return json({ error: "This phone is linked to another Telegram" }, 409);
  if (!row.telegramId && body.verifiedContact !== true) {
    return json({ error: "Link your account first with Login" }, 403);
  }

  await unbindGhost(tgId, row.id);
  await db
    .update(users)
    .set({ passwordHash: hashPassword(password), telegramId: tgId })
    .where(eq(users.id, row.id));

  return json({ ok: true, username: row.username });
}
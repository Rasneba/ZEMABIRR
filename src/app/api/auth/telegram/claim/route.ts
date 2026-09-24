import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { json, verifyPassword } from "@/lib/auth";
import { normalizePhone } from "@/lib/telegram-auth";
import { botTgId, isBotCall, unbindGhost, userByPhone } from "@/lib/tg-bot";

export const dynamic = "force-dynamic";

// POST /api/auth/telegram/claim — bot "Login": verify phone + password, then
// link the Telegram account so the web app signs them in automatically.
export async function POST(req: Request) {
  if (!isBotCall(req)) return json({ error: "Unauthorized" }, 401);
  const body = await req.json().catch(() => ({}));
  const tgId = botTgId(body);
  const phone = normalizePhone(body.phone);
  const password = String(body.password ?? "");
  if (!tgId || !phone) return json({ error: "Invalid request" }, 400);
  if (password.length < 6) return json({ error: "Enter your password" }, 400);

  const row = await userByPhone(phone);
  if (!row) return json({ error: "No account with this phone yet — Register first" }, 404);
  if (!verifyPassword(password, row.passwordHash)) return json({ error: "Wrong password" }, 401);
  if (row.telegramId && row.telegramId !== tgId) return json({ error: "This phone is linked to another Telegram" }, 409);

  await unbindGhost(tgId, row.id);
  await db.update(users).set({ telegramId: tgId }).where(eq(users.id, row.id));

  return json({ ok: true, username: row.username });
}
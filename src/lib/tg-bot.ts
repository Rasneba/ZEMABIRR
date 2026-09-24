import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

// Requests from our own Telegram bot carry the site bot token as a shared
// secret so arbitrary callers cannot trigger account changes over HTTP.
export function isBotCall(req: Request): boolean {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  return Boolean(token && req.headers.get("x-bot-key") === token);
}

export function botTgId(body: Record<string, unknown>): string | null {
  const id = String(body.tgId ?? "").trim();
  return id ? id : null;
}

export async function userByPhone(phone: string) {
  const rows = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  return rows[0] ?? null;
}

export async function userByTgId(tgId: string) {
  const rows = await db.select().from(users).where(eq(users.telegramId, tgId)).limit(1);
  return rows[0] ?? null;
}

// If a "ghost" account was auto-created for this Telegram user (phone like
// "tg:12345"), clear its binding before linking the real phone user.
export async function unbindGhost(tgId: string, keepUserId: number) {
  const ghost = await userByTgId(tgId);
  if (ghost && ghost.id !== keepUserId) {
    await db.update(users).set({ telegramId: null }).where(eq(users.id, ghost.id));
  }
}
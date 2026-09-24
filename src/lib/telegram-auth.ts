import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession } from "@/lib/auth";

export type TgUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

// Telegram Mini App auth: data-check-string = all initData fields
// except `hash`, sorted by key, joined as `key=value` lines with "\n".
// secret_key = HMAC_SHA256(bot_token, "WebAppData").
function buildDataCheckString(raw: string): { data?: string; hash?: string; authDate?: number } | null {
  if (!raw) return null;
  const pairs: [string, string][] = [];
  for (const part of raw.split("&")) {
    if (!part) continue;
    const i = part.indexOf("=");
    if (i === -1) continue;
    pairs.push([part.slice(0, i), part.slice(i + 1)]);
  }
  const hash = pairs.find(([k]) => k === "hash")?.[1];
  if (!hash) return null;
  const data = pairs
    .filter(([k]) => k !== "hash")
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");
  return { data, hash, authDate: Number(pairs.find(([k]) => k === "auth_date")?.[1]) };
}

export function verifyInitData(raw: string): TgUser | null {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken || !raw) return null;
  const built = buildDataCheckString(raw);
  if (!built?.data || !built.hash) return null;

  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const computed = createHmac("sha256", secretKey).update(built.data).digest();
  const given = Buffer.from(built.hash, "hex");
  if (given.length === 0 || given.length !== computed.length || !timingSafeEqual(given, computed)) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (!built.authDate || built.authDate < now - 86400 || built.authDate > now + 60) return null;

  const userRaw = built.data
    .split("\n")
    .find((line) => line.startsWith("user="))
    ?.slice("user=".length);
  if (!userRaw) return null;
  try {
    return JSON.parse(decodeURIComponent(userRaw)) as TgUser;
  } catch {
    return null;
  }
}

// Normalize to +251XXXXXXXXX when it looks like an Ethiopian mobile number.
export function normalizePhone(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let s = raw.replace(/[\s\-()]/g, "");
  s = s.replace(/^\+/, "");
  if (s.startsWith("251")) s = s.slice(3);
  else if (s.startsWith("0")) s = s.slice(1);
  if (!/^[79]\d{8}$/.test(s)) return null;
  return `+251${s}`;
}

function makeUsername(tg: TgUser): string {
  let u =
    tg.username && /^[a-zA-Z0-9_]{3,20}$/.test(tg.username)
      ? tg.username
      : `${tg.first_name ?? ""}${tg.last_name ?? ""}`.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20);
  if (u.length < 3) u = `player${tg.id}`;
  return u.slice(0, 20);
}

// Find-or-create the account for a verified Telegram user and open a session.
export async function authTelegramUser(tg: TgUser, phone?: string | null) {
  const tgId = String(tg.id);

  let user = (await db.select().from(users).where(eq(users.telegramId, tgId)).limit(1))[0];

  if (!user && phone) {
    const existing = (await db.select().from(users).where(eq(users.phone, phone)).limit(1))[0];
    if (existing) {
      await db.update(users).set({ telegramId: tgId }).where(eq(users.id, existing.id));
      user = { ...existing, telegramId: tgId };
    }
  }

  if (!user) {
    const [created] = await db
      .insert(users)
      .values({
        phone: phone ?? `tg:${tgId}`,
        username: makeUsername(tg),
        passwordHash: randomBytes(24).toString("hex"),
        referralCode: randomBytes(4).toString("hex").toUpperCase(),
        telegramId: tgId,
      })
      .returning({ id: users.id });
    await createSession(created.id);
    return;
  }

  if (phone && user.phone.startsWith("tg:")) {
    await db.update(users).set({ phone }).where(eq(users.id, user.id));
  }
  await createSession(user.id);
}
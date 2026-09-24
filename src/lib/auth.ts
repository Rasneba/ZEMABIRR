import "server-only";
import { cookies } from "next/headers";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { eq, and, gt } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";

export const SESSION_COOKIE = "zb_session";

export function hashPassword(pw: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pw, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(pw: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(pw, salt, 64);
  const real = Buffer.from(hash, "hex");
  return real.length === test.length && timingSafeEqual(real, test);
}

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  await db.insert(sessions).values({ token, userId, expiresAt });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
    secure: false,
  });
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(sessions).where(eq(sessions.token, token));
  jar.delete(SESSION_COOKIE);
}

export type SafeUser = {
  id: number;
  phone: string;
  username: string;
  balance: number;
  bonusBalance: number;
  totalWagered: number;
  referralCode: string;
  lastSpinAt: string | null;
  firstDepositDone: boolean;
  createdAt: string;
};

export async function getCurrentUser(): Promise<SafeUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const rows = await db
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.token, token), gt(sessions.expiresAt, new Date())))
    .limit(1);
  const u = rows[0]?.user;
  if (!u) return null;
  return {
    id: u.id,
    phone: u.phone,
    username: u.username,
    balance: u.balance,
    bonusBalance: u.bonusBalance,
    totalWagered: u.totalWagered,
    referralCode: u.referralCode,
    lastSpinAt: u.lastSpinAt ? u.lastSpinAt.toISOString() : null,
    firstDepositDone: u.firstDepositDone === 1,
    createdAt: u.createdAt.toISOString(),
  };
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function unauthorized() {
  return json({ error: "Please log in to continue" }, 401);
}

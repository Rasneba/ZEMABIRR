import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, json, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const digits = String(body.phone ?? "").replace(/\s+/g, "").replace(/^\+?251/, "").replace(/^0/, "");
  const password = String(body.password ?? "");
  const phone = `+251${digits}`;
  const [u] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  if (!u || !verifyPassword(password, u.passwordHash)) return json({ error: "Invalid phone number or password" }, 401);
  await createSession(u.id);
  return json({ ok: true });
}

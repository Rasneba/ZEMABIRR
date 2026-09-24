import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, hashPassword, json } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const phoneRaw = String(body.phone ?? "").replace(/\s+/g, "");
  const password = String(body.password ?? "");
  const username = String(body.username ?? "").trim();
  const ref = String(body.ref ?? "").trim().toUpperCase();

  const digits = phoneRaw.replace(/^\+?251/, "").replace(/^0/, "");
  if (!/^[79]\d{8}$/.test(digits)) return json({ error: "Enter a valid Ethiopian phone number (e.g. 09XXXXXXXX)" }, 400);
  if (password.length < 6) return json({ error: "Password must be at least 6 characters" }, 400);
  if (username.length < 3 || username.length > 20) return json({ error: "Username must be 3–20 characters" }, 400);
  if (body.age !== true) return json({ error: "You must confirm you are 21 or older" }, 400);

  const phone = `+251${digits}`;
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.phone, phone)).limit(1);
  if (existing.length) return json({ error: "An account with this phone already exists" }, 409);

  let referredBy: number | null = null;
  if (ref) {
    const r = await db.select({ id: users.id }).from(users).where(eq(users.referralCode, ref)).limit(1);
    if (r[0]) referredBy = r[0].id;
  }

  const referralCode = randomBytes(4).toString("hex").toUpperCase();
  const [u] = await db
    .insert(users)
    .values({ phone, username, passwordHash: hashPassword(password), referralCode, referredBy })
    .returning({ id: users.id });
  await createSession(u.id);
  return json({ ok: true });
}

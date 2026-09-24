import { and, eq, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { promoCodes, promoRedemptions } from "@/db/schema";
import { getCurrentUser, json, unauthorized } from "@/lib/auth";
import { addTx, credit } from "@/lib/wallet";

const BUILTIN = [
  { code: "WELCOME50", amount: 50, maxUses: 100000 },
  { code: "ZEMA100", amount: 100, maxUses: 5000 },
  { code: "TELEGRAM25", amount: 25, maxUses: 100000 },
];

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const body = await req.json().catch(() => ({}));
  const code = String(body.code ?? "").trim().toUpperCase();
  if (!code) return json({ error: "Enter a promo code" }, 400);

  await db.insert(promoCodes).values(BUILTIN).onConflictDoNothing();

  const [promo] = await db.select().from(promoCodes).where(eq(promoCodes.code, code)).limit(1);
  if (!promo) return json({ error: "Invalid promo code" }, 404);

  const ins = await db
    .insert(promoRedemptions)
    .values({ userId: user.id, code })
    .onConflictDoNothing()
    .returning({ id: promoRedemptions.id });
  if (!ins[0]) return json({ error: "You have already used this code" }, 409);

  const upd = await db
    .update(promoCodes)
    .set({ uses: sql`${promoCodes.uses} + 1` })
    .where(and(eq(promoCodes.code, code), lt(promoCodes.uses, promo.maxUses)))
    .returning({ code: promoCodes.code });
  if (!upd[0]) return json({ error: "This promo code has expired" }, 410);

  await credit(user.id, promo.amount, true);
  await addTx(user.id, "promo", promo.amount, { note: `Promo code ${code}` });
  return json({ ok: true, amount: promo.amount });
}

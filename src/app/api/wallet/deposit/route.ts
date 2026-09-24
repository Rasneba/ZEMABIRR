import { and, eq, sql } from "drizzle-orm";
import { randomBytes } from "crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser, json, unauthorized } from "@/lib/auth";
import { addTx, credit, parseAmount } from "@/lib/wallet";
import { r2 } from "@/lib/brand";

const METHODS = ["telebirr", "cbebirr", "mpesa", "usdt"];

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const body = await req.json().catch(() => ({}));
  const amount = parseAmount(body.amount, 10, 100000);
  const method = String(body.method ?? "");
  if (!amount) return json({ error: "Deposit amount must be between Br 10 and Br 100,000" }, 400);
  if (!METHODS.includes(method)) return json({ error: "Choose a payment method" }, 400);

  const reference = `DP${randomBytes(5).toString("hex").toUpperCase()}`;
  await credit(user.id, amount);
  await addTx(user.id, "deposit", amount, { method, reference });

  let bonus = 0;
  // First-deposit 200% welcome bonus (max Br 10,000) + referral reward
  const claimed = await db
    .update(users)
    .set({ firstDepositDone: 1 })
    .where(and(eq(users.id, user.id), eq(users.firstDepositDone, 0)))
    .returning({ referredBy: users.referredBy });
  if (claimed[0]) {
    bonus = r2(Math.min(amount * 2, 10000));
    await credit(user.id, bonus, true);
    await addTx(user.id, "bonus", bonus, { note: "200% welcome bonus" });
    const refId = claimed[0].referredBy;
    if (refId) {
      const paid = await db
        .update(users)
        .set({ referralPaid: 1 })
        .where(and(eq(users.id, user.id), eq(users.referralPaid, 0)))
        .returning({ id: users.id });
      if (paid[0]) {
        await db.execute(sql`update users set balance = balance + 100 where id = ${refId}`);
        await addTx(refId, "referral", 100, { note: `Friend ${user.username} made first deposit` });
      }
    }
  }
  return json({ ok: true, reference, bonus });
}

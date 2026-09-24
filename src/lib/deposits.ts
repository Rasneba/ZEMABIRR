import "server-only";
import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { transactions, users } from "@/db/schema";
import { r2 } from "@/lib/brand";
import { addTx, credit } from "@/lib/wallet";

/**
 * Agent approval for a pending deposit. The transaction is credited (real
 * balance + first-deposit welcome bonus + referral reward) only when the
 * amount and the client's shared SMS transaction ID both match the original
 * request — mirroring the agent manually cross-checking the payment receipt.
 */
export async function approveDeposit(id: number, amount: number, txid: string) {
  const [row] = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.type, "deposit")))
    .limit(1);
  if (!row) return { error: "Deposit not found" };
  if (row.status !== "pending") return { error: `Deposit already ${row.status}` };
  if (r2(amount) !== r2(row.amount)) return { error: "Amount does not match the deposit request" };
  const expectedTxId = String(row.note ?? "").trim().toUpperCase();
  if (!expectedTxId || expectedTxId !== String(txid).trim().toUpperCase()) {
    return { error: "Transaction ID does not match the shared SMS" };
  }

  await credit(row.userId, r2(row.amount));
  await db.update(transactions).set({ status: "completed" }).where(eq(transactions.id, row.id));

  // First-deposit 200% welcome bonus (max Br 10,000) + referral reward.
  const claimed = await db
    .update(users)
    .set({ firstDepositDone: 1 })
    .where(and(eq(users.id, row.userId), eq(users.firstDepositDone, 0)))
    .returning({ referredBy: users.referredBy });
  if (claimed[0]) {
    const bonus = r2(Math.min(r2(row.amount) * 2, 10000));
    await credit(row.userId, bonus, true);
    await addTx(row.userId, "bonus", bonus, { note: "200% welcome bonus" });
    const refId = claimed[0].referredBy;
    if (refId) {
      const paid = await db
        .update(users)
        .set({ referralPaid: 1 })
        .where(and(eq(users.id, row.userId), eq(users.referralPaid, 0)))
        .returning({ id: users.id });
      if (paid[0]) {
        await db.execute(sql`update users set balance = balance + 100 where id = ${refId}`);
        await addTx(refId, "referral", 100, { note: `Friend ${row.userId} made first deposit` });
      }
    }
  }
  return { ok: true, bonus: claimed[0] ? r2(Math.min(r2(row.amount) * 2, 10000)) : 0 };
}

export async function rejectDeposit(id: number) {
  const [row] = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.type, "deposit")))
    .limit(1);
  if (!row) return { error: "Deposit not found" };
  if (row.status !== "pending") return { error: `Deposit already ${row.status}` };
  await db.update(transactions).set({ status: "rejected" }).where(eq(transactions.id, row.id));
  return { ok: true };
}
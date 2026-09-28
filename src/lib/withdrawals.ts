import "server-only";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { r2 } from "@/lib/brand";
import { addTx, credit } from "@/lib/wallet";

/**
 * Agent settlement of a processing withdrawal. The stake was already debited
 * from the real balance when the request was created, so:
 *  - "pay"    → mark completed (money sent to the player's account off-site).
 *  - "reject" → refund the amount to the real balance and mark rejected.
 */
export async function settleWithdrawal(id: number, action: "pay" | "reject") {
  const [row] = await db
    .select()
    .from(transactions)
    .where(and(eq(transactions.id, id), eq(transactions.type, "withdraw")))
    .limit(1);
  if (!row) return { error: "Withdrawal not found" };
  if (row.status !== "processing") return { error: `Withdrawal already ${row.status}` };

  if (action === "pay") {
    const upd = await db
      .update(transactions)
      .set({ status: "completed" })
      .where(and(eq(transactions.id, id), eq(transactions.status, "processing")))
      .returning({ id: transactions.id });
    if (!upd[0]) return { error: "Withdrawal was settled by another agent" };
    return { ok: true, status: "completed" };
  }

  const amount = r2(Math.abs(row.amount));
  const upd = await db
    .update(transactions)
    .set({ status: "rejected" })
    .where(and(eq(transactions.id, id), eq(transactions.status, "processing")))
    .returning({ id: transactions.id });
  if (!upd[0]) return { error: "Withdrawal was settled by another agent" };
  await credit(row.userId, amount);
  await addTx(row.userId, "refund", amount, { note: `Withdrawal ${row.reference ?? `#${row.id}`} rejected — refund` });
  return { ok: true, status: "rejected", refund: amount };
}

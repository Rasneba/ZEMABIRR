import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { transactions, users } from "@/db/schema";
import { json } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";

export const dynamic = "force-dynamic";

const TYPES = ["deposit", "withdraw", "bet", "win", "bonus", "referral", "promo", "spin", "lootbox", "adjust", "refund"];

// GET /api/admin/transactions?type=&userId=&limit=&offset= — full ledger.
export async function GET(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const p = new URL(req.url).searchParams;
  const type = p.get("type");
  const userId = Number(p.get("userId") ?? 0) || undefined;
  const limit = Math.min(100, Math.max(1, Number(p.get("limit") ?? 50) || 50));
  const offset = Math.max(0, Number(p.get("offset") ?? 0) || 0);

  const conds = [
    type && TYPES.includes(type) ? eq(transactions.type, type) : undefined,
    userId ? eq(transactions.userId, userId) : undefined,
  ].filter(Boolean);
  const where = conds.length ? and(...conds) : undefined;

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(transactions)
    .where(where);

  const rows = await db
    .select({
      id: transactions.id,
      userId: transactions.userId,
      username: users.username,
      type: transactions.type,
      amount: transactions.amount,
      status: transactions.status,
      method: transactions.method,
      reference: transactions.reference,
      note: transactions.note,
      createdAt: transactions.createdAt,
    })
    .from(transactions)
    .innerJoin(users, eq(users.id, transactions.userId))
    .where(where)
    .orderBy(desc(transactions.id))
    .limit(limit)
    .offset(offset);

  return json({ rows, total: Number(count), limit, offset, types: TYPES });
}

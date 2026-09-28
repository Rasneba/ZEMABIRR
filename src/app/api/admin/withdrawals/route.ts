import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { transactions, users } from "@/db/schema";
import { json } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";

export const dynamic = "force-dynamic";

// GET /api/admin/withdrawals?status=processing|completed|rejected|all
export async function GET(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const status = new URL(req.url).searchParams.get("status") ?? "all";
  const rows = await db
    .select({
      id: transactions.id,
      userId: transactions.userId,
      username: users.username,
      phone: users.phone,
      amount: transactions.amount,
      status: transactions.status,
      method: transactions.method,
      reference: transactions.reference,
      account: transactions.note,
      createdAt: transactions.createdAt,
    })
    .from(transactions)
    .innerJoin(users, eq(users.id, transactions.userId))
    .where(and(eq(transactions.type, "withdraw"), status === "all" ? undefined : eq(transactions.status, status)))
    .orderBy(desc(transactions.id))
    .limit(100);
  return json({ rows });
}

import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { json } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";

export const dynamic = "force-dynamic";

// GET /api/admin/users?q=&limit=&offset= — search players by id / username / phone.
export async function GET(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const params = new URL(req.url).searchParams;
  const q = params.get("q")?.trim() ?? "";
  const limit = Math.min(50, Math.max(1, Number(params.get("limit") ?? 20) || 20));
  const offset = Math.max(0, Number(params.get("offset") ?? 0) || 0);

  const where = q
    ? /^[0-9]+$/.test(q)
      ? sql`(${users.id} = ${Number(q)} or ${users.username} ilike ${`%${q}%`} or ${users.phone} ilike ${`%${q}%`})`
      : sql`(${users.username} ilike ${`%${q}%`} or ${users.phone} ilike ${`%${q}%`})`
    : sql`true`;

  const [{ count }] = (await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(where)) as unknown as { count: number }[];

  const rows = await db
    .select({
      id: users.id,
      username: users.username,
      phone: users.phone,
      balance: users.balance,
      bonusBalance: users.bonusBalance,
      totalWagered: users.totalWagered,
      banned: users.banned,
      banReason: users.banReason,
      firstDepositDone: users.firstDepositDone,
      referralCode: users.referralCode,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(where)
    .orderBy(desc(users.id))
    .limit(limit)
    .offset(offset);

  return json({ rows, total: Number(count), limit, offset });
}

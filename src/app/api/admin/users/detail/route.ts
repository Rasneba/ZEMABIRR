import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { gameRounds, transactions, users } from "@/db/schema";
import { json } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";

export const dynamic = "force-dynamic";

// GET /api/admin/users/detail?id= — full player profile for the admin panel.
export async function GET(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id) return json({ error: "User id is required" }, 400);

  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      phone: users.phone,
      telegramId: users.telegramId,
      balance: users.balance,
      bonusBalance: users.bonusBalance,
      totalWagered: users.totalWagered,
      banned: users.banned,
      banReason: users.banReason,
      firstDepositDone: users.firstDepositDone,
      referralCode: users.referralCode,
      referredBy: users.referredBy,
      referralPaid: users.referralPaid,
      lastSpinAt: users.lastSpinAt,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  if (!user) return json({ error: "User not found" }, 404);

  const [totals] = (await db.execute(sql`
    select
      (select coalesce(sum(amount), 0) from transactions where user_id = ${id} and type = 'deposit' and status = 'completed') as deposits,
      (select coalesce(sum(-amount), 0) from transactions where user_id = ${id} and type = 'withdraw' and status = 'completed') as withdrawals,
      (select count(*) from game_rounds where user_id = ${id}) as rounds,
      (select count(*) from users where referred_by = ${id}) as invited,
      (select username from users where id = ${user.referredBy ?? 0}) as referred_by_name
  `)).rows as unknown as { deposits: string; withdrawals: string; rounds: string; invited: string; referred_by_name: string | null }[];

  const txs = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, id))
    .orderBy(desc(transactions.id))
    .limit(25);

  const rounds = await db
    .select({
      id: gameRounds.id,
      game: gameRounds.game,
      bet: gameRounds.bet,
      payout: gameRounds.payout,
      multiplier: gameRounds.multiplier,
      status: gameRounds.status,
      createdAt: gameRounds.createdAt,
    })
    .from(gameRounds)
    .where(eq(gameRounds.userId, id))
    .orderBy(desc(gameRounds.id))
    .limit(25);

  return json({
    user: { ...user, referredByName: totals?.referred_by_name ?? null },
    totals: {
      deposits: Number(totals?.deposits ?? 0),
      withdrawals: Number(totals?.withdrawals ?? 0),
      rounds: Number(totals?.rounds ?? 0),
      invited: Number(totals?.invited ?? 0),
    },
    txs,
    rounds,
  });
}

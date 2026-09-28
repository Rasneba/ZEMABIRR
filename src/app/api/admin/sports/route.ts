import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { sportBets, users } from "@/db/schema";
import { json } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";

export const dynamic = "force-dynamic";

// GET /api/admin/sports?status= — sportsbook exposure & tickets.
export async function GET(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const status = new URL(req.url).searchParams.get("status") ?? "pending";

  const [summary] = (await db.execute(sql`
    select
      count(*) filter (where status = 'pending')::int as pending_count,
      coalesce(sum(stake) filter (where status = 'pending'), 0) as pending_stake,
      coalesce(sum(stake * total_odds) filter (where status = 'pending'), 0) as exposure,
      coalesce(sum(stake), 0) as staked_total,
      coalesce(sum(payout), 0) as paid_total,
      count(*)::int as tickets_total
    from sport_bets
  `)).rows as unknown as {
    pending_count: number;
    pending_stake: string;
    exposure: string;
    staked_total: string;
    paid_total: string;
    tickets_total: number;
  }[];

  const rows = await db
    .select({
      id: sportBets.id,
      userId: sportBets.userId,
      username: users.username,
      selections: sportBets.selections,
      stake: sportBets.stake,
      totalOdds: sportBets.totalOdds,
      status: sportBets.status,
      payout: sportBets.payout,
      settleAt: sportBets.settleAt,
      createdAt: sportBets.createdAt,
    })
    .from(sportBets)
    .innerJoin(users, eq(users.id, sportBets.userId))
    .where(status === "all" ? undefined : eq(sportBets.status, status))
    .orderBy(desc(sportBets.id))
    .limit(60);

  return json({
    summary: {
      pendingCount: summary?.pending_count ?? 0,
      pendingStake: Number(summary?.pending_stake ?? 0),
      exposure: Number(summary?.exposure ?? 0),
      stakedTotal: Number(summary?.staked_total ?? 0),
      paidTotal: Number(summary?.paid_total ?? 0),
      ticketsTotal: summary?.tickets_total ?? 0,
    },
    rows,
  });
}

import { sql } from "drizzle-orm";
import { db } from "@/db";
import { json } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";

export const dynamic = "force-dynamic";

// GET /api/admin/games — per-game performance (rounds, volume, GGR, RTP).
export async function GET(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const rows = (await db.execute(sql`
    select
      game,
      count(*)::int as rounds,
      coalesce(sum(bet), 0) as bet,
      coalesce(sum(payout), 0) as payout,
      count(*) filter (where status = 'won')::int as wins,
      count(*) filter (where status = 'lost')::int as losses,
      count(*) filter (where status = 'active')::int as active,
      coalesce(sum(bet) filter (where created_at >= date_trunc('day', now())), 0) as bet_today,
      coalesce(sum(payout) filter (where created_at >= date_trunc('day', now())), 0) as payout_today
    from game_rounds
    group by game
    order by bet desc
  `)).rows as unknown as {
    game: string;
    rounds: number;
    bet: string;
    payout: string;
    wins: number;
    losses: number;
    active: number;
    bet_today: string;
    payout_today: string;
  }[];
  return json({
    rows: rows.map((r) => ({
      game: r.game,
      rounds: r.rounds,
      bet: Number(r.bet),
      payout: Number(r.payout),
      wins: r.wins,
      losses: r.losses,
      active: r.active,
      betToday: Number(r.bet_today),
      payoutToday: Number(r.payout_today),
    })),
  });
}

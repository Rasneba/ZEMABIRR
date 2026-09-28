import { sql } from "drizzle-orm";
import { db } from "@/db";
import { json } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";

export const dynamic = "force-dynamic";

type NumRow = Record<string, string | number | null>;

const num = (v: string | number | null | undefined) => Math.round(Number(v ?? 0) * 100) / 100;

// GET /api/admin/stats — dashboard KPIs + 14-day trends.
export async function GET(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);

  const [totals] = (
    await db.execute(sql`
      select
        (select count(*) from users) as users,
        (select count(*) from users where created_at >= date_trunc('day', now())) as users_today,
        (select count(*) from users where banned = 1) as users_banned,
        (select coalesce(sum(amount), 0) from transactions where type = 'deposit' and status = 'completed') as deposits_total,
        (select coalesce(sum(amount), 0) from transactions where type = 'deposit' and status = 'completed' and created_at >= date_trunc('day', now())) as deposits_today,
        (select count(*) from transactions where type = 'deposit' and status = 'pending') as deposits_pending_count,
        (select coalesce(sum(amount), 0) from transactions where type = 'deposit' and status = 'pending') as deposits_pending_sum,
        (select coalesce(sum(-amount), 0) from transactions where type = 'withdraw' and status = 'completed') as withdrawals_paid,
        (select count(*) from transactions where type = 'withdraw' and status = 'processing') as withdrawals_pending_count,
        (select coalesce(sum(-amount), 0) from transactions where type = 'withdraw' and status = 'processing') as withdrawals_pending_sum,
        (select coalesce(sum(amount), 0) from transactions where type in ('bonus', 'promo', 'spin', 'referral')) as bonus_given,
        (select coalesce(sum(bet), 0) from game_rounds) as game_bet_total,
        (select coalesce(sum(payout), 0) from game_rounds) as game_payout_total,
        (select count(*) from game_rounds) as rounds_total,
        (select count(*) from game_rounds where status = 'active') as rounds_active,
        (select count(*) from game_rounds where created_at >= date_trunc('day', now())) as rounds_today,
        (select coalesce(sum(bet), 0) from game_rounds where created_at >= date_trunc('day', now())) as game_bet_today,
        (select coalesce(sum(payout), 0) from game_rounds where created_at >= date_trunc('day', now())) as game_payout_today,
        (select coalesce(sum(stake), 0) from sport_bets) as sports_stake_total,
        (select coalesce(sum(payout), 0) from sport_bets) as sports_payout_total,
        (select count(*) from sport_bets where status = 'pending') as sports_pending_count,
        (select coalesce(sum(stake * total_odds), 0) from sport_bets where status = 'pending') as sports_exposure
    `)
  ).rows as unknown as NumRow[];

  const t = totals ?? {};
  const wageredTotal = num(t.game_bet_total) + num(t.sports_stake_total);
  const paidTotal = num(t.game_payout_total) + num(t.sports_payout_total);
  const wageredToday = num(t.game_bet_today);
  const paidToday = num(t.game_payout_today);

  const days: { date: string; signups: number; deposits: number; withdrawals: number; wagered: number; payout: number; ggr: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCDate(d.getUTCDate() - i);
    days.push({ date: d.toISOString().slice(0, 10), signups: 0, deposits: 0, withdrawals: 0, wagered: 0, payout: 0, ggr: 0 });
  }
  const byDay = new Map(days.map((d) => [d.date, d]));

  const signups = (await db.execute(sql`
    select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day, count(*) as c
    from users where created_at >= now() - interval '13 days' group by 1
  `)).rows as unknown as { day: string; c: string }[];
  for (const r of signups) byDay.get(r.day)!.signups = Number(r.c);

  const money = (await db.execute(sql`
    select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day,
      coalesce(sum(amount) filter (where type = 'deposit' and status = 'completed'), 0) as deposits,
      coalesce(sum(-amount) filter (where type = 'withdraw' and status = 'completed'), 0) as withdrawals
    from transactions
    where type in ('deposit', 'withdraw') and created_at >= now() - interval '13 days'
    group by 1
  `)).rows as unknown as { day: string; deposits: string; withdrawals: string }[];
  for (const r of money) {
    const d = byDay.get(r.day);
    if (!d) continue;
    d.deposits = num(r.deposits);
    d.withdrawals = num(r.withdrawals);
  }

  const rounds = (await db.execute(sql`
    select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day,
      coalesce(sum(bet), 0) as bet, coalesce(sum(payout), 0) as payout
    from game_rounds where created_at >= now() - interval '13 days' group by 1
  `)).rows as unknown as { day: string; bet: string; payout: string }[];
  for (const r of rounds) {
    const d = byDay.get(r.day);
    if (!d) continue;
    d.wagered += num(r.bet);
    d.payout += num(r.payout);
  }

  const sports = (await db.execute(sql`
    select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day,
      coalesce(sum(stake), 0) as stake, coalesce(sum(payout), 0) as payout
    from sport_bets where created_at >= now() - interval '13 days' group by 1
  `)).rows as unknown as { day: string; stake: string; payout: string }[];
  for (const r of sports) {
    const d = byDay.get(r.day);
    if (!d) continue;
    d.wagered += num(r.stake);
    d.payout += num(r.payout);
  }
  for (const d of days) {
    d.wagered = num(d.wagered);
    d.payout = num(d.payout);
    d.ggr = num(d.wagered - d.payout);
  }

  return json({
    totals: {
      users: Number(t.users ?? 0),
      usersToday: Number(t.users_today ?? 0),
      usersBanned: Number(t.users_banned ?? 0),
      depositsTotal: num(t.deposits_total),
      depositsToday: num(t.deposits_today),
      depositsPendingCount: Number(t.deposits_pending_count ?? 0),
      depositsPendingSum: num(t.deposits_pending_sum),
      withdrawalsPaid: num(t.withdrawals_paid),
      withdrawalsPendingCount: Number(t.withdrawals_pending_count ?? 0),
      withdrawalsPendingSum: num(t.withdrawals_pending_sum),
      bonusGiven: num(t.bonus_given),
      wageredTotal: num(wageredTotal),
      paidTotal: num(paidTotal),
      ggrTotal: num(wageredTotal - paidTotal),
      wageredToday: num(wageredToday),
      paidToday: num(paidToday),
      ggrToday: num(wageredToday - paidToday),
      roundsTotal: Number(t.rounds_total ?? 0),
      roundsActive: Number(t.rounds_active ?? 0),
      roundsToday: Number(t.rounds_today ?? 0),
      sportsPendingCount: Number(t.sports_pending_count ?? 0),
      sportsExposure: num(t.sports_exposure),
    },
    days,
  });
}

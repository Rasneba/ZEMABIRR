import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { gameRounds } from "@/db/schema";
import { getCurrentUser, json, unauthorized } from "@/lib/auth";
import { debitStake, parseAmount } from "@/lib/wallet";
import {
  KL,
  kenoPhase,
  kenoRoundIdAt,
  kenoRoundTimes,
  type KenoHistoryRow,
  type KenoResultRow,
  type KenoState,
  type KenoStats,
} from "@/lib/keno";
import {
  KENO_SLUG,
  kenoDraw,
  kenoFeed,
  kenoFrequency,
  kenoHash,
  kenoHotCold,
  kenoSeed,
  kenoSettleUser,
} from "@/lib/keno-server";

export const dynamic = "force-dynamic";

/** Id of the most recent round whose draw has fully finished. */
function lastFinished(now: number) {
  const id = kenoRoundIdAt(now);
  return kenoRoundTimes(id).drawEnd <= now ? id : id - 1;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const view = url.searchParams.get("view") ?? "state";
  const user = await getCurrentUser();
  if (user) await kenoSettleUser(user.id);
  const now = Date.now();

  if (view === "results") {
    const last = lastFinished(now);
    const rows: KenoResultRow[] = Array.from({ length: 30 }, (_, i) => {
      const id = last - i;
      return { id, time: kenoRoundTimes(id).drawEnd, drawn: kenoDraw(id), seed: kenoSeed(id), hash: kenoHash(id) };
    });
    return json({ rows });
  }

  if (view === "stats") {
    const rounds = 100;
    const counts = kenoFrequency(lastFinished(now), rounds);
    const stats: KenoStats = { rounds, counts };
    return json(stats);
  }

  if (view === "history") {
    if (!user) return unauthorized();
    const rows = await db
      .select()
      .from(gameRounds)
      .where(
        and(
          eq(gameRounds.userId, user.id),
          eq(gameRounds.game, KENO_SLUG),
          sql`(${gameRounds.state}->>'mode') = 'live'`
        )
      )
      .orderBy(desc(gameRounds.id))
      .limit(50);
    const out: KenoHistoryRow[] = rows.map((r) => {
      const st = r.state as { round: number; picks: number[]; drawn?: number[]; hits?: number };
      return {
        id: r.id,
        round: st.round,
        picks: st.picks,
        bet: r.bet,
        status: r.status,
        payout: r.payout,
        multiplier: r.multiplier,
        hits: st.hits ?? null,
        drawn: st.drawn ?? null,
        createdAt: r.createdAt.toISOString(),
      };
    });
    return json({ rows: out });
  }

  // default: live state
  const id = kenoRoundIdAt(now);
  const times = kenoRoundTimes(id);
  const phase = kenoPhase(id, now);
  const feed = await kenoFeed(id, now, user?.id ?? null);
  const { hot, cold } = kenoHotCold(lastFinished(now));
  const state: KenoState = {
    now,
    round: {
      ...times,
      hash: kenoHash(id),
      // Betting closes once the draw starts, so the full draw can be sent and
      // animated client-side without leaking anything bettable.
      drawn: phase === "betting" ? [] : kenoDraw(id),
      seed: phase === "result" ? kenoSeed(id) : null,
    },
    feed: { total: feed.total, tickets: feed.tickets },
    my: feed.my,
    hot,
    cold,
  };
  return json(state);
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const body = await req.json().catch(() => ({}));

  const raw: unknown[] = Array.isArray(body.picks) ? body.picks : [];
  const picks = [...new Set(raw.map(Number))];
  if (picks.length < 1 || picks.length > KL.maxPicks || picks.some((n) => !Number.isInteger(n) || n < 1 || n > KL.numbers))
    return json({ error: `Choose 1 to ${KL.maxPicks} numbers from 1 to ${KL.numbers}` }, 400);
  const bet = parseAmount(body.bet, KL.minBet, KL.maxBet);
  if (!bet) return json({ error: `Bet must be between ${KL.minBet} and ${KL.maxBet.toLocaleString()} ${KL.currency}` }, 400);

  const now = Date.now();
  const id = kenoRoundIdAt(now);
  if (now > kenoRoundTimes(id).betEnd - 500) return json({ error: "Betting is closed for this round" }, 409);

  const [{ c }] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(gameRounds)
    .where(
      and(
        eq(gameRounds.userId, user.id),
        eq(gameRounds.game, KENO_SLUG),
        sql`(${gameRounds.state}->>'mode') = 'live'`,
        sql`(${gameRounds.state}->>'round')::int = ${id}`
      )
    );
  if (c >= KL.maxTicketsPerRound) return json({ error: `Maximum ${KL.maxTicketsPerRound} tickets per round` }, 400);

  const d = await debitStake(user.id, bet);
  if (!d.ok) return json({ error: "Insufficient balance. Please deposit." }, 400);
  const [row] = await db.insert(gameRounds).values({ userId: user.id, game: KENO_SLUG, bet, state: { mode: "live", round: id, picks } }).returning();
  return json({ ticket: { id: String(row.id), round: id, picks, bet }, balance: d.balance, bonusBalance: d.bonusBalance });
}
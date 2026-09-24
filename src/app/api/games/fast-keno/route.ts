import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { gameRounds } from "@/db/schema";
import { getCurrentUser, json, unauthorized } from "@/lib/auth";
import { debitStake, parseAmount } from "@/lib/wallet";
import { FK, fkPhase, fkRoundIdAt, fkRoundTimes, type FkHistoryRow, type FkResultRow, type FkState, type FkStats } from "@/lib/fastkeno";
import { FK_SLUG, fkDraw, fkFeed, fkFrequency, fkHash, fkHotCold, fkSeed, fkSettleUser } from "@/lib/fastkeno-server";

export const dynamic = "force-dynamic";

/** Id of the most recent round whose draw has fully finished. */
function lastFinished(now: number) {
  const id = fkRoundIdAt(now);
  return fkRoundTimes(id).drawEnd <= now ? id : id - 1;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const view = url.searchParams.get("view") ?? "state";
  const user = await getCurrentUser();
  if (user) await fkSettleUser(user.id);
  const now = Date.now();

  if (view === "results") {
    const last = lastFinished(now);
    const rows: FkResultRow[] = Array.from({ length: 30 }, (_, i) => {
      const id = last - i;
      return { id, time: fkRoundTimes(id).drawEnd, drawn: fkDraw(id), seed: fkSeed(id), hash: fkHash(id) };
    });
    return json({ rows });
  }

  if (view === "stats") {
    const rounds = 100;
    const counts = fkFrequency(lastFinished(now), rounds);
    let odd = 0, low = 0;
    for (let n = 1; n <= FK.numbers; n++) {
      if (n % 2) odd += counts[n];
      if (n <= 40) low += counts[n];
    }
    const total = rounds * FK.draw;
    const stats: FkStats = { rounds, counts, odd, even: total - odd, low, high: total - low };
    return json(stats);
  }

  if (view === "history") {
    if (!user) return unauthorized();
    const rows = await db
      .select()
      .from(gameRounds)
      .where(and(eq(gameRounds.userId, user.id), eq(gameRounds.game, FK_SLUG)))
      .orderBy(desc(gameRounds.id))
      .limit(50);
    const out: FkHistoryRow[] = rows.map((r) => {
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
  const id = fkRoundIdAt(now);
  const times = fkRoundTimes(id);
  const phase = fkPhase(id, now);
  const feed = await fkFeed(id, now, user?.id ?? null);
  const { hot, cold } = fkHotCold(lastFinished(now));
  const state: FkState = {
    now,
    round: {
      ...times,
      hash: fkHash(id),
      // Betting is closed once the draw starts, so the full draw can be sent
      // and animated client-side without leaking anything bettable.
      drawn: phase === "betting" ? [] : fkDraw(id),
      seed: phase === "result" ? fkSeed(id) : null,
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
  if (picks.length < 1 || picks.length > FK.maxPicks || picks.some((n) => !Number.isInteger(n) || n < 1 || n > FK.numbers))
    return json({ error: `Choose 1 to ${FK.maxPicks} numbers from 1 to ${FK.numbers}` }, 400);
  const bet = parseAmount(body.bet, FK.minBet, FK.maxBet);
  if (!bet) return json({ error: `Bet must be between ${FK.minBet} and ${FK.maxBet.toLocaleString()} ${FK.currency}` }, 400);

  const now = Date.now();
  const id = fkRoundIdAt(now);
  if (body.round != null && Number(body.round) !== id) return json({ error: "This round is closed. Bet on the next round." }, 409);
  if (now > fkRoundTimes(id).betEnd - 500) return json({ error: "Betting is closed for this round" }, 409);

  const [{ c }] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(gameRounds)
    .where(and(eq(gameRounds.userId, user.id), eq(gameRounds.game, FK_SLUG), sql`(${gameRounds.state}->>'round')::int = ${id}`));
  if (c >= FK.maxTicketsPerRound) return json({ error: `Maximum ${FK.maxTicketsPerRound} tickets per round` }, 400);

  const d = await debitStake(user.id, bet);
  if (!d.ok) return json({ error: "Insufficient balance. Please deposit." }, 400);
  const [row] = await db.insert(gameRounds).values({ userId: user.id, game: FK_SLUG, bet, state: { round: id, picks } }).returning();
  return json({ ticket: { id: String(row.id), round: id, picks, bet }, balance: d.balance, bonusBalance: d.bonusBalance });
}

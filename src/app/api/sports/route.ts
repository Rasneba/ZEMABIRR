import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { sportBets, type Selection } from "@/db/schema";
import { getCurrentUser, json, unauthorized } from "@/lib/auth";
import { getFixtures, MATCH_DURATION, matchResult } from "@/lib/sports";
import { settleDueBets } from "@/lib/sports-settle";
import { debitStake, parseAmount } from "@/lib/wallet";
import { r2 } from "@/lib/brand";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  await settleDueBets(user.id);
  const rows = await db.select().from(sportBets).where(eq(sportBets.userId, user.id)).orderBy(desc(sportBets.id)).limit(30);
  const withScores = rows.map((b) => ({
    ...b,
    selections: b.selections.map((s) => ({ ...s, score: b.status !== "pending" ? matchResult(s.matchId).score : null })),
  }));
  return json({ rows: withScores });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const body = await req.json().catch(() => ({}));
  const stake = parseAmount(body.stake, 5, 20000);
  if (!stake) return json({ error: "Stake must be between Br 5 and Br 20,000" }, 400);
  const picks = Array.isArray(body.selections) ? (body.selections as { matchId: string; pick: string }[]) : [];
  if (picks.length < 1 || picks.length > 15) return json({ error: "Add 1 to 15 selections" }, 400);

  const fixtures = getFixtures();
  const now = Date.now();
  const seen = new Set<string>();
  const sels: Selection[] = [];
  for (const p of picks) {
    const m = fixtures.find((f) => f.id === p.matchId);
    if (!m) return json({ error: "Match not available" }, 400);
    if (new Date(m.kickoff).getTime() <= now) return json({ error: `${m.home} vs ${m.away} has already started` }, 400);
    if (seen.has(m.id)) return json({ error: "Only one selection per match" }, 400);
    seen.add(m.id);
    if (!["1", "X", "2", "O", "U"].includes(p.pick)) return json({ error: "Invalid pick" }, 400);
    const market = p.pick === "O" || p.pick === "U" ? "OU" : "1X2";
    sels.push({
      matchId: m.id,
      label: `${m.home} vs ${m.away}`,
      market,
      pick: p.pick,
      odds: m.odds[p.pick as keyof typeof m.odds],
      kickoff: m.kickoff,
    });
  }
  const totalOdds = r2(sels.reduce((a, s) => a * s.odds, 1));
  const settleAt = new Date(Math.max(...sels.map((s) => new Date(s.kickoff).getTime())) + MATCH_DURATION);
  const d = await debitStake(user.id, stake);
  if (!d.ok) return json({ error: "Insufficient balance. Please deposit." }, 400);
  const [bet] = await db.insert(sportBets).values({ userId: user.id, selections: sels, stake, totalOdds, settleAt }).returning();
  return json({ ok: true, bet, balance: d.balance, bonusBalance: d.bonusBalance });
}

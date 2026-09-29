import "server-only";
import { and, eq, lte } from "drizzle-orm";
import { db } from "@/db";
import { sportBets, type Selection } from "@/db/schema";
import { selectionWins } from "@/lib/sports";
import { credit } from "@/lib/wallet";
import { r2 } from "@/lib/brand";

/**
 * Settle pending sport bets whose last match has finished
 * (settleAt <= now). When `userId` is given only that player's tickets are
 * settled; otherwise every due ticket is settled (admin sweep). Returns the
 * number of tickets settled.
 */
export async function settleDueBets(userId?: number) {
  const conds = [eq(sportBets.status, "pending"), lte(sportBets.settleAt, new Date())];
  if (userId) conds.push(eq(sportBets.userId, userId));
  const due = await db.select().from(sportBets).where(and(...conds));
  let settled = 0;
  for (const b of due) {
    const sels = b.selections.map((s) => ({
      ...s,
      result: selectionWins(s.market, s.pick, s.matchId) ? "won" : "lost",
    })) as Selection[];
    if (sels.length === 0) continue;
    const won = sels.every((s) => s.result === "won");
    const payout = won ? r2(b.stake * b.totalOdds) : 0;
    const upd = await db
      .update(sportBets)
      .set({ status: won ? "won" : "lost", payout, selections: sels })
      .where(and(eq(sportBets.id, b.id), eq(sportBets.status, "pending")))
      .returning({ id: sportBets.id });
    if (upd[0]) {
      settled += 1;
      if (payout > 0) await credit(b.userId, payout);
    }
  }
  return settled;
}

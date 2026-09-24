import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { gameRounds } from "@/db/schema";
import { credit, debitStake, parseAmount } from "./wallet";
import { r2 } from "./brand";

export async function startRound(userId: number, game: string, betRaw: unknown, state: Record<string, unknown>) {
  const bet = parseAmount(betRaw, 1, 10000);
  if (!bet) return { error: "Bet must be between Br 1 and Br 10,000" } as const;
  const d = await debitStake(userId, bet);
  if (!d.ok) return { error: "Insufficient balance. Please deposit." } as const;
  const [round] = await db.insert(gameRounds).values({ userId, game, bet, state }).returning();
  return { round, balance: d.balance, bonusBalance: d.bonusBalance } as const;
}

export async function getActiveRound(userId: number, game: string, id?: number) {
  const conds = [eq(gameRounds.userId, userId), eq(gameRounds.game, game), eq(gameRounds.status, "active")];
  if (id) conds.push(eq(gameRounds.id, id));
  const [round] = await db.select().from(gameRounds).where(and(...conds)).orderBy(desc(gameRounds.id)).limit(1);
  return round ?? null;
}

/** Atomically settle an active round. Returns null if it was already settled. */
export async function settleRound(
  roundId: number,
  userId: number,
  status: "won" | "lost",
  multiplier: number,
  bet: number,
  state?: Record<string, unknown>
) {
  const payout = status === "won" ? r2(bet * multiplier) : 0;
  const upd = await db
    .update(gameRounds)
    .set({ status, payout, multiplier, ...(state ? { state } : {}) })
    .where(and(eq(gameRounds.id, roundId), eq(gameRounds.status, "active")))
    .returning({ id: gameRounds.id });
  if (!upd[0]) return null;
  if (payout > 0) {
    const bal = await credit(userId, payout);
    return { payout, ...bal };
  }
  return { payout };
}

export async function updateState(roundId: number, state: Record<string, unknown>) {
  await db.update(gameRounds).set({ state }).where(eq(gameRounds.id, roundId));
}

/** Record a round that resolves instantly. */
export async function instantRound(
  userId: number,
  game: string,
  bet: number,
  multiplier: number,
  state: Record<string, unknown>
) {
  const payout = r2(bet * multiplier);
  await db.insert(gameRounds).values({
    userId,
    game,
    bet,
    payout,
    multiplier,
    status: payout > 0 ? "won" : "lost",
    state,
  });
  if (payout > 0) return { payout, ...(await credit(userId, payout)) };
  return { payout };
}

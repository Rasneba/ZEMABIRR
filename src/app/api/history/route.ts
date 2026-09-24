import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { gameRounds, transactions } from "@/db/schema";
import { getCurrentUser, json, unauthorized } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind") ?? "tx";
  const game = url.searchParams.get("game");
  if (kind === "games") {
    const rows = await db
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
      .where(game ? and(eq(gameRounds.userId, user.id), eq(gameRounds.game, game)) : eq(gameRounds.userId, user.id))
      .orderBy(desc(gameRounds.id))
      .limit(30);
    return json({ rows });
  }
  const rows = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, user.id))
    .orderBy(desc(transactions.id))
    .limit(50);
  return json({ rows });
}

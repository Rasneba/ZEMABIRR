import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { gameRounds, users } from "@/db/schema";
import { json } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";

export const dynamic = "force-dynamic";

// GET /api/admin/rounds?game=&status=&userId=&limit= — round audit log.
export async function GET(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const p = new URL(req.url).searchParams;
  const game = p.get("game");
  const status = p.get("status");
  const userId = Number(p.get("userId") ?? 0) || undefined;
  const limit = Math.min(200, Math.max(1, Number(p.get("limit") ?? 50) || 50));

  const conds = [
    game ? eq(gameRounds.game, game) : undefined,
    status ? eq(gameRounds.status, status) : undefined,
    userId ? eq(gameRounds.userId, userId) : undefined,
  ].filter(Boolean);

  const rows = await db
    .select({
      id: gameRounds.id,
      userId: gameRounds.userId,
      username: users.username,
      game: gameRounds.game,
      bet: gameRounds.bet,
      payout: gameRounds.payout,
      multiplier: gameRounds.multiplier,
      status: gameRounds.status,
      createdAt: gameRounds.createdAt,
    })
    .from(gameRounds)
    .innerJoin(users, eq(users.id, gameRounds.userId))
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(gameRounds.id))
    .limit(limit);
  return json({ rows });
}

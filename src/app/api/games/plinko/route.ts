import { randomInt } from "crypto";
import { getCurrentUser, json, unauthorized } from "@/lib/auth";
import { PLINKO_ROWS, PLINKO_TABLE, getGame } from "@/lib/games";
import { parseAmount } from "@/lib/wallet";
import { instantRound } from "@/lib/rounds";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const body = await req.json().catch(() => ({}));
  if (getGame(String(body.game ?? ""))?.engine !== "plinko") return json({ error: "Unknown game" }, 400);

  const bet = parseAmount(body.bet, 1, 10000);
  if (!bet) return json({ error: "Bet must be between Br 1 and Br 10,000" }, 400);

  const rows = PLINKO_ROWS;
  let bin = 0;
  for (let i = 0; i < rows; i++) bin += randomInt(0, 2);
  const multiplier = PLINKO_TABLE[bin] ?? 1;
  const win = multiplier > 1;
  const s = await instantRound(user.id, String(body.game), bet, win ? multiplier : 0, { rows, bin });
  return json({ rows, bin, multiplier, payout: s.payout });
}
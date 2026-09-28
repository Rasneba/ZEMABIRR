import { randomInt } from "crypto";
import { getCurrentUser, json, unauthorized } from "@/lib/auth";
import { DICE_MAX, DICE_MIN, diceMultiplier, getGame } from "@/lib/games";
import { parseAmount } from "@/lib/wallet";
import { instantRound } from "@/lib/rounds";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const body = await req.json().catch(() => ({}));
  if (getGame(String(body.game ?? ""))?.engine !== "dice") return json({ error: "Unknown game" }, 400);

  const mode = body.mode === "under" ? "under" : "over";
  const target = Number(body.target);
  if (!Number.isInteger(target) || target < DICE_MIN || target > DICE_MAX)
    return json({ error: `Target must be between ${DICE_MIN} and ${DICE_MAX}` }, 400);
  const bet = parseAmount(body.bet, 1, 10000);
  if (!bet) return json({ error: "Bet must be between Br 1 and Br 10,000" }, 400);

  const roll = randomInt(1, 101); // 1..100
  const win = mode === "under" ? roll < target : roll > target;
  const mult = win ? diceMultiplier(mode, target) : 0;
  const s = await instantRound(user.id, String(body.game), bet, mult, { mode, target, roll });
  return json({ roll, mode, target, win, multiplier: mult, payout: s.payout });
}
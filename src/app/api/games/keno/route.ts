import { randomInt } from "crypto";
import { getCurrentUser, json, unauthorized } from "@/lib/auth";
import { getGame } from "@/lib/games";
import {
  KENO_DRAW,
  KENO_MAX_BET,
  KENO_MAX_PICKS,
  KENO_MIN_BET,
  KENO_NUMBERS,
  kenoMultiplier,
} from "@/lib/keno";
import { debitStake, parseAmount } from "@/lib/wallet";
import { instantRound } from "@/lib/rounds";
import { r2 } from "@/lib/brand";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const body = await req.json().catch(() => ({}));
  const game = getGame(String(body.game ?? ""));
  if (!game || game.engine !== "keno") return json({ error: "Unknown game" }, 400);

  const raw = (Array.isArray(body.numbers) ? body.numbers : []) as unknown[];
  const picks = [...new Set(raw.map((x) => Number(x)).filter((n) => Number.isInteger(n) && n >= 1 && n <= KENO_NUMBERS))];
  if (picks.length < 1 || picks.length > KENO_MAX_PICKS) {
    return json({ error: `Choose 1 to ${KENO_MAX_PICKS} numbers from 1 to ${KENO_NUMBERS}` }, 400);
  }

  const bet = parseAmount(body.bet, KENO_MIN_BET, KENO_MAX_BET);
  if (!bet) return json({ error: `Bet must be between 1 and ${KENO_MAX_BET.toLocaleString()} Br` }, 400);

  const d = await debitStake(user.id, bet);
  if (!d.ok) return json({ error: "Insufficient balance. Please deposit." }, 400);

  const drawn = new Set<number>();
  while (drawn.size < KENO_DRAW) drawn.add(randomInt(1, KENO_NUMBERS + 1));
  const drawnArr = [...drawn];
  const hits = picks.filter((p) => drawn.has(p)).length;
  const mult = kenoMultiplier(picks.length, hits);
  const s = await instantRound(user.id, game.slug, bet, mult, { numbers: picks, drawn: drawnArr, hits });
  return json({ drawn: drawnArr, hits, multiplier: r2(mult), payout: s.payout });
}
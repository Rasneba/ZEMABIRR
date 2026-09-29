import { randomInt } from "crypto";
import { getCurrentUser, json, unauthorized } from "@/lib/auth";
import {
  getGame,
  ROULETTE_KEYS,
  roulettePayout,
  rouletteWins,
} from "@/lib/games";
import { debitStake, parseAmount } from "@/lib/wallet";
import { instantRound } from "@/lib/rounds";
import { r2 } from "@/lib/brand";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const body = await req.json().catch(() => ({}));
  const game = getGame(String(body.game ?? ""));
  if (!game) return json({ error: "Unknown game" }, 400);

  if (game.engine === "roulette") {
    const bets: Record<string, number> = {};
    let total = 0;
    for (const [k, v] of Object.entries((body.bets ?? {}) as Record<string, unknown>)) {
      if (!ROULETTE_KEYS.includes(k)) continue;
      const a = parseAmount(v, 1, 10000);
      if (!a) continue;
      bets[k] = a;
      total += a;
    }
    total = r2(total);
    if (total <= 0) return json({ error: "Place at least one chip" }, 400);
    if (total > 20000) return json({ error: "Maximum total bet is Br 20,000" }, 400);
    const d = await debitStake(user.id, total);
    if (!d.ok) return json({ error: "Insufficient balance. Please deposit." }, 400);
    const n = randomInt(0, 13);
    let win = 0;
    for (const [k, a] of Object.entries(bets)) if (rouletteWins(k, n)) win += a * roulettePayout(k);
    const mult = win / total;
    const s = await instantRound(user.id, game.slug, total, mult, { bets, result: n });
    return json({ result: n, payout: s.payout, multiplier: r2(mult) });
  }

  return json({ error: "Unsupported game" }, 400);
}

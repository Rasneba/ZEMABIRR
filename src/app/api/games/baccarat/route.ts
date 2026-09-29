import { getCurrentUser, json, unauthorized } from "@/lib/auth";
import { getGame } from "@/lib/games";
import { BAC_PAYOUTS, BAC_TIE } from "@/lib/games";
import { playBaccarat, type BacWinner } from "@/lib/baccarat";
import { debitStake, parseAmount } from "@/lib/wallet";
import { instantRound } from "@/lib/rounds";
import { r2 } from "@/lib/brand";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const body = await req.json().catch(() => ({}));
  const game = getGame(String(body.game ?? ""));
  if (!game || game.engine !== "baccarat") return json({ error: "Unknown game" }, 400);

  const bets: Record<string, number> = {};
  let total = 0;
  for (const key of ["player", "banker", "tie"]) {
    const a = parseAmount((body.bets ?? {})[key], 1, 10000);
    if (!a) continue;
    bets[key] = a;
    total += a;
  }
  total = r2(total);
  if (total <= 0) return json({ error: "Place a bet on Player, Banker or Tie" }, 400);
  if (total > 20000) return json({ error: "Maximum total bet is Br 20,000" }, 400);

  const d = await debitStake(user.id, total);
  if (!d.ok) return json({ error: "Insufficient balance. Please deposit." }, 400);

  const r = playBaccarat();
  let win = 0;
  if (r.winner === BAC_TIE) win += bets.tie * BAC_PAYOUTS.tie;
  else win += (bets[r.winner] ?? 0) * BAC_PAYOUTS[r.winner];
  const mult = win / total;
  const s = await instantRound(user.id, game.slug, total, mult, {
    bets,
    player: r.player,
    banker: r.banker,
    winner: r.winner,
  });

  return json({
    player: r.player,
    banker: r.banker,
    playerTotal: r.playerTotal,
    bankerTotal: r.bankerTotal,
    winner: r.winner as BacWinner,
    multiplier: r2(mult),
    payout: s.payout,
  });
}
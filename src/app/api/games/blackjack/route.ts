import { randomInt } from "crypto";
import { getCurrentUser, json, unauthorized } from "@/lib/auth";
import { getGame, BJ_RANKS, BJ_SUITS, scoreHand } from "@/lib/games";
import { getActiveRound, settleRound, startRound, updateState } from "@/lib/rounds";
import { r2 } from "@/lib/brand";

export const dynamic = "force-dynamic";

type BJState = { deck: string[]; player: string[]; dealer: string[] };

function buildDeck(): string[] {
  const deck: string[] = [];
  for (const s of BJ_SUITS) for (const r of BJ_RANKS) deck.push(r + s);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
function draw(deck: string[]) {
  const i = randomInt(0, deck.length);
  return deck.splice(i, 1)[0];
}
const scoreBJ = scoreHand;

async function settleBJ(round: { id: number; userId: number; bet: number }, st: BJState, status: "won" | "lost", multiplier: number) {
  return settleRound(round.id, round.userId, status, multiplier, round.bet, { ...st, done: true });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const body = await req.json().catch(() => ({}));
  const game = String(body.game ?? "blackjack");
  if (getGame(game)?.engine !== "blackjack") return json({ error: "Unknown game" }, 400);

  if (body.action === "start") {
    const existing = await getActiveRound(user.id, game);
    if (existing) {
      const st = existing.state as BJState;
      if (st?.player?.length) await settleBJ(existing, st, "lost", existing.multiplier);
    }
    const deck = buildDeck();
    const player = [draw(deck), draw(deck)];
    const dealer = [draw(deck), draw(deck)];
    const st: BJState = { deck, player, dealer };
    const ps = scoreBJ(player);
    const ds = scoreBJ(dealer);

    const res = await startRound(user.id, game, body.bet, st as unknown as Record<string, unknown>);
    if ("error" in res) return json({ error: res.error }, 400);
    const round = res.round;

    // natural blackjack resolves instantly
    if (ps === 21 || ds === 21) {
      if (ps === 21 && ds === 21) {
        await settleBJ(round, st, "won", 1); // push → stake returned
        return json({ roundId: round.id, player, dealer, playerSum: ps, dealerSum: ds, status: "push", done: true, payout: round.bet });
      }
      if (ps === 21) {
        const s = await settleBJ(round, st, "won", 1.5);
        return json({ roundId: round.id, player, dealer, playerSum: ps, dealerSum: ds, status: "blackjack", done: true, payout: s?.payout ?? 0, multiplier: 1.5, balance: s && "balance" in s ? s.balance : undefined });
      }
      await settleBJ(round, st, "lost", 0);
      return json({ roundId: round.id, player, dealer, playerSum: ps, dealerSum: ds, status: "lost", done: true, payout: 0 });
    }

    updateState(round.id, st as unknown as Record<string, unknown>);
    return json({ roundId: round.id, player, dealer, playerSum: ps, dealerUp: dealer[0] });
  }

  const id = Number(body.roundId);
  const round = await getActiveRound(user.id, game, id);
  if (!round) return json({ error: "Round not found" }, 404);
  const st = round.state as BJState;

  if (body.action === "hit") {
    st.player.push(draw(st.deck));
    const ps = scoreBJ(st.player);
    if (ps > 21) {
      await updateState(round.id, st as unknown as Record<string, unknown>);
      await settleBJ(round, st, "lost", 0);
      return json({ player: st.player, dealer: st.dealer, playerSum: ps, dealerSum: scoreBJ(st.dealer), status: "bust", done: true, payout: 0 });
    }
    await updateState(round.id, st as unknown as Record<string, unknown>);
    return json({ player: st.player, dealerUp: st.dealer[0], playerSum: ps, status: "hit" });
  }

  if (body.action === "stand") {
    let ds = scoreBJ(st.dealer);
    while (ds < 17 && st.deck.length > 0) {
      st.dealer.push(draw(st.deck));
      ds = scoreBJ(st.dealer);
    }
    const ps = scoreBJ(st.player);
    const won = ds > 21 || ps > ds;
    const push = ds === ps;
    const s = await settleBJ(round, st, won || push ? "won" : "lost", won ? 1 : push ? 1 : 0);
    return json({ player: st.player, dealer: st.dealer, playerSum: ps, dealerSum: ds, status: won ? "won" : push ? "push" : "lost", done: true, payout: s?.payout ?? 0, multiplier: r2(won || push ? 1 : 0), balance: s && "balance" in s ? s.balance : undefined });
  }

  return json({ error: "Unknown action" }, 400);
}
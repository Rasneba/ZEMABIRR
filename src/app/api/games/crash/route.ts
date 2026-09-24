import { randomInt } from "crypto";
import { getCurrentUser, json, unauthorized } from "@/lib/auth";
import { crashMultiplierAt, getGame } from "@/lib/games";
import { getActiveRound, settleRound, startRound } from "@/lib/rounds";

export const dynamic = "force-dynamic";

type CrashState = { crashPoint: number; startedAt: number; auto: number | null };

function genCrashPoint() {
  const r = randomInt(0, 1_000_000) / 1_000_000;
  const cp = Math.floor((0.97 / (1 - r)) * 100) / 100;
  return Math.min(1000, Math.max(1, cp));
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const body = await req.json().catch(() => ({}));
  const game = String(body.game ?? "sky-jet");
  if (getGame(game)?.engine !== "crash") return json({ error: "Unknown game" }, 400);
  const action = String(body.action ?? "");

  if (action === "start") {
    const existing = await getActiveRound(user.id, game);
    if (existing) {
      const st = existing.state as CrashState;
      // allow resume if still flying
      if (crashMultiplierAt(Date.now() - st.startedAt) < st.crashPoint)
        return json({ error: "You already have an active round" }, 409);
      await settleRound(existing.id, user.id, "lost", st.crashPoint, existing.bet);
    }
    const autoNum = Number(body.auto);
    const auto = Number.isFinite(autoNum) && autoNum >= 1.01 ? Math.floor(autoNum * 100) / 100 : null;
    const state: CrashState = { crashPoint: genCrashPoint(), startedAt: Date.now() + 1200, auto };
    const res = await startRound(user.id, game, body.bet, state);
    if ("error" in res) return json({ error: res.error }, 400);
    return json({ roundId: res.round.id, startsIn: 1200, balance: res.balance, bonusBalance: res.bonusBalance });
  }

  const id = Number(body.roundId);
  const round = await getActiveRound(user.id, game, id);
  if (!round) return json({ status: "settled" });
  const st = round.state as CrashState;
  const elapsed = Date.now() - st.startedAt;
  const m = crashMultiplierAt(elapsed);

  // Auto cash-out handled on server
  if (st.auto && st.auto < st.crashPoint && m >= st.auto) {
    const s = await settleRound(round.id, user.id, "won", st.auto, round.bet);
    return json({ status: "won", multiplier: st.auto, crashPoint: null, payout: s?.payout ?? 0, balance: s && "balance" in s ? s.balance : undefined });
  }
  if (m >= st.crashPoint) {
    await settleRound(round.id, user.id, "lost", st.crashPoint, round.bet);
    return json({ status: "crashed", crashPoint: st.crashPoint });
  }

  if (action === "cashout") {
    if (elapsed < 0) return json({ error: "Round has not started" }, 400);
    const s = await settleRound(round.id, user.id, "won", m, round.bet);
    if (!s) return json({ status: "settled" });
    return json({ status: "won", multiplier: m, payout: s.payout, crashPoint: st.crashPoint });
  }

  return json({ status: "flying", elapsed, multiplier: m });
}

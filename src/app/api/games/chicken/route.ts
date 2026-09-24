import { randomInt } from "crypto";
import { getCurrentUser, json, unauthorized } from "@/lib/auth";
import { CHICKEN_LANES, CHICKEN_LEVELS, chickenMultiplier, type ChickenLevel } from "@/lib/games";
import { getActiveRound, settleRound, startRound, updateState } from "@/lib/rounds";

export const dynamic = "force-dynamic";
type ChickenState = { level: ChickenLevel; step: number };

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const body = await req.json().catch(() => ({}));
  const action = String(body.action ?? "");

  if (action === "resume") {
    const r = await getActiveRound(user.id, "chicken-road");
    if (!r) return json({ round: null });
    const st = r.state as ChickenState;
    return json({ round: { id: r.id, bet: r.bet, level: st.level, step: st.step } });
  }

  if (action === "start") {
    if (await getActiveRound(user.id, "chicken-road")) return json({ error: "Finish your current game first" }, 409);
    const level = String(body.level) as ChickenLevel;
    if (!(level in CHICKEN_LEVELS)) return json({ error: "Invalid difficulty" }, 400);
    const res = await startRound(user.id, "chicken-road", body.bet, { level, step: 0 });
    if ("error" in res) return json({ error: res.error }, 400);
    return json({ roundId: res.round.id, balance: res.balance, bonusBalance: res.bonusBalance });
  }

  const round = await getActiveRound(user.id, "chicken-road");
  if (!round) return json({ error: "No active game" }, 400);
  const st = round.state as ChickenState;

  if (action === "step") {
    const p = CHICKEN_LEVELS[st.level].p;
    const dead = randomInt(0, 1_000_000) / 1_000_000 < p;
    const step = st.step + 1;
    if (dead) {
      await settleRound(round.id, user.id, "lost", 0, round.bet, { ...st, step });
      return json({ result: "dead", step });
    }
    const mult = chickenMultiplier(st.level, step);
    if (step >= CHICKEN_LANES) {
      const s = await settleRound(round.id, user.id, "won", mult, round.bet, { ...st, step });
      return json({ result: "finished", step, multiplier: mult, payout: s?.payout ?? 0 });
    }
    await updateState(round.id, { ...st, step });
    return json({ result: "safe", step, multiplier: mult });
  }

  if (action === "cashout") {
    if (st.step === 0) return json({ error: "Take at least one step first" }, 400);
    const mult = chickenMultiplier(st.level, st.step);
    const s = await settleRound(round.id, user.id, "won", mult, round.bet);
    if (!s) return json({ error: "Already settled" }, 409);
    return json({ result: "cashout", multiplier: mult, payout: s.payout });
  }
  return json({ error: "Unknown action" }, 400);
}

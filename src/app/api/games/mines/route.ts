import { randomInt } from "crypto";
import { getCurrentUser, json, unauthorized } from "@/lib/auth";
import { minesMultiplier } from "@/lib/games";
import { getActiveRound, settleRound, startRound, updateState } from "@/lib/rounds";

export const dynamic = "force-dynamic";
type MinesState = { mines: number[]; count: number; revealed: number[] };

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const body = await req.json().catch(() => ({}));
  const action = String(body.action ?? "");

  if (action === "resume") {
    const r = await getActiveRound(user.id, "mines");
    if (!r) return json({ round: null });
    const st = r.state as MinesState;
    return json({ round: { id: r.id, bet: r.bet, count: st.count, revealed: st.revealed, multiplier: minesMultiplier(st.count, st.revealed.length) } });
  }

  if (action === "start") {
    if (await getActiveRound(user.id, "mines")) return json({ error: "Finish your current game first" }, 409);
    const count = Math.floor(Number(body.mines));
    if (!(count >= 1 && count <= 24)) return json({ error: "Mines must be between 1 and 24" }, 400);
    const cells = Array.from({ length: 25 }, (_, i) => i);
    for (let i = cells.length - 1; i > 0; i--) {
      const j = randomInt(0, i + 1);
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    const state: MinesState = { mines: cells.slice(0, count), count, revealed: [] };
    const res = await startRound(user.id, "mines", body.bet, state);
    if ("error" in res) return json({ error: res.error }, 400);
    return json({ roundId: res.round.id, balance: res.balance, bonusBalance: res.bonusBalance });
  }

  const round = await getActiveRound(user.id, "mines");
  if (!round) return json({ error: "No active game" }, 400);
  const st = round.state as MinesState;

  if (action === "reveal") {
    const cell = Math.floor(Number(body.cell));
    if (!(cell >= 0 && cell < 25) || st.revealed.includes(cell)) return json({ error: "Invalid tile" }, 400);
    if (st.mines.includes(cell)) {
      await settleRound(round.id, user.id, "lost", 0, round.bet, { ...st, revealed: [...st.revealed, cell] });
      return json({ result: "mine", mines: st.mines });
    }
    const revealed = [...st.revealed, cell];
    const mult = minesMultiplier(st.count, revealed.length);
    if (revealed.length === 25 - st.count) {
      const s = await settleRound(round.id, user.id, "won", mult, round.bet, { ...st, revealed });
      return json({ result: "cleared", multiplier: mult, payout: s?.payout ?? 0, mines: st.mines });
    }
    await updateState(round.id, { ...st, revealed });
    return json({ result: "safe", multiplier: mult, next: minesMultiplier(st.count, revealed.length + 1) });
  }

  if (action === "cashout") {
    if (st.revealed.length === 0) return json({ error: "Reveal at least one tile first" }, 400);
    const mult = minesMultiplier(st.count, st.revealed.length);
    const s = await settleRound(round.id, user.id, "won", mult, round.bet);
    if (!s) return json({ error: "Already settled" }, 409);
    return json({ result: "cashout", multiplier: mult, payout: s.payout, mines: st.mines });
  }
  return json({ error: "Unknown action" }, 400);
}

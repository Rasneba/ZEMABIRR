// Classic Keno — live, round-based 80-ball Keno.
// Rounds are global and derived from the wall clock (no background worker):
// 18s betting → 10s draw (one ball / sec) → 2s result = one draw every 30s.
// Payout table and fairness logic mirror the instant engine (see KENO_PAYTABLE).

import { KENO_PAYTABLE } from "./games";

export { KENO_PAYTABLE };

export const KL = {
  slug: "keno",
  numbers: 80, // board 1..80
  draw: 20, // balls drawn per round (classic 80-ball keno draws 20)
  maxPicks: 10, // numbers per ticket
  betMs: 10_000, // betting window
  drawMs: 18_000, // total draw duration (20 balls ≈ 0.9s each)
  resultMs: 2_000, // results shown before next round
  cycleMs: 30_000, // = betMs + drawMs + resultMs → next draw every 30s
  minBet: 1,
  maxBet: 10_000,
  maxTicketsPerRound: 20,
  currency: "Br",
  epoch: Date.UTC(2026, 8, 1, 0, 0, 0),
} as const;

export const kenoCycleMs = () => KL.cycleMs;

export function kenoRoundTimes(id: number) {
  const start = KL.epoch + id * KL.cycleMs;
  const betEnd = start + KL.betMs;
  const drawEnd = betEnd + KL.drawMs;
  const end = start + KL.cycleMs;
  return { id, start, betEnd, drawEnd, end };
}

export const kenoRoundIdAt = (t: number) => Math.floor((t - KL.epoch) / KL.cycleMs);

export type KenoPhase = "betting" | "drawing" | "result";

export function kenoPhase(id: number, t: number): KenoPhase {
  const r = kenoRoundTimes(id);
  if (t < r.betEnd) return "betting";
  if (t < r.drawEnd) return "drawing";
  return "result";
}

/** How many balls are visible at time t for the current round (0..10). */
export function kenoRevealed(id: number, t: number) {
  const r = kenoRoundTimes(id);
  if (t < r.betEnd) return 0;
  return Math.min(KL.draw, Math.floor((t - r.betEnd) / (KL.drawMs / KL.draw)) + 1);
}

export const kenoMultiplier = (picked: number, hits: number) => KENO_PAYTABLE[picked]?.[hits] ?? 0;

export function kenoHits(picks: number[], drawn: number[]) {
  const set = new Set(drawn);
  return picks.filter((n) => set.has(n)).length;
}

// ---- API payload types ----
export type KenoTicket = {
  id: string;
  name: string; // masked username
  picks: number[];
  bet: number;
  mine?: boolean;
};

export type KenoRoundInfo = {
  id: number;
  start: number;
  betEnd: number;
  drawEnd: number;
  end: number;
  hash: string; // sha256(seed), committed before the draw
  drawn: number[]; // empty while betting
  seed: string | null; // revealed once the draw has finished
};

export type KenoState = {
  now: number;
  round: KenoRoundInfo;
  feed: { total: number; tickets: KenoTicket[] };
  my: { tickets: KenoTicket[]; stake: number };
  hot: number[];
  cold: number[];
};

export type KenoResultRow = { id: number; time: number; drawn: number[]; seed: string; hash: string };
export type KenoHistoryRow = {
  id: number;
  round: number;
  picks: number[];
  bet: number;
  status: string;
  payout: number;
  multiplier: number;
  hits: number | null;
  drawn: number[] | null;
  createdAt: string;
};
export type KenoStats = { rounds: number; counts: number[] };
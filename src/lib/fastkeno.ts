// Fast Keno — shared (client + server safe) constants, round clock and paytable.
// Rounds are global: every player bets on the same round, which is derived
// purely from the wall clock, so no background worker is needed.

export const FK = {
  numbers: 80, // board 1..80
  draw: 20, // balls drawn per round
  maxPicks: 10, // numbers per ticket (1..10)
  betMs: 60_000, // betting window
  ballMs: 1_000, // one ball per second
  resultMs: 6_000, // results shown before next round
  minBet: 1,
  maxBet: 10_000,
  maxTicketsPerRound: 20,
  currency: "ETB",
  // Round #0 started at this instant (chosen so ids look like the original ~40 000).
  epoch: Date.UTC(2026, 7, 16, 0, 0, 0),
} as const;

export const FK_DRAW_MS = FK.draw * FK.ballMs;
export const FK_CYCLE_MS = FK.betMs + FK_DRAW_MS + FK.resultMs;

export type FkPhase = "betting" | "drawing" | "result";

export function fkRoundTimes(id: number) {
  const start = FK.epoch + id * FK_CYCLE_MS;
  const betEnd = start + FK.betMs;
  const drawEnd = betEnd + FK_DRAW_MS;
  const end = start + FK_CYCLE_MS;
  return { id, start, betEnd, drawEnd, end };
}

export const fkRoundIdAt = (t: number) => Math.floor((t - FK.epoch) / FK_CYCLE_MS);

export function fkPhase(id: number, t: number): FkPhase {
  const r = fkRoundTimes(id);
  if (t < r.betEnd) return "betting";
  if (t < r.drawEnd) return "drawing";
  return "result";
}

/** How many balls are visible at time t (0..20). */
export function fkRevealed(id: number, t: number) {
  const r = fkRoundTimes(id);
  if (t < r.betEnd) return 0;
  return Math.min(FK.draw, Math.floor((t - r.betEnd) / FK.ballMs) + 1);
}

// Payout multipliers: FK_PAYTABLE[picked][hits]. RTP ≈ 94–96 % for every pick size
// (hypergeometric 80/20; see docs/RULES.md §4.6).
export const FK_PAYTABLE: Record<number, number[]> = {
  1: [0, 3.8],
  2: [0, 1, 9.5],
  3: [0, 0, 2.5, 43],
  4: [0, 0, 1.5, 8, 92],
  5: [0, 0, 1, 3, 16, 350],
  6: [0, 0, 0.5, 2, 6, 75, 1000],
  7: [0, 0, 0.5, 1.5, 4, 17, 180, 1500],
  8: [0, 0, 0, 1, 3, 10, 70, 800, 5000],
  9: [0, 0, 0, 1, 2, 5, 25, 150, 2000, 8000],
  10: [0, 0, 0, 1, 1.5, 3, 10, 70, 500, 3000, 10000],
};

export const fkMultiplier = (picked: number, hits: number) => FK_PAYTABLE[picked]?.[hits] ?? 0;

export function fkHits(picks: number[], drawn: number[]) {
  const set = new Set(drawn);
  return picks.filter((n) => set.has(n)).length;
}

// ---- API payload types ----
export type FkTicket = {
  id: string;
  name: string; // masked username, e.g. b***w
  picks: number[];
  bet: number;
  mine?: boolean;
};

export type FkRoundInfo = {
  id: number;
  start: number;
  betEnd: number;
  drawEnd: number;
  end: number;
  hash: string; // sha256(seed) — committed before the draw
  drawn: number[]; // empty while betting
  seed: string | null; // revealed once the draw has finished
};

export type FkState = {
  now: number;
  round: FkRoundInfo;
  feed: { total: number; tickets: FkTicket[] };
  my: { tickets: FkTicket[]; stake: number };
  hot: number[];
  cold: number[];
};

export type FkResultRow = { id: number; time: number; drawn: number[]; seed: string; hash: string };

export type FkHistoryRow = {
  id: number;
  round: number;
  picks: number[];
  bet: number;
  status: string; // active | won | lost
  payout: number;
  multiplier: number;
  hits: number | null;
  drawn: number[] | null;
  createdAt: string;
};

export type FkStats = { rounds: number; counts: number[]; odd: number; even: number; low: number; high: number };

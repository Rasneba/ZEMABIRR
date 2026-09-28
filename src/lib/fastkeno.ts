// Fast Keno — shared (client + server safe) constants, round clock and paytable.
// Rounds are global: every player bets on the same round, which is derived
// purely from the wall clock, so no background worker is needed.

export const FK = {
  numbers: 80, // board 1..80
  draw: 20, // balls drawn per round
  maxPicks: 10, // numbers per ticket (1..10)
  betMs: 60_000, // betting window
  ballMs: 1_000, // one ball per second (base speed)
  resultMs: 4_000, // results shown before next round
  minBet: 1,
  maxBet: 10_000,
  maxTicketsPerRound: 20,
  currency: "ETB",
  // Round #0 started at this instant (chosen so ids look like the original ~40 000).
  epoch: Date.UTC(2026, 7, 16, 0, 0, 0),
} as const;

// Base per-ball draw speed (ms). Set FAST_KENO_DRAW_MS to change globally, e.g.
// 3000 = 60s draw. Users can also pick a draw duration in-game (see FK_DRAW_OPTIONS_MS).
export const DRAW_SPEED_MS = Number(process.env.FAST_KENO_DRAW_MS ?? FK.ballMs);

// Default total draw duration in ms (base schedule everyone falls back to).
export const FK_DRAW_MS = FK.draw * DRAW_SPEED_MS;

// Allowed user-selectable draw durations (total ms): 30s, 1m, 2m.
export const FK_DRAW_OPTIONS_MS = [30_000, 60_000, 120_000];

/** Snap a requested total draw duration to the nearest allowed option (or the base). */
export function fkNormalizeDrawMs(v: unknown, fallback = FK_DRAW_MS) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return FK_DRAW_OPTIONS_MS.reduce((a, b) => (Math.abs(b - n) < Math.abs(a - n) ? b : a), FK_DRAW_OPTIONS_MS[0]);
}

export const fkCycleMs = (drawMs = FK_DRAW_MS) => FK.betMs + drawMs + FK.resultMs;

export type FkPhase = "betting" | "drawing" | "result";

export function fkRoundTimes(id: number, drawMs = FK_DRAW_MS) {
  const cycle = fkCycleMs(drawMs);
  const start = FK.epoch + id * cycle;
  const betEnd = start + FK.betMs;
  const drawEnd = betEnd + drawMs;
  const end = start + cycle;
  return { id, start, betEnd, drawEnd, end };
}

export const fkRoundIdAt = (t: number, drawMs = FK_DRAW_MS) => Math.floor((t - FK.epoch) / fkCycleMs(drawMs));

export function fkPhase(id: number, t: number, drawMs = FK_DRAW_MS): FkPhase {
  const r = fkRoundTimes(id, drawMs);
  if (t < r.betEnd) return "betting";
  if (t < r.drawEnd) return "drawing";
  return "result";
}

/** How many balls are visible at time t (0..20) for a round drawn over `drawMs`. */
export function fkRevealed(id: number, t: number, drawMs = FK_DRAW_MS) {
  const r = fkRoundTimes(id, drawMs);
  if (t < r.betEnd) return 0;
  return Math.min(FK.draw, Math.floor((t - r.betEnd) / (drawMs / FK.draw)) + 1);
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
  drawMs: number; // total draw duration in ms used for this round's schedule
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

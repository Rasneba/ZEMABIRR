export const KENO_NUMBERS = 80;
export const KENO_DRAW = 20;
export const KENO_MAX_PICKS = 10;
export const KENO_MIN_BET = 1;
export const KENO_MAX_BET = 10000;

// Classic Keno paytable: KENO_PAYTABLE[picked][hits] → multiplier on hit.
export const KENO_PAYTABLE: number[][] = [
  [],
  [0, 3.8],
  [0, 1, 13],
  [0, 0, 1, 42],
  [0, 0, 1, 5, 120],
  [0, 0, 0, 2, 20, 400],
  [0, 0, 0, 1, 5, 80, 1500],
  [0, 0, 0, 0, 2, 15, 100, 3000],
  [0, 0, 0, 0, 1, 5, 30, 200, 5000],
  [0, 0, 0, 0, 0, 2, 6, 40, 300, 8000],
  [0, 0, 0, 0, 0, 2, 5, 10, 100, 800, 10000],
];

export const kenoMultiplier = (picked: number, hits: number) => KENO_PAYTABLE[picked]?.[hits] ?? 0;
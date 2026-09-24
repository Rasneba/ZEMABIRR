export type GameEngine = "crash" | "mines" | "chicken" | "keno" | "fastkeno" | "roulette";

export type Game = {
  slug: string;
  name: string;
  engine: GameEngine;
  image: string;
  category: "Crash" | "Instant" | "Keno" | "Table";
  provider: string;
  badge?: "HOT" | "NEW" | "TOP";
  accent: string;
  kenoSpeed?: number;
  crashTheme?: "plane" | "jet";
};

export const GAMES: Game[] = [
  { slug: "sky-jet", name: "Sky Jet", engine: "crash", image: "/games/skyjet.jpg", category: "Crash", provider: "ZemaBet Originals", badge: "HOT", accent: "#e11d48", crashTheme: "plane" },
  { slug: "chicken-road", name: "Chicken Road", engine: "chicken", image: "/games/chicken.jpg", category: "Instant", provider: "ZemaBet Originals", badge: "NEW", accent: "#f59e0b" },
  { slug: "fast-keno", name: "Fast Keno", engine: "fastkeno", image: "/games/keno.jpg", category: "Keno", provider: "ZemaBet Originals", badge: "HOT", accent: "#4cc27e" },
  { slug: "keno", name: "Keno", engine: "keno", image: "/games/keno.jpg", category: "Keno", provider: "ZemaBet Originals", badge: "TOP", accent: "#a855f7", kenoSpeed: 220 },
  { slug: "mines", name: "Mines", engine: "mines", image: "/games/mines.jpg", category: "Instant", provider: "ZemaBet Originals", badge: "HOT", accent: "#14b8a6" },
  { slug: "mini-roulette", name: "Mini Roulette", engine: "roulette", image: "/games/roulette.jpg", category: "Table", provider: "ZemaBet Originals", accent: "#16a34a" },
  { slug: "turbo-keno", name: "Turbo Keno", engine: "keno", image: "/games/keno.jpg", category: "Keno", provider: "ZemaBet Originals", accent: "#ec4899", kenoSpeed: 25 },
  { slug: "avia-masters", name: "Avia Masters", engine: "crash", image: "/games/avia.jpg", category: "Crash", provider: "ZemaBet Originals", badge: "NEW", accent: "#0ea5e9", crashTheme: "jet" },
];

export const getGame = (slug: string) => GAMES.find((g) => g.slug === slug);

// ---------- Shared math ----------
export const CRASH_K = 0.0001; // multiplier = e^(k * ms)
export const crashMultiplierAt = (ms: number) => Math.floor(Math.exp(CRASH_K * Math.max(0, ms)) * 100) / 100;

export function minesMultiplier(mines: number, safeRevealed: number) {
  let m = 1;
  for (let i = 0; i < safeRevealed; i++) m *= (25 - i) / (25 - mines - i);
  return safeRevealed === 0 ? 1 : Math.floor(m * 0.97 * 100) / 100;
}

export const CHICKEN_LEVELS = {
  easy: { p: 1 / 25, label: "Easy" },
  medium: { p: 3 / 25, label: "Medium" },
  hard: { p: 5 / 25, label: "Hard" },
  hardcore: { p: 10 / 25, label: "Hardcore" },
} as const;
export type ChickenLevel = keyof typeof CHICKEN_LEVELS;
export const CHICKEN_LANES = 15;
export function chickenMultiplier(level: ChickenLevel, step: number) {
  if (step === 0) return 1;
  const p = CHICKEN_LEVELS[level].p;
  return Math.floor((0.97 / Math.pow(1 - p, step)) * 100) / 100;
}

export const KENO_NUMBERS = 40;
export const KENO_DRAW = 10;
export const KENO_PAYTABLE: Record<number, number[]> = {
  1: [0, 3.8],
  2: [0, 1.7, 5.2],
  3: [0, 0, 2.7, 48],
  4: [0, 0, 1.7, 10, 84],
  5: [0, 0, 1.4, 4, 14, 390],
  6: [0, 0, 0, 3, 9, 180, 710],
  7: [0, 0, 0, 2, 7, 30, 400, 800],
  8: [0, 0, 0, 2, 4, 11, 67, 400, 900],
  9: [0, 0, 0, 2, 2.5, 5, 15, 100, 500, 1000],
  10: [0, 0, 0, 1.6, 2, 4, 7, 26, 100, 500, 1000],
};

export const ROULETTE_RED = [1, 3, 5, 8, 10, 12];
export const ROULETTE_BLACK = [2, 4, 6, 7, 9, 11];
export const ROULETTE_WHEEL = [0, 7, 3, 10, 5, 12, 1, 8, 4, 11, 2, 9, 6];
export function rouletteWins(key: string, n: number) {
  if (key.startsWith("n")) return Number(key.slice(1)) === n;
  if (n === 0) return false;
  switch (key) {
    case "red": return ROULETTE_RED.includes(n);
    case "black": return ROULETTE_BLACK.includes(n);
    case "odd": return n % 2 === 1;
    case "even": return n % 2 === 0;
    case "low": return n <= 6;
    case "high": return n >= 7;
  }
  return false;
}
export const roulettePayout = (key: string) => (key.startsWith("n") ? 12 : 2);
export const ROULETTE_KEYS = [
  ...Array.from({ length: 13 }, (_, i) => `n${i}`),
  "red", "black", "odd", "even", "low", "high",
];

export const SPIN_PRIZES = [
  { label: "Br 5", amount: 5, weight: 26, color: "#1f7a4d" },
  { label: "Br 10", amount: 10, weight: 20, color: "#b8860b" },
  { label: "Br 20", amount: 20, weight: 10, color: "#1f7a4d" },
  { label: "Try again", amount: 0, weight: 22, color: "#3a3f41" },
  { label: "Br 50", amount: 50, weight: 4, color: "#b8860b" },
  { label: "Br 2", amount: 2, weight: 14, color: "#1f7a4d" },
  { label: "Br 100", amount: 100, weight: 1, color: "#c0262d" },
  { label: "Br 15", amount: 15, weight: 3, color: "#b8860b" },
];

export const LOOTBOXES = [
  { id: "bronze", name: "Bronze Shamo", price: 20, color: "#cd7f32", emoji: "📦", prizes: [0, 5, 10, 15, 20, 30, 50, 100, 500] , weights: [20, 20, 18, 14, 10, 9, 5, 3, 1] },
  { id: "silver", name: "Silver Shamo", price: 50, color: "#c0c0c0", emoji: "🎁", prizes: [0, 10, 25, 40, 50, 80, 150, 300, 1500], weights: [18, 20, 18, 14, 11, 9, 6, 3, 1] },
  { id: "gold", name: "Gold Shamo", price: 200, color: "#e5b224", emoji: "💰", prizes: [0, 50, 100, 150, 200, 350, 600, 1500, 10000], weights: [16, 20, 18, 15, 12, 10, 6, 2.6, 0.4] },
];

export function weightedPick(weights: number[], r: number) {
  const total = weights.reduce((a, b) => a + b, 0);
  let x = r * total;
  for (let i = 0; i < weights.length; i++) {
    if ((x -= weights[i]) < 0) return i;
  }
  return weights.length - 1;
}

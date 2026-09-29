export type GameEngine = "crash" | "mines" | "chicken" | "fastkeno" | "roulette" | "dice" | "plinko" | "blackjack" | "keno" | "baccarat";

export type Game = {
  slug: string;
  name: string;
  engine: GameEngine;
  image: string;
  category: "Crash" | "Instant" | "Keno" | "Table" | "Live";
  provider: string;
  badge?: "HOT" | "NEW" | "TOP";
  accent: string;
  crashTheme?: "plane" | "jet";
};

export const GAMES: Game[] = [
  { slug: "sky-jet", name: "Sky Jet", engine: "crash", image: "/games/skyjet.jpg", category: "Crash", provider: "Zema Games Originals", badge: "HOT", accent: "#e11d48", crashTheme: "plane" },
  { slug: "chicken-road", name: "Chicken Road", engine: "chicken", image: "/games/chicken.jpg", category: "Instant", provider: "Zema Games Originals", badge: "NEW", accent: "#f59e0b" },
  { slug: "dice", name: "Dice", engine: "dice", image: "/games/dice.svg", category: "Instant", provider: "Zema Games Originals", badge: "HOT", accent: "#22d3ee" },
  { slug: "plinko", name: "Plinko", engine: "plinko", image: "/games/plinko.svg", category: "Instant", provider: "Zema Games Originals", badge: "NEW", accent: "#a855f7" },
  { slug: "blackjack", name: "Blackjack", engine: "blackjack", image: "/games/blackjack.svg", category: "Table", provider: "Zema Games Originals", badge: "TOP", accent: "#22c55e" },
  { slug: "baccarat", name: "Live Baccarat", engine: "baccarat", image: "/games/baccarat.svg", category: "Live", provider: "Zema Games Originals", badge: "NEW", accent: "#eab308" },
  { slug: "babel-tower", name: "Babel Tower", engine: "mines", image: "/games/mines.jpg", category: "Instant", provider: "Zema Games Originals", accent: "#f97316" },
  { slug: "fast-keno", name: "Fast Keno", engine: "fastkeno", image: "/games/keno.jpg", category: "Keno", provider: "Zema Games Originals", badge: "HOT", accent: "#4cc27e" },
  { slug: "keno-atlas", name: "Keno Atlas", engine: "keno", image: "/games/keno.jpg", category: "Keno", provider: "Zema Games Originals", badge: "NEW", accent: "#22c55e" },
  { slug: "keno", name: "Keno", engine: "keno", image: "/games/keno.jpg", category: "Keno", provider: "Zema Games Originals", accent: "#2dd4bf" },
  { slug: "mines", name: "Mines", engine: "mines", image: "/games/mines.jpg", category: "Instant", provider: "Zema Games Originals", badge: "HOT", accent: "#14b8a6" },
  { slug: "mini-roulette", name: "Mini Roulette", engine: "roulette", image: "/games/roulette.jpg", category: "Table", provider: "Zema Games Originals", accent: "#16a34a" },
  { slug: "double-roulette", name: "Double Roulette", engine: "roulette", image: "/games/roulette.jpg", category: "Table", provider: "Zema Games Originals", accent: "#10b981" },
  { slug: "aviator", name: "Aviator", engine: "crash", image: "/games/avia.jpg", category: "Crash", provider: "Zema Games Originals", badge: "HOT", accent: "#f43f5e", crashTheme: "plane" },
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

// ---------- Dice ----------
// Roll is 1..100. `under X` wins when roll < X, `over X` when roll > X.
// Multiplier = 0.97 / win probability (RTP ≈ 97%), target clamped to 3..97.
export const DICE_MIN = 3;
export const DICE_MAX = 97;
export function diceMultiplier(mode: "over" | "under", target: number) {
  const t = Math.min(DICE_MAX, Math.max(DICE_MIN, target));
  const p = mode === "under" ? (t - 1) / 100 : (100 - t) / 100;
  return Math.max(1.0, Math.floor((0.97 / p) * 100) / 100);
}

// ---------- Plinko ----------
// 16 rows, 17 bins (binomial distribution). Table tuned so RTP ≈ 96.8%.
export const PLINKO_ROWS = 16;
export const PLINKO_TABLE = [
  13.0, 7.0, 3.7, 2.4, 1.8, 1.3, 1.05, 0.75, 0.6,
  0.75, 1.05, 1.3, 1.8, 2.4, 3.7, 7.0, 13.0,
];

// ---------- Blackjack ----------
export const BJ_RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
export const BJ_SUITS = ["♠", "♥", "♦", "♣"];
export function scoreHand(cards: string[]): number {
  let sum = 0;
  let aces = 0;
  for (const c of cards) {
    const r = c.slice(0, -1);
    if (r === "A") aces++;
    else if (["J", "Q", "K"].includes(r)) sum += 10;
    else sum += Number(r);
  }
  for (let i = 0; i < aces; i++) sum += sum + 11 <= 21 ? 11 : 1;
  return sum;
}

// ---------- Baccarat ----------
// 8 decks, standard third-card rules. A=1, 2–9 face value, 10/J/Q/K = 0.
export const BAC_PLAYER = "player";
export const BAC_BANKER = "banker";
export const BAC_TIE = "tie";
export const BAC_HANDS = [BAC_PLAYER, BAC_BANKER, BAC_TIE] as const;
export type BacBet = (typeof BAC_HANDS)[number];

export function bacValue(card: string): number {
  const r = card.slice(0, -1);
  if (r === "A") return 1;
  if (["J", "Q", "K", "10"].includes(r) || r === "0") return 0;
  return Number(r) % 10;
}
export function bacTotal(cards: string[]): number {
  return cards.reduce((s, c) => (s + bacValue(c)) % 10, 0);
}
export const BAC_PAYOUTS: Record<BacBet, number> = { player: 1, banker: 0.95, tie: 8 };

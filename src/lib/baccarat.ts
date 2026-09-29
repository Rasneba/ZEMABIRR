import { randomInt } from "crypto";
import { BAC_BANKER, BAC_PLAYER, BAC_TIE, BAC_PAYOUTS, BJ_RANKS, BJ_SUITS, bacTotal } from "./games";

export const BAC_DECKS = 8;

export function buildShoe(deckCount: number = BAC_DECKS): string[] {
  const shoe: string[] = [];
  for (let d = 0; d < deckCount; d++) {
    for (const s of BJ_SUITS) {
      for (const r of BJ_RANKS) shoe.push(r + s);
    }
  }
  return shoe;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type BacWinner = typeof BAC_PLAYER | typeof BAC_BANKER | typeof BAC_TIE;

export type BacResult = {
  player: string[];
  banker: string[];
  playerTotal: number;
  bankerTotal: number;
  winner: BacWinner;
};

// Standard baccarat: 8 decks, natural 8/9, then the player/banker third-card rules.
export function playBaccarat(): BacResult {
  const shoe = shuffle(buildShoe());
  let idx = 0;
  const next = () => shoe[idx++];
  const player = [next(), next()];
  const banker = [next(), next()];
  let pT = bacTotal(player);
  let bT = bacTotal(banker);

  if (pT < 8 && bT < 8) {
    let third: string | null = null;
    if (pT <= 5) {
      third = next();
      player.push(third);
      pT = bacTotal(player);
    }
    const v = third !== null ? Number(third.slice(0, -1).replace("A", "1").replace(/(10|[JQK])/, "0")) % 10 : null;
    let bDraw = false;
    if (v === null) bDraw = bT <= 5;
    else if (bT <= 2) bDraw = true;
    else if (bT === 3) bDraw = v !== 8;
    else if (bT === 4) bDraw = ![0, 1, 8, 9].includes(v);
    else if (bT === 5) bDraw = ![0, 1, 2, 3, 8, 9].includes(v);
    else if (bT === 6) bDraw = [6, 7].includes(v);
    if (bDraw) {
      banker.push(next());
      bT = bacTotal(banker);
    }
  }

  const winner: BacWinner = bT === pT ? BAC_TIE : bT > pT ? BAC_BANKER : BAC_PLAYER;
  return { player, banker, playerTotal: pT, bankerTotal: bT, winner };
}
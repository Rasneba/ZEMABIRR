import "server-only";
import { createHash, createHmac } from "crypto";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { gameRounds, users } from "@/db/schema";
import { settleRound } from "./rounds";
import {
  FK,
  FK_PAYTABLE,
  fkHits,
  fkMultiplier,
  fkRoundTimes,
  type FkTicket,
} from "./fastkeno";

export const FK_SLUG = "fast-keno";

/**
 * Simulated lobby players shown in the "All" ticket feed (like the original,
 * which always shows thousands of tickets). They never touch balances.
 * Set FAST_KENO_SIM_PLAYERS=0 to show only real tickets.
 */
export const FK_SIM_ENABLED = process.env.FAST_KENO_SIM_PLAYERS !== "0";

// ---------------------------------------------------------------- provably fair
function secret() {
  return process.env.FAST_KENO_SECRET || createHash("sha256").update(`fk:${process.env.DATABASE_URL ?? "dev"}`).digest("hex");
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

/** Server seed of a round (secret until the draw is over). */
export const fkSeed = (id: number) => createHmac("sha256", secret()).update(`fast-keno:${id}`).digest("hex");
/** Public commitment published while betting is open. */
export const fkHash = (id: number) => sha256(fkSeed(id));

/**
 * Draw = first 20 steps of a Fisher–Yates shuffle of 1..80 where step i uses
 * uint32(sha256(`${seed}:${i}`)[0..8]) mod (80 - i). Anyone can re-compute it
 * from the revealed seed.
 */
export function fkDrawFromSeed(seed: string) {
  const pool = Array.from({ length: FK.numbers }, (_, i) => i + 1);
  const out: number[] = [];
  for (let i = 0; i < FK.draw; i++) {
    const r = parseInt(sha256(`${seed}:${i}`).slice(0, 8), 16);
    out.push(pool.splice(r % pool.length, 1)[0]);
  }
  return out;
}

const drawCache = new Map<number, number[]>();
export function fkDraw(id: number) {
  let d = drawCache.get(id);
  if (!d) {
    d = fkDrawFromSeed(fkSeed(id));
    drawCache.set(id, d);
    if (drawCache.size > 500) drawCache.delete(drawCache.keys().next().value!);
  }
  return d;
}

/** Hot / cold numbers over the last `n` finished rounds. */
export function fkFrequency(lastFinished: number, n: number) {
  const counts = new Array<number>(FK.numbers + 1).fill(0);
  for (let id = lastFinished; id > lastFinished - n; id--) for (const b of fkDraw(id)) counts[b]++;
  return counts;
}

export function fkHotCold(lastFinished: number, n = 50) {
  const counts = fkFrequency(lastFinished, n);
  const nums = Array.from({ length: FK.numbers }, (_, i) => i + 1);
  const hot = [...nums].sort((a, b) => counts[b] - counts[a] || a - b).slice(0, 7);
  const cold = [...nums].sort((a, b) => counts[a] - counts[b] || a - b).slice(0, 6);
  return { hot, cold };
}

// ---------------------------------------------------------------- simulated lobby
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type SimTicket = FkTicket & { at: number };
const simCache = new Map<number, SimTicket[]>();
const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const BETS = [5, 10, 10, 20, 20, 25, 50, 50, 64, 100, 100, 100, 150, 200, 200, 300, 500, 1000];
const PICK_SIZES = [1, 2, 3, 3, 3, 3, 4, 4, 5, 5, 6, 7, 8, 9, 10, 10, 10];

function simTickets(id: number): SimTicket[] {
  const hit = simCache.get(id);
  if (hit) return hit;
  // Seeded independently of the draw secret, so it can never leak the result.
  const rnd = mulberry32(parseInt(sha256(`fk-lobby:${id}`).slice(0, 8), 16));
  const total = 1800 + Math.floor(rnd() * 900);
  const players = Array.from({ length: 260 }, () => `${LETTERS[Math.floor(rnd() * 26)]}***${LETTERS[Math.floor(rnd() * 26)]}`);
  const out: SimTicket[] = [];
  for (let i = 0; i < total; i++) {
    const name = players[Math.floor(Math.pow(rnd(), 1.6) * players.length)];
    const size = PICK_SIZES[Math.floor(rnd() * PICK_SIZES.length)];
    const picks: number[] = [];
    const style = rnd();
    if (style < 0.2 && size <= 5) {
      // vertical / diagonal patterns people like (e.g. 46 36 26)
      const step = rnd() < 0.5 ? 10 : 1;
      let n = 1 + Math.floor(rnd() * (FK.numbers - step * (size - 1)));
      for (let k = 0; k < size; k++, n += step) picks.push(n);
      if (rnd() < 0.5) picks.reverse();
    } else {
      while (picks.length < size) {
        const n = 1 + Math.floor(rnd() * FK.numbers);
        if (!picks.includes(n)) picks.push(n);
      }
    }
    // Heavier arrival early in the window, tapering off, all before betting closes.
    const at = Math.floor(Math.pow(rnd(), 0.7) * (FK.betMs - 1500));
    out.push({ id: `s${id}-${i}`, name, picks, bet: BETS[Math.floor(rnd() * BETS.length)], at });
  }
  out.sort((a, b) => a.at - b.at);
  simCache.set(id, out);
  if (simCache.size > 6) simCache.delete(simCache.keys().next().value!);
  return out;
}

// ---------------------------------------------------------------- tickets
const mask = (u: string) => (u.length <= 2 ? `${u[0] ?? "*"}***` : `${u[0]}***${u[u.length - 1]}`).toLowerCase();

type TicketState = { round: number; picks: number[]; drawn?: number[]; hits?: number };

export async function fkRoundTickets(id: number) {
  return db
    .select({ id: gameRounds.id, userId: gameRounds.userId, bet: gameRounds.bet, state: gameRounds.state, createdAt: gameRounds.createdAt, username: users.username })
    .from(gameRounds)
    .innerJoin(users, eq(users.id, gameRounds.userId))
    .where(and(eq(gameRounds.game, FK_SLUG), sql`(${gameRounds.state}->>'round')::int = ${id}`))
    .orderBy(desc(gameRounds.id))
    .limit(500);
}

/** Feed for a round: real tickets merged with simulated lobby tickets visible at `now`. */
export async function fkFeed(id: number, now: number, userId: number | null, limit = 40) {
  const r = fkRoundTimes(id);
  const real = await fkRoundTickets(id);
  const realT = real.map((t) => ({
    id: String(t.id),
    name: mask(t.username),
    picks: (t.state as TicketState).picks,
    bet: t.bet,
    mine: userId != null && t.userId === userId,
    at: t.createdAt.getTime() - r.start,
  }));
  const elapsed = Math.min(now, r.betEnd) - r.start;
  const sim = FK_SIM_ENABLED ? simTickets(id).filter((t) => t.at <= elapsed) : [];
  const merged = [...realT, ...sim.slice(-limit)].sort((a, b) => b.at - a.at).slice(0, limit);
  const mine = realT.filter((t) => t.mine);
  return {
    total: realT.length + sim.length,
    tickets: merged.map(({ at: _at, ...t }) => t) as FkTicket[],
    my: { tickets: mine.map(({ at: _at, ...t }) => t) as FkTicket[], stake: Math.round(mine.reduce((s, t) => s + t.bet, 0) * 100) / 100 },
  };
}

/** Settle every finished-but-unsettled ticket of a user. Idempotent. */
export async function fkSettleUser(userId: number) {
  const active = await db
    .select()
    .from(gameRounds)
    .where(and(eq(gameRounds.userId, userId), eq(gameRounds.game, FK_SLUG), eq(gameRounds.status, "active")));
  const now = Date.now();
  for (const t of active) {
    const st = t.state as TicketState;
    if (fkRoundTimes(st.round).drawEnd > now) continue;
    const drawn = fkDraw(st.round);
    const hits = fkHits(st.picks, drawn);
    const mult = fkMultiplier(st.picks.length, hits);
    await settleRound(t.id, userId, mult > 0 ? "won" : "lost", mult, t.bet, { ...st, drawn, hits });
  }
}

export { FK_PAYTABLE };

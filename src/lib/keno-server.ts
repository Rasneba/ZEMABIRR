import "server-only";
import { createHash, createHmac } from "crypto";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { gameRounds, users } from "@/db/schema";
import { settleRound } from "./rounds";
import { KL, kenoHits, kenoMultiplier, kenoRoundTimes, type KenoTicket } from "./keno";

export const KENO_SLUG = KL.slug;

// ---------------------------------------------------------------- provably fair
function secret() {
  const s = process.env.KENO_SECRET ?? process.env.FAST_KENO_SECRET;
  if (!s) throw new Error("KENO_SECRET (or FAST_KENO_SECRET) must be set — see .env.example");
  return s;
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

/** Server seed of a round (secret until the draw is over). */
export const kenoSeed = (id: number) => createHmac("sha256", secret()).update(`classic-keno:${id}`).digest("hex");
/** Public commitment published while betting is open. */
export const kenoHash = (id: number) => sha256(kenoSeed(id));

/**
 * Draw = first `KL.draw` steps of a Fisher–Yates shuffle of 1..80, step i uses
 * uint32(sha256(`${seed}:${i}`)[0..8]) mod (80 − i). Verifiable from the seed.
 */
export function kenoDrawFromSeed(seed: string) {
  const pool = Array.from({ length: KL.numbers }, (_, i) => i + 1);
  const out: number[] = [];
  for (let i = 0; i < KL.draw; i++) {
    const r = parseInt(sha256(`${seed}:${i}`).slice(0, 8), 16);
    out.push(pool.splice(r % pool.length, 1)[0]);
  }
  return out;
}

const drawCache = new Map<number, number[]>();
export function kenoDraw(id: number) {
  let d = drawCache.get(id);
  if (!d) {
    d = kenoDrawFromSeed(kenoSeed(id));
    drawCache.set(id, d);
    if (drawCache.size > 500) drawCache.delete(drawCache.keys().next().value!);
  }
  return d;
}

/** Hot / cold numbers over the last `n` finished rounds. */
export function kenoFrequency(lastFinished: number, n: number) {
  const counts = new Array<number>(KL.numbers + 1).fill(0);
  for (let id = lastFinished; id > lastFinished - n; id--) for (const b of kenoDraw(id)) counts[b]++;
  return counts;
}

export function kenoHotCold(lastFinished: number, n = 50) {
  const counts = kenoFrequency(lastFinished, n);
  const nums = Array.from({ length: KL.numbers }, (_, i) => i + 1);
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

type SimTicket = KenoTicket & { at: number };
const simCache = new Map<number, SimTicket[]>();
const LETTERS = "abcdefghijklmnopqrstuvwxyz";
const BETS = [5, 10, 10, 10, 20, 20, 25, 50, 64, 100, 100, 150, 200, 300, 500, 1000];
const PICK_SIZES = [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 8, 9, 10, 10];

export const KENO_SIM_ENABLED = process.env.KENO_SIM_PLAYERS !== "0";

function simTickets(id: number): SimTicket[] {
  const cached = simCache.get(id);
  if (cached) return cached;
  const rnd = mulberry32(parseInt(sha256(`keno-lobby:${id}`).slice(0, 8), 16));
  const total = 400 + Math.floor(rnd() * 400);
  const players = Array.from({ length: 90 }, () => `${LETTERS[Math.floor(rnd() * 26)]}***${LETTERS[Math.floor(rnd() * 26)]}`);
  const out: SimTicket[] = [];
  for (let i = 0; i < total; i++) {
    const size = PICK_SIZES[Math.floor(rnd() * PICK_SIZES.length)];
    const picks: number[] = [];
    while (picks.length < size) {
      const n = 1 + Math.floor(rnd() * KL.numbers);
      if (!picks.includes(n)) picks.push(n);
    }
    const at = Math.floor(Math.pow(rnd(), 0.7) * (KL.betMs - 1200));
    out.push({ id: `s${id}-${i}`, name: players[Math.floor(Math.pow(rnd(), 1.6) * players.length)], picks, bet: BETS[Math.floor(rnd() * BETS.length)], at });
  }
  out.sort((a, b) => a.at - b.at);
  simCache.set(id, out);
  if (simCache.size > 6) simCache.delete(simCache.keys().next().value!);
  return out;
}

// ---------------------------------------------------------------- tickets
const maskK = (u: string) => (u.length <= 2 ? `${u[0] ?? "*"}***` : `${u[0]}***${u[u.length - 1]}`).toLowerCase();

type TicketState = { mode?: "live"; round: number; picks: number[]; drawn?: number[]; hits?: number };

export async function kenoRoundTickets(id: number) {
  return db
    .select({ id: gameRounds.id, userId: gameRounds.userId, bet: gameRounds.bet, state: gameRounds.state, createdAt: gameRounds.createdAt, username: users.username })
    .from(gameRounds)
    .innerJoin(users, eq(users.id, gameRounds.userId))
    .where(
      and(
        eq(gameRounds.game, KENO_SLUG),
        sql`(${gameRounds.state}->>'mode') = 'live'`,
        sql`(${gameRounds.state}->>'round')::int = ${id}`
      )
    )
    .orderBy(desc(gameRounds.id))
    .limit(300);
}

/** Feed: real tickets merged with simulated lobby tickets visible at `now`. */
export async function kenoFeed(id: number, now: number, userId: number | null, limit = 30) {
  const r = kenoRoundTimes(id);
  const real = await kenoRoundTickets(id);
  const realT = real.map((t) => ({
    id: String(t.id),
    name: maskK(t.username),
    picks: (t.state as TicketState).picks,
    bet: t.bet,
    mine: userId != null && t.userId === userId,
    at: t.createdAt.getTime() - r.start,
  }));
  const elapsed = Math.min(now, r.betEnd) - r.start;
  const sim = KENO_SIM_ENABLED ? simTickets(id).filter((t) => t.at <= elapsed) : [];
  const merged = [...realT, ...sim.slice(-limit)].sort((a, b) => b.at - a.at).slice(0, limit);
  const mine = realT.filter((t) => t.mine);
  return {
    total: realT.length + sim.length,
    tickets: merged.map(({ at: _at, ...t }) => t) as KenoTicket[],
    my: {
      tickets: mine.map(({ at: _at, ...t }) => t) as KenoTicket[],
      stake: Math.round(mine.reduce((s, t) => s + t.bet, 0) * 100) / 100,
    },
  };
}

/** Settle every finished-but-unsettled live ticket of a user. Idempotent. */
export async function kenoSettleUser(userId: number) {
  const active = await db
    .select()
    .from(gameRounds)
    .where(
      and(
        eq(gameRounds.userId, userId),
        eq(gameRounds.game, KENO_SLUG),
        sql`(${gameRounds.state}->>'mode') = 'live'`,
        eq(gameRounds.status, "active")
      )
    );
  const now = Date.now();
  for (const t of active) {
    const st = t.state as TicketState;
    if (kenoRoundTimes(st.round).drawEnd > now) continue;
    const drawn = kenoDraw(st.round);
    const hits = kenoHits(st.picks, drawn);
    const mult = kenoMultiplier(st.picks.length, hits);
    await settleRound(t.id, userId, mult > 0 ? "won" : "lost", mult, t.bet, { ...st, mode: "live", drawn, hits });
  }
}
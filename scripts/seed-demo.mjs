// Seeds demo data for local development of the admin panel.
// Usage: DATABASE_URL=... node scripts/seed-demo.mjs
// WARNING: wipes users/transactions/game_rounds/promo/sports tables first.
import "dotenv/config";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const q = (text, params) => pool.query(text, params);

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260928);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const between = (min, max) => min + rnd() * (max - min);
const r2 = (n) => Math.round(n * 100) / 100;
const iso = (msAgo) => new Date(Date.now() - msAgo).toISOString();
const DAY = 86400000;

const NAMES = ["abel", "sara", "dawit", "hanna", "yohannes", "meron", "kalkidan", "natnael", "bethlehem", "eyob", "selam", "miki", "robhi", "tsion", "daniel", "liya", "samuel", "genet", "biruk", "ayantu", "fikir", "henok", "marta", "yared", "hewan", "solomon", "rina", "teddy", "mahi", "jerry"];

const GAMES = ["sky-jet", "chicken-road", "dice", "plinko", "blackjack", "babel-tower", "mines", "fast-keno", "mini-roulette", "shamo"];
const METHODS = ["telebirr", "telebirr", "telebirr", "cbebirr", "mpesa", "usdt"];

await q(`truncate users, sessions, transactions, game_rounds, promo_codes, promo_redemptions, sport_bets restart identity cascade`);

// ---- users ----------------------------------------------------------------
const userIds = [];
for (let i = 0; i < NAMES.length; i++) {
  const name = NAMES[i];
  const phone = `+2519${String(10000000 + Math.floor(rnd() * 89999999))}`;
  const wagered = r2(Math.pow(rnd(), 2) * 40000);
  const balance = r2(Math.max(0, between(-20, 900) + rnd() * rnd() * 2500));
  const bonus = r2(rnd() * rnd() * 300);
  const banned = i === NAMES.length - 1 || i === NAMES.length - 2 ? 1 : 0;
  const res = await q(
    `insert into users (phone, username, password_hash, balance, bonus_balance, total_wagered, referral_code, banned, ban_reason, first_deposit_done, created_at)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, now() - ($11 || ' days')::interval) returning id`,
    [phone, `${name}${Math.floor(rnd() * 90 + 10)}`, "seed:no-login", balance, bonus, wagered, Math.floor(rnd() * 0xffffffff).toString(16).padStart(8, "0").toUpperCase(), banned, banned ? "Chargeback abuse" : null, rnd() < 0.8 ? 1 : 0, Math.floor(between(0, 45))]
  );
  userIds.push(res.rows[0].id);
}

const depositsTotal = new Map();
const tx = async (userId, type, amount, opts = {}) =>
  q(
    `insert into transactions (user_id, type, amount, status, method, reference, note, created_at)
     values ($1, $2, $3, $4, $5, $6, $7, $8) returning id`,
    [userId, type, amount, opts.status ?? "completed", opts.method ?? null, opts.reference ?? null, opts.note ?? null, opts.at ?? iso(0)]
  );

// ---- deposits / withdrawals over 14 days -----------------------------------
for (let day = 13; day >= 0; day--) {
  const nDep = Math.floor(between(2, 9));
  for (let i = 0; i < nDep; i++) {
    const uid = pick(userIds);
    const amount = r2(pick([20, 50, 100, 100, 200, 200, 500, 500, 1000, 2000, 5000]) * between(0.8, 1.2));
    const at = iso(day * DAY - Math.floor(between(0, 20 * 3600000)));
    const method = pick(METHODS);
    const ref = `DP${Math.floor(rnd() * 0xffffffffff).toString(16).toUpperCase()}`;
    const txid = `TX${Math.floor(rnd() * 1e10).toString().padStart(10, "0")}`;
    let status = "completed";
    if (day === 0 && rnd() < 0.5) status = "pending";
    else if (rnd() < 0.06) status = "rejected";
    const res = await tx(uid, "deposit", amount, { status, method, reference: ref, note: txid, at });
    if (status === "completed") {
      depositsTotal.set(uid, (depositsTotal.get(uid) ?? 0) + amount);
      if (depositsTotal.get(uid) === amount && rnd() < 0.9) {
        await tx(uid, "bonus", r2(Math.min(amount * 2, 10000)), { note: "200% welcome bonus", at });
      }
    }
    void res;
  }
  const nWd = day === 0 ? 2 : rnd() < 0.7 ? 1 : 0;
  for (let w = 0; w < nWd; w++) {
    const uid = pick(userIds);
    const amount = r2(pick([50, 100, 200, 500, 1000, 1500]) * between(0.9, 1.1));
    const at = iso(day * DAY - Math.floor(between(0, 18 * 3600000)));
    const method = pick(METHODS);
    const ref = `WD${Math.floor(rnd() * 0xffffffffff).toString(16).toUpperCase()}`;
    const account = method === "usdt" ? "TQ" + Math.floor(rnd() * 1e16).toString(32).toUpperCase() : `09${Math.floor(between(10000000, 99999999))}`;
    const status = day === 0 && w === 0 ? "processing" : rnd() < 0.08 ? "rejected" : "completed";
    await tx(uid, "withdraw", -amount, { status, method, reference: ref, note: account, at });
    if (status === "rejected") await tx(uid, "refund", amount, { note: `Withdrawal ${ref} rejected — refund`, at });
  }
}

// ---- game rounds -----------------------------------------------------------
for (let day = 13; day >= 0; day--) {
  const nRounds = Math.floor(between(18, 55));
  for (let i = 0; i < nRounds; i++) {
    const uid = pick(userIds);
    const game = pick(GAMES);
    const bet = r2(pick([5, 10, 20, 25, 50, 100, 100, 200, 500]) * between(0.8, 1.3));
    const won = rnd() < (game === "shamo" ? 0.55 : 0.4);
    const base = game === "shamo" ? between(1.05, 2.2) : game.startsWith("keno") || game === "mini-roulette" ? between(1.05, 3.2) : between(1.05, 2.6);
    const multiplier = won ? r2(base * (rnd() < 0.025 ? between(4, 10) : 1)) : 0;
    const payout = won ? r2(bet * multiplier) : 0;
    const at = iso(day * DAY - Math.floor(between(0, 22 * 3600000)));
    await q(
      `insert into game_rounds (user_id, game, bet, payout, multiplier, status, state, created_at) values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [uid, game, bet, payout, multiplier, won ? "won" : "lost", "{}", at]
    );
  }
}

// ---- promo codes -----------------------------------------------------------
await q(`insert into promo_codes (code, amount, max_uses, uses) values
  ('WELCOME50', 50, 100000, 0), ('ZEMA100', 100, 5000, 0), ('TELEGRAM25', 25, 100000, 0),
  ('DERBI300', 300, 250, 0), ('ETHIOPIA75', 75, 1000, 0) on conflict (code) do nothing`);
for (let i = 0; i < 6; i++) {
  const uid = pick(userIds);
  const amount = pick([25, 50, 100]);
  await tx(uid, "promo", amount, { note: `Promo code DEMO${i}` });
  await tx(uid, "spin", pick([2, 5, 10, 15]), { note: "Lucky Spin" });
}

// ---- sport bets -------------------------------------------------------------
for (let i = 0; i < 26; i++) {
  const uid = pick(userIds);
  const stake = r2(pick([10, 20, 50, 100, 200, 500]) * between(0.8, 1.2));
  const legs = Math.floor(between(1, 4));
  const sels = Array.from({ length: legs }, (_, li) => ({
    matchId: `${Math.floor(Date.now() / DAY)}-${li}-${i}`,
    label: `${pick(["Saint George", "Arsenal", "Real Madrid", "Inter", "Bayern Munich"])} vs ${pick(["Fasil Kenema", "Liverpool", "Barcelona", "Napoli", "PSG"])}`,
    market: rnd() < 0.6 ? "1X2" : "OU",
    pick: pick(["1", "X", "2", "O", "U"]),
    odds: r2(between(1.2, 1.9)),
    kickoff: iso(-between(1, 72) * 3600000),
  }));
  const totalOdds = r2(sels.reduce((a, s) => a * s.odds, 1));
  const pending = rnd() < 0.45;
  const won = !pending && rnd() < 0.3;
  await q(
    `insert into sport_bets (user_id, selections, stake, total_odds, status, payout, settle_at, created_at)
     values ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [uid, JSON.stringify(sels), stake, totalOdds, pending ? "pending" : won ? "won" : "lost", won ? r2(stake * totalOdds) : 0, iso(pending ? -between(2, 48) * 3600000 : between(1, 96) * 3600000), iso(between(0, 10 * DAY))]
  );
}

const counts = await q(`select
  (select count(*) from users) users, (select count(*) from transactions) txs,
  (select count(*) from game_rounds) rounds, (select count(*) from sport_bets) bets`);
console.log("SEED_OK", counts.rows[0]);
await pool.end();

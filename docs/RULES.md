# ZemaBet — Business Rules, Game Math & Player Terms

Authoritative reference for every rule enforced in the ZemaBet codebase
(`src/lib/*`, `src/app/api/**`). Treat as the single source of truth.

---

## 1. Account & eligibility

- Players must be **21 or older**; registration requires an explicit age
  confirmation (`age = true`), enforced server-side.
- One account per person/phone/household/device.
- Phone must be a valid **Ethiopian mobile** (`09XXXXXXXX`, `7XXXXXXXX` or
  `9XXXXXXXX` → stored as `+251…`).
- Username 3–20 characters; password ≥ 6 characters.
- Passwords stored as salted scrypt hash (`salt:hash`), verified with
  `timingSafeEqual`. Sessions are httpOnly cookies, 30 days.

## 2. Currencies & payment methods

- Display currency: **Br (Ethiopian Birr)**, 2 decimals.
- Supported methods: `telebirr`, `cbebirr`, `mpesa`, `usdt`.
- **Deposit**: min **Br 10**, max **Br 10,000**. Telebirr deposits are sent to
  the merchant number **0912009497** (see `BRAND.telebirrMerchant`).
- Deposits are **agent-approved**: the client submits the **transaction ID from
  the payment SMS** (`txid`, min 6 chars) and the deposit is created as
  `pending`. An agent (via `/admin` panel or the admin Telegram bot) checks that
  the shared SMS shows the same **amount** and **transaction ID**, then
  approves — only then is the amount credited to the **real balance**. Rejected
  deposits stay unpaid (`status = rejected`).
- **Withdrawal**: min **Br 50**, max **Br 30,000**; only from **real balance**
  (bonus balance is not withdrawable). Requires account/phone/wallet address
  (≥ 6 chars). Status set to `processing`.

## 3. Balances & betting order

Two balances: **real** (withdrawable) and **bonus** (must be played through).

- Stakes draw from **real first, then bonus**.
- Every stake — real or bonus — increments `total_wagered`.
- Winnings from games always credit the **real balance**. Promo/spin/lootbox
  that award fixed amounts credit the **bonus balance** (see sections 6–8).
- Multiplier/winnings are rounded to 2 decimals (`r2`).

## 4. Games — bet limits & multipliers

Common stake range for games: **min Br 1, max Br 10,000**.

### 4.1 Sky Jet / Avia Masters (crash)
- Multiplier curve: `multiplier = floor(e^(0.0001 · ms) * 100)/100`.
- Crash point generated as `floor((0.97 / (1 − r)) · 100)/100`, clamped to
  `[1, 1000]`. **House edge ≈ 3%** (the 0.97 factor).
- "Start" debits the stake, arms the round with 1.2 s countdown. Rejoining an
  active round while still flying is rejected (409); once crashed the old round
  is force-settled as lost.
- Player may set an **auto cash-out** (`auto ≥ 1.01`); the server auto-settles
  as won when the multiplier crosses it.
- Cash-out requires the round to have actually started (`elapsed ≥ 0`).

### 4.2 Chicken Road
- 15 lanes; difficulty levels (per-step mine probability `p`):
  Easy `1/25`, Medium `3/25`, Hard `5/25`, Hardcore `10/25`.
- Multiplier after `step` safe steps: `floor((0.97 / (1 − p)^step)·100)/100`
  (**≈3% house edge**).
- Revealing a mine settles the round as **lost** (all-in). Reaching lane 15
  settles as **won**. Cash-out requires ≥ 1 step taken.

### 4.3 Mines
- 5×5 grid (25 tiles); mines 1–24 selectable.
- Multiplier after `k` safe reveals:
  `m = Π (25−i)/(25−mines−i)` for i in 1..k, then `floor(m · 0.97 · 100)/100`
  (**≈3% house edge**).
- Hitting a mine = lost. Revealing all safe tiles = cleared (won).
- Cash-out requires ≥ 1 tile revealed.

### 4.4 Keno (Fast / Classic / Turbo)
- 40 numbers, 10 drawn. Pick 1–10 numbers. Bet range Br 1–10,000.
- Payout table `KENO_PAYTABLE[picked][hits]` (see `src/lib/games.ts`); e.g.
  pick 1 → 3.8× on hit; pick 10 → up to 1000×. House edge varies per pick
  size and is embedded in the table.

### 4.5 Mini Roulette
- Numbers 0–12; even-money bets pay 2:1; straight numbers pay **12:1**.
- Total bet per round ≤ **Br 20,000**; per-spot min Br 1.
- Red/black=1,3,5,8,10,12. `win = Σ (winning bet · payout)`, then
  `multiplier = win / total`.

## 5. Sports betting

- Stake: **min Br 5, max Br 20,000**; 1–15 selections per ticket, one per match.
- Markets: **1X2** and **Over/Under 2.5**. Odds carry a **7% overround**
  (margin = 1.07).
- Settling: a bet settles when the last match's `kickoff + 2h` has passed;
  all selections must win for the accumulator to pay
  (`payout = stake · totalOdds`), otherwise lost.
- A ticket referencing a match that has already kicked off is rejected.

## 6. Shared promotions & risk controls

### Welcome bonus (200% first deposit)
- One per player; matched **200% of first deposit, capped at Br 10,000**,
  credited to **bonus balance**.
- Awarded atomically on the **first approved deposit** (`firstDepositDone`
  guard) — repeat deposits get no bonus.
- Bonus funds are non-withdrawable; winnings earned from bonus balance land in
  the real balance.

### Referral program
- Every user has a unique `referralCode` (8 hex chars, upper).
- Referrer earns **Br 100 (real)** when a referred friend makes their **first
  deposit** (`referralPaid` flag prevents double pay).
- `GET /api/me` returns `invited` and `invitedDeposited` for the UI.

### Promo codes
- Built-in codes (seeded on first use): `WELCOME50` (Br 50),
  `ZEMA100` (Br 100), `TELEGRAM25` (Br 25). Codes are **one per user**.
- Redemption is atomic: insert redemption + increment `uses`
  (`uses < maxUses` required). Rewards credit the **bonus balance**.
- Rewards capped by `maxUses`; exhausted codes return "expired" (410).

### Lucky Spin
- **Once per 24h** per user (guarded by `lastSpinAt`). Rate-limit response is 429.
- Weighted prize wheel (see `SPIN_PRIZES` in `src/lib/games.ts`): Br 2–100 or
  "Try again". Prizes credit **bonus balance**. Expected value keeps the offer
  safe (weights heavily favour small prizes).

### Shamo lootboxes
- Bronze Br 20 / Silver Br 50 / Gold Br 200. Weighted prize tables (`prizes` +
  `weights` in `LOOTBOXES`); top prize Br 10,000 (Gold, 0.4% weight).
- Opening debits the price (counts toward wagering), prizes credit **real**
  balance (they're recorded as game wins). Recorded as `game = "shamo"` rounds.

## 7. VIP Club

Progress is purely **total wagered** (`total_wagered`), no opt-in:

| Level    | Min wagered | Weekly cashback |
|----------|-------------|-----------------|
| Explorer | 0           | 0 %             |
| Bronze   | Br 1,000    | 2 %             |
| Silver   | Br 10,000   | 4 %             |
| Gold     | Br 50,000   | 6 %             |
| Platinum | Br 200,000  | 8 %             |
| Diamond  | Br 1,000,000| 12 %            |

Higher tiers unlock priority support, personal account manager, level-up
rewards (UI).

## 8. Anti-abuse & engineering safeguards

- **Atomic settlements**: `settleRound` only settles active rounds;
  double cash-out / double payout is impossible.
- **Atomic claims**: spin/lootbox/promo/welcome-bonus all use guarded
  `UPDATE … WHERE` conditions to prevent double-claiming under concurrency.
- **Server-side only** wallet/auth/rounds code (`server-only` import) — no
  client trust.
- Balance math is always 2-dp rounded; SQL `CASE` guards prevent negative
  balances.
- One active round per (user, game); re-joining is rejected.
- Withdrawal minimum prevents micro-siphoning; promo unique constraint
  `(userId, code)` prevents code reuse.

## 9. Responsible gaming

- 21+ requirement enforced at registration.
- "Only play with money you can afford to lose" messaging on /support.
- No credit/debit card auto-debit; deposits are manual, withdrawals user-initiated.
- Contact paths for problem gamblers: support email + Telegram (links in
  `BRAND`).

---
*Rules are mirrored 1:1 from the original tolobirr.com clone reference. Any
commercial launch must comply with local gambling regulation — the National
Lottery Administration revoked all Ethiopian sports-betting licences effective
15 Dec 2025.*
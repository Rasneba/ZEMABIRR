# ZemaBet — Development Guide

This guide explains how the ZemaBet codebase is organised and how to extend it.
It is the canonical reference for contributors.

---

## 1. Architecture overview

- **Next.js 16 App Router** with React Server Components (RSC). Pages are
  server components unless they need client interactivity (`"use client"`).
- **API routes** (`src/app/api/**/route.ts`) are the only data boundary.
  Clients call them with `POST/GET` and JSON. All game, wallet and sports logic
  lives server-side; the DB is never touched by the browser directly.
- **State sharing**: `AppProvider` (context in `src/components/AppProvider.tsx`)
  holds the current user (`/api/me`), auth/wallet modal state, and toast queue.
- **DB access**: `src/db/index.ts` exports a pooled `drizzle` instance. A global
  cache prevents pool duplication in dev (`globalForDb`). Import `server-only`
  anywhere DB/server logic is used (`src/lib/*`).
- **Server-only security**: `src/lib/auth.ts`, `wallet.ts`, `rounds.ts` import
  `"server-only"` so they can never be bundled to the client.

```
Browser ── fetch ──► /api/* route.ts ──► src/lib/* (business logic) ──► src/db ←── Neon Postgres
                        │                                                        ▲
    AppProvider ◄───── /api/me (user, balances)                                  │
    pages (RSC/client) — renders components (games/* engines, modals) ───────────┘
```

## 2. Routing map

### Pages
| Route | File | Type |
|-------|------|------|
| `/` | `src/app/page.tsx` | RSC (home: banners, games, features, matches, latest wins) |
| `/casino` | `src/app/casino/page.tsx` | client (search + category filter) |
| `/sports` | `src/app/sports/page.tsx` | client (fixtures, bet slip, my bets) |
| `/games/[slug]` | `src/app/games/[slug]/page.tsx` | RSC → `GameView` |
| `/lootboxes` | `src/app/lootboxes/page.tsx` | client (Shamo boxes) |
| `/spin` | `src/app/spin/page.tsx` | client (Lucky Spin) |
| `/vip` | `src/app/vip/page.tsx` | client (VIP levels) |
| `/bonus` | `src/app/bonus/page.tsx` | client (200% welcome) |
| `/promo` | `src/app/promo/page.tsx` | client (promos + coupon codes) |
| `/referral` | `src/app/referral/page.tsx` | client (invite & earn) |
| `/wallet` | `src/app/wallet/page.tsx` | client (deposit/withdraw/history) |
| `/admin` | `src/app/admin/page.tsx` | client (agent deposit approval, needs `ADMIN_TOKEN`) |
| `/profile` | `src/app/profile/page.tsx` | client |
| `/support` | `src/app/support/page.tsx` | RSC (help, contact, responsible gaming) |
| `/terms` `/privacy` | `src/app/terms/page.tsx` etc. | RSC (static legal) |
| `/_not-found` | `src/app/not-found.tsx` | RSC |

### API routes
| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/auth/register` | POST | create account (+251 phone validation) |
| `/api/auth/login` | POST | verify password, create session |
| `/api/auth/logout` | POST | destroy session |
| `/api/auth/telegram` | POST | Mini App initData login/auto-register (bound users auto-login) |
| `/api/auth/telegram/claim` | POST | bot "Login": phone+password → link Telegram (`x-bot-key`) |
| `/api/auth/telegram/register` | POST | bot "Register": create + link account (`x-bot-key`) |
| `/api/auth/telegram/reset` | POST | bot "Forgot": set new password after phone proof (`x-bot-key`) |
| `/api/me` | GET | current user + referral stats |
| `/api/health` | GET | `SELECT 1` connectivity check |
| `/api/history` | GET | `?kind=tx\|games&game=` history |
| `/api/wallet/deposit` | POST | queue agent-approved deposit (pending + SMS txid) |
| `/api/wallet/withdraw` | POST | debit real balance (processing tx) |
| `/api/admin/deposits` | GET | list deposits (`?status=pending\|all`), `Authorization: Bearer <ADMIN_TOKEN>` |
| `/api/admin/deposits/approve` | POST | credit only when amount + SMS txid match (`src/lib/deposits.ts`) |
| `/api/admin/deposits/reject` | POST | mark deposit rejected |
| `/api/promo` | POST | redeem promo code (bonus balance) |
| `/api/spin` | POST | 24h free spin, weighted prize |
| `/api/lootbox` | POST | open Shamo box |
| `/api/games/crash` | POST | Sky Jet / Avia Masters (start/cashout/poll) |
| `/api/games/chicken` | POST | Chicken Road (start/step/resume/cashout) |
| `/api/games/mines` | POST | Mines (start/reveal/resume/cashout) |
| `/api/games/instant` | POST | Keno ×4 + Mini Roulette (one-shot) |
| `/api/sports` | GET/POST | list/settle my bets, place bet |

## 3. Database (schema)

`src/db/schema.ts` tables:

- **users** — phone, username, passwordHash, balance, bonusBalance,
  totalWagered, referralCode, referredBy, referralPaid, firstDepositDone,
  lastSpinAt, createdAt.
- **sessions** — token (pk), userId, expiresAt (30 days).
- **transactions** — ledger: type (deposit/withdraw/bet/win/bonus/referral/
  promo/spin/lootbox), amount, status (completed/processing), method,
  reference, note.
- **game_rounds** — per-round record: game slug, bet, payout, multiplier,
  status (active/won/lost), jsonb `state` (engine-specific), createdAt.
- **promo_codes / promo_redemptions** — code, amount, maxUses, uses + unique
  (userId, code) redemption.
- **sport_bets** — selections jsonb, stake, totalOdds, status, payout, settleAt.

Changes are made in `schema.ts` and applied with `npm run db:push`
(simple) or `npm run db:generate` + `db:migrate` (versioned migrations, stored
in `drizzle/`).

## 4. Wallet & balance rules (src/lib/wallet.ts)

- `debitStake` — takes **real balance first**, then bonus; always increments
  `total_wagered`. Rejects if `balance + bonus_balance < amount`.
- `debitReal` — withdraw-only from real balance.
- `credit(amount, toBonus)` — bonus goes to `bonus_balance`.
- `parseAmount` — validation clamp `min..max`, 2-decimal rounding.
- All money math uses `r2()` (round to 2dp). **Never** use raw floats for
  balances without rounding.

## 5. Games (src/lib/games.ts + api/games/*)

Every game is registered in the `GAMES` array and rendered by a JS engine in
`src/components/games/`, orchestrating with a single API route:

| Engine | API | Persist model |
|--------|-----|---------------|
| crash  | `/api/games/crash` | active round + `crashPoint`/`startedAt`/`auto` |
| chicken| `/api/games/chicken` | active round + `level`/`step` |
| mines  | `/api/games/mines`  | active round + `mines[]`/`revealed[]` |
| keno   | `/api/games/instant` | instant (no round resume) |
| roulette| `/api/games/instant`| instant |

Rules for round-based games (`src/lib/rounds.ts`):
1. One active round per game per user — starting when one exists is rejected
   (409) unless the engine force-settles it (crash resume).
2. `settleRound` is **atomic**: it only settles rows still `status = active`,
   so double cash-out is impossible.
3. `instantRound` records a round and credits winnings in one flow.

To add a new game:
1. Add it to `GAMES` in `src/lib/games.ts`.
2. Add engine logic/functions (payout table, multiplier).
3. Add a component in `src/components/games/`.
4. Wire it in `GameView.tsx` and add an API route under `api/games/`.
5. Add placeholder art under `public/games/<slug>.jpg`.

## 6. Sports (src/lib/sports.ts)

- Fixtures are **deterministic per day**: seeded by FNV-1a hash of
  `{day}{team}` — no external API needed, stable across deploys.
- Odds are derived from win probabilities with a **1.07 overround** (built-in
  house edge ~7%).
- `matchResult(id)` resolves a deterministic final score → `selectionWins`
  settles each pick.
- `MATCH_DURATION = 2h`; bets settle via `/api/sports` `settleDue()` when the
  last selection's `kickoff + MATCH_DURATION` is in the past.

## 7. Auth & sessions (src/lib/auth.ts)

- Password hashing: `scryptSync(pw, salt, 64)`, stored `salt:hash`, verified
  with `timingSafeEqual`.
- Session cookie: `zb_session`, httpOnly, sameSite lax, 30-day expiry, stored
  in `sessions` table.
- Phone format: normalised to `+251…`; must match `^[79]\d{8}$` (Ethiopian
  mobile). Username 3–20 chars, password ≥ 6 chars, age confirmation required ≥ 21.
- **Telegram binding**: `users.telegram_id` links a Telegram account to a player.
  Once linked, opening the web app as the Mini App auto-signs them in via
  `initData` (`/api/auth/telegram`). The site bot (`npm run tg-bot`,
  `scripts/tg-auth-bot.mjs`) drives Login/Register/Forgot using the
  `/api/auth/telegram/{claim,register,reset}` endpoints, which require the
  `x-bot-key` header matching `TELEGRAM_BOT_TOKEN`.

## 8. UI & styling conventions

- **Tailwind CSS 4** via `@theme` tokens in `src/app/globals.css`:
  `bg`, `side`, `card`, `card2`, `line`, `mute`, `gold`, `gold2`,
  `brand-red`, `win`, `lose`.
- Reusable classes: `.btn-gold`, `.btn-green`, `.btn-ghost`, `.input`,
  `.no-scrollbar`, `.animate-floaty`, `.animate-pop`, `.text-shimmer`.
- Brand colors: dark slate `#1c1f20`, gold `#e5b224`, brand red `#d0191f`,
  win green `#22c55e`.
- Mobile-first: sidebar hidden on mobile, bottom nav (`BottomNav` in
  `AppShell.tsx`), modals slide from bottom, drawer menu.
- Components are colocated under `src/components/`; game engines under
  `src/components/games/`.

## 9. Client data flow

- `useApp()` gives: `user`, `loading`, `refresh()`, `setBalances(real, bonus)`,
  `openAuth("login"|"register")`, `openWallet("deposit"|"withdraw")`, `toast`,
  `requireAuth()`.
- After any balance-changing API call, call `refresh()` (or `setBalances`) to
  keep the header balance in sync.
- `api<T>(url, body?)` helper wraps fetch with JSON + `cache: "no-store"`.

## 10. Code style & checks

- No code comments unless needed; follow existing TS + Prettier-ish formatting.
- Run before pushing:
  ```bash
  npm run lint
  npm run typecheck
  npm run build
  ```
- Never commit `.env`, `node_modules`, `.next`, `drizzle/` (see `.gitignore`).
- Never log or print secrets/`DATABASE_URL`.

## 11. Deployment walkthrough (Git → Neon → Vercel)

1. `git init && git add . && git commit -m "..."` (add remote when shared).
2. **Neon**: create project → in the console copy the **pooled** connection
   string. In Vercel this becomes `DATABASE_URL`.
3. Locally: `npm run db:push` with `DATABASE_URL` set (or apply via
   `drizzle/migrations` with `db:migrate`).
4. **Vercel**: New Project → Import GitHub repo → add env var `DATABASE_URL` →
   Deploy. Next.js is auto-detected; cache `~/.next`, build `npm run build`.
5. Verify with `https://<vercel>.vercel.app/api/health` → `{"ok":true}`.
6. Add/verify custom domain `zemabet.com` in Vercel → Domains, update DNS
   records (depends on where the domain is registered).

---
*See [RULES.md](RULES.md) for business rules and [LOGS.md](LOGS.md) for the
change/rebrand log.*
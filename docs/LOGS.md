# ZemaBet — Logs & Change History

Chronological log of the round-trip clone of tolobirr.com and every change made
in this repository. Update this file on future changes.

---

## Source & clone mapping (tolobirr.com → ZemaBet)

Live site inspected: `http://tolobirr.com` (Cassa.Bet-powered Next.js casino).

| ToloBirr element                                     | ZemaBet equivalent                                   |
|------------------------------------------------------|------------------------------------------------------|
| Title: "ToloBirr — Online Casino, Sports Betting & Crash Games" | `BRAND.tagline` in `src/lib/brand.ts`      |
| Meta: "Play Aviator, Keno, slot games, jackpots, live-style casino games" | layout description (Sky Jet, Keno, Mines, Chicken Road) |
| Page `/help`                                         | `/support` (help, contact, responsible gaming)       |
| Page `/invite`                                       | `/referral`                                          |
| Page `/privacy`                                      | `/privacy`                                           |
| Page `/shamo`                                        | `/lootboxes` (Shamo boxes)                            |
| Page `/terms`                                        | `/terms`                                             |
| Page `/vip`                                          | `/vip`                                               |
| Crash games (Aviator-style)                          | Sky Jet, Avia Masters                                |
| Keno                                                     | Fast Keno, Keno, Turbo Keno                       |
| Instant/crash catalog (chicken road, mines, wheel…)  | Chicken Road, Mines, Shamo, Lucky Spin               |
| Sportsbook (nominally listed)                        | `/sports` deterministic fixtures                     |
| Wallet / payments                                    | `/wallet` (telebirr, CBE Birr, M-PESA, USDT)         |

> The original site could not be reached over HTTPS/`www` from this machine
> (connection reset); it responded on `http://tolobirr.com`, from which the
> structure above was captured. See `docs/DEVELOPMENT_GUIDE.md` for architecture.

---

## 2026-09-24 — Project build & rebrand log

### 1.00 — Foundation (`clone-website-with-rebranding (1)` imported)
- Replaced the old starter app in the workspace root (a static "ZolaBet"
  marketing page with `Navbar`/`Footer` and no backend) with the complete
  tolobirr-style clone reference:
  - Full app: dashboard home, casino, sports, spin, lootboxes, VIP, bonus,
    promo, referral, wallet, profile, support, terms, privacy, game pages.
  - Full backend: auth (register/login/logout/me), wallet (deposit/withdraw),
    promo, spin, lootbox, crash/chicken/mines/instant game engines, sports,
    history, health.
  - DB schema: users, sessions, transactions, game_rounds, promo_codes,
    promo_redemptions, sport_bets (drizzle/pg).

### 1.01 — Rebrand ZemaBirr → ZemaBet (chosen wordmark: *ZemaBet* mixed-case)
- `src/lib/brand.ts`: name/first/second → ZemaBet / Zema / Bet; domain, email,
  telegram handles updated to ZemaBet placeholders; currency kept **Br**.
- `src/app/layout.tsx`: SEO keywords `ZemaBirr` → `ZemaBet`.
- `src/lib/games.ts`: game provider "Zema Originals" → "ZemaBet Originals" (8).
- `src/app/icon.svg`: retained red `Z` favicon (fits "ZemaBet").
- `package.json`: renamed to `zemabet`, added `db:generate`, `db:migrate`,
  `db:push` scripts.

### 1.02 — Assets
- Generated placeholder artwork with `public/games/` (skyjet, chicken, keno,
  mines, roulette, avia — 400×400) and `public/banners/` (banner-1…3 —
  1280×560) so `next/image` renders without errors until real media is
  provided. Script: temp `make-images.ps1` (System.Drawing gradients).

### 1.03 — Config & environment
- `drizzle.config.json`: dialect postgresql, `out: ./drizzle`, URL
  `postgresql://postgres:postgres@127.0.0.1:5432/zemabet` (Neon override via
  `DATABASE_URL`, see DEV guide).
- Added `.env.example` (DATABASE_URL, NODE_ENV) and `.gitignore`.
- Pending user action: create **Neon** DB, wire **Vercel**, init **Git** —
  shared later by the owner.

### 1.04 — Documentation (this commit)
- `README.md` — project overview, stack, quick start, env, brand config, deploy.
- `docs/DEVELOPMENT_GUIDE.md` — architecture, routing, DB, wallet rules, game
  engines, sports engine, auth, styling, conventions, deploy walkthrough.
- `docs/RULES.md` — complete business rules & game math.
- `docs/LOGS.md` — this file.

### 1.05 — Verification & lint fixes
- `npm install` (388 packages), `npm run typecheck` clean, `npm run lint` clean,
  `npm run build` succeeds (7 static pages + 17 dynamic routes).
- Fixed new strict React hooks rules (Next 16 / eslint-plugin-react-hooks v6):
  - `Crash.tsx` — `phaseRef.current = phase` moved into a `useEffect`
    (`react-hooks/refs`).
  - `Roulette.tsx` — `Chip` hoisted to module level as a proper component with a
    `bets` prop (`react-hooks/static-components`).
  - `Countdown`, `referral`, `sports`, `AppProvider`, `AuthModal` — mount-time
    state init deferred with `setTimeout(…, 0)` (`react-hooks/set-state-in-effect`).
  - `page.tsx` — `react-hooks/purity` disabled inline for the force-dynamic RSC
    (per-request `Date.now()`/`getFixtures()` is intentional).
- Build requires `DATABASE_URL` to be present (module load); any real Neon
  connection string added by the owner will make deploy/walkthrough ready.

---

## Leading indicators

| Task                              | Status |
|-----------------------------------|--------|
| Copy full app into root           | done   |
| Rebrand ZemaBet everywhere        | done   |
| Game/banner placeholder assets    | done   |
| .env.example / .gitignore / drizzle | done |
| README + dev guide + rules + logs | done   |
| npm install (dependency verify)   | done   |
| lint / typecheck / build          | done ✓ |
| Full production admin panel (3.00)| done ✓ |
| Neon DB push (incl. banned column)| owner  |
| Vercel deploy                     | owner  |
| Git init + remote                 | owner  |

## How to log a new change
Append under a new `## YYYY-MM-DD` heading, bump the minor version, and update
the "Leading indicators" table.

---

## 2026-09-24 — Live fixes: Telegram login, keno result, limits, agent-approved deposits

### 2.00 — Fixes (this commit)
- **Telegram auto-login**: fixed the Login Widget race in `AuthModal` that made
  the widget silently fail to load (the holder div was queried before React had
  re-rendered `tgBot`). Split the fetch → render → script-inject into two
  effects. Added a "Continue with Telegram" fallback using Mini App `initData`
  (works where the widget iframe is blocked) and boot toasts in `AppProvider`
  for auto-registration and phone binding.
- **Keno result popup**: shorter Fast Keno result phase (`resultMs` 6s → 4s),
  faster ball reveal/drop to match, and a quick pop-in animation
  (`.fk-result-pop`) for the "You won / No win" result block.
- **Wallet limits**: deposit **max Br 100,000 → Br 10,000**; withdrawal
  **max Br 50,000 → Br 30,000** (routes, UI hints, quick buttons, RULES.md).
- **Telebirr deposit number**: the deposit form now shows the merchant number
  **0912009497** (`BRAND.telebirrMerchant`) and the exact amount to send.
- **Agent-approved deposits**: `POST /api/wallet/deposit` now creates a
  `pending` transaction with the client's **SMS transaction ID** instead of
  crediting instantly. Approval (`/api/admin/deposits`, `approve`, `reject`,
  share of `src/lib/deposits.ts`) only credits when **amount + transaction ID
  match**. Bonus/referral logic moved to approval time.
- **Admin panel**: new `/admin` page (passcode = `ADMIN_TOKEN`) listing deposits
  with approve/reject, amount + TX ID shown for cross-checking.
- **Admin Telegram bot**: `scripts/admin-bot.mjs` (`npm run admin-bot`) notifies
  the agent chat of pending deposits and approves/rejects via inline buttons.
  Configured `ADMIN_BOT_TOKEN`, `ADMIN_TOKEN`, `ADMIN_CHAT_ID`, `APP_URL` in
  `.env` / `.env.example`.

> Verification: `npm run typecheck` and `npm run lint` clean, `npm run build`
> succeeds. Bot token is git-ignored (`.env`) — never commit it.

### 2.01 — Site bot menu: login / register / forgot / launch
- **`scripts/tg-auth-bot.mjs`** (`npm run tg-bot`, uses `TELEGRAM_BOT_TOKEN`)
  gives @ZemaGamesbot a persistent menu:
  - **🔑 Login** — phone (typed or shared via `request_contact`) + password →
    `/api/auth/telegram/claim` links the Telegram user to the player.
  - **📝 Register** — phone + username + password → `/api/auth/telegram/register`
    creates and links the account (age 21+ enforced).
  - **🔓 Forgot Password** — phone shared via Telegram contact proves ownership
    → `/api/auth/telegram/reset` sets a new password.
  - **🚀 Open App** — web-app launch button (reply keyboard + bot menu button via
    `setChatMenuButton`).
- Once linked, opening the web app signs the user in automatically every time
  (Mini App `initData` → `/api/auth/telegram`). `claim`/`reset` also clear any
  auto-created "ghost" `tg:` account before binding the phone account.
- New bot-only endpoints under `/api/auth/telegram/{claim,register,reset}` are
  guarded by the `x-bot-key: <TELEGRAM_BOT_TOKEN>` header.
- BotFather still needs the site-bot **Domain** → `zemabirr-rho.vercel.app`
  (widget) and **Menu button URL** → `https://zemabirr-rho.vercel.app`.

---

## 2026-09-28 — Full production admin panel

### 3.00 — Admin control center (this commit)
- **`/admin` rebuilt** from a single deposit-approval list into a full
  production panel (same `ADMIN_TOKEN` passcode): sticky tab bar with
  **Dashboard · Deposits · Withdrawals · Players · Games · Sports · Ledger ·
  Promos**, all mobile-friendly, URL-synced (`/admin?tab=…`).
- **Dashboard** — KPI cards (players, deposits, withdrawals paid, bonus
  given, wagered, paid out, GGR, sports exposure) + 14-day SVG charts
  (cash flow, volume, daily GGR, signups) and clickable pending-queue alerts.
- **Withdrawal settlement** (new) — `GET /api/admin/withdrawals` +
  `POST …/settle {action: pay|reject}` backed by `src/lib/withdrawals.ts`.
  Funds are debited at request time; *pay* marks completed, *reject* refunds
  the real balance and writes a `refund` ledger row. Double-settle guarded.
- **Player management** (new) — search by id/@username/phone, profile drawer
  (balances, deposits/withdrawn, referrals, Telegram link, recent tx +
  rounds), manual balance adjustment (`adjust` ledger rows, debits refuse to
  go negative) and **ban/unban**:
  - Schema: `users.banned` + `users.ban_reason` → run `npm run db:push`
    against the production DB before deploying.
  - Banned players are excluded from `getCurrentUser` (sessions die), get
    `403 This account has been suspended` on login, and are blocked in
    Telegram auto-login; banning deletes their session rows.
- **Games tab** (new) — per-game rounds / wagered / paid out / GGR / RTP /
  W-L + a filterable round audit feed (`/api/admin/games`, `/api/admin/rounds`).
- **Sportsbook tab** (new) — exposure summary (open tickets, max exposure,
  staked vs paid), ticket list with selections, and **⚡ Settle due now**
  using the new shared `src/lib/sports-settle.ts` (player lazy-settle in
  `/api/sports` now uses it too).
- **Ledger tab** (new) — full transaction list with type/user filters and
  pagination (`/api/admin/transactions`).
- **Promo management** (new) — create/delete codes with usage counters
  (`GET/POST/DELETE /api/admin/promos`); redemption history survives deletion.
- **Deposits tab** — unchanged approval semantics (amount + SMS TX ID must
  match), now with completed/rejected filters; `admin-bot.mjs` endpoints
  untouched.
- Footer: discreet **Agent Panel** link.
- Dev tooling: `scripts/local-pg.mjs` (embedded Postgres for previews) and
  `scripts/seed-demo.mjs` (realistic 14-day demo dataset; wipes tables).

> Verification: `npm run typecheck` / `lint` clean, `npm run build` succeeds
> (16 `/api/admin/*` routes + `/admin`), and every mutation was smoke-tested
> end-to-end (approve/reject, pay/reject-with-refund, adjust, ban→403→unban,
> promo CRUD, settle-due).
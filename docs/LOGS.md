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
| Neon DB push                      | owner  |
| Vercel deploy                     | owner  |
| Git init + remote                 | owner  |

## How to log a new change
Append under a new `## YYYY-MM-DD` heading, bump the minor version, and update
the "Leading indicators" table.
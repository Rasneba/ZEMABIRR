# ZemaBet — Online Casino, Sports Betting & Crash Games

ZemaBet (`zemabet.com`) is a full-featured online gaming platform cloned from
[`www.tolobirr.com`](https://www.tolobirr.com/) and rebranded to the **ZemaBet**
brand. Every original feature and business rule is reproduced: crash games,
instant games, keno, roulette, sports betting, VIP club, promotions, daily
lucky spin, Shamo lootboxes, referral program, wallet, and a full PostgreSQL
backend.

> **Clone status:** fully detailed clone of tolobirr.com. The real ToloBirr
> title/meta is *"ToloBirr — Online Casino, Sports Betting & Crash Games"* and
> its public pages are `/help`, `/invite`, `/privacy`, `/shamo`, `/terms`,
> `/vip`. ZemaBet reproduces these (see [docs/LOGS.md](docs/LOGS.md) for the
> mapping).

## Tech stack

| Layer      | Technology |
|------------|------------|
| Framework  | Next.js 16 (App Router, RSC), React 19 |
| Language   | TypeScript 5.9 |
| Styling    | Tailwind CSS 4 (`@tailwindcss/postcss`) |
| Database   | PostgreSQL via **Neon** (drizzle-orm + `pg`) |
| ORM / Migrations | Drizzle ORM 0.45 + drizzle-kit 0.31 |
| Auth       | Phone + password (scrypt salted hash), session cookie `zb_session` |
| Hosting    | **Vercel** (see README Deploy section) |

## Project layout

```
src/
  app/               # App Router pages + API routes
    api/             # All backend endpoints (auth, wallet, games, sports…)
    bonus|casino|games|...|wallet/   # public pages
  components/        # UI (AppShell, Logo, modals, game engines…)
  db/                # drizzle client + schema
  lib/               # business logic (auth, wallet, rounds, sports, games, brand)
public/              # static assets (games/, banners/, favicon)
docs/                # development guide, rules, logs
```

## Quick start

```bash
npm install
cp .env.example .env    # set DATABASE_URL (Neon or local Postgres)
npm run db:push         # create tables
npm run dev             # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build
npm run start        # run production build
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run db:generate  # generate SQL migration from schema
npm run db:migrate   # apply migrations
```

## Environment variables

| Variable       | Required | Description |
|----------------|----------|-------------|
| `DATABASE_URL` | **yes**  | PostgreSQL connection string (Neon pooler URL recommended) |
| `NODE_ENV`     | yes      | `production` on Vercel |

## Configuration / brand

All branding is centralized in **one file**: `src/lib/brand.ts`

```ts
export const BRAND = {
  name: "ZemaBet",
  first: "Zema",
  second: "Bet",      // boxed wordmark → Zema[BET]
  domain: "zemabet.com",
  email: "support@zemabet.com",
  telegram: "https://t.me/zemabet",
  telegramSupport: "https://t.me/zemabet_support",
  currency: "Br",      // Ethiopian Birr
  tagline: "Online Casino, Sports Betting & Crash Games",
};
```

> Before go-live, replace the placeholder values (domain, email, telegram
> handles) with your real ones — the URLs in `brand.ts` point at the hypothetical
> ZemaBet handles.

## Deploying: Git + Neon + Vercel

1. **Git** — user-managed. Recommended: initialize a repo in this folder,
   commit everything, ignore `node_modules/`, `.next/`, `.env*`.
2. **Neon** — create a project, copy the pooled connection string
   (`postgresql://…-pooler…?sslmode=require&sslmode=require`) into `DATABASE_URL`.
   Run `npm run db:push` once against it to create the tables.
3. **Vercel** — import the repo, set `DATABASE_URL` (Neon pooler URL) as an
   Environment Variable, deploy. Framework preset auto-detects Next.js.

See [docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md) for the full walkthrough.

## Feature list

- **Games** (8, multi-engine): Sky Jet (crash), Avia Masters (crash), Chicken
  Road, Mines, Fast Keno / Keno / Turbo Keno, Mini Roulette.
- **Sports** betting: live + upcoming fixtures across 5 leagues, 1X2 & Over/Under
  2.5, accumulators, deterministic settlement.
- **Wallet**: deposit (telebirr, CBE Birr, M-PESA, USDT), withdrawal, real vs
  bonus balance, transaction ledger.
- **Bonuses & promos**: 200% first-deposit welcome bonus, daily promotion codes,
  free daily Lucky Spin, Shamo lootboxes (bronze/silver/gold).
- **VIP Club**: Explorer → Diamond, weekly cashback up to 12%.
- **Referral**: earn Br 100 per friend who makes a first deposit.
- **Auth**: Ethiopian phone number registration (+251), scrypt password hashing,
  httpOnly session cookie.

## Rules & game math

The complete business logic and game math (house edge, multipliers, payout
tables, limits, anti-abuse rules) are documented in
[**docs/RULES.md**](docs/RULES.md).

---
*ZemaBet is a development clone. 21+. Play responsibly.*
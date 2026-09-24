# Zema Games — Online Casino, Sports Betting & Crash Games

Zema Games (`zemagames.com`) is a full-featured online gaming platform cloned from
[`www.tolobirr.com`](https://www.tolobirr.com/) and rebranded to the **Zema Games**
brand. It runs as a **Telegram Mini App** with automatic Telegram login. Every
original feature and business rule is reproduced: crash games,
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
npm run admin-bot    # run the admin Telegram deposit-approval bot
npm run tg-bot       # run the site bot (login/register/forgot buttons + web-app launch)
```

## Telegram bots

**Site bot** (`npm run tg-bot`, uses `TELEGRAM_BOT_TOKEN`) gives players a menu
in Telegram:

- **🔑 Login** — phone + password; links the Telegram account to the player.
- **📝 Register** — phone + username + password; creates and links an account.
- **🔓 Forgot Password** — share the phone (confirming ownership), set a new one.
- **🚀 Open App** — the web-app launch button (also the bot's menu button).

Once linked, the player is **signed in automatically every time** they open the
web app (Mini App `initData` → `/api/auth/telegram`), so login/register are
one-time steps. Set the site-bot **Domain** and **Menu button URL** in BotFather
(`/mybots` → bot → Bot Settings → Domain → `APP_URL` host; Menu Button → URL →
`APP_URL`).

## Deposits & the admin bot

Deposits are **agent-approved**. The client sends money (Telebirr → `0912009497`,
see `BRAND.telebirrMerchant`), enters the **transaction ID from the payment SMS**
and the deposit is queued as `pending`. An agent then:

- approves via the **web panel** at `/admin` (enter `ADMIN_TOKEN`), or
- approves straight from Telegram with `npm run admin-bot` — the bot posts new
  pending deposits (amount + TX ID) to the agent chat and approves/rejects with
  inline buttons.

Approval is only accepted when the **amount and transaction ID match** the
original request. Approving credits the real balance and applies the
first-deposit 200% bonus / referral reward.

## Environment variables

| Variable            | Required | Description |
|---------------------|----------|-------------|
| `DATABASE_URL`      | **yes**  | PostgreSQL connection string (Neon pooler URL recommended) |
| `TELEGRAM_BOT_TOKEN`| **yes**  | Bot token from @BotFather — verifies Telegram Mini App login |
| `ADMIN_BOT_TOKEN`   | no       | Bot token for the admin deposit-approval bot (`npm run admin-bot`) |
| `ADMIN_TOKEN`       | *yes (for approvals)* | Shared passcode for `/admin` panel + `/api/admin/*` |
| `ADMIN_CHAT_ID`     | no       | Restrict the admin bot to one Telegram chat id |
| `APP_URL`           | no       | Site root the admin bot polls (use the deployed URL in prod) |
| `NODE_ENV`          | yes      | `production` on Vercel |

## Configuration / brand

All branding is centralized in **one file**: `src/lib/brand.ts`

```ts
export const BRAND = {
  name: "Zema Games",
  first: "Zema",
  second: "Games",    // boxed wordmark → Zema[GAMES]
  domain: "zemagames.com",
  email: "support@zemagames.com",
  telegram: "https://t.me/zemagames",
  telegramSupport: "https://t.me/zemagames_support",
  currency: "Br",      // Ethiopian Birr
  tagline: "Online Casino, Sports & Mini Games",
};
```

> Before go-live, replace the placeholder values (domain, email, telegram
> handles) with your real ones — the URLs in `brand.ts` point at the hypothetical
> Zema Games handles. Telegram login uses `TELEGRAM_BOT_TOKEN` (never commit it;
> set it in Vercel with the `DATABASE_URL`).

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
- **Wallet**: deposit (telebirr, CBE Birr, M-PESA, USDT — agent-approved with
  SMS transaction-ID verification), withdrawal, real vs bonus balance,
  transaction ledger.
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
*Zema Games is a development clone. 21+. Play responsibly.*
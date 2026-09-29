# Performance & Cleanup Audit Report

Date: 2026-09-29 · Commit: `cab416f`
Scope: read-only audit followed by safe cleanup/optimization of the Next.js app,
preserving 100% business functionality. No framework change, no DB schema change,
no dependency removal without verification.

## A. Files changed (27)

- `src/components/games/GameView.tsx`
- `src/components/AppProvider.tsx`
- `src/components/games/{Mines,Chicken,Dice,Plinko,Roulette}.tsx`
- `src/components/AuthModal.tsx`
- `src/components/admin/{api,Transactions}.tsx`
- `src/app/api/admin/sms/route.ts`
- `src/app/api/admin/sms/telebirr/route.ts`
- `src/app/api/me/route.ts`
- `src/lib/{admin,auth,deposits,wallet,sms,sports-settle,tg-bot,games,keno,keno-server,fastkeno-server,telegram}.ts`
- `.env.example`
- `tsconfig.json`

## B. Removed code

- Dead exports: `plinkoPaytable` (identity fn), `cardFace`, `kenoSpeed` field,
  `kenoCycleMs`, `isTelegramBrowser`, `FK_PAYTABLE` re-export in
  `fastkeno-server`, unread Plinko `rows` response field and a no-op
  `fillStyle` line.
- Dice's shadow `rolling` state (redundant with `busy`).
- `GameView`'s whole-subtree 8s `tick` re-render machine.
- Backup folder `clone-website-with-rebranding (1)` excluded from `tsconfig`
  — its stale copy was leaking into `tsc` and breaking the build.

## C. Components simplified

- `GameView.tsx`: 9 static game imports → `next/dynamic(..., { ssr: false })`
  (per-route code splitting). `MyBets` is now self-polling (10s interval +
  refetch on balance change) instead of being remounted by a parent ticker.
- `AppProvider.tsx`: context value wrapped in `useMemo` — consumers no
  longer re-render on every provider render.
- Mines/Chicken resume effects now depend on `user?.id` instead of the whole
  `user` object, fixing duplicate resume calls + board clobbering on balance
  refreshes.

## D. Dependencies removed

- None. No unused packages were verified un-used, so `package.json` was left
  untouched (per project rule).

## E. API / DB optimizations

- Admin SMS inbox no longer runs a second full `listSms("pending")` query;
  added `countPendingSms()` (`count(*)`) so `pendingCount` is exact under any
  status filter.
- `/api/me`: replaced load-all-referrals + JS counting with two `count()`
  aggregates.
- `approveDeposit` is now atomic: `UPDATE … WHERE status='pending' RETURNING`
  claims the row so concurrent agent approvals or retries can never
  double-credit. Welcome bonus computed once, guarded by the existing
  `firstDepositDone=0` claim.

## F. UI / layout changes

- Admin ledger `Transactions`: added the missing **lootbox** filter option
  (the server accepted it but the UI couldn't filter by it).

## G. Performance improvements

- Game bundle split per route (loading one game no longer ships the other 8
  engines).
- No more whole-subtree re-render every 8s on game pages.
- Context value memoized (fewer consumer renders).
- Mines/Chicken duplicate `/resume` API calls eliminated.
- Memory/CPU: dice flicker interval + reveal timeout, roulette spin timeout,
  plinko result timeout and the Telegram widget script are cleaned up on
  unmount.

## H. Security issues found & addressed

- Session cookie `secure: false` → secure in production.
- Admin passcode / SMS webhook secret / bot key compared with `===` →
  constant-time `timingSafeEqual` (shared `safeEqual` helper in
  `src/lib/admin.ts`).
- Fast & classic Keno round seeds fell back to `sha256(DATABASE_URL)` when no
  secret was set → both now require `KENO_SECRET`/`FAST_KENO_SECRET` and throw
  instead of deriving a key from a value an attacker also has; documented in
  `.env.example`.
- Admin API calls: non-ok responses surface `Request failed (NNN)` and a
  stale token is cleared on 401.
- `wallet.credit()` no longer dereferences `undefined` rows (would 500);
  `sports-settle.ts` won't settle a zero-selection ticket as a guaranteed win.

## I. Verification

- `npx tsc --noEmit` — pass
- `npx eslint src` — pass
- `npx next build` — pass (31 routes, full route tree built)
- Pushed: `6512401..cab416f main -> main` (auto-deploys to Vercel)

## J. Remaining issues & recommendations (deferred)

1. **Crash** runs a 60fps `requestAnimationFrame` loop permanently; pause it
   when idle (medium risk — canvas-driven game).
2. **Keno/FastKeno**: ~75 duplicated live-round lines, duplicated
   `Loading`/`money()`/pick-generator/paytable/Modal shells — safe to extract
   into a shared hook, but touches the two largest components.
3. **Keno.tsx stuck-spinner bug**: component can desync during busy-round
   disconnects; needs careful repro + fix.
4. **Simulated Keno lobbies** (`KENO_SIM_PLAYERS` / `FAST_KENO_SIM_PLAYERS`,
   on by default) show fake "players"; disabling changes lobby UX — owner
   decision.
5. **Sports odds/results are fabricated** (no provider feed) — by design, not
   fixable without a data source.
6. Repeated boilerplate (20× `isAdminRequest` guards, 24×
   `req.json().catch(() => ({}))`, game-route prologue) could be wrapped in
   helpers, but churn outweighs payoff.
7. `metadataBase` is unset (harmless build warning) — set from `APP_URL` if
   OG/social images matter.
8. Telegram Mini App login still requires whitelisting the site domain in
   @BotFather for full widget/auto-login.
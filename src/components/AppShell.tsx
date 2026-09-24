"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useApp } from "./AppProvider";
import Logo from "./Logo";
import Countdown from "./Countdown";
import Footer from "./Footer";
import AuthModal from "./AuthModal";
import WalletModal from "./WalletModal";
import { BRAND, fmt } from "@/lib/brand";

const GAME_LINKS = [
  { href: "/casino", label: "Casino", icon: "🎰" },
  { href: "/sports", label: "Sports", icon: "⚽" },
  { href: "/lootboxes", label: "Lootboxes", icon: "🎁" },
];

const FEATURE_LINKS = [
  { href: "/", label: "Overview", icon: "🏠" },
  { href: "/spin", label: "Lucky Spin", icon: "🎡", badge: "New" },
  { href: "/lootboxes", label: "Shamo", icon: "📦" },
  { href: "/promo", label: "Coupon", icon: "🎟️", badge: "New" },
  { href: "/vip", label: "VIP", icon: "👑" },
  { href: "/promo#promotions", label: "Promo", icon: "📣" },
  { href: "/bonus", label: "Bonus", icon: "💰" },
];

const SUPPORT_LINKS = [
  { href: "/support", label: "Get help", icon: "❓" },
  { href: "/support#contact", label: "Contact us", icon: "✉️" },
];

function NavGroup({ title, links, onNav }: { title: string; links: { href: string; label: string; icon: string; badge?: string }[]; onNav: () => void }) {
  const path = usePathname();
  return (
    <div className="rounded-xl bg-card p-2">
      <div className="flex h-8 items-center px-2 text-xs font-medium uppercase text-mute/80">{title}</div>
      {links.map((l) => {
        const active = l.href === "/" ? path === "/" : path.startsWith(l.href.split("#")[0]) && l.href.split("#")[0] !== "/";
        return (
          <Link
            key={l.label}
            href={l.href}
            onClick={onNav}
            className={`flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
              active ? "bg-white/10 text-white" : "text-white/85 hover:bg-white/5"
            }`}
          >
            <span className="w-5 text-center text-base">{l.icon}</span>
            <span className="flex-1">{l.label}</span>
            {l.badge && <span className="rounded bg-win/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-win">{l.badge}</span>}
          </Link>
        );
      })}
    </div>
  );
}

function SidebarContent({ onNav }: { onNav: () => void }) {
  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto p-3 no-scrollbar">
      <div className="flex items-center justify-between px-1 py-1">
        <Link href="/" onClick={onNav}><Logo /></Link>
      </div>
      <Link href="/bonus" onClick={onNav} className="glow-green block rounded-xl border border-win/20 bg-gradient-to-br from-win/15 to-gold/10 p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-win">Claim Your Free Reward</div>
        <div className="mb-3 mt-1 text-xl font-black uppercase leading-none text-white">Get 200% Bonus</div>
        <Countdown />
      </Link>
      <NavGroup title="Games" links={GAME_LINKS} onNav={onNav} />
      <Link href="/referral" onClick={onNav} className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gold/25 via-card to-card p-4">
        <div className="text-[11px] font-bold uppercase text-gold">Referral</div>
        <div className="mt-1 font-bold leading-tight">Invite friends. Earn {BRAND.currency} 100.</div>
        <p className="mt-1 pr-10 text-xs text-mute">You earn {BRAND.currency} 100 when a new friend makes their first deposit.</p>
        <span className="absolute right-2 bottom-2 text-4xl animate-floaty">🎁</span>
      </Link>
      <NavGroup title="Exclusive Features" links={FEATURE_LINKS} onNav={onNav} />
      <a href={BRAND.telegram} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl bg-[#229ED9] px-4 py-3 text-sm font-bold text-white">
        <span className="text-lg">✈️</span> Open in Telegram
      </a>
      <NavGroup title="Support" links={SUPPORT_LINKS} onNav={onNav} />
    </div>
  );
}

function BottomNav({ onMenu }: { onMenu: () => void }) {
  const path = usePathname();
  const items = [
    { href: "/casino", label: "Casino", icon: "🎰" },
    { href: "/sports", label: "Sports", icon: "⚽" },
    { href: "/promo", label: "Promo", icon: "🎟️" },
    { href: "/wallet", label: "Wallet", icon: "👛" },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-stretch border-t border-line bg-side/95 backdrop-blur md:hidden">
      <button onClick={onMenu} className="flex flex-1 flex-col items-center justify-center text-[11px] text-mute">
        <span className="text-lg">☰</span>Menu
      </button>
      {items.map((i) => (
        <Link key={i.href} href={i.href} className={`flex flex-1 flex-col items-center justify-center text-[11px] ${path.startsWith(i.href) ? "text-gold" : "text-mute"}`}>
          <span className="text-lg">{i.icon}</span>
          {i.label}
        </Link>
      ))}
    </nav>
  );
}

function Header() {
  const { user, loading, openAuth, openWallet } = useApp();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-line/50 bg-bg/90 px-3 backdrop-blur md:px-6">
      <Link href="/" className="md:hidden"><Logo size="sm" /></Link>
      <div className="hidden items-center gap-1 md:flex">
        {[{ h: "/casino", l: "Casino" }, { h: "/sports", l: "Sports" }, { h: "/lootboxes", l: "Lootboxes" }].map((x) => (
          <Link key={x.h} href={x.h} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-white/80 hover:bg-white/5 hover:text-white">{x.l}</Link>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {loading ? (
          <div className="h-9 w-40 animate-pulse rounded-lg bg-card" />
        ) : user ? (
          <>
            <Link href="/wallet" className="flex items-center gap-2 rounded-lg bg-card px-3 py-1.5">
              <span className="text-xs text-mute">💰</span>
              <span className="text-sm font-bold tabular-nums">{fmt(user.balance + user.bonusBalance)}</span>
            </Link>
            <button onClick={() => openWallet("deposit")} className="btn-gold rounded-lg px-3 py-1.5 text-sm">Deposit</button>
            <Link href="/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold to-brand-red text-sm font-black uppercase">
              {user.username.slice(0, 1)}
            </Link>
          </>
        ) : (
          <>
            <button onClick={() => openAuth("login")} className="btn-ghost rounded-lg px-4 py-2 text-sm">Log in</button>
            <button onClick={() => openAuth("register")} className="btn-gold rounded-lg px-4 py-2 text-sm">Sign up</button>
          </>
        )}
      </div>
    </header>
  );
}

function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed top-16 right-3 z-[100] flex w-72 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-pop rounded-xl border px-4 py-3 text-sm font-semibold shadow-xl ${
            t.kind === "success" ? "border-win/40 bg-[#123222] text-win" : t.kind === "error" ? "border-lose/40 bg-[#3a1616] text-red-300" : "border-line bg-card text-white"
          }`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  const [drawer, setDrawer] = useState(false);
  return (
    <div className="flex min-h-svh w-full">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 bg-side md:block">
        <SidebarContent onNav={() => {}} />
      </aside>
      {drawer && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawer(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-side shadow-2xl">
            <SidebarContent onNav={() => setDrawer(false)} />
          </aside>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <Header />
        <main className="mx-auto w-full max-w-6xl flex-1 px-3 pt-4 md:px-6">
          {children}
          <Footer />
        </main>
      </div>
      <BottomNav onMenu={() => setDrawer(true)} />
      <AuthModal />
      <WalletModal />
      <Toasts />
    </div>
  );
}

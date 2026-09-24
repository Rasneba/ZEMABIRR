"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, useApp } from "@/components/AppProvider";
import { fmt, vipFor } from "@/lib/brand";

export default function ProfilePage() {
  const { user, loading, openAuth, refresh, toast } = useApp();
  const router = useRouter();
  if (loading) return <div className="h-60 animate-pulse rounded-2xl bg-card" />;
  if (!user)
    return (
      <div className="py-16 text-center">
        <p className="text-mute">You are not logged in.</p>
        <button onClick={() => openAuth("login")} className="btn-gold mt-4 rounded-xl px-8 py-3">Log in</button>
      </div>
    );
  const v = vipFor(user.totalWagered);

  async function logout() {
    await api("/api/auth/logout", {});
    await refresh();
    toast("Logged out", "info");
    router.push("/");
  }

  const links = [
    { href: "/wallet", l: "My Wallet", i: "👛" },
    { href: "/sports", l: "Sports bets", i: "⚽" },
    { href: "/vip", l: "VIP Club", i: "👑" },
    { href: "/referral", l: "Invite friends", i: "🤝" },
    { href: "/promo", l: "Promo code", i: "🎟️" },
    { href: "/support", l: "Get help", i: "❓" },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-4 rounded-2xl bg-card p-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold to-brand-red text-2xl font-black uppercase">{user.username[0]}</div>
        <div className="flex-1">
          <div className="text-xl font-black">{user.username}</div>
          <div className="text-sm text-mute">{user.phone}</div>
          <div className="mt-1 text-xs font-bold" style={{ color: v.level.color }}>{v.level.icon} {v.level.name}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-card p-3"><div className="text-xs text-mute">Balance</div><b>{fmt(user.balance)}</b></div>
        <div className="rounded-2xl bg-card p-3"><div className="text-xs text-mute">Bonus</div><b className="text-gold">{fmt(user.bonusBalance)}</b></div>
        <div className="rounded-2xl bg-card p-3"><div className="text-xs text-mute">Wagered</div><b>{fmt(user.totalWagered)}</b></div>
      </div>
      <div className="overflow-hidden rounded-2xl bg-card">
        {links.map((x) => (
          <Link key={x.href} href={x.href} className="flex items-center gap-3 border-b border-line/40 px-5 py-3.5 last:border-0 hover:bg-white/5">
            <span className="text-lg">{x.i}</span><span className="flex-1 font-semibold">{x.l}</span><span className="text-mute">›</span>
          </Link>
        ))}
      </div>
      <button onClick={logout} className="btn-ghost w-full rounded-xl py-3 text-red-300">Log out</button>
    </div>
  );
}

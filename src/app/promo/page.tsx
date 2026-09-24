"use client";

import Link from "next/link";
import { useState } from "react";
import { api, useApp } from "@/components/AppProvider";
import { BRAND, fmt } from "@/lib/brand";

const PROMOS = [
  { title: "200% Welcome Bonus", text: "Triple your first deposit up to Br 10,000.", href: "/bonus", icon: "💰", grad: "from-[#15803d]/50" },
  { title: "Free Daily Spin", text: "Spin the wheel every 24h and win up to Br 100.", href: "/spin", icon: "🎡", grad: "from-[#6d28d9]/50" },
  { title: "Refer & Earn", text: `Earn ${BRAND.currency} 100 for every friend who deposits.`, href: "/referral", icon: "🤝", grad: "from-[#b45309]/50" },
  { title: "VIP Cashback", text: "Up to 12% weekly cashback for VIP members.", href: "/vip", icon: "👑", grad: "from-[#0e7490]/50" },
  { title: "Shamo Giveaway", text: "Mystery boxes with jackpots up to Br 10,000.", href: "/lootboxes", icon: "📦", grad: "from-[#be123c]/50" },
  { title: "Telegram Codes", text: "Join our channel for exclusive daily promo codes.", href: BRAND.telegram, icon: "✈️", grad: "from-[#0284c7]/50" },
];

export default function PromoPage() {
  const { requireAuth, toast, refresh } = useApp();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function claim(e: React.FormEvent) {
    e.preventDefault();
    if (!requireAuth()) return;
    setBusy(true);
    const d = await api<{ amount: number }>("/api/promo", { code });
    setBusy(false);
    if (d.error) return toast(d.error, "error");
    toast(`Coupon claimed! +${fmt(d.amount)} bonus 🎉`, "success");
    setCode("");
    refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-gold/25 via-card to-card p-6">
        <div className="text-xs font-bold uppercase text-gold">Coupon</div>
        <h1 className="text-3xl font-black">🎟️ Promo Code</h1>
        <p className="mt-1 text-sm text-mute">Have a coupon? Enter it below to claim your bonus. Try <b className="text-white">WELCOME50</b> or <b className="text-white">TELEGRAM25</b>.</p>
        <form onSubmit={claim} className="mt-4 flex max-w-md gap-2">
          <input className="input uppercase" placeholder="Enter promo code" value={code} onChange={(e) => setCode(e.target.value)} />
          <button disabled={busy || !code} className="btn-gold shrink-0 rounded-xl px-5">{busy ? "…" : "Claim"}</button>
        </form>
      </div>
      <section id="promotions">
        <h2 className="mb-3 text-lg font-bold">📣 Promotions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PROMOS.map((p) => (
            <Link key={p.title} href={p.href} className={`rounded-2xl bg-gradient-to-br ${p.grad} to-card p-5 ring-1 ring-white/5 hover:ring-gold/40`}>
              <div className="text-4xl">{p.icon}</div>
              <div className="mt-2 text-lg font-black">{p.title}</div>
              <p className="text-sm text-mute">{p.text}</p>
              <span className="mt-3 inline-block text-sm font-bold text-gold">Learn more →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

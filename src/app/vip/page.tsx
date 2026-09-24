"use client";

import { useApp } from "@/components/AppProvider";
import { VIP_LEVELS, fmt, vipFor } from "@/lib/brand";

export default function VipPage() {
  const { user } = useApp();
  const v = vipFor(user?.totalWagered ?? 0);
  return (
    <div>
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#0e7490]/40 via-card to-card p-6">
        <div className="text-xs font-bold uppercase text-gold">VIP Club</div>
        <h1 className="text-3xl font-black">👑 VIP Club</h1>
        <p className="mt-1 max-w-xl text-sm text-mute">Rewards for our most active players: higher cashback, priority support and level-up rewards as you progress from Explorer to Diamond.</p>
      </div>
      {user && (
        <div className="mb-6 rounded-2xl bg-card p-5">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{v.level.icon}</span>
            <div className="flex-1">
              <div className="text-xs text-mute">Your level</div>
              <div className="text-2xl font-black" style={{ color: v.level.color }}>{v.level.name}</div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-bg"><div className="h-full rounded-full bg-gradient-to-r from-gold to-win" style={{ width: `${v.progress}%` }} /></div>
              <div className="mt-1 text-xs text-mute">
                Wagered {fmt(user.totalWagered)}{v.next ? ` · ${fmt(v.next.min - user.totalWagered)} to ${v.next.name}` : " · Max level reached"}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {VIP_LEVELS.map((l, i) => (
          <div key={l.name} className={`rounded-2xl bg-card p-5 ring-1 ${user && v.index === i ? "ring-gold" : "ring-white/5"}`}>
            <div className="flex items-center justify-between">
              <span className="text-4xl">{l.icon}</span>
              {user && v.index === i && <span className="rounded bg-gold px-2 py-0.5 text-[10px] font-black text-black">CURRENT</span>}
            </div>
            <div className="mt-2 text-xl font-black" style={{ color: l.color }}>{l.name}</div>
            <div className="text-xs text-mute">Wager {fmt(l.min)}+</div>
            <ul className="mt-3 space-y-1 text-sm">
              <li>✅ {l.cashback}% weekly cashback</li>
              <li>{i >= 2 ? "✅" : "▫️"} Priority support</li>
              <li>{i >= 3 ? "✅" : "▫️"} Personal account manager</li>
              <li>{i >= 1 ? "✅" : "▫️"} Level-up reward</li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

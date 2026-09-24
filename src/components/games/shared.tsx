"use client";

import { useApp } from "../AppProvider";
import { fmt } from "@/lib/brand";

export function BetInput({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  const n = Number(value) || 0;
  const set = (x: number) => onChange(String(Math.max(1, Math.min(10000, Math.round(x * 100) / 100))));
  return (
    <div>
      <div className="mb-1 text-xs text-mute">Bet amount (Br)</div>
      <div className="flex gap-1">
        <input className="input !py-2 font-bold" inputMode="decimal" value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
        <button type="button" disabled={disabled} onClick={() => set(n / 2)} className="btn-ghost rounded-lg px-3 text-sm">½</button>
        <button type="button" disabled={disabled} onClick={() => set(n * 2)} className="btn-ghost rounded-lg px-3 text-sm">2×</button>
      </div>
      <div className="mt-1.5 grid grid-cols-4 gap-1">
        {[10, 50, 100, 500].map((v) => (
          <button type="button" key={v} disabled={disabled} onClick={() => onChange(String(v))} className="rounded-md bg-white/5 py-1 text-xs font-semibold hover:bg-white/10">{v}</button>
        ))}
      </div>
    </div>
  );
}

export function BalanceLine() {
  const { user, openWallet } = useApp();
  if (!user) return null;
  return (
    <div className="flex items-center justify-between rounded-lg bg-bg px-3 py-2 text-xs">
      <span className="text-mute">Balance</span>
      <span className="font-bold">{fmt(user.balance)} <span className="text-gold">+ {fmt(user.bonusBalance)} bonus</span></span>
      <button onClick={() => openWallet("deposit")} className="font-bold text-gold">+ Deposit</button>
    </div>
  );
}

export function LoginToPlay() {
  const { openAuth } = useApp();
  return (
    <button onClick={() => openAuth("login")} className="btn-gold w-full rounded-xl py-3">Log in to play</button>
  );
}

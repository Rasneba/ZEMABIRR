"use client";

import { useState } from "react";
import { api, useApp } from "./AppProvider";
import { fmt } from "@/lib/brand";

export const PAY_METHODS = [
  { id: "telebirr", name: "telebirr", color: "#0e9fe0", emoji: "📱", hint: "Phone number" },
  { id: "cbebirr", name: "CBE Birr", color: "#7b2a8e", emoji: "🏦", hint: "CBE Birr phone number" },
  { id: "mpesa", name: "M-PESA", color: "#16a34a", emoji: "💸", hint: "M-PESA phone number" },
  { id: "usdt", name: "USDT (TRC20)", color: "#26a17b", emoji: "🪙", hint: "TRC20 wallet address" },
];

export function WalletForm({ mode, onDone }: { mode: "deposit" | "withdraw"; onDone?: () => void }) {
  const { user, refresh, toast } = useApp();
  const [method, setMethod] = useState("telebirr");
  const [amount, setAmount] = useState(mode === "deposit" ? "100" : "");
  const [account, setAccount] = useState(user ? "0" + user.phone.slice(4) : "");
  const [busy, setBusy] = useState(false);
  const m = PAY_METHODS.find((p) => p.id === method)!;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const d = await api<{ bonus?: number; reference?: string }>(`/api/wallet/${mode}`, { method, amount: Number(amount), account });
    setBusy(false);
    if (d.error) return toast(d.error, "error");
    await refresh();
    if (mode === "deposit") {
      toast(`Deposit successful! Ref ${d.reference}${d.bonus ? ` · +${fmt(d.bonus)} welcome bonus 🎉` : ""}`, "success");
    } else {
      toast(`Withdrawal requested · Ref ${d.reference}`, "success");
    }
    onDone?.();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === "deposit" && user && !user.firstDepositDone && (
        <div className="rounded-xl border border-win/30 bg-win/10 p-3 text-sm">
          🎁 First deposit gets a <b className="text-win">200% bonus</b> (up to Br 10,000)!
        </div>
      )}
      {mode === "withdraw" && user && (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl bg-bg p-3"><div className="text-xs text-mute">Withdrawable</div><div className="font-bold">{fmt(user.balance)}</div></div>
          <div className="rounded-xl bg-bg p-3"><div className="text-xs text-mute">Bonus (play only)</div><div className="font-bold text-gold">{fmt(user.bonusBalance)}</div></div>
        </div>
      )}
      <div>
        <div className="mb-2 text-xs text-mute">Payment method</div>
        <div className="grid grid-cols-2 gap-2">
          {PAY_METHODS.map((p) => (
            <button type="button" key={p.id} onClick={() => setMethod(p.id)} className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-bold ${method === p.id ? "border-gold bg-gold/10" : "border-line bg-bg"}`}>
              <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: p.color }}>{p.emoji}</span>
              {p.name}
            </button>
          ))}
        </div>
      </div>
      <label className="block">
        <span className="mb-1 block text-xs text-mute">{m.hint}</span>
        <input className="input" value={account} onChange={(e) => setAccount(e.target.value)} required={mode === "withdraw"} />
      </label>
      <label className="block">
        <span className="mb-1 block text-xs text-mute">Amount (Br) · {mode === "deposit" ? "min 10" : "min 50"}</span>
        <input className="input text-lg font-bold" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </label>
      <div className="grid grid-cols-3 gap-2">
        {(mode === "deposit" ? [50, 100, 200, 500, 1000, 5000] : [50, 100, 500, 1000, 2000, 5000]).map((v) => (
          <button type="button" key={v} onClick={() => setAmount(String(v))} className="btn-ghost rounded-lg py-2 text-sm">{v.toLocaleString()}</button>
        ))}
      </div>
      <button disabled={busy} className={`${mode === "deposit" ? "btn-gold" : "btn-green"} w-full rounded-xl py-3`}>
        {busy ? "Processing…" : mode === "deposit" ? `Deposit Br ${amount || 0}` : `Withdraw Br ${amount || 0}`}
      </button>
      <p className="text-center text-[11px] text-mute">Demo cashier · transactions are simulated and credited instantly.</p>
    </form>
  );
}

export default function WalletModal() {
  const { walletOpen, openWallet, user } = useApp();
  if (!walletOpen || !user) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 sm:items-center" onClick={() => openWallet(null)}>
      <div className="animate-pop max-h-[92svh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-card p-6 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-bg p-1">
            {(["deposit", "withdraw"] as const).map((m) => (
              <button key={m} onClick={() => openWallet(m)} className={`rounded-lg px-4 py-1.5 text-sm font-bold capitalize ${walletOpen === m ? "bg-card2" : "text-mute"}`}>{m}</button>
            ))}
          </div>
          <button onClick={() => openWallet(null)} className="text-2xl text-mute hover:text-white">×</button>
        </div>
        <WalletForm key={walletOpen} mode={walletOpen} onDone={() => openWallet(null)} />
      </div>
    </div>
  );
}

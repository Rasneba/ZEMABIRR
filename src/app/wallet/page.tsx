"use client";

import { useEffect, useState } from "react";
import { api, useApp } from "@/components/AppProvider";
import { WalletForm } from "@/components/WalletModal";
import { fmt } from "@/lib/brand";

type Tx = { id: number; type: string; amount: number; status: string; method: string | null; reference: string | null; note: string | null; createdAt: string };

const ICON: Record<string, string> = { deposit: "⬇️", withdraw: "⬆️", bonus: "🎁", promo: "🎟️", referral: "🤝", spin: "🎡", lootbox: "📦", win: "🏆" };

export default function WalletPage() {
  const { user, openAuth, loading } = useApp();
  const [tab, setTab] = useState<"deposit" | "withdraw" | "history">("deposit");
  const [txs, setTxs] = useState<Tx[]>([]);

  useEffect(() => {
    if (user && tab === "history") api<{ rows: Tx[] }>("/api/history?kind=tx").then((d) => setTxs(d.rows ?? []));
  }, [user, tab]);

  if (loading) return <div className="h-60 animate-pulse rounded-2xl bg-card" />;
  if (!user)
    return (
      <div className="py-16 text-center">
        <div className="text-6xl">👛</div>
        <h1 className="mt-3 text-2xl font-black">My Wallet</h1>
        <p className="text-mute">Log in to deposit, withdraw and view your transactions.</p>
        <button onClick={() => openAuth("login")} className="btn-gold mt-5 rounded-xl px-8 py-3">Log in</button>
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-black">👛 My Wallet</h1>
      <div className="rounded-2xl bg-gradient-to-br from-gold/25 via-card to-card p-5">
        <div className="text-xs text-mute">Total balance</div>
        <div className="text-4xl font-black">{fmt(user.balance + user.bonusBalance)}</div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl bg-black/20 p-3"><div className="text-xs text-mute">Real (withdrawable)</div><b>{fmt(user.balance)}</b></div>
          <div className="rounded-xl bg-black/20 p-3"><div className="text-xs text-mute">Bonus balance</div><b className="text-gold">{fmt(user.bonusBalance)}</b></div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-card p-1">
        {(["deposit", "withdraw", "history"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-lg py-2 text-sm font-bold capitalize ${tab === t ? "bg-card2" : "text-mute"}`}>{t}</button>
        ))}
      </div>
      <div className="rounded-2xl bg-card p-5">
        {tab === "history" ? (
          txs.length === 0 ? <p className="py-8 text-center text-mute">No transactions yet.</p> : (
            <div className="divide-y divide-line/40">
              {txs.map((t) => (
                <div key={t.id} className="flex items-center gap-3 py-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bg text-lg">{ICON[t.type] ?? "💳"}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold capitalize">{t.type}{t.method ? ` · ${t.method}` : ""}</div>
                    <div className="truncate text-xs text-mute">{new Date(t.createdAt).toLocaleString()}{t.reference ? ` · ${t.reference}` : ""}{t.note ? ` · ${t.note}` : ""}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${t.amount >= 0 ? "text-win" : "text-white"}`}>{t.amount >= 0 ? "+" : ""}{fmt(t.amount)}</div>
                    <div className={`text-[10px] font-bold uppercase ${t.status === "completed" ? "text-mute" : "text-gold"}`}>{t.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <WalletForm key={tab} mode={tab} onDone={() => setTab("history")} />
        )}
      </div>
    </div>
  );
}

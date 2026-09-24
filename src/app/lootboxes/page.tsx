"use client";

import { useState } from "react";
import { api, useApp } from "@/components/AppProvider";
import { LOOTBOXES } from "@/lib/games";
import { fmt } from "@/lib/brand";

export default function LootboxesPage() {
  const { requireAuth, toast, refresh } = useApp();
  const [opening, setOpening] = useState<string | null>(null);
  const [reveal, setReveal] = useState<{ box: string; prize: number } | null>(null);

  async function open(id: string) {
    if (!requireAuth()) return;
    setOpening(id);
    setReveal(null);
    const d = await api<{ prize: number }>("/api/lootbox", { box: id });
    if (d.error) {
      setOpening(null);
      return toast(d.error, "error");
    }
    setTimeout(() => {
      setOpening(null);
      setReveal({ box: id, prize: d.prize });
      refresh();
    }, 1600);
  }

  const revealBox = LOOTBOXES.find((b) => b.id === reveal?.box);

  return (
    <div>
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#b45309]/40 via-card to-card p-6">
        <div className="text-xs font-bold uppercase text-gold">Shamo Giveaway</div>
        <h1 className="text-3xl font-black">🎁 Lootboxes</h1>
        <p className="mt-1 text-sm text-mute">Open mystery boxes and win ETB instantly. Every box has a chance at a massive jackpot!</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {LOOTBOXES.map((b) => (
          <div key={b.id} className="relative overflow-hidden rounded-2xl bg-card p-5 text-center ring-1 ring-white/5" style={{ boxShadow: `inset 0 -80px 80px -60px ${b.color}55` }}>
            <div className={`text-7xl ${opening === b.id ? "animate-shake" : "animate-floaty"}`}>{b.emoji}</div>
            <h3 className="mt-3 text-lg font-black" style={{ color: b.color }}>{b.name}</h3>
            <p className="text-xs text-mute">Win up to {fmt(Math.max(...b.prizes))}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-1">
              {b.prizes.filter((p) => p > 0).map((p) => <span key={p} className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-mute">{p}</span>)}
            </div>
            <button onClick={() => open(b.id)} disabled={opening !== null} className="btn-gold mt-4 w-full rounded-xl py-3">
              {opening === b.id ? "Opening…" : `Open for ${fmt(b.price)}`}
            </button>
          </div>
        ))}
      </div>

      {reveal && revealBox && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" onClick={() => setReveal(null)}>
          <div className="animate-pop w-full max-w-sm rounded-2xl bg-card p-8 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="text-7xl">{reveal.prize > 0 ? "🎉" : "😢"}</div>
            <div className="mt-3 text-sm text-mute">{revealBox.name}</div>
            <div className={`mt-1 text-4xl font-black ${reveal.prize > 0 ? "text-shimmer" : "text-mute"}`}>{reveal.prize > 0 ? fmt(reveal.prize) : "Empty box"}</div>
            <p className="mt-2 text-sm text-mute">{reveal.prize > 0 ? "Credited to your wallet!" : "Better luck next time."}</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button onClick={() => setReveal(null)} className="btn-ghost rounded-xl py-3">Close</button>
              <button onClick={() => open(revealBox.id)} className="btn-gold rounded-xl py-3">Open again</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { api, useApp } from "../AppProvider";
import { BalanceLine, BetInput, LoginToPlay } from "./shared";
import { KENO_NUMBERS, KENO_PAYTABLE, type Game } from "@/lib/games";
import { fmt } from "@/lib/brand";

export default function Keno({ game }: { game: Game }) {
  const { user, toast, refresh, setBalances } = useApp();
  const [bet, setBet] = useState("10");
  const [picks, setPicks] = useState<number[]>([]);
  const [drawn, setDrawn] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ hits: number; payout: number; multiplier: number } | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  function toggle(n: number) {
    if (busy) return;
    setDrawn([]);
    setResult(null);
    setPicks((p) => (p.includes(n) ? p.filter((x) => x !== n) : p.length >= 10 ? p : [...p, n]));
  }

  function autoPick() {
    const pool = Array.from({ length: KENO_NUMBERS }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    setPicks(pool.slice(0, 10));
    setDrawn([]);
    setResult(null);
  }

  async function play() {
    if (picks.length === 0) return toast("Pick at least 1 number", "error");
    setBusy(true);
    setDrawn([]);
    setResult(null);
    const before = user ? { b: user.balance, bb: user.bonusBalance } : null;
    const d = await api<{ drawn: number[]; hits: number; multiplier: number; payout: number }>("/api/games/instant", { game: game.slug, picks, bet: Number(bet) });
    if (d.error) {
      setBusy(false);
      return toast(d.error, "error");
    }
    if (before) setBalances(Math.max(0, before.b - Number(bet)), before.b >= Number(bet) ? before.bb : before.bb - (Number(bet) - before.b));
    timers.current.forEach(clearTimeout);
    const speed = game.kenoSpeed ?? 150;
    d.drawn.forEach((n, i) => {
      timers.current.push(setTimeout(() => setDrawn((x) => [...x, n]), (i + 1) * speed));
    });
    timers.current.push(
      setTimeout(() => {
        setResult({ hits: d.hits, payout: d.payout, multiplier: d.multiplier });
        setBusy(false);
        if (d.payout > 0) toast(`${d.hits} hits · +${fmt(d.payout)}`, "success");
        refresh();
      }, (d.drawn.length + 1) * speed)
    );
  }

  const table = KENO_PAYTABLE[picks.length] ?? [];
  const hitsNow = picks.filter((p) => drawn.includes(p)).length;

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl bg-gradient-to-b from-[#2a1a45] to-[#161026] p-3 ring-1 ring-white/5 sm:p-5">
        <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
          {Array.from({ length: KENO_NUMBERS }, (_, i) => i + 1).map((n) => {
            const p = picks.includes(n);
            const d = drawn.includes(n);
            return (
              <button
                key={n}
                onClick={() => toggle(n)}
                className={`aspect-square rounded-lg text-sm font-black transition sm:text-base ${
                  p && d ? "bg-gradient-to-b from-[#34d876] to-[#16a34a] text-white animate-pop" : d ? "bg-[#4c1d95] text-white/90 ring-2 ring-fuchsia-400/70 animate-pop" : p ? "bg-gradient-to-b from-[#ffcf4a] to-[#e5b224] text-black" : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {p && d ? "💎" : n}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex gap-1 overflow-x-auto no-scrollbar">
          {table.map((m, hits) => (
            <div key={hits} className={`min-w-14 flex-1 rounded-lg px-2 py-1.5 text-center text-xs ${result && result.hits === hits ? "bg-win text-black" : drawn.length && hitsNow === hits ? "bg-white/20" : "bg-black/30"}`}>
              <div className="font-bold">{m}x</div>
              <div className="text-[10px] opacity-70">{hits} hits</div>
            </div>
          ))}
          {table.length === 0 && <div className="w-full py-2 text-center text-sm text-mute">Pick 1–10 numbers to see payouts</div>}
        </div>
        {result && (
          <div className={`mt-3 rounded-xl px-4 py-2 text-center font-bold ${result.payout > 0 ? "bg-win/20 text-win" : "bg-white/5 text-mute"}`}>
            {result.payout > 0 ? `${result.hits} hits · ${result.multiplier}x · You won ${fmt(result.payout)}` : `${result.hits} hits · No win this time`}
          </div>
        )}
      </div>
      <div className="space-y-3 rounded-2xl bg-card p-4">
        <BetInput value={bet} onChange={setBet} disabled={busy} />
        <div className="grid grid-cols-2 gap-2">
          <button onClick={autoPick} disabled={busy} className="btn-ghost rounded-lg py-2 text-sm">🎲 Auto pick</button>
          <button onClick={() => { setPicks([]); setDrawn([]); setResult(null); }} disabled={busy} className="btn-ghost rounded-lg py-2 text-sm">Clear</button>
        </div>
        <div className="text-center text-xs text-mute">{picks.length}/10 numbers selected</div>
        {!user ? <LoginToPlay /> : (
          <button onClick={play} disabled={busy || picks.length === 0} className="btn-gold w-full rounded-xl py-4 text-lg">{busy ? "Drawing…" : `Play ${fmt(Number(bet) || 0)}`}</button>
        )}
        <BalanceLine />
        <p className="text-xs text-mute">Pick up to 10 numbers from 1–{KENO_NUMBERS}. 10 balls are drawn — the more you match, the more you win.</p>
      </div>
    </div>
  );
}

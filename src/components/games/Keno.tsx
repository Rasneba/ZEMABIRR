"use client";

import { useRef, useState } from "react";
import { api, useApp } from "../AppProvider";
import { BalanceLine, BetInput, LoginToPlay } from "./shared";
import { KENO_DRAW, KENO_NUMBERS, KENO_PAYTABLE, type Game } from "@/lib/games";
import { fmt } from "@/lib/brand";

export default function Keno({ game }: { game: Game }) {
  const { user, toast, refresh, setBalances } = useApp();
  const [bet, setBet] = useState("10");
  const [picks, setPicks] = useState<number[]>([]);
  const [drawn, setDrawn] = useState<number[]>([]);
  const [lastDrawn, setLastDrawn] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ hits: number; payout: number; multiplier: number } | null>(null);
  const [speed, setSpeed] = useState<number>(() => {
    if (typeof window === "undefined") return 140;
    const saved = Number(window.localStorage.getItem("zk_keno_ms"));
    return Number.isFinite(saved) && saved > 0 ? saved : 140;
  });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const changeSpeed = (v: number) => {
    setSpeed(v);
    localStorage.setItem("zk_keno_ms", String(v));
  };

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
    if (Number(bet) <= 0) return toast("Enter a valid bet", "error");
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
    d.drawn.forEach((n, i) => {
      timers.current.push(setTimeout(() => setDrawn((x) => [...x, n]), (i + 1) * speed));
    });
    timers.current.push(
      setTimeout(() => {
        setResult({ hits: d.hits, payout: d.payout, multiplier: d.multiplier });
        setLastDrawn((x) => [...d.drawn, ...x].slice(0, 20));
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
        {lastDrawn.length > 0 && (
          <div className="mb-3">
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-white/50">⌛ Last numbers drawn</div>
            <div className="flex flex-wrap gap-1">
              {lastDrawn.map((n, i) => (
                <span key={i} className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-b from-[#ffcf4a] to-[#e5b224] text-[11px] font-black text-black">{n}</span>
              ))}
            </div>
          </div>
        )}
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
        <div className="grid grid-cols-5 gap-1.5">
          {[10, 50, 100, 500, 1000].map((v) => (
            <button key={v} type="button" onClick={() => setBet(String(v))} disabled={busy} className="btn-ghost rounded-lg py-2 text-sm">{v.toLocaleString()}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-bg p-1.5">
          <span className="pl-1 text-xs text-mute">Draw speed</span>
          {[{ l: "Slow", v: 300 }, { l: "Normal", v: 140 }, { l: "Fast", v: 60 }].map((s) => (
            <button key={s.l} type="button" onClick={() => changeSpeed(s.v)} className={`flex-1 rounded-lg py-1.5 text-xs font-bold ${speed === s.v ? "bg-card2" : "text-mute"}`}>{s.l}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={autoPick} disabled={busy} className="btn-ghost rounded-lg py-2 text-sm">🎲 Auto pick</button>
          <button onClick={() => { setPicks([]); setDrawn([]); setResult(null); }} disabled={busy} className="btn-ghost rounded-lg py-2 text-sm">Clear</button>
        </div>
        <div className="text-center text-xs text-mute">{picks.length}/10 numbers selected</div>
        {!user ? <LoginToPlay /> : (
          <button onClick={play} disabled={busy || picks.length === 0} className="btn-gold w-full rounded-xl py-4 text-lg">{busy ? "Drawing…" : `Play ${fmt(Number(bet) || 0)}`}</button>
        )}
        <BalanceLine />
        <p className="text-xs text-mute">Pick up to 10 numbers from 1–{KENO_NUMBERS}. {KENO_DRAW} balls are drawn — the more you match, the more you win.</p>
      </div>
    </div>
  );
}

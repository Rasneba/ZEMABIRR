"use client";

import { useState } from "react";
import { api, useApp } from "../AppProvider";
import { BalanceLine, LoginToPlay } from "./shared";
import { ROULETTE_RED, ROULETTE_WHEEL, type Game } from "@/lib/games";
import { fmt } from "@/lib/brand";

const colorOf = (n: number) => (n === 0 ? "#16a34a" : ROULETTE_RED.includes(n) ? "#dc2626" : "#1f2937");
const SEG = 360 / ROULETTE_WHEEL.length;

function Chip({ k, bets }: { k: string; bets: Record<string, number> }) {
  return bets[k] ? <span className="absolute -top-1.5 -right-1.5 z-10 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-dashed border-white bg-gold px-1 text-[10px] font-black text-black">{bets[k]}</span> : null;
}

export default function Roulette({ game }: { game: Game }) {
  const { user, toast, refresh, setBalances } = useApp();
  const [chip, setChip] = useState(10);
  const [bets, setBets] = useState<Record<string, number>>({});
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [last, setLast] = useState<number[]>([]);
  const [result, setResult] = useState<{ n: number; payout: number } | null>(null);
  const total = Object.values(bets).reduce((a, b) => a + b, 0);

  const add = (k: string) => !spinning && setBets((b) => ({ ...b, [k]: (b[k] ?? 0) + chip }));

  async function spin() {
    if (total <= 0) return toast("Place at least one chip", "error");
    setSpinning(true);
    setResult(null);
    const d = await api<{ result: number; payout: number }>("/api/games/instant", { game: game.slug, bets });
    if (d.error) {
      setSpinning(false);
      return toast(d.error, "error");
    }
    if (user) setBalances(Math.max(0, user.balance - total));
    const idx = ROULETTE_WHEEL.indexOf(d.result);
    const target = 360 - (idx * SEG + SEG / 2);
    setRotation((r) => r - (r % 360) + 360 * 5 + target);
    setTimeout(() => {
      setSpinning(false);
      setResult({ n: d.result, payout: d.payout });
      setLast((l) => [d.result, ...l].slice(0, 12));
      if (d.payout > 0) toast(`${d.result} · +${fmt(d.payout)}`, "success");
      refresh();
    }, 4200);
  }

  const gradient = `conic-gradient(${ROULETTE_WHEEL.map((n, i) => `${colorOf(n)} ${i * SEG}deg ${(i + 1) * SEG}deg`).join(",")})`;

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl bg-gradient-to-b from-[#0d3b24] to-[#0a2418] p-4 ring-1 ring-white/5">
        <div className="relative mx-auto aspect-square w-60 sm:w-72">
          <div className="absolute top-[-6px] left-1/2 z-10 -translate-x-1/2 text-2xl text-gold drop-shadow">▼</div>
          <div className="absolute inset-0 rounded-full border-8 border-[#8b5e1a] shadow-2xl" style={{ background: gradient, transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 4s cubic-bezier(0.15,0.8,0.25,1)" : "none" }}>
            {ROULETTE_WHEEL.map((n, i) => (
              <div key={n} className="absolute inset-0 flex justify-center pt-2 text-sm font-black text-white" style={{ transform: `rotate(${i * SEG + SEG / 2}deg)` }}>{n}</div>
            ))}
          </div>
          <div className="absolute inset-[30%] flex items-center justify-center rounded-full bg-gradient-to-b from-[#c8962e] to-[#7a5412] shadow-inner">
            <span className="text-2xl font-black">{result ? result.n : "?"}</span>
          </div>
        </div>
        <div className="mt-3 flex justify-center gap-1">
          {last.map((n, i) => <span key={i} className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: colorOf(n) }}>{n}</span>)}
        </div>

        <div className="mx-auto mt-4 max-w-lg">
          <div className="grid grid-cols-7 gap-1">
            <button onClick={() => add("n0")} className="relative row-span-2 rounded-lg bg-[#16a34a] py-3 font-black"><Chip k="n0" bets={bets} />0</button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
              <button key={n} onClick={() => add(`n${n}`)} className="relative rounded-lg py-3 font-black ring-1 ring-white/10 hover:brightness-125" style={{ background: colorOf(n) }}><Chip k={`n${n}`} bets={bets} />{n}</button>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-3 gap-1 sm:grid-cols-6">
            {[
              { k: "low", l: "1–6" }, { k: "even", l: "Even" }, { k: "red", l: "Red", c: "#dc2626" },
              { k: "black", l: "Black", c: "#1f2937" }, { k: "odd", l: "Odd" }, { k: "high", l: "7–12" },
            ].map((b) => (
              <button key={b.k} onClick={() => add(b.k)} className="relative rounded-lg bg-white/10 py-2.5 text-sm font-bold ring-1 ring-white/10 hover:bg-white/20" style={b.c ? { background: b.c } : undefined}><Chip k={b.k} bets={bets} />{b.l}</button>
            ))}
          </div>
        </div>
        {result && (
          <div className={`mx-auto mt-3 max-w-lg rounded-xl px-4 py-2 text-center font-bold ${result.payout > 0 ? "bg-win/20 text-win" : "bg-white/5 text-mute"}`}>
            {result.payout > 0 ? `Number ${result.n} · You won ${fmt(result.payout)}` : `Number ${result.n} · No win`}
          </div>
        )}
      </div>
      <div className="space-y-3 rounded-2xl bg-card p-4">
        <div>
          <div className="mb-1 text-xs text-mute">Chip value</div>
          <div className="grid grid-cols-5 gap-1">
            {[1, 5, 10, 50, 100].map((c) => (
              <button key={c} onClick={() => setChip(c)} className={`aspect-square rounded-full border-2 border-dashed text-xs font-black ${chip === c ? "border-white bg-gold text-black" : "border-white/30 bg-white/5"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-bg px-3 py-2 text-sm"><span className="text-mute">Total bet</span><b>{fmt(total)}</b></div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setBets({})} disabled={spinning} className="btn-ghost rounded-lg py-2 text-sm">Clear</button>
          <button onClick={() => setBets((b) => Object.fromEntries(Object.entries(b).map(([k, v]) => [k, v * 2])))} disabled={spinning} className="btn-ghost rounded-lg py-2 text-sm">Double</button>
        </div>
        {!user ? <LoginToPlay /> : (
          <button onClick={spin} disabled={spinning || total === 0} className="btn-gold w-full rounded-xl py-4 text-lg">{spinning ? "Spinning…" : "Spin"}</button>
        )}
        <BalanceLine />
        <p className="text-xs text-mute">Straight numbers pay 12×. Red/Black, Odd/Even and 1–6/7–12 pay 2×. Zero loses all outside bets.</p>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import { api, useApp } from "../AppProvider";
import { BalanceLine, BetInput, LoginToPlay } from "./shared";
import { KENO_DRAW, KENO_MAX_PICKS, KENO_NUMBERS, kenoMultiplier } from "@/lib/keno";
import { fmt } from "@/lib/brand";
import type { Game } from "@/lib/games";

type Result = { drawn: number[]; hits: number; multiplier: number; payout: number };

export default function Keno({ game }: { game: Game }) {
  const { user, toast, refresh } = useApp();
  const [numbers, setNumbers] = useState<number[]>([]);
  const [bet, setBet] = useState("10");
  const [busy, setBusy] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const toggle = (n: number) => {
    if (busy) return;
    setNumbers((p) => {
      if (p.includes(n)) return p.filter((x) => x !== n);
      if (p.length >= KENO_MAX_PICKS) return p;
      return [...p, n].sort((a, b) => a - b);
    });
  };

  async function play() {
    if (busy) return;
    if (numbers.length === 0) return toast("Pick at least 1 number", "error");
    setBusy(true);
    setResult(null);
    setRevealed(0);
    const d = await api<Result & { error?: string }>("/api/games/keno", {
      game: game.slug,
      numbers,
      bet: Number(bet),
    });
    if (d.error) {
      setBusy(false);
      return toast(d.error, "error");
    }
    setResult(d);
    let i = 0;
    timer.current = setInterval(() => {
      i += 1;
      setRevealed(i);
      if (i >= KENO_DRAW) {
        if (timer.current) clearInterval(timer.current);
        refresh();
        if (d.payout > 0) toast(`${game.name}: ${d.hits} hit${d.hits === 1 ? "" : "s"} · +${fmt(d.payout)}`, "success");
        else toast(`${game.name}: ${d.hits} hit${d.hits === 1 ? "" : "s"} — no win`, "info");
        setBusy(false);
      }
    }, 500);
  }

  const drawn = result?.drawn ?? [];
  const pickedSet = new Set(numbers);

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_340px]">
      <div className="rounded-2xl bg-gradient-to-b from-[#0b2f22] to-[#060d08] p-4 ring-1 ring-white/5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-mute">Pick up to {KENO_MAX_PICKS} numbers · {KENO_DRAW} drawn</span>
          <span className="font-bold">{numbers.length}/{KENO_MAX_PICKS} selected</span>
        </div>
        <div className="grid grid-cols-10 gap-1.5">
          {Array.from({ length: KENO_NUMBERS }, (_, i) => i + 1).map((n) => {
            const isPicked = pickedSet.has(n);
            const isDrawn = revealed > 0 && drawn.slice(0, revealed).includes(n);
            const isHit = isPicked && isDrawn;
            let cls = "bg-white/5 text-white/80 hover:bg-white/10";
            if (isHit) cls = "k-ball-in bg-[#22c55e] text-black ring-2 ring-white/60";
            else if (isPicked) cls = "bg-gold text-black font-bold";
            else if (isDrawn) cls = "k-ball-drop bg-red-500 text-white";
            return (
              <button
                key={n}
                type="button"
                disabled={busy}
                onClick={() => toggle(n)}
                className={`relative aspect-square rounded-lg text-[11px] font-bold transition-all ${cls} disabled:cursor-default`}
              >
                {n}
                {isHit && revealed === drawn.indexOf(n) + 1 && <span className="absolute inset-0 animate-ping rounded-lg bg-[#22c55e]/50" />}
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl bg-black/25 p-3 text-center">
          {!result ? (
            <p className="text-sm text-mute">Draw 20 balls — match your picks to win up to 10,000×.</p>
          ) : revealed < KENO_DRAW ? (
            <p className="animate-pulse text-sm font-bold text-[#22c55e]">Revealing {revealed}/{KENO_DRAW}…</p>
          ) : (
            <div>
              <div className="text-3xl font-black">
                <span className={result.payout > 0 ? "text-[#22c55e]" : "text-red-400"}>{result.hits}</span>
                <span className="text-white/40"> / {numbers.length} hits</span>
              </div>
              <div className="mt-1 text-sm font-bold">
                {result.payout > 0 ? (
                  <span className="text-win">{result.multiplier.toFixed(2)}× · +{fmt(result.payout)}</span>
                ) : (
                  <span className="text-red-300">No win this round</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-mute">
          <span>Payout up to {(kenoMultiplier(10, 10)).toLocaleString()}×</span>
          <span className="font-bold text-[#22c55e]">RTP 96.5%</span>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl bg-card p-4">
        <BetInput value={bet} onChange={setBet} disabled={busy} />
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-bg p-2"><div className="text-mute">Picked</div><div className="text-base font-bold">{numbers.length}</div></div>
          <div className="rounded-lg bg-bg p-2"><div className="text-mute">Draw</div><div className="text-base font-bold">{KENO_DRAW}</div></div>
          <div className="rounded-lg bg-bg p-2"><div className="text-mute">Max pay</div><div className="text-base font-bold text-[#22c55e]">{kenoMultiplier(10, 10)}x</div></div>
        </div>
        {!user ? <LoginToPlay /> : (
          <button onClick={play} disabled={busy} className="btn-gold w-full rounded-xl py-4 text-lg" style={busy ? undefined : { background: game.accent, color: "#000" }}>
            {busy ? "Drawing…" : `Play ${fmt(Number(bet) || 0)}`}
          </button>
        )}
        <BalanceLine />
        <p className="text-xs text-mute">Pick 1–10 numbers from 1–80. {KENO_DRAW} balls are drawn and matching numbers pay per the classic keno table.</p>
      </div>
    </div>
  );
}
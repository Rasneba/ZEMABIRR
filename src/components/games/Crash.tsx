"use client";

import { useEffect, useRef, useState } from "react";
import { api, useApp } from "../AppProvider";
import { BalanceLine, BetInput, LoginToPlay } from "./shared";
import { crashMultiplierAt, type Game } from "@/lib/games";
import { fmt } from "@/lib/brand";

type Phase = "idle" | "waiting" | "flying" | "crashed" | "cashed";

export default function Crash({ game }: { game: Game }) {
  const { user, refresh, toast, setBalances } = useApp();
  const [bet, setBet] = useState("10");
  const [auto, setAuto] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [mult, setMult] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<{ m: number; win?: number } | null>(null);
  const [recent, setRecent] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const roundRef = useRef<number | null>(null);
  const startAt = useRef(0);
  const phaseRef = useRef<Phase>("idle");

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const p = phaseRef.current;
      if (p === "waiting" || p === "flying") {
        const e = performance.now() - startAt.current;
        if (e >= 0 && p === "waiting") setPhase("flying");
        setElapsed(Math.max(0, e));
        setMult(crashMultiplierAt(e));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (phase !== "flying" && phase !== "waiting") return;
    const t = setInterval(async () => {
      if (!roundRef.current) return;
      const d = await api<{ status: string; crashPoint?: number; multiplier?: number; payout?: number }>("/api/games/crash", { action: "status", game: game.slug, roundId: roundRef.current });
      if (phaseRef.current !== "flying" && phaseRef.current !== "waiting") return;
      if (d.status === "crashed") {
        setPhase("crashed");
        setMult(d.crashPoint!);
        setResult({ m: d.crashPoint! });
        setRecent((r) => [d.crashPoint!, ...r].slice(0, 15));
        refresh();
      } else if (d.status === "won") {
        setPhase("cashed");
        setResult({ m: d.multiplier!, win: d.payout });
        toast(`Auto cash-out at ${d.multiplier!.toFixed(2)}x · +${fmt(d.payout ?? 0)}`, "success");
        refresh();
      }
    }, 250);
    return () => clearInterval(t);
  }, [phase, game.slug, refresh, toast]);

  async function start() {
    setBusy(true);
    const d = await api<{ roundId: number; startsIn: number; balance: number; bonusBalance: number }>("/api/games/crash", { action: "start", game: game.slug, bet: Number(bet), auto: auto ? Number(auto) : null });
    setBusy(false);
    if (d.error) return toast(d.error, "error");
    setBalances(d.balance, d.bonusBalance);
    roundRef.current = d.roundId;
    startAt.current = performance.now() + d.startsIn;
    setResult(null);
    setMult(1);
    setElapsed(0);
    setPhase("waiting");
  }

  async function cashout() {
    if (!roundRef.current) return;
    setBusy(true);
    const d = await api<{ status: string; multiplier?: number; payout?: number; crashPoint?: number }>("/api/games/crash", { action: "cashout", game: game.slug, roundId: roundRef.current });
    setBusy(false);
    if (d.status === "won") {
      setPhase("cashed");
      setResult({ m: d.multiplier!, win: d.payout });
      toast(`Cashed out at ${d.multiplier!.toFixed(2)}x · +${fmt(d.payout ?? 0)}`, "success");
      refresh();
    } else if (d.status === "crashed") {
      setPhase("crashed");
      setMult(d.crashPoint!);
      setResult({ m: d.crashPoint! });
      setRecent((r) => [d.crashPoint!, ...r].slice(0, 15));
      refresh();
    }
  }

  // Chart geometry
  const W = 600, H = 320;
  const secs = elapsed / 1000;
  const xMax = Math.max(8, secs * 1.15);
  const yMax = Math.max(2, mult * 1.25);
  const pts: string[] = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = (secs * i) / steps;
    const m = Math.exp(0.1 * t);
    pts.push(`${(t / xMax) * W},${H - ((m - 1) / (yMax - 1)) * H}`);
  }
  const tipX = (secs / xMax) * W;
  const tipY = H - ((Math.exp(0.1 * secs) - 1) / (yMax - 1)) * H;
  const flying = phase === "flying";
  const color = phase === "crashed" ? "#ef4444" : game.accent;
  const potential = (Number(bet) || 0) * mult;

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
      <div className="overflow-hidden rounded-2xl bg-[#0f1216] ring-1 ring-white/5">
        <div className="flex gap-1.5 overflow-x-auto border-b border-white/5 p-2 no-scrollbar">
          {recent.length === 0 && <span className="px-2 text-xs text-mute">Round history will appear here</span>}
          {recent.map((r, i) => (
            <span key={i} className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${r >= 10 ? "bg-fuchsia-500/20 text-fuchsia-300" : r >= 2 ? "bg-violet-500/20 text-violet-300" : "bg-sky-500/20 text-sky-300"}`}>{r.toFixed(2)}x</span>
          ))}
        </div>
        <div className="relative aspect-[16/9]">
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 20% 100%, ${game.accent}33, transparent 60%)` }} />
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            {[0.25, 0.5, 0.75].map((f) => <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="#ffffff10" />)}
            {(flying || phase === "crashed" || phase === "cashed") && secs > 0 && (
              <>
                <polygon points={`0,${H} ${pts.join(" ")} ${tipX},${H}`} fill={`${color}33`} />
                <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="4" />
              </>
            )}
          </svg>
          {(flying || phase === "cashed") && secs > 0 && (
            <div className="absolute text-4xl transition-none" style={{ left: `${(tipX / W) * 100}%`, top: `${(tipY / H) * 100}%`, transform: "translate(-40%, -70%) rotate(-15deg)" }}>
              {game.crashTheme === "jet" ? "🛩️" : "✈️"}
            </div>
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {phase === "idle" && <div className="text-center"><div className="text-5xl animate-floaty">{game.crashTheme === "jet" ? "🛩️" : "✈️"}</div><div className="mt-2 text-sm text-mute">Place your bet to take off</div></div>}
            {phase === "waiting" && <div className="text-lg font-bold text-mute animate-pulse">Taking off…</div>}
            {(flying || phase === "cashed" || phase === "crashed") && (
              <>
                {phase === "crashed" && <div className="text-lg font-black uppercase text-lose">Flew away!</div>}
                <div className={`text-6xl font-black tabular-nums sm:text-7xl ${phase === "crashed" ? "text-lose" : "text-white"}`}>{mult.toFixed(2)}x</div>
                {phase === "cashed" && result?.win !== undefined && <div className="mt-2 rounded-full bg-win/20 px-4 py-1 text-sm font-bold text-win">You won {fmt(result.win)} at {result.m.toFixed(2)}x</div>}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl bg-card p-4">
        <BetInput value={bet} onChange={setBet} disabled={flying || phase === "waiting"} />
        <div>
          <div className="mb-1 text-xs text-mute">Auto cash-out (optional)</div>
          <input className="input !py-2" placeholder="e.g. 2.00" inputMode="decimal" value={auto} disabled={flying || phase === "waiting"} onChange={(e) => setAuto(e.target.value)} />
        </div>
        {!user ? (
          <LoginToPlay />
        ) : flying || phase === "waiting" ? (
          <button onClick={cashout} disabled={busy || phase === "waiting"} className="btn-green w-full rounded-xl py-4 text-lg">
            {phase === "waiting" ? "Waiting…" : <>Cash out <span className="block text-sm">{fmt(potential)}</span></>}
          </button>
        ) : (
          <button onClick={start} disabled={busy} className="btn-gold w-full rounded-xl py-4 text-lg">Bet {fmt(Number(bet) || 0)}</button>
        )}
        <BalanceLine />
        <p className="text-xs leading-relaxed text-mute">The multiplier rises from 1.00x. Cash out before the plane flies away to win your bet × multiplier. RTP 97%.</p>
      </div>
    </div>
  );
}

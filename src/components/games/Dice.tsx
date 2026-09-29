"use client";

import { useEffect, useRef, useState } from "react";
import { api, useApp } from "../AppProvider";
import { BalanceLine, BetInput, LoginToPlay } from "./shared";
import { DICE_MAX, DICE_MIN, diceMultiplier, type Game } from "@/lib/games";
import { fmt } from "@/lib/brand";

const PIP_LAYOUT: Record<number, number[]> = {
  1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8],
};
const PIP_POS: [string, string][] = [
  ["left-[18%]", "top-[18%]"], ["right-[18%]", "top-[18%]"], ["left-[18%]", "top-[38%]"],
  ["right-[18%]", "top-[38%]"], ["left-[18%]", "bottom-[18%]"], ["right-[18%]", "bottom-[18%]"],
];
function Die({ face, color = "#22d3ee" }: { face: number; color?: string }) {
  const pips = PIP_LAYOUT[Math.min(6, Math.max(1, face))] ?? [];
  return (
    <div className="relative grid h-24 w-24 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20">
      {pips.map((p) => (
        <span key={p} className={`absolute h-4 w-4 rounded-full ${PIP_POS[p] ?? ""}`} style={{ background: color, boxShadow: "0 2px 4px rgba(0,0,0,0.4)" }} />
      ))}
    </div>
  );
}

export default function Dice({ game }: { game: Game }) {
  const { user, toast, refresh } = useApp();
  const [bet, setBet] = useState("10");
  const [mode, setMode] = useState<"over" | "under">("over");
  const [target, setTarget] = useState(50);
  const [busy, setBusy] = useState(false);
  const [roll, setRoll] = useState<number | null>(null);
  const [result, setResult] = useState<{ roll: number; win: boolean; multiplier: number } | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const flicker = useRef<ReturnType<typeof setInterval> | null>(null);
  const done = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (flicker.current) clearInterval(flicker.current);
    if (done.current) clearTimeout(done.current);
  }, []);

  const mult = diceMultiplier(mode, target);
  const winChance = (mode === "under" ? target - 1 : 100 - target) / 100;

  async function doRoll() {
    if (busy) return;
    setBusy(true);
    setResult(null);
    const d = await api<{ roll: number; win: boolean; multiplier: number; payout: number }>("/api/games/dice", { game: game.slug, bet: Number(bet), mode, target });
    if (d.error) {
      setBusy(false);
      return toast(d.error, "error");
    }
    // flicker dice for ~0.55s then reveal
    let f = 0;
    flicker.current = setInterval(() => {
      f += 1;
      setRoll(f);
    }, 80);
    done.current = setTimeout(() => {
      if (flicker.current) clearInterval(flicker.current);
      setRoll(d.roll);
      setResult({ roll: d.roll, win: d.win, multiplier: d.multiplier });
      setHistory((h) => [d.roll, ...h].slice(0, 20));
      setBusy(false);
      if (d.payout > 0) toast(`Rolled ${d.roll} · +${fmt(d.payout)}`, "success");
      refresh();
    }, 560);
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_340px]">
      <div className="rounded-2xl bg-gradient-to-b from-[#0b3b4a] to-[#0a1418] p-4 ring-1 ring-white/5 sm:p-6">
        <div className="flex items-center gap-5">
          <Die face={roll ? (roll % 6 === 0 ? 6 : roll % 6) : 3} />
          <div className="min-w-0 flex-1 text-center">
            <div className="text-xs uppercase text-white/50">Roll range 1–100</div>
            <div className={`text-7xl font-black tabular-nums ${result ? (result.win ? "text-[#22d3ee]" : "text-red-400") : "text-white"}`}>{busy || roll ? roll : "—"}</div>
            <div className="mt-1 h-6 text-sm font-bold">
              {result && <span className={result.win ? "text-win" : "text-red-300"}>{result.win ? `WIN · ${result.multiplier.toFixed(2)}x` : "LOST"}</span>}
            </div>
          </div>
          <Die face={roll ? ((roll * 7) % 6) + 1 : 4} color="#a855f7" />
        </div>

        <div className="mt-5 rounded-xl bg-black/25 p-3">
          <div className="mb-2 flex items-center justify-between text-xs text-mute">
            <span>Win chance</span>
            <span className="font-bold text-white">{(winChance * 100).toFixed(1)}%</span>
          </div>
          <input type="range" min={DICE_MIN} max={DICE_MAX} value={target} disabled={busy} onChange={(e) => setTarget(Number(e.target.value))} className="w-full accent-[#22d3ee]" />
          <div className="mt-1 flex items-center justify-between text-2xl font-black">
            <button type="button" disabled={busy} onClick={() => setTarget((t) => Math.max(DICE_MIN, t - 2))} className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40">−</button>
            <span className={mode === "under" ? "text-sky-400" : "text-cyan-300"}>{mode === "under" ? `Roll under ${target}` : `Roll over ${target}`}</span>
            <button type="button" disabled={busy} onClick={() => setTarget((t) => Math.min(DICE_MAX, t + 2))} className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40">+</button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            <button type="button" disabled={busy} onClick={() => setMode("over")} className={`rounded-lg py-2 text-sm font-bold ${mode === "over" ? "bg-[#22d3ee] text-black" : "bg-white/5 hover:bg-white/10"}`}>Over</button>
            <button type="button" disabled={busy} onClick={() => setMode("under")} className={`rounded-lg py-2 text-sm font-bold ${mode === "under" ? "bg-sky-400 text-black" : "bg-white/5 hover:bg-white/10"}`}>Under</button>
          </div>
        </div>

        <div className="mt-4 flex gap-1.5 overflow-x-auto no-scrollbar">
          {history.length === 0 && <span className="text-xs text-mute">Roll history will appear here</span>}
          {history.map((r, i) => (
            <span key={i} className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${r >= 50 ? "bg-sky-500/20 text-sky-300" : "bg-white/10 text-white/70"}`}>{r}</span>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-2xl bg-card p-4">
        <BetInput value={bet} onChange={setBet} disabled={busy} />
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="rounded-lg bg-bg p-2"><div className="text-mute">Win chance</div><div className="text-base font-bold">{(winChance * 100).toFixed(1)}%</div></div>
          <div className="rounded-lg bg-bg p-2"><div className="text-mute">Pays</div><div className="text-base font-bold text-[#22d3ee]">{mult.toFixed(2)}x</div></div>
        </div>
        {!user ? <LoginToPlay /> : (
          <button onClick={doRoll} disabled={busy} className="btn-gold w-full rounded-xl py-4 text-lg">{busy ? "Rolling…" : `Roll ${fmt(Number(bet) || 0)}`}</button>
        )}
        <BalanceLine />
        <p className="text-xs text-mute">Pick over or under a target number. A 1–100 roll above/below it wins your bet × multiplier (RTP 97%).</p>
      </div>
    </div>
  );
}
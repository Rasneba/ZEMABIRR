"use client";

import { useEffect, useRef, useState } from "react";
import { api, useApp } from "../AppProvider";
import { BalanceLine, BetInput, LoginToPlay } from "./shared";
import { BAC_PAYOUTS, type BacBet } from "@/lib/games";
import { fmt } from "@/lib/brand";
import { loadRgsAssets } from "./rgs";
import type { Game } from "@/lib/games";

type Bets = Record<BacBet, number>;
type Result = {
  player: string[];
  banker: string[];
  playerTotal: number;
  bankerTotal: number;
  winner: BacBet;
  multiplier: number;
  payout: number;
};

const ZERO: Bets = { player: 0, banker: 0, tie: 0 };
const LABELS: Record<BacBet, string> = { player: "PLAYER", banker: "BANKER", tie: "TIE" };
const COLORS: Record<BacBet, string> = { player: "#0ea5e9", banker: "#f43f5e", tie: "#10b981" };
const TEXT: Record<BacBet, string> = { player: "text-sky-300", banker: "text-rose-300", tie: "text-emerald-300" };
const PAYLINE: Record<BacBet, string> = { player: "Pays 1 : 1", banker: "Pays 0.95 : 1", tie: "Pays 8 : 1" };

const RGS_THEME = {
  "--primary-color": "#46FDAB",
  "--background-color": "#22232B",
  "--border-radius-lg": "16px",
} as React.CSSProperties;

function BacCard({ card, face }: { card?: string; face?: boolean }) {
  if (face || !card) {
    return <div className="grid h-24 w-[4.2rem] place-items-center rounded-lg border-2 border-white/25 bg-emerald-950/40 text-2xl text-white/25">?</div>;
  }
  const rank = card.slice(0, -1);
  const suit = card.slice(-1);
  const red = suit === "♥" || suit === "♦";
  return (
    <div className="grid h-24 w-[4.2rem] flip-in place-items-center rounded-lg bg-white shadow-xl ring-1 ring-black/30">
      <div className="text-center leading-none">
        <div className={`text-3xl font-black ${red ? "text-red-600" : "text-zinc-900"}`}>{rank}</div>
        <div className="mt-0.5 text-3xl text-red-600">{suit}</div>
      </div>
    </div>
  );
}

export default function Baccarat({ game }: { game: Game }) {
  const { user, toast, refresh } = useApp();
  const [bet, setBet] = useState("10");
  const [bets, setBets] = useState<Bets>(ZERO);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState<("p" | "b")[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    void loadRgsAssets();
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const chip = Number(bet) || 0;
  const total = Math.round((bets.player + bets.banker + bets.tie) * 100) / 100;
  const addBet = (side: BacBet) => {
    if (busy || chip <= 0) return;
    setBets((b) => ({ ...b, [side]: Math.round((b[side] + chip) * 100) / 100 }));
  };

  async function deal() {
    if (busy) return;
    if (total <= 0) return toast("Place a bet on Player, Banker or Tie", "error");
    setBusy(true);
    setResult(null);
    setStep(0);
    const d = await api<Result & { error?: string }>("/api/games/baccarat", {
      game: game.slug,
      bets,
    });
    if (d.error) {
      setBusy(false);
      return toast(d.error, "error");
    }
    setResult(d);
    const ord: ("p" | "b")[] = ["p", "p", "b", "b"];
    if (d.player.length === 3) ord.push("p");
    if (d.banker.length === 3) ord.push("b");
    setOrder(ord);
    let i = 0;
    timer.current = setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= ord.length) {
        if (timer.current) clearInterval(timer.current);
        refresh();
        if (d.payout > 0) toast(`${game.name}: ${LABELS[d.winner]} wins · +${fmt(d.payout)}`, "success");
        else toast(`${game.name}: ${LABELS[d.winner]}`, d.winner === "tie" ? "info" : "error");
        setBusy(false);
      }
    }, 650);
  }

  const pVisible = order.slice(0, Math.min(step, order.length)).filter((x) => x === "p").length;
  const bVisible = order.slice(0, Math.min(step, order.length)).filter((x) => x === "b").length;
  const showP = result ? result.player.slice(0, pVisible) : [];
  const showB = result ? result.banker.slice(0, bVisible) : [];
  const done = result !== null && step >= order.length && step > 0;

  return (
    <div style={RGS_THEME}>
      <div className="grid gap-3">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-300/20 bg-gradient-to-br from-emerald-900/70 via-emerald-950 to-black p-4 sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_15%,rgba(70,253,171,0.14),transparent_60%)]" />
          <div className="relative">
            <div className="mb-4 flex items-center justify-between text-xs">
              <span className="font-black uppercase tracking-widest text-white/80">Live Baccarat · 8 decks</span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 font-bold tabular-nums text-white/80">Bet {fmt(total)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div className="rounded-xl bg-emerald-950/50 p-3 ring-1 ring-white/10">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-black text-sky-300">PLAYER {bets.player > 0 && <span className="text-xs text-white/50">· {fmt(bets.player)}</span>}</span>
                  <span className="rounded bg-black/40 px-2 py-0.5 text-sm font-black tabular-nums text-white">{showP.length > 0 ? result?.playerTotal : "·"}</span>
                </div>
                <div className="flex min-h-24 gap-1.5 sm:gap-2">
                  <BacCard face={step < 1} card={showP[0]} />
                  <BacCard face={step < 2} card={showP[1]} />
                  {result?.player.length === 3 && <BacCard face={step < 4} card={showP[2]} />}
                </div>
              </div>
              <div className="rounded-xl bg-emerald-950/50 p-3 ring-1 ring-white/10">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-black text-rose-300">BANKER {bets.banker > 0 && <span className="text-xs text-white/50">· {fmt(bets.banker)}</span>}</span>
                  <span className="rounded bg-black/40 px-2 py-0.5 text-sm font-black tabular-nums text-white">{showB.length > 0 ? result?.bankerTotal : "·"}</span>
                </div>
                <div className="flex min-h-24 gap-1.5 sm:gap-2">
                  <BacCard face={step < 3} card={showB[0]} />
                  <BacCard face={step < 4} card={showB[1]} />
                  {result?.banker.length === 3 && <BacCard face={step < 5} card={showB[2]} />}
                </div>
              </div>
            </div>

            <div className="mt-4 grid min-h-[3.5rem] place-items-center rounded-lg bg-black/40 px-3 text-center ring-1 ring-white/10">
              {!result ? (
                <span className="text-sm text-white/50">Naturals stand · standard third-card rules</span>
              ) : done ? (
                <div>
                  <span className={`text-xl font-black ${result.payout > 0 ? "text-[#46FDAB]" : result.winner === "tie" ? "text-emerald-300" : "text-rose-300"}`}>
                    {LABELS[result.winner]} {result.payout > 0 && `· +${fmt(result.payout)}`}
                  </span>
                  <div className="text-xs text-white/50">{result.multiplier.toFixed(2)}x multiplier</div>
                </div>
              ) : (
                <span className="animate-pulse text-sm font-bold text-[#46FDAB]">Dealing…</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_340px]">
          <div className="space-y-3 rounded-2xl bg-card p-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(["player", "banker", "tie"] as BacBet[]).map((side) => (
                <button
                  key={side}
                  type="button"
                  disabled={busy}
                  onClick={() => addBet(side)}
                  className={`rounded-xl p-3 text-left transition ${bets[side] > 0 ? "ring-2 ring-white/70 brightness-110" : "opacity-80 hover:opacity-100"}`}
                  style={{ background: COLORS[side] }}
                >
                  <div className="text-sm font-black text-white">{LABELS[side]}</div>
                  <div className={`text-[11px] font-bold ${TEXT[side]} mix-blend-screen`}>{PAYLINE[side]}</div>
                  <div className="mt-1.5 rounded bg-black/25 px-1.5 py-1 text-xs font-bold tabular-nums text-white">+ {fmt(chip)}</div>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-mute">Piles: <span className="font-bold text-white">{fmt(total)}</span></span>
              <button type="button" disabled={busy} onClick={() => setBets(ZERO)} className="rounded-lg bg-white/5 px-3 py-1.5 font-bold hover:bg-white/10">
                Clear bets
              </button>
            </div>
            <BetInput value={bet} onChange={setBet} disabled={busy} />
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-bg p-2"><div className="text-mute">Player</div><div className="text-base font-bold text-sky-300">1 : 1</div></div>
              <div className="rounded-lg bg-bg p-2"><div className="text-mute">Banker</div><div className="text-base font-bold text-rose-300">{BAC_PAYOUTS.banker} : 1</div></div>
              <div className="rounded-lg bg-bg p-2"><div className="text-mute">Tie</div><div className="text-base font-bold text-emerald-300">{BAC_PAYOUTS.tie} : 1</div></div>
            </div>
            {!user ? <LoginToPlay /> : (
              <button onClick={deal} disabled={busy} className="relum-btn relum-btn-primary w-full rounded-xl py-4 text-lg font-black" style={{ background: "var(--primary-color, #46FDAB)", color: "#000" }}>
                {busy ? "Dealing…" : `Deal ${fmt(total)}`}
              </button>
            )}
            <BalanceLine />
            <p className="text-xs text-mute">
              8 decks, naturals stand, standard third-card rules. Player pays {BAC_PAYOUTS.player}:1, Banker {BAC_PAYOUTS.banker}:1, Tie {BAC_PAYOUTS.tie}:1. Max total bet Br 20,000.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
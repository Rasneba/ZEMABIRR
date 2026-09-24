"use client";

import { useEffect, useRef, useState } from "react";
import { api, useApp } from "../AppProvider";
import { BalanceLine, BetInput, LoginToPlay } from "./shared";
import { CHICKEN_LANES, CHICKEN_LEVELS, chickenMultiplier, type ChickenLevel } from "@/lib/games";
import { fmt } from "@/lib/brand";

export default function Chicken() {
  const { user, toast, refresh, setBalances } = useApp();
  const [bet, setBet] = useState("10");
  const [level, setLevel] = useState<ChickenLevel>("easy");
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [dead, setDead] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ win: boolean; text: string } | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    api<{ round: { bet: number; level: ChickenLevel; step: number } | null }>("/api/games/chicken", { action: "resume" }).then((d) => {
      if (!d.round) return;
      setActive(true);
      setBet(String(d.round.bet));
      setLevel(d.round.level);
      setStep(d.round.step);
    });
  }, [user]);

  useEffect(() => {
    const el = trackRef.current?.querySelector<HTMLElement>(`[data-lane="${step}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [step]);

  async function start() {
    setBusy(true);
    const d = await api<{ balance: number; bonusBalance: number }>("/api/games/chicken", { action: "start", bet: Number(bet), level });
    setBusy(false);
    if (d.error) return toast(d.error, "error");
    setBalances(d.balance, d.bonusBalance);
    setStep(0);
    setDead(null);
    setMsg(null);
    setActive(true);
  }

  async function go() {
    setBusy(true);
    const d = await api<{ result: string; step: number; multiplier?: number; payout?: number }>("/api/games/chicken", { action: "step" });
    setBusy(false);
    if (d.error) return toast(d.error, "error");
    setStep(d.step);
    if (d.result === "dead") {
      setDead(d.step);
      setActive(false);
      setMsg({ win: false, text: "🚗 Splat! The chicken got hit." });
      refresh();
    } else if (d.result === "finished") {
      setActive(false);
      setMsg({ win: true, text: `Made it across! +${fmt(d.payout!)}` });
      refresh();
    }
  }

  async function cashout() {
    setBusy(true);
    const d = await api<{ multiplier: number; payout: number }>("/api/games/chicken", { action: "cashout" });
    setBusy(false);
    if (d.error) return toast(d.error, "error");
    setActive(false);
    setMsg({ win: true, text: `Cashed out ${d.multiplier.toFixed(2)}x · +${fmt(d.payout)}` });
    toast(`+${fmt(d.payout)}`, "success");
    refresh();
  }

  const cur = chickenMultiplier(level, step);

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
      <div className="overflow-hidden rounded-2xl bg-[#3b3f47] ring-1 ring-white/5">
        <div ref={trackRef} className="flex h-72 overflow-x-auto no-scrollbar sm:h-96">
          <div data-lane={0} className="relative flex w-28 shrink-0 items-center justify-center bg-[#5b8c3a]">
            {step === 0 && dead === null && <span className="text-5xl animate-floaty">🐔</span>}
            <span className="absolute bottom-3 text-xs font-bold text-white/80">START</span>
          </div>
          {Array.from({ length: CHICKEN_LANES }, (_, i) => i + 1).map((lane) => {
            const here = step === lane;
            const passed = lane < step || (lane === step && dead === null);
            const isDead = dead === lane;
            return (
              <div key={lane} data-lane={lane} className="relative flex w-28 shrink-0 flex-col items-center justify-center border-r-4 border-dashed border-white/30">
                {!passed && !isDead && <span className="absolute top-6 text-3xl opacity-70">{lane % 2 ? "🚗" : "🚕"}</span>}
                <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 text-sm font-black ${passed ? "border-gold bg-gold/30 text-gold" : isDead ? "border-lose bg-lose/30" : "border-white/20 bg-black/30 text-white/80"}`}>
                  {isDead ? <span className="text-4xl">💥</span> : here ? <span className="text-5xl animate-pop">🐔</span> : `${chickenMultiplier(level, lane).toFixed(2)}x`}
                </div>
                {isDead && <span className="absolute bottom-6 text-4xl animate-pop">🚙</span>}
              </div>
            );
          })}
          <div className="flex w-28 shrink-0 items-center justify-center bg-[#5b8c3a] text-4xl">🏁</div>
        </div>
        {msg && <div className={`m-3 rounded-xl px-4 py-2 text-center font-bold ${msg.win ? "bg-win/20 text-win" : "bg-lose/20 text-red-300"}`}>{msg.text}</div>}
      </div>
      <div className="space-y-3 rounded-2xl bg-card p-4">
        <BetInput value={bet} onChange={setBet} disabled={active} />
        <div>
          <div className="mb-1 text-xs text-mute">Difficulty</div>
          <div className="grid grid-cols-4 gap-1">
            {(Object.keys(CHICKEN_LEVELS) as ChickenLevel[]).map((l) => (
              <button key={l} disabled={active} onClick={() => setLevel(l)} className={`rounded-lg py-2 text-xs font-bold ${level === l ? "bg-gold text-black" : "bg-white/5"}`}>{CHICKEN_LEVELS[l].label}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="rounded-lg bg-bg p-2"><div className="text-mute">Current</div><div className="text-base font-bold">{cur.toFixed(2)}x</div></div>
          <div className="rounded-lg bg-bg p-2"><div className="text-mute">Next lane</div><div className="text-base font-bold text-gold">{chickenMultiplier(level, step + 1).toFixed(2)}x</div></div>
        </div>
        {!user ? (
          <LoginToPlay />
        ) : active ? (
          <div className="grid grid-cols-2 gap-2">
            <button onClick={go} disabled={busy} className="btn-gold rounded-xl py-4 text-lg">GO 🐔</button>
            <button onClick={cashout} disabled={busy || step === 0} className="btn-green rounded-xl py-2 text-sm">Cash out<span className="block">{fmt((Number(bet) || 0) * cur)}</span></button>
          </div>
        ) : (
          <button onClick={start} disabled={busy} className="btn-gold w-full rounded-xl py-4 text-lg">Start game</button>
        )}
        <BalanceLine />
        <p className="text-xs text-mute">Help the chicken cross {CHICKEN_LANES} lanes. Each lane raises the multiplier — cash out before you get hit!</p>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { api, useApp } from "../AppProvider";
import { BalanceLine, BetInput, LoginToPlay } from "./shared";
import { minesMultiplier } from "@/lib/games";
import { fmt } from "@/lib/brand";

type Cell = "hidden" | "gem" | "mine" | "mine-hit" | "gem-dim";

export default function Mines() {
  const { user, toast, refresh, setBalances } = useApp();
  const [bet, setBet] = useState("10");
  const [mines, setMines] = useState(3);
  const [active, setActive] = useState(false);
  const [cells, setCells] = useState<Cell[]>(Array(25).fill("hidden"));
  const [revealed, setRevealed] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ win: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    api<{ round: { bet: number; count: number; revealed: number[] } | null }>("/api/games/mines", { action: "resume" }).then((d) => {
      if (!d.round) return;
      setActive(true);
      setBet(String(d.round.bet));
      setMines(d.round.count);
      const c: Cell[] = Array(25).fill("hidden");
      d.round.revealed.forEach((i) => (c[i] = "gem"));
      setCells(c);
      setRevealed(d.round.revealed.length);
    });
  }, [user]);

  function revealAll(mineList: number[], hit?: number) {
    setCells((prev) => prev.map((c, i) => (i === hit ? "mine-hit" : mineList.includes(i) ? "mine" : c === "gem" ? "gem" : "gem-dim")));
  }

  async function start() {
    setBusy(true);
    const d = await api<{ balance: number; bonusBalance: number }>("/api/games/mines", { action: "start", bet: Number(bet), mines });
    setBusy(false);
    if (d.error) return toast(d.error, "error");
    setBalances(d.balance, d.bonusBalance);
    setCells(Array(25).fill("hidden"));
    setRevealed(0);
    setMsg(null);
    setActive(true);
  }

  async function reveal(i: number) {
    if (!active || busy || cells[i] !== "hidden") return;
    setBusy(true);
    const d = await api<{ result: string; mines?: number[]; multiplier?: number; payout?: number }>("/api/games/mines", { action: "reveal", cell: i });
    setBusy(false);
    if (d.error) return toast(d.error, "error");
    if (d.result === "mine") {
      revealAll(d.mines!, i);
      setActive(false);
      setMsg({ win: false, text: "💥 Boom! You hit a mine." });
      refresh();
    } else {
      setCells((c) => c.map((x, j) => (j === i ? "gem" : x)));
      setRevealed((r) => r + 1);
      if (d.result === "cleared") {
        revealAll(d.mines!);
        setActive(false);
        setMsg({ win: true, text: `Board cleared! +${fmt(d.payout!)}` });
        refresh();
      }
    }
  }

  async function cashout() {
    setBusy(true);
    const d = await api<{ mines: number[]; multiplier: number; payout: number }>("/api/games/mines", { action: "cashout" });
    setBusy(false);
    if (d.error) return toast(d.error, "error");
    revealAll(d.mines);
    setActive(false);
    setMsg({ win: true, text: `Cashed out ${d.multiplier.toFixed(2)}x · +${fmt(d.payout)}` });
    toast(`+${fmt(d.payout)}`, "success");
    refresh();
  }

  const cur = minesMultiplier(mines, revealed);
  const next = minesMultiplier(mines, revealed + 1);

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
      <div className="relative rounded-2xl bg-gradient-to-b from-[#0e2a2c] to-[#0f1a1c] p-3 ring-1 ring-white/5 sm:p-6">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-2">
          {cells.map((c, i) => (
            <button
              key={i}
              onClick={() => reveal(i)}
              disabled={!active || c !== "hidden"}
              className={`aspect-square rounded-xl text-2xl transition sm:text-3xl ${
                c === "hidden"
                  ? `bg-gradient-to-b from-[#3b6d78] to-[#27505a] shadow-[inset_0_-4px_0_rgba(0,0,0,0.3)] ${active ? "hover:-translate-y-0.5 hover:brightness-125" : "opacity-80"}`
                  : c === "mine-hit"
                  ? "bg-lose/40 animate-pop"
                  : c === "gem" || c === "mine"
                  ? "bg-[#0b1f22] animate-pop"
                  : "bg-[#0b1f22] opacity-40"
              }`}
            >
              {c === "gem" || c === "gem-dim" ? "💎" : c === "mine" || c === "mine-hit" ? "💣" : ""}
            </button>
          ))}
        </div>
        {msg && (
          <div className={`mx-auto mt-4 max-w-md rounded-xl px-4 py-2 text-center font-bold ${msg.win ? "bg-win/20 text-win" : "bg-lose/20 text-red-300"}`}>{msg.text}</div>
        )}
      </div>
      <div className="space-y-3 rounded-2xl bg-card p-4">
        <BetInput value={bet} onChange={setBet} disabled={active} />
        <div>
          <div className="mb-1 text-xs text-mute">Mines</div>
          <select className="input !py-2" value={mines} disabled={active} onChange={(e) => setMines(Number(e.target.value))}>
            {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="rounded-lg bg-bg p-2"><div className="text-mute">Current</div><div className="text-base font-bold">{cur.toFixed(2)}x</div></div>
          <div className="rounded-lg bg-bg p-2"><div className="text-mute">Next tile</div><div className="text-base font-bold text-gold">{next.toFixed(2)}x</div></div>
        </div>
        {!user ? (
          <LoginToPlay />
        ) : active ? (
          <button onClick={cashout} disabled={busy || revealed === 0} className="btn-green w-full rounded-xl py-4 text-lg">
            Cash out {fmt((Number(bet) || 0) * cur)}
          </button>
        ) : (
          <button onClick={start} disabled={busy} className="btn-gold w-full rounded-xl py-4 text-lg">Start game</button>
        )}
        <BalanceLine />
        <p className="text-xs text-mute">Find diamonds and avoid mines. Every safe tile increases your multiplier. Cash out any time.</p>
      </div>
    </div>
  );
}

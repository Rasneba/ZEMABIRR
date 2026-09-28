"use client";

import { useState } from "react";
import { api, useApp } from "../AppProvider";
import { BalanceLine, BetInput, LoginToPlay } from "./shared";
import { scoreHand, type Game } from "@/lib/games";
import { fmt } from "@/lib/brand";

function Card({ card, hidden }: { card?: string; hidden?: boolean }) {
  if (hidden)
    return (
      <div className="flex h-24 w-16 shrink-0 flex-col justify-between rounded-lg border border-white/20 bg-gradient-to-b from-[#14532d] to-[#0b3d22] p-2 text-2xl text-white/70 shadow-lg">
        <span>♠</span>
        <span className="self-end">♦</span>
      </div>
    );
  const suit = card?.slice(-1) ?? "";
  const rank = card?.slice(0, -1) ?? "";
  const red = suit === "♥" || suit === "♦";
  return (
    <div className={`flex h-24 w-16 shrink-0 flex-col rounded-lg border border-black/40 bg-gradient-to-b from-white to-[#dbe2ea] p-1.5 shadow-lg ${red ? "text-red-600" : "text-slate-900"}`}>
      <span className="text-sm font-black leading-none">{rank}</span>
      <span className="text-xl leading-none">{suit}</span>
      <span className="mt-auto self-end">{suit}</span>
    </div>
  );
}

type Status = { label: string; ok: boolean } | null;

export default function Blackjack({ game }: { game: Game }) {
  const { user, toast, refresh, setBalances } = useApp();
  const [bet, setBet] = useState("10");
  const [roundId, setRoundId] = useState<number | null>(null);
  const [player, setPlayer] = useState<string[]>([]);
  const [dealer, setDealer] = useState<string[]>([]);
  const [done, setDone] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const playerSum = scoreHand(player);
  const dealerSum = scoreHand(dealer);

  async function start() {
    setBusy(true);
    setStatus(null);
    const d = await api<{ roundId: number; player: string[]; dealer: string[]; playerSum: number; dealerUp?: string; status?: string; payout?: number; done?: boolean; balance?: number }>(
      "/api/games/blackjack",
      { game: game.slug, action: "start", bet: Number(bet) }
    );
    setBusy(false);
    if (d.error) return toast(d.error, "error");
    setRoundId(d.roundId);
    setPlayer(d.player ?? []);
    setDealer(d.dealer ?? []);
    if (d.done) {
      setDone(true);
      if (d.balance !== undefined) setBalances(d.balance);
      setStatus(bjMessage(d.status ?? "lost", d.payout ?? 0));
    } else {
      setDone(false);
      setStatus(null);
    }
    refresh();
  }

  function bjMessage(s: string, payout: number) {
    if (s === "blackjack") return { label: `BLACKJACK! +${fmt(payout)}`, ok: true };
    if (s === "won") return { label: `You win +${fmt(payout)}`, ok: true };
    if (s === "push") return { label: "Push — stake returned", ok: true };
    if (s === "bust") return { label: "Bust! Dealer wins", ok: false };
    return { label: "Dealer wins", ok: false };
  }

  async function act(action: "hit" | "stand") {
    if (!roundId || busy) return;
    setBusy(true);
    const d = await api<{ player?: string[]; dealer?: string[]; playerSum?: number; dealerSum?: number; status?: string; payout?: number; done?: boolean; dealerUp?: string; balance?: number; error?: string }>(
      "/api/games/blackjack",
      { game: game.slug, action, roundId }
    );
    setBusy(false);
    if (d.error) return toast(d.error, "error");
    if (d.player) setPlayer(d.player);
    if (d.dealer) setDealer(d.dealer);
    if (d.done) {
      setDone(true);
      if (d.balance !== undefined) setBalances(d.balance);
      setStatus(bjMessage(d.status ?? "lost", d.payout ?? 0));
      refresh();
    }
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_320px]">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#14532d] via-[#116a3a] to-[#0a2e19] ring-1 ring-white/10">
        <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at 30% 20%, #86efac88, transparent 60%), radial-gradient(ellipse at 80% 90%, #f5d0fe55, transparent 55%)" }} />
        {/* dealer */}
        <div className="relative px-4 pt-5 sm:px-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-white/70">
            <span className="font-bold uppercase tracking-wide">Dealer</span>
            {dealer.length > 0 && <span className="rounded-full bg-black/30 px-2 py-0.5 text-xs font-bold">{done ? dealerSum : scoreHand(dealer.slice(0, 1))}</span>}
          </div>
          <div className="flex min-h-[112px] flex-wrap gap-2">
            {dealer.length === 0 && <span className="text-sm text-white/40">Waiting for the deal…</span>}
            {dealer.map((c, i) => <Card key={i} card={c} hidden={!done && i === 1} />)}
          </div>
        </div>
        {/* status */}
        {status && (
          <div className={`relative mx-4 mb-3 mt-2 rounded-xl px-4 py-2 text-center text-sm font-black uppercase tracking-wide sm:mx-8 ${status.ok ? "bg-win/25 text-win" : "bg-lose/30 text-red-300"}`}>
            {status.label}
          </div>
        )}
        {/* player */}
        <div className="relative px-4 py-4 sm:px-8">
          <div className="mb-2 flex items-center gap-2 text-sm text-white/70">
            <span className="font-bold uppercase tracking-wide">You</span>
            {player.length > 0 && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${playerSum > 21 ? "bg-lose/50 text-red-200" : "bg-black/30 text-white"}`}>
                {playerSum}
              </span>
            )}
          </div>
          <div className="flex min-h-[112px] flex-wrap gap-2">
            {player.length === 0 && <span className="text-sm text-white/40">Place a bet to be dealt in</span>}
            {player.map((c, i) => <Card key={i} card={c} />)}
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl bg-card p-4">
        <BetInput value={bet} onChange={setBet} disabled={!done} />
        {!user ? (
          <LoginToPlay />
        ) : done ? (
          <button onClick={start} disabled={busy} className="btn-gold w-full rounded-xl py-4 text-lg">{busy ? "Dealing…" : "Deal · Play"}</button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => act("hit")} disabled={busy} className="btn-green rounded-xl py-4 text-lg">Hit</button>
            <button onClick={() => act("stand")} disabled={busy} className="rounded-xl bg-white/10 py-4 text-lg font-bold text-white hover:bg-white/15">Stand</button>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="rounded-lg bg-bg p-2"><div className="text-mute">Dealer stands</div><div className="text-base font-bold">17+</div></div>
          <div className="rounded-lg bg-bg p-2"><div className="text-mute">Blackjack pays</div><div className="text-base font-bold text-gold">1.5:1</div></div>
        </div>
        <BalanceLine />
        <p className="text-xs text-mute">Beat the dealer with 21 or closer. Face cards = 10, Aces = 1 or 11. Blackjack pays 1.5× your bet.</p>
      </div>
    </div>
  );
}
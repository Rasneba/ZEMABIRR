"use client";

import { useEffect, useMemo, useState } from "react";
import { api, useApp } from "@/components/AppProvider";
import { getFixtures, MATCH_DURATION, type Match } from "@/lib/sports";
import type { Selection } from "@/db/schema";
import { fmt } from "@/lib/brand";

type Pick = { matchId: string; pick: string; odds: number; label: string };
type Bet = { id: number; stake: number; totalOdds: number; status: string; payout: number; createdAt: string; selections: (Selection & { score: string | null })[] };

const PICK_LABEL: Record<string, string> = { "1": "Home", X: "Draw", "2": "Away", O: "Over 2.5", U: "Under 2.5" };

export default function SportsPage() {
  const { user, requireAuth, toast, refresh } = useApp();
  const [now, setNow] = useState<number | null>(null);
  const [league, setLeague] = useState("All");
  const [tab, setTab] = useState<"matches" | "bets">("matches");
  const [slip, setSlip] = useState<Pick[]>([]);
  const [stake, setStake] = useState("50");
  const [busy, setBusy] = useState(false);
  const [bets, setBets] = useState<Bet[]>([]);
  const [slipOpen, setSlipOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setNow(Date.now()), 0);
    const i = setInterval(() => setNow(Date.now()), 30000);
    return () => {
      clearTimeout(t);
      clearInterval(i);
    };
  }, []);

  const fixtures = useMemo(() => (now ? getFixtures(now) : []), [now]);
  const leagues = ["All", ...Array.from(new Set(fixtures.map((f) => f.league)))];
  const live = fixtures.filter((f) => { const k = new Date(f.kickoff).getTime(); return now && k <= now && k + MATCH_DURATION > now; });
  const upcoming = fixtures.filter((f) => now && new Date(f.kickoff).getTime() > now && (league === "All" || f.league === league));

  useEffect(() => {
    if (tab === "bets" && user) api<{ rows: Bet[] }>("/api/sports").then((d) => setBets(d.rows ?? []));
  }, [tab, user]);

  function toggle(m: Match, pick: keyof Match["odds"]) {
    setSlip((s) => {
      const exists = s.find((x) => x.matchId === m.id);
      if (exists && exists.pick === pick) return s.filter((x) => x.matchId !== m.id);
      const rest = s.filter((x) => x.matchId !== m.id);
      return [...rest, { matchId: m.id, pick, odds: m.odds[pick], label: `${m.home} vs ${m.away}` }];
    });
  }

  const totalOdds = slip.reduce((a, s) => a * s.odds, 1);

  async function place() {
    if (!requireAuth()) return;
    setBusy(true);
    const d = await api("/api/sports", { stake: Number(stake), selections: slip.map((s) => ({ matchId: s.matchId, pick: s.pick })) });
    setBusy(false);
    if (d.error) return toast(d.error, "error");
    toast("Bet placed! Good luck 🍀", "success");
    setSlip([]);
    setSlipOpen(false);
    refresh();
  }

  const OddBtn = ({ m, k }: { m: Match; k: keyof Match["odds"] }) => {
    const on = slip.some((s) => s.matchId === m.id && s.pick === k);
    return (
      <button onClick={() => toggle(m, k)} className={`flex flex-1 items-center justify-between gap-1 rounded-lg px-2 py-2 text-xs transition ${on ? "bg-gold text-black" : "bg-bg hover:bg-card2"}`}>
        <span className={on ? "text-black/70" : "text-mute"}>{k === "O" ? "O2.5" : k === "U" ? "U2.5" : k}</span>
        <b>{m.odds[k].toFixed(2)}</b>
      </button>
    );
  };

  const Slip = (
    <div className="rounded-2xl bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold">Bet slip <span className="ml-1 rounded-full bg-gold px-2 text-xs text-black">{slip.length}</span></h3>
        {slip.length > 0 && <button onClick={() => setSlip([])} className="text-xs text-mute hover:text-white">Clear all</button>}
      </div>
      {slip.length === 0 ? (
        <p className="py-6 text-center text-sm text-mute">Click on odds to add selections</p>
      ) : (
        <div className="space-y-2">
          {slip.map((s) => (
            <div key={s.matchId} className="rounded-lg bg-bg p-2.5 text-sm">
              <div className="flex justify-between"><span className="truncate text-xs text-mute">{s.label}</span><button onClick={() => setSlip((x) => x.filter((y) => y.matchId !== s.matchId))} className="text-mute">×</button></div>
              <div className="flex justify-between font-bold"><span>{PICK_LABEL[s.pick]}</span><span className="text-gold">{s.odds.toFixed(2)}</span></div>
            </div>
          ))}
          <div className="flex justify-between pt-1 text-sm"><span className="text-mute">{slip.length > 1 ? "Accumulator odds" : "Odds"}</span><b className="text-gold">{totalOdds.toFixed(2)}</b></div>
          <input className="input" inputMode="decimal" value={stake} onChange={(e) => setStake(e.target.value)} />
          <div className="grid grid-cols-4 gap-1">{[20, 50, 100, 500].map((v) => <button key={v} onClick={() => setStake(String(v))} className="rounded-md bg-white/5 py-1 text-xs">{v}</button>)}</div>
          <div className="flex justify-between text-sm"><span className="text-mute">Potential win</span><b className="text-win">{fmt((Number(stake) || 0) * totalOdds)}</b></div>
          <button onClick={place} disabled={busy} className="btn-gold w-full rounded-xl py-3">{busy ? "Placing…" : "Place bet"}</button>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-black">⚽ Sports</h1>
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-card p-1">
          {(["matches", "bets"] as const).map((t) => (
            <button key={t} onClick={() => (t === "bets" && !user ? requireAuth() : setTab(t))} className={`rounded-lg px-4 py-1.5 text-sm font-bold ${tab === t ? "bg-card2" : "text-mute"}`}>{t === "matches" ? "Matches" : "My bets"}</button>
          ))}
        </div>
      </div>

      {tab === "bets" ? (
        <div className="space-y-2">
          {bets.length === 0 && <p className="py-10 text-center text-mute">No bets yet.</p>}
          {bets.map((b) => (
            <div key={b.id} className="rounded-xl bg-card p-4">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-mute">#{b.id} · {b.selections.length > 1 ? `Accumulator (${b.selections.length})` : "Single"}</span>
                <span className={`rounded px-2 py-0.5 font-bold uppercase ${b.status === "won" ? "bg-win/20 text-win" : b.status === "lost" ? "bg-lose/20 text-red-300" : "bg-gold/20 text-gold"}`}>{b.status}</span>
              </div>
              {b.selections.map((s) => (
                <div key={s.matchId} className="flex justify-between border-t border-line/40 py-1.5 text-sm">
                  <span>{s.label} <span className="text-mute">· {PICK_LABEL[s.pick]}</span>{s.score && <span className="ml-2 text-xs text-mute">({s.score})</span>}</span>
                  <span className={s.result === "won" ? "text-win" : s.result === "lost" ? "text-red-300" : "text-gold"}>{s.odds.toFixed(2)}</span>
                </div>
              ))}
              <div className="mt-2 flex justify-between text-sm"><span className="text-mute">Stake {fmt(b.stake)} · Odds {b.totalOdds.toFixed(2)}</span><b className={b.status === "won" ? "text-win" : ""}>{b.status === "won" ? `+${fmt(b.payout)}` : `To win ${fmt(b.stake * b.totalOdds)}`}</b></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <div>
            {live.length > 0 && (
              <div className="mb-4">
                <h2 className="mb-2 flex items-center gap-2 text-sm font-bold"><span className="h-2 w-2 animate-pulse rounded-full bg-lose" /> LIVE NOW</h2>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {live.map((m) => (
                    <div key={m.id} className="min-w-60 rounded-xl bg-card p-3 text-sm">
                      <div className="text-[11px] text-mute">{m.flag} {m.league}</div>
                      <div className="font-bold">{m.home}</div><div className="font-bold">{m.away}</div>
                      <div className="mt-1 text-xs text-lose">● {Math.min(90, Math.floor(((now ?? 0) - new Date(m.kickoff).getTime()) / 60000))}&apos;</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mb-3 flex gap-2 overflow-x-auto no-scrollbar">
              {leagues.map((l) => (
                <button key={l} onClick={() => setLeague(l)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${league === l ? "bg-gold text-black" : "bg-card text-white/80"}`}>{l}</button>
              ))}
            </div>
            {!now && <div className="h-40 animate-pulse rounded-xl bg-card" />}
            <div className="space-y-2">
              {upcoming.map((m) => (
                <div key={m.id} className="rounded-xl bg-card p-3">
                  <div className="mb-2 flex justify-between text-[11px] text-mute">
                    <span>{m.flag} {m.league}</span>
                    <span>{new Date(m.kickoff).toLocaleString("en-GB", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex-1 text-sm font-bold">{m.home}<span className="mx-1 text-mute">vs</span>{m.away}</div>
                    <div className="flex gap-1 sm:w-[440px]">
                      <OddBtn m={m} k="1" /><OddBtn m={m} k="X" /><OddBtn m={m} k="2" /><OddBtn m={m} k="O" /><OddBtn m={m} k="U" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block"><div className="sticky top-20">{Slip}</div></div>
        </div>
      )}

      {slip.length > 0 && tab === "matches" && (
        <button onClick={() => setSlipOpen(true)} className="btn-gold fixed right-4 bottom-20 z-30 rounded-full px-5 py-3 text-sm shadow-2xl lg:hidden">
          Bet slip ({slip.length}) · {totalOdds.toFixed(2)}
        </button>
      )}
      {slipOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70 lg:hidden" onClick={() => setSlipOpen(false)}>
          <div className="max-h-[85svh] w-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>{Slip}</div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { api, useApp } from "../AppProvider";
import { KL, KENO_PAYTABLE, kenoHits, kenoMultiplier, kenoPhase, kenoRevealed, kenoRoundIdAt, type KenoHistoryRow, type KenoResultRow, type KenoState } from "@/lib/keno";
import { BalanceLine, LoginToPlay } from "./shared";

type Tab = "payouts" | "results" | "history" | "numbers" | "fair";
const BET_CHIPS = [10, 50, 100, 500, 1000, 5000];
const money = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pad2 = (n: number) => String(Math.max(0, n)).padStart(2, "0");

function Ball({ n, size, tone, className = "" }: { n: number; size: number; tone?: "picked" | "drawn" | "hit"; className?: string }) {
  const cls = tone === "picked" ? "k-ball--picked" : tone === "drawn" ? "k-ball--drawn" : tone === "hit" ? "k-ball--hit" : "";
  return (
    <span className={`k-ball ${cls} ${className}`} style={{ width: size, height: size, fontSize: size * 0.44 }}>{n}</span>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 sm:items-center" onClick={onClose}>
      <div className="animate-pop max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-card p-5 ring-1 ring-white/10 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-extrabold">{title}</h3>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xl text-white/80 hover:bg-white/20" aria-label="Close">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function PaytablePanel({ initial }: { initial: number }) {
  const [p, setP] = useState(initial || 10);
  return (
    <div>
      <div className="mb-2 grid grid-cols-10 gap-1">
        {Array.from({ length: KL.maxPicks }, (_, i) => i + 1).map((k) => (
          <button key={k} onClick={() => setP(k)} className={`h-8 rounded-lg text-sm font-bold ${p === k ? "bg-gold text-black" : "bg-bg text-mute hover:text-white"}`}>{k}</button>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl ring-1 ring-white/5">
        <div className="grid grid-cols-2 bg-black/30 px-3 py-1.5 text-xs font-bold uppercase text-mute"><span>Hits</span><span className="text-right">Pays</span></div>
        {KENO_PAYTABLE[p].map((m, h) => ({ m, h })).reverse().map(({ m, h }) => (
          <div key={h} className="grid grid-cols-2 border-t border-white/5 px-3 py-1.5 text-sm">
            <span className="font-bold text-white/80">{h} / {p}</span>
            <span className={`text-right font-extrabold ${m > 0 ? "text-win" : "text-white/30"}`}>{m > 0 ? `x${money(m).replace(/\.00$/, "")}` : "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultsPanel({ rows }: { rows: KenoResultRow[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.id} className="rounded-xl bg-bg p-2">
          <div className="mb-1.5 flex w-full items-center justify-between px-0.5">
            <span className="font-mono text-sm font-bold text-gold">Round {r.id}</span>
            <button onClick={() => setOpen(open === r.id ? null : r.id)} className="text-xs font-bold uppercase text-mute hover:text-white">
              {open === r.id ? "Hide hash ▴" : "Verify ▾"}
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {r.drawn.map((n, i) => <Ball key={i} n={n} size={30} tone={i === 0 ? "hit" : "drawn"} className="k-ball-in" />)}
          </div>
          {open === r.id && (
            <div className="mt-2 space-y-1 break-all rounded-lg bg-black/30 p-2 font-mono text-[11px] text-white/60">
              <div><span className="text-white/40">Seed: </span>{r.seed}</div>
              <div><span className="text-white/40">Hash: </span>{r.hash}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function NumbersPanel({ state }: { state: KenoState }) {
  const { hot, cold } = state;
  return (
    <div className="space-y-3">
      {[["🔥 Hot numbers", hot, "#f59e0b"], ["❄️ Cold numbers", cold, "#38bdf8"]].map(([title, list, c]) => (
        <div key={title as string}>
          <div className="mb-1.5 text-sm font-bold" style={{ color: c as string }}>{title as string}</div>
          <div className="flex flex-wrap gap-1.5">
            {(list as number[]).map((n) => <Ball key={n} n={n} size={34} />)}
          </div>
        </div>
      ))}
      <p className="text-xs text-mute">Based on the last 50 finished rounds. Drawn numbers trend from real, verifiable seeds.</p>
    </div>
  );
}

function FairPanel({ round }: { round: KenoState["round"] }) {
  return (
    <div className="space-y-3 text-sm">
      <p className="text-mute">
        Before betting opens, the SHA-256 hash of the round&apos;s secret seed is published. After the draw the seed is revealed, so anyone can verify the result was fixed in advance.
      </p>
      <div className="rounded-xl bg-bg p-3">
        <div className="text-xs font-bold uppercase text-mute">Round {round.id} — committed hash</div>
        <div className="break-all font-mono text-xs text-gold">{round.hash}</div>
        {round.seed && (
          <>
            <div className="mt-2 text-xs font-bold uppercase text-mute">Revealed seed</div>
            <div className="break-all font-mono text-xs text-white/80">{round.seed}</div>
            <div className="mt-2 font-mono text-xs text-win">sha256(seed) == hash ✓</div>
          </>
        )}
      </div>
      <p className="text-xs text-mute">
        Balls come from a Fisher–Yates shuffle of 1–{KL.numbers}: for step i = 0…{KL.draw - 1}, take
        <code className="text-white/80"> parseInt(sha256(seed + num + i).slice(0,8), 16) mod (80 − i)</code>. Past seeds are in the <b>Results</b> tab.
      </p>
    </div>
  );
}

function DrawStage({ drawn, total, phase, myPicks, myWin, myStake, nextIn, roundId }: {
  drawn: number[]; total: number; phase: "drawing" | "result"; myPicks: Set<number>; myWin: number; myStake: number; nextIn: number; roundId: number;
}) {
  const current = drawn[drawn.length - 1];
  const prev = phase === "result" ? drawn : drawn.slice(0, -1);
  return (
    <div className="relative h-[260px] overflow-hidden rounded-2xl bg-gradient-to-b from-[#2a1a45] to-[#161026] ring-1 ring-white/5">
      {phase === "drawing" && <div className="k-glow absolute inset-0 opacity-30" />}
      {phase === "drawing" && current != null && (
        <div className="absolute left-1/2 top-[8px] -translate-x-1/2">
          <Ball key={`${roundId}-${current}`} n={current} size={150} tone={myPicks.has(current) ? "hit" : "drawn"} className="k-ball-in" />
        </div>
      )}
      {phase === "result" && (
        <div className="animate-pop absolute inset-x-0 top-6 flex flex-col items-center text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-white/50">Round {roundId} finished</div>
          {myStake > 0 ? (
            myWin > 0 ? (
              <>
                <div className="mt-1 text-xl font-black uppercase">You won 🎉</div>
                <div className="text-4xl font-black text-win drop-shadow-[0_0_14px_rgba(34,197,94,.5)]">{money(myWin)} <span className="text-xl">{KL.currency}</span></div>
              </>
            ) : (
              <div className="mt-3 text-2xl font-extrabold text-white/70">No win this time</div>
            )
          ) : (
            <div className="mt-3 text-2xl font-extrabold text-white/70">Results</div>
          )}
          <div className="mt-2 text-xs font-bold uppercase text-white/50">Next draw in {nextIn}s</div>
        </div>
      )}
      <div className={`absolute inset-x-2 flex flex-wrap gap-1.5 ${phase === "result" ? "bottom-2" : "top-[170px]"}`}>
        {prev.map((n, i) => (
          <Ball key={`${roundId}-${n}`} n={n} size={phase === "result" ? 30 : 34} tone={myPicks.has(n) ? "hit" : "drawn"} className={phase === "drawing" && i === prev.length - 1 ? "k-ball-drop" : "k-ball-in"} />
        ))}
      </div>
    </div>
  );
}

function randomPicks(k: number) {
  const pool = Array.from({ length: KL.numbers }, (_, i) => i + 1);
  const out: number[] = [];
  for (let i = 0; i < k; i++) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  return out;
}

export default function Keno() {
  const { user, toast, refresh, openAuth, openWallet, setBalances } = useApp();
  const [st, setSt] = useState<KenoState | null>(null);
  const [now, setNow] = useState(0);
  const offset = useRef(0);
  const inflight = useRef(false);
  const lastLoad = useRef(0);

  const [picks, setPicks] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(window.localStorage.getItem("zk_keno_picks") ?? "[]") as number[];
      return Array.isArray(saved) ? saved.filter((n) => Number.isInteger(n) && n >= 1 && n <= KL.numbers).slice(0, KL.maxPicks) : [];
    } catch {
      return [];
    }
  });
  const [bet, setBet] = useState(() => {
    if (typeof window === "undefined") return "10";
    const saved = Number(window.localStorage.getItem("zk_keno_bet"));
    return saved > 0 ? String(saved) : "10";
  });
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("payouts");
  const [modal, setModal] = useState<null | "help" | "fair">(null);
  const [results, setResults] = useState<KenoResultRow[] | null>(null);
  const [history, setHistory] = useState<KenoHistoryRow[] | null>(null);
  const [paidRound, setPaidRound] = useState<number | null>(null);

  const saveBet = (v: string) => {
    setBet(v);
    localStorage.setItem("zk_keno_bet", v);
  };
  const savePicks = (p: number[]) => {
    setPicks(p);
    localStorage.setItem("zk_keno_picks", JSON.stringify(p));
  };

  const load = useCallback(async () => {
    if (inflight.current) return;
    inflight.current = true;
    lastLoad.current = Date.now();
    const t0 = Date.now();
    const d = await api<KenoState>("/api/games/keno");
    const t1 = Date.now();
    inflight.current = false;
    if (d.error || !d.round) return;
    offset.current = d.now - (t0 + t1) / 2;
    setSt(d);
  }, []);

  useEffect(() => {
    const clock = setInterval(() => setNow(Date.now() + offset.current), 100);
    const poll = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, 2500);
    return () => {
      clearInterval(clock);
      clearInterval(poll);
    };
  }, [load]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const round = st?.round;
  const phase = round ? kenoPhase(round.id, now) : "betting";
  const revealed = round ? (phase === "result" ? KL.draw : kenoRevealed(round.id, now)) : 0;
  const drawnVisible = useMemo(() => (round ? round.drawn.slice(0, revealed) : []), [round, revealed]);
  const drawnSet = useMemo(() => new Set(drawnVisible), [drawnVisible]);
  const myTickets = useMemo(() => st?.my.tickets ?? [], [st]);
  const myPickSet = useMemo(() => new Set(myTickets.flatMap((t) => t.picks)), [myTickets]);
  const final = phase === "result" && !!round && round.drawn.length === KL.draw;
  const myStake = st?.my.stake ?? 0;
  const myWin = useMemo(() => {
    if (!final || !round) return 0;
    return Math.round(myTickets.reduce((s, t) => s + t.bet * kenoMultiplier(t.picks.length, kenoHits(t.picks, round.drawn)), 0) * 100) / 100;
  }, [final, round, myTickets]);

  useEffect(() => {
    if (!round || !now) return;
    const stale = kenoRoundIdAt(now) !== round.id || (phase !== "betting" && round.drawn.length === 0) || (phase === "result" && !round.seed);
    if (stale && Date.now() - lastLoad.current > 700) {
      const t = setTimeout(load, 0);
      return () => clearTimeout(t);
    }
  }, [now, round, phase, load]);

  useEffect(() => {
    if (!final || !round || paidRound === round.id || myTickets.length === 0) return;
    const t = setTimeout(() => {
      setPaidRound(round.id);
      refresh();
      if (myWin > 0) toast(`Keno round ${round.id}: you won ${money(myWin)} ${KL.currency} 🎉`, "success");
      if (tab === "results") setResults(null);
    }, 350);
    return () => clearTimeout(t);
  }, [final, round, myTickets, myWin, refresh, toast, tab, paidRound]);

  const roundId = round?.id;
  useEffect(() => {
    let cancel = false;
    if (tab === "results") {
      api<{ rows: KenoResultRow[] }>("/api/games/keno?view=results").then((d) => !cancel && d.rows && setResults(d.rows));
    } else if (tab === "history") {
      if (!user) return;
      api<{ rows: KenoHistoryRow[] }>("/api/games/keno?view=history").then((d) => !cancel && d.rows && setHistory(d.rows));
    }
    return () => {
      cancel = true;
    };
  }, [tab, roundId, user, final]);

  function toggle(n: number) {
    if (phase !== "betting") return;
    savePicks(picks.includes(n) ? picks.filter((x) => x !== n) : picks.length >= KL.maxPicks ? picks : [...picks, n]);
  }

  async function play() {
    if (picks.length === 0) return toast("Pick at least 1 number", "error");
    const b = Number(bet);
    if (!b || b < KL.minBet) return toast("Enter a valid bet", "error");
    if (!user) return openAuth("login");
    if (phase !== "betting") return toast("Betting is closed for this round", "error");
    setBusy(true);
    const d = await api<{ balance: number; bonusBalance: number }>("/api/games/keno", { picks, bet: b });
    setBusy(false);
    if (d.error) {
      if (d.error.includes("deposit")) openWallet("deposit");
      return toast(d.error, "error");
    }
    if (d.balance != null && d.bonusBalance != null) setBalances(d.balance, d.bonusBalance);
    savePicks(picks.length === KL.maxPicks ? [] : picks);
    toast(`Ticket placed — Round ${round?.id ?? ""} · ${picks.length} numbers · ${money(b)} ${KL.currency}`, "success");
    load();
  }

  const nextDrawIn = round ? Math.max(0, Math.ceil((round.betEnd - now) / 1000)) : 0;
  const resultLeft = round ? Math.max(0, Math.ceil((round.end - now) / 1000)) : 0;
  const betClosing = !!round && phase === "betting" && round.betEnd - now <= 1500;
  const ballEvery = (KL.drawMs / KL.draw) / 1000;

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_330px]">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl bg-card p-3 ring-1 ring-white/5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎱</span>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-mute">Classic Keno · 1–{KL.numbers}</div>
              <div className="font-black">Round {round?.id ?? "—"}</div>
            </div>
            <button onClick={() => setModal("help")} className="ml-1 grid h-6 w-6 place-items-center rounded-full bg-white/5 text-xs font-black text-white/60 hover:bg-white/15 hover:text-white" aria-label="How to play">?</button>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {phase === "betting" && (
              <div className="flex items-center gap-2 rounded-xl bg-bg px-3 py-1.5">
                <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-win" />
                <span className="text-xs font-bold uppercase text-mute">Betting open</span>
                <span className="font-mono text-xl font-black tabular-nums text-gold">{pad2(Math.floor(nextDrawIn / 60))}:{pad2(nextDrawIn % 60)}</span>
              </div>
            )}
            {phase === "drawing" && <span className="text-sm font-bold text-gold">Drawing ball {drawnVisible.length}/{KL.draw}…</span>}
            {(phase === "drawing" || phase === "result") && round && (
              <span className="text-sm font-bold text-white/70">Betting opens in {pad2(Math.max(0, Math.ceil((round.end - now) / 1000)))}s</span>
            )}
          </div>
        </div>

        {phase !== "betting" && (
          <DrawStage drawn={drawnVisible} total={KL.draw} phase={phase === "result" ? "result" : "drawing"} myPicks={myPickSet} myWin={myWin} myStake={myStake} nextIn={resultLeft} roundId={round?.id ?? 0} />
        )}

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#2a1a45] to-[#161026] p-3 ring-1 ring-white/5 sm:p-4">
          <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
            {Array.from({ length: KL.numbers }, (_, i) => i + 1).map((n) => {
              const p = picks.includes(n);
              const mine = myPickSet.has(n);
              const d = drawnSet.has(n);
              const disabled = phase !== "betting";
              return (
                <button
                  key={n}
                  disabled={disabled}
                  onClick={() => toggle(n)}
                  className="grid aspect-square place-items-center"
                  aria-label={`Pick ${n}`}
                >
                  <span
                    className={`flex h-full w-full items-center justify-center rounded-full text-xs font-black transition-all sm:text-sm ${
                      p ? "k-ball k-ball--picked k-glow" : d ? (mine ? "k-ball k-ball--hit" : "k-ball k-ball--drawn") : mine ? "k-ball k-ball--hit opacity-90" : "k-ball"
                    } ${p && d ? "k-shake" : ""} ${disabled ? "opacity-90" : "hover:scale-110"} ${d || p || mine ? "k-ball-in" : ""}`}
                  >
                    {n}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-card p-4 ring-1 ring-white/5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-bold">🎟️ Your picks</h3>
            <span className="text-xs text-mute">{picks.length}/{KL.maxPicks} numbers</span>
          </div>
          <div className="grid grid-cols-10 gap-1.5">
            {Array.from({ length: KL.maxPicks }, (_, i) => {
              const n = picks[i];
              const hit = n != null && drawnSet.has(n);
              return (
                <div key={i} className="grid aspect-square place-items-center">
                  {n != null ? <Ball n={n} size={32} className="k-ball-in" tone={hit ? "hit" : "picked"} /> : <span className="h-8 w-8 rounded-full bg-white/5" />}
                </div>
              );
            })}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={() => savePicks(randomPicks(5))} disabled={phase !== "betting"} className="btn-ghost rounded-lg py-2 text-sm">🎲 Quick pick</button>
            <button onClick={() => savePicks([])} disabled={phase !== "betting"} className="btn-ghost rounded-lg py-2 text-sm">Clear</button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {!user ? <LoginToPlay /> : (
          <div className="rounded-2xl bg-card p-4 ring-1 ring-white/5">
            <label className="mb-1 block text-xs text-mute">Bet per ticket · min {KL.minBet} · max {KL.maxBet.toLocaleString()}</label>
            <div className="flex gap-2">
              <input className="input text-lg font-bold" inputMode="decimal" value={bet} onChange={(e) => saveBet(e.target.value)} disabled={busy} />
            </div>
            <div className="mt-2 grid grid-cols-6 gap-1.5">
              {BET_CHIPS.map((v) => (
                <button key={v} onClick={() => saveBet(String(v))} disabled={phase !== "betting"} className="btn-ghost rounded-lg py-1.5 text-[11px]">{v.toLocaleString()}</button>
              ))}
            </div>
            <button onClick={play} disabled={busy || phase !== "betting" || betClosing || picks.length === 0} className="btn-gold mt-3 w-full rounded-xl py-3 text-base font-black">
              {busy ? "Placing…" : phase !== "betting" ? "Wait for next round" : betClosing ? "Betting closing…" : picks.length === 0 ? "Pick numbers to bet" : `Bet ${money(Number(bet) || 0)}`}
            </button>
            {myStake > 0 && <div className="mt-2 text-center text-xs text-mute">You have {myTickets.length} ticket{myTickets.length !== 1 ? "s" : ""} this round · {money(myStake)} staked</div>}
            <BalanceLine />
          </div>
        )}

        <div className="rounded-2xl bg-card p-3 ring-1 ring-white/5">
          <div className="grid grid-cols-5 gap-1">
            {(["payouts", "results", "history", "numbers", "fair"] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`rounded-lg py-1.5 text-[11px] font-bold capitalize ${tab === t ? "bg-card2" : "text-mute"}`}>
                {t === "payouts" ? "Payouts" : t === "results" ? "Draws" : t === "history" ? "My bets" : t === "numbers" ? "Hot/Cold" : "Fairness"}
              </button>
            ))}
          </div>
          <div className="max-h-[420px] overflow-y-auto no-scrollbar">
            {tab === "payouts" && <PaytablePanel initial={picks.length || 10} />}
            {tab === "results" && (!results ? <Loading /> : <ResultsPanel rows={results} />)}
            {tab === "history" && (!history ? <Loading /> : history.length === 0 ? <p className="py-6 text-center text-sm text-mute">No tickets yet — bet in a round to see your history.</p> : (
              <div className="space-y-2">
                {history.map((r) => (
                  <div key={r.id} className="rounded-xl bg-bg p-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gold">Round {r.round}</span>
                      <span className="text-mute">{new Date(r.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {r.picks.map((n) => <Ball key={n} n={n} size={24} tone={r.drawn?.includes(n) ? "hit" : undefined} />)}
                    </div>
                    <div className="mt-1 flex justify-between">
                      <span className="text-mute">Bet {money(r.bet)} · {r.hits ?? "—"} hits</span>
                      <span className={`font-bold ${r.status === "won" ? "text-win" : "text-white/40"}`}>{r.status === "won" ? `+${money(r.payout)}` : "—"}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {tab === "numbers" && (!st ? <Loading /> : <NumbersPanel state={st} />)}
            {tab === "fair" && (!round ? <Loading /> : <FairPanel round={round} />)}
          </div>
        </div>

        <div className="rounded-2xl bg-card p-3 ring-1 ring-white/5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold">📢 Live tickets</h3>
            <span className="text-xs text-mute">{st?.feed.total.toLocaleString() ?? "—"} this round</span>
          </div>
          <div className="max-h-56 space-y-1.5 overflow-y-auto no-scrollbar">
            {st?.feed.tickets.map((t) => (
              <div key={t.id} className={`flex items-center gap-2 rounded-lg bg-bg px-2 py-1.5 ${t.mine ? "ring-1 ring-gold/60" : ""}`}>
                <span className={`text-sm font-bold ${t.mine ? "text-gold" : "text-white/70"}`}>{t.name}</span>
                <span className="text-[11px] text-mute">{t.picks.length} numbers</span>
                <span className="ml-auto font-bold text-sm">{money(t.bet)}</span>
                {t.mine && <span className="rounded bg-gold/15 px-1 py-0.5 text-[10px] font-bold uppercase text-gold">You</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {modal === "help" && (
        <Modal title="How to play" onClose={() => setModal(null)}>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm text-white/85">
            <li>Pick 1 to {KL.maxPicks} numbers from the 1–{KL.numbers} board (or use 🎲 Quick pick).</li>
            <li>Place your stake before the timer runs out. A new round starts every {KL.cycleMs / 1000}s.</li>
            <li>{KL.draw} balls are drawn — one every {ballEvery}s — while betting is closed. Every match is a <b className="text-win">hit</b>.</li>
            <li>Your payout = stake × the paytable multiplier, credited automatically.</li>
          </ol>
          <p className="mt-3 rounded-lg bg-bg px-3 py-2 text-xs text-mute">
            Hot & cold numbers and the committed SHA-256 hash for every round are shown here so results are fully verifiable.
          </p>
        </Modal>
      )}

      {modal === "fair" && round && <Modal title="Provably fair" onClose={() => setModal(null)}><FairPanel round={round} /></Modal>}
    </div>
  );
}

function Loading() {
  return <div className="flex justify-center py-8"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" /></div>;
}
"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { api, useApp } from "../AppProvider";
import { BRAND } from "@/lib/brand";
import {
  FK,
  FK_PAYTABLE,
  fkHits,
  fkMultiplier,
  fkPhase,
  fkRevealed,
  fkRoundIdAt,
  type FkHistoryRow,
  type FkResultRow,
  type FkState,
  type FkStats,
  type FkTicket,
} from "@/lib/fastkeno";

type Tab = "game" | "history" | "results" | "stats";
const money = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const BET_STEPS = [1, 2, 4, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000, 10000];
function randomPicks(k: number) {
  const pool = Array.from({ length: FK.numbers }, (_, i) => i + 1);
  const out: number[] = [];
  for (let i = 0; i < k; i++) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  return out;
}
const pad = (n: number) => String(Math.max(0, n)).padStart(2, "0");

// ------------------------------------------------------------ seven-segment display
const SEG: Record<string, string> = {
  "0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd", "4": "fgbc",
  "5": "afgcd", "6": "afgedc", "7": "abc", "8": "abcdefg", "9": "abcdfg",
};
const SEG_RECT: Record<string, [number, number, number, number]> = {
  a: [4, 0.5, 12, 3], b: [16.5, 4, 3, 12], c: [16.5, 18, 3, 12], d: [4, 30.5, 12, 3],
  e: [0.5, 18, 3, 12], f: [0.5, 4, 3, 12], g: [4, 15.5, 12, 3],
};
function Digit({ d, color, h }: { d: string; color: string; h: number }) {
  if (d === ":" || d === "/") {
    return (
      <svg viewBox="0 0 10 34" style={{ height: h, width: (h * 10) / 34 }} aria-hidden>
        {d === ":" ? (
          <>
            <rect x="3.5" y="9" width="3" height="3" rx="0.6" fill="currentColor" />
            <rect x="3.5" y="22" width="3" height="3" rx="0.6" fill="currentColor" />
          </>
        ) : (
          <rect x="4" y="4" width="3" height="26" rx="1" fill="#4cc27e" transform="skewX(-14) translate(4 0)" />
        )}
      </svg>
    );
  }
  const on = SEG[d] ?? "";
  return (
    <svg viewBox="0 0 20 34" style={{ height: h, width: (h * 20) / 34 }} aria-hidden>
      <g transform="skewX(-6) translate(2 0)">
        {Object.entries(SEG_RECT).map(([k, [x, y, w, hh]]) => (
          <rect key={k} x={x} y={y} width={w} height={hh} rx="1.2" fill={on.includes(k) ? color : "rgba(255,255,255,0.04)"} />
        ))}
      </g>
    </svg>
  );
}
function SevenSeg({ text, h = 26, color = "#eef3f4", className = "" }: { text: string; h?: number; color?: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[3px] ${className}`} style={{ color, filter: "drop-shadow(0 0 6px rgba(255,255,255,0.25))" }} aria-label={text}>
      {text.split("").map((c, i) => (c === " " ? <span key={i} style={{ width: h * 0.18 }} /> : <Digit key={i} d={c} color={color} h={h} />))}
    </span>
  );
}

// ------------------------------------------------------------ ball
function Ball({ n, size, green, className = "" }: { n: number | string; size: number; green?: boolean; className?: string }) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full font-extrabold text-white ${green ? "fk-ball-green" : "fk-ball"} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.46, lineHeight: 1, textShadow: "0 2px 3px rgba(0,0,0,0.6)" }}
    >
      <span className="fk-ball-gloss" />
      <span className="relative">{n}</span>
    </span>
  );
}

// ------------------------------------------------------------ icons
const Ico = {
  menu: <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16" /></svg>,
  chat: <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"><path d="M12 3.5c4.97 0 9 3.36 9 7.5s-4.03 7.5-9 7.5c-1.1 0-2.16-.16-3.13-.46L4 20l1.3-3.9C3.9 14.8 3 13 3 11c0-4.14 4.03-7.5 9-7.5Z" /></svg>,
  shield: <svg viewBox="0 0 24 24" className="h-6 w-6"><path d="M12 2 4 5v6c0 5 3.4 9.3 8 11 4.6-1.7 8-6 8-11V5l-8-3Z" fill="#4cc27e" /><path d="M12 2v20c4.6-1.7 8-6 8-11V5l-8-3Z" fill="#3aa767" /><path d="m8.2 12.2 2.6 2.6 5-5.2" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  play: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M6 3.5v17l14-8.5L6 3.5Z" /></svg>,
  history: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" /><path d="M4 3.5v4h4" /><path d="M12 8.5V12l2.5 2" /></svg>,
  check: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 12.5 5 5L20 6.5" /></svg>,
  stats: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><rect x="3" y="14" width="3" height="7" /><rect x="8" y="10" width="3" height="11" /><rect x="13" y="12" width="3" height="9" /><rect x="18" y="7" width="3" height="14" /><path d="m3 10 5-5 4 3 7-6" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>,
  gear: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M19.4 13a7.5 7.5 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1l-.4-2.7h-4l-.4 2.7a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.5L4.6 11a7.5 7.5 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.4 7.4 0 0 0 1.7 1l.4 2.7h4l.4-2.7a7.4 7.4 0 0 0 1.7-1l2.5 1 2-3.5L19.4 13ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" /></svg>,
};

// ------------------------------------------------------------ small pieces
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div className="fk max-h-[88vh] w-full max-w-[520px] overflow-y-auto rounded-t-2xl p-4 ring-1 ring-white/10 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-extrabold uppercase tracking-wide text-white">{title}</h3>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-xl text-white/80 hover:bg-white/20" aria-label="Close">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Paytable({ initial }: { initial: number }) {
  const [p, setP] = useState(initial || 10);
  return (
    <div>
      <div className="mb-2 grid grid-cols-10 gap-1">
        {Array.from({ length: FK.maxPicks }, (_, i) => i + 1).map((k) => (
          <button key={k} onClick={() => setP(k)} className={`h-9 rounded-md text-base font-bold ${p === k ? "fk-tile-on" : "fk-tile"}`}>{k}</button>
        ))}
      </div>
      <div className="overflow-hidden rounded-lg ring-1 ring-white/5">
        <div className="grid grid-cols-2 bg-black/30 px-3 py-1.5 text-sm font-bold uppercase text-white/50"><span>Hits</span><span className="text-right">Pays</span></div>
        {FK_PAYTABLE[p].map((m, h) => ({ m, h })).reverse().map(({ m, h }) => (
          <div key={h} className="grid grid-cols-2 border-t border-white/5 px-3 py-1.5 text-lg">
            <span className="font-bold text-white/80">{h} / {p}</span>
            <span className={`text-right font-extrabold ${m > 0 ? "text-[var(--fk-green)]" : "text-white/30"}`}>{m > 0 ? `x${m}` : "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TicketCard({ t, drawn, final, head }: { t: { name?: string; picks: number[]; bet: number; mine?: boolean }; drawn: Set<number>; final: boolean; head?: ReactNode }) {
  const hits = t.picks.filter((n) => drawn.has(n)).length;
  const mult = fkMultiplier(t.picks.length, hits);
  const win = Math.round(t.bet * mult * 100) / 100;
  return (
    <div className={`rounded-xl bg-[var(--fk-panel)] p-2 ${t.mine ? "ring-1 ring-[var(--fk-green)]/60" : ""}`}>
      <div className="mb-1.5 flex items-center justify-between px-0.5">
        <span className="text-xl font-bold leading-none text-[var(--fk-green)]">{head ?? t.name}</span>
        {t.mine && !head && <span className="rounded bg-[var(--fk-green)]/15 px-1.5 py-0.5 text-xs font-bold uppercase text-[var(--fk-green)]">You</span>}
      </div>
      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: FK.maxPicks }, (_, i) => {
          const n = t.picks[i];
          const hit = n != null && drawn.has(n);
          return (
            <div
              key={i}
              className={`flex aspect-[1.05/1] items-center justify-center rounded-md text-[clamp(14px,4.6vw,20px)] font-bold ${
                n == null ? "bg-[#23282c]" : hit ? "fk-hit bg-[#4cbb74] text-white" : "bg-[#394249] text-[#d5dadd]"
              }`}
            >
              {n ?? ""}
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1">
        <div className="rounded-md bg-[#23282c] px-2.5 py-1.5 text-[clamp(15px,4.8vw,20px)] font-bold text-[#e3e7e9]">Bet {t.bet % 1 ? money(t.bet) : t.bet}</div>
        <div className={`rounded-md bg-[#23282c] px-2.5 py-1.5 text-right text-[clamp(15px,4.8vw,20px)] font-bold ${!final ? "text-[var(--fk-yellow)]" : win > 0 ? "text-[var(--fk-green)]" : "text-white/40"}`}>
          {!final ? "Waiting" : win > 0 ? `Win ${money(win)}` : "Lost"}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------ draw stage
function DrawStage({ drawn, total, phase, myPicks, myWin, myStake, nextIn, roundId }: {
  drawn: number[]; total: number; phase: "drawing" | "result"; myPicks: Set<number>; myWin: number; myStake: number; nextIn: number; roundId: number;
}) {
  const current = drawn[drawn.length - 1];
  const prev = phase === "result" ? drawn : drawn.slice(0, -1);
  return (
    <div className="relative h-[300px] overflow-hidden">
      <div className="fk-stage-glow absolute inset-0" />
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMin slice" aria-hidden>
        <g fill="none" stroke="#2f7a55" strokeLinecap="round">
          <circle cx="200" cy="78" r="44" strokeOpacity=".55" strokeWidth="1.5" />
          <circle className="fk-spin-fast" cx="200" cy="78" r="62" strokeOpacity=".5" strokeWidth="2" strokeDasharray="120 40 60 30" />
          <circle className="fk-spin-rev" cx="200" cy="78" r="92" strokeOpacity=".45" strokeWidth="3" strokeDasharray="160 50 90 70" />
          <circle className="fk-spin" cx="200" cy="78" r="128" strokeOpacity=".35" strokeWidth="3" strokeDasharray="10 14 220 60 120 90" />
          <circle className="fk-spin-rev" cx="200" cy="78" r="168" strokeOpacity=".25" strokeWidth="3" strokeDasharray="300 80 140 120" />
          <circle className="fk-spin" cx="200" cy="78" r="210" strokeOpacity=".15" strokeWidth="2.5" strokeDasharray="200 120" />
        </g>
      </svg>
      <div className="absolute right-3 top-1">
        <SevenSeg text={`${pad(drawn.length).replace(/^0/, " ").trim()}/${total}`} h={20} />
      </div>

      {phase === "drawing" && current != null && (
        <div className="absolute left-1/2 top-[6px] -translate-x-1/2">
          <Ball key={`${roundId}-${current}`} n={current} size={144} green={myPicks.has(current)} className="fk-ball-in" />
        </div>
      )}
      {phase === "result" && (
        <div className="fk-result-pop absolute inset-x-0 top-5 flex flex-col items-center text-center">
          <div className="text-lg font-bold uppercase tracking-wider text-white/50">Round {roundId} finished</div>
          {myStake > 0 ? (
            myWin > 0 ? (
              <>
                <div className="text-2xl font-extrabold uppercase text-white">You won</div>
                <div className="text-5xl font-extrabold text-[var(--fk-green)] drop-shadow-[0_0_14px_rgba(76,194,126,.5)]">{money(myWin)} <span className="text-2xl">{FK.currency}</span></div>
              </>
            ) : (
              <div className="mt-2 text-3xl font-extrabold uppercase text-white/80">No win this time</div>
            )
          ) : (
            <div className="mt-2 text-3xl font-extrabold uppercase text-white/80">Results</div>
          )}
          <div className="mt-2 flex items-center gap-2 text-base font-bold uppercase text-white/50">
            Next round <SevenSeg text={`00:${pad(nextIn)}`} h={16} />
          </div>
        </div>
      )}

      <div className={`absolute left-2 right-2 flex flex-wrap gap-1.5 ${phase === "result" ? "bottom-3" : "top-[160px]"}`}>
        {prev.map((n, i) => (
          <Ball key={`${roundId}-${n}`} n={n} size={phase === "result" ? 32 : 36} green={myPicks.has(n)} className={phase === "drawing" && i === prev.length - 1 ? "fk-drop" : ""} />
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------ main
export default function FastKeno() {
  const { user, toast, openAuth, openWallet, setBalances, refresh } = useApp();
  const [st, setSt] = useState<FkState | null>(null);
  const [now, setNow] = useState(0);
  const offset = useRef(0);
  const inflight = useRef(false);
  const lastLoad = useRef(0);

  const [picks, setPicks] = useState<number[]>([]);
  const [bet, setBet] = useState("10.00");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("game");
  const [filter, setFilter] = useState<"all" | "mine">("all");
  const [modal, setModal] = useState<null | "help" | "fair">(null);
  const [menu, setMenu] = useState(false);
  const [gear, setGear] = useState(false);
  const [lastPicks, setLastPicks] = useState<number[]>([]);
  const paidRound = useRef<number | null>(null);

  const [history, setHistory] = useState<FkHistoryRow[] | null>(null);
  const [results, setResults] = useState<FkResultRow[] | null>(null);
  const [stats, setStats] = useState<FkStats | null>(null);
  const [openResult, setOpenResult] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (inflight.current) return;
    inflight.current = true;
    lastLoad.current = Date.now();
    const t0 = Date.now();
    const d = await api<FkState>("/api/games/fast-keno");
    const t1 = Date.now();
    inflight.current = false;
    if (d.error || !d.round) return;
    offset.current = d.now - (t0 + t1) / 2;
    setSt(d);
  }, []);

  // clock + initial load
  useEffect(() => {
    const first = setTimeout(load, 0);
    const clock = setInterval(() => setNow(Date.now() + offset.current), 100);
    const poll = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, 2500);
    return () => {
      clearTimeout(first);
      clearInterval(clock);
      clearInterval(poll);
    };
  }, [load]);

  const round = st?.round;
  const phase = round ? fkPhase(round.id, now) : "betting";
  const revealed = round ? (phase === "result" ? FK.draw : fkRevealed(round.id, now)) : 0;
  const drawnVisible = useMemo(() => (round ? round.drawn.slice(0, revealed) : []), [round, revealed]);
  const drawnSet = useMemo(() => new Set(drawnVisible), [drawnVisible]);
  const myTickets = useMemo(() => st?.my.tickets ?? [], [st]);
  const myPickSet = useMemo(() => new Set(myTickets.flatMap((t) => t.picks)), [myTickets]);
  const final = phase === "result" && !!round && round.drawn.length === FK.draw;
  const myWin = useMemo(() => {
    if (!final || !round) return 0;
    return Math.round(myTickets.reduce((s, t) => s + t.bet * fkMultiplier(t.picks.length, fkHits(t.picks, round.drawn)), 0) * 100) / 100;
  }, [final, round, myTickets]);

  // Phase transitions → fetch fresh state right away (round data, draw, seed).
  useEffect(() => {
    if (!round || !now) return;
    const stale = fkRoundIdAt(now) !== round.id || (phase !== "betting" && round.drawn.length === 0) || (phase === "result" && !round.seed);
    if (stale && Date.now() - lastLoad.current > 700) {
      const t = setTimeout(load, 0);
      return () => clearTimeout(t);
    }
  }, [now, round, phase, load]);

  // Round finished → settle my tickets (server side via /api/me) and announce.
  useEffect(() => {
    if (!final || !round || paidRound.current === round.id) return;
    paidRound.current = round.id;
    if (myTickets.length === 0) return;
    const t = setTimeout(() => {
      refresh();
      if (myWin > 0) toast(`Round ${round.id}: you won ${money(myWin)} ${FK.currency}`, "success");
      if (tab === "history") api<{ rows: FkHistoryRow[] }>("/api/games/fast-keno?view=history").then((d) => d.rows && setHistory(d.rows));
    }, 400);
    return () => clearTimeout(t);
  }, [final, round, myTickets, myWin, refresh, toast, tab]);

  // Tab data
  const roundId = round?.id;
  useEffect(() => {
    if (tab === "game") return;
    let cancel = false;
    if (tab === "history") {
      if (!user) return;
      api<{ rows: FkHistoryRow[] }>("/api/games/fast-keno?view=history").then((d) => !cancel && d.rows && setHistory(d.rows));
    } else if (tab === "results") {
      api<{ rows: FkResultRow[] }>("/api/games/fast-keno?view=results").then((d) => !cancel && d.rows && setResults(d.rows));
    } else if (tab === "stats") {
      api<FkStats>("/api/games/fast-keno?view=stats").then((d) => !cancel && d.counts && setStats(d));
    }
    return () => {
      cancel = true;
    };
  }, [tab, roundId, user, final]);

  // ------------------------------------------------------------ actions
  const balance = user ? user.balance + user.bonusBalance : 0;
  const betNum = Number(bet) || 0;
  const clampBet = (x: number) => Math.max(FK.minBet, Math.min(FK.maxBet, Math.round(x * 100) / 100));
  const setBetNum = (x: number) => setBet(clampBet(x).toFixed(2));

  function toggle(n: number) {
    setPicks((p) => {
      if (p.includes(n)) return p.filter((x) => x !== n);
      if (p.length >= FK.maxPicks) {
        toast(`Maximum ${FK.maxPicks} numbers`, "info");
        return p;
      }
      return [...p, n];
    });
  }

  function quickPick(k: number) {
    setPicks(randomPicks(k));
    setGear(false);
  }

  async function placeBet() {
    if (!user) return openAuth("login");
    if (!round || phase !== "betting") return;
    if (picks.length === 0) return toast("Choose at least 1 number", "error");
    const amount = clampBet(betNum);
    if (amount > balance) {
      toast("Insufficient balance. Please deposit.", "error");
      return openWallet("deposit");
    }
    setBusy(true);
    const d = await api<{ ticket: FkTicket & { round: number }; balance: number; bonusBalance: number }>("/api/games/fast-keno", { picks, bet: amount, round: round.id });
    setBusy(false);
    if (d.error) return toast(d.error, "error");
    setBalances(d.balance, d.bonusBalance);
    setLastPicks(picks);
    toast(`Ticket accepted · Round ${d.ticket.round} · ${money(amount)} ${FK.currency}`, "success");
    load();
  }

  // ------------------------------------------------------------ render
  if (!st || !round) {
    return (
      <div className="fk mx-auto flex h-[640px] max-w-[520px] items-center justify-center rounded-2xl">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--fk-green)] border-t-transparent" />
      </div>
    );
  }

  const secsLeft = Math.max(0, Math.ceil((round.betEnd - now) / 1000));
  const nextIn = Math.max(0, Math.ceil((round.end - now) / 1000));
  const hot = new Set(st.hot);
  const cold = new Set(st.cold);
  const feed = filter === "mine" ? myTickets : st.feed.tickets;
  const table = FK_PAYTABLE[picks.length];

  return (
    <div className="fk relative mx-auto max-w-[520px] overflow-hidden rounded-2xl pb-3 text-white" onClick={() => { setMenu(false); setGear(false); }}>
      {/* ---------------- header */}
      <div className="flex items-center gap-2 px-2.5 pb-1 pt-3">
        <div className="select-none leading-[0.82]" style={{ fontStyle: "italic", fontWeight: 900 }}>
          <div className="text-[25px] tracking-tight text-[#e9eef0]" style={{ WebkitTextStroke: "0.5px #6b7479", textShadow: "0 2px 0 #0b0d0e" }}>FAST</div>
          <div className="text-[27px] tracking-tight text-[var(--fk-green)]" style={{ textShadow: "0 2px 0 #0b0d0e" }}>KENO</div>
        </div>
        <div className="ml-1 flex h-11 min-w-0 flex-1 items-center rounded-full bg-[#1a2a22] ring-1 ring-[var(--fk-green)]/35">
          <button onClick={(e) => { e.stopPropagation(); if (!user) openAuth("login"); else openWallet("deposit"); }} className="flex h-full shrink-0 items-baseline gap-1 whitespace-nowrap border-r border-[var(--fk-green)]/25 pl-3 pr-2 pt-2.5 text-left sm:pl-4 sm:pr-3">
            <span className="text-[clamp(14px,4.4vw,20px)] text-[var(--fk-yellow)]" style={{ fontStretch: "normal", fontFamily: "ui-sans-serif, system-ui" }}>{money(balance)}</span>
            <span className="text-xs text-white/80" style={{ fontFamily: "ui-sans-serif, system-ui" }}>{FK.currency}</span>
          </button>
          <button onClick={(e) => { e.stopPropagation(); setModal("fair"); }} className="ml-auto flex min-w-0 items-center gap-1.5 whitespace-nowrap pl-2 pr-2 text-[clamp(13px,4vw,18px)] text-white/95" style={{ fontFamily: "ui-sans-serif, system-ui" }} title="Provably fair">
            ID: {round.id} {Ico.shield}
          </button>
        </div>
        <div className="relative">
          <button onClick={(e) => { e.stopPropagation(); setMenu((m) => !m); setGear(false); }} className="grid h-10 w-10 place-items-center text-[var(--fk-green)]" aria-label="Menu">{Ico.menu}</button>
          {menu && (
            <div className="absolute right-0 top-11 z-30 w-52 overflow-hidden rounded-xl bg-[#2a2f33] py-1 text-lg shadow-2xl ring-1 ring-white/10" onClick={(e) => e.stopPropagation()}>
              {[
                ["How to play", () => setModal("help")],
                ["Provably fair", () => setModal("fair")],
                ["My bets", () => setTab("history")],
                ["Deposit", () => (user ? openWallet("deposit") : openAuth("login"))],
              ].map(([label, fn]) => (
                <button key={label as string} onClick={() => { (fn as () => void)(); setMenu(false); }} className="block w-full px-4 py-2 text-left font-bold text-white/90 hover:bg-white/5">{label as string}</button>
              ))}
            </div>
          )}
        </div>
        <a href={BRAND.telegramSupport} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center text-[var(--fk-green)]" aria-label="Chat support">{Ico.chat}</a>
      </div>

      {/* ---------------- betting phase */}
      {phase === "betting" ? (
        <>
          <div className="relative -mt-1 flex h-9 items-center justify-center">
            <div className="fk-timer-glow absolute left-1/2 top-1/2 h-14 w-56 -translate-x-1/2 -translate-y-1/2" />
            <SevenSeg text={`${pad(Math.floor(secsLeft / 60))} : ${pad(secsLeft % 60)}`} h={24} color={secsLeft <= 5 ? "#ff6b6b" : "#eef3f4"} className="relative" />
          </div>

          {/* info card */}
          <div className="relative mx-2.5 mt-1.5 overflow-hidden rounded-xl bg-[var(--fk-panel)] sm:ml-[74px]">
            <svg viewBox="0 0 300 120" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
              <g fill="none" stroke="#3a7a5a" strokeOpacity=".3" strokeWidth="3">
                <circle cx="210" cy="95" r="70" strokeDasharray="120 40" />
                <circle cx="210" cy="95" r="110" strokeDasharray="200 60" strokeOpacity=".18" />
              </g>
            </svg>
            <button onClick={() => setModal("help")} className="absolute right-2.5 top-2.5 z-10 grid h-9 w-9 place-items-center rounded-full bg-[#34403d] text-2xl font-bold text-[var(--fk-green)]" aria-label="How to play">?</button>
            <div className="relative flex min-h-[132px] items-center gap-3 px-3 py-3">
              <div className="relative h-[108px] w-[92px] shrink-0">
                <Ball n={80} size={30} className="absolute left-1 top-0" />
                <Ball n={10} size={46} className="absolute left-[46px] top-[-6px]" />
                <Ball n={1} size={66} green className="absolute bottom-0 left-0" />
              </div>
              {picks.length === 0 ? (
                <div>
                  <div className="text-[clamp(22px,7.4vw,34px)] font-bold leading-tight text-white">Choose {FK.maxPicks} numbers</div>
                  <div className="text-[clamp(18px,5.8vw,26px)] font-bold text-[var(--fk-green)]">From 1 to {FK.numbers}</div>
                </div>
              ) : (
                <div className="min-w-0 flex-1 pr-8">
                  <div className="text-[clamp(20px,6vw,26px)] font-bold leading-tight text-white">{picks.length} of {FK.maxPicks} selected</div>
                  <div className="mt-1.5 flex gap-1 overflow-x-auto no-scrollbar">
                    {table.map((m, h) => ({ m, h })).filter((x) => x.m > 0).map(({ m, h }) => (
                      <div key={h} className="min-w-[52px] rounded-md bg-black/30 px-1.5 py-1 text-center">
                        <div className="text-sm font-bold leading-none text-white/60">{h} hit{h > 1 ? "s" : ""}</div>
                        <div className="text-lg font-extrabold leading-tight text-[var(--fk-green)]">x{m}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* board */}
          <div className="mt-3 grid grid-cols-10 gap-[5px] px-2.5">
            {Array.from({ length: FK.numbers }, (_, i) => i + 1).map((n) => {
              const on = picks.includes(n);
              return (
                <button key={n} onClick={() => toggle(n)} className={`relative flex aspect-[1.08/1] items-center justify-center rounded-md text-[clamp(15px,5.2vw,24px)] font-bold transition-colors ${on ? "fk-tile-on" : "fk-tile"}`}>
                  {!on && (hot.has(n) || cold.has(n)) && (
                    <span className={`absolute left-[3px] top-[3px] h-2 w-2 rounded-full ${hot.has(n) ? "bg-[#ef4d4d]" : "bg-[#7cc8f2]"}`} />
                  )}
                  {n}
                </button>
              );
            })}
          </div>

          {/* bet controls */}
          <div className="relative mt-3 flex gap-1.5 px-2.5" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-[60px] flex-1 items-center rounded-lg bg-[var(--fk-panel)]">
              <button onClick={() => setBetNum([...BET_STEPS].reverse().find((s) => s < betNum) ?? FK.minBet)} className="grid h-full w-10 shrink-0 place-items-center text-4xl font-light text-white/60 hover:text-white sm:w-14" aria-label="Decrease bet">−</button>
              <input
                value={bet}
                inputMode="decimal"
                onChange={(e) => setBet(e.target.value.replace(/[^0-9.]/g, ""))}
                onBlur={() => setBetNum(betNum || FK.minBet)}
                className="w-full min-w-0 bg-transparent text-center text-[clamp(20px,6.6vw,30px)] text-white outline-none"
                style={{ fontFamily: "ui-sans-serif, system-ui", fontStretch: "normal" }}
                aria-label="Bet amount"
              />
              <button onClick={() => setBetNum(BET_STEPS.find((s) => s > betNum) ?? FK.maxBet)} className="grid h-full w-10 shrink-0 place-items-center text-4xl font-light text-white/60 hover:text-white sm:w-14" aria-label="Increase bet">+</button>
            </div>
            <button onClick={() => setBetNum(betNum * 2)} className="h-[60px] w-[clamp(48px,14vw,72px)] shrink-0 rounded-lg bg-[var(--fk-panel)] text-[clamp(18px,5.6vw,26px)] font-medium text-[var(--fk-green)] sm:w-[72px]" style={{ fontFamily: "ui-sans-serif, system-ui" }}>X2</button>
            <button onClick={() => setBetNum(user ? Math.max(FK.minBet, Math.min(FK.maxBet, Math.floor(balance * 100) / 100)) : FK.maxBet)} className="h-[60px] w-[clamp(48px,14vw,72px)] shrink-0 rounded-lg bg-[var(--fk-panel)] text-[clamp(16px,5.2vw,24px)] font-medium text-[var(--fk-green)] sm:w-[72px]" style={{ fontFamily: "ui-sans-serif, system-ui" }}>MAX</button>
            <button onClick={() => { setGear((g) => !g); setMenu(false); }} className={`grid h-[60px] w-[clamp(48px,14vw,72px)] shrink-0 place-items-center rounded-lg text-[var(--fk-green)] ${gear ? "bg-[#34403d]" : "bg-[var(--fk-panel)]"}`} aria-label="Options">{Ico.gear}</button>
            {gear && (
              <div className="absolute bottom-[68px] right-2.5 z-30 w-[300px] rounded-xl bg-[#2a2f33] p-3 shadow-2xl ring-1 ring-white/10">
                <div className="mb-1.5 text-base font-bold uppercase text-white/60">Quick pick</div>
                <div className="grid grid-cols-5 gap-1">
                  {Array.from({ length: FK.maxPicks }, (_, i) => i + 1).map((k) => (
                    <button key={k} onClick={() => quickPick(k)} className="fk-tile h-10 rounded-md text-lg font-bold">{k}</button>
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-1">
                  <button onClick={() => { setPicks([]); setGear(false); }} className="h-10 rounded-md bg-white/5 text-base font-bold text-white/80 hover:bg-white/10">Clear</button>
                  <button disabled={!lastPicks.length} onClick={() => { setPicks(lastPicks); setGear(false); }} className="h-10 rounded-md bg-white/5 text-base font-bold text-white/80 hover:bg-white/10 disabled:opacity-40">Repeat last</button>
                </div>
              </div>
            )}
          </div>
          <div className="px-2.5">
            <button onClick={placeBet} disabled={busy || (!!user && picks.length === 0) || secsLeft < 1} className="fk-bet-btn mt-2 h-[72px] w-full rounded-lg text-[36px] font-medium sm:h-[80px] sm:text-[40px]" style={{ fontFamily: "ui-sans-serif, system-ui", fontStretch: "normal" }}>
              {busy ? "…" : "BET"}
            </button>
          </div>
        </>
      ) : (
        <DrawStage drawn={drawnVisible} total={FK.draw} phase={phase} myPicks={myPickSet} myWin={myWin} myStake={st.my.stake} nextIn={nextIn} roundId={round.id} />
      )}

      {/* ---------------- tabs */}
      <div className="mt-4 flex justify-between gap-1 px-3">
        {([
          ["game", "GAME", Ico.play],
          ["history", "HISTORY", Ico.history],
          ["results", "RESULTS", Ico.check],
          ["stats", "STATISTICS", Ico.stats],
        ] as const).map(([k, label, icon]) => (
          <button key={k} onClick={() => setTab(k)} className={`flex items-center gap-1 whitespace-nowrap border-b-[3px] pb-1 text-[clamp(13px,4.2vw,22px)] [&_svg]:h-[1.1em] [&_svg]:w-[1.1em] ${tab === k ? "border-[var(--fk-green)] text-[var(--fk-green)]" : "border-transparent text-[var(--fk-green)]/90"}`} style={{ fontFamily: "ui-sans-serif, system-ui", fontStretch: "normal" }}>
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* ---------------- tab content */}
      <div className="mt-3 px-2.5">
        {tab === "game" && (
          <>
            <div className="mb-2 flex items-center justify-between px-1.5 text-[clamp(15px,4.6vw,20px)]" style={{ fontFamily: "ui-sans-serif, system-ui", fontStretch: "normal" }}>
              <button onClick={() => setFilter("all")} className={filter === "all" ? "text-white" : "text-white/55"}>All <span className="ml-1 text-[var(--fk-green)]">{st.feed.total}</span></button>
              <button onClick={() => setFilter("mine")} className={filter === "mine" ? "text-white" : "text-white/55"}>My Tickets <span className="ml-1 text-[var(--fk-green)]">{myTickets.length}</span></button>
              <span className="text-white/55">My Bets <span className="ml-1 text-[var(--fk-green)]">{st.my.stake % 1 ? money(st.my.stake) : st.my.stake}</span></span>
            </div>
            <div className="space-y-2">
              {feed.length === 0 && <div className="rounded-xl bg-[var(--fk-panel)] py-8 text-center text-xl text-white/50">{filter === "mine" ? "You have no tickets in this round" : "No tickets yet"}</div>}
              {feed.map((t) => <TicketCard key={t.id} t={t} drawn={drawnSet} final={final} />)}
            </div>
          </>
        )}

        {tab === "history" && (
          !user ? (
            <button onClick={() => openAuth("login")} className="fk-bet-btn w-full rounded-lg py-4 text-2xl">Log in to see your bets</button>
          ) : !history ? <Loading /> : history.length === 0 ? (
            <div className="rounded-xl bg-[var(--fk-panel)] py-8 text-center text-xl text-white/50">No bets yet</div>
          ) : (
            <div className="space-y-2">
              {history.map((h) => {
                const d = new Set(h.drawn ?? []);
                return (
                  <TicketCard
                    key={h.id}
                    t={{ picks: h.picks, bet: h.bet }}
                    drawn={d}
                    final={h.status !== "active"}
                    head={
                      <span className="flex w-full items-center justify-between gap-2 text-lg">
                        <span>Round {h.round}</span>
                        <span className="text-base font-medium text-white/50" suppressHydrationWarning>
                          {h.hits != null && <span className="mr-2 text-white/80">{h.hits}/{h.picks.length} hits · x{h.multiplier}</span>}
                          {new Date(h.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </span>
                    }
                  />
                );
              })}
            </div>
          )
        )}

        {tab === "results" && (
          !results ? <Loading /> : (
            <div className="space-y-2">
              {results.map((r) => (
                <div key={r.id} className="rounded-xl bg-[var(--fk-panel)] p-2">
                  <button onClick={() => setOpenResult(openResult === r.id ? null : r.id)} className="mb-1.5 flex w-full items-center justify-between px-0.5 text-xl font-bold">
                    <span className="text-[var(--fk-green)]">ID: {r.id}</span>
                    <span className="text-base font-medium text-white/50" suppressHydrationWarning>{new Date(r.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ▾</span>
                  </button>
                  <div className="grid grid-cols-10 gap-1">
                    {r.drawn.map((n, i) => (
                      <div key={i} className="flex justify-center"><Ball n={n} size={30} green={i === 0} /></div>
                    ))}
                  </div>
                  {openResult === r.id && (
                    <div className="mt-2 space-y-1 break-all rounded-md bg-black/30 p-2 font-mono text-[11px] text-white/60">
                      <div><span className="text-white/40">Seed: </span>{r.seed}</div>
                      <div><span className="text-white/40">Hash: </span>{r.hash}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        {tab === "stats" && (!stats ? <Loading /> : <Statistics s={stats} />)}
      </div>

      {modal === "help" && (
        <Modal title="How to play" onClose={() => setModal(null)}>
          <ol className="mb-4 list-decimal space-y-1.5 pl-5 text-lg text-white/85">
            <li>Choose 1 to {FK.maxPicks} numbers from 1 to {FK.numbers} (or use ⚙ quick pick).</li>
            <li>Set your stake ({FK.minBet}–{FK.maxBet.toLocaleString()} {FK.currency}) and press <b>BET</b> before the timer ends. You can place up to {FK.maxTicketsPerRound} tickets per round.</li>
            <li>{FK.draw} balls are drawn — one every {FK.ballMs / 1000}s. Every matched number is a <span className="font-bold text-[var(--fk-green)]">hit</span>.</li>
            <li>Your win = stake × multiplier from the paytable. Winnings are credited automatically.</li>
          </ol>
          <div className="mb-3 flex gap-4 text-base text-white/70">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#ef4d4d]" /> Hot numbers</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#7cc8f2]" /> Cold numbers</span>
            <span className="text-white/40">(last 50 rounds)</span>
          </div>
          <h4 className="mb-2 text-lg font-bold uppercase text-white/60">Paytable</h4>
          <Paytable initial={picks.length} />
        </Modal>
      )}

      {modal === "fair" && (
        <Modal title="Provably fair" onClose={() => setModal(null)}>
          <div className="space-y-3 text-base text-white/80">
            <p>Before betting opens, the SHA-256 hash of the round&apos;s secret seed is published. After the draw the seed is revealed, so you can check that the result was fixed in advance and never changed.</p>
            <div className="rounded-lg bg-black/30 p-3">
              <div className="text-sm font-bold uppercase text-white/50">Round {round.id} — hash</div>
              <div className="break-all font-mono text-xs text-[var(--fk-green)]">{round.hash}</div>
              {round.seed && (
                <>
                  <div className="mt-2 text-sm font-bold uppercase text-white/50">Seed</div>
                  <div className="break-all font-mono text-xs text-white/80">{round.seed}</div>
                </>
              )}
            </div>
            <p className="text-sm text-white/60">
              Verify: <code className="text-white/80">sha256(seed) = hash</code>. Balls come from a Fisher–Yates shuffle of 1–80: for step i = 0…19, take
              <code className="text-white/80"> parseInt(sha256(seed + &quot;:&quot; + i).slice(0, 8), 16) mod (80 − i)</code> as the index into the remaining numbers.
              Seeds of past rounds are listed in the <b>Results</b> tab.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Loading() {
  return <div className="flex justify-center py-8"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--fk-green)] border-t-transparent" /></div>;
}

function Statistics({ s }: { s: FkStats }) {
  const nums = Array.from({ length: FK.numbers }, (_, i) => i + 1);
  const hot = [...nums].sort((a, b) => s.counts[b] - s.counts[a] || a - b).slice(0, 10);
  const cold = [...nums].sort((a, b) => s.counts[a] - s.counts[b] || a - b).slice(0, 10);
  const max = Math.max(...nums.map((n) => s.counts[n]));
  const min = Math.min(...nums.map((n) => s.counts[n]));
  const total = s.rounds * FK.draw;
  return (
    <div className="space-y-3">
      <div className="text-center text-base text-white/50">Last {s.rounds} rounds</div>
      {[["Hot numbers", hot, "#ef4d4d"], ["Cold numbers", cold, "#7cc8f2"]].map(([title, list, c]) => (
        <div key={title as string} className="rounded-xl bg-[var(--fk-panel)] p-2.5">
          <div className="mb-2 flex items-center gap-2 text-xl font-bold"><span className="h-2.5 w-2.5 rounded-full" style={{ background: c as string }} />{title as string}</div>
          <div className="grid grid-cols-10 gap-1">
            {(list as number[]).map((n) => (
              <div key={n} className="flex flex-col items-center gap-0.5">
                <Ball n={n} size={30} />
                <span className="text-sm font-bold" style={{ color: c as string }}>{s.counts[n]}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="space-y-3 rounded-xl bg-[var(--fk-panel)] p-3">
        <RatioBar l="Odd" r="Even" a={s.odd} b={s.even} total={total} />
        <RatioBar l="1–40" r="41–80" a={s.low} b={s.high} total={total} />
      </div>
      <div className="rounded-xl bg-[var(--fk-panel)] p-2.5">
        <div className="mb-2 text-xl font-bold">Frequency</div>
        <div className="grid grid-cols-10 gap-1">
          {nums.map((n) => {
            const k = max === min ? 0.5 : (s.counts[n] - min) / (max - min);
            return (
              <div key={n} className="flex aspect-square flex-col items-center justify-center rounded-md" style={{ background: `rgba(76,194,126,${0.08 + k * 0.55})` }}>
                <span className="text-base font-bold leading-none">{n}</span>
                <span className="text-[11px] leading-none text-white/60">{s.counts[n]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RatioBar({ l, r, a, b, total }: { l: string; r: string; a: number; b: number; total: number }) {
  return (
    <div>
      <div className="flex justify-between text-lg font-bold">
        <span>{l} <span className="text-[var(--fk-green)]">{Math.round((a / total) * 100)}%</span></span>
        <span><span className="text-[#7cc8f2]">{Math.round((b / total) * 100)}%</span> {r}</span>
      </div>
      <div className="mt-1 flex h-2.5 overflow-hidden rounded-full bg-black/30">
        <div className="bg-[var(--fk-green)]" style={{ width: `${(a / total) * 100}%` }} />
        <div className="flex-1 bg-[#7cc8f2]" />
      </div>
    </div>
  );
}

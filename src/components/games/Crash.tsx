"use client";

/*
 * Aviator-style crash skin (mirrors the classic Spribe layout):
 *  - dark shell header with the red wordmark + balance + menu
 *  - left "All Bets / Previous / Top" rail with ring avatars & masked names
 *  - coloured multiplier history strip
 *  - black sunburst stage, red plane riding a rising curve, big multiplier
 *  - dual bet panels (Bet / Auto) with steppers, quick chips and green buttons
 *  - provably-fair footer
 */

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { api, useApp } from "../AppProvider";
import { crashMultiplierAt, type Game } from "@/lib/games";
import { fmt, r2 } from "@/lib/brand";

type PanelStatus = "idle" | "waiting" | "flying" | "cashed" | "crashed";

type Panel = {
  bet: string;
  auto: string;
  tab: "bet" | "auto";
  autoCash: boolean;
  autoBet: boolean;
  roundId: number | null;
  status: PanelStatus;
  placedBet: number;
  result: { m: number; win?: number } | null;
  busy: boolean;
};

type SimBet = {
  name: string;
  seed: number;
  bet: number;
  target: number | null; // multiplier at which the simulated player cashes out
  x: number | null;
  win: number | null;
};

type HistRow = { id: number; bet: number; payout: number; multiplier: number; status: string; createdAt: string };

const newPanel = (): Panel => ({
  bet: "5",
  auto: "2.00",
  tab: "bet",
  autoCash: false,
  autoBet: false,
  roundId: null,
  status: "idle",
  placedBet: 0,
  result: null,
  busy: false,
});

const rnd = Math.random;
const pick = <T,>(a: readonly T[]) => a[Math.floor(rnd() * a.length)];
const irnd = (n: number) => Math.floor(rnd() * n);
const maskedName = () => `${1 + irnd(9)}***${1 + irnd(9)}`;
const genCrashLike = () => Math.min(200, Math.floor((0.97 / (1 - rnd())) * 100) / 100);
const etb = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const STEPS = [1, 5, 10, 16, 40, 80, 400, 800, 1600, 5000, 10000] as const;
const CHIPS = [16, 40, 80, 400] as const;
const stepDown = (n: number) => [...STEPS].reverse().find((v) => v < n) ?? 1;
const stepUp = (n: number) => STEPS.find((v) => v > n) ?? 10000;

function makeSimBets(n: number): SimBet[] {
  return Array.from({ length: n }, () => {
    const u = rnd();
    const target = u < 0.45 ? r2(1.01 + rnd() * 0.9) : u < 0.75 ? r2(2 + rnd() * 3) : u < 0.9 ? r2(5 + rnd() * 8) : null;
    return { name: maskedName(), seed: irnd(6), bet: pick(CHIPS) * (1 + irnd(4)) + irnd(4), target, x: null, win: null };
  });
}

const seedStrip = () =>
  Array.from({ length: 18 }, (_, i) => (i % 7 === 3 ? r2(10 + rnd() * 180) : genCrashLike()));

const multClass = (m: number) =>
  m >= 10 ? "text-[#f0479f]" : m >= 2 ? "text-[#9d8cff]" : "text-[#53b7f0]";

/* ------------------------------------------------------------------ pieces */

function Plane({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 64" className={className} fill="currentColor" aria-hidden>
      <path d="M6 40c16-7 40-11 60-11 9 0 17 3 24 8-6 5-16 8-28 8-22 0-42-2-56-5Z" />
      <path d="M14 37 4 22l8 2 10 12Z" />
      <path d="M40 31 27 10h8l15 20Z" />
      <path d="M44 44l-8 14h8l10-13Z" />
      <path d="M88 22h4v32h-4z" />
      <path d="M86 34c5 0 8 2 8 4s-3 4-8 4Z" />
    </svg>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5Zm-1.2 13.6-3-3 1.4-1.4 1.6 1.6 4-4 1.4 1.4Z" />
    </svg>
  );
}

function RingAvatar({ seed, size = 20, className = "" }: { seed: number; size?: number; className?: string }) {
  const hue = [145, 132, 160, 118, 96, 172][seed % 6];
  return (
    <span
      className={`inline-block shrink-0 rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 50% 45%, #0c130d 0 46%, hsl(${hue} 72% 52%) 52% 78%, hsl(${hue} 75% 32%) 82% 100%)`,
        boxShadow: `0 0 6px hsl(${hue} 80% 45% / 0.65)`,
      }}
    />
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition ${on ? "bg-[#45d000]" : "bg-[#3a3a3a]"}`}
    >
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
    </button>
  );
}

type PrimaryBtn = { label: ReactNode; cls: string; onClick: () => void; disabled?: boolean };

/** One of the two Aviator-style bet panels (Bet / Auto tabs, stepper, chips). */
function BetPanel({
  p,
  disabledInputs,
  primary,
  onPatch,
  onStep,
}: {
  p: Panel;
  disabledInputs: boolean;
  primary: PrimaryBtn;
  onPatch: (patch: Partial<Panel>) => void;
  onStep: (dir: -1 | 1) => void;
}) {
  return (
    <div className="rounded-lg bg-[#232323] p-2">
      <div className="flex justify-center gap-1 pb-2">
        {(["bet", "auto"] as const).map((t) => (
          <button
            key={t}
            onClick={() => onPatch({ tab: t })}
            className={`min-w-16 rounded-md px-4 py-1 text-[13px] font-bold capitalize ${p.tab === t ? "bg-[#3d3d3d] text-white" : "text-[#8f8f8f] hover:text-white"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {p.tab === "bet" ? (
          <div className="w-[46%] shrink-0">
            <div className="flex items-center gap-1 rounded-md bg-[#1a1a1a] p-1">
              <button
                disabled={disabledInputs}
                onClick={() => onStep(-1)}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#3a3a3a] text-base font-black text-[#d6d6d6] hover:bg-[#4a4a4a] disabled:opacity-40"
                aria-label="Decrease bet"
              >
                −
              </button>
              <input
                value={p.bet}
                disabled={disabledInputs}
                inputMode="decimal"
                onChange={(e) => onPatch({ bet: e.target.value })}
                className="w-full min-w-0 bg-transparent text-center text-[15px] font-bold text-white outline-none"
              />
              <button
                disabled={disabledInputs}
                onClick={() => onStep(1)}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#3a3a3a] text-base font-black text-[#d6d6d6] hover:bg-[#4a4a4a] disabled:opacity-40"
                aria-label="Increase bet"
              >
                +
              </button>
            </div>
            <div className="mt-1 grid grid-cols-2 gap-1">
              {CHIPS.map((v) => (
                <button
                  key={v}
                  disabled={disabledInputs}
                  onClick={() => onPatch({ bet: String(v) })}
                  className="rounded-md bg-[#3a3a3a] py-0.5 text-xs font-bold text-[#c9c9c9] hover:bg-[#4a4a4a] disabled:opacity-40"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex w-[46%] shrink-0 flex-col justify-center gap-2 rounded-md bg-[#1a1a1a] p-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#bdbdbd]">Auto Cash Out</span>
              <Toggle on={p.autoCash} onChange={(v) => onPatch({ autoCash: v })} />
            </div>
            <input
              value={p.auto}
              disabled={disabledInputs}
              inputMode="decimal"
              onChange={(e) => onPatch({ auto: e.target.value })}
              className="rounded-md bg-[#2e2e2e] px-2 py-1 text-center text-sm font-bold text-white outline-none focus:ring-1 focus:ring-[#45d000]"
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#bdbdbd]">Auto Bet</span>
              <Toggle on={p.autoBet} onChange={(v) => onPatch({ autoBet: v })} />
            </div>
          </div>
        )}
        <button
          onClick={primary.onClick}
          disabled={primary.disabled}
          className={`flex-1 rounded-lg py-2 text-[17px] font-extrabold leading-tight ${primary.cls}`}
        >
          {primary.label}
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- main */

export default function Crash({ game }: { game: Game }) {
  const { user, refresh, toast, setBalances, openAuth } = useApp();

  const [panels, setPanels] = useState<Panel[]>([newPanel(), newPanel()]);
  const [flight, setFlight] = useState<{ startAt: number | null; crash: number | null }>({ startAt: null, crash: null });
  const [elapsed, setElapsed] = useState(0);
  const [strip, setStrip] = useState<number[]>(seedStrip);
  const [sim, setSim] = useState<SimBet[]>(() => makeSimBets(10));
  const [side, setSide] = useState(() => typeof window === "undefined" || window.innerWidth >= 1024);
  const [tab, setTab] = useState<"all" | "prev" | "top">("all");
  const [prevRows, setPrevRows] = useState<HistRow[]>([]);

  const panelsRef = useRef(panels);
  const flightRef = useRef(flight);
  const multRef = useRef(1);
  const crashRef = useRef<number | null>(null);
  const userRef = useRef(user);
  const autoBetTimers = useRef<Record<string, number>>({});
  useEffect(() => {
    panelsRef.current = panels;
    flightRef.current = flight;
    userRef.current = user;
  }, [panels, flight, user]);

  const setPanel = (i: number, patch: Partial<Panel>) =>
    setPanels((ps) => ps.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  /* flight clock */
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const f = flightRef.current;
      if (f.startAt != null) {
        const e = performance.now() - f.startAt;
        setElapsed(e);
        const raw = crashMultiplierAt(Math.max(0, e));
        multRef.current = f.crash != null ? Math.min(raw, f.crash) : raw;
        if (e >= 0 && panelsRef.current.some((p) => p.status === "waiting"))
          setPanels((ps) => ps.map((p) => (p.status === "waiting" ? { ...p, status: "flying" } : p)));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const mult = flight.crash != null ? Math.min(flight.crash, crashMultiplierAt(Math.max(0, elapsed))) : crashMultiplierAt(Math.max(0, elapsed));
  const anyWaiting = panels.some((p) => p.status === "waiting");
  const anyFlying = panels.some((p) => p.status === "flying");
  const phase: "idle" | "waiting" | "flying" | "crashed" =
    flight.crash != null ? "crashed" : anyFlying ? "flying" : anyWaiting ? "waiting" : flight.startAt != null && elapsed >= 0 ? "flying" : "idle";

  /* simulated players cash out while the plane climbs */
  useEffect(() => {
    if (phase !== "flying") return;
    const t = setInterval(() => {
      const m = multRef.current;
      setSim((list) => {
        let changed = false;
        const next = list.map((s) => {
          if (s.x == null && s.target != null && s.target <= m) {
            changed = true;
            return { ...s, x: s.target, win: r2(s.bet * s.target) };
          }
          return s;
        });
        return changed ? next : list;
      });
    }, 200);
    return () => clearInterval(t);
  }, [phase]);

  /* back to the lobby look a moment after the crash */
  useEffect(() => {
    if (flight.crash == null) return;
    const t = setTimeout(() => {
      if (panelsRef.current.some((p) => p.status === "waiting" || p.status === "flying")) return;
      crashRef.current = null;
      setFlight({ startAt: null, crash: null });
      setElapsed(0);
      setSim(makeSimBets(8 + irnd(6)));
      setPanels((ps) => ps.map((p) => (p.status === "cashed" || p.status === "crashed" ? { ...p, status: "idle", result: null } : p)));
    }, 3200);
    return () => clearTimeout(t);
  }, [flight.crash]);

  /* my previous bets (sidebar tab) */
  useEffect(() => {
    if (tab !== "prev" || !user) return;
    let cancelled = false;
    api<{ rows: HistRow[] }>(`/api/history?kind=games&game=${game.slug}`).then((d) => {
      if (!cancelled) setPrevRows(d.rows ?? []);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, user?.id, game.slug]);

  const start = async (i: number) => {
    const p = panelsRef.current[i];
    if (!userRef.current) return openAuth("login");
    if (p.status === "waiting" || p.status === "flying" || p.busy) return;
    const autoVal = p.autoCash && Number(p.auto) >= 1.01 ? Number(p.auto) : null;
    const stake = Number(p.bet) || 0;
    setPanel(i, { busy: true });
    const d = await api<{ roundId: number; startsIn: number; balance: number; bonusBalance: number }>("/api/games/crash", {
      action: "start",
      game: game.slug,
      bet: stake,
      auto: autoVal,
    });
    setPanel(i, { busy: false });
    if (d.error) return toast(d.error, "error");
    setBalances(d.balance, d.bonusBalance);
    setPanel(i, { roundId: d.roundId, status: "waiting", placedBet: stake, result: null });
    if (flightRef.current.startAt == null || flightRef.current.crash != null) {
      crashRef.current = null;
      setFlight({ startAt: performance.now() + d.startsIn, crash: null });
      setSim(makeSimBets(8 + irnd(8)));
    }
  };

  const cashout = async (i: number) => {
    const p = panelsRef.current[i];
    if (!p.roundId || p.busy) return;
    setPanel(i, { busy: true });
    const d = await api<{ status: string; multiplier?: number; payout?: number; crashPoint?: number }>("/api/games/crash", {
      action: "cashout",
      game: game.slug,
      roundId: p.roundId,
    });
    setPanel(i, { busy: false });
    if (d.status === "won") {
      setPanel(i, { status: "cashed", result: { m: d.multiplier!, win: d.payout }, roundId: null });
      toast(`Cashed out at ${d.multiplier!.toFixed(2)}x · +${fmt(d.payout ?? 0)}`, "success");
      refresh();
    } else if (d.status === "crashed") {
      handleCrash(d.crashPoint!);
      setPanel(i, { status: "crashed", result: { m: d.crashPoint! }, roundId: null });
      refresh();
    }
  };

  const cancel = async (i: number) => {
    const p = panelsRef.current[i];
    if (!p.roundId || p.busy) return;
    setPanel(i, { busy: true });
    const d = await api<{ status: string }>("/api/games/crash", { action: "cancel", game: game.slug, roundId: p.roundId });
    setPanel(i, { busy: false, roundId: null, status: d.status === "cancelled" ? "idle" : p.status });
    if (d.status === "cancelled") {
      refresh();
      const others = panelsRef.current.some((x, idx) => idx !== i && (x.status === "waiting" || x.status === "flying"));
      if (!others) {
        crashRef.current = null;
        setFlight({ startAt: null, crash: null });
        setElapsed(0);
      }
    }
  };

  function handleCrash(cp: number) {
    if (crashRef.current != null) return;
    crashRef.current = cp;
    setFlight((f) => ({ ...f, crash: cp }));
    setStrip((s) => [cp, ...s].slice(0, 24));
  }

  /* poll every active panel round */
  const pollKey = panels.map((p) => `${p.roundId ?? 0}:${p.status}`).join("|");
  useEffect(() => {
    const active = panelsRef.current
      .map((p, i) => ({ p, i }))
      .filter(({ p }) => p.roundId != null && (p.status === "waiting" || p.status === "flying"));
    if (!active.length) return;
    const t = setInterval(async () => {
      for (const { p, i } of active) {
        const d = await api<{ status: string; crashPoint?: number; multiplier?: number; payout?: number }>("/api/games/crash", {
          action: "status",
          game: game.slug,
          roundId: p.roundId,
        });
        const cur = panelsRef.current[i];
        if (!cur.roundId || (cur.status !== "waiting" && cur.status !== "flying")) continue;
        if (d.status === "crashed") {
          handleCrash(d.crashPoint!);
          setPanel(i, { status: "crashed", result: { m: d.crashPoint! }, roundId: null });
          refresh();
        } else if (d.status === "won") {
          setPanel(i, { status: "cashed", result: { m: d.multiplier!, win: d.payout }, roundId: null });
          toast(`Auto cash-out at ${d.multiplier!.toFixed(2)}x · +${fmt(d.payout ?? 0)}`, "success");
          refresh();
        }
      }
    }, 250);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollKey, game.slug]);

  /* auto-bet: re-stake shortly after a settle */
  useEffect(() => {
    panels.forEach((p, i) => {
      if ((p.status === "cashed" || p.status === "crashed") && p.autoBet && p.roundId == null && userRef.current) {
        const key = `ab${i}`;
        if ((autoBetTimers.current as Record<string, number>)[key]) return;
        (autoBetTimers.current as Record<string, number>)[key] = window.setTimeout(() => {
          delete (autoBetTimers.current as Record<string, number>)[key];
          if (panelsRef.current[i].autoBet) void start(i);
        }, 1000);
      }
    });
  });
  useEffect(() => () => Object.values(autoBetTimers.current).forEach(clearTimeout), []);

  /* stage geometry */
  const secs = Math.max(0, elapsed) / 1000;
  const px = 6 + 76 * (1 - Math.exp(-secs / 12));
  const py = 90 - 76 * (1 - Math.exp(-(mult - 1) / 2.6));
  const showCurve = (phase === "flying" || phase === "crashed") && flight.startAt != null && elapsed >= 0;

  /* sidebar rows */
  const myRows = panels
    .filter((p) => p.status !== "idle")
    .map((p) => ({
      name: "You",
      seed: 0,
      bet: p.placedBet || Number(p.bet) || 0,
      x: p.status === "cashed" ? p.result?.m ?? null : null,
      win: p.status === "cashed" ? p.result?.win ?? null : null,
      me: true,
    }));
  const rows = [...myRows, ...sim.map((s) => ({ ...s, me: false }))];
  const settled = rows.filter((r) => r.x != null || phase === "crashed");
  const totalWin = rows.reduce((a, r) => a + (r.win ?? 0), 0);
  const liveCount = sim.filter((s) => s.x == null).length + panels.filter((p) => p.status === "flying").length;

  const topList = useMemo(
    () =>
      Array.from({ length: 12 }, () => {
        const x = r2(4 + rnd() * 160);
        const bet = pick(CHIPS) * (1 + irnd(6));
        return { name: maskedName(), seed: irnd(6), x, win: r2(bet * x) };
      }).sort((a, b) => b.win - a.win),
    []
  );

  /* ------------------------------------------------------------ bet panel */
  const primaryFor = (p: Panel, i: number): PrimaryBtn => {
    const stake = Number(p.bet) || 0;
    if (!user) return { label: "Log in to play", cls: "avia-betbtn", onClick: () => openAuth("login") };
    if (p.status === "waiting") return { label: "Cancel", cls: "avia-cancelbtn", onClick: () => void cancel(i), disabled: p.busy };
    if (p.status === "flying")
      return {
        label: (
          <>
            Cash Out
            <span className="block text-[15px]">{etb(r2((p.placedBet || stake) * mult))} ETB</span>
          </>
        ),
        cls: "avia-betbtn",
        onClick: () => void cashout(i),
        disabled: p.busy,
      };
    if (p.status === "cashed") return { label: <>Cashed {p.result?.m.toFixed(2)}x</>, cls: "avia-betbtn", onClick: () => {}, disabled: true };
    if (p.status === "crashed") return { label: <>Flew away</>, cls: "avia-betbtn", onClick: () => {}, disabled: true };
    return {
      label: (
        <>
          Bet
          <span className="block text-[15px]">{etb(stake)} ETB</span>
        </>
      ),
      cls: "avia-betbtn",
      onClick: () => void start(i),
      disabled: p.busy,
    };
  };

  /* ------------------------------------------------------------------ view */
  return (
    <div className="avia overflow-hidden rounded-xl bg-[#1c1c1c] text-[13px] leading-tight text-[#e8e8e8]">
      {/* header */}
      <div className="flex items-center gap-2 bg-[#1f1f1f] px-3 py-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-b from-[#8a2be2] to-[#4a1080]">
          <Plane className="h-4 w-5 -rotate-6 text-white" />
        </span>
        <span className="avia-logo truncate text-[22px] text-[#e50046]">{game.name}</span>
        <span className="ml-auto text-[15px] font-extrabold text-white">{etb(user?.balance ?? 0)} ETB</span>
        <button onClick={() => setSide((s) => !s)} className="grid h-7 w-7 place-items-center rounded text-[#cfcfcf] hover:bg-white/10" aria-label="Toggle bets list">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="relative flex">
        {/* left rail */}
        {side && (
          <aside className="z-20 w-[236px] shrink-0 bg-[#1f1f1f] p-2 max-lg:absolute max-lg:inset-y-0 max-lg:left-0 max-lg:h-full max-lg:overflow-y-auto max-lg:shadow-2xl max-lg:shadow-black">
            <div className="flex rounded-lg bg-[#2a2a2a] p-0.5">
              {(
                [
                  ["all", "All Bets"],
                  ["prev", "Previous"],
                  ["top", "Top"],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`flex-1 rounded-md px-1 py-1.5 text-[12px] font-bold ${tab === k ? "bg-[#3f3f3f] text-white" : "text-[#8f8f8f] hover:text-white"}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === "all" && (
              <>
                <div className="mt-2 flex items-center justify-between rounded-md bg-[#242424] px-2 py-1.5">
                  <span className="flex items-center gap-1.5">
                    <RingAvatar seed={2} size={18} />
                    <span className="font-bold text-white">
                      {settled.length}/{rows.length} <span className="font-semibold text-[#9a9a9a]">Bets</span>
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-[15px] font-extrabold text-white">{etb(totalWin)}</span>
                    <span className="block text-[10px] text-[#8f8f8f]">Total win ETB</span>
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-[1fr_56px_44px_56px] px-2 text-[11px] text-[#8f8f8f]">
                  <span>Player</span>
                  <span className="text-right">Bet ETB</span>
                  <span className="text-right">X</span>
                  <span className="text-right">Win ETB</span>
                </div>
                <div className="mt-1 space-y-1">
                  {rows.map((r, idx) => (
                    <div key={idx} className={`grid grid-cols-[1fr_56px_44px_56px] items-center rounded-md px-2 py-1.5 ${r.me ? "bg-[#2e3a2e]" : "bg-[#2a2a2a]"}`}>
                      <span className="flex min-w-0 items-center gap-1.5">
                        <RingAvatar seed={r.seed} size={18} />
                        <span className={`truncate font-semibold ${r.me ? "text-[#8be08b]" : "text-[#d9d9d9]"}`}>{r.name}</span>
                      </span>
                      <span className="text-right font-semibold text-[#d9d9d9]">{etb(r.bet)}</span>
                      <span className="text-right font-semibold text-[#9a9a9a]">{r.x != null ? `${r.x.toFixed(2)}` : ""}</span>
                      <span className="text-right font-bold text-[#6fd44a]">{r.win != null ? etb(r.win) : ""}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === "prev" && (
              <div className="mt-2 space-y-1">
                {!user && <p className="px-2 py-3 text-center text-[#8f8f8f]">Log in to see your bets.</p>}
                {user && prevRows.length === 0 && <p className="px-2 py-3 text-center text-[#8f8f8f]">No bets yet.</p>}
                {user &&
                  prevRows
                    .filter((r) => r.status !== "active")
                    .slice(0, 30)
                    .map((r) => (
                      <div key={r.id} className="grid grid-cols-[1fr_56px_44px_56px] items-center rounded-md bg-[#2a2a2a] px-2 py-1.5">
                        <span className="flex items-center gap-1.5">
                          <RingAvatar seed={r.id % 6} size={18} />
                          <span className="truncate text-[11px] text-[#9a9a9a]" suppressHydrationWarning>
                            {new Date(r.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </span>
                        <span className="text-right font-semibold text-[#d9d9d9]">{etb(r.bet)}</span>
                        <span className="text-right font-semibold text-[#9a9a9a]">{r.multiplier.toFixed(2)}</span>
                        <span className="text-right font-bold text-[#6fd44a]">{r.status === "won" ? etb(r.payout) : ""}</span>
                      </div>
                    ))}
              </div>
            )}

            {tab === "top" && (
              <div className="mt-2 space-y-1">
                {topList.map((r, idx) => (
                  <div key={idx} className="grid grid-cols-[1fr_44px_64px] items-center rounded-md bg-[#2a2a2a] px-2 py-1.5">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <RingAvatar seed={r.seed} size={18} />
                      <span className="truncate font-semibold text-[#d9d9d9]">{r.name}</span>
                    </span>
                    <span className={`text-right font-bold ${multClass(r.x)}`}>{r.x.toFixed(2)}x</span>
                    <span className="text-right font-bold text-[#6fd44a]">{etb(r.win)}</span>
                  </div>
                ))}
              </div>
            )}
          </aside>
        )}

        {/* main column */}
        <div className="min-w-0 flex-1">
          {/* history strip */}
          <div className="flex items-center gap-2 bg-[#141414] px-3 py-1.5">
            <div className="no-scrollbar flex flex-1 items-center gap-3 overflow-x-auto">
              {strip.map((m, i) => (
                <span key={`${i}-${m}`} className={`shrink-0 text-[13px] font-bold ${multClass(m)}`}>
                  {m.toFixed(2)}x
                </span>
              ))}
            </div>
            <button className="grid h-6 w-8 shrink-0 place-items-center rounded-full bg-[#2e2e2e] text-[10px] font-bold text-[#9a9a9a]" aria-label="Round history">
              •••
            </button>
          </div>

          {/* stage */}
          <div className="avia-sunburst relative h-[300px] overflow-hidden sm:h-[380px]">
            {/* centre lockup */}
            {(phase === "idle" || phase === "waiting") && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-4 text-center">
                <div className="flex items-center gap-3">
                  <span className="avia-logo text-5xl text-[#e50046] sm:text-6xl">ZEMA</span>
                  <span className="h-12 w-px bg-[#e50046]/70" />
                  <span className="flex flex-col items-center">
                    <Plane className="h-8 w-12 -rotate-6 text-[#e50046]" />
                    <span className="avia-logo text-3xl text-[#e50046]">{game.name}</span>
                  </span>
                </div>
                <div className="text-2xl font-extrabold tracking-widest text-white sm:text-3xl">OFFICIAL CRASH GAME</div>
                <div className="h-0.5 w-44 bg-[#e50046]" />
                <div className="mt-1 rounded-md border border-[#3f7a3f] bg-[#182418]/90 px-4 py-1.5">
                  <div className="flex items-center justify-center gap-1.5 text-[12px] font-extrabold tracking-wide text-[#d6ecd6]">
                    <Shield className="h-3.5 w-3.5 text-[#6fd44a]" /> ZEMA
                  </div>
                  <div className="mt-0.5 flex items-center justify-center gap-1 rounded bg-[#274227] px-1.5 py-px text-[10px] font-bold text-[#8fd48f]">
                    Official Game <span className="text-[#6fd44a]">✓</span>
                  </div>
                  <div className="mt-0.5 text-[9px] text-[#6fa06f]">Since 2024</div>
                </div>
                {phase === "waiting" && (
                  <div className="mt-2 w-56">
                    <div className="avia-blink text-center text-[12px] font-bold tracking-widest text-[#bdbdbd]">WAITING FOR NEXT ROUND</div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#2e2e2e]">
                      <div className="avia-waitbar h-full rounded-full bg-[#e50046]" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* curve + plane */}
            {showCurve && phase === "flying" && (
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
                <path
                  d={`M 0 97 C ${px * 0.35} 97, ${px * 0.7} ${py + (97 - py) * 0.45}, ${px} ${py}`}
                  fill="none"
                  stroke="#e50046"
                  strokeWidth="6"
                  opacity="0.25"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d={`M 0 97 C ${px * 0.35} 97, ${px * 0.7} ${py + (97 - py) * 0.45}, ${px} ${py}`}
                  fill="none"
                  stroke="#e50046"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            )}
            {phase === "flying" && (
              <div className="absolute z-10 w-20 sm:w-24" style={{ left: `${px}%`, top: `${py}%`, transform: "translate(-40%, -60%) rotate(-14deg)" }}>
                <Plane className="w-full text-[#e50046] drop-shadow-[0_0_10px_rgba(229,0,70,0.6)]" />
              </div>
            )}
            {phase === "crashed" && (
              <div className="avia-flyaway absolute z-10 w-20 sm:w-24" style={{ left: `${px}%`, top: `${py}%` }}>
                <Plane className="w-full text-[#e50046]" />
              </div>
            )}
            {(phase === "idle" || phase === "waiting") && (
              <div className="absolute bottom-1 left-1 z-10 w-20 sm:w-24">
                <Plane className="w-full text-[#e50046]" />
              </div>
            )}

            {/* multiplier */}
            {(phase === "flying" || phase === "crashed") && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                {phase === "crashed" && <div className="mb-1 text-xl font-black tracking-widest text-[#e50046] sm:text-2xl">FLEW AWAY!</div>}
                <div className={`text-6xl font-black tabular-nums drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:text-7xl ${phase === "crashed" ? "text-[#e50046]" : "text-white"}`}>
                  {mult.toFixed(2)}x
                </div>
                {panels.some((p) => p.status === "cashed") && phase === "flying" && (
                  <div className="mt-2 rounded-full bg-[#274227]/90 px-4 py-1 text-[13px] font-bold text-[#8fd48f]">
                    You cashed out at {panels.find((p) => p.status === "cashed")?.result?.m.toFixed(2)}x
                    {panels.find((p) => p.status === "cashed")?.result?.win != null && <> · +{fmt(panels.find((p) => p.status === "cashed")!.result!.win!)}</>}
                  </div>
                )}
              </div>
            )}

            {/* live players badge */}
            <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1.5 rounded-full bg-[#242424]/90 px-2 py-1">
              <RingAvatar seed={2} size={14} />
              <span className="text-[12px] font-bold text-white">{liveCount}</span>
            </div>
          </div>

          {/* bet panels */}
          <div className="grid gap-2 bg-[#191919] p-2 sm:grid-cols-2">
            {panels.map((p, i) => (
              <BetPanel
                key={i}
                p={p}
                disabledInputs={p.status === "waiting" || p.status === "flying" || p.busy}
                primary={primaryFor(p, i)}
                onPatch={(patch) => setPanel(i, patch)}
                onStep={(d) =>
                  setPanel(i, { bet: String(d < 0 ? stepDown(Number(p.bet) || 0) : stepUp(Number(p.bet) || 0)) })
                }
              />
            ))}
          </div>

          {/* footer */}
          <div className="flex items-center justify-between bg-[#1f1f1f] px-3 py-1.5 text-[11px] text-[#8f8f8f]">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" /> Provably Fair Game
            </span>
            <span>
              Powered by <span className="font-extrabold tracking-wide text-[#bdbdbd]">ZEMA GAMES</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

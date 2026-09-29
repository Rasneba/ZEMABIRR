"use client";

import { useEffect, useRef, useState } from "react";
import { api, useApp } from "../AppProvider";
import { BalanceLine, BetInput, LoginToPlay } from "./shared";
import { PLINKO_ROWS, PLINKO_TABLE, type Game } from "@/lib/games";
import { fmt } from "@/lib/brand";

const W = 600, H = 520, PAD = 30, TOP = 34, ROWH = (H - TOP - 66) / PLINKO_ROWS, REST = H - 34;
const STEP = 90;

function pegX(row: number, col: number) {
  const slots = row + 1;
  return PAD + ((col + 0.5) * (W - 2 * PAD)) / slots;
}
function pegY(row: number) {
  return TOP + row * ROWH;
}

function multColor(m: number) {
  if (m >= 5) return "#a855f7";
  if (m >= 2) return "#e5b224";
  if (m >= 1) return "#22c55e";
  return "#dc2626";
}

export default function Plinko({ game }: { game: Game }) {
  const { user, toast, refresh } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bet, setBet] = useState("10");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ bin: number; multiplier: number; payout: number } | null>(null);
  const [drops, setDrops] = useState<{ bin: number; mult: number }[]>([]);
  const anim = useRef({ moves: [] as number[], start: 0, bin: -1 });
  const done = useRef(true);
  const raf = useRef(0);
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (doneTimer.current) clearTimeout(doneTimer.current);
  }, []);

  async function drop() {
    if (busy) return;
    setBusy(true);
    setResult(null);
    const d = await api<{ bin: number; multiplier: number; payout: number }>("/api/games/plinko", { game: game.slug, bet: Number(bet) });
    if (d.error) {
      setBusy(false);
      return toast(d.error, "error");
    }
    const increments = [...Array(PLINKO_ROWS - d.bin).fill(0), ...Array(d.bin).fill(1)];
    for (let i = increments.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [increments[i], increments[j]] = [increments[j], increments[i]];
    }
    done.current = false;
    anim.current = { moves: increments, start: performance.now(), bin: d.bin };
    setDrops((x) => [{ bin: d.bin, mult: d.multiplier }, ...x].slice(0, 20));
    doneTimer.current = setTimeout(() => {
      setResult(d);
      setBusy(false);
      if (d.payout > 0) toast(`Bin ${d.bin} · ${d.multiplier.toFixed(2)}x · +${fmt(d.payout)}`, "success");
      refresh();
    }, (PLINKO_ROWS + 1) * STEP + 350);
  }

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const c = ctx;
    const dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr;
    cv.height = H * dpr;

    function colAt(row: number) {
      return anim.current.moves.slice(0, row).reduce((a, b) => a + b, 0);
    }
    function draw() {
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, W, H);

      // pegs
      c.fillStyle = "rgba(255,255,255,0.28)";
      for (let r = 0; r < PLINKO_ROWS; r++) {
        for (let col = 0; col <= r; col++) {
          c.beginPath();
          c.arc(pegX(r, col), pegY(r), 3.5, 0, Math.PI * 2);
          c.fill();
        }
      }
      // landing bins
      c.strokeStyle = "rgba(255,255,255,0.12)";
      c.lineWidth = 1;
      for (let col = 0; col <= PLINKO_ROWS; col++) {
        const x = pegX(PLINKO_ROWS, col);
        c.beginPath();
        c.moveTo(x - 11, REST - 26);
        c.lineTo(x + 11, REST - 26);
        c.lineTo(x + 14, REST);
        c.lineTo(x - 14, REST);
        c.closePath();
        c.stroke();
      }
      if (done.current && anim.current.bin >= 0) {
        const x = pegX(PLINKO_ROWS, anim.current.bin);
        c.fillStyle = "rgba(167,85,247,0.35)";
        c.beginPath();
        c.moveTo(x - 14, REST - 26);
        c.lineTo(x + 14, REST - 26);
        c.lineTo(x + 17, REST);
        c.lineTo(x - 17, REST);
        c.closePath();
        c.fill();
      }

      // ball
      const t = (performance.now() - anim.current.start) / STEP;
      let bx = W / 2, by = TOP;
      if (!done.current) {
        const total = PLINKO_ROWS + 0.8;
        if (t <= 0) {
          bx = pegX(0, 0);
          by = pegY(0);
        } else if (t < PLINKO_ROWS) {
          const seg = Math.min(PLINKO_ROWS - 1, Math.floor(t));
          const frac = Math.min(1, t - seg);
          const x0 = pegX(seg, colAt(seg));
          const x1 = pegX(seg + 1, colAt(seg + 1));
          const y0 = pegY(seg);
          const y1 = pegY(seg + 1);
          bx = x0 + (x1 - x0) * frac;
          by = y0 + (y1 - y0) * frac - Math.sin(frac * Math.PI) * 14;
        } else {
          const f = Math.min(1, (t - PLINKO_ROWS) / 0.8);
          const x0 = pegX(PLINKO_ROWS - 1, colAt(PLINKO_ROWS - 1));
          const y0 = pegY(PLINKO_ROWS - 1);
          const x1 = pegX(PLINKO_ROWS, anim.current.bin);
          bx = x0 + (x1 - x0) * f;
          by = y0 + (REST - y0) * f + Math.sin(f * Math.PI) * 8;
          if (f >= 1) {
            done.current = true;
          }
        }
      } else if (anim.current.bin >= 0) {
        bx = pegX(PLINKO_ROWS, anim.current.bin);
        by = REST;
        c.fillStyle = "rgba(34,211,238,0.4)";
        c.beginPath();
        c.arc(bx, by, 16, 0, Math.PI * 2);
        c.fill();
      }
      if (!done.current || anim.current.bin >= 0) {
        c.fillStyle = "#22d3ee";
        c.beginPath();
        c.arc(bx, by - 6, 8, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "rgba(255,255,255,0.85)";
        c.beginPath();
        c.arc(bx, by - 8, 3, 0, Math.PI * 2);
        c.fill();
      }
      if (!done.current) raf.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_340px]">
      <div className="rounded-2xl bg-gradient-to-b from-[#1c1035] to-[#0b0814] p-3 ring-1 ring-white/5">
        <canvas ref={canvasRef} style={{ width: "100%", height: "auto", aspectRatio: `${W}/${H}` }} />
        <div className="mt-2 grid gap-1" style={{ gridTemplateColumns: `repeat(${PLINKO_ROWS + 1}, minmax(0,1fr))` }}>
          {PLINKO_TABLE.map((m, i) => (
            <div key={i} className={`rounded text-center text-[10px] font-bold leading-5 ${result && result.bin === i ? "bg-fuchsia-500/80 text-white ring-1 ring-fuchsia-300" : ""}`} style={{ color: multColor(m) }}>
              {m.toFixed(2)}
            </div>
          ))}
        </div>
        {result && (
          <div className={`mt-3 flex items-center justify-between rounded-xl px-3 py-2 text-sm font-bold ${result.payout > 0 ? "bg-win/15 text-win" : "bg-white/5 text-mute"}`}>
            <span>Bin {result.bin}</span>
            <span>{result.multiplier.toFixed(2)}x</span>
            <span>{result.payout > 0 ? `+${fmt(result.payout)}` : "No win"}</span>
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-2xl bg-card p-4">
        <BetInput value={bet} onChange={setBet} disabled={busy} />
        {!user ? <LoginToPlay /> : (
          <button onClick={drop} disabled={busy} className="btn-gold w-full rounded-xl py-4 text-lg">{busy ? "Dropping…" : `Drop ball · ${fmt(Number(bet) || 0)}`}</button>
        )}
        <div className="text-center text-xs text-mute">16 rows · payout per bin</div>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {drops.length === 0 && <span className="text-xs text-mute">Drop history will appear here</span>}
          {drops.map((x, i) => (
            <span key={i} className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: x.mult >= 1 ? "rgba(34,197,94,0.15)" : "rgba(220,38,38,0.15)", color: x.mult >= 1 ? "#4ade80" : "#f87171" }}>
              {x.mult.toFixed(2)}x
            </span>
          ))}
        </div>
        <BalanceLine />
        <p className="text-xs text-mute">Drop a ball through 16 rows of pegs. Balls near the edges pay big multipliers up to 13.00x (RTP 96.8%).</p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export type DayPoint = { date: string; signups: number; deposits: number; withdrawals: number; wagered: number; payout: number; ggr: number };

const DAY_LABEL = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });

function niceMax(v: number) {
  if (v <= 0) return 10;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / mag;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * mag;
}

export function DualBars({ days, a, b, labelA, labelB, colorA, colorB, money = true }: {
  days: DayPoint[];
  a: (d: DayPoint) => number;
  b: (d: DayPoint) => number;
  labelA: string;
  labelB: string;
  colorA: string;
  colorB: string;
  money?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 720, H = 220, PAD = 28;
  const max = niceMax(Math.max(1, ...days.map((d) => Math.max(a(d), b(d)))));
  const bw = (W - PAD * 2) / days.length;
  const y = (v: number) => H - 24 - ((H - 24 - 10) * Math.min(v, max)) / max;
  const f = (v: number) => (money ? `Br ${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : v.toLocaleString("en-US"));
  const h = hover !== null ? days[hover] : null;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-4 text-xs font-bold text-mute">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: colorA }} /> {labelA}</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: colorB }} /> {labelB}</span>
        {h && (
          <span className="ml-auto rounded-lg bg-bg px-2 py-1 font-mono text-[11px]">
            {DAY_LABEL(h.date)} · {labelA} {f(a(h))} · {labelB} {f(b(h))}
          </span>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" onMouseLeave={() => setHover(null)}>
        {[0.25, 0.5, 0.75, 1].map((p) => (
          <g key={p}>
            <line x1={PAD} x2={W - 4} y1={y(max * p)} y2={y(max * p)} stroke="#3a4143" strokeDasharray="3 4" strokeWidth="1" />
            <text x={PAD - 4} y={y(max * p) + 3} textAnchor="end" fontSize="9" fill="#a9b4b7">
              {money ? `${Math.round(max * p / 1000)}k` : Math.round(max * p)}
            </text>
          </g>
        ))}
        {days.map((d, i) => {
          const x0 = PAD + i * bw;
          const w = Math.max(3, bw * 0.32);
          return (
            <g key={d.date} onMouseEnter={() => setHover(i)}>
              <rect x={PAD + i * bw} y={0} width={bw} height={H - 24} fill={hover === i ? "rgba(255,255,255,0.05)" : "transparent"} />
              <rect x={x0 + bw * 0.12} y={y(a(d))} width={w} height={Math.max(1, H - 24 - y(a(d)))} rx="2" fill={colorA} opacity={hover === null || hover === i ? 1 : 0.45} />
              <rect x={x0 + bw * 0.12 + w + 1.5} y={y(b(d))} width={w} height={Math.max(1, H - 24 - y(b(d)))} rx="2" fill={colorB} opacity={hover === null || hover === i ? 1 : 0.45} />
              {i % 2 === 0 && (
                <text x={x0 + bw / 2} y={H - 8} textAnchor="middle" fontSize="9" fill="#a9b4b7">
                  {DAY_LABEL(d.date)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function AreaLine({ days, value, color, label, money = true }: { days: DayPoint[]; value: (d: DayPoint) => number; color: string; label: string; money?: boolean }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 720, H = 180, PAD = 28;
  const max = niceMax(Math.max(1, ...days.map(value)));
  const stepX = (W - PAD - 4) / Math.max(1, days.length - 1);
  const y = (v: number) => H - 22 - ((H - 22 - 10) * Math.min(Math.max(v, 0), max)) / max;
  const pts = days.map((d, i) => [PAD + i * stepX, y(Math.max(0, value(d)))] as const);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${H - 22} L${pts[0][0]},${H - 22} Z`;
  const h = hover !== null ? days[hover] : null;

  return (
    <div>
      <div className="mb-2 flex items-center gap-4 text-xs font-bold text-mute">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} /> {label}</span>
        {h && (
          <span className="ml-auto rounded-lg bg-bg px-2 py-1 font-mono text-[11px]">
            {DAY_LABEL(h.date)} · {money ? "Br " : ""}
            {Math.max(0, value(h)).toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </span>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id={`grad-${label.replace(/\W/g, "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.5, 1].map((p) => (
          <line key={p} x1={PAD} x2={W - 4} y1={y(max * p)} y2={y(max * p)} stroke="#3a4143" strokeDasharray="3 4" strokeWidth="1" />
        ))}
        <path d={area} fill={`url(#grad-${label.replace(/\W/g, "")})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <g key={i} onMouseEnter={() => setHover(i)}>
            <rect x={p[0] - stepX / 2} y={0} width={stepX} height={H - 22} fill="transparent" />
            <circle cx={p[0]} cy={p[1]} r={hover === i ? 4 : 2.2} fill={color} />
          </g>
        ))}
        {days.map((d, i) =>
          i % 2 === 0 ? (
            <text key={d.date} x={PAD + i * stepX} y={H - 6} textAnchor="middle" fontSize="9" fill="#a9b4b7">
              {DAY_LABEL(d.date)}
            </text>
          ) : null
        )}
      </svg>
    </div>
  );
}

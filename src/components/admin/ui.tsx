"use client";

import { type ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line/60 bg-card ${className}`}>{children}</div>;
}

export function SectionTitle({ icon, title, right }: { icon: string; title: string; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="flex items-center gap-2 text-xl font-black sm:text-2xl">
        <span>{icon}</span>
        <span>{title}</span>
      </h1>
      {right && <div className="flex flex-wrap items-center gap-2">{right}</div>}
    </div>
  );
}

export function StatCard({ label, value, sub, tone = "" }: { label: string; value: string; sub?: string; tone?: "win" | "lose" | "gold" | "" }) {
  const color = tone === "win" ? "text-win" : tone === "lose" ? "text-lose" : tone === "gold" ? "text-gold" : "text-white";
  return (
    <Card className="p-4">
      <div className="text-[11px] font-bold uppercase tracking-wide text-mute">{label}</div>
      <div className={`mt-1 text-xl font-black sm:text-2xl ${color}`}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-mute">{sub}</div>}
    </Card>
  );
}

const BADGE_TONES: Record<string, string> = {
  completed: "bg-win/15 text-win",
  paid: "bg-win/15 text-win",
  won: "bg-win/15 text-win",
  approved: "bg-win/15 text-win",
  pending: "bg-gold/15 text-gold",
  processing: "bg-gold/15 text-gold",
  active: "bg-gold/15 text-gold",
  rejected: "bg-lose/15 text-lose",
  lost: "bg-lose/15 text-lose",
  banned: "bg-lose/15 text-lose",
  refund: "bg-sky-400/15 text-sky-300",
  adjust: "bg-violet-400/15 text-violet-300",
  bonus: "bg-violet-400/15 text-violet-300",
  promo: "bg-violet-400/15 text-violet-300",
  spin: "bg-violet-400/15 text-violet-300",
  referral: "bg-sky-400/15 text-sky-300",
  deposit: "bg-win/15 text-win",
  withdraw: "bg-lose/15 text-lose",
  bet: "bg-white/10 text-white/80",
  win: "bg-win/15 text-win",
  lootbox: "bg-violet-400/15 text-violet-300",
};

export function Badge({ value }: { value: string }) {
  const tone = BADGE_TONES[value] ?? "bg-white/10 text-white/80";
  return <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold uppercase ${tone}`}>{value}</span>;
}

export function Segmented<T extends string>({ options, value, onChange }: { options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex max-w-full overflow-x-auto rounded-xl bg-bg p-1 no-scrollbar">
      {options.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-bold capitalize transition-colors ${
            value === s ? "bg-card2 text-white" : "text-mute hover:text-white"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

export function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-6" onClick={onClose}>
      <div
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-line bg-side p-4 sm:rounded-2xl sm:p-5 ${wide ? "sm:max-w-3xl" : "sm:max-w-md"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-black">{title}</h3>
          <button onClick={onClose} className="btn-ghost rounded-lg px-2.5 py-1 text-sm">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Empty({ text }: { text: string }) {
  return <p className="rounded-2xl border border-line/60 bg-card py-10 text-center text-sm text-mute">{text}</p>;
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-line/60 bg-card py-12 text-sm text-mute">
      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-mute/30 border-t-gold" />
      {label}
    </div>
  );
}

export function Notice({ kind, children }: { kind: "ok" | "err"; children: ReactNode }) {
  return (
    <div className={`rounded-xl border px-4 py-2 text-sm ${kind === "ok" ? "border-win/40 bg-win/10 text-win" : "border-lose/40 bg-lose/10 text-red-300"}`}>
      {children}
    </div>
  );
}

export function Th({ children, right = false }: { children?: ReactNode; right?: boolean }) {
  return <th className={`whitespace-nowrap px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-mute ${right ? "text-right" : "text-left"}`}>{children}</th>;
}

export function Td({ children, right = false, className = "" }: { children?: ReactNode; right?: boolean; className?: string }) {
  return <td className={`whitespace-nowrap px-3 py-2 text-sm ${right ? "text-right" : "text-left"} ${className}`}>{children}</td>;
}

export function TableShell({ children }: { children: ReactNode }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">{children}</table>
      </div>
    </Card>
  );
}

export function Pager({ total, offset, limit, onMove }: { total: number; offset: number; limit: number; onMove: (offset: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / limit));
  const page = Math.floor(offset / limit) + 1;
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between gap-2 text-sm text-mute">
      <span>
        Page {page} / {pages} · {total.toLocaleString("en-US")} rows
      </span>
      <div className="flex gap-2">
        <button disabled={offset <= 0} onClick={() => onMove(Math.max(0, offset - limit))} className="btn-ghost rounded-lg px-3 py-1.5 disabled:opacity-40">
          ← Prev
        </button>
        <button disabled={page >= pages} onClick={() => onMove(offset + limit)} className="btn-ghost rounded-lg px-3 py-1.5 disabled:opacity-40">
          Next →
        </button>
      </div>
    </div>
  );
}

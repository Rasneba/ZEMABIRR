"use client";

import { useCallback, useEffect, useState } from "react";
import { adminCall, fmt, fmtDate, fmtInt } from "./api";
import { Badge, Empty, Loading, Notice, SectionTitle, StatCard, Td, Th, TableShell } from "./ui";

type Selection = { label: string; market: string; pick: string; odds: number; result?: string };

type Ticket = {
  id: number;
  userId: number;
  username: string;
  selections: Selection[];
  stake: number;
  totalOdds: number;
  status: string;
  payout: number;
  settleAt: string;
  createdAt: string;
};

type Summary = {
  pendingCount: number;
  pendingStake: number;
  exposure: number;
  stakedTotal: number;
  paidTotal: number;
  ticketsTotal: number;
};

export default function Sports() {
  const [status, setStatus] = useState<"pending" | "won" | "lost" | "all">("pending");
  const [rows, setRows] = useState<Ticket[] | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (s: string) => {
    const d = await adminCall<{ summary: Summary; rows: Ticket[] }>(`/api/admin/sports?status=${s}`);
    if (d.error) return setErr(d.error);
    setSummary(d.summary);
    setRows(d.rows ?? []);
    setErr("");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(status), 0);
    return () => clearTimeout(t);
  }, [status, load]);

  async function settleDue() {
    setBusy(true);
    setErr("");
    const r = await adminCall<{ settled: number }>("/api/admin/sports/settle-due", {});
    setBusy(false);
    if (r.error) return setErr(r.error);
    setNote(`Settled ${r.settled} ticket${r.settled === 1 ? "" : "s"} whose matches have finished.`);
    load(status);
  }

  return (
    <div className="space-y-4">
      <SectionTitle
        icon="⚽"
        title="Sportsbook"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl bg-card p-1">
              {(["pending", "won", "lost", "all"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-bold capitalize ${status === s ? "bg-card2 text-white" : "text-mute hover:text-white"}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button disabled={busy} onClick={settleDue} className="btn-gold rounded-xl px-4 py-2 text-sm">⚡ Settle due now</button>
          </div>
        }
      />

      {summary && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Open tickets" value={fmtInt(summary.pendingCount)} sub={`stake Br ${fmt(summary.pendingStake)}`} tone="gold" />
          <StatCard label="Max exposure" value={`Br ${fmt(summary.exposure)}`} sub="if every open ticket wins" tone="lose" />
          <StatCard label="Staked (all-time)" value={`Br ${fmt(summary.stakedTotal)}`} sub={`${fmtInt(summary.ticketsTotal)} tickets`} />
          <StatCard label="Paid out" value={`Br ${fmt(summary.paidTotal)}`} sub={`margin Br ${fmt(summary.stakedTotal - summary.paidTotal)}`} tone="win" />
        </div>
      )}

      {note && <Notice kind="ok">{note}</Notice>}
      {err && <Notice kind="err">{err}</Notice>}

      {rows === null ? (
        <Loading />
      ) : rows.length === 0 ? (
        <Empty text={`No ${status === "all" ? "" : status + " "}tickets.`} />
      ) : (
        <TableShell>
          <thead>
            <tr className="border-b border-line/60 bg-card2/40">
              <Th>#</Th>
              <Th>Player</Th>
              <Th>Selections</Th>
              <Th right>Stake</Th>
              <Th right>Odds</Th>
              <Th right>Potential / Paid</Th>
              <Th>Status</Th>
              <Th>When</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id} className="border-b border-line/40 last:border-0 hover:bg-white/[0.03]">
                <Td className="font-mono text-xs text-mute">{b.id}</Td>
                <Td className="font-bold">@{b.username}</Td>
                <Td className="max-w-72">
                  <div className="space-y-0.5 text-xs">
                    {b.selections.slice(0, 3).map((s, i) => (
                      <div key={i} className="truncate">
                        <span className="text-mute">{s.label}</span> → <b>{s.pick}</b> @{s.odds}
                        {s.result ? <span className={s.result === "won" ? "text-win" : "text-lose"}> ({s.result})</span> : null}
                      </div>
                    ))}
                    {b.selections.length > 3 && <div className="text-mute">+{b.selections.length - 3} more…</div>}
                  </div>
                </Td>
                <Td right>Br {fmt(b.stake)}</Td>
                <Td right className="font-mono">{b.totalOdds}×</Td>
                <Td right className="font-bold">
                  {b.status === "pending" ? <span className="text-gold">Br {fmt(b.stake * b.totalOdds)}</span> : <span className={b.payout > 0 ? "text-win" : "text-mute"}>Br {fmt(b.payout)}</span>}
                </Td>
                <Td><Badge value={b.status} /></Td>
                <Td className="text-xs text-mute">{fmtDate(b.createdAt)}</Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}
    </div>
  );
}

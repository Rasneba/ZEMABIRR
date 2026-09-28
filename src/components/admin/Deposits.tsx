"use client";

import { useCallback, useEffect, useState } from "react";
import { adminCall, fmt, fmtDate } from "./api";
import { Badge, Empty, Loading, Notice, SectionTitle, Td, Th, TableShell } from "./ui";

type Deposit = {
  id: number;
  userId: number;
  username: string;
  phone: string;
  amount: number;
  status: string;
  method: string | null;
  reference: string | null;
  txid: string | null;
  createdAt: string;
};

type Filter = "pending" | "completed" | "rejected" | "all";

export default function Deposits() {
  const [status, setStatus] = useState<Filter>("pending");
  const [rows, setRows] = useState<Deposit[] | null>(null);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async (s: Filter) => {
    const d = await adminCall<{ rows: Deposit[] }>(`/api/admin/deposits?status=${s}`);
    if (d.error) return setErr(d.error);
    setRows(d.rows ?? []);
    setErr("");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(status), 0);
    return () => clearTimeout(t);
  }, [status, load]);

  async function approve(d: Deposit) {
    if (!confirm(`Approve deposit Br ${fmt(d.amount)} for @${d.username}?\nVerify the SMS receipt shows TX ID: ${d.txid}`)) return;
    setBusyId(d.id);
    setErr("");
    const r = await adminCall<{ bonus?: number }>("/api/admin/deposits/approve", { id: d.id, amount: d.amount, txid: d.txid });
    setBusyId(null);
    if (r.error) return setErr(r.error);
    setNote(`Approved ${d.reference ?? `#${d.id}`} — credited Br ${fmt(d.amount)}${r.bonus ? ` + Br ${fmt(r.bonus)} welcome bonus` : ""}`);
    load(status);
  }

  async function reject(d: Deposit) {
    if (!confirm(`Reject deposit ${d.reference ?? `#${d.id}`} (Br ${fmt(d.amount)})?`)) return;
    setBusyId(d.id);
    setErr("");
    const r = await adminCall("/api/admin/deposits/reject", { id: d.id });
    setBusyId(null);
    if (r.error) return setErr(r.error);
    setNote(`Rejected ${d.reference ?? `#${d.id}`}`);
    load(status);
  }

  const pendingCount = rows?.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-4">
      <SectionTitle
        icon="💳"
        title="Deposits"
        right={
          <div className="flex rounded-xl bg-card p-1">
            {(["pending", "completed", "rejected", "all"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`rounded-lg px-3 py-1.5 text-sm font-bold capitalize ${status === s ? "bg-card2 text-white" : "text-mute hover:text-white"}`}
              >
                {s}
              </button>
            ))}
          </div>
        }
      />

      {note && <Notice kind="ok">{note}</Notice>}
      {err && <Notice kind="err">{err}</Notice>}

      {rows === null ? (
        <Loading />
      ) : rows.length === 0 ? (
        <Empty text={status === "pending" ? "All caught up — no pending deposits 🎉" : `No ${status === "all" ? "" : status + " "}deposits found.`} />
      ) : (
        <TableShell>
          <thead>
            <tr className="border-b border-line/60 bg-card2/40">
              <Th>Ref</Th>
              <Th>Player</Th>
              <Th right>Amount</Th>
              <Th>Method</Th>
              <Th>SMS TX ID</Th>
              <Th>Status</Th>
              <Th>When</Th>
              <Th right>Action</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id} className="border-b border-line/40 last:border-0 hover:bg-white/[0.03]">
                <Td className="font-mono text-xs">{d.reference ?? `#${d.id}`}</Td>
                <Td>
                  <div className="font-bold">@{d.username}</div>
                  <div className="text-xs text-mute">{d.phone}</div>
                </Td>
                <Td right className="font-black text-gold">Br {fmt(d.amount)}</Td>
                <Td className="text-mute">{d.method ?? "—"}</Td>
                <Td>
                  <span className="select-all rounded bg-bg px-2 py-1 font-mono text-xs">{d.txid ?? "—"}</span>
                </Td>
                <Td><Badge value={d.status} /></Td>
                <Td className="text-xs text-mute">{fmtDate(d.createdAt)}</Td>
                <Td right>
                  {d.status === "pending" ? (
                    <div className="flex justify-end gap-1.5">
                      <button disabled={busyId !== null} onClick={() => approve(d)} className="btn-green rounded-lg px-3 py-1.5 text-xs">✓ Approve</button>
                      <button disabled={busyId !== null} onClick={() => reject(d)} className="rounded-lg bg-lose/20 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-lose/30">✕</button>
                    </div>
                  ) : (
                    <span className="text-xs text-mute">—</span>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      )}
      {status === "pending" && pendingCount ? <p className="text-xs text-mute">{pendingCount} pending · cross-check each SMS amount + TX ID before approving.</p> : null}
    </div>
  );
}

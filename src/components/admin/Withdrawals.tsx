"use client";

import { useCallback, useEffect, useState } from "react";
import { adminCall, fmt, fmtDate } from "./api";
import { Badge, Empty, Loading, Notice, SectionTitle, Td, Th, TableShell } from "./ui";

type Withdrawal = {
  id: number;
  userId: number;
  username: string;
  phone: string;
  amount: number;
  status: string;
  method: string | null;
  reference: string | null;
  account: string | null;
  createdAt: string;
};

type Filter = "processing" | "completed" | "rejected" | "all";

export default function Withdrawals() {
  const [status, setStatus] = useState<Filter>("processing");
  const [rows, setRows] = useState<Withdrawal[] | null>(null);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async (s: Filter) => {
    const d = await adminCall<{ rows: Withdrawal[] }>(`/api/admin/withdrawals?status=${s}`);
    if (d.error) return setErr(d.error);
    setRows(d.rows ?? []);
    setErr("");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(status), 0);
    return () => clearTimeout(t);
  }, [status, load]);

  async function settle(w: Withdrawal, action: "pay" | "reject") {
    const amt = fmt(Math.abs(w.amount));
    const msg =
      action === "pay"
        ? `Mark ${w.reference ?? `#${w.id}`} as PAID?\n\nConfirm you sent Br ${amt} to:\n${w.method} → ${w.account}`
        : `Reject ${w.reference ?? `#${w.id}`} and refund Br ${amt} to @${w.username}?`;
    if (!confirm(msg)) return;
    setBusyId(w.id);
    setErr("");
    const r = await adminCall<{ refund?: number }>("/api/admin/withdrawals/settle", { id: w.id, action });
    setBusyId(null);
    if (r.error) return setErr(r.error);
    setNote(action === "pay" ? `Paid ${w.reference ?? `#${w.id}`} — Br ${amt} sent` : `Rejected ${w.reference ?? `#${w.id}`} — Br ${fmt(r.refund ?? 0)} refunded`);
    load(status);
  }

  return (
    <div className="space-y-4">
      <SectionTitle
        icon="🏦"
        title="Withdrawals"
        right={
          <div className="flex rounded-xl bg-card p-1">
            {(["processing", "completed", "rejected", "all"] as const).map((s) => (
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
        <Empty text={status === "processing" ? "No withdrawals waiting to be paid 🎉" : `No ${status === "all" ? "" : status + " "}withdrawals found.`} />
      ) : (
        <TableShell>
          <thead>
            <tr className="border-b border-line/60 bg-card2/40">
              <Th>Ref</Th>
              <Th>Player</Th>
              <Th right>Amount</Th>
              <Th>Payout account</Th>
              <Th>Status</Th>
              <Th>When</Th>
              <Th right>Action</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((w) => (
              <tr key={w.id} className="border-b border-line/40 last:border-0 hover:bg-white/[0.03]">
                <Td className="font-mono text-xs">{w.reference ?? `#${w.id}`}</Td>
                <Td>
                  <div className="font-bold">@{w.username}</div>
                  <div className="text-xs text-mute">{w.phone}</div>
                </Td>
                <Td right className="font-black text-lose">Br {fmt(Math.abs(w.amount))}</Td>
                <Td>
                  <div className="text-xs font-bold uppercase text-mute">{w.method ?? "—"}</div>
                  <div className="select-all font-mono text-sm">{w.account ?? "—"}</div>
                </Td>
                <Td><Badge value={w.status === "completed" ? "paid" : w.status} /></Td>
                <Td className="text-xs text-mute">{fmtDate(w.createdAt)}</Td>
                <Td right>
                  {w.status === "processing" ? (
                    <div className="flex justify-end gap-1.5">
                      <button disabled={busyId !== null} onClick={() => settle(w, "pay")} className="btn-green rounded-lg px-3 py-1.5 text-xs">💸 Mark paid</button>
                      <button disabled={busyId !== null} onClick={() => settle(w, "reject")} className="rounded-lg bg-lose/20 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-lose/30">✕ Refund</button>
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
    </div>
  );
}

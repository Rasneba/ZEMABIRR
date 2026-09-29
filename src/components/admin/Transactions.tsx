"use client";

import { useCallback, useEffect, useState } from "react";
import { adminCall, fmt, fmtDate } from "./api";
import { Badge, Empty, Loading, Notice, Pager, SectionTitle, Td, Th, TableShell } from "./ui";

type Tx = {
  id: number;
  userId: number;
  username: string;
  type: string;
  amount: number;
  status: string;
  method: string | null;
  reference: string | null;
  note: string | null;
  createdAt: string;
};

const TYPES = ["all", "deposit", "withdraw", "win", "bonus", "promo", "referral", "spin", "lootbox", "adjust", "refund"];

export default function Transactions() {
  const [type, setType] = useState("all");
  const [userQ, setUserQ] = useState("");
  const [offset, setOffset] = useState(0);
  const [rows, setRows] = useState<Tx[] | null>(null);
  const [total, setTotal] = useState(0);
  const [err, setErr] = useState("");
  const limit = 50;

  const load = useCallback(async (t: string, userId: string, off: number) => {
    const params = new URLSearchParams({ limit: String(limit), offset: String(off) });
    if (t !== "all") params.set("type", t);
    if (/^\d+$/.test(userId)) params.set("userId", userId);
    const d = await adminCall<{ rows: Tx[]; total: number }>(`/api/admin/transactions?${params}`);
    if (d.error) return setErr(d.error);
    setRows(d.rows ?? []);
    setTotal(d.total ?? 0);
    setErr("");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(type, userQ.trim(), offset), 0);
    return () => clearTimeout(t);
  }, [type, userQ, offset, load]);

  return (
    <div className="space-y-4">
      <SectionTitle
        icon="🧾"
        title="Ledger"
        right={
          <div className="flex flex-wrap gap-2">
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setOffset(0);
              }}
              className="input w-40 py-1.5 text-sm"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t === "all" ? "All types" : t}</option>
              ))}
            </select>
            <input
              value={userQ}
              onChange={(e) => {
                setUserQ(e.target.value);
                setOffset(0);
              }}
              placeholder="Filter by user id…"
              className="input w-40 py-1.5 text-sm"
            />
          </div>
        }
      />

      {err && <Notice kind="err">{err}</Notice>}

      {rows === null ? (
        <Loading />
      ) : rows.length === 0 ? (
        <Empty text="No transactions match the filter." />
      ) : (
        <>
          <TableShell>
            <thead>
              <tr className="border-b border-line/60 bg-card2/40">
                <Th>#</Th>
                <Th>Player</Th>
                <Th>Type</Th>
                <Th right>Amount</Th>
                <Th>Status</Th>
                <Th>Detail</Th>
                <Th>When</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="border-b border-line/40 last:border-0 hover:bg-white/[0.03]">
                  <Td className="font-mono text-xs text-mute">{t.id}</Td>
                  <Td className="font-bold">@{t.username} <span className="text-xs font-normal text-mute">#{t.userId}</span></Td>
                  <Td><Badge value={t.type} /></Td>
                  <Td right className={`font-mono font-bold ${t.amount >= 0 ? "text-win" : "text-lose"}`}>
                    {t.amount >= 0 ? "+" : ""}{fmt(t.amount)}
                  </Td>
                  <Td><Badge value={t.status} /></Td>
                  <Td className="max-w-56 truncate text-xs text-mute" >
                    {[t.method, t.reference, t.note].filter(Boolean).join(" · ") || "—"}
                  </Td>
                  <Td className="text-xs text-mute">{fmtDate(t.createdAt)}</Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
          <Pager total={total} offset={offset} limit={limit} onMove={setOffset} />
        </>
      )}
    </div>
  );
}

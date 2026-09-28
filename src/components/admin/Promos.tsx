"use client";

import { useCallback, useEffect, useState } from "react";
import { adminCall, fmt, fmtInt } from "./api";
import { Card, Empty, Loading, Notice, SectionTitle, Td, Th, TableShell } from "./ui";

type Promo = { code: string; amount: number; maxUses: number; uses: number };

export default function Promos() {
  const [rows, setRows] = useState<Promo[] | null>(null);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState("50");
  const [maxUses, setMaxUses] = useState("100");

  const load = useCallback(async () => {
    const d = await adminCall<{ rows: Promo[] }>("/api/admin/promos");
    if (d.error) return setErr(d.error);
    setRows(d.rows ?? []);
    setErr("");
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await adminCall("/api/admin/promos", { code, amount: Number(amount), maxUses: Number(maxUses) });
    setBusy(false);
    if (r.error) return setErr(r.error);
    setNote(`Created code ${code.toUpperCase()} — Br ${fmt(Number(amount))} × ${maxUses} uses`);
    setCode("");
    load();
  }

  async function remove(p: Promo) {
    if (!confirm(`Delete code ${p.code}? Players can no longer redeem it (past redemptions stay).`)) return;
    setBusy(true);
    setErr("");
    const r = await adminCall("/api/admin/promos", { code: p.code }, "DELETE");
    setBusy(false);
    if (r.error) return setErr(r.error);
    setNote(`Deleted ${p.code}`);
    load();
  }

  return (
    <div className="space-y-4">
      <SectionTitle icon="🎟️" title="Promo codes" />
      {note && <Notice kind="ok">{note}</Notice>}
      {err && <Notice kind="err">{err}</Notice>}

      <Card className="p-4">
        <h3 className="mb-3 text-sm font-black uppercase tracking-wide text-mute">Create code</h3>
        <form onSubmit={create} className="flex flex-wrap gap-2">
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="CODE" required minLength={3} maxLength={32} className="input w-40 font-mono uppercase" />
          <div className="flex items-center gap-1">
            <span className="text-sm text-mute">Br</span>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min={1} max={100000} step="0.01" required className="input w-28" />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-mute">× uses</span>
            <input value={maxUses} onChange={(e) => setMaxUses(e.target.value)} type="number" min={1} max={1000000} required className="input w-28" />
          </div>
          <button disabled={busy} className="btn-gold rounded-xl px-5 py-2 text-sm">Create</button>
        </form>
        <p className="mt-2 text-xs text-mute">Rewards credit the player&apos;s bonus balance. One redemption per player per code.</p>
      </Card>

      {rows === null ? (
        <Loading />
      ) : rows.length === 0 ? (
        <Empty text="No promo codes yet — create your first above." />
      ) : (
        <TableShell>
          <thead>
            <tr className="border-b border-line/60 bg-card2/40">
              <Th>Code</Th>
              <Th right>Reward</Th>
              <Th right>Used</Th>
              <Th right>Remaining</Th>
              <Th right>Value claimed</Th>
              <Th right>Action</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const left = Math.max(0, p.maxUses - p.uses);
              return (
                <tr key={p.code} className="border-b border-line/40 last:border-0 hover:bg-white/[0.03]">
                  <Td>
                    <span className="select-all rounded bg-bg px-2 py-1 font-mono text-sm font-bold">{p.code}</span>
                  </Td>
                  <Td right className="font-bold text-gold">Br {fmt(p.amount)}</Td>
                  <Td right>{fmtInt(p.uses)} / {fmtInt(p.maxUses)}</Td>
                  <Td right className={left === 0 ? "font-bold text-lose" : "text-mute"}>{left === 0 ? "exhausted" : fmtInt(left)}</Td>
                  <Td right className="text-mute">Br {fmt(p.uses * p.amount)}</Td>
                  <Td right>
                    <button disabled={busy} onClick={() => remove(p)} className="rounded-lg bg-lose/20 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-lose/30">Delete</button>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </TableShell>
      )}
    </div>
  );
}

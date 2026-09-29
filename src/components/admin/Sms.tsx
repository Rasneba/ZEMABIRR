"use client";

import { useCallback, useEffect, useState } from "react";
import { adminCall, fmt, getToken, timeAgo } from "./api";
import { Badge, Empty, Loading, Notice, SectionTitle, Td, Th, TableShell } from "./ui";

type Sms = {
  id: number;
  txid: string | null;
  amount: number;
  type: string;
  senderName: string | null;
  senderPhone: string | null;
  rawText: string;
  status: string;
  note: string | null;
  createdAt: string;
  username: string | null;
  userPhone: string | null;
  ref: string | null;
};

type Filter = "pending" | "credited" | "ignored" | "all";

export default function Sms() {
  const [status, setStatus] = useState<Filter>("pending");
  const [rows, setRows] = useState<Sms[] | null>(null);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [paste, setPaste] = useState("");
  const [parsing, setParsing] = useState(false);

  const load = useCallback(async (s: Filter) => {
    const d = await adminCall<{ rows: Sms[] }>(`/api/admin/sms?status=${s}`);
    if (d.error) return setErr(d.error);
    setRows(d.rows ?? []);
    setErr("");
  }, []);

  useEffect(() => {
    let alive = true;
    const tick = () => load(status);
    const t = setTimeout(tick, 0);
    const iv = setInterval(tick, 5000);
    return () => {
      alive = false;
      clearTimeout(t);
      clearInterval(iv);
    };
  }, [status, load]);

  async function parse() {
    if (!paste.trim()) return;
    setParsing(true);
    setErr("");
    const d = await adminCall<{ success?: boolean; matchedDeposit?: boolean; matchedUser?: boolean; error?: string }>("/api/admin/sms/telebirr", {
      message: paste.trim(),
      sender: "telebirr",
    });
    setParsing(false);
    if (d.error) return setErr(d.error);
    setPaste("");
    setNote(`SMS parsed ✓${d.matchedDeposit ? " matched a pending deposit" : ""}${d.matchedUser ? " matched a player" : ""}`);
    load(status);
  }

  async function credit(s: Sms) {
    if (!confirm(`Credit Br ${fmt(s.amount)} to @${s.username}?\nTX ID: ${s.txid}\n\nMake sure the sender phone (${s.senderPhone ?? "unknown"}) matches the player's account.`)) return;
    setBusyId(s.id);
    setErr("");
    const r = await adminCall<{ bonus?: number }>("/api/admin/sms/credit", { id: s.id });
    setBusyId(null);
    if (r.error) return setErr(r.error);
    setNote(`Credited Br ${fmt(s.amount)} to @${s.username}${r.bonus ? ` + Br ${fmt(r.bonus)} welcome bonus` : ""}`);
    load(status);
  }

  async function ignore(s: Sms) {
    if (!confirm(`Mark TX ${s.txid} as ignored (not a deposit)?`)) return;
    setBusyId(s.id);
    setErr("");
    const r = await adminCall("/api/admin/sms/ignore", { id: s.id });
    setBusyId(null);
    if (r.error) return setErr(r.error);
    setNote("SMS ignored");
    load(status);
  }

  const webhookUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/api/admin/sms/telebirr`;
  const setup = `MacroDroid / Tasker (GET):\n${webhookUrl}?text=%SMSTEXT%&sender=telebirr&secret=${getToken()}`;

  return (
    <div className="space-y-4">
      <SectionTitle
        icon="📟"
        title="Telebirr SMS"
        right={
          <div className="flex rounded-xl bg-card p-1">
            {(["pending", "credited", "ignored", "all"] as const).map((s) => (
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

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line/60 bg-card p-4">
          <div className="text-sm font-black">📲 Forward SMS from your phone</div>
          <p className="mt-1 text-xs text-mute">Point your SMS forwarder (MacroDroid, Tasker…) or the sms-gateway webhook at this URL. New deposits appear here automatically.</p>
          <div className="mt-3 space-y-2 text-xs">
            <div>
              <div className="mb-1 font-bold text-mute">Webhook URL</div>
              <code className="block select-all rounded-lg bg-bg px-3 py-2 font-mono break-all">{webhookUrl}</code>
            </div>
            <div>
              <div className="mb-1 font-bold text-mute">Example (MacroDroid/Tasker HTTP command)</div>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-bg px-3 py-2 font-mono text-[11px] text-wrap">{setup}</pre>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-line/60 bg-card p-4">
          <div className="text-sm font-black">📋 Paste an SMS manually</div>
          <p className="mt-1 text-xs text-mute">No forwarder set up yet? Paste the deposit SMS from your phone and it will be queued the same way.</p>
          <textarea
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            rows={4}
            className="input mt-3 w-full resize-none text-xs"
            placeholder="Dear customer, you have deposited ETB 500.00 to your telebirr account on … Transaction ID: …"
          />
          <button onClick={parse} disabled={parsing || !paste.trim()} className="btn-gold mt-2 rounded-lg px-4 py-2 text-sm font-black disabled:opacity-40">
            {parsing ? "Parsing…" : "Parse & queue"}
          </button>
        </div>
      </div>

      {note && <Notice kind="ok">{note}</Notice>}
      {err && <Notice kind="err">{err}</Notice>}

      {rows === null ? (
        <Loading />
      ) : rows.length === 0 ? (
        <Empty text={status === "pending" ? "No pending SMS — waiting for a deposit notification from your phone 📟" : `No ${status === "all" ? "" : status + " "}SMS found.`} />
      ) : (
        <TableShell>
          <thead>
            <tr className="border-b border-line/60 bg-card2/40">
              <Th>When</Th>
              <Th>TX ID</Th>
              <Th right>Amount</Th>
              <Th>Type</Th>
              <Th>Sender</Th>
              <Th>Match</Th>
              <Th>Status</Th>
              <Th right>Action</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-b border-line/40 align-top last:border-0 hover:bg-white/[0.03]">
                <Td className="text-xs text-mute">{timeAgo(s.createdAt)}</Td>
                <Td>
                  <span className="select-all rounded bg-bg px-2 py-1 font-mono text-xs">{s.txid}</span>
                </Td>
                <Td right className="font-black text-gold">Br {fmt(s.amount)}</Td>
                <Td className="text-mute">{s.type}</Td>
                <Td>
                  <div className="text-xs font-bold">{s.senderName ?? "—"}</div>
                  <div className="font-mono text-xs text-mute">{s.senderPhone ?? "—"}</div>
                </Td>
                <Td>
                  {s.username ? (
                    <div>
                      <div className="text-xs font-bold text-win">@{s.username}</div>
                      <div className="font-mono text-[11px] text-mute">{s.userPhone}</div>
                      {s.ref && <div className="font-mono text-[11px] text-gold">{s.ref}</div>}
                    </div>
                  ) : (
                    <span className="text-xs text-mute">No player match</span>
                  )}
                </Td>
                <Td><Badge value={s.status} /></Td>
                <Td right>
                  {s.status === "pending" ? (
                    <div className="flex justify-end gap-1.5">
                      <button
                        disabled={busyId !== null || !s.username}
                        onClick={() => credit(s)}
                        title={s.username ? "Credit this deposit to the matched player" : "No player matched yet — can’t credit"}
                        className="btn-green rounded-lg px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ✓ Credit
                      </button>
                      <button disabled={busyId !== null} onClick={() => ignore(s)} className="rounded-lg bg-lose/20 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-lose/30">
                        ✕
                      </button>
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
      <p className="text-xs text-mute">Credit auto-matches the TX ID and amount to a pending deposit if one exists, otherwise credits the player whose phone sent the SMS. Welcome bonus applies to first deposits.</p>
    </div>
  );
}
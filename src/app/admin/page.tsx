"use client";

import { useCallback, useEffect, useState } from "react";

type Deposit = {
  id: number;
  userId: number;
  username: string;
  phone: string;
  type: string;
  amount: number;
  status: string;
  method: string | null;
  reference: string | null;
  txid: string | null;
  createdAt: string;
};

const TOKEN_KEY = "zb_admin_token";

async function call<T = Record<string, unknown>>(url: string, body?: unknown): Promise<T & { error?: string }> {
  const token = sessionStorage.getItem(TOKEN_KEY) ?? "";
  const res = await fetch(url, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? { Authorization: `Bearer ${token}` } : { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  return (await res.json().catch(() => ({ error: "Network error" }))) as T & { error?: string };
}

const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [status, setStatus] = useState<"pending" | "all">("pending");
  const [rows, setRows] = useState<Deposit[] | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setAuthed(Boolean(sessionStorage.getItem(TOKEN_KEY)));
      setChecking(false);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const load = useCallback(async () => {
    const d = await call<{ rows: Deposit[] }>(`/api/admin/deposits?status=${status}`);
    if (d.error) return setErr(d.error);
    setRows(d.rows ?? []);
    setErr("");
  }, [status]);

  useEffect(() => {
    if (!authed) return;
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [authed, load]);

  async function tryLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    sessionStorage.setItem(TOKEN_KEY, token);
    const d = await call<{ rows: Deposit[] }>("/api/admin/deposits?status=pending");
    if (d.error || !d.rows) {
      sessionStorage.removeItem(TOKEN_KEY);
      setErr("Invalid admin passcode");
      setBusy(false);
      return;
    }
    setAuthed(true);
    setBusy(false);
  }

  async function approve(d: Deposit) {
    if (!confirm(`Approve deposit Br ${fmt(d.amount)} for @${d.username}? Verify the SMS matches ${d.txid}.`)) return;
    setBusy(true);
    setErr("");
    const r = await call<{ bonus?: number }>("/api/admin/deposits/approve", { id: d.id, amount: d.amount, txid: d.txid });
    setBusy(false);
    if (r.error) return setErr(`Failed: ${r.error} ${r.error === "Amount does not match the deposit request" ? "— edit the amount to match the SMS." : ""}`);
    setNote(`Approved ${d.reference} (+Br ${fmt(d.amount)}${r.bonus ? `, bonus +${fmt(r.bonus)}` : ""})`);
    load();
  }

  async function reject(d: Deposit) {
    if (!confirm(`Reject deposit ${d.reference} (Br ${fmt(d.amount)})?`)) return;
    setBusy(true);
    setErr("");
    const r = await call("/api/admin/deposits/reject", { id: d.id });
    setBusy(false);
    if (r.error) return setErr(r.error);
    setNote(`Rejected ${d.reference}`);
    load();
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
    setRows(null);
    setNote("");
  }

  if (checking) return <div className="h-60 animate-pulse rounded-2xl bg-card" />;

  if (!authed)
    return (
      <div className="mx-auto max-w-sm py-16">
        <h1 className="mb-1 text-2xl font-black">🔐 Admin Panel</h1>
        <p className="mb-5 text-sm text-mute">Enter the admin passcode to review and approve deposits.</p>
        <form onSubmit={tryLogin} className="space-y-3">
          <input type="password" className="input" placeholder="Admin passcode" value={token} onChange={(e) => setToken(e.target.value)} required />
          {err && <p className="rounded-lg bg-lose/10 px-3 py-2 text-sm text-red-300">{err}</p>}
          <button disabled={busy} className="btn-gold w-full rounded-xl py-3">{busy ? "Checking…" : "Unlock"}</button>
        </form>
      </div>
    );

  const pending = rows?.filter((r) => r.status === "pending") ?? [];
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black">🔐 Deposit Approval</h1>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-card p-1">
            {(["pending", "all"] as const).map((s) => (
              <button key={s} onClick={() => setStatus(s)} className={`rounded-lg px-3 py-1.5 text-sm font-bold capitalize ${status === s ? "bg-card2" : "text-mute"}`}>{s}</button>
            ))}
          </div>
          <button onClick={logout} className="btn-ghost rounded-lg px-3 py-1.5 text-sm">Log out</button>
        </div>
      </div>

      {note && <div className="rounded-xl border border-win/40 bg-win/10 px-4 py-2 text-sm text-win">{note}</div>}
      {err && <div className="rounded-xl border border-lose/40 bg-lose/10 px-4 py-2 text-sm text-red-300">{err}</div>}

      {status === "pending" && pending.length === 0 ? (
        <p className="rounded-2xl bg-card py-10 text-center text-mute">All caught up — no pending deposits. 🎉</p>
      ) : rows === null ? (
        <div className="h-40 animate-pulse rounded-2xl bg-card" />
      ) : rows.length === 0 ? (
        <p className="rounded-2xl bg-card py-10 text-center text-mute">No deposits found.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((d) => (
            <div key={d.id} className="rounded-2xl bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="font-bold">{d.reference ?? `#${d.id}`} <span className={`ml-1 text-[11px] font-bold uppercase ${d.status === "completed" ? "text-mute" : d.status === "rejected" ? "text-lose" : "text-gold"}`}>{d.status}</span></div>
                  <div className="text-sm text-mute">@{d.username} · {d.phone} · deposit · {d.method}</div>
                  <div className="mt-1 font-black text-lg">Br {fmt(d.amount)}</div>
                  <div className="text-xs text-mute" suppressHydrationWarning>{new Date(d.createdAt).toLocaleString()}</div>
                </div>
                <div className="rounded-xl bg-bg px-3 py-2 font-mono text-sm">{d.txid}</div>
              </div>
              {d.status === "pending" && (
                <div className="mt-3 flex gap-2">
                  <button disabled={busy} onClick={() => approve(d)} className="btn-green flex-1 rounded-xl py-2.5 text-sm">✓ Approve</button>
                  <button disabled={busy} onClick={() => reject(d)} className="flex-1 rounded-xl bg-lose/20 py-2.5 text-sm font-bold text-red-300 hover:bg-lose/30">✕ Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
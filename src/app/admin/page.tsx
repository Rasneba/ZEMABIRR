"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminCall, clearToken, getToken, setToken } from "@/components/admin/api";
import Dashboard from "@/components/admin/Dashboard";
import Deposits from "@/components/admin/Deposits";
import Withdrawals from "@/components/admin/Withdrawals";
import Users from "@/components/admin/Users";
import Games from "@/components/admin/Games";
import Transactions from "@/components/admin/Transactions";
import Promos from "@/components/admin/Promos";
import Sports from "@/components/admin/Sports";
import Sms from "@/components/admin/Sms";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "deposits", label: "Deposits", icon: "💳" },
  { id: "sms", label: "Telebirr", icon: "📟" },
  { id: "withdrawals", label: "Withdrawals", icon: "🏦" },
  { id: "users", label: "Players", icon: "👥" },
  { id: "games", label: "Games", icon: "🎰" },
  { id: "sports", label: "Sports", icon: "⚽" },
  { id: "ledger", label: "Ledger", icon: "🧾" },
  { id: "promos", label: "Promos", icon: "🎟️" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function AdminShell() {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("tab") ?? "dashboard";
  const tab: TabId = TABS.some((t) => t.id === raw) ? (raw as TabId) : "dashboard";

  const goTo = (t: string) => router.replace(`/admin?tab=${t}`);

  function logout() {
    clearToken();
    router.replace("/admin");
    window.location.reload();
  }

  return (
    <div className="-mx-3 -mt-4 md:-mx-6">
      <div className="sticky top-14 z-30 border-b border-line bg-side/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold font-black text-black">Z</span>
            <div>
              <div className="text-sm font-black leading-tight">Zema Games · Admin</div>
              <div className="text-[11px] leading-tight text-mute">Production control center</div>
            </div>
          </div>
          <button onClick={logout} className="btn-ghost rounded-lg px-3 py-1.5 text-sm">🔒 Lock panel</button>
        </div>
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 pb-2 no-scrollbar">
          <div className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => goTo(t.id)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-bold transition-colors ${
                  tab === t.id ? "bg-gold text-black" : "text-mute hover:bg-white/5 hover:text-white"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {tab === "dashboard" && <Dashboard goTo={goTo} />}
        {tab === "deposits" && <Deposits />}
        {tab === "sms" && <Sms />}
        {tab === "withdrawals" && <Withdrawals />}
        {tab === "users" && <Users />}
        {tab === "games" && <Games />}
        {tab === "sports" && <Sports />}
        {tab === "ledger" && <Transactions />}
        {tab === "promos" && <Promos />}
      </div>
    </div>
  );
}

function LoginGate({ onUnlock }: { onUnlock: () => void }) {
  const [token, setTokenValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function tryLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    setToken(token);
    const d = await adminCall<{ rows: unknown[] }>("/api/admin/deposits?status=pending");
    if (d.error || !d.rows) {
      clearToken();
      setErr("Invalid admin passcode");
      setBusy(false);
      return;
    }
    setBusy(false);
    onUnlock();
  }

  return (
    <div className="mx-auto max-w-sm py-16">
      <div className="rounded-2xl border border-line bg-card p-6">
        <h1 className="text-2xl font-black">🔐 Admin Panel</h1>
        <p className="mb-5 mt-1 text-sm text-mute">Enter the admin passcode to manage the casino, payments, players and games.</p>
        <form onSubmit={tryLogin} className="space-y-3">
          <input
            type="password"
            className="input"
            placeholder="Admin passcode"
            value={token}
            onChange={(e) => setTokenValue(e.target.value)}
            autoFocus
            required
          />
          {err && <p className="rounded-lg bg-lose/10 px-3 py-2 text-sm text-red-300">{err}</p>}
          <button disabled={busy} className="btn-gold w-full rounded-xl py-3">
            {busy ? "Checking…" : "Unlock"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (getToken()) {
        const d = await adminCall<{ rows: unknown[] }>("/api/admin/deposits?status=pending");
        setAuthed(Boolean(!d.error && d.rows));
      }
      setChecking(false);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  if (checking) return <div className="h-60 animate-pulse rounded-2xl bg-card" />;
  if (!authed) return <LoginGate onUnlock={() => setAuthed(true)} />;

  return (
    <Suspense fallback={<div className="h-60 animate-pulse rounded-2xl bg-card" />}>
      <AdminShell />
    </Suspense>
  );
}

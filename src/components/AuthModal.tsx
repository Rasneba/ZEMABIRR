"use client";

import { useEffect, useState } from "react";
import { api, useApp } from "./AppProvider";
import Logo from "./Logo";

declare global {
  interface Window {
    onTelegramLogin?: (user: Record<string, unknown>) => void;
  }
}

export default function AuthModal() {
  const { authMode, openAuth, refresh, toast } = useApp();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [ref, setRef] = useState("");
  const [age, setAge] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [tgBot, setTgBot] = useState<string | null>(null);
  const [tgBusy, setTgBusy] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      const q = new URLSearchParams(window.location.search).get("ref");
      if (q) {
        localStorage.setItem("zb_ref", q);
        openAuth("register");
      }
      setRef(localStorage.getItem("zb_ref") ?? "");
    }, 0);
    return () => clearTimeout(t);
  }, [openAuth]);

  useEffect(() => {
    if (!authMode) return;
    let cancelled = false;
    (async () => {
      const d = await api<{ botUsername?: string | null }>("/api/tg/config");
      if (cancelled || !d.botUsername) return;
      setTgBot(d.botUsername);
      const holder = document.getElementById("zb-tg-widget");
      if (!holder) return;
      holder.innerHTML = "";
      window.onTelegramLogin = (user) => void handleTgLogin(user);
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://telegram.org/js/telegram-widget.js?22";
      s.setAttribute("data-telegram-login", d.botUsername);
      s.setAttribute("data-size", "large");
      s.setAttribute("data-radius", "10");
      s.setAttribute("data-request-access", "write");
      s.setAttribute("data-onauth", "onTelegramLogin(user)");
      holder.appendChild(s);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authMode]);

  async function handleTgLogin(user: Record<string, unknown>) {
    if (tgBusy) return;
    setTgBusy(true);
    setErr("");
    const d = await api<{ ok?: boolean }>("/api/auth/telegram/widget", { user });
    setTgBusy(false);
    if (d.error) return setErr(d.error);
    await refresh();
    openAuth(null);
    toast("Welcome! Logged in with Telegram", "success");
  }

  if (!authMode) return null;
  const isLogin = authMode === "login";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const d = await api(isLogin ? "/api/auth/login" : "/api/auth/register", { phone, password, username, ref, age });
    setBusy(false);
    if (d.error) return setErr(d.error);
    await refresh();
    openAuth(null);
    toast(isLogin ? "Welcome back!" : "Account created! Make your first deposit to get a 200% bonus 🎉", "success");
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 sm:items-center" onClick={() => openAuth(null)}>
      <div className="animate-pop w-full max-w-md rounded-t-2xl bg-card p-6 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <Logo size="sm" />
          <button onClick={() => openAuth(null)} className="text-2xl text-mute hover:text-white">×</button>
        </div>
        {!isLogin && (
          <div className="mb-4 rounded-xl border border-win/30 bg-win/10 p-3 text-sm">
            <b className="text-win">GET 200% BONUS</b> on your first deposit — up to Br 10,000!
          </div>
        )}
        <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-bg p-1">
          {(["login", "register"] as const).map((m) => (
            <button key={m} onClick={() => { setErr(""); openAuth(m); }} className={`rounded-lg py-2 text-sm font-bold ${authMode === m ? "bg-card2 text-white" : "text-mute"}`}>
              {m === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>
        {tgBot && (
          <div className="mb-5">
            <div id="zb-tg-widget" className="flex justify-center" />
            <div className="my-4 flex items-center gap-3 text-xs text-mute">
              <span className="h-px flex-1 bg-line" />
              or continue with phone
              <span className="h-px flex-1 bg-line" />
            </div>
          </div>
        )}
        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs text-mute">Phone number</span>
            <div className="flex">
              <span className="flex items-center rounded-l-[10px] border border-r-0 border-line bg-card2 px-3 text-sm">🇪🇹 +251</span>
              <input className="input !rounded-l-none" placeholder="9XXXXXXXX" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </label>
          {!isLogin && (
            <label className="block">
              <span className="mb-1 block text-xs text-mute">Username</span>
              <input className="input" placeholder="Choose a nickname" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </label>
          )}
          <label className="block">
            <span className="mb-1 block text-xs text-mute">Password</span>
            <input className="input" type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {!isLogin && (
            <>
              <label className="block">
                <span className="mb-1 block text-xs text-mute">Referral code (optional)</span>
                <input className="input uppercase" value={ref} onChange={(e) => setRef(e.target.value)} />
              </label>
              <label className="flex items-center gap-2 text-xs text-mute">
                <input type="checkbox" checked={age} onChange={(e) => setAge(e.target.checked)} className="accent-[#e5b224]" />
                I confirm I am 21+ and accept the Terms &amp; Conditions
              </label>
            </>
          )}
          {err && <p className="rounded-lg bg-lose/10 px-3 py-2 text-sm text-red-300">{err}</p>}
          <button disabled={busy} className="btn-gold w-full rounded-xl py-3">
            {busy ? "Please wait…" : isLogin ? "Log in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

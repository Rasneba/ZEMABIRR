"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/components/AppProvider";
import { BRAND, fmt } from "@/lib/brand";

export default function ReferralPage() {
  const { user, openAuth, toast } = useApp();
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setOrigin(window.location.origin), 0);
    return () => clearTimeout(t);
  }, []);
  const link = user ? `${origin}/?ref=${user.referralCode}` : "";

  function copy(text: string) {
    navigator.clipboard?.writeText(text);
    toast("Copied to clipboard", "success");
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gold/30 via-card to-card p-6 sm:p-10">
        <div className="text-xs font-bold uppercase text-gold">Referral</div>
        <h1 className="text-3xl font-black sm:text-5xl">Invite friends. Earn {BRAND.currency} 100.</h1>
        <p className="mt-2 max-w-lg text-mute">You earn {BRAND.currency} 100 when a new friend makes their first deposit — credited straight to your wallet. No limits!</p>
        <span className="pointer-events-none absolute -right-2 -bottom-4 text-[120px] animate-floaty sm:text-[180px]">🎁</span>
      </div>

      {!user ? (
        <button onClick={() => openAuth("register")} className="btn-gold rounded-xl px-8 py-3">Sign up to get your link</button>
      ) : (
        <>
          <div className="rounded-2xl bg-card p-5">
            <div className="mb-2 text-sm font-bold">Your referral link</div>
            <div className="flex gap-2">
              <input className="input text-sm" readOnly value={link} />
              <button onClick={() => copy(link)} className="btn-gold shrink-0 rounded-xl px-4">Copy</button>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-mute">Code:</span>
              <b className="rounded bg-bg px-2 py-1 tracking-widest">{user.referralCode}</b>
              <button onClick={() => copy(user.referralCode)} className="text-xs text-gold">Copy</button>
              <a className="ml-auto rounded-lg bg-[#229ED9] px-3 py-1.5 text-xs font-bold" target="_blank" rel="noreferrer" href={`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(`Join me on ${BRAND.name} and get a 200% bonus!`)}`}>Share on Telegram</a>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-card p-4"><div className="text-xs text-mute">Friends invited</div><div className="text-2xl font-black">{user.invited}</div></div>
            <div className="rounded-2xl bg-card p-4"><div className="text-xs text-mute">Deposited</div><div className="text-2xl font-black">{user.invitedDeposited}</div></div>
            <div className="rounded-2xl bg-card p-4"><div className="text-xs text-mute">Earned</div><div className="text-2xl font-black text-win">{fmt(user.invitedDeposited * 100)}</div></div>
          </div>
        </>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { i: "🔗", t: "Share your link", d: "Send your personal link to friends via Telegram or SMS." },
          { i: "📝", t: "Friend signs up", d: "They register using your link or referral code." },
          { i: "💵", t: `Earn ${BRAND.currency} 100`, d: "Once they make their first deposit, you get paid." },
        ].map((s) => (
          <div key={s.t} className="rounded-2xl bg-card p-5">
            <div className="text-3xl">{s.i}</div>
            <div className="mt-2 font-bold">{s.t}</div>
            <p className="text-sm text-mute">{s.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

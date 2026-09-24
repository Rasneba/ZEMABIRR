"use client";

import Countdown from "@/components/Countdown";
import { useApp } from "@/components/AppProvider";
import { fmt } from "@/lib/brand";

export default function BonusPage() {
  const { user, openAuth, openWallet } = useApp();
  return (
    <div className="space-y-6">
      <div className="glow-green relative overflow-hidden rounded-2xl border border-win/20 bg-gradient-to-br from-win/20 via-card to-gold/10 p-6 sm:p-10">
        <div className="text-xs font-bold uppercase tracking-widest text-win">Claim Your Free Reward</div>
        <h1 className="mt-1 text-4xl font-black sm:text-6xl"><span className="text-shimmer">GET 200% BONUS</span></h1>
        <p className="mt-2 max-w-lg text-mute">Deposit now and we&apos;ll triple it! Your first deposit is matched 200% up to Br 10,000. Offer ends in:</p>
        <div className="mt-4"><Countdown big /></div>
        <div className="mt-6">
          {!user ? (
            <button onClick={() => openAuth("register")} className="btn-gold rounded-xl px-8 py-3 text-lg">Sign up &amp; claim</button>
          ) : user.firstDepositDone ? (
            <div className="inline-block rounded-xl bg-win/15 px-4 py-3 font-bold text-win">✅ Welcome bonus already claimed</div>
          ) : (
            <button onClick={() => openWallet("deposit")} className="btn-gold rounded-xl px-8 py-3 text-lg">Deposit &amp; claim</button>
          )}
        </div>
        <span className="pointer-events-none absolute -right-4 -bottom-6 text-[140px] opacity-80 animate-floaty sm:text-[200px]">🎁</span>
      </div>

      {user && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card p-4"><div className="text-xs text-mute">Bonus balance</div><div className="text-2xl font-black text-gold">{fmt(user.bonusBalance)}</div></div>
          <div className="rounded-2xl bg-card p-4"><div className="text-xs text-mute">Real balance</div><div className="text-2xl font-black">{fmt(user.balance)}</div></div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { n: "1", t: "Create an account", d: "Sign up in seconds with your phone number." },
          { n: "2", t: "Make a deposit", d: "Use telebirr, CBE Birr, M-PESA or USDT. Min Br 10." },
          { n: "3", t: "Get 200% bonus", d: "Bonus is credited instantly to your bonus balance." },
        ].map((s) => (
          <div key={s.n} className="rounded-2xl bg-card p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-black text-black">{s.n}</span>
            <div className="mt-3 font-bold">{s.t}</div>
            <p className="text-sm text-mute">{s.d}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-card p-5 text-sm text-mute">
        <h3 className="mb-2 font-bold text-white">Bonus terms</h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>One welcome bonus per player, household and phone number.</li>
          <li>Bonus funds can be used to play all games and sports but cannot be withdrawn directly; winnings are paid to your real balance.</li>
          <li>Stakes are taken from your real balance first, then from your bonus balance.</li>
          <li>{`Maximum bonus is Br 10,000. Players must be 21+.`}</li>
        </ul>
      </div>
    </div>
  );
}

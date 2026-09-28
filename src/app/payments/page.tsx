import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, fmt } from "@/lib/brand";
import { PAY_METHODS, Withdraw_METHODS } from "@/lib/payments";

export const metadata: Metadata = {
  title: `Payments — ${BRAND.name}`,
  description: `Deposit and withdraw with telebirr, CBE Birr, M-Pesa and USDT (TRC20) on ${BRAND.name}. Fast deposits, agent-verified transactions and instant cashouts.`,
};

export default function PaymentsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-gold/25 via-card to-card p-6 sm:p-8">
        <div className="text-xs font-bold uppercase tracking-widest text-gold">Deposits & Withdrawals</div>
        <h1 className="mt-1 text-3xl font-black">💳 Payments</h1>
        <p className="mt-2 max-w-xl text-sm text-mute">
          Top up instantly with telebirr, CBE Birr, M-Pesa or USDT (TRC20). Deposits are agent-verified from your SMS
          transaction ID; withdrawals are paid out after a quick review. Limits: deposits {fmt(BRAND.depositMin)} –
          {fmt(BRAND.depositMax)}, withdrawals {fmt(BRAND.withdrawMin)} – {fmt(BRAND.withdrawMax)}.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-bold">📥 How to deposit</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {PAY_METHODS.map((p) => (
            <div key={p.id} className="rounded-2xl bg-card p-5 ring-1 ring-white/5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl text-xl" style={{ background: p.color }}>{p.emoji}</span>
                <div className="flex-1">
                  <div className="font-black">{p.name}</div>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <span className="rounded bg-win/15 px-1.5 py-0.5 font-bold text-win">{p.tag}</span>
                    <span className="rounded bg-bg px-1.5 py-0.5 text-mute">{p.speed}</span>
                    <span className="rounded bg-bg px-1.5 py-0.5 text-mute">{p.limits}</span>
                  </div>
                </div>
              </div>
              <ol className="mt-4 space-y-2 text-sm text-mute">
                {p.steps.map((s, i) => (
                  <li key={i} className="flex gap-2"><span className="font-black text-gold">{i + 1}.</span><span>{s}</span></li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl border border-win/20 bg-win/10 p-4 text-sm">
          🎁 <b className="text-win">First deposit bonus:</b> your first deposit is matched <b>200%</b>, up to{" "}
          {fmt(10000)} — credited instantly to your bonus balance after approval.
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">📤 How to withdraw</h2>
        <div className="rounded-2xl bg-card p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {Withdraw_METHODS.map((m) => (
              <span key={m.id} className="flex items-center gap-2 rounded-lg bg-bg px-3 py-1.5 text-xs font-bold">
                <span className="flex h-6 w-6 items-center justify-center rounded-md text-sm" style={{ background: m.color }}>{m.emoji}</span>
                {m.name}
              </span>
            ))}
          </div>
          <ol className="space-y-2 text-sm text-mute">
            <li className="flex gap-2"><span className="font-black text-gold">1.</span><span>Open <b className="text-white">Wallet → Withdraw</b> and pick your payout method.</span></li>
            <li className="flex gap-2"><span className="font-black text-gold">2.</span><span>Enter the exact amount and your receiving account number / wallet address.</span></li>
            <li className="flex gap-2"><span className="font-black text-gold">3.</span><span>Our team reviews and pays you out — keep your account details correct, they match the name on file.</span></li>
          </ol>
          <p className="mt-3 rounded-lg bg-bg px-3 py-2 text-xs text-mute">
            Only your real (non-bonus) balance is withdrawable. Minimum withdrawal is {fmt(BRAND.withdrawMin)}, maximum{" "}
            {fmt(BRAND.withdrawMax)} per request.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">🛡️ Security tips</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            "Never share your transaction ID or account number outside this website.",
            "Deposits are credited only after the agent verifies the matching SMS reference.",
            `Send exactly the amount you entered — mismatched amounts are rejected automatically.`,
            "Questions? Contact us on Telegram before sending money.",
          ].map((t) => (
            <div key={t} className="rounded-xl bg-card p-4 text-sm text-mute">✅ {t}</div>
          ))}
        </div>
      </section>

      <div className="rounded-2xl bg-gradient-to-r from-gold/30 via-card to-card p-6 text-center ring-1 ring-gold/20">
        <div className="text-lg font-black">Ready to play?</div>
        <p className="mb-4 text-sm text-mute">Deposit in minutes and claim your 200% welcome bonus.</p>
        <div className="flex justify-center gap-3">
          <Link href="/wallet" className="btn-gold rounded-xl px-6 py-2.5 text-sm">Go to Wallet</Link>
          <Link href="/casino" className="btn-ghost rounded-xl px-6 py-2.5 text-sm">Browse Games</Link>
        </div>
      </div>
    </div>
  );
}
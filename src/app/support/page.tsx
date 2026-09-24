import { BRAND, FAQ } from "@/lib/brand";

export const metadata = { title: `Help Center — ${BRAND.name}` };

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-win/20 via-card to-card p-6">
        <h1 className="text-3xl font-black">❓ Help Center</h1>
        <p className="mt-1 text-mute">Find answers to common questions or reach our 24/7 support team.</p>
      </div>
      <section className="space-y-2">
        {FAQ.map((f) => (
          <details key={f.q} className="group rounded-xl bg-card p-4">
            <summary className="cursor-pointer list-none font-bold">{f.q}<span className="float-right text-mute group-open:rotate-180">▾</span></summary>
            <p className="mt-2 text-sm leading-relaxed text-mute">{f.a}</p>
          </details>
        ))}
      </section>
      <section id="contact" className="grid gap-3 sm:grid-cols-3">
        <a href={BRAND.telegramSupport} target="_blank" rel="noreferrer" className="rounded-2xl bg-card p-5 hover:bg-card2">
          <div className="text-3xl">💬</div><div className="mt-2 font-bold">Support Chat</div><p className="text-sm text-mute">Chat with us on Telegram 24/7</p>
        </a>
        <a href={`mailto:${BRAND.email}`} className="rounded-2xl bg-card p-5 hover:bg-card2">
          <div className="text-3xl">✉️</div><div className="mt-2 font-bold">Email</div><p className="text-sm text-mute">{BRAND.email}</p>
        </a>
        <a href={BRAND.telegram} target="_blank" rel="noreferrer" className="rounded-2xl bg-card p-5 hover:bg-card2">
          <div className="text-3xl">📢</div><div className="mt-2 font-bold">Telegram Channel</div><p className="text-sm text-mute">News, promo codes &amp; giveaways</p>
        </a>
      </section>
      <div className="rounded-2xl border border-lose/30 bg-lose/5 p-5 text-sm text-mute">
        <b className="text-white">Responsible gaming:</b> Gambling should be entertaining, not a way to make money. Only play with money you can afford to lose. {BRAND.name} is strictly for players aged 21 and over.
      </div>
    </div>
  );
}

import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { gameRounds, users } from "@/db/schema";
import BannerCarousel from "@/components/BannerCarousel";
import GameCard from "@/components/GameCard";
import { GAMES } from "@/lib/games";
import { BRAND, fmt } from "@/lib/brand";
import { getFixtures } from "@/lib/sports";

export const dynamic = "force-dynamic";

const FEATURES = [
  { href: "/spin", title: "Spin & Win", sub: "Spin to win rewards", icon: "🎡", from: "from-[#6d28d9]/40" },
  { href: "/lootboxes", title: "Shamo Giveaway", sub: "Mystery boxes · win ETB", icon: "📦", from: "from-[#b45309]/40", badge: "New" },
  { href: "/vip", title: "VIP Club", sub: "Explorer → Diamond", icon: "👑", from: "from-[#0e7490]/40" },
  { href: "/bonus", title: "Bonus", sub: "200% first deposit", icon: "💰", from: "from-[#15803d]/40" },
];

async function getWins() {
  try {
    const rows = await db
      .select({ game: gameRounds.game, payout: gameRounds.payout, multiplier: gameRounds.multiplier, username: users.username })
      .from(gameRounds)
      .innerJoin(users, eq(users.id, gameRounds.userId))
      .where(eq(gameRounds.status, "won"))
      .orderBy(desc(gameRounds.id))
      .limit(12);
    return rows;
  } catch {
    return [];
  }
}

export default async function Home() {
  const wins = await getWins();
  // dynamic="force-dynamic" RSC: Date.now/getFixtures are evaluated per request server-side
  // eslint-disable-next-line react-hooks/purity
  const upcoming = getFixtures().filter((m) => new Date(m.kickoff).getTime() > Date.now()).slice(0, 4);
  const mask = (u: string) => u.slice(0, 2) + "***" + u.slice(-1);
  const gameName = (slug: string) => GAMES.find((g) => g.slug === slug)?.name ?? (slug === "shamo" ? "Shamo Box" : slug);

  return (
    <div className="space-y-6">
      <BannerCarousel />

      <div className="grid grid-cols-3 gap-2">
        {[{ h: "/casino", l: "Casino", i: "🎰" }, { h: "/sports", l: "Sports", i: "⚽" }, { h: "/lootboxes", l: "Lootboxes", i: "🎁" }].map((c) => (
          <Link key={c.h} href={c.h} className="flex items-center justify-center gap-2 rounded-xl bg-card py-3 text-sm font-bold hover:bg-card2">
            <span className="text-xl">{c.i}</span>{c.l}
          </Link>
        ))}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">🔥 Games</h2>
          <Link href="/casino" className="text-sm font-semibold text-gold">See all →</Link>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-8">
          {GAMES.map((g) => <GameCard key={g.slug} game={g} />)}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">✨ Exclusive Features</h2>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Link key={f.href} href={f.href} className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${f.from} to-card p-4 ring-1 ring-white/5 hover:ring-gold/40`}>
              {f.badge && <span className="absolute top-2 right-2 rounded bg-win/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-win">{f.badge}</span>}
              <div className="text-4xl animate-floaty">{f.icon}</div>
              <div className="mt-2 font-bold">{f.title}</div>
              <div className="text-xs text-mute">{f.sub}</div>
            </Link>
          ))}
        </div>
      </section>

      <Link href="/referral" className="relative flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-gold/30 via-card to-card p-5 ring-1 ring-gold/20">
        <span className="text-5xl animate-floaty">🎁</span>
        <div className="flex-1">
          <div className="text-[11px] font-bold uppercase text-gold">Referral</div>
          <div className="text-lg font-black">Invite friends. Earn {BRAND.currency} 100.</div>
          <p className="text-sm text-mute">You earn {BRAND.currency} 100 when a new friend makes their first deposit, credited straight to your wallet.</p>
        </div>
        <span className="btn-gold hidden rounded-lg px-4 py-2 text-sm sm:block">Invite friends</span>
      </Link>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">⚽ Top Matches</h2>
          <Link href="/sports" className="text-sm font-semibold text-gold">All sports →</Link>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {upcoming.map((m) => (
            <Link key={m.id} href="/sports" className="rounded-xl bg-card p-3 hover:bg-card2">
              <div className="mb-2 flex justify-between text-[11px] text-mute">
                <span>{m.flag} {m.league}</span>
                <span suppressHydrationWarning>{new Date(m.kickoff).toLocaleString("en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <div className="mb-2 text-sm font-bold">{m.home} <span className="text-mute">vs</span> {m.away}</div>
              <div className="grid grid-cols-3 gap-1.5">
                {(["1", "X", "2"] as const).map((k) => (
                  <div key={k} className="flex justify-between rounded-lg bg-bg px-2 py-1.5 text-xs"><span className="text-mute">{k}</span><b className="text-gold">{m.odds[k].toFixed(2)}</b></div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {wins.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold">🏆 Latest Wins</h2>
          <div className="overflow-hidden rounded-xl bg-card">
            {wins.map((w, i) => (
              <div key={i} className="flex items-center justify-between border-b border-line/40 px-4 py-2.5 text-sm last:border-0">
                <span className="w-1/3 truncate">{gameName(w.game)}</span>
                <span className="w-1/4 text-mute">{mask(w.username)}</span>
                <span className="w-1/6 text-right text-mute">{w.multiplier.toFixed(2)}x</span>
                <span className="w-1/4 text-right font-bold text-win">{fmt(w.payout)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

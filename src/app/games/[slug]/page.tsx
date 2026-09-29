import { notFound } from "next/navigation";
import type { Metadata } from "next";
import GameView from "@/components/games/GameView";
import GameCard from "@/components/GameCard";
import { GAMES, getGame } from "@/lib/games";
import { BRAND } from "@/lib/brand";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGame(slug);
  return { title: g ? `${g.name} — ${BRAND.name}` : BRAND.name };
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  return (
    <div>
      <GameView slug={slug} />
      <h2 className="mt-8 mb-3 text-lg font-bold">More games</h2>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {GAMES.filter((g) => g.slug !== slug).map((g) => <GameCard key={g.slug} game={g} />)}
      </div>
    </div>
  );
}

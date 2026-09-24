import Link from "next/link";
import Image from "next/image";
import type { Game } from "@/lib/games";

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/games/${game.slug}`} className="group relative block overflow-hidden rounded-xl bg-card ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:ring-gold/50">
      <div className="relative aspect-square">
        <Image src={game.image} alt={game.name} fill sizes="(max-width:768px) 33vw, 200px" className="object-cover transition duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        {game.badge && (
          <span className={`absolute top-2 left-2 rounded px-1.5 py-0.5 text-[10px] font-black ${game.badge === "HOT" ? "bg-brand-red" : game.badge === "NEW" ? "bg-win" : "bg-gold text-black"}`}>
            {game.badge}
          </span>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
          <span className="btn-gold rounded-full px-4 py-1.5 text-xs">▶ Play</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-2">
          <div className="truncate text-sm font-bold leading-tight">{game.name}</div>
          <div className="truncate text-[10px] text-mute">{game.provider}</div>
        </div>
      </div>
      <div className="h-0.5 w-full" style={{ background: game.accent }} />
    </Link>
  );
}

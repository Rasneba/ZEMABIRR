"use client";

import { useState } from "react";
import GameCard from "@/components/GameCard";
import { GAMES } from "@/lib/games";

const CATS = ["All", "Crash", "Instant", "Keno", "Table"] as const;

export default function CasinoPage() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [q, setQ] = useState("");
  const list = GAMES.filter((g) => (cat === "All" || g.category === cat) && g.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-black">🎰 Casino</h1>
        <input className="input sm:max-w-xs" placeholder="🔍 Search games" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-bold ${cat === c ? "bg-gold text-black" : "bg-card text-white/80 hover:bg-card2"}`}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {list.map((g) => <GameCard key={g.slug} game={g} />)}
      </div>
      {list.length === 0 && <p className="py-10 text-center text-mute">No games found.</p>}
    </div>
  );
}

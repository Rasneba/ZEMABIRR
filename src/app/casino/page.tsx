"use client";

import { useMemo, useState } from "react";
import GameCard from "@/components/GameCard";
import { GAMES } from "@/lib/games";

const CATS = ["All", "Crash", "Instant", "Keno", "Table", "Live"] as const;
const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "az", label: "A → Z" },
] as const;
type SortId = (typeof SORTS)[number]["id"];

const BADGE_RANK: Record<string, number> = { TOP: 0, HOT: 1, NEW: 2 };

export default function CasinoPage() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [q, setQ] = useState("");
  const [provider, setProvider] = useState("All");
  const [sort, setSort] = useState<SortId>("featured");

  const providers = useMemo(() => [...new Set(GAMES.map((g) => g.provider))], []);

  const list = useMemo(() => {
    let out = GAMES.filter(
      (g) =>
        (cat === "All" || g.category === cat) &&
        (provider === "All" || g.provider === provider) &&
        g.name.toLowerCase().includes(q.toLowerCase())
    );
    if (sort === "newest") out = [...out].sort((a, b) => (BADGE_RANK[b.badge ?? ""] ?? 9) - (BADGE_RANK[a.badge ?? ""] ?? 9));
    else if (sort === "az") out = [...out].sort((a, b) => a.name.localeCompare(b.name));
    return out;
  }, [cat, q, provider, sort]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-black">🎰 Casino <span className="text-sm font-bold text-mute">{list.length} game{list.length === 1 ? "" : "s"}</span></h1>
        <div className="flex gap-2">
          <input className="input sm:w-48" placeholder="🔍 Search games" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="input !py-2 sm:w-44" value={provider} onChange={(e) => setProvider(e.target.value)}>
            <option value="All">All providers</option>
            {providers.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="mb-3 flex gap-2 overflow-x-auto no-scrollbar">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-bold ${cat === c ? "bg-gold text-black" : "bg-card text-white/80 hover:bg-card2"}`}>{c}</button>
        ))}
        <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full bg-card px-3 py-1.5 text-xs text-mute">
          Sort
          <select className="bg-transparent font-bold text-white outline-none" value={sort} onChange={(e) => setSort(e.target.value as SortId)}>
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {list.map((g) => <GameCard key={g.slug} game={g} />)}
      </div>
      {list.length === 0 && <p className="py-10 text-center text-mute">No games found.</p>}
    </div>
  );
}
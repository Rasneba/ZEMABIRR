"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, useApp } from "../AppProvider";
import { getGame } from "@/lib/games";
import { fmt } from "@/lib/brand";
import Crash from "./Crash";
import Mines from "./Mines";
import Chicken from "./Chicken";
import Keno from "./Keno";
import FastKeno from "./FastKeno";
import Roulette from "./Roulette";

type Row = { id: number; bet: number; payout: number; multiplier: number; status: string; createdAt: string };

function MyBets({ slug }: { slug: string }) {
  const { user } = useApp();
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    if (!user) return;
    api<{ rows: Row[] }>(`/api/history?kind=games&game=${slug}`).then((d) => setRows(d.rows ?? []));
  }, [user, slug]);
  if (!user) return null;
  return (
    <div className="mt-4 rounded-2xl bg-card p-4">
      <h3 className="mb-2 font-bold">My bets</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-mute">No bets yet.</p>
      ) : (
        <div className="max-h-72 overflow-y-auto text-sm">
          <div className="grid grid-cols-4 gap-2 border-b border-line pb-1 text-xs text-mute"><span>Time</span><span className="text-right">Bet</span><span className="text-right">Multiplier</span><span className="text-right">Payout</span></div>
          {rows.filter((r) => r.status !== "active").map((r) => (
            <div key={r.id} className="grid grid-cols-4 gap-2 border-b border-line/30 py-1.5">
              <span className="text-mute" suppressHydrationWarning>{new Date(r.createdAt).toLocaleTimeString()}</span>
              <span className="text-right">{fmt(r.bet)}</span>
              <span className="text-right">{r.multiplier.toFixed(2)}x</span>
              <span className={`text-right font-bold ${r.status === "won" ? "text-win" : "text-mute"}`}>{r.status === "won" ? `+${fmt(r.payout)}` : fmt(0)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GameView({ slug }: { slug: string }) {
  const game = getGame(slug)!;
  const [tick, setTick] = useState(0);
  const { user } = useApp();
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 8000);
    return () => clearInterval(t);
  }, []);
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm">
        <Link href="/casino" className="text-mute hover:text-white">Casino</Link>
        <span className="text-mute">/</span>
        <span className="font-bold">{game.name}</span>
        <span className="ml-auto rounded bg-white/5 px-2 py-0.5 text-xs text-mute">{game.provider}</span>
      </div>
      {game.engine === "crash" && <Crash key={game.slug} game={game} />}
      {game.engine === "mines" && <Mines />}
      {game.engine === "chicken" && <Chicken />}
      {game.engine === "keno" && <Keno key={game.slug} game={game} />}
      {game.engine === "fastkeno" && <FastKeno />}
      {game.engine === "roulette" && <Roulette game={game} />}
      {game.engine !== "fastkeno" && <MyBets key={`${tick}-${user?.balance}`} slug={slug} />}
    </div>
  );
}

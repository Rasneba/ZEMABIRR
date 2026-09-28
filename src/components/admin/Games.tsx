"use client";

import { useCallback, useEffect, useState } from "react";
import { adminCall, fmt, fmtDate, fmtInt } from "./api";
import { Badge, Card, Empty, Loading, Notice, SectionTitle, Segmented, Td, Th, TableShell } from "./ui";

type GameStat = {
  game: string;
  rounds: number;
  bet: number;
  payout: number;
  wins: number;
  losses: number;
  active: number;
  betToday: number;
  payoutToday: number;
};

type Round = {
  id: number;
  userId: number;
  username: string;
  game: string;
  bet: number;
  payout: number;
  multiplier: number;
  status: string;
  createdAt: string;
};

const GAME_LABELS: Record<string, string> = {
  "sky-jet": "Sky Jet",
  "avia-masters": "Avia Masters",
  aviator: "Aviator",
  "chicken-road": "Chicken Road",
  mines: "Mines",
  keno: "Keno",
  "fast-keno": "Fast Keno",
  "turbo-keno": "Turbo Keno",
  "mini-roulette": "Mini Roulette",
  shamo: "Shamo Lootbox",
};
const gameName = (g: string) => GAME_LABELS[g] ?? g;

export default function Games() {
  const [stats, setStats] = useState<GameStat[] | null>(null);
  const [rounds, setRounds] = useState<Round[] | null>(null);
  const [err, setErr] = useState("");
  const [gameFilter, setGameFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "won" | "lost" | "active">("all");

  const loadStats = useCallback(async () => {
    const d = await adminCall<{ rows: GameStat[] }>("/api/admin/games");
    if (d.error) return setErr(d.error);
    setStats(d.rows ?? []);
  }, []);

  const loadRounds = useCallback(async (game: string, status: string) => {
    const params = new URLSearchParams({ limit: "50" });
    if (game !== "all") params.set("game", game);
    if (status !== "all") params.set("status", status);
    const d = await adminCall<{ rows: Round[] }>(`/api/admin/rounds?${params}`);
    if (d.error) return setErr(d.error);
    setRounds(d.rows ?? []);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      loadStats();
      loadRounds(gameFilter, statusFilter);
    }, 0);
    return () => clearTimeout(t);
  }, [loadStats, loadRounds, gameFilter, statusFilter]);

  const totBet = stats?.reduce((a, s) => a + s.bet, 0) ?? 0;
  const totPay = stats?.reduce((a, s) => a + s.payout, 0) ?? 0;

  return (
    <div className="space-y-4">
      <SectionTitle
        icon="🎰"
        title="Games"
        right={
          <button onClick={() => { loadStats(); loadRounds(gameFilter, statusFilter); }} className="btn-ghost rounded-lg px-3 py-1.5 text-sm">↻ Refresh</button>
        }
      />
      {err && <Notice kind="err">{err}</Notice>}

      {stats === null ? (
        <Loading />
      ) : (
        <TableShell>
          <thead>
            <tr className="border-b border-line/60 bg-card2/40">
              <Th>Game</Th>
              <Th right>Rounds</Th>
              <Th right>Wagered</Th>
              <Th right>Paid out</Th>
              <Th right>GGR</Th>
              <Th right>RTP</Th>
              <Th right>W / L</Th>
              <Th right>Today (bet → pay)</Th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => {
              const ggr = s.bet - s.payout;
              const rtp = s.bet > 0 ? (s.payout / s.bet) * 100 : 0;
              return (
                <tr key={s.game} className="border-b border-line/40 last:border-0 hover:bg-white/[0.03]">
                  <Td>
                    <div className="font-bold">{gameName(s.game)}</div>
                    <div className="text-xs text-mute">{s.game}{s.active > 0 ? ` · ${s.active} active` : ""}</div>
                  </Td>
                  <Td right>{fmtInt(s.rounds)}</Td>
                  <Td right>Br {fmt(s.bet)}</Td>
                  <Td right>Br {fmt(s.payout)}</Td>
                  <Td right className={ggr >= 0 ? "font-bold text-win" : "font-bold text-lose"}>Br {fmt(ggr)}</Td>
                  <Td right className={rtp > 100 ? "text-lose" : "text-mute"}>{s.bet > 0 ? `${rtp.toFixed(1)}%` : "—"}</Td>
                  <Td right className="text-xs"><span className="text-win">{fmtInt(s.wins)}</span> / <span className="text-lose">{fmtInt(s.losses)}</span></Td>
                  <Td right className="text-xs text-mute">Br {fmt(s.betToday)} → Br {fmt(s.payoutToday)}</Td>
                </tr>
              );
            })}
            {stats.length > 0 && (
              <tr className="bg-card2/40 font-black">
                <Td>Total</Td>
                <Td right>{fmtInt(stats.reduce((a, s) => a + s.rounds, 0))}</Td>
                <Td right>Br {fmt(totBet)}</Td>
                <Td right>Br {fmt(totPay)}</Td>
                <Td right className={totBet - totPay >= 0 ? "text-win" : "text-lose"}>Br {fmt(totBet - totPay)}</Td>
                <Td right>{totBet > 0 ? `${((totPay / totBet) * 100).toFixed(1)}%` : "—"}</Td>
                <Td />
                <Td />
              </tr>
            )}
          </tbody>
        </TableShell>
      )}

      <Card className="p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-black uppercase tracking-wide text-mute">Round feed</h3>
          <div className="flex flex-wrap items-center gap-2">
            <select value={gameFilter} onChange={(e) => setGameFilter(e.target.value)} className="input w-40 py-1.5 text-sm">
              <option value="all">All games</option>
              {[...new Set([...(stats?.map((s) => s.game) ?? []), ...(rounds?.map((r) => r.game) ?? [])])].map((g) => (
                <option key={g} value={g}>{gameName(g)}</option>
              ))}
            </select>
            <Segmented options={["all", "won", "lost", "active"] as const} value={statusFilter} onChange={setStatusFilter} />
          </div>
        </div>
        {rounds === null ? (
          <Loading />
        ) : rounds.length === 0 ? (
          <Empty text="No rounds match the filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-line/60">
                  <Th>#</Th>
                  <Th>Player</Th>
                  <Th>Game</Th>
                  <Th right>Bet</Th>
                  <Th right>Payout</Th>
                  <Th right>×</Th>
                  <Th>Status</Th>
                  <Th>When</Th>
                </tr>
              </thead>
              <tbody>
                {rounds.map((r) => (
                  <tr key={r.id} className="border-b border-line/40 last:border-0 hover:bg-white/[0.03]">
                    <Td className="font-mono text-xs text-mute">{r.id}</Td>
                    <Td className="font-bold">@{r.username}</Td>
                    <Td className="text-mute">{gameName(r.game)}</Td>
                    <Td right>Br {fmt(r.bet)}</Td>
                    <Td right className={r.payout > 0 ? "font-bold text-win" : "text-mute"}>Br {fmt(r.payout)}</Td>
                    <Td right className="font-mono">{r.multiplier > 0 ? `${r.multiplier}×` : "—"}</Td>
                    <Td><Badge value={r.status} /></Td>
                    <Td className="text-xs text-mute">{fmtDate(r.createdAt)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { adminCall, fmt, fmtInt } from "./api";
import { Card, Loading, Notice, StatCard } from "./ui";
import { AreaLine, DualBars, type DayPoint } from "./Charts";

type Totals = {
  users: number;
  usersToday: number;
  usersBanned: number;
  depositsTotal: number;
  depositsToday: number;
  depositsPendingCount: number;
  depositsPendingSum: number;
  withdrawalsPaid: number;
  withdrawalsPendingCount: number;
  withdrawalsPendingSum: number;
  bonusGiven: number;
  wageredTotal: number;
  paidTotal: number;
  ggrTotal: number;
  wageredToday: number;
  paidToday: number;
  ggrToday: number;
  roundsTotal: number;
  roundsActive: number;
  roundsToday: number;
  sportsPendingCount: number;
  sportsExposure: number;
};

export default function Dashboard({ goTo }: { goTo: (tab: string) => void }) {
  const [totals, setTotals] = useState<Totals | null>(null);
  const [days, setDays] = useState<DayPoint[] | null>(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const d = await adminCall<{ totals: Totals; days: DayPoint[] }>("/api/admin/stats");
    if (d.error) return setErr(d.error);
    setTotals(d.totals);
    setDays(d.days ?? []);
    setErr("");
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  if (err) return <Notice kind="err">{err}</Notice>;
  if (!totals || !days) return <Loading label="Crunching the numbers…" />;

  const rtp = totals.wageredTotal > 0 ? (totals.paidTotal / totals.wageredTotal) * 100 : 0;

  return (
    <div className="space-y-4">
      {(totals.depositsPendingCount > 0 || totals.withdrawalsPendingCount > 0) && (
        <div className="flex flex-wrap gap-2">
          {totals.depositsPendingCount > 0 && (
            <button onClick={() => goTo("deposits")} className="flex-1 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-left text-sm hover:bg-gold/15">
              <span className="font-black text-gold">{totals.depositsPendingCount} deposit{totals.depositsPendingCount > 1 ? "s" : ""}</span>
              <span className="text-mute"> awaiting review · Br {fmt(totals.depositsPendingSum)} → open queue</span>
            </button>
          )}
          {totals.withdrawalsPendingCount > 0 && (
            <button onClick={() => goTo("withdrawals")} className="flex-1 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-left text-sm hover:bg-gold/15">
              <span className="font-black text-gold">{totals.withdrawalsPendingCount} withdrawal{totals.withdrawalsPendingCount > 1 ? "s" : ""}</span>
              <span className="text-mute"> to pay · Br {fmt(totals.withdrawalsPendingSum)} → open queue</span>
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Players" value={fmtInt(totals.users)} sub={`+${totals.usersToday} today · ${totals.usersBanned} banned`} />
        <StatCard label="Deposits (all-time)" value={`Br ${fmt(totals.depositsTotal)}`} sub={`Br ${fmt(totals.depositsToday)} today`} tone="win" />
        <StatCard label="Withdrawals paid" value={`Br ${fmt(totals.withdrawalsPaid)}`} sub={`${totals.withdrawalsPendingCount} processing · Br ${fmt(totals.withdrawalsPendingSum)}`} tone="lose" />
        <StatCard label="Bonus given" value={`Br ${fmt(totals.bonusGiven)}`} sub="welcome · promo · spin · referral" tone="gold" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Wagered (all-time)" value={`Br ${fmt(totals.wageredTotal)}`} sub={`${fmtInt(totals.roundsTotal)} rounds · ${totals.roundsActive} active`} />
        <StatCard label="Paid out" value={`Br ${fmt(totals.paidTotal)}`} sub={`RTP ${rtp.toFixed(1)}%`} />
        <StatCard label="GGR (house margin)" value={`Br ${fmt(totals.ggrTotal)}`} sub={`today Br ${fmt(totals.ggrToday)} · ${totals.roundsToday} rounds`} tone="win" />
        <StatCard label="Sports exposure" value={`Br ${fmt(totals.sportsExposure)}`} sub={`${totals.sportsPendingCount} open tickets`} tone="gold" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-2 text-sm font-black uppercase tracking-wide text-mute">Cash flow — last 14 days</h3>
          <DualBars days={days} a={(d) => d.deposits} b={(d) => d.withdrawals} labelA="Deposits" labelB="Withdrawals" colorA="#22c55e" colorB="#ef4444" />
        </Card>
        <Card className="p-4">
          <h3 className="mb-2 text-sm font-black uppercase tracking-wide text-mute">Volume — last 14 days</h3>
          <DualBars days={days} a={(d) => d.wagered} b={(d) => d.payout} labelA="Wagered" labelB="Paid out" colorA="#e5b224" colorB="#a9b4b7" />
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-4">
          <h3 className="mb-2 text-sm font-black uppercase tracking-wide text-mute">Daily GGR</h3>
          <AreaLine days={days} value={(d) => d.ggr} color="#e5b224" label="GGR" />
        </Card>
        <Card className="p-4">
          <h3 className="mb-2 text-sm font-black uppercase tracking-wide text-mute">New players</h3>
          <AreaLine days={days} value={(d) => d.signups} color="#4cc27e" label="Signups" money={false} />
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { adminCall, fmt, fmtDate, fmtInt } from "./api";
import { Badge, Card, Empty, Loading, Modal, Notice, Pager, SectionTitle, Td, Th, TableShell } from "./ui";

type UserRow = {
  id: number;
  username: string;
  phone: string;
  balance: number;
  bonusBalance: number;
  totalWagered: number;
  banned: number;
  banReason: string | null;
  firstDepositDone: number;
  referralCode: string;
  createdAt: string;
};

type UserDetail = {
  user: UserRow & { telegramId: string | null; referredBy: number | null; referredByName: string | null; referralPaid: number; lastSpinAt: string | null };
  totals: { deposits: number; withdrawals: number; rounds: number; invited: number };
  txs: { id: number; type: string; amount: number; status: string; method: string | null; reference: string | null; note: string | null; createdAt: string }[];
  rounds: { id: number; game: string; bet: number; payout: number; multiplier: number; status: string; createdAt: string }[];
};

function UserDetailModal({ id, onClose, onChanged }: { id: number; onClose: () => void; onChanged: () => void }) {
  const [d, setD] = useState<UserDetail | null>(null);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [wallet, setWallet] = useState<"real" | "bonus">("real");
  const [delta, setDelta] = useState("");
  const [adjustNote, setAdjustNote] = useState("");

  const load = useCallback(async () => {
    const r = await adminCall<UserDetail>(`/api/admin/users/detail?id=${id}`);
    if (r.error) return setErr(r.error);
    setD(r);
    setErr("");
  }, [id]);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  async function adjust(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await adminCall("/api/admin/users/adjust", { id, wallet, delta: Number(delta), note: adjustNote });
    setBusy(false);
    if (r.error) return setErr(r.error);
    setNote(`Adjusted ${wallet} balance by Br ${fmt(Number(delta))}`);
    setDelta("");
    setAdjustNote("");
    load();
    onChanged();
  }

  async function toggleBan() {
    const u = d!.user;
    const next = u.banned === 1 ? 0 : 1;
    const reason = next === 1 ? prompt("Ban reason (shown in the panel):", "Abuse") : "";
    if (next === 1 && reason === null) return;
    if (!confirm(next === 1 ? `Ban @${u.username}? They will be logged out immediately.` : `Unban @${u.username}?`)) return;
    setBusy(true);
    setErr("");
    const r = await adminCall("/api/admin/users/ban", { id, banned: next, reason });
    setBusy(false);
    if (r.error) return setErr(r.error);
    setNote(next === 1 ? `@${u.username} banned` : `@${u.username} unbanned`);
    load();
    onChanged();
  }

  return (
    <Modal title={d ? `@${d.user.username} · #${d.user.id}` : `Player #${id}`} onClose={onClose} wide>
      {err && <div className="mb-3"><Notice kind="err">{err}</Notice></div>}
      {note && <div className="mb-3"><Notice kind="ok">{note}</Notice></div>}
      {!d ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card className="p-3">
              <div className="text-[10px] font-bold uppercase text-mute">Real balance</div>
              <div className="text-lg font-black text-win">Br {fmt(d.user.balance)}</div>
            </Card>
            <Card className="p-3">
              <div className="text-[10px] font-bold uppercase text-mute">Bonus balance</div>
              <div className="text-lg font-black text-gold">Br {fmt(d.user.bonusBalance)}</div>
            </Card>
            <Card className="p-3">
              <div className="text-[10px] font-bold uppercase text-mute">Wagered</div>
              <div className="text-lg font-black">Br {fmt(d.user.totalWagered)}</div>
            </Card>
            <Card className="p-3">
              <div className="text-[10px] font-bold uppercase text-mute">Rounds</div>
              <div className="text-lg font-black">{fmtInt(d.totals.rounds)}</div>
            </Card>
          </div>

          <div className="rounded-xl bg-card p-3 text-sm">
            <div className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              <div>📱 <span className="font-mono">{d.user.phone}</span></div>
              <div>🆔 Registered {fmtDate(d.user.createdAt)}</div>
              <div>💳 Deposits <b className="text-win">Br {fmt(d.totals.deposits)}</b> · Withdrawn <b className="text-lose">Br {fmt(d.totals.withdrawals)}</b></div>
              <div>🤝 Referrals: {d.totals.invited} · code <span className="font-mono">{d.user.referralCode}</span>{d.user.referredByName ? <> · invited by @{d.user.referredByName}</> : null}</div>
              <div>✈️ Telegram: {d.user.telegramId ? <span className="font-mono">{d.user.telegramId}</span> : "not linked"}</div>
              <div>🎁 First deposit bonus: {d.user.firstDepositDone ? "claimed" : "not claimed"}</div>
            </div>
            {d.user.banned === 1 && (
              <div className="mt-2 rounded-lg border border-lose/40 bg-lose/10 px-3 py-1.5 text-red-300">
                🚫 BANNED — {d.user.banReason ?? "no reason"}
              </div>
            )}
          </div>

          <form onSubmit={adjust} className="rounded-xl bg-card p-3">
            <div className="mb-2 text-xs font-black uppercase tracking-wide text-mute">Manual balance adjustment</div>
            <div className="flex flex-wrap gap-2">
              <select value={wallet} onChange={(e) => setWallet(e.target.value as "real" | "bonus")} className="input w-28">
                <option value="real">Real</option>
                <option value="bonus">Bonus</option>
              </select>
              <input value={delta} onChange={(e) => setDelta(e.target.value)} type="number" step="0.01" required placeholder="± amount (e.g. 100 or -50)" className="input flex-1 min-w-40" />
              <button disabled={busy} className="btn-gold rounded-xl px-4 py-2 text-sm">Apply</button>
            </div>
            <input value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} placeholder="Reason (recorded in the ledger)" className="input mt-2" />
          </form>

          <div className="flex gap-2">
            <button disabled={busy} onClick={toggleBan} className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold ${d.user.banned === 1 ? "btn-green" : "bg-lose/20 text-red-300 hover:bg-lose/30"}`}>
              {d.user.banned === 1 ? "🔓 Unban player" : "🚫 Ban player"}
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <div className="mb-2 text-xs font-black uppercase tracking-wide text-mute">Recent transactions</div>
              <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
                {d.txs.length === 0 && <p className="text-sm text-mute">None yet.</p>}
                {d.txs.map((t) => (
                  <div key={t.id} className="flex items-center justify-between gap-2 rounded-lg bg-card px-3 py-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <Badge value={t.type} />
                      <span className="text-mute">{fmtDate(t.createdAt)}</span>
                    </div>
                    <div className={`font-mono font-bold ${t.amount >= 0 ? "text-win" : "text-lose"}`}>
                      {t.amount >= 0 ? "+" : ""}{fmt(t.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-black uppercase tracking-wide text-mute">Recent game rounds</div>
              <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
                {d.rounds.length === 0 && <p className="text-sm text-mute">None yet.</p>}
                {d.rounds.map((r) => (
                  <div key={r.id} className="flex items-center justify-between gap-2 rounded-lg bg-card px-3 py-1.5 text-xs">
                    <div>
                      <span className="font-bold">{r.game}</span> <span className="text-mute">· bet {fmt(r.bet)}</span>
                    </div>
                    <div className={`font-mono font-bold ${r.payout > 0 ? "text-win" : "text-lose"}`}>
                      {r.payout > 0 ? `+${fmt(r.payout)} (${r.multiplier}×)` : `−${fmt(r.bet)}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default function Users() {
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [offset, setOffset] = useState(0);
  const [rows, setRows] = useState<UserRow[] | null>(null);
  const [total, setTotal] = useState(0);
  const [err, setErr] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const limit = 20;

  const load = useCallback(async (query: string, off: number) => {
    const d = await adminCall<{ rows: UserRow[]; total: number }>(
      `/api/admin/users?q=${encodeURIComponent(query)}&limit=${limit}&offset=${off}`
    );
    if (d.error) return setErr(d.error);
    setRows(d.rows ?? []);
    setTotal(d.total ?? 0);
    setErr("");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => load(submitted, offset), 0);
    return () => clearTimeout(t);
  }, [submitted, offset, load]);

  return (
    <div className="space-y-4">
      <SectionTitle
        icon="👥"
        title="Players"
        right={
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setOffset(0);
              setSubmitted(q.trim());
            }}
            className="flex gap-2"
          >
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search id, @username or phone…" className="input w-56 sm:w-72" />
            <button className="btn-gold rounded-xl px-4 text-sm">Search</button>
          </form>
        }
      />

      {err && <Notice kind="err">{err}</Notice>}

      {rows === null ? (
        <Loading />
      ) : rows.length === 0 ? (
        <Empty text={submitted ? `No players match “${submitted}”.` : "No players registered yet."} />
      ) : (
        <>
          <TableShell>
            <thead>
              <tr className="border-b border-line/60 bg-card2/40">
                <Th>#</Th>
                <Th>Player</Th>
                <Th right>Balance</Th>
                <Th right>Bonus</Th>
                <Th right>Wagered</Th>
                <Th>Status</Th>
                <Th>Joined</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => setOpenId(u.id)}
                  className="cursor-pointer border-b border-line/40 last:border-0 hover:bg-white/[0.04]"
                >
                  <Td className="font-mono text-xs text-mute">{u.id}</Td>
                  <Td>
                    <div className="font-bold">@{u.username}</div>
                    <div className="text-xs text-mute">{u.phone}</div>
                  </Td>
                  <Td right className="font-bold text-win">Br {fmt(u.balance)}</Td>
                  <Td right className="text-gold">Br {fmt(u.bonusBalance)}</Td>
                  <Td right className="text-mute">Br {fmt(u.totalWagered)}</Td>
                  <Td>{u.banned === 1 ? <Badge value="banned" /> : u.firstDepositDone ? <span className="text-xs text-mute">depositor</span> : <span className="text-xs text-mute">new</span>}</Td>
                  <Td className="text-xs text-mute">{fmtDate(u.createdAt)}</Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
          <Pager total={total} offset={offset} limit={limit} onMove={setOffset} />
        </>
      )}

      {openId !== null && <UserDetailModal id={openId} onClose={() => setOpenId(null)} onChanged={() => load(submitted, offset)} />}
    </div>
  );
}

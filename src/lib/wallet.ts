import "server-only";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { r2 } from "./brand";

type BalRow = { balance: number; bonus_balance: number };

/** Debit a stake: uses real balance first, then bonus balance. Counts toward wagering. */
export async function debitStake(userId: number, amount: number) {
  const x = r2(amount);
  const res = await db.execute(sql`
    update users set
      balance = case when balance >= ${x} then balance - ${x} else 0 end,
      bonus_balance = case when balance >= ${x} then bonus_balance else bonus_balance - (${x} - balance) end,
      total_wagered = total_wagered + ${x}
    where id = ${userId} and balance + bonus_balance >= ${x}
    returning balance, bonus_balance`);
  const row = res.rows[0] as BalRow | undefined;
  if (!row) return { ok: false as const };
  return { ok: true as const, balance: row.balance, bonusBalance: row.bonus_balance };
}

/** Debit only from real (withdrawable) balance. */
export async function debitReal(userId: number, amount: number) {
  const x = r2(amount);
  const res = await db.execute(sql`
    update users set balance = balance - ${x}
    where id = ${userId} and balance >= ${x}
    returning balance, bonus_balance`);
  const row = res.rows[0] as BalRow | undefined;
  if (!row) return { ok: false as const };
  return { ok: true as const, balance: row.balance, bonusBalance: row.bonus_balance };
}

export async function credit(userId: number, amount: number, toBonus = false) {
  const x = r2(amount);
  const res = toBonus
    ? await db.execute(sql`update users set bonus_balance = bonus_balance + ${x} where id = ${userId} returning balance, bonus_balance`)
    : await db.execute(sql`update users set balance = balance + ${x} where id = ${userId} returning balance, bonus_balance`);
  const row = res.rows[0] as BalRow;
  return { balance: row.balance, bonusBalance: row.bonus_balance };
}

export async function addTx(
  userId: number,
  type: string,
  amount: number,
  opts: { status?: string; method?: string; reference?: string; note?: string } = {}
) {
  await db.insert(transactions).values({
    userId,
    type,
    amount: r2(amount),
    status: opts.status ?? "completed",
    method: opts.method,
    reference: opts.reference,
    note: opts.note,
  });
}

export function parseAmount(v: unknown, min = 1, max = 100000) {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  const x = r2(n);
  if (x < min || x > max) return null;
  return x;
}

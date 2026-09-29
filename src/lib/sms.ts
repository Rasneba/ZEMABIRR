import "server-only";
import { randomBytes } from "crypto";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { smsWebhooks, transactions, users } from "@/db/schema";
import { parseTelebirrSMS } from "@/lib/telebirr";
import { normalizePhone } from "@/lib/telegram-auth";
import { approveDeposit } from "@/lib/deposits";
import { r2 } from "@/lib/brand";

export type SmsRow = typeof smsWebhooks.$inferSelect;

function phoneMatching(raw: string | undefined): string | null {
  if (!raw) return null;
  const clean = raw.replace(/\D/g, "");
  if (!clean) return null;
  const variants = [clean];
  if (clean.startsWith("251")) variants.push(clean.slice(3));
  if (clean.startsWith("0")) variants.push(clean.slice(1));
  for (const v of variants) {
    if (/^[79]\d{8}$/.test(v)) return `+251${v}`;
  }
  return null;
}

async function matchUser(phone: string | undefined): Promise<number | null> {
  const norm = phoneMatching(phone) ?? normalizePhone(phone);
  if (!norm) return null;
  const [u] = await db.select({ id: users.id }).from(users).where(eq(users.phone, norm)).limit(1);
  return u?.id ?? null;
}

async function matchDeposit(txid: string, amount: number): Promise<{ id: number; userId: number } | null> {
  const rows = await db
    .select({ id: transactions.id, userId: transactions.userId, amount: transactions.amount })
    .from(transactions)
    .where(
      and(
        eq(transactions.type, "deposit"),
        eq(transactions.status, "pending"),
        sql`upper(${transactions.note}) = ${txid.toUpperCase()}`
      )
    )
    .limit(20);
  const hit = rows.find((r) => r2(r.amount) === r2(amount));
  return hit ? { id: hit.id, userId: hit.userId } : null;
}

/**
 * Ingest an SMS forwarded from the admin's phone. Persists the parsed message,
 * auto-links it to a pending deposit (same TX ID + amount) and/or a player
 * (sender phone matching a registered account).
 */
export async function ingestSms(rawText: string, sender = "telebirr"): Promise<{ ok: true; sms: SmsRow; duplicate: boolean; matchedDeposit: boolean; matchedUser: boolean } | { ok: false; error: string; duplicate?: boolean }> {
  const parsed = parseTelebirrSMS(rawText);
  if (!parsed.isValidTelebirr || !parsed.amount) {
    return { ok: false, error: "Not a valid Telebirr deposit SMS (no amount and/or transaction ID found)" };
  }

  const dup = await db
    .select({ id: smsWebhooks.id })
    .from(smsWebhooks)
    .where(eq(smsWebhooks.txid, parsed.txid))
    .limit(1);
  if (dup[0]) return { ok: false, error: "Duplicate SMS already received", duplicate: true };

  const deposit = await matchDeposit(parsed.txid, parsed.amount);
  const userId = deposit?.userId ?? (await matchUser(parsed.senderPhone));

  const inserted = await db
    .insert(smsWebhooks)
    .values({
      txid: parsed.txid,
      amount: r2(parsed.amount),
      type: parsed.type,
      senderName: parsed.senderName ?? null,
      senderPhone: parsed.senderPhone ?? null,
      rawText: parsed.rawText,
      userId: userId ?? null,
      depositId: deposit?.id ?? null,
      note: sender,
    })
    .returning();

  return {
    ok: true,
    sms: inserted[0],
    duplicate: false,
    matchedDeposit: Boolean(deposit),
    matchedUser: Boolean(userId),
  };
}

export async function creditSms(id: number) {
  const [row] = await db.select().from(smsWebhooks).where(eq(smsWebhooks.id, id)).limit(1);
  if (!row) return { error: "SMS not found" };
  if (row.status !== "pending") return { error: `SMS already ${row.status}` };
  if (!row.txid || !row.amount) return { error: "SMS has no amount or transaction ID" };

  // Never credit the same SMS transaction twice, even across different pending deposits.
  const already = await db
    .select({ id: transactions.id })
    .from(transactions)
    .where(and(eq(transactions.type, "deposit"), eq(transactions.status, "completed"), sql`upper(${transactions.note}) = ${row.txid.toUpperCase()}`))
    .limit(1);
  if (already[0]) return { error: `Transaction ${row.txid} has already been credited` };

  let depositId = row.depositId ?? null;
  if (!depositId) {
    if (!row.userId) return { error: "No player matched — link this SMS to a player first" };
    const newId = await db
      .insert(transactions)
      .values({
        userId: row.userId,
        type: "deposit",
        amount: r2(row.amount),
        status: "pending",
        method: "telebirr",
        reference: `DP${randomBytes(5).toString("hex").toUpperCase()}`,
        note: row.txid,
      })
      .returning({ id: transactions.id });
    depositId = newId[0].id;
    await db.update(smsWebhooks).set({ depositId, userId: row.userId }).where(eq(smsWebhooks.id, row.id));
  }

  const res = await approveDeposit(depositId, row.amount, row.txid);
  if (res.error) return { error: res.error };

  await db.update(smsWebhooks).set({ status: "credited", depositId }).where(eq(smsWebhooks.id, row.id));
  return { ok: true, depositId, bonus: res.bonus ?? 0, userId: row.userId ?? depositId };
}

export async function ignoreSms(id: number) {
  const [row] = await db.select().from(smsWebhooks).where(eq(smsWebhooks.id, id)).limit(1);
  if (!row) return { error: "SMS not found" };
  if (row.status !== "pending") return { error: `SMS already ${row.status}` };
  await db.update(smsWebhooks).set({ status: "ignored" }).where(eq(smsWebhooks.id, id));
  return { ok: true };
}

export async function listSms(status: string) {
  const rows = await db
    .select({
      id: smsWebhooks.id,
      txid: smsWebhooks.txid,
      amount: smsWebhooks.amount,
      type: smsWebhooks.type,
      senderName: smsWebhooks.senderName,
      senderPhone: smsWebhooks.senderPhone,
      rawText: smsWebhooks.rawText,
      status: smsWebhooks.status,
      note: smsWebhooks.note,
      createdAt: smsWebhooks.createdAt,
      username: users.username,
      userPhone: users.phone,
      ref: transactions.reference,
    })
    .from(smsWebhooks)
    .leftJoin(users, eq(users.id, smsWebhooks.userId))
    .leftJoin(transactions, eq(transactions.id, smsWebhooks.depositId))
    .where(status === "all" ? undefined : eq(smsWebhooks.status, status))
    .orderBy(desc(smsWebhooks.id))
    .limit(100);
  return rows;
}
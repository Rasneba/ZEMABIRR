import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { json } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";
import { addTx } from "@/lib/wallet";
import { r2 } from "@/lib/brand";

export const dynamic = "force-dynamic";

// POST /api/admin/users/adjust { id, wallet: "real"|"bonus", delta, note }
// Manual balance correction. Debits are rejected when they would go negative.
export async function POST(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const body = await req.json().catch(() => ({}));
  const id = Number(body.id);
  const wallet = body.wallet === "bonus" ? "bonus" : body.wallet === "real" ? "real" : null;
  const raw = Number(body.delta);
  const note = String(body.note ?? "").trim().slice(0, 200);
  if (!id || !wallet) return json({ error: "User id and wallet (real|bonus) are required" }, 400);
  if (!Number.isFinite(raw) || raw === 0 || Math.abs(raw) > 100000) {
    return json({ error: "Delta must be a non-zero amount between -100,000 and 100,000" }, 400);
  }
  const delta = r2(raw);

  const [exists] = await db.select({ id: users.id }).from(users).where(eq(users.id, id)).limit(1);
  if (!exists) return json({ error: "User not found" }, 404);

  const upd =
    wallet === "real"
      ? await db.execute(sql`
          update users set balance = balance + ${delta}
          where id = ${id} and balance + ${delta} >= 0
          returning balance, bonus_balance`)
      : await db.execute(sql`
          update users set bonus_balance = bonus_balance + ${delta}
          where id = ${id} and bonus_balance + ${delta} >= 0
          returning balance, bonus_balance`);
  const row = upd.rows[0] as { balance: number; bonus_balance: number } | undefined;
  if (!row) return json({ error: "Debit refused — it would make the balance negative" }, 400);

  await addTx(id, "adjust", delta, {
    note: `Manual ${wallet === "real" ? "real" : "bonus"} balance adjustment${note ? ` — ${note}` : ""}`,
  });
  return json({ ok: true, balance: row.balance, bonusBalance: row.bonus_balance });
}

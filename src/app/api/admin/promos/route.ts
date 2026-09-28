import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { promoCodes } from "@/db/schema";
import { json } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";

export const dynamic = "force-dynamic";

// GET /api/admin/promos — all codes with usage.
export async function GET(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const rows = await db
    .select({
      code: promoCodes.code,
      amount: promoCodes.amount,
      maxUses: promoCodes.maxUses,
      uses: promoCodes.uses,
    })
    .from(promoCodes)
    .orderBy(asc(promoCodes.code));
  return json({ rows });
}

// POST /api/admin/promos { code, amount, maxUses } — create a code.
export async function POST(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const body = await req.json().catch(() => ({}));
  const code = String(body.code ?? "").trim().toUpperCase();
  const amount = Number(body.amount);
  const maxUses = Math.floor(Number(body.maxUses ?? 100));
  if (!/^[A-Z0-9_-]{3,32}$/.test(code)) return json({ error: "Code must be 3-32 chars (A-Z, 0-9, _ or -)" }, 400);
  if (!Number.isFinite(amount) || amount < 1 || amount > 100000) {
    return json({ error: "Reward must be between Br 1 and Br 100,000" }, 400);
  }
  if (!Number.isFinite(maxUses) || maxUses < 1 || maxUses > 1000000) {
    return json({ error: "Max uses must be between 1 and 1,000,000" }, 400);
  }
  const ins = await db
    .insert(promoCodes)
    .values({ code, amount: Math.round(amount * 100) / 100, maxUses })
    .onConflictDoNothing()
    .returning({ code: promoCodes.code });
  if (!ins[0]) return json({ error: `Code ${code} already exists` }, 409);
  return json({ ok: true, code });
}

// DELETE /api/admin/promos { code } — remove a code (redemption history stays).
export async function DELETE(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const body = await req.json().catch(() => ({}));
  const code = String(body.code ?? "").trim().toUpperCase();
  if (!code) return json({ error: "Code is required" }, 400);
  const del = await db.delete(promoCodes).where(eq(promoCodes.code, code)).returning({ code: promoCodes.code });
  if (!del[0]) return json({ error: "Code not found" }, 404);
  return json({ ok: true });
}

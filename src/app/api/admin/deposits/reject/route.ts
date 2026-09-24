import { json } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";
import { rejectDeposit } from "@/lib/deposits";

// POST /api/admin/deposits/reject { id }
export async function POST(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const body = await req.json().catch(() => ({}));
  const id = Number(body.id);
  if (!id) return json({ error: "Deposit id is required" }, 400);
  const res = await rejectDeposit(id);
  if (res.error) return json({ error: res.error }, 400);
  return json({ ok: true });
}
import { json } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";
import { approveDeposit } from "@/lib/deposits";

// POST /api/admin/deposits/approve { id, amount, txid } — credit the balance
// only when the amount and the SMS transaction ID match the pending request.
export async function POST(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const body = await req.json().catch(() => ({}));
  const id = Number(body.id);
  const amount = Number(body.amount);
  const txid = String(body.txid ?? "");
  if (!id) return json({ error: "Deposit id is required" }, 400);
  const res = await approveDeposit(id, amount, txid);
  if (res.error) return json({ error: res.error }, 400);
  return json({ ok: true, bonus: res.bonus });
}
import { json } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";
import { settleWithdrawal } from "@/lib/withdrawals";

// POST /api/admin/withdrawals/settle { id, action: "pay" | "reject" }
// "pay" marks a processing withdrawal completed; "reject" refunds the player.
export async function POST(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const body = await req.json().catch(() => ({}));
  const id = Number(body.id);
  const action = body.action === "reject" ? "reject" : body.action === "pay" ? "pay" : null;
  if (!id) return json({ error: "Withdrawal id is required" }, 400);
  if (!action) return json({ error: "Action must be pay or reject" }, 400);
  const res = await settleWithdrawal(id, action);
  if (res.error) return json({ error: res.error }, 400);
  return json(res);
}

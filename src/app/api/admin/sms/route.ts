import { json } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";
import { listSms } from "@/lib/sms";

export const dynamic = "force-dynamic";

// GET /api/admin/sms?status=pending|credited|ignored|all — SMS inbox.
export async function GET(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const status = new URL(req.url).searchParams.get("status") ?? "pending";
  const rows = await listSms(status);
  const pending = await listSms("pending");
  return json({ rows, pendingCount: pending.length });
}
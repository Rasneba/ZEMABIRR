import { json } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";
import { creditSms } from "@/lib/sms";

export const dynamic = "force-dynamic";

// POST /api/admin/sms/credit { id } — credit the player for a Telebirr SMS.
export async function POST(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const body = await req.json().catch(() => ({}));
  const id = Number(body.id);
  if (!id) return json({ error: "SMS id is required" }, 400);
  const res = await creditSms(id);
  if (res.error) return json({ error: res.error }, 400);
  return json({ ok: true, bonus: res.bonus, depositId: res.depositId, userId: res.userId });
}
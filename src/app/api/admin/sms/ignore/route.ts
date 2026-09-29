import { json } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";
import { ignoreSms } from "@/lib/sms";

export const dynamic = "force-dynamic";

// POST /api/admin/sms/ignore { id } — mark a Telebirr SMS as not-a-deposit.
export async function POST(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const body = await req.json().catch(() => ({}));
  const id = Number(body.id);
  if (!id) return json({ error: "SMS id is required" }, 400);
  const res = await ignoreSms(id);
  if (res.error) return json({ error: res.error }, 400);
  return json({ ok: true });
}
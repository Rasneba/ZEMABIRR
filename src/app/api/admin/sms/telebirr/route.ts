import { json } from "@/lib/auth";
import { safeEqual } from "@/lib/admin";
import { ingestSms } from "@/lib/sms";

export const dynamic = "force-dynamic";

const EXPECTED = process.env.ADMIN_TOKEN ?? "";

function authed(req: Request): boolean {
  if (!EXPECTED) return false;
  const bearer = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (bearer && safeEqual(bearer, EXPECTED)) return true;
  const header = req.headers.get("x-sms-secret") ?? req.headers.get("x-api-key") ?? "";
  if (header && safeEqual(header, EXPECTED)) return true;
  return false;
}

// POST/GET /api/admin/sms/telebirr — receive a Telebirr SMS forwarded from the
// admin's phone (MacroDroid / Tasker / the sms-gateway webhook) or pasted in
// the admin panel. Accepted formats mirror the sms-gateway webhook contract:
//   JSON:     { message|text|sms, sender?, secret? }
//   Form:     text=...&sender=...&secret=...
//   Query:    ?text=...&sender=...&secret=...
export async function POST(req: Request) {
  if (!authed(req)) return json({ error: "Unauthorized" }, 401);
  const url = new URL(req.url);
  let text = url.searchParams.get("text") ?? url.searchParams.get("message") ?? url.searchParams.get("sms") ?? "";
  let sender = url.searchParams.get("sender") ?? "telebirr";

  if (!text) {
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      text = body.text || body.message || body.sms || body.body || body.content || "";
      sender = body.sender || body.from || sender;
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await req.formData().catch(() => null);
      if (form) {
        text = String(form.get("text") || form.get("message") || form.get("sms") || "");
        sender = String(form.get("sender") || sender);
      }
    } else {
      text = await req.text();
    }
  }

  if (!text.trim()) return json({ error: "No SMS message text received. Use { message } or ?text=" }, 400);
  const res = await ingestSms(text.trim(), sender);
  if (!res.ok) return json({ error: res.error, duplicate: res.duplicate }, res.duplicate ? 409 : 400);
  return json({
    success: true,
    data: { id: res.sms.id, txid: res.sms.txid, amount: res.sms.amount, senderPhone: res.sms.senderPhone, type: res.sms.type },
    matchedDeposit: res.matchedDeposit,
    matchedUser: res.matchedUser,
  });
}

export async function GET(req: Request) {
  return POST(req);
}
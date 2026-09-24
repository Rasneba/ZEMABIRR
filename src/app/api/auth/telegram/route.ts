import { normalizePhone, verifyInitData } from "@/lib/telegram-auth";
import { authTelegramUser } from "@/lib/telegram-auth";
import { json } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST /api/auth/telegram — verify Telegram Mini App initData, register or
// log the account in, then bind the shared phone number (when provided).
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const tg = verifyInitData(String(body.initData ?? ""));
  if (!tg) return json({ error: "Invalid Telegram session" }, 401);

  const phone = normalizePhone(body.phone);
  try {
    await authTelegramUser(tg, phone);
  } catch {
    return json({ error: "Something went wrong, please try again" }, 500);
  }
  return json({ ok: true });
}
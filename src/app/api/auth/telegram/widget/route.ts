import { verifyTgLogin } from "@/lib/telegram-auth";
import { authTelegramUser } from "@/lib/telegram-auth";
import { json } from "@/lib/auth";

export const dynamic = "force-dynamic";

// POST /api/auth/telegram/widget — register/login using the data from the
// Telegram Login Widget (web version).
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const tg = verifyTgLogin(body.user);
  if (!tg) return json({ error: "Invalid Telegram session" }, 401);

  try {
    await authTelegramUser(tg, null);
  } catch {
    return json({ error: "Something went wrong, please try again" }, 500);
  }
  return json({ ok: true });
}
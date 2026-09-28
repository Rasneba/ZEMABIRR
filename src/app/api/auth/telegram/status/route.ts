import { json } from "@/lib/auth";
import { botTgId, isBotCall, userByTgId } from "@/lib/tg-bot";

export const dynamic = "force-dynamic";

// POST /api/auth/telegram/status — used by the auth bot: returns whether this
// Telegram user is already linked to a real account (so /start can greet them
// and confirm they're logged in automatically).
export async function POST(req: Request) {
  if (!isBotCall(req)) return json({ error: "Unauthorized" }, 401);
  const body = await req.json().catch(() => ({}));
  const tgId = botTgId(body);
  if (!tgId) return json({ error: "Invalid request" }, 400);
  const row = await userByTgId(tgId);
  if (!row || row.phone.startsWith("tg:")) return json({ linked: false });
  return json({ linked: true, username: row.username, phone: row.phone });
}
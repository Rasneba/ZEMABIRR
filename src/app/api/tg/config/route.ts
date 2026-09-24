import { getBotUsername } from "@/lib/telegram-auth";
import { json } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/tg/config — the bot's public username so the web modal can
// render the official Telegram Login Widget.
export async function GET() {
  const botUsername = await getBotUsername();
  return json({ botUsername });
}
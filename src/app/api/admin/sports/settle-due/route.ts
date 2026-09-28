import { json } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";
import { settleDueBets } from "@/lib/sports-settle";

// POST /api/admin/sports/settle-due — settle every ticket whose matches ended.
// (Tickets also settle lazily when the player opens "My bets".)
export async function POST(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const settled = await settleDueBets();
  return json({ ok: true, settled });
}

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { json } from "@/lib/auth";
import { isAdminRequest } from "@/lib/admin";

export const dynamic = "force-dynamic";

// POST /api/admin/users/ban { id, banned: 0|1, reason? }
// Banning also destroys the player's active sessions.
export async function POST(req: Request) {
  if (!isAdminRequest(req)) return json({ error: "Unauthorized" }, 401);
  const body = await req.json().catch(() => ({}));
  const id = Number(body.id);
  const banned = body.banned === 1 ? 1 : body.banned === 0 ? 0 : null;
  const reason = String(body.reason ?? "").trim().slice(0, 200);
  if (!id || banned === null) return json({ error: "User id and banned (0|1) are required" }, 400);

  const upd = await db
    .update(users)
    .set({ banned, banReason: banned === 1 ? reason || "Suspended by admin" : null })
    .where(eq(users.id, id))
    .returning({ id: users.id });
  if (!upd[0]) return json({ error: "User not found" }, 404);
  if (banned === 1) await db.delete(sessions).where(eq(sessions.userId, id));
  return json({ ok: true, banned });
}

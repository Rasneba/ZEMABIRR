import { and, eq, isNull, lt, or } from "drizzle-orm";
import { randomInt } from "crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser, json, unauthorized } from "@/lib/auth";
import { addTx, credit } from "@/lib/wallet";
import { SPIN_PRIZES, weightedPick } from "@/lib/games";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const cutoff = new Date(Date.now() - 24 * 3600 * 1000);
  const upd = await db
    .update(users)
    .set({ lastSpinAt: new Date() })
    .where(and(eq(users.id, user.id), or(isNull(users.lastSpinAt), lt(users.lastSpinAt, cutoff))))
    .returning({ id: users.id });
  if (!upd[0]) return json({ error: "You've already used your free spin. Come back later!" }, 429);

  const idx = weightedPick(SPIN_PRIZES.map((p) => p.weight), randomInt(0, 1_000_000) / 1_000_000);
  const prize = SPIN_PRIZES[idx];
  if (prize.amount > 0) {
    await credit(user.id, prize.amount, true);
    await addTx(user.id, "spin", prize.amount, { note: "Lucky Spin prize" });
  }
  return json({ ok: true, index: idx, prize });
}

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser, json } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return json({ user: null });
  const refs = await db.select({ p: users.referralPaid }).from(users).where(eq(users.referredBy, user.id));
  return json({
    user: { ...user, invited: refs.length, invitedDeposited: refs.filter((r) => r.p === 1).length },
  });
}

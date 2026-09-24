import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser, json } from "@/lib/auth";
import { fkSettleUser } from "@/lib/fastkeno-server";

export const dynamic = "force-dynamic";

export async function GET() {
  let user = await getCurrentUser();
  if (!user) return json({ user: null });
  // Pay out any finished Fast Keno tickets so balances are always current.
  await fkSettleUser(user.id);
  user = (await getCurrentUser()) ?? user;
  const refs = await db.select({ p: users.referralPaid }).from(users).where(eq(users.referredBy, user.id));
  return json({
    user: { ...user, invited: refs.length, invitedDeposited: refs.filter((r) => r.p === 1).length },
  });
}

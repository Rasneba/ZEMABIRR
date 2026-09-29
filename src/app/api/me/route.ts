import { and, count, eq } from "drizzle-orm";
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
  const [inv] = await db
    .select({ n: count() })
    .from(users)
    .where(eq(users.referredBy, user.id));
  const [dep] = await db
    .select({ n: count() })
    .from(users)
    .where(and(eq(users.referredBy, user.id), eq(users.referralPaid, 1)));
  return json({
    user: { ...user, invited: Number(inv?.n ?? 0), invitedDeposited: Number(dep?.n ?? 0) },
  });
}

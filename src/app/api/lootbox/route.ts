import { randomInt } from "crypto";
import { db } from "@/db";
import { gameRounds } from "@/db/schema";
import { getCurrentUser, json, unauthorized } from "@/lib/auth";
import { addTx, credit, debitStake } from "@/lib/wallet";
import { LOOTBOXES, weightedPick } from "@/lib/games";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const body = await req.json().catch(() => ({}));
  const box = LOOTBOXES.find((b) => b.id === body.box);
  if (!box) return json({ error: "Unknown box" }, 400);
  const d = await debitStake(user.id, box.price);
  if (!d.ok) return json({ error: "Insufficient balance. Please deposit." }, 400);
  await addTx(user.id, "lootbox", -box.price, { note: `Opened ${box.name}` });
  const idx = weightedPick(box.weights, randomInt(0, 1_000_000) / 1_000_000);
  const prize = box.prizes[idx];
  let bal = { balance: d.balance, bonusBalance: d.bonusBalance };
  if (prize > 0) {
    bal = await credit(user.id, prize);
    await addTx(user.id, "win", prize, { note: `${box.name} prize` });
  }
  await db.insert(gameRounds).values({
    userId: user.id,
    game: "shamo",
    bet: box.price,
    payout: prize,
    multiplier: prize / box.price,
    status: prize > 0 ? "won" : "lost",
    state: { box: box.id },
  });
  return json({ ok: true, prize, index: idx, ...bal });
}

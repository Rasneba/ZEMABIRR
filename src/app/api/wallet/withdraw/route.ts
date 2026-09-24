import { randomBytes } from "crypto";
import { getCurrentUser, json, unauthorized } from "@/lib/auth";
import { addTx, debitReal, parseAmount } from "@/lib/wallet";

const METHODS = ["telebirr", "cbebirr", "mpesa", "usdt"];

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const body = await req.json().catch(() => ({}));
  const amount = parseAmount(body.amount, 50, 50000);
  const method = String(body.method ?? "");
  const account = String(body.account ?? "").trim();
  if (!amount) return json({ error: "Withdrawal must be between Br 50 and Br 50,000" }, 400);
  if (!METHODS.includes(method)) return json({ error: "Choose a withdrawal method" }, 400);
  if (account.length < 6) return json({ error: "Enter a valid account / phone / wallet address" }, 400);
  const res = await debitReal(user.id, amount);
  if (!res.ok) return json({ error: "Insufficient withdrawable balance" }, 400);
  const reference = `WD${randomBytes(5).toString("hex").toUpperCase()}`;
  await addTx(user.id, "withdraw", -amount, { method, reference, status: "processing", note: account });
  return json({ ok: true, reference, balance: res.balance });
}

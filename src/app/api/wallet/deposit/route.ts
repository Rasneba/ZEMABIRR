import { randomBytes } from "crypto";
import { getCurrentUser, json, unauthorized } from "@/lib/auth";
import { addTx, parseAmount } from "@/lib/wallet";

const METHODS = ["telebirr", "cbebirr", "mpesa", "usdt"];

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();
  const body = await req.json().catch(() => ({}));
  const amount = parseAmount(body.amount, 10, 10000);
  const method = String(body.method ?? "");
  const txid = String(body.txid ?? "").trim().toUpperCase();
  if (!amount) return json({ error: "Deposit amount must be between Br 10 and Br 10,000" }, 400);
  if (!METHODS.includes(method)) return json({ error: "Choose a payment method" }, 400);
  if (txid.length < 6) return json({ error: "Enter the transaction ID from your payment SMS/confirmation" }, 400);

  // Deposits are agent-approved: the balance is credited only after the agent
  // confirms the amount and transaction ID from the shared SMS match.
  const reference = `DP${randomBytes(5).toString("hex").toUpperCase()}`;
  await addTx(user.id, "deposit", amount, { status: "pending", method, reference, note: txid });

  return json({ ok: true, reference, pending: true });
}
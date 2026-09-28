export type PayMethod = {
  id: string;
  name: string;
  color: string;
  emoji: string;
  hint: string;
  tag: string;
  limits: string;
  speed: string;
  steps: string[];
};

export const PAY_METHODS: PayMethod[] = [
  {
    id: "telebirr",
    name: "telebirr",
    color: "#0e9fe0",
    emoji: "📱",
    hint: "Your Telebirr number",
    tag: "Instant verify",
    limits: "Br 10 – 10,000 / deposit",
    speed: "≈ 2–5 min",
    steps: [
      "Dial *127# on your phone and send the exact amount to merchant 0912009497 (Zema Games).",
      "Once the money is sent, an SMS confirmation with a transaction ID appears on your phone.",
      `Open Wallet → Deposit, choose telebirr, enter the amount and the transaction ID from the SMS.`,
      "An agent verifies the payment and credits your balance — winnings can be withdrawn any time.",
    ],
  },
  {
    id: "cbebirr",
    name: "CBE Birr",
    color: "#7b2a8e",
    emoji: "🏦",
    hint: "Your CBE Birr phone number",
    tag: "Bank balance",
    limits: "Br 10 – 10,000 / deposit",
    speed: "≈ 2–10 min",
    steps: [
      "Open the CBE Birr app and transfer the amount to the Zema Games account.",
      "Your payment confirmation shows a transaction/reference ID.",
      "Enter the amount and that reference ID in your Wallet → Deposit form (method: CBE Birr).",
      "Our team verifies the transfer and credits your account.",
    ],
  },
  {
    id: "mpesa",
    name: "M-PESA",
    color: "#16a34a",
    emoji: "💸",
    hint: "Your M-PESA phone number",
    tag: "Mobile money",
    limits: "Br 10 – 10,000 / deposit",
    speed: "≈ 2–10 min",
    steps: [
      "Send the amount via M-PESA to the Zema Games payout number shown in Telegram.",
      "Save the M-PESA confirmation message — it contains a unique transaction/Code ID.",
      "In Wallet → Deposit pick M-PESA, enter the amount and the code from the message.",
      "Verification is manual, so it usually completes within minutes.",
    ],
  },
  {
    id: "usdt",
    name: "USDT (TRC20)",
    color: "#26a17b",
    emoji: "🪙",
    hint: "Your TRC20 wallet address",
    tag: "Crypto",
    limits: "min ≈ 10 USDT",
    speed: "≈ 5–20 min (network confirmations)",
    steps: [
      "Send USDT on the TRC20 network to the wallet address shared in the support channel.",
      "Wait for network confirmations (usually a few minutes).",
      "In Wallet → Deposit pick USDT, enter the amount in USDT and your transaction hash.",
      "Once confirmed on-chain and verified, your balance is credited.",
    ],
  },
];

export const Withdraw_METHODS = [
  { id: "telebirr", name: "telebirr", emoji: "📱", color: "#0e9fe0" },
  { id: "cbebirr", name: "CBE Birr", emoji: "🏦", color: "#7b2a8e" },
  { id: "mpesa", name: "M-PESA", emoji: "💸", color: "#16a34a" },
  { id: "usdt", name: "USDT (TRC20)", emoji: "🪙", color: "#26a17b" },
];
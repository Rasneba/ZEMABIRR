export const BRAND = {
  name: "ZemaBet",
  first: "Zema",
  second: "Bet",
  domain: "zemabet.com",
  email: "support@zemabet.com",
  telegram: "https://t.me/zemabet",
  telegramSupport: "https://t.me/zemabet_support",
  currency: "Br",
  tagline: "Online Casino, Sports Betting & Crash Games",
};

export function fmt(n: number) {
  return `${BRAND.currency} ${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export const r2 = (n: number) => Math.round(n * 100) / 100;

export const VIP_LEVELS = [
  { name: "Explorer", min: 0, cashback: 0, color: "#94a3b8", icon: "🧭" },
  { name: "Bronze", min: 1000, cashback: 2, color: "#cd7f32", icon: "🥉" },
  { name: "Silver", min: 10000, cashback: 4, color: "#c0c0c0", icon: "🥈" },
  { name: "Gold", min: 50000, cashback: 6, color: "#e5b224", icon: "🥇" },
  { name: "Platinum", min: 200000, cashback: 8, color: "#67e8f9", icon: "💠" },
  { name: "Diamond", min: 1000000, cashback: 12, color: "#a78bfa", icon: "💎" },
];

export function vipFor(wagered: number) {
  let idx = 0;
  VIP_LEVELS.forEach((l, i) => {
    if (wagered >= l.min) idx = i;
  });
  const cur = VIP_LEVELS[idx];
  const next = VIP_LEVELS[idx + 1] ?? null;
  const progress = next ? Math.min(100, ((wagered - cur.min) / (next.min - cur.min)) * 100) : 100;
  return { level: cur, index: idx, next, progress };
}

export const FAQ = [
  {
    q: "How can I deposit funds?",
    a: "We support telebirr, CBE Birr, M-Pesa and USDT (TRC20). Simply open your wallet, select 'Deposit', choose your preferred method, enter the amount and confirm. Funds are credited instantly.",
  },
  {
    q: "How do I withdraw my winnings?",
    a: "You can withdraw your balance at any time. Navigate to the wallet section, click 'Withdraw', choose a method, enter your account number and the amount you wish to withdraw. Withdrawals are usually processed within minutes.",
  },
  {
    q: "Are the games fair?",
    a: "Yes, all our games use industry-standard provably fair algorithms or certified RNG systems to ensure every outcome is 100% random and transparent. Every result is generated on our servers and recorded in your history.",
  },
  {
    q: "Can I claim multiple bonuses?",
    a: "You can claim one welcome bonus upon joining. However, you can use multiple unique promo codes from our official Telegram channel and participate in recurring daily events, giveaways, and referral programs.",
  },
  {
    q: "What is the VIP Club?",
    a: "The VIP Club rewards our most active players with exclusive benefits, including higher cashback percentages, priority support, and special level-up rewards as you progress through the tiers from Explorer to Diamond.",
  },
];

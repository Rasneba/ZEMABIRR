import {
  pgTable,
  serial,
  text,
  integer,
  doublePrecision,
  timestamp,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    telegramId: text("telegram_id"),
    phone: text("phone").notNull(),
    username: text("username").notNull(),
    passwordHash: text("password_hash").notNull(),
    balance: doublePrecision("balance").notNull().default(0),
    bonusBalance: doublePrecision("bonus_balance").notNull().default(0),
    totalWagered: doublePrecision("total_wagered").notNull().default(0),
    referralCode: text("referral_code").notNull(),
    referredBy: integer("referred_by"),
    referralPaid: integer("referral_paid").notNull().default(0),
    firstDepositDone: integer("first_deposit_done").notNull().default(0),
    lastSpinAt: timestamp("last_spin_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("users_telegram_idx").on(t.telegramId),
    uniqueIndex("users_phone_idx").on(t.phone),
    uniqueIndex("users_ref_idx").on(t.referralCode),
  ]
);

export const sessions = pgTable("sessions", {
  token: text("token").primaryKey(),
  userId: integer("user_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // deposit | withdraw | bet | win | bonus | referral | promo | spin | lootbox
  amount: doublePrecision("amount").notNull(),
  status: text("status").notNull().default("completed"),
  method: text("method"),
  reference: text("reference"),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const gameRounds = pgTable("game_rounds", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  game: text("game").notNull(),
  bet: doublePrecision("bet").notNull(),
  payout: doublePrecision("payout").notNull().default(0),
  multiplier: doublePrecision("multiplier").notNull().default(0),
  status: text("status").notNull().default("active"), // active | won | lost
  state: jsonb("state").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const promoCodes = pgTable("promo_codes", {
  code: text("code").primaryKey(),
  amount: doublePrecision("amount").notNull(),
  maxUses: integer("max_uses").notNull().default(1000),
  uses: integer("uses").notNull().default(0),
});

export const promoRedemptions = pgTable(
  "promo_redemptions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    code: text("code").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("promo_user_code_idx").on(t.userId, t.code)]
);

export type Selection = {
  matchId: string;
  label: string;
  market: "1X2" | "OU";
  pick: string;
  odds: number;
  kickoff: string;
  result?: "won" | "lost";
};

export const sportBets = pgTable("sport_bets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  selections: jsonb("selections").$type<Selection[]>().notNull(),
  stake: doublePrecision("stake").notNull(),
  totalOdds: doublePrecision("total_odds").notNull(),
  status: text("status").notNull().default("pending"),
  payout: doublePrecision("payout").notNull().default(0),
  settleAt: timestamp("settle_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

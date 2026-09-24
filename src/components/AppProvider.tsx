"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type User = {
  id: number;
  phone: string;
  username: string;
  balance: number;
  bonusBalance: number;
  totalWagered: number;
  referralCode: string;
  lastSpinAt: string | null;
  firstDepositDone: boolean;
  createdAt: string;
  invited: number;
  invitedDeposited: number;
};

type Toast = { id: number; kind: "success" | "error" | "info"; text: string };
type AuthMode = "login" | "register" | null;

type Ctx = {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setBalances: (balance?: number, bonus?: number) => void;
  authMode: AuthMode;
  openAuth: (m: AuthMode) => void;
  walletOpen: "deposit" | "withdraw" | null;
  openWallet: (m: "deposit" | "withdraw" | null) => void;
  toast: (text: string, kind?: Toast["kind"]) => void;
  toasts: Toast[];
  requireAuth: () => boolean;
};

const AppCtx = createContext<Ctx | null>(null);

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}

export async function api<T = Record<string, unknown>>(url: string, body?: unknown): Promise<T & { error?: string }> {
  const res = await fetch(url, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({ error: "Network error" }));
  return data as T & { error?: string };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [walletOpen, setWalletOpen] = useState<"deposit" | "withdraw" | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const refresh = useCallback(async () => {
    const d = await api<{ user: User | null }>("/api/me");
    setUser(d.user ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(refresh, 0);
    return () => clearTimeout(t);
  }, [refresh]);

  const toast = useCallback((text: string, kind: Toast["kind"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const setBalances = useCallback((balance?: number, bonus?: number) => {
    setUser((u) =>
      u ? { ...u, balance: balance ?? u.balance, bonusBalance: bonus ?? u.bonusBalance } : u
    );
  }, []);

  const requireAuth = useCallback(() => {
    if (!user) {
      setAuthMode("login");
      return false;
    }
    return true;
  }, [user]);

  return (
    <AppCtx.Provider
      value={{
        user,
        loading,
        refresh,
        setBalances,
        authMode,
        openAuth: setAuthMode,
        walletOpen,
        openWallet: setWalletOpen,
        toast,
        toasts,
        requireAuth,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

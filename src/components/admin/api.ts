export const TOKEN_KEY = "zb_admin_token";

export function getToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(TOKEN_KEY) ?? "";
}

export function setToken(t: string) {
  sessionStorage.setItem(TOKEN_KEY, t);
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

export async function adminCall<T = Record<string, unknown>>(url: string, body?: unknown, method?: string): Promise<T & { error?: string }> {
  try {
    const res = await fetch(url, {
      method: method ?? (body === undefined ? "GET" : "POST"),
      headers:
        body === undefined
          ? { Authorization: `Bearer ${getToken()}` }
          : { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
    return (await res.json().catch(() => ({ error: "Network error" }))) as T & { error?: string };
  } catch {
    return { error: "Network error" } as T & { error?: string };
  }
}

export const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtInt = (n: number) => n.toLocaleString("en-US");

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export const fmtDay = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

export function timeAgo(iso: string) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

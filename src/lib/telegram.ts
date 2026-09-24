// Client-side helpers for the Telegram Mini App environment.

type WebAppEvent = {
  status: "sent" | "cancelled";
  response?: string;
  responseUnsafe?: { contact?: { phone_number?: string } };
};

type TgWebApp = {
  initData: string;
  initDataUnsafe?: Record<string, unknown>;
  version: string;
  ready?: () => void;
  expand?: () => void;
  isVersionAtLeast?: (v: string) => boolean;
  onEvent?: (type: string, handler: (event: WebAppEvent | { status: string }) => void) => void;
  offEvent?: (type: string, handler: (event: WebAppEvent | { status: string }) => void) => void;
  requestContact?: (cb?: (requested: boolean, event?: WebAppEvent) => void) => void;
};

declare global {
  interface Window {
    Telegram?: { WebApp?: TgWebApp };
  }
}

let sdkPromise: Promise<void> | null = null;

export function ensureTelegramSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Telegram?.WebApp) return Promise.resolve();
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = "https://telegram.org/js/telegram-web-app.js?63";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => resolve();
      document.head.appendChild(s);
    });
  }
  return sdkPromise;
}

export function getWebApp(): TgWebApp | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

export function isTelegramBrowser(): boolean {
  const wa = getWebApp();
  return Boolean(wa?.initData);
}

export function bootTelegram(): void {
  const wa = getWebApp();
  if (!wa) return;
  wa.ready?.();
  wa.expand?.();
}

// Ask Telegram for the player's phone number (native popup).
// Resolves with the shared number, or null when denied / unsupported.
export function requestPhoneNumber(): Promise<string | null> {
  const wa = getWebApp();
  if (!wa || !wa.isVersionAtLeast?.("6.9") || typeof wa.requestContact !== "function") {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    let settled = false;
    const done = (v: string | null) => {
      if (settled) return;
      settled = true;
      resolve(v);
    };
    wa.requestContact?.((requested, event) => {
      if (requested) {
        const phone = event?.responseUnsafe?.contact?.phone_number;
        if (phone) return done(phone);
        return done(null);
      }
      done(null);
    });
  });
}
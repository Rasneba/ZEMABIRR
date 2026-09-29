import "server-only";
import { timingSafeEqual } from "crypto";

// Constant-time comparison so the passcode can't be probed byte-by-byte over
// the wire. Admin routes are protected by a shared secret passcode
// (ADMIN_TOKEN), sent as `Authorization: Bearer <token>`. Set it in .env /
// Vercel — never commit it.
function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  if (x.length !== y.length) {
    // Burn a comparable amount of time even on length mismatch.
    timingSafeEqual(x, x);
    return false;
  }
  return timingSafeEqual(x, y);
}

export { safeEqual };

export function isAdminRequest(req: Request): boolean {
  const header = req.headers.get("authorization") ?? "";
  const provided = header.replace(/^Bearer\s+/i, "").trim();
  const expected = process.env.ADMIN_TOKEN ?? "";
  return expected.length > 0 && safeEqual(provided, expected);
}
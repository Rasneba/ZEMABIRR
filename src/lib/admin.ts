import "server-only";

// Admin routes are protected by a shared secret passcode (ADMIN_TOKEN), sent as
// `Authorization: Bearer <token>`. Set it in .env / Vercel — never commit it.
export function isAdminRequest(req: Request): boolean {
  const header = req.headers.get("authorization") ?? "";
  const provided = header.replace(/^Bearer\s+/i, "").trim();
  const expected = process.env.ADMIN_TOKEN ?? "";
  return expected.length > 0 && provided === expected;
}
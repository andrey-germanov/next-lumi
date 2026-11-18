// Admin auth for the messaging API: `Authorization: Bearer <MESSAGING_ADMIN_KEY>`.
// One shared key is enough while Lumi has a single operator; the key is
// entered on /admin/messaging and kept in that browser's sessionStorage.
import { timingSafeEqual } from "node:crypto";
import { HttpError } from "../http";

export function requireAdmin(req: Request): void {
  const key = process.env.MESSAGING_ADMIN_KEY?.trim();
  if (!key || key.length < 24) throw new HttpError(503, "admin_key_not_configured");
  const given = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  const a = Buffer.from(given);
  const b = Buffer.from(key);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new HttpError(401, "unauthorized");
}

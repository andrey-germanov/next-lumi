// POST /api/adapty/webhook — Adapty → subscription events.
// Configure in Adapty → Integrations → Webhook with this URL and an
// Authorization header value equal to ADAPTY_WEBHOOK_SECRET.
//
// We don't trust the event payload for the decision itself: for any event
// carrying a customer_user_id we re-check Premium via the Server API and
// freeze / unfreeze that owner's groups accordingly.
import { handle, json, HttpError } from "@/lib/server/http";
import { invalidatePremium, isPremium } from "@/lib/server/premium";
import { applyOwnerPremiumPolicy } from "@/lib/server/groups";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Accepts the raw secret, "Bearer <secret>", and stray whitespace. */
function authorized(header: string | null, secret: string): boolean {
  if (!header) return false;
  const value = header.trim().replace(/^Bearer\s+/i, "").trim();
  return value === secret.trim();
}

export async function POST(req: Request) {
  return handle(async () => {
    const body = (await req.json().catch(() => ({}))) as {
      customer_user_id?: unknown;
      profile?: { customer_user_id?: unknown };
    };
    const uid = body.customer_user_id ?? body.profile?.customer_user_id;

    // Adapty's verification request (sent when the integration is saved) has an
    // empty body. It changes nothing, so answer 200 regardless of the header —
    // Adapty refuses to save the webhook on any non-2xx.
    if (typeof uid !== "string" || !uid) return json({ ok: true });

    const secret = process.env.ADAPTY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[adapty webhook] ADAPTY_WEBHOOK_SECRET is not configured");
      throw new HttpError(500, "webhook_not_configured");
    }
    if (!authorized(req.headers.get("authorization"), secret)) throw new HttpError(401, "unauthorized");

    invalidatePremium(uid);
    const premium = await isPremium(uid);
    await applyOwnerPremiumPolicy(uid, premium);
    return json({ ok: true, premium });
  });
}

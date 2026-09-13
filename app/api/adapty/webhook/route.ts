// POST /api/adapty/webhook — Adapty → subscription events.
// Configure in Adapty → Integrations → Webhook with this URL and an
// Authorization header equal to ADAPTY_WEBHOOK_SECRET.
//
// We don't trust the event payload for the decision itself: for any event
// carrying a customer_user_id we re-check Premium via the Server API and
// freeze / unfreeze that owner's groups accordingly.
import { handle, json, HttpError } from "@/lib/server/http";
import { invalidatePremium, isPremium } from "@/lib/server/premium";
import { applyOwnerPremiumPolicy } from "@/lib/server/groups";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handle(async () => {
    const secret = process.env.ADAPTY_WEBHOOK_SECRET;
    if (!secret || req.headers.get("authorization") !== secret) throw new HttpError(401, "unauthorized");

    const body = (await req.json().catch(() => ({}))) as { customer_user_id?: unknown; profile?: { customer_user_id?: unknown } };
    const uid = body.customer_user_id ?? body.profile?.customer_user_id;
    // Adapty sends a verification request with an empty body when saving the integration.
    if (typeof uid !== "string" || !uid) return json({ ok: true });

    invalidatePremium(uid);
    const premium = await isPremium(uid);
    await applyOwnerPremiumPolicy(uid, premium);
    return json({ ok: true, premium });
  });
}

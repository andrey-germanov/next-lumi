// GET /api/public/trip/:token — read-only live data for the shared link page.
// No auth, no uids/emails in the payload. Short edge cache so a link posted in
// a busy group chat stays cheap while still feeling live.
import { handle, json } from "@/lib/server/http";
import { getPublicTrip } from "@/lib/server/groups";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  return handle(async () => {
    const { token } = await ctx.params;
    return json(await getPublicTrip(token), 200, {
      "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30",
      "X-Robots-Tag": "noindex",
    });
  });
}

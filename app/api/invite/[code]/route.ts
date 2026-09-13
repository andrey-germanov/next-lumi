// GET /api/invite/:code — invitation preview (no amounts). Auth is optional:
// with a Firebase ID token the response also says whether the caller is
// already a member and whether the free-plan group limit blocks joining.
import { handle, json, optionalUser } from "@/lib/server/http";
import { previewInvite } from "@/lib/server/groups";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, ctx: { params: Promise<{ code: string }> }) {
  return handle(async () => {
    const { code } = await ctx.params;
    const user = await optionalUser(req);
    return json(await previewInvite(code, user?.uid ?? null), 200, { "Cache-Control": "no-store" });
  });
}

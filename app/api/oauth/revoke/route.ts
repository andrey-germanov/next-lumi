// POST /api/oauth/revoke — RFC 7009. Always 200, even for unknown tokens.
import { revokeToken } from "@/lib/server/mcp/oauth";
import { handleOAuth, preflight, readForm, CORS_HEADERS } from "@/lib/server/mcp/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handleOAuth(async () => {
    const value = (await readForm(req)).get("token");
    if (value) await revokeToken(value);
    return new Response(null, { status: 200, headers: CORS_HEADERS });
  });
}

export const OPTIONS = preflight;

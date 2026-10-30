// POST /api/oauth/token — authorization_code (PKCE) and refresh_token grants.
import { exchangeToken } from "@/lib/server/mcp/oauth";
import { handleOAuth, oauthJson, preflight, readForm } from "@/lib/server/mcp/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handleOAuth(async () => oauthJson(await exchangeToken(await readForm(req))));
}

export const OPTIONS = preflight;

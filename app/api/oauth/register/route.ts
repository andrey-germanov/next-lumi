// POST /api/oauth/register — Dynamic Client Registration (RFC 7591) for MCP clients.
import { registerClient } from "@/lib/server/mcp/oauth";
import { handleOAuth, oauthJson, preflight } from "@/lib/server/mcp/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return handleOAuth(async () => {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    return oauthJson(await registerClient(body ?? {}), 201);
  });
}

export const OPTIONS = preflight;

// Lumi MCP endpoint (Streamable HTTP, stateless). Connect from Claude
// ("Add custom connector") or ChatGPT (developer mode → connector) with
// https://lumi.herman-apps.com/api/mcp — they discover OAuth on their own via
// the WWW-Authenticate header below.
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { AdminConfigError } from "@/lib/server/firebaseAdmin";
import { HttpError } from "@/lib/server/http";
import { isPremium } from "@/lib/server/premium";
import { RESOURCE_METADATA_URL, MCP_SCOPE, verifyAccessToken } from "@/lib/server/mcp/oauth";
import { CORS_HEADERS, preflight } from "@/lib/server/mcp/http";
import { createLumiMcpServer } from "@/lib/server/mcp/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MCP_CORS = { ...CORS_HEADERS, "Access-Control-Expose-Headers": "WWW-Authenticate, Mcp-Session-Id" };

function unauthorized(error?: string): Response {
  const params = [`resource_metadata="${RESOURCE_METADATA_URL}"`, `scope="${MCP_SCOPE}"`];
  if (error) params.push(`error="${error}"`);
  return Response.json(
    { error: error ?? "unauthorized" },
    { status: 401, headers: { ...MCP_CORS, "WWW-Authenticate": `Bearer ${params.join(", ")}` } },
  );
}

export async function POST(req: Request) {
  try {
    const header = req.headers.get("authorization");
    if (!header?.startsWith("Bearer ")) return unauthorized();
    const token = header.slice(7);
    const grant = await verifyAccessToken(token);
    if (!grant) return unauthorized("invalid_token");

    const premium = await isPremium(grant.uid);
    const server = createLumiMcpServer(grant.uid, premium);
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    await server.connect(transport);
    const response = await transport.handleRequest(req, {
      authInfo: {
        token,
        clientId: grant.clientId,
        scopes: grant.scopes,
        expiresAt: Math.floor(grant.expiresAt / 1000),
        extra: { uid: grant.uid },
      },
    });
    for (const [k, v] of Object.entries(MCP_CORS)) response.headers.set(k, v);
    return response;
  } catch (error) {
    const unavailable = error instanceof AdminConfigError || (error instanceof HttpError && error.status === 503);
    console.error("[mcp] request failed", error);
    return Response.json(
      { jsonrpc: "2.0", error: { code: -32603, message: unavailable ? "Lumi is temporarily unavailable" : "Internal error" }, id: null },
      { status: unavailable ? 503 : 500, headers: MCP_CORS },
    );
  }
}

// Stateless server: no standalone SSE stream and no sessions to delete.
const methodNotAllowed = () =>
  Response.json(
    { jsonrpc: "2.0", error: { code: -32000, message: "Method not allowed" }, id: null },
    { status: 405, headers: { ...MCP_CORS, Allow: "POST, OPTIONS" } },
  );

export const GET = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const OPTIONS = preflight;

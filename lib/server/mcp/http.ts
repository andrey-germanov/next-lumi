// Response helpers shared by the OAuth endpoints. MCP clients that run in a
// browser (MCP Inspector, web IDEs) call these cross-origin, so they all allow
// any origin — they are bearer/PKCE protected, never cookie-authenticated.
import { AdminConfigError } from "../firebaseAdmin";
import { OAuthError } from "./oauth";

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, mcp-protocol-version",
};

export const preflight = () => new Response(null, { status: 204, headers: CORS_HEADERS });

export function oauthJson(data: unknown, status = 200): Response {
  return Response.json(data, { status, headers: { ...CORS_HEADERS, "Cache-Control": "no-store" } });
}

export async function handleOAuth(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof OAuthError) {
      return oauthJson({ error: error.error, error_description: error.description }, error.status);
    }
    if (error instanceof AdminConfigError) {
      console.error("[oauth] server not configured:", error.reason);
      return oauthJson({ error: "temporarily_unavailable" }, 503);
    }
    console.error("[oauth] unexpected error", error);
    return oauthJson({ error: "server_error" }, 500);
  }
}

/** Token/revoke endpoints take form-encoded bodies per RFC 6749; accept JSON too. */
export async function readForm(req: Request): Promise<URLSearchParams> {
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    return new URLSearchParams(Object.entries(body).map(([k, v]) => [k, String(v)]));
  }
  return new URLSearchParams(await req.text());
}

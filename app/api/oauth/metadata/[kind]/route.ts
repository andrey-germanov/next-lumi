// OAuth discovery documents, served at the well-known paths via rewrites in
// next.config.ts:
//   /.well-known/oauth-authorization-server         → authorization-server (RFC 8414)
//   /.well-known/oauth-protected-resource[/api/mcp] → protected-resource (RFC 9728)
import { authorizationServerMetadata, protectedResourceMetadata } from "@/lib/server/mcp/oauth";
import { CORS_HEADERS, preflight } from "@/lib/server/mcp/http";

export const dynamic = "force-static";

export async function GET(_req: Request, ctx: { params: Promise<{ kind: string }> }) {
  const { kind } = await ctx.params;
  const body =
    kind === "authorization-server" ? authorizationServerMetadata()
    : kind === "protected-resource" ? protectedResourceMetadata()
    : null;
  if (!body) return Response.json({ error: "not_found" }, { status: 404, headers: CORS_HEADERS });
  return Response.json(body, { headers: { ...CORS_HEADERS, "Cache-Control": "public, max-age=3600" } });
}

export function generateStaticParams() {
  return [{ kind: "authorization-server" }, { kind: "protected-resource" }];
}

export const OPTIONS = preflight;

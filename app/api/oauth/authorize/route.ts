// Backend of the /oauth/authorize consent page.
//   GET  ?client_id&redirect_uri&code_challenge&… → { clientName, redirectHost } or an error to show
//   POST (Firebase ID token) { …same params, decision } → { redirectTo }
// The page never builds redirect URLs itself: only parameters validated here
// against the registered client can produce one.
import { requireUser } from "@/lib/server/http";
import { isPremium } from "@/lib/server/premium";
import { SITE_URL } from "@/lib/constants";
import {
  OAuthError,
  createAuthorizationCode,
  validateAuthorizeRequest,
  type AuthorizeParams,
} from "@/lib/server/mcp/oauth";
import { handleOAuth, oauthJson } from "@/lib/server/mcp/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function paramsFrom(get: (key: string) => string | null | undefined): AuthorizeParams {
  if (get("response_type") !== "code") throw new OAuthError("unsupported_response_type", "response_type must be code");
  return {
    clientId: get("client_id") ?? "",
    redirectUri: get("redirect_uri") ?? "",
    codeChallenge: get("code_challenge") ?? "",
    codeChallengeMethod: get("code_challenge_method") ?? "",
    state: get("state") ?? undefined,
    scope: get("scope") ?? undefined,
    resource: get("resource") ?? undefined,
  };
}

function redirectWith(params: AuthorizeParams, values: Record<string, string>): string {
  const url = new URL(params.redirectUri);
  for (const [k, v] of Object.entries(values)) url.searchParams.set(k, v);
  if (params.state) url.searchParams.set("state", params.state);
  url.searchParams.set("iss", SITE_URL);
  return url.toString();
}

export async function GET(req: Request) {
  return handleOAuth(async () => {
    const search = new URL(req.url).searchParams;
    const params = paramsFrom((k) => search.get(k));
    const client = await validateAuthorizeRequest(params);
    return oauthJson({ clientName: client.clientName, redirectHost: new URL(params.redirectUri).host });
  });
}

export async function POST(req: Request) {
  return handleOAuth(async () => {
    const user = await requireUser(req).catch(() => {
      throw new OAuthError("login_required", "Sign in again", 401);
    });
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const params = paramsFrom((k) => (typeof body[k] === "string" ? (body[k] as string) : undefined));
    const client = await validateAuthorizeRequest(params);

    if (body.decision !== "allow") {
      return oauthJson({ redirectTo: redirectWith(params, { error: "access_denied" }) });
    }
    if (!(await isPremium(user.uid))) {
      throw new OAuthError("premium_required", "Connecting AI assistants is part of Lumi Pro", 403);
    }
    const code = await createAuthorizationCode(user.uid, params, client);
    return oauthJson({ redirectTo: redirectWith(params, { code }) });
  });
}

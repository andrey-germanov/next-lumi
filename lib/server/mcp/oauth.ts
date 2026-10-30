// OAuth 2.1 authorization server for the Lumi MCP connector (Claude, ChatGPT
// and any other MCP client). Public clients only: Dynamic Client Registration,
// authorization code + PKCE (S256), rotating refresh tokens.
//
// Everything lives in top-level collections that the client rules never match,
// so only the Admin SDK can read or write them. Codes and tokens are stored
// as SHA-256 hashes — a database leak does not leak usable credentials.
//
//   mcpOAuthClients/{clientId}   registered clients (redirect URIs, name)
//   mcpOAuthCodes/{hash}         one-time authorization codes (5 min)
//   mcpOAuthTokens/{hash}        access (1 h) and refresh (90 d) tokens
//   mcpGrants/{grantId}          one per user × client approval; revoking it
//                                kills every token issued under it
import { createHash, randomBytes } from "node:crypto";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminDb } from "../firebaseAdmin";
import { SITE_URL } from "@/lib/constants";

export const MCP_SCOPE = "finance.read";
export const MCP_RESOURCE = `${SITE_URL}/api/mcp`;
export const RESOURCE_METADATA_URL = `${SITE_URL}/.well-known/oauth-protected-resource/api/mcp`;

const CODE_TTL_MS = 5 * 60_000;
const ACCESS_TTL_MS = 60 * 60_000;
const REFRESH_TTL_MS = 90 * 24 * 60 * 60_000;

/** RFC 6749 §5.2 error, rendered by the endpoints as `{ error, error_description }`. */
export class OAuthError extends Error {
  constructor(
    public readonly error: string,
    public readonly description: string,
    public readonly status = 400,
  ) {
    super(description);
  }
}

export interface OAuthClient {
  clientId: string;
  clientName: string;
  redirectUris: string[];
}

export interface AccessGrant {
  uid: string;
  clientId: string;
  grantId: string;
  scopes: string[];
  expiresAt: number;
}

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const token = (prefix: string) => `${prefix}_${randomBytes(32).toString("base64url")}`;

export function authorizationServerMetadata() {
  return {
    issuer: SITE_URL,
    authorization_endpoint: `${SITE_URL}/oauth/authorize`,
    token_endpoint: `${SITE_URL}/api/oauth/token`,
    registration_endpoint: `${SITE_URL}/api/oauth/register`,
    revocation_endpoint: `${SITE_URL}/api/oauth/revoke`,
    scopes_supported: [MCP_SCOPE],
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"],
    service_documentation: `${SITE_URL}/faq`,
  };
}

export function protectedResourceMetadata() {
  return {
    resource: MCP_RESOURCE,
    authorization_servers: [SITE_URL],
    scopes_supported: [MCP_SCOPE],
    bearer_methods_supported: ["header"],
    resource_name: "Lumi",
    resource_documentation: `${SITE_URL}/faq`,
  };
}

// ── Clients ─────────────────────────────────────────────────────────────────

/** https everywhere; plain http only for loopback (desktop clients, MCP Inspector). */
function isAllowedRedirect(uri: string): boolean {
  let url: URL;
  try {
    url = new URL(uri);
  } catch {
    return false;
  }
  if (url.hash) return false;
  if (url.protocol === "https:") return true;
  return url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
}

export async function registerClient(body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const redirectUris = body.redirect_uris;
  if (!Array.isArray(redirectUris) || redirectUris.length === 0 || redirectUris.length > 10) {
    throw new OAuthError("invalid_redirect_uri", "redirect_uris must be a non-empty array");
  }
  if (!redirectUris.every((u) => typeof u === "string" && isAllowedRedirect(u))) {
    throw new OAuthError("invalid_redirect_uri", "redirect_uris must be https (or http on localhost)");
  }
  const authMethod = body.token_endpoint_auth_method ?? "none";
  if (authMethod !== "none") {
    throw new OAuthError("invalid_client_metadata", "only public clients (token_endpoint_auth_method=none) are supported");
  }
  const clientName = typeof body.client_name === "string" && body.client_name.trim()
    ? body.client_name.trim().slice(0, 80)
    : "AI assistant";

  const clientId = `lumi_mcp_${randomBytes(16).toString("hex")}`;
  await adminDb().collection("mcpOAuthClients").doc(clientId).set({
    clientName,
    redirectUris,
    createdAt: FieldValue.serverTimestamp(),
  });
  return {
    client_id: clientId,
    client_id_issued_at: Math.floor(Date.now() / 1000),
    client_name: clientName,
    redirect_uris: redirectUris,
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    token_endpoint_auth_method: "none",
    scope: MCP_SCOPE,
  };
}

export async function getClient(clientId: string): Promise<OAuthClient | null> {
  if (!clientId || clientId.length > 100) return null;
  const snap = await adminDb().collection("mcpOAuthClients").doc(clientId).get();
  if (!snap.exists) return null;
  const data = snap.data()!;
  return { clientId, clientName: data.clientName, redirectUris: data.redirectUris ?? [] };
}

export interface AuthorizeParams {
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  state?: string;
  scope?: string;
  resource?: string;
}

/**
 * Validates /oauth/authorize parameters. Errors thrown here must be shown on
 * the page, never redirected: an unverified redirect_uri is an open redirect.
 */
export async function validateAuthorizeRequest(params: AuthorizeParams): Promise<OAuthClient> {
  const client = await getClient(params.clientId);
  if (!client) throw new OAuthError("invalid_client", "Unknown client");
  if (!client.redirectUris.includes(params.redirectUri)) {
    throw new OAuthError("invalid_request", "redirect_uri is not registered for this client");
  }
  if (params.codeChallengeMethod !== "S256" || !/^[A-Za-z0-9_-]{43,128}$/.test(params.codeChallenge)) {
    throw new OAuthError("invalid_request", "PKCE with S256 is required");
  }
  if (params.scope && !params.scope.split(" ").every((s) => s === MCP_SCOPE)) {
    throw new OAuthError("invalid_scope", `Only ${MCP_SCOPE} is supported`);
  }
  if (params.resource && params.resource.replace(/\/$/, "") !== MCP_RESOURCE) {
    throw new OAuthError("invalid_target", "Unknown resource");
  }
  return client;
}

/** The user approved on the consent page — issue a one-time code. */
export async function createAuthorizationCode(uid: string, params: AuthorizeParams, client: OAuthClient): Promise<string> {
  const db = adminDb();
  const grantId = hash(`${uid}:${client.clientId}`).slice(0, 32);
  await db.collection("mcpGrants").doc(grantId).set(
    {
      uid,
      clientId: client.clientId,
      clientName: client.clientName,
      scopes: [MCP_SCOPE],
      revoked: false,
      approvedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  const code = token("lc");
  await db.collection("mcpOAuthCodes").doc(hash(code)).set({
    uid,
    grantId,
    clientId: client.clientId,
    redirectUri: params.redirectUri,
    codeChallenge: params.codeChallenge,
    expiresAt: Timestamp.fromMillis(Date.now() + CODE_TTL_MS),
  });
  return code;
}

// ── Tokens ──────────────────────────────────────────────────────────────────

async function issueTokens(uid: string, clientId: string, grantId: string) {
  const db = adminDb();
  const access = token("la");
  const refresh = token("lr");
  const now = Date.now();
  const batch = db.batch();
  batch.set(db.collection("mcpOAuthTokens").doc(hash(access)), {
    kind: "access", uid, clientId, grantId, expiresAt: Timestamp.fromMillis(now + ACCESS_TTL_MS),
  });
  batch.set(db.collection("mcpOAuthTokens").doc(hash(refresh)), {
    kind: "refresh", uid, clientId, grantId, expiresAt: Timestamp.fromMillis(now + REFRESH_TTL_MS),
  });
  batch.update(db.collection("mcpGrants").doc(grantId), { lastTokenAt: FieldValue.serverTimestamp() });
  await batch.commit();
  return {
    access_token: access,
    token_type: "Bearer",
    expires_in: ACCESS_TTL_MS / 1000,
    refresh_token: refresh,
    scope: MCP_SCOPE,
  };
}

const pkceMatches = (verifier: string, challenge: string) =>
  createHash("sha256").update(verifier).digest("base64url") === challenge;

async function assertGrantActive(grantId: string): Promise<void> {
  const grant = await adminDb().collection("mcpGrants").doc(grantId).get();
  if (!grant.exists || grant.data()!.revoked) throw new OAuthError("invalid_grant", "Access was revoked");
}

export async function exchangeToken(form: URLSearchParams) {
  const grantType = form.get("grant_type");
  const clientId = form.get("client_id") ?? "";
  const db = adminDb();

  if (grantType === "authorization_code") {
    const code = form.get("code") ?? "";
    const verifier = form.get("code_verifier") ?? "";
    const ref = db.collection("mcpOAuthCodes").doc(hash(code));
    // Single use: read + delete in one transaction so a replayed code fails.
    const data = await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) return null;
      tx.delete(ref);
      return snap.data()!;
    });
    if (!data || data.expiresAt.toMillis() < Date.now()) throw new OAuthError("invalid_grant", "Code is invalid or expired");
    if (data.clientId !== clientId) throw new OAuthError("invalid_grant", "Code was issued to another client");
    if (data.redirectUri !== form.get("redirect_uri")) throw new OAuthError("invalid_grant", "redirect_uri mismatch");
    if (!pkceMatches(verifier, data.codeChallenge)) throw new OAuthError("invalid_grant", "PKCE verification failed");
    await assertGrantActive(data.grantId);
    return issueTokens(data.uid, clientId, data.grantId);
  }

  if (grantType === "refresh_token") {
    const ref = db.collection("mcpOAuthTokens").doc(hash(form.get("refresh_token") ?? ""));
    const data = await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists || snap.data()!.kind !== "refresh") return null;
      tx.delete(ref); // rotation: each refresh token works once
      return snap.data()!;
    });
    if (!data || data.expiresAt.toMillis() < Date.now()) throw new OAuthError("invalid_grant", "Refresh token is invalid or expired");
    if (clientId && data.clientId !== clientId) throw new OAuthError("invalid_grant", "Token was issued to another client");
    await assertGrantActive(data.grantId);
    return issueTokens(data.uid, data.clientId, data.grantId);
  }

  throw new OAuthError("unsupported_grant_type", "Use authorization_code or refresh_token");
}

export async function revokeToken(value: string): Promise<void> {
  await adminDb().collection("mcpOAuthTokens").doc(hash(value)).delete();
}

/** Bearer token → grant, or null when missing/expired/revoked. */
export async function verifyAccessToken(value: string): Promise<AccessGrant | null> {
  if (!value.startsWith("la_")) return null;
  const db = adminDb();
  const snap = await db.collection("mcpOAuthTokens").doc(hash(value)).get();
  if (!snap.exists) return null;
  const data = snap.data()!;
  if (data.kind !== "access" || data.expiresAt.toMillis() < Date.now()) return null;
  const grant = await db.collection("mcpGrants").doc(data.grantId).get();
  if (!grant.exists || grant.data()!.revoked) return null;
  return { uid: data.uid, clientId: data.clientId, grantId: data.grantId, scopes: [MCP_SCOPE], expiresAt: data.expiresAt.toMillis() };
}

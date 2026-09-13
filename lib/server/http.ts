import { adminAuth } from "./firebaseAdmin";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(code);
  }
}

export interface AuthedUser {
  uid: string;
  name?: string;
  email?: string;
}

export function json(data: unknown, status = 200, headers?: Record<string, string>): Response {
  return Response.json(data, { status, headers });
}

async function userFromHeader(req: Request): Promise<AuthedUser | null> {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  try {
    const token = await adminAuth().verifyIdToken(header.slice(7));
    return { uid: token.uid, name: token.name as string | undefined, email: token.email };
  } catch {
    return null;
  }
}

export async function requireUser(req: Request): Promise<AuthedUser> {
  const user = await userFromHeader(req);
  if (!user) throw new HttpError(401, "unauthenticated");
  return user;
}

export const optionalUser = userFromHeader;

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    const body = await req.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    throw new HttpError(400, "invalid_json");
  }
}

/** Wraps a handler: HttpError → JSON error response; anything else → 500. */
export async function handle(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof HttpError) {
      return json({ error: error.code, ...(error.details ?? {}) }, error.status);
    }
    console.error("[groups api] unexpected error", error);
    return json({ error: "internal" }, 500);
  }
}

// Firebase Admin for API routes (shared-expense groups). Server-only — never
// import from a client component.
//
// FIREBASE_SERVICE_ACCOUNT: the service-account JSON for money-tracker-46f60,
// either raw JSON or base64 of it (easier to paste into Vercel env settings).
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App | undefined;

/** Server misconfiguration (env), surfaced by `handle` as 503 so it's obvious from the client. */
export class AdminConfigError extends Error {
  constructor(public readonly reason: "missing" | "invalid_json" | "missing_fields") {
    super(`FIREBASE_SERVICE_ACCOUNT ${reason}`);
    this.name = "AdminConfigError";
  }
}

function adminApp(): App {
  if (app) return app;
  const existing = getApps()[0];
  if (existing) {
    app = existing;
    return app;
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw?.trim()) throw new AdminConfigError("missing");
  let serviceAccount: { project_id?: string; client_email?: string; private_key?: string };
  try {
    const json = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    serviceAccount = JSON.parse(json);
  } catch {
    throw new AdminConfigError("invalid_json");
  }
  if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
    throw new AdminConfigError("missing_fields");
  }
  app = initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      // Pasted env values sometimes keep literal \n sequences instead of newlines.
      privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
    }),
    projectId: serviceAccount.project_id,
  });
  return app;
}

export function adminDb(): Firestore {
  return getFirestore(adminApp());
}

export function adminAuth(): Auth {
  return getAuth(adminApp());
}

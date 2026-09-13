// Firebase Admin for API routes (shared-expense groups). Server-only — never
// import from a client component.
//
// FIREBASE_SERVICE_ACCOUNT: the service-account JSON for money-tracker-46f60,
// either raw JSON or base64 of it (easier to paste into Vercel env settings).
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let app: App | undefined;

function adminApp(): App {
  if (app) return app;
  const existing = getApps()[0];
  if (existing) {
    app = existing;
    return app;
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT is not configured");
  const json = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
  const serviceAccount = JSON.parse(json) as { project_id: string; client_email: string; private_key: string };
  app = initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
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

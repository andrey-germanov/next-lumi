// /api/android-beta — Google Play closed-test signups.
//   POST { email, locale?, device?, website? } → { ok, already }
//   GET                                       → { count }
// The email must be the Google account the tester uses in the Play Store: it
// is pasted into the closed-test email list in Play Console by hand.
// Stored at androidBetaTesters/{email}; Firestore rules deny all client access,
// only the Admin SDK here reads or writes it.
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/server/firebaseAdmin";
import { handle, json, readJson, HttpError } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COLLECTION = "androidBetaTesters";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LOCALES = ["en", "ru", "uk", "ro", "de", "es", "it"];

function normalizeEmail(raw: string): string {
  const email = raw.trim().toLowerCase();
  // googlemail.com is the same account as gmail.com; Play Console accepts either.
  return email.replace(/@googlemail\.com$/, "@gmail.com");
}

export async function POST(req: Request) {
  return handle(async () => {
    const body = await readJson(req);

    // Honeypot: real users never see the "website" field.
    if (typeof body.website === "string" && body.website.trim()) return json({ ok: true, already: false });

    if (typeof body.email !== "string" || body.email.length > 254) throw new HttpError(400, "invalid_email");
    const email = normalizeEmail(body.email);
    if (!EMAIL_RE.test(email)) throw new HttpError(400, "invalid_email");

    const locale = typeof body.locale === "string" && LOCALES.includes(body.locale) ? body.locale : "en";
    const device = typeof body.device === "string" ? body.device.trim().slice(0, 80) : "";
    const source = typeof body.source === "string" ? body.source.trim().slice(0, 120) : "";

    const ref = adminDb().collection(COLLECTION).doc(email);
    const already = await adminDb().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (snap.exists) {
        tx.update(ref, { lastSubmittedAt: FieldValue.serverTimestamp() });
        return true;
      }
      tx.set(ref, {
        email,
        locale,
        device,
        source,
        status: "pending", // pending → invited (added in Play Console) → opted_in
        createdAt: FieldValue.serverTimestamp(),
        lastSubmittedAt: FieldValue.serverTimestamp(),
      });
      return false;
    });

    return json({ ok: true, already });
  });
}

export async function GET() {
  return handle(async () => {
    const snap = await adminDb().collection(COLLECTION).count().get();
    return json({ count: snap.data().count }, 200, { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" });
  });
}

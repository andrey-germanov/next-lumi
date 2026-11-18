// Who a campaign goes to.
//
// Push: every Expo token under users/{uid}/pushTokens (pushTokenService — every
//   install with notifications allowed, guests included) and
//   users/{uid}/devices (Family Sharing). Deduped by token: one device can sit
//   under a guest uid and an account uid at once.
// Email: Firebase Auth accounts with an email. Anonymous backup identities have
//   no provider and no email, so they never qualify. The locale comes from the
//   user's freshest device token (Auth itself stores none).
import type { DocumentReference, Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "../firebaseAdmin";
import { isExpoToken } from "./expoPush";
import { normalizeEmail } from "./email";

export interface AudienceFilter {
  /** Two-letter app locales; empty = everyone. */
  locales?: string[];
  /** Push only: "ios" | "android"; empty = both. */
  platforms?: string[];
  /** Only these uids (test sends, hand-picked lists). */
  uids?: string[];
  /** Email only: only these addresses (test sends). */
  emails?: string[];
}

export interface PushTarget {
  uid: string;
  token: string;
  locale: string;
  platform: string | null;
  ref: DocumentReference;
}

export interface EmailTarget {
  uid: string;
  email: string;
  locale: string | null;
  platform: string | null;
}

interface RawToken {
  token?: unknown;
  locale?: unknown;
  language?: unknown;
  platform?: unknown;
  updatedAt?: Timestamp;
}

const short = (value: unknown) => (typeof value === "string" && value ? value.slice(0, 2).toLowerCase() : null);
const list = (values?: string[]) => (values ?? []).map((v) => v.trim()).filter(Boolean);

/** All device tokens, freshest first, deduped by token. */
async function allTokens(uids?: string[]): Promise<PushTarget[]> {
  const db = adminDb();
  const docs = uids?.length
    ? (
        await Promise.all(
          uids.flatMap((uid) => [
            db.collection("users").doc(uid).collection("pushTokens").get(),
            db.collection("users").doc(uid).collection("devices").get(),
          ]),
        )
      ).flatMap((snap) => snap.docs)
    : (await Promise.all([db.collectionGroup("pushTokens").get(), db.collectionGroup("devices").get()])).flatMap(
        (snap) => snap.docs,
      );

  const rows = docs
    .filter((doc) => doc.ref.parent.parent?.parent.id === "users")
    .map((doc) => ({ doc, data: doc.data() as RawToken }))
    .filter(({ data }) => isExpoToken(data.token))
    .sort((a, b) => (b.data.updatedAt?.toMillis() ?? 0) - (a.data.updatedAt?.toMillis() ?? 0));

  const seen = new Set<string>();
  const out: PushTarget[] = [];
  for (const { doc, data } of rows) {
    const token = data.token as string;
    if (seen.has(token)) continue;
    seen.add(token);
    out.push({
      uid: doc.ref.parent.parent!.id,
      token,
      locale: short(data.locale) ?? short(data.language) ?? "en",
      platform: typeof data.platform === "string" ? data.platform : null,
      ref: doc.ref,
    });
  }
  return out;
}

export async function pushAudience(filter: AudienceFilter): Promise<PushTarget[]> {
  const locales = list(filter.locales);
  const platforms = list(filter.platforms);
  const uids = list(filter.uids);
  return (await allTokens(uids.length ? uids : undefined)).filter(
    (target) =>
      (!locales.length || locales.includes(target.locale)) &&
      (!platforms.length || (target.platform !== null && platforms.includes(target.platform))),
  );
}

/** uid → { locale, platform } of the user's freshest device. */
async function deviceInfoByUid(uids?: string[]): Promise<Map<string, { locale: string; platform: string | null }>> {
  const map = new Map<string, { locale: string; platform: string | null }>();
  for (const target of await allTokens(uids)) {
    if (!map.has(target.uid)) map.set(target.uid, { locale: target.locale, platform: target.platform });
  }
  return map;
}

export async function emailAudience(filter: AudienceFilter): Promise<EmailTarget[]> {
  const auth = adminAuth();
  const uids = list(filter.uids);
  const emails = list(filter.emails).map(normalizeEmail);
  const locales = list(filter.locales);

  let users;
  if (uids.length || emails.length) {
    const identifiers = [...uids.map((uid) => ({ uid })), ...emails.map((email) => ({ email }))];
    users = [];
    for (let i = 0; i < identifiers.length; i += 100) {
      users.push(...(await auth.getUsers(identifiers.slice(i, i + 100))).users);
    }
  } else {
    users = [];
    let pageToken: string | undefined;
    do {
      const page = await auth.listUsers(1000, pageToken);
      users.push(...page.users);
      pageToken = page.pageToken;
    } while (pageToken);
  }

  const devices = await deviceInfoByUid(uids.length ? uids : undefined);
  const seen = new Set<string>();
  const out: EmailTarget[] = [];
  for (const user of users) {
    if (!user.email || user.disabled || user.providerData.length === 0) continue;
    const email = normalizeEmail(user.email);
    if (seen.has(email)) continue;
    seen.add(email);
    const device = devices.get(user.uid);
    const locale = device?.locale ?? null;
    if (locales.length && (!locale || !locales.includes(locale))) continue;
    out.push({ uid: user.uid, email, locale, platform: device?.platform ?? null });
  }
  // Explicit test addresses with no Lumi account still get the email.
  for (const email of emails) {
    if (!seen.has(email)) out.push({ uid: "", email, locale: null, platform: null });
  }
  return out;
}

/** Locale/platform for one user (transactional emails). */
export async function deviceInfo(uid: string): Promise<{ locale: string | null; platform: string | null }> {
  const info = (await deviceInfoByUid([uid])).get(uid);
  return { locale: info?.locale ?? null, platform: info?.platform ?? null };
}

// Email via Resend (https://resend.com/docs/api-reference/emails/send-batch-emails).
//
// Env:
//   RESEND_API_KEY     — Resend API key (sending access is enough)
//   EMAIL_FROM         — e.g. "Lumi <hello@lumi.herman-apps.com>"; the domain
//                        must be verified in Resend
//   EMAIL_REPLY_TO     — optional reply-to address
//   MESSAGING_SECRET   — any long random string; signs unsubscribe links
//
// Every email carries a signed one-click unsubscribe link (also as the
// List-Unsubscribe header, which Gmail/Yahoo require for bulk senders).
// Unsubscribed addresses live in `emailSuppressions/{sha256(email)}`
// (server-only collection) and are skipped by every send.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "../firebaseAdmin";
import { SITE_URL } from "../../constants";
import { renderEmailLayout, type EmailContent } from "../../messaging/emailLayout";

const RESEND_BATCH_URL = "https://api.resend.com/emails/batch";
const BATCH = 100; // Resend's batch limit

export class EmailConfigError extends Error {
  constructor(public readonly missing: string) {
    super(`${missing} is not configured`);
    this.name = "EmailConfigError";
  }
}

function env(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new EmailConfigError(name);
  return value;
}

// ── Unsubscribe ────────────────────────────────────────────────────────────

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
const emailKey = (email: string) => createHash("sha256").update(normalizeEmail(email)).digest("hex");

function sign(email: string): string {
  return createHmac("sha256", env("MESSAGING_SECRET")).update(normalizeEmail(email)).digest("base64url");
}

export function unsubscribeUrl(email: string): string {
  const e = Buffer.from(normalizeEmail(email)).toString("base64url");
  return `${SITE_URL}/api/messaging/unsubscribe?e=${e}&t=${sign(email)}`;
}

/** Returns the email when the link's signature is valid, else null. */
export function verifyUnsubscribe(e: string | null, t: string | null): string | null {
  if (!e || !t) return null;
  let email: string;
  try {
    email = Buffer.from(e, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const expected = Buffer.from(sign(email));
  const given = Buffer.from(t);
  return expected.length === given.length && timingSafeEqual(expected, given) ? normalizeEmail(email) : null;
}

export async function suppressEmail(email: string, source: string): Promise<void> {
  await adminDb()
    .collection("emailSuppressions")
    .doc(emailKey(email))
    .set({ email: normalizeEmail(email), source, at: FieldValue.serverTimestamp() });
}

/** Subset of `emails` that must not be emailed. */
export async function suppressedEmails(emails: string[]): Promise<Set<string>> {
  const db = adminDb();
  const out = new Set<string>();
  for (let i = 0; i < emails.length; i += 300) {
    const slice = emails.slice(i, i + 300);
    const snaps = await db.getAll(...slice.map((email) => db.collection("emailSuppressions").doc(emailKey(email))));
    snaps.forEach((snap, index) => {
      if (snap.exists) out.add(normalizeEmail(slice[index]));
    });
  }
  return out;
}

// ── Rendering ──────────────────────────────────────────────────────────────

export type { EmailContent } from "../../messaging/emailLayout";

export function renderEmail(content: EmailContent, to: string): { html: string; text: string } {
  return renderEmailLayout(content, unsubscribeUrl(to));
}

// ── Sending ────────────────────────────────────────────────────────────────

export interface OutgoingEmail {
  to: string;
  content: EmailContent;
  /** Resend tags (ASCII letters, digits, _ and - only). */
  tags?: Record<string, string>;
}

export interface EmailResult {
  sent: number;
  failed: number;
  suppressed: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const tagValue = (value: string) => value.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 256);

/** Sends through Resend's batch API, skipping suppressed addresses. */
export async function sendEmails(emails: OutgoingEmail[]): Promise<EmailResult> {
  const apiKey = env("RESEND_API_KEY");
  const from = env("EMAIL_FROM");
  const replyTo = process.env.EMAIL_REPLY_TO?.trim();

  const blocked = await suppressedEmails(emails.map((email) => email.to));
  const deliverable = emails.filter((email) => !blocked.has(normalizeEmail(email.to)));
  const result: EmailResult = { sent: 0, failed: 0, suppressed: emails.length - deliverable.length };

  for (let i = 0; i < deliverable.length; i += BATCH) {
    const chunk = deliverable.slice(i, i + BATCH);
    const payload = chunk.map(({ to, content, tags }) => {
      const { html, text } = renderEmail(content, to);
      const unsub = unsubscribeUrl(to);
      return {
        from,
        to: [to],
        subject: content.subject,
        html,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
        headers: {
          "List-Unsubscribe": `<${unsub}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
        ...(tags ? { tags: Object.entries(tags).map(([name, value]) => ({ name, value: tagValue(value) })) } : {}),
      };
    });

    // Resend's default rate limit is a few requests per second: pace batches
    // and back off on 429.
    let ok = false;
    for (let attempt = 0; attempt < 4 && !ok; attempt++) {
      if (attempt > 0 || i > 0) await sleep(attempt > 0 ? 1000 * 2 ** attempt : 600);
      try {
        const response = await fetch(RESEND_BATCH_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.status === 429 || response.status >= 500) continue;
        if (!response.ok) {
          console.warn("[email] resend rejected batch", response.status, (await response.text()).slice(0, 300));
          break;
        }
        ok = true;
      } catch (error) {
        console.warn("[email] send failed", error);
      }
    }
    if (ok) result.sent += chunk.length;
    else result.failed += chunk.length;
  }
  return result;
}

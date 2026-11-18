// Triggered (transactional) emails.
//
//   welcome         — accounts created in the last 72 h, from the daily cron
//   pro_started     — Adapty trial_started / subscription_started
//   trial_cancelled — Adapty trial_renewal_cancelled
//
// Each (uid, template) is sent at most once ever: `emailLog/{uid}_{template}`
// (server-only) is claimed with create() before sending, so cron reruns and
// Adapty webhook retries can't double-send.
//
// Off until MESSAGING_TRIGGERS_ENABLED=1, so deploying this doesn't start
// mailing anyone before the sending domain is verified and the copy approved.
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "../firebaseAdmin";
import { deviceInfo } from "./audience";
import { sendEmails } from "./email";
import { renderTemplate, type TemplateId } from "./templates";
import type { AdaptyWebhookEvent } from "../adaptyEvents";

export const triggersEnabled = () => process.env.MESSAGING_TRIGGERS_ENABLED === "1";

const WELCOME_WINDOW_MS = 72 * 60 * 60 * 1000;

const ADAPTY_TRIGGERS: Record<string, TemplateId | undefined> = {
  trial_started: "pro_started",
  subscription_started: "pro_started",
  trial_renewal_cancelled: "trial_cancelled",
};

type SendOutcome = "sent" | "already_sent" | "no_email" | "failed" | "disabled";

/** Sends `template` to `uid` once. */
export async function sendTriggered(uid: string, template: TemplateId): Promise<SendOutcome> {
  if (!triggersEnabled()) return "disabled";
  const user = await adminAuth().getUser(uid).catch(() => null);
  if (!user?.email || user.disabled || user.providerData.length === 0) return "no_email";

  const logRef = adminDb().collection("emailLog").doc(`${uid}_${template}`);
  try {
    await logRef.create({ uid, template, email: user.email, status: "sending", at: FieldValue.serverTimestamp() });
  } catch {
    return "already_sent"; // ALREADY_EXISTS
  }

  let result;
  let locale: string | null = null;
  try {
    const device = await deviceInfo(uid);
    locale = device.locale;
    result = await sendEmails([
      { to: user.email, content: renderTemplate(template, locale, device.platform), tags: { kind: "triggered", template } },
    ]);
  } catch (error) {
    await logRef.delete().catch(() => {});
    throw error;
  }
  if (result.failed > 0) {
    // Release the claim so the next cron run / webhook retry tries again.
    await logRef.delete().catch(() => {});
    return "failed";
  }
  await logRef.update({ status: result.suppressed ? "suppressed" : "sent", locale: locale ?? null });
  return "sent";
}

/** Called from the Adapty webhook. Never throws — a mail problem must not make Adapty retry the event. */
export async function runAdaptyTrigger(event: AdaptyWebhookEvent): Promise<void> {
  try {
    const template = typeof event.event_type === "string" ? ADAPTY_TRIGGERS[event.event_type] : undefined;
    const uid = event.customer_user_id ?? event.profile?.customer_user_id;
    if (!template || typeof uid !== "string" || !uid) return;
    if (event.event_properties?.environment === "Sandbox") return;
    await sendTriggered(uid, template);
  } catch (error) {
    console.warn("[messaging] adapty trigger failed", error);
  }
}

/** Daily cron: welcome emails for recently created accounts. */
export async function runWelcomeSweep(): Promise<Record<SendOutcome, number>> {
  const counts: Record<SendOutcome, number> = { sent: 0, already_sent: 0, no_email: 0, failed: 0, disabled: 0 };
  if (!triggersEnabled()) {
    counts.disabled = 1;
    return counts;
  }
  const since = Date.now() - WELCOME_WINDOW_MS;
  let pageToken: string | undefined;
  do {
    const page = await adminAuth().listUsers(1000, pageToken);
    for (const user of page.users) {
      if (new Date(user.metadata.creationTime).getTime() < since) continue;
      if (!user.email || user.providerData.length === 0) continue;
      counts[await sendTriggered(user.uid, "welcome")] += 1;
    }
    pageToken = page.pageToken;
  } while (pageToken);
  return counts;
}

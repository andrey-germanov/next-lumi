// Manual campaigns: one push or one email to an audience, sent from
// /admin/messaging. Each run is recorded in `messagingCampaigns/{id}`
// (server-only) with its content, audience and delivery counts.
//
// Sending is synchronous inside the request (maxDuration 300 s on the route):
// Expo takes 100 pushes per call and Resend 100 emails per batch, so this
// covers tens of thousands of recipients. Past that, move to a queue.
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "../firebaseAdmin";
import { HttpError } from "../http";
import { emailAudience, pushAudience, type AudienceFilter } from "./audience";
import { sendEmails } from "./email";
import { sendExpoPushes } from "./expoPush";
import { campaignFooter } from "./templates";

/** Push deep links the app already routes (HomeScreen handleDeepLink). */
export const DEEP_LINK_TARGETS = ["home", "budgets", "autopilot", "forecast"] as const;

export interface CampaignInput {
  channel: "push" | "email";
  name?: string;
  audience: AudienceFilter;
  /** Push: notification title. Email: unused. */
  title?: string;
  /** Email subject. */
  subject?: string;
  /** Push body, or email body (plain text, blank line = new paragraph). */
  body: string;
  /** Push only: screen to open on tap. */
  deepLink?: (typeof DEEP_LINK_TARGETS)[number];
  /** Email only: optional button. */
  cta?: { label: string; url: string };
  /** Count recipients only, send nothing. */
  dryRun?: boolean;
}

const str = (value: unknown, max: number): string | undefined =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, max) : undefined;
const strList = (value: unknown): string[] | undefined =>
  Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && !!v.trim()).slice(0, 1000) : undefined;

export function parseCampaign(body: Record<string, unknown>): CampaignInput {
  const channel = body.channel;
  if (channel !== "push" && channel !== "email") throw new HttpError(400, "invalid_channel");
  const text = str(body.body, channel === "push" ? 500 : 20000);
  if (!text) throw new HttpError(400, "body_required");
  const audienceRaw = (body.audience ?? {}) as Record<string, unknown>;
  const audience: AudienceFilter = {
    locales: strList(audienceRaw.locales),
    platforms: strList(audienceRaw.platforms),
    uids: strList(audienceRaw.uids),
    emails: strList(audienceRaw.emails),
  };
  const input: CampaignInput = { channel, body: text, audience, name: str(body.name, 120), dryRun: body.dryRun === true };
  if (channel === "push") {
    input.title = str(body.title, 120);
    const deepLink = body.deepLink;
    if (typeof deepLink === "string" && (DEEP_LINK_TARGETS as readonly string[]).includes(deepLink)) {
      input.deepLink = deepLink as CampaignInput["deepLink"];
    }
  } else {
    input.subject = str(body.subject, 200);
    if (!input.subject) throw new HttpError(400, "subject_required");
    const cta = body.cta as Record<string, unknown> | undefined;
    const label = str(cta?.label, 60);
    const url = str(cta?.url, 2000);
    if (label && url) {
      if (!/^https:\/\//.test(url)) throw new HttpError(400, "cta_url_must_be_https");
      input.cta = { label, url };
    }
  }
  return input;
}

export async function runCampaign(input: CampaignInput) {
  const db = adminDb();

  if (input.channel === "push") {
    const targets = await pushAudience(input.audience);
    if (input.dryRun) return { dryRun: true, recipients: targets.length };

    const ref = db.collection("messagingCampaigns").doc();
    await ref.set({ ...stripUndefined(input), status: "sending", recipients: targets.length, createdAt: FieldValue.serverTimestamp() });
    const result = await sendExpoPushes(
      targets.map((target) => ({
        tokenRef: target.ref,
        message: {
          to: target.token,
          ...(input.title ? { title: input.title } : {}),
          body: input.body,
          sound: "default" as const,
          data: { type: "campaign", campaignId: ref.id, ...(input.deepLink ? { deepLink: { target: input.deepLink } } : {}) },
        },
      })),
    );
    await ref.update({ status: "sent", result, sentAt: FieldValue.serverTimestamp() });
    return { id: ref.id, recipients: targets.length, ...result };
  }

  const targets = await emailAudience(input.audience);
  if (input.dryRun) return { dryRun: true, recipients: targets.length };

  const ref = db.collection("messagingCampaigns").doc();
  await ref.set({ ...stripUndefined(input), status: "sending", recipients: targets.length, createdAt: FieldValue.serverTimestamp() });
  const result = await sendEmails(
    targets.map((target) => ({
      to: target.email,
      content: {
        subject: input.subject!,
        body: input.body,
        ...(input.cta ? { cta: input.cta } : {}),
        footer: campaignFooter(target.locale),
      },
      tags: { kind: "campaign", campaign: ref.id },
    })),
  );
  await ref.update({ status: "sent", result, sentAt: FieldValue.serverTimestamp() });
  return { id: ref.id, recipients: targets.length, ...result };
}

export async function listCampaigns(limit = 30) {
  const snap = await adminDb().collection("messagingCampaigns").orderBy("createdAt", "desc").limit(limit).get();
  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      channel: data.channel,
      name: data.name ?? null,
      title: data.title ?? data.subject ?? null,
      body: typeof data.body === "string" ? data.body.slice(0, 200) : "",
      audience: data.audience ?? {},
      status: data.status,
      recipients: data.recipients ?? 0,
      result: data.result ?? null,
      createdAt: data.createdAt?.toDate?.().toISOString() ?? null,
    };
  });
}

function stripUndefined<T extends object>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

// Persists every Adapty webhook event to Firestore `adaptyEvents` (server-only;
// firestore.rules has no match for it, so clients can't read or write it).
// Kept for analytics like "who started a trial on day X and who cancelled it":
// guests have no customer_user_id, so profile_id is the key that always exists.
import { createHash } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./firebaseAdmin";

export interface AdaptyWebhookEvent {
  profile_id?: unknown;
  customer_user_id?: unknown;
  event_type?: unknown;
  event_datetime?: unknown;
  event_properties?: Record<string, unknown>;
  profile?: { customer_user_id?: unknown };
  [key: string]: unknown;
}

const str = (value: unknown): string | null => (typeof value === "string" && value ? value : null);

export async function saveAdaptyEvent(event: AdaptyWebhookEvent): Promise<void> {
  const props = event.event_properties ?? {};
  const eventType = str(event.event_type);
  const eventAt = str(event.event_datetime);
  const profileId = str(event.profile_id);
  const transactionId = str(props.transaction_id) ?? str(props.original_transaction_id);

  // Deterministic id so Adapty retries overwrite instead of duplicating.
  const id = createHash("sha1")
    .update([eventType, profileId, transactionId, eventAt].join("|"))
    .digest("hex");

  await adminDb()
    .collection("adaptyEvents")
    .doc(id)
    .set({
      eventType,
      eventAt: eventAt ? new Date(eventAt) : null,
      profileId,
      customerUserId: str(event.customer_user_id) ?? str(event.profile?.customer_user_id),
      productId: str(props.vendor_product_id),
      store: str(props.store),
      environment: str(props.environment),
      transactionId: str(props.transaction_id),
      originalTransactionId: str(props.original_transaction_id),
      // JSON string: Firestore rejects nested arrays, and this is only for forensics.
      raw: JSON.stringify(event),
      receivedAt: FieldValue.serverTimestamp(),
    });
}

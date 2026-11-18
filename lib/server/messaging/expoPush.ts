// Expo push sender shared by group pushes and Lumi messaging.
//
// Tokens live in users/{uid}/pushTokens/{deviceId} (written by the app's
// pushTokenService) and, for Family Sharing, users/{uid}/devices/{deviceId}.
// A token Expo reports as DeviceNotRegistered (app deleted, permission
// revoked) is removed here so later sends don't keep paying for it.
import type { DocumentReference } from "firebase-admin/firestore";

const EXPO_SEND_URL = "https://exp.host/--/api/v2/push/send";
const CHUNK = 100; // Expo's per-request limit

export interface ExpoMessage {
  to: string;
  title?: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: "default" | null;
}

/** A message plus the Firestore doc its token came from (deleted when the token is dead). */
export interface OutgoingPush {
  message: ExpoMessage;
  tokenRef?: DocumentReference;
}

export interface PushResult {
  sent: number;
  failed: number;
  removedTokens: number;
}

export const isExpoToken = (value: unknown): value is string =>
  typeof value === "string" && (value.startsWith("ExponentPushToken[") || value.startsWith("ExpoPushToken["));

type Ticket = { status: "ok"; id: string } | { status: "error"; message?: string; details?: { error?: string } };

export async function sendExpoPushes(pushes: OutgoingPush[]): Promise<PushResult> {
  const result: PushResult = { sent: 0, failed: 0, removedTokens: 0 };
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  // Only needed if "Enhanced push security" is on for the Expo project.
  if (process.env.EXPO_ACCESS_TOKEN) headers.Authorization = `Bearer ${process.env.EXPO_ACCESS_TOKEN}`;

  for (let i = 0; i < pushes.length; i += CHUNK) {
    const chunk = pushes.slice(i, i + CHUNK);
    let tickets: Ticket[] = [];
    try {
      const response = await fetch(EXPO_SEND_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(chunk.map((push) => push.message)),
      });
      const body = (await response.json().catch(() => null)) as { data?: Ticket[] } | null;
      if (!response.ok || !Array.isArray(body?.data)) {
        console.warn("[push] expo rejected chunk", response.status, JSON.stringify(body)?.slice(0, 300));
        result.failed += chunk.length;
        continue;
      }
      tickets = body.data;
    } catch (error) {
      console.warn("[push] send failed", error);
      result.failed += chunk.length;
      continue;
    }

    const dead: DocumentReference[] = [];
    tickets.forEach((ticket, index) => {
      if (ticket.status === "ok") {
        result.sent += 1;
        return;
      }
      result.failed += 1;
      const ref = chunk[index]?.tokenRef;
      if (ticket.details?.error === "DeviceNotRegistered" && ref) dead.push(ref);
    });
    await Promise.all(dead.map((ref) => ref.delete().catch(() => {})));
    result.removedTokens += dead.length;
  }
  return result;
}

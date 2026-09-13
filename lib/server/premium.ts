// Server-side Premium check via Adapty Server API. The app identifies the
// Adapty profile with the Firebase uid (AppNavigator: adapty.identify(uid)),
// so customer_user_id === uid. A client-supplied "isPremium" is never trusted.
//
// ADAPTY_SECRET_KEY: Adapty dashboard → App settings → General → Secret key.
import { HttpError } from "./http";

const PREMIUM_LEVELS = new Set(["premium", "family-premium"]);
const TTL_MS = 60_000;
const cache = new Map<string, { value: boolean; at: number }>();

interface AdaptyAccessLevel {
  access_level_id?: string;
  is_active?: boolean;
  is_lifetime?: boolean;
  expires_at?: string | null;
  is_in_grace_period?: boolean;
  grace_period_expires_at?: string | null;
}

const isActiveLevel = (level: AdaptyAccessLevel, now: number): boolean => {
  if (!level.access_level_id || !PREMIUM_LEVELS.has(level.access_level_id)) return false;
  if (level.is_lifetime || level.is_active || level.is_in_grace_period) return true;
  if (level.grace_period_expires_at && Date.parse(level.grace_period_expires_at) > now) return true;
  return !level.expires_at || Date.parse(level.expires_at) > now;
};

export async function isPremium(uid: string): Promise<boolean> {
  const cached = cache.get(uid);
  if (cached && Date.now() - cached.at < TTL_MS) return cached.value;

  const secret = process.env.ADAPTY_SECRET_KEY;
  if (!secret) {
    console.warn("[premium] ADAPTY_SECRET_KEY missing — treating everyone as free");
    return false;
  }

  let response: Response;
  try {
    response = await fetch("https://api.adapty.io/api/v2/server-side-api/profile/", {
      headers: { Authorization: `Api-Key ${secret}`, "adapty-customer-user-id": uid },
      cache: "no-store",
    });
  } catch {
    throw new HttpError(503, "premium_check_failed");
  }

  let value = false;
  if (response.status !== 404) {
    if (!response.ok) throw new HttpError(503, "premium_check_failed");
    const body = (await response.json()) as { data?: { access_levels?: AdaptyAccessLevel[] }; access_levels?: AdaptyAccessLevel[] };
    const levels = body.data?.access_levels ?? body.access_levels ?? [];
    const now = Date.now();
    value = levels.some((level) => isActiveLevel(level, now));
  }

  cache.set(uid, { value, at: Date.now() });
  return value;
}

export function invalidatePremium(uid: string): void {
  cache.delete(uid);
}

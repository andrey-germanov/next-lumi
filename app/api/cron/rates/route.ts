// Daily cron (vercel.json): store today's rates early, so tomorrow there is always
// a "yesterday" to fall back to even if no user opened the app today.
import { handle, json, HttpError } from "@/lib/server/http";
import { fetchExchangeRateApi, firestoreRatesStore, getDailyRates, notifyTelegram } from "@/lib/server/rates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handle(async () => {
    const secret = process.env.CRON_SECRET;
    if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) throw new HttpError(401, "unauthorized");
    const result = await getDailyRates({ store: firestoreRatesStore(), fetchUpstream: fetchExchangeRateApi, notify: notifyTelegram });
    return json({ date: result?.date ?? null, source: result?.source ?? null });
  });
}

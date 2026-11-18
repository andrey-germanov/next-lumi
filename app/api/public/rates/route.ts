// GET /api/public/rates — daily USD-based exchange rates for the mobile app.
// No auth: the rates are public data. One upstream call per UTC day; on upstream
// failure the app gets yesterday's rates (see lib/server/rates.ts).
import { handle, json } from "@/lib/server/http";
import { fetchExchangeRateApi, firestoreRatesStore, getDailyRates, memoryRatesStore, notifyTelegram } from "@/lib/server/rates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const useMemoryStore = () =>
  process.env.NODE_ENV !== "production" && !process.env.FIREBASE_SERVICE_ACCOUNT?.trim();

export async function GET() {
  return handle(async () => {
    const result = await getDailyRates({
      store: useMemoryStore() ? memoryRatesStore : firestoreRatesStore(),
      fetchUpstream: fetchExchangeRateApi,
      notify: notifyTelegram,
    });
    if (!result) {
      // Cached briefly so an outage does not turn every app launch into three
      // upstream calls (and burn the API quota).
      return json({ error: "rates_unavailable" }, 503, { "Cache-Control": "public, s-maxage=60" });
    }
    // Live rates hold for the day; yesterday's are a stand-in, so let the CDN
    // ask again soon and pick up today's rates once the upstream recovers.
    const cache =
      result.source === "live"
        ? "public, s-maxage=3600, stale-while-revalidate=86400"
        : "public, s-maxage=300";
    return json(result, 200, { "Cache-Control": cache });
  });
}

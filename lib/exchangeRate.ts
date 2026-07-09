// ============================================================================
// Exchange-rate service — port of the mobile app's
// `src/services/exchangeRateService.ts`. Same static USD-based table, same
// 24h cache TTL, same ExchangeRate-API endpoint, same rate math
// (from → USD → to = toPerUSD / fromPerUSD).
//
// Web differences: cache lives in localStorage; conversion used by the finance
// helpers is synchronous (cache-or-static, exactly like the app's
// getExchangeRate priority), while a background `refreshRates()` keeps the
// cache fresh — mirroring the app's "use static/cache now, refresh async" flow.
// ============================================================================

import type { CurrencyCode } from "@/utils/currencyUtils";

const CACHE_KEY = "lumi-exchange-rates";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24h
const API_URL = "https://v6.exchangerate-api.com/v6/973a758b48f94bf77bb6dc71/latest/USD";

// Static fallback rates (amount of currency per 1 USD), copied verbatim from the app.
export const STATIC_EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0, EUR: 0.91, GBP: 0.78, JPY: 151.0, CNY: 7.15, INR: 83.5, BRL: 5.1,
  RUB: 93.0, KRW: 1330.0, AUD: 1.5, CAD: 1.36, CHF: 0.87, MXN: 17.2, SEK: 10.6,
  NOK: 10.9, NZD: 1.65, SGD: 1.33, HKD: 7.81, TRY: 33.5, ZAR: 19.0, PLN: 4.05,
  THB: 36.5, IDR: 15800.0, MYR: 4.75, PHP: 56.5, VND: 24550.0, ILS: 3.68,
  AED: 3.67, SAR: 3.75, PKR: 280.0, BDT: 111.0, EGP: 31.5, NGN: 1620.0,
  KES: 132.0, ARS: 875.0, CLP: 935.0, COP: 3950.0, PEN: 3.72, DKK: 6.88,
  CZK: 23.8, HUF: 365.0, RON: 4.62, MDL: 18.2, BGN: 1.82, HRK: 6.92, TWD: 31.8,
  UAH: 38.0, KZT: 455.0, UZS: 12300.0, BYN: 3.32, GEL: 2.7, AMD: 400.0,
  AZN: 1.7, KGS: 89.0, TJS: 10.9, TMT: 3.5, ISK: 138.0, RSD: 109.0,
};

interface RateCache {
  rates: Record<string, number>; // code → per USD
  timestamp: number;
}

let memoryCache: RateCache | null = null;
let loaded = false;

function loadCache(): RateCache | null {
  if (loaded) return memoryCache;
  loaded = true;
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    memoryCache = raw ? (JSON.parse(raw) as RateCache) : null;
  } catch {
    memoryCache = null;
  }
  return memoryCache;
}

function saveCache(rates: Record<string, number>): void {
  memoryCache = { rates, timestamp: Date.now() };
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(memoryCache));
  } catch {
    /* quota / private mode */
  }
}

function isValid(cache: RateCache | null): boolean {
  return !!cache && Date.now() - cache.timestamp <= CACHE_DURATION;
}

/** Static rate from → to (mirrors the app's getStaticRate). */
function getStaticRate(from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return 1.0;
  const fromPerUSD = STATIC_EXCHANGE_RATES[from] || 1.0;
  const toPerUSD = STATIC_EXCHANGE_RATES[to] || 1.0;
  if (fromPerUSD === 1.0 && toPerUSD === 1.0 && from !== "USD") return 1.0;
  return toPerUSD / fromPerUSD;
}

/** Synchronous rate: cached rates (even if expired) take priority over static. */
export function getRate(from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return 1.0;
  const cache = loadCache();
  if (cache && cache.rates[from] && cache.rates[to]) {
    return cache.rates[to] / cache.rates[from];
  }
  return getStaticRate(from, to);
}

/** Synchronous conversion. */
export function convert(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount;
  return amount * getRate(from, to);
}

let refreshing: Promise<void> | null = null;

/**
 * Background refresh: only hits the API when the cache is stale AND more than
 * one currency is actually in play (matches the app's "only fetch when
 * conversion is needed" gate). Safe to call often — dedupes concurrent calls.
 */
export async function refreshRates(currencies: CurrencyCode[]): Promise<void> {
  const uniq = Array.from(new Set(currencies));
  if (uniq.length <= 1) return; // single currency — static/identity is enough
  if (isValid(loadCache())) return;
  if (refreshing) return refreshing;

  refreshing = (async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      let res: Response;
      try {
        res = await fetch(API_URL, { headers: { Accept: "application/json" }, signal: controller.signal });
      } finally {
        clearTimeout(timeout);
      }
      const data = await res.json();
      if (!res.ok || data.result === "error") return;
      const apiRates: Record<string, number> | undefined = data.conversion_rates || data.rates;
      if (!apiRates) return;
      saveCache({ USD: 1.0, ...apiRates });
    } catch {
      /* keep using static/cache */
    } finally {
      refreshing = null;
    }
  })();

  return refreshing;
}

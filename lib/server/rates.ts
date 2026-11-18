// Shared daily exchange rates for the mobile app (GET /api/public/rates).
//
// One upstream ExchangeRate-API call per UTC day serves every user, so the app no
// longer needs the Pro gate that existed only to cap per-device API usage.
//
// Failure policy (agreed 2026-11-18): retry the upstream a few times; if it still
// fails, serve YESTERDAY's rates — literally the stored rates for UTC date D-1,
// never an older day and never the static table. If yesterday is missing too, the
// route answers 503 and the app keeps whatever rates it already has.
import { adminDb } from "./firebaseAdmin";

export type RatesSource = "live" | "yesterday";

export interface DailyRates {
  /** UTC date (YYYY-MM-DD) the rates belong to. */
  date: string;
  /** Units of each currency per 1 USD. */
  rates: Record<string, number>;
  /** ISO time the upstream call that produced these rates finished. */
  fetchedAt: string;
}

export interface RatesStore {
  get(date: string): Promise<DailyRates | null>;
  /** Stores the day only if it is not stored yet. True = this call stored it. */
  create(rates: DailyRates): Promise<boolean>;
  /** True only for the first call with this key (used to send each alert once). */
  claimOnce(key: string): Promise<boolean>;
}

export type RatesEvent =
  | { type: "fetched"; rates: DailyRates; attempts: number }
  | { type: "fallback_yesterday"; date: string; attempts: number }
  | { type: "unavailable"; date: string; attempts: number };

export interface RatesDeps {
  store: RatesStore;
  fetchUpstream: () => Promise<Record<string, number>>;
  now?: () => Date;
  sleep?: (ms: number) => Promise<void>;
  /** Called once per event per day (see claimOnce). Errors are swallowed. */
  notify?: (event: RatesEvent) => Promise<void>;
}

/** Backoff before attempt 2 and 3. Total worst case ≈ 3 × timeout + 2 s. */
export const UPSTREAM_RETRY_DELAYS_MS = [500, 1500];
const UPSTREAM_TIMEOUT_MS = 5000;

export const utcDate = (d: Date) => d.toISOString().slice(0, 10);
export const previousUtcDate = (date: string) =>
  utcDate(new Date(Date.parse(`${date}T00:00:00Z`) - 24 * 60 * 60 * 1000));

/** A real payload lists ~160 currencies; a short one is a broken response. */
const MIN_RATE_COUNT = 50;
/** Major currencies do not move this much in one day: such a payload is a glitch. */
export const MAJOR_CURRENCIES = ["EUR", "GBP", "JPY", "CHF", "CNY", "CAD", "AUD"];
export const MAX_MAJOR_DAILY_CHANGE = 0.25;

function isValidRates(rates: unknown): rates is Record<string, number> {
  if (!rates || typeof rates !== "object") return false;
  const entries = Object.entries(rates as Record<string, unknown>);
  return (
    entries.length >= MIN_RATE_COUNT &&
    (rates as Record<string, unknown>).USD === 1 &&
    typeof (rates as Record<string, unknown>).EUR === "number" &&
    entries.every(([, v]) => typeof v === "number" && Number.isFinite(v) && v > 0)
  );
}

/**
 * Every app freezes the day's rates into the records saved that day, so one
 * glitched upstream value would stay in user data for good. Compare with the
 * previous stored day; the first major currency that moved more than
 * MAX_MAJOR_DAILY_CHANGE rejects the payload. Returns that currency, or null.
 */
export function implausibleCurrency(
  rates: Record<string, number>, reference: Record<string, number> | undefined
): string | null {
  if (!reference) return null;
  for (const c of MAJOR_CURRENCIES) {
    const a = reference[c];
    const b = rates[c];
    if (a && b && Math.abs(b / a - 1) > MAX_MAJOR_DAILY_CHANGE) return c;
  }
  return null;
}

async function fetchWithRetry(
  deps: RatesDeps, reference?: Record<string, number>
): Promise<{ rates: Record<string, number> | null; attempts: number }> {
  const sleep = deps.sleep ?? ((ms: number) => new Promise<void>(r => setTimeout(r, ms)));
  const attempts = UPSTREAM_RETRY_DELAYS_MS.length + 1;
  for (let attempt = 0; attempt < attempts; attempt++) {
    if (attempt > 0) await sleep(UPSTREAM_RETRY_DELAYS_MS[attempt - 1]);
    try {
      const rates = await deps.fetchUpstream();
      if (isValidRates(rates)) {
        const jumped = implausibleCurrency(rates, reference);
        if (!jumped) return { rates, attempts: attempt + 1 };
        console.warn(`[rates] upstream attempt ${attempt + 1}: ${jumped} moved more than ${MAX_MAJOR_DAILY_CHANGE * 100}% since yesterday, rejected`);
      } else {
        console.warn(`[rates] upstream attempt ${attempt + 1}: invalid payload`);
      }
    } catch (error) {
      console.warn(`[rates] upstream attempt ${attempt + 1} failed:`, (error as Error)?.message ?? error);
    }
  }
  return { rates: null, attempts };
}

async function safeNotify(deps: RatesDeps, event: RatesEvent): Promise<void> {
  if (!deps.notify) return;
  try {
    await deps.notify(event);
  } catch (error) {
    console.error("[rates] notify failed:", (error as Error)?.message ?? error);
  }
}

/**
 * Today's rates (stored, or fetched now and stored), else yesterday's stored
 * rates, else null.
 */
// One upstream run per day per server instance: concurrent requests before
// today's rates are stored share it instead of each calling the upstream.
const inflight = new Map<string, Promise<(DailyRates & { source: RatesSource }) | null>>();

export function getDailyRates(deps: RatesDeps): Promise<(DailyRates & { source: RatesSource }) | null> {
  const today = utcDate((deps.now ?? (() => new Date()))());
  const running = inflight.get(today);
  if (running) return running;
  const run = loadDailyRates(deps, today).finally(() => inflight.delete(today));
  inflight.set(today, run);
  return run;
}

async function loadDailyRates(deps: RatesDeps, today: string): Promise<(DailyRates & { source: RatesSource }) | null> {
  const stored = await deps.store.get(today);
  if (stored && isValidRates(stored.rates)) return { ...stored, source: "live" };

  const yesterday = await deps.store.get(previousUtcDate(today)).catch(() => null);
  const usable = !!yesterday && isValidRates(yesterday.rates);

  const { rates: fresh, attempts } = await fetchWithRetry(deps, usable ? yesterday!.rates : undefined);
  if (fresh) {
    const record: DailyRates = { date: today, rates: fresh, fetchedAt: new Date().toISOString() };
    let created = false;
    try {
      created = await deps.store.create(record);
    } catch (error) {
      // Serving the fresh rates matters more than storing them.
      console.error("[rates] could not store today's rates:", error);
    }
    if (!created) {
      // Another request stored today's rates first: serve those, so every
      // client gets the same numbers for the day, and don't notify twice.
      const winner = await deps.store.get(today).catch(() => null);
      if (winner && isValidRates(winner.rates)) return { ...winner, source: "live" };
      return { ...record, source: "live" };
    }
    await safeNotify(deps, { type: "fetched", rates: record, attempts });
    return { ...record, source: "live" };
  }

  const alertType = usable ? "fallback_yesterday" : "unavailable";
  if (await deps.store.claimOnce(`alert_${alertType}_${today}`).catch(() => false)) {
    await safeNotify(deps, { type: alertType, date: today, attempts });
  }
  if (usable) return { ...yesterday!, source: "yesterday" };
  return null;
}

// ── Production wiring ────────────────────────────────────────────────────────

const UPSTREAM_URL = () =>
  `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY || "973a758b48f94bf77bb6dc71"}/latest/USD`;

export async function fetchExchangeRateApi(): Promise<Record<string, number>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    const res = await fetch(UPSTREAM_URL(), { signal: controller.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { result?: string; conversion_rates?: Record<string, number> };
    if (data.result !== "success" || !data.conversion_rates) throw new Error(`result=${data.result}`);
    return { ...data.conversion_rates, USD: 1 };
  } finally {
    clearTimeout(timer);
  }
}

const ALREADY_EXISTS = 6; // gRPC code Firestore uses for create() on an existing doc

async function createIfAbsent(ref: FirebaseFirestore.DocumentReference, data: object): Promise<boolean> {
  try {
    await ref.create(data);
    return true;
  } catch (error) {
    if ((error as { code?: number })?.code === ALREADY_EXISTS) return false;
    throw error;
  }
}

export function firestoreRatesStore(): RatesStore {
  const col = () => adminDb().collection("exchangeRates");
  return {
    async get(date) {
      const snap = await col().doc(date).get();
      return snap.exists ? (snap.data() as DailyRates) : null;
    },
    create: (rates) => createIfAbsent(col().doc(rates.date), rates),
    claimOnce: (key) => createIfAbsent(adminDb().collection("exchangeRateAlerts").doc(key), { at: new Date().toISOString() }),
  };
}

/** Local `next dev` without FIREBASE_SERVICE_ACCOUNT: keep days in memory. */
const memory = new Map<string, DailyRates>();
const claimed = new Set<string>();
export const memoryRatesStore: RatesStore = {
  async get(date) {
    return memory.get(date) ?? null;
  },
  async create(rates) {
    if (memory.has(rates.date)) return false;
    memory.set(rates.date, rates);
    return true;
  },
  async claimOnce(key) {
    if (claimed.has(key)) return false;
    claimed.add(key);
    return true;
  },
};

// ── Telegram ─────────────────────────────────────────────────────────────────
// TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID (a group/channel or a private chat id).
// Missing env → no message, nothing fails.
const MENTION = "@andrey_germanov";
const KEY_CURRENCIES = ["EUR", "RON", "MDL", "UAH", "GBP"];

export function formatRatesMessage(event: RatesEvent): string {
  const tries = (n: number) => (n === 1 ? "с 1-й попытки" : `с ${n}-й попытки`);
  if (event.type === "fetched") {
    const r = event.rates.rates;
    const lines = KEY_CURRENCIES.filter(c => r[c]).map(c => `${c}: ${r[c]}`);
    return [
      `✅ Курс подтянулся успешно — ${event.rates.date} (UTC), ${tries(event.attempts)}.`,
      `Валют: ${Object.keys(r).length}. За 1 USD:`,
      ...lines,
      MENTION,
    ].join("\n");
  }
  if (event.type === "fallback_yesterday") {
    return [
      `⚠️ Курс за ${event.date} не получен (${event.attempts} попытки).`,
      `Приложение получает вчерашний курс. Проверьте ExchangeRate-API.`,
      MENTION,
    ].join("\n");
  }
  return [
    `🛑 Курс за ${event.date} не получен (${event.attempts} попытки), вчерашнего курса тоже нет.`,
    `Сервер отвечает 503, приложения используют свой кэш.`,
    MENTION,
  ].join("\n");
}

export async function notifyTelegram(event: RatesEvent): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    console.warn("[rates] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set — message skipped");
    return;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: formatRatesMessage(event), disable_web_page_preview: true }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Telegram HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  } finally {
    clearTimeout(timer);
  }
}

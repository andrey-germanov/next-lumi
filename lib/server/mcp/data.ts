// Read side of the MCP connector: loads a user's synced Lumi data with the
// Admin SDK and normalizes it into one flat shape the analytics can work on.
//
// Source of truth for the document shapes is the app's syncService mappers
// (money-tracker/src/services/syncService.ts) — Firestore Timestamps for every
// date, hard deletes (a deleted record is simply gone). Only Premium users
// sync, so this is only ever called for them.
import type { Firestore } from "firebase-admin/firestore";
import { adminDb } from "../firebaseAdmin";
import { EXCHANGE_RATE_API_URL, STATIC_EXCHANGE_RATES } from "@/lib/exchangeRate";

export interface Txn {
  id: string;
  kind: "expense" | "income";
  date: Date;
  title: string; // merchant (expense) / source (income)
  amount: number;
  currency: string;
  /** Amount in the user's main currency at entry time, as the app stored it. */
  converted?: { amount: number; currency: string };
  categoryId: string;
  categoryName: string;
  note?: string;
  tags?: string[];
  accountId?: string;
  /** Money moved into (expense) or out of (income) a savings goal — not spending/earning. */
  isSavingsMove: boolean;
  /** Generated from a recurring template (subscription, rent, salary…). */
  isRecurring: boolean;
  author?: string;
  city?: string;
}

export interface RecurringTemplate {
  id: string;
  kind: "expense" | "income";
  name: string;
  amount: number;
  currency: string;
  categoryName: string;
  frequency: "weekly" | "monthly" | "yearly";
  day: number;
  month?: number;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  currency: string;
  month?: number; // 0-11
  year?: number;
  isRecurring: boolean;
  recurringEndDate?: Date;
  createdAt: Date;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  deadline?: Date;
  isCompleted: boolean;
  priority?: string;
  contributions: { amount: number; date: Date }[];
}

export interface Account {
  id: string;
  name: string;
  currency: string;
  initialBalance: number;
  isArchived: boolean;
}

export interface Transfer {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  toAmount: number | undefined;
  date: Date;
}

export interface Category {
  id: string;
  name: string;
}

export interface UserData {
  txns: Txn[];
  recurring: RecurringTemplate[];
  budgets: Budget[];
  goals: SavingsGoal[];
  accounts: Account[];
  transfers: Transfer[];
  categories: Category[];
}

type Doc = Record<string, unknown>;

/** Timestamp | {seconds} | ISO string | millis → Date (mirrors the app's parseFirestoreDate). */
function toDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  const v = value as { toDate?: () => Date; seconds?: number; _seconds?: number };
  if (typeof v.toDate === "function") return v.toDate();
  if (typeof v.seconds === "number") return new Date(v.seconds * 1000);
  if (typeof v._seconds === "number") return new Date(v._seconds * 1000);
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}

const num = (v: unknown) => (typeof v === "number" && isFinite(v) ? v : 0);
const str = (v: unknown) => (typeof v === "string" ? v : undefined);
const cat = (v: unknown, fallback: string) => {
  const c = (v ?? {}) as Doc;
  return { id: str(c.id) ?? fallback, name: str(c.name) ?? str(c.id) ?? fallback };
};

function convertedOf(d: Doc): Txn["converted"] {
  const amount = num(d.convertedAmount);
  const currency = str(d.convertedCurrency);
  return amount > 0 && currency ? { amount, currency } : undefined;
}

function receiptToTxn(d: Doc): Txn | null {
  const date = toDate(d.date);
  if (!date) return null;
  const c = cat(d.category, "other");
  const items = Array.isArray(d.items) ? (d.items as Doc[]).map((i) => str(i.name)).filter(Boolean) : [];
  return {
    id: String(d.id),
    kind: "expense",
    date,
    title: str(d.merchant) || c.name,
    amount: num(d.total),
    currency: str(d.currency) || "USD",
    converted: convertedOf(d),
    categoryId: c.id,
    categoryName: c.name,
    note: items.length ? items.slice(0, 8).join(", ") : undefined,
    tags: Array.isArray(d.tags) && d.tags.length ? (d.tags as string[]) : undefined,
    accountId: str(d.accountId),
    isSavingsMove: !!d.savingsContributionId,
    isRecurring: !!d.recurringOccurrenceId,
    author: str(d.authorName),
    city: str((d.location as Doc | undefined)?.city),
  };
}

function incomeToTxn(d: Doc): Txn | null {
  const date = toDate(d.date);
  if (!date) return null;
  const c = cat(d.category, "other-income");
  return {
    id: String(d.id),
    kind: "income",
    date,
    title: str(d.source) || c.name,
    amount: num(d.amount),
    currency: str(d.currency) || "USD",
    converted: convertedOf(d),
    categoryId: c.id,
    categoryName: c.name,
    note: str(d.description),
    tags: Array.isArray(d.tags) && d.tags.length ? (d.tags as string[]) : undefined,
    accountId: str(d.accountId),
    isSavingsMove: !!d.savingsContributionId,
    isRecurring: !!d.recurring || !!d.recurringOccurrenceId,
    author: str(d.authorName),
    city: str((d.location as Doc | undefined)?.city),
  };
}

async function readAll(db: Firestore, uid: string, name: string): Promise<Doc[]> {
  const snap = await db.collection("users").doc(uid).collection(name).get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function load(uid: string): Promise<UserData> {
  const db = adminDb();
  const [receipts, incomes, templates, budgets, goals, accounts, transfers, categories] = await Promise.all(
    ["receipts", "incomes", "recurringTemplates", "budgets", "savingsGoals", "accounts", "transfers", "categories"].map(
      (name) => readAll(db, uid, name),
    ),
  );

  const txns = [...receipts.map(receiptToTxn), ...incomes.map(incomeToTxn)]
    .filter((t): t is Txn => t !== null)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return {
    txns,
    recurring: templates
      .filter((t) => t.isActive !== false)
      .map((t) => ({
        id: String(t.id),
        kind: t.kind === "income" ? "income" : "expense",
        name: str(t.name) ?? "",
        amount: num(t.amount),
        currency: str(t.currency) || "USD",
        categoryName: cat(t.category, "other").name,
        frequency: t.frequency === "weekly" || t.frequency === "yearly" ? t.frequency : "monthly",
        day: num(t.day) || 1,
        month: typeof t.month === "number" ? t.month : undefined,
      })),
    budgets: budgets.map((b) => ({
      id: String(b.id),
      categoryId: str(b.categoryId) ?? "",
      amount: num(b.amount),
      currency: str(b.currency) || "USD",
      month: typeof b.month === "number" ? b.month : undefined,
      year: typeof b.year === "number" ? b.year : undefined,
      isRecurring: !!b.isRecurring,
      recurringEndDate: toDate(b.recurringEndDate),
      createdAt: toDate(b.createdAt) ?? new Date(0),
    })),
    goals: goals.map((g) => ({
      id: String(g.id),
      name: str(g.name) ?? "",
      targetAmount: num(g.targetAmount),
      currentAmount: num(g.currentAmount),
      currency: str(g.currency) || "USD",
      deadline: toDate(g.deadline),
      isCompleted: !!g.isCompleted,
      priority: str(g.priority),
      contributions: (Array.isArray(g.contributions) ? (g.contributions as Doc[]) : [])
        .map((c) => ({ amount: num(c.amount), date: toDate(c.date) }))
        .filter((c): c is { amount: number; date: Date } => !!c.date),
    })),
    accounts: accounts.map((a) => ({
      id: String(a.id),
      name: str(a.name) ?? "",
      currency: str(a.currency) || "USD",
      initialBalance: num(a.initialBalance),
      isArchived: !!a.isArchived,
    })),
    transfers: transfers
      .map((t) => ({
        fromAccountId: str(t.fromAccountId) ?? "",
        toAccountId: str(t.toAccountId) ?? "",
        amount: num(t.amount),
        toAmount: typeof t.toAmount === "number" ? t.toAmount : undefined,
        date: toDate(t.date),
      }))
      .filter((t): t is Transfer => !!t.date),
    categories: categories.map((c) => ({ id: String(c.id), name: str(c.name) ?? String(c.id) })),
  };
}

// One conversation fires several tool calls in a row; a short per-instance
// cache keeps that from re-reading thousands of documents each time.
const CACHE_TTL_MS = 2 * 60_000;
const cache = new Map<string, { at: number; data: Promise<UserData> }>();

export function loadUserData(uid: string): Promise<UserData> {
  const hit = cache.get(uid);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.data;
  const data = load(uid);
  cache.set(uid, { at: Date.now(), data });
  data.catch(() => cache.delete(uid));
  return data;
}

// ── Currency ────────────────────────────────────────────────────────────────

let liveRates: { at: number; rates: Record<string, number> } | null = null;

/** Rates per 1 USD: live (12 h cache) with the app's static table as fallback. */
export async function getRates(): Promise<Record<string, number>> {
  if (liveRates && Date.now() - liveRates.at < 12 * 60 * 60_000) return liveRates.rates;
  try {
    const res = await fetch(EXCHANGE_RATE_API_URL, { signal: AbortSignal.timeout(5000), cache: "no-store" });
    const body = await res.json();
    const rates = body.conversion_rates ?? body.rates;
    if (res.ok && rates) {
      liveRates = { at: Date.now(), rates: { USD: 1, ...rates } };
      return liveRates.rates;
    }
  } catch {
    /* fall through to static */
  }
  return liveRates?.rates ?? STATIC_EXCHANGE_RATES;
}

export type Converter = (amount: number, from: string, to: string) => number;

export function makeConverter(rates: Record<string, number>): Converter {
  return (amount, from, to) => {
    if (from === to) return amount;
    const fromPerUSD = rates[from];
    const toPerUSD = rates[to];
    return fromPerUSD && toPerUSD ? (amount * toPerUSD) / fromPerUSD : amount;
  };
}

/**
 * The user's main currency. It isn't synced as a setting, but every record
 * carries `convertedCurrency` — the main currency at the time it was entered —
 * so the most frequent one among recent records is the current main currency.
 */
export function detectBaseCurrency(txns: Txn[]): string {
  const counts = new Map<string, number>();
  for (const t of txns.slice(0, 300)) {
    const c = t.converted?.currency ?? t.currency;
    counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  let best = "USD";
  let max = 0;
  for (const [c, n] of counts) if (n > max) [best, max] = [c, n];
  return best;
}

/** Amount of a transaction in `base`: the app's own conversion when it matches, live rates otherwise. */
export function amountIn(t: Txn, target: string, convert: Converter): number {
  if (t.currency === target) return t.amount;
  if (t.converted?.currency === target) return t.converted.amount;
  return convert(t.amount, t.currency, target);
}

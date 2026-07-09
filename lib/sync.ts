// ============================================================================
// Lumi web ⇄ Firestore sync — BACKWARD COMPATIBLE with the mobile app.
// ----------------------------------------------------------------------------
// The mobile app (src/services/syncService.ts) stores each entity as its own
// document inside per-user subcollections, with Firestore `Timestamp` values
// for every date and `serverTimestamp()` on `updatedAt`:
//
//   users/{uid}/receipts/{id}
//   users/{uid}/incomes/{id}
//   users/{uid}/budgets/{id}
//   users/{uid}/savingsGoals/{id}
//   users/{uid}/categories/{id}          (custom expense categories)
//
// The web client uses ISO-8601 strings (see types/web.ts), so we convert
// Timestamp ⇄ ISO on the boundary and write the exact same document shape the
// app writes — so both platforms interoperate on the same data.
// ============================================================================

import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { firebaseDb } from "./firebase";
import type { Receipt, Income, Budget, SavingsGoal, Category } from "@/types/web";

export type CollName = "receipts" | "incomes" | "budgets" | "savingsGoals" | "categories";

const coll = (uid: string, name: CollName) => collection(firebaseDb(), "users", uid, name);
const entryDoc = (uid: string, name: CollName, id: string) => doc(firebaseDb(), "users", uid, name, id);

// ── Date conversion ─────────────────────────────────────────────────────────

function tsFromISO(iso?: string): Timestamp | null {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : Timestamp.fromDate(d);
}

/** Firestore Timestamp | {seconds} | string | Date → ISO string. */
function isoFromTS(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  const v = value as { toDate?: () => Date; seconds?: number };
  if (typeof v.toDate === "function") return v.toDate().toISOString();
  if (typeof v.seconds === "number") return new Date(v.seconds * 1000).toISOString();
  return undefined;
}

const nowISO = () => new Date().toISOString();

/**
 * Strip `undefined` (Firestore rejects it) while preserving Timestamp /
 * FieldValue instances — those are not plain objects, so we never recurse into
 * or JSON-clone them. Mirrors the app's `removeUndefined`.
 */
function removeUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) return null as unknown as T;
  if (Array.isArray(obj)) return obj.map((x) => removeUndefined(x)) as unknown as T;
  if (typeof obj === "object" && (obj as object).constructor === Object) {
    const out: Record<string, unknown> = {};
    for (const k in obj as Record<string, unknown>) {
      const val = (obj as Record<string, unknown>)[k];
      if (val !== undefined) out[k] = removeUndefined(val);
    }
    return out as T;
  }
  return obj;
}

// ── Receipt ─────────────────────────────────────────────────────────────────

function receiptToDoc(r: Receipt) {
  return removeUndefined({
    id: r.id,
    date: tsFromISO(r.date),
    merchant: r.merchant,
    total: r.total,
    currency: r.currency || "USD",
    category: r.category,
    imageUri: r.imageUri,
    items: r.items ?? [],
    savingsGoalId: r.savingsGoalId,
    tags: r.tags,
    location: r.location,
    isImpulsive: r.isImpulsive,
    createdAt: tsFromISO(r.createdAt),
    updatedAt: serverTimestamp(),
  });
}

function receiptFromDoc(data: Record<string, unknown>): Receipt {
  return {
    id: String(data.id),
    date: isoFromTS(data.date) ?? nowISO(),
    merchant: (data.merchant as string) || "",
    total: (data.total as number) || 0,
    currency: (data.currency as Receipt["currency"]) || "USD",
    category: (data.category as Receipt["category"]) || { id: "other", name: "Other", icon: "📦", color: "#8E8E93" },
    imageUri: data.imageUri as string | undefined,
    items: (data.items as Receipt["items"]) || [],
    savingsGoalId: data.savingsGoalId as string | undefined,
    tags: data.tags as string[] | undefined,
    location: data.location as Receipt["location"],
    isImpulsive: (data.isImpulsive as boolean) ?? false,
    createdAt: isoFromTS(data.createdAt) ?? nowISO(),
    updatedAt: isoFromTS(data.updatedAt) ?? nowISO(),
  };
}

// ── Income ──────────────────────────────────────────────────────────────────

function incomeToDoc(i: Income) {
  return removeUndefined({
    id: i.id,
    source: i.source,
    amount: i.amount,
    date: tsFromISO(i.date),
    currency: i.currency || "USD",
    category: i.category,
    description: i.description,
    recurring: i.recurring || false,
    frequency: i.frequency,
    savingsGoalId: i.savingsGoalId,
    tags: i.tags,
    location: i.location,
    isImpulsive: i.isImpulsive,
    createdAt: tsFromISO(i.createdAt),
    updatedAt: serverTimestamp(),
  });
}

function incomeFromDoc(data: Record<string, unknown>): Income {
  return {
    id: String(data.id),
    source: (data.source as string) || "",
    amount: (data.amount as number) || 0,
    date: isoFromTS(data.date) ?? nowISO(),
    currency: (data.currency as Income["currency"]) || "USD",
    category: (data.category as Income["category"]) || { id: "other-income", name: "Other", icon: "💰", color: "#8E8E93" },
    description: data.description as string | undefined,
    recurring: (data.recurring as boolean) || false,
    frequency: data.frequency as Income["frequency"],
    savingsGoalId: data.savingsGoalId as string | undefined,
    tags: data.tags as string[] | undefined,
    location: data.location as Income["location"],
    isImpulsive: (data.isImpulsive as boolean) ?? false,
    createdAt: isoFromTS(data.createdAt) ?? nowISO(),
    updatedAt: isoFromTS(data.updatedAt) ?? nowISO(),
  };
}

// ── Budget ──────────────────────────────────────────────────────────────────

function budgetToDoc(b: Budget) {
  return removeUndefined({
    id: b.id,
    categoryId: b.categoryId,
    amount: b.amount,
    currency: b.currency || "USD",
    period: b.period,
    month: b.month,
    year: b.year,
    isRecurring: b.isRecurring || false,
    recurringEndDate: tsFromISO(b.recurringEndDate),
    createdAt: tsFromISO(b.createdAt),
    updatedAt: serverTimestamp(),
  });
}

function budgetFromDoc(data: Record<string, unknown>): Budget {
  return {
    id: String(data.id),
    categoryId: (data.categoryId as string) || "",
    amount: (data.amount as number) || 0,
    currency: (data.currency as Budget["currency"]) || "USD",
    period: (data.period as Budget["period"]) || "monthly",
    month: data.month as number | undefined,
    year: data.year as number | undefined,
    isRecurring: (data.isRecurring as boolean) || false,
    recurringEndDate: isoFromTS(data.recurringEndDate)?.slice(0, 10),
    createdAt: isoFromTS(data.createdAt) ?? nowISO(),
    updatedAt: isoFromTS(data.updatedAt) ?? nowISO(),
  };
}

// ── Savings goal ──────────────────────────────────────────────────────────────

function goalToDoc(g: SavingsGoal) {
  return removeUndefined({
    id: g.id,
    name: g.name,
    description: g.description,
    targetAmount: g.targetAmount,
    currentAmount: g.currentAmount,
    currency: g.currency,
    icon: g.icon,
    color: g.color,
    category: g.category,
    priority: g.priority,
    deadline: tsFromISO(g.deadline),
    contributions: (g.contributions ?? []).map((c) => ({
      ...c,
      date: tsFromISO(c.date),
    })),
    currentStreak: g.currentStreak || 0,
    longestStreak: g.longestStreak || 0,
    lastContributionDate: tsFromISO(g.lastContributionDate),
    milestonesReached: g.milestonesReached ?? [],
    isCompleted: g.isCompleted || false,
    completedAt: tsFromISO(g.completedAt),
    createdAt: tsFromISO(g.createdAt),
    updatedAt: serverTimestamp(),
  });
}

function goalFromDoc(data: Record<string, unknown>): SavingsGoal {
  const rawContribs = (data.contributions as Record<string, unknown>[]) || [];
  return {
    id: String(data.id),
    name: (data.name as string) || "",
    description: data.description as string | undefined,
    targetAmount: (data.targetAmount as number) || 0,
    currentAmount: (data.currentAmount as number) || 0,
    currency: (data.currency as SavingsGoal["currency"]) || "USD",
    icon: (data.icon as string) || "🎯",
    color: (data.color as string) || "#6C63FF",
    category: (data.category as SavingsGoal["category"]) || "custom",
    priority: (data.priority as SavingsGoal["priority"]) || "medium",
    deadline: isoFromTS(data.deadline)?.slice(0, 10),
    contributions: rawContribs.map((c) => ({
      id: String(c.id),
      goalId: String(c.goalId),
      type: (c.type as "deposit" | "withdrawal") || "deposit",
      amount: (c.amount as number) || 0,
      currency: (c.currency as SavingsGoal["currency"]) || "USD",
      date: isoFromTS(c.date) ?? nowISO(),
      note: c.note as string | undefined,
      convertedAmount: c.convertedAmount as number | undefined,
      conversionRate: c.conversionRate as number | undefined,
    })),
    currentStreak: (data.currentStreak as number) || 0,
    longestStreak: (data.longestStreak as number) || 0,
    lastContributionDate: isoFromTS(data.lastContributionDate),
    milestonesReached: (data.milestonesReached as number[]) || [],
    isCompleted: (data.isCompleted as boolean) || false,
    completedAt: isoFromTS(data.completedAt),
    createdAt: isoFromTS(data.createdAt) ?? nowISO(),
    updatedAt: isoFromTS(data.updatedAt) ?? nowISO(),
  };
}

// ── Custom category ─────────────────────────────────────────────────────────

function categoryToDoc(c: Category) {
  return {
    id: c.id,
    name: c.name,
    icon: c.icon,
    color: c.color,
    isCustom: true,
  };
}

function categoryFromDoc(data: Record<string, unknown>): Category {
  return {
    id: String(data.id),
    name: (data.name as string) || "",
    icon: (data.icon as string) || "📦",
    color: (data.color as string) || "#8E8E93",
    isCustom: true,
  };
}

// ── Public API: live subscriptions ──────────────────────────────────────────

function subscribe<T>(
  uid: string,
  name: CollName,
  fromDoc: (data: Record<string, unknown>) => T,
  cb: (items: T[]) => void,
): Unsubscribe {
  return onSnapshot(
    coll(uid, name),
    (snap) => {
      const items: T[] = [];
      snap.forEach((d) => items.push(fromDoc({ id: d.id, ...d.data() })));
      cb(items);
    },
    (err) => console.error(`[Lumi sync] ${name} listener error:`, err),
  );
}

export const subscribeReceipts = (uid: string, cb: (r: Receipt[]) => void) =>
  subscribe(uid, "receipts", receiptFromDoc, cb);
export const subscribeIncomes = (uid: string, cb: (i: Income[]) => void) =>
  subscribe(uid, "incomes", incomeFromDoc, cb);
export const subscribeBudgets = (uid: string, cb: (b: Budget[]) => void) =>
  subscribe(uid, "budgets", budgetFromDoc, cb);
export const subscribeGoals = (uid: string, cb: (g: SavingsGoal[]) => void) =>
  subscribe(uid, "savingsGoals", goalFromDoc, cb);
export const subscribeCategories = (uid: string, cb: (c: Category[]) => void) =>
  subscribe(uid, "categories", categoryFromDoc, cb);

// ── Public API: writes ──────────────────────────────────────────────────────

async function write(uid: string, name: CollName, id: string, data: object): Promise<void> {
  try {
    await setDoc(entryDoc(uid, name, id), data, { merge: true });
    console.info(`[Lumi sync] ✓ ${name}/${id} saved`);
  } catch (err) {
    console.error(`[Lumi sync] ✗ FAILED writing ${name}/${id}:`, err);
    throw err;
  }
}

export const upsertReceipt = (uid: string, r: Receipt) => write(uid, "receipts", r.id, receiptToDoc(r));
export const upsertIncome = (uid: string, i: Income) => write(uid, "incomes", i.id, incomeToDoc(i));
export const upsertBudget = (uid: string, b: Budget) => write(uid, "budgets", b.id, budgetToDoc(b));
export const upsertGoal = (uid: string, g: SavingsGoal) => write(uid, "savingsGoals", g.id, goalToDoc(g));
export const upsertCategory = (uid: string, c: Category) => write(uid, "categories", c.id, categoryToDoc(c));

export async function deleteEntry(uid: string, name: CollName, id: string): Promise<void> {
  try {
    await deleteDoc(entryDoc(uid, name, id));
    console.info(`[Lumi sync] ✓ ${name}/${id} deleted`);
  } catch (err) {
    console.error(`[Lumi sync] ✗ FAILED deleting ${name}/${id}:`, err);
    throw err;
  }
}

/** Delete every entity across all synced collections (affects all devices + the app). */
export async function clearAll(uid: string): Promise<void> {
  const names: CollName[] = ["receipts", "incomes", "budgets", "savingsGoals", "categories"];
  for (const name of names) {
    const snap = await getDocs(coll(uid, name));
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  }
}

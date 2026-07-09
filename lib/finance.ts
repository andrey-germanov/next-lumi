import type {
  Receipt,
  Income,
  Budget,
  BudgetProgress,
  UnifiedTransaction,
  CategorySpend,
  PeriodSummary,
  CurrencyCode,
} from "@/types/web";
import { convert } from "./exchangeRate";

// ── Date helpers ──────────────────────────────────────────────────────────

export function monthBounds(ref: Date = new Date()): { from: Date; to: Date } {
  const from = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const to = new Date(ref.getFullYear(), ref.getMonth() + 1, 0, 23, 59, 59, 999);
  return { from, to };
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function inRange(iso: string, from: Date, to: Date): boolean {
  const t = new Date(iso).getTime();
  return t >= from.getTime() && t <= to.getTime();
}

// ── Unified transactions (for lists) ──────────────────────────────────────

export function toUnified(receipts: Receipt[], incomes: Income[]): UnifiedTransaction[] {
  const expenses: UnifiedTransaction[] = receipts.map((r) => ({
    id: r.id,
    type: "expense",
    title: r.merchant || r.category.name,
    amount: r.total,
    currency: r.currency,
    date: r.date,
    categoryId: r.category.id,
    categoryName: r.category.name,
    categoryIcon: r.category.icon,
    categoryColor: r.category.color,
    tags: r.tags,
    imageUri: r.imageUri,
  }));
  const income: UnifiedTransaction[] = incomes.map((i) => ({
    id: i.id,
    type: "income",
    title: i.source,
    amount: i.amount,
    currency: i.currency,
    date: i.date,
    categoryId: i.category.id,
    categoryName: i.category.name,
    categoryIcon: i.category.icon,
    categoryColor: i.category.color,
    tags: i.tags,
    note: i.description,
  }));
  return [...expenses, ...income].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

// ── Period summary + category breakdown ────────────────────────────────────

export function getPeriodSummary(
  receipts: Receipt[],
  incomes: Income[],
  currency: CurrencyCode,
  ref: Date = new Date(),
): PeriodSummary {
  const { from, to } = monthBounds(ref);
  const monthReceipts = receipts.filter((r) => inRange(r.date, from, to));
  const monthIncomes = incomes.filter((i) => inRange(i.date, from, to));

  const rTotal = (r: Receipt) => convert(r.total, (r.currency || currency) as CurrencyCode, currency);
  const totalExpenses = monthReceipts.reduce((s, r) => s + rTotal(r), 0);
  const totalIncome = monthIncomes.reduce((s, i) => s + convert(i.amount, (i.currency || currency) as CurrencyCode, currency), 0);

  const byCategoryMap = new Map<string, CategorySpend>();
  for (const r of monthReceipts) {
    const amount = rTotal(r);
    const existing = byCategoryMap.get(r.category.id);
    if (existing) {
      existing.total += amount;
      existing.transactionCount += 1;
    } else {
      byCategoryMap.set(r.category.id, {
        categoryId: r.category.id,
        categoryName: r.category.name,
        categoryIcon: r.category.icon,
        categoryColor: r.category.color,
        total: amount,
        percentage: 0,
        transactionCount: 1,
      });
    }
  }
  const byCategory = [...byCategoryMap.values()]
    .map((c) => ({ ...c, percentage: totalExpenses > 0 ? (c.total / totalExpenses) * 100 : 0 }))
    .sort((a, b) => b.total - a.total);

  return {
    from: toISODate(from),
    to: toISODate(to),
    currency,
    totalIncome,
    totalExpenses,
    net: totalIncome - totalExpenses,
    byCategory,
  };
}

// ── Income breakdown by category (for donut / modal) ────────────────────────

export function getIncomeByCategory(
  incomes: Income[],
  currency: CurrencyCode,
  ref: Date = new Date(),
): CategorySpend[] {
  const { from, to } = monthBounds(ref);
  const monthIncomes = incomes.filter((i) => inRange(i.date, from, to));
  const total = monthIncomes.reduce((s, i) => s + convert(i.amount, (i.currency || currency) as CurrencyCode, currency), 0);

  const map = new Map<string, CategorySpend>();
  for (const i of monthIncomes) {
    const amount = convert(i.amount, (i.currency || currency) as CurrencyCode, currency);
    const existing = map.get(i.category.id);
    if (existing) {
      existing.total += amount;
      existing.transactionCount += 1;
    } else {
      map.set(i.category.id, {
        categoryId: i.category.id,
        categoryName: i.category.name,
        categoryIcon: i.category.icon,
        categoryColor: i.category.color,
        total: amount,
        percentage: 0,
        transactionCount: 1,
      });
    }
  }
  return [...map.values()]
    .map((c) => ({ ...c, percentage: total > 0 ? (c.total / total) * 100 : 0 }))
    .sort((a, b) => b.total - a.total);
}

// ── Budget progress ────────────────────────────────────────────────────────

export function getBudgetProgress(
  budget: Budget,
  receipts: Receipt[],
  ref: Date = new Date(),
): BudgetProgress {
  const { from, to } = monthBounds(ref);
  const target = (budget.currency || "USD") as CurrencyCode;
  const spent = receipts
    .filter((r) => r.category.id === budget.categoryId && inRange(r.date, from, to))
    .reduce((s, r) => s + convert(r.total, (r.currency || target) as CurrencyCode, target), 0);
  const remaining = budget.amount - spent;
  const percentUsed = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
  return { budget, spent, remaining, percentUsed, isExceeded: spent > budget.amount };
}

// The month forecast lives in `lib/currentMonthForecast.ts` — a faithful port
// of the mobile app's algorithm. Use `computeCurrentMonthForecast` from there.

// ── Monthly totals (for trend charts) ───────────────────────────────────────

export interface MonthTotals {
  date: Date; // any day within that month
  income: number;
  expenses: number; // pure spending (excludes savings deposits)
  savings: number; // deposits into savings goals
  net: number;
}

export function getMonthlyTotals(
  receipts: Receipt[],
  incomes: Income[],
  currency: CurrencyCode,
  monthsBack = 6,
  ref: Date = new Date(),
): MonthTotals[] {
  const conv = (amount: number, cur?: string) => convert(amount, (cur || currency) as CurrencyCode, currency);
  const out: MonthTotals[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1);
    const { from, to } = monthBounds(d);
    const monthR = receipts.filter((r) => inRange(r.date, from, to));
    const expenses = monthR.filter((r) => !r.savingsGoalId).reduce((s, r) => s + conv(r.total, r.currency), 0);
    const savings = monthR.filter((r) => !!r.savingsGoalId).reduce((s, r) => s + conv(r.total, r.currency), 0);
    const income = incomes
      .filter((x) => inRange(x.date, from, to))
      .reduce((s, x) => s + conv(x.amount, x.currency), 0);
    out.push({ date: d, income, expenses, savings, net: income - expenses });
  }
  return out;
}

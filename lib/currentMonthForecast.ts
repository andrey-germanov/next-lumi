// ============================================================================
// Current-month forecast — a faithful port of the mobile app's
// `src/services/currentMonthForecastService.ts` (computeCurrentMonthForecast).
//
// The algorithm is reproduced verbatim: savings deposits excluded, day-of-week
// weighted historical rate, outlier detection, pure current-month daily pace,
// σ·√daysLeft confidence interval, income-ratio status, category driver, and
// the per-day trajectory.
//
// The app converts foreign-currency items via an async FX service (and skips
// them for free users). The web client has no live FX, so conversion here is a
// same-currency passthrough — identical math for single-currency data, which is
// the normal case. Amounts already in the target currency match the app exactly.
// ============================================================================

import type { Receipt, Income, CurrencyCode } from "@/types/web";
import { convert } from "./exchangeRate";

export type ForecastStatus = "risk" | "onTrack" | "surplus";

export interface CategoryDriver {
  categoryId: string;
  categoryName: string;
  spentThisMonth: number;
  historicalAvg: number;
  delta: number;
}

export interface OutlierTransaction {
  receiptId: string;
  date: string;
  amount: number;
  categoryId: string;
  categoryName: string;
  merchant?: string;
}

export interface DailyPoint {
  day: number;
  actual: number | null;
  projected: number;
}

export interface CurrentMonthForecast {
  month: string;
  currency: CurrencyCode;
  spentSoFar: number;
  monthIncome: number;
  effectiveIncome: number;
  hasIncomeData: boolean;
  savedThisMonth: number;
  savingsRate: number;
  projectedTotalExpenses: number;
  projectedBalance: number;
  confidenceLow: number;
  confidenceHigh: number;
  confidence: number; // 0–1
  status: ForecastStatus;
  driver: CategoryDriver | null;
  outliers: OutlierTransaction[];
  outlierThreshold: number;
  dailyPoints: DailyPoint[];
  daysPassed: number;
  daysInMonth: number;
  asOfDate: string;
}

// ─── Internal helpers (mirror the app) ──────────────────────────────────────

function isoDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function sumConverted(items: { converted: number }[]): number {
  return items.reduce((s, r) => s + r.converted, 0);
}

function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

// Day-of-week spending weights (0=Sun … 6=Sat), sum ≈ 7.
const DOW_WEIGHT = [1.05, 0.85, 0.9, 0.95, 1.1, 1.25, 1.2];

function weightedDailyAverage(dailyTotals: Map<string, number>, days: string[]): number {
  if (days.length === 0) return 0;
  let weightedSum = 0;
  let totalWeight = 0;
  for (const day of days) {
    const amount = dailyTotals.get(day) ?? 0;
    const dow = new Date(day + "T12:00:00").getDay();
    const w = DOW_WEIGHT[dow];
    weightedSum += amount * w;
    totalWeight += w;
  }
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

// ─── Conversion (same-currency passthrough for the web) ─────────────────────

interface ConvertedEntry {
  id: string;
  date: Date;
  converted: number;
  categoryId: string;
  categoryName: string;
  merchant?: string;
}

function convertReceipts(receipts: Receipt[], target: CurrencyCode): ConvertedEntry[] {
  return receipts.map((r) => ({
    id: r.id,
    date: new Date(r.date),
    converted: convert(r.total ?? 0, (r.currency || target) as CurrencyCode, target),
    categoryId: r.category.id,
    categoryName: r.category.name,
    merchant: r.merchant,
  }));
}

function convertIncomes(incomes: Income[], target: CurrencyCode): { date: Date; converted: number }[] {
  return incomes
    .filter((i) => !i.savingsGoalId)
    .map((i) => ({ date: new Date(i.date), converted: convert(i.amount, (i.currency || target) as CurrencyCode, target) }));
}

// ─── Core computation (deterministic given same inputs) ─────────────────────

export function computeCurrentMonthForecast(
  receipts: Receipt[],
  incomes: Income[],
  currency: CurrencyCode,
  asOfDate: Date = new Date(),
): CurrentMonthForecast | null {
  const year = asOfDate.getFullYear();
  const month = asOfDate.getMonth();
  const daysPassed = asOfDate.getDate();
  const daysInMonth = getDaysInMonth(year, month);
  const daysLeft = daysInMonth - daysPassed;
  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const startOfMonth = new Date(year, month, 1);

  const realReceipts = receipts.filter((r) => !r.savingsGoalId);
  if (realReceipts.length === 0) return null;

  const converted = convertReceipts(realReceipts, currency);
  const convertedIncomes = convertIncomes(incomes, currency);

  // ── This month's receipts ──
  const thisMonthEntries = converted.filter((e) => e.date >= startOfMonth && e.date <= asOfDate);
  const spentSoFar = sumConverted(thisMonthEntries);

  // ── This month's income ──
  const monthIncome = convertedIncomes
    .filter((i) => i.date >= startOfMonth && i.date <= asOfDate)
    .reduce((s, i) => s + i.converted, 0);
  const effectiveIncome = monthIncome;

  // ── Savings deposits this month ──
  const savingsReceipts = receipts.filter((r) => !!r.savingsGoalId);
  const convertedSavings = convertReceipts(savingsReceipts, currency);
  const savedThisMonth = sumConverted(convertedSavings.filter((e) => e.date >= startOfMonth && e.date <= asOfDate));
  const savingsRate = effectiveIncome > 0 ? Math.round((savedThisMonth / effectiveIncome) * 100) : 0;

  // ── Daily totals map for the last 60 days (excluding current month) ──
  const sixtyDaysAgo = new Date(asOfDate);
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const historicalWindow = converted.filter((e) => e.date >= sixtyDaysAgo && e.date < startOfMonth);

  const dailyTotals = new Map<string, number>();
  for (const e of historicalWindow) {
    const key = isoDate(e.date);
    dailyTotals.set(key, (dailyTotals.get(key) ?? 0) + e.converted);
  }

  const historicalDays: string[] = [];
  for (let d = new Date(sixtyDaysAgo); d < startOfMonth; d.setDate(d.getDate() + 1)) {
    historicalDays.push(isoDate(new Date(d)));
  }

  const historicalDailyRate = weightedDailyAverage(dailyTotals, historicalDays);

  // ── Outlier detection ──
  const historicalNonzero = Array.from(dailyTotals.values()).filter((v) => v > 0).sort((a, b) => a - b);
  let outlierThreshold = 0;
  if (historicalNonzero.length >= 5) {
    const median = historicalNonzero[Math.floor(historicalNonzero.length / 2)];
    outlierThreshold = median * 3;
  } else if (historicalDailyRate > 0) {
    outlierThreshold = historicalDailyRate * 3;
  }

  const outliers: OutlierTransaction[] = [];
  let outliersSum = 0;
  if (outlierThreshold > 0) {
    for (const e of thisMonthEntries) {
      if (e.converted > outlierThreshold) {
        outliers.push({
          receiptId: e.id,
          date: isoDate(e.date),
          amount: Math.round(e.converted),
          categoryId: e.categoryId,
          categoryName: e.categoryName,
          merchant: e.merchant,
        });
        outliersSum += e.converted;
      }
    }
  }

  // Pure current-month daily pace (outliers removed).
  const normalSpentSoFar = spentSoFar - outliersSum;
  const currentDailyRate = daysPassed > 0 ? normalSpentSoFar / daysPassed : 0;
  const blendedRate = currentDailyRate;

  // ── Projected end-of-month figures ──
  const projectedRemainingExpenses = blendedRate * daysLeft;
  const projectedTotalExpenses = spentSoFar + projectedRemainingExpenses;
  const projectedBalance = effectiveIncome - projectedTotalExpenses - savedThisMonth;

  // ── Confidence interval (σ of daily totals × √daysLeft) ──
  const last30Days: string[] = [];
  const thirtyDaysAgo = new Date(asOfDate);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  for (let d = new Date(thirtyDaysAgo); d <= asOfDate; d.setDate(d.getDate() + 1)) {
    last30Days.push(isoDate(new Date(d)));
  }
  const dailyValues = last30Days.map((k) => dailyTotals.get(k) ?? 0);
  const sigma = stdDev(dailyValues);
  const confidenceDelta = sigma * Math.sqrt(Math.max(daysLeft, 1));

  const confidenceLow = projectedBalance - confidenceDelta;
  const confidenceHigh = projectedBalance + confidenceDelta;

  const dataMonths = Math.min(historicalDays.length / 30, 2);
  const dataCoverage = Math.min(daysPassed / 15, 1);
  const confidence = Math.round((0.4 * dataCoverage + (0.6 * dataMonths) / 2) * 100) / 100;

  // ── Status ──
  let status: ForecastStatus;
  if (effectiveIncome > 0) {
    const ratio = (projectedTotalExpenses + savedThisMonth) / effectiveIncome;
    status = ratio > 1 ? "risk" : ratio > 0.85 ? "onTrack" : "surplus";
  } else {
    const histAvgMonthly = historicalDailyRate * getDaysInMonth(year, month);
    if (histAvgMonthly > 0) {
      const ratio = projectedTotalExpenses / histAvgMonthly;
      status = ratio > 1.15 ? "risk" : ratio > 0.9 ? "onTrack" : "surplus";
    } else {
      status = "onTrack";
    }
  }

  // ── Category driver ──
  const catHistorical = new Map<string, { name: string; total: number; days: number }>();
  for (const e of historicalWindow) {
    const prev = catHistorical.get(e.categoryId) ?? { name: e.categoryName, total: 0, days: 0 };
    catHistorical.set(e.categoryId, { name: e.categoryName, total: prev.total + e.converted, days: prev.days });
  }

  const catThisMonth = new Map<string, { name: string; total: number }>();
  for (const e of thisMonthEntries) {
    const prev = catThisMonth.get(e.categoryId) ?? { name: e.categoryName, total: 0 };
    catThisMonth.set(e.categoryId, { name: e.categoryName, total: prev.total + e.converted });
  }

  let driver: CategoryDriver | null = null;
  let maxDelta = -Infinity;
  for (const [catId, { name, total }] of catThisMonth) {
    const histEntry = catHistorical.get(catId);
    const histAvg = histEntry ? (histEntry.total / Math.max(historicalDays.length, 1)) * daysPassed : 0;
    const delta = total - histAvg;
    if (delta > maxDelta) {
      maxDelta = delta;
      driver = { categoryId: catId, categoryName: name, spentThisMonth: total, historicalAvg: histAvg, delta };
    }
  }
  if (driver && driver.delta < projectedTotalExpenses * 0.05) {
    driver = null;
  }

  // ── Daily trajectory ──
  const cumByDay = new Map<number, number>();
  let cumulative = 0;
  for (let day = 1; day <= daysPassed; day++) {
    const dayKey = isoDate(new Date(year, month, day));
    const daySpend = thisMonthEntries.filter((e) => isoDate(e.date) === dayKey).reduce((s, e) => s + e.converted, 0);
    cumulative += daySpend;
    cumByDay.set(day, cumulative);
  }

  const dailyPoints: DailyPoint[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    if (day <= daysPassed) {
      const actual = cumByDay.get(day) ?? (day > 1 ? cumByDay.get(day - 1) ?? 0 : 0);
      dailyPoints.push({ day, actual, projected: actual });
    } else {
      const projCumulative = spentSoFar + blendedRate * (day - daysPassed);
      dailyPoints.push({ day, actual: null, projected: projCumulative });
    }
  }

  return {
    month: monthKey,
    currency,
    spentSoFar: Math.round(spentSoFar),
    monthIncome: Math.round(monthIncome),
    effectiveIncome: Math.round(effectiveIncome),
    hasIncomeData: effectiveIncome > 0,
    savedThisMonth: Math.round(savedThisMonth),
    savingsRate,
    projectedTotalExpenses: Math.round(projectedTotalExpenses),
    projectedBalance: Math.round(projectedBalance),
    confidenceLow: Math.round(confidenceLow),
    confidenceHigh: Math.round(confidenceHigh),
    confidence,
    status,
    driver,
    outliers,
    outlierThreshold: Math.round(outlierThreshold),
    dailyPoints,
    daysPassed,
    daysInMonth,
    asOfDate: isoDate(asOfDate),
  };
}

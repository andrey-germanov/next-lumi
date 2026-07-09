// ============================================================================
// AI insight — faithful port of the mobile app's AIInsightCard `computeCardData`
// (src/components/AIInsightCard.tsx). Same thresholds, same rule order, same
// title-priority tie-break. Amounts are converted to the target currency via
// the shared FX service and formatted like the app (withSeparator).
// ============================================================================

import type { Receipt, Income, CurrencyCode } from "@/types/web";
import { convert } from "./exchangeRate";
import { formatCurrency } from "@/utils/currencyUtils";

export interface InsightCard {
  titleKey: string;
  bodyKey: string;
  bodyParams: Record<string, string | number>;
  showCta: boolean;
  progress?: { current: number; total: number };
}

/** Resolve a category's display name (localized for defaults, raw for custom). */
export type CategoryNameResolver = (categoryId: string, fallbackName: string, isCustom: boolean) => string;

function getStreak(receipts: Receipt[]): number {
  if (receipts.length === 0) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = new Set(
    receipts.map((r) => {
      const d = new Date(r.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }),
  );
  let streak = 0;
  const check = new Date(today);
  while (days.has(check.getTime())) {
    streak++;
    check.setDate(check.getDate() - 1);
  }
  return streak;
}

const money = (amount: number, currency: CurrencyCode) => formatCurrency.withSeparator(amount, currency);
const toBase = (amount: number, from: CurrencyCode, to: CurrencyCode) => convert(amount, from, to);

function sumReceipts(receipts: Receipt[], target: CurrencyCode): number {
  return receipts.reduce((s, r) => s + toBase(r.total ?? 0, (r.currency || target) as CurrencyCode, target), 0);
}

function sumIncomes(incomes: Income[], target: CurrencyCode): number {
  return incomes.reduce((s, i) => s + toBase(i.amount, (i.currency || target) as CurrencyCode, target), 0);
}

function buildCategoryTotals(receipts: Receipt[], target: CurrencyCode, resolve: CategoryNameResolver): Record<string, { name: string; total: number }> {
  const totals: Record<string, { name: string; total: number }> = {};
  for (const r of receipts) {
    const catId = r.category.id;
    if (!totals[catId]) totals[catId] = { name: resolve(catId, r.category.name, !!r.category.isCustom), total: 0 };
    totals[catId].total += toBase(r.total ?? 0, (r.currency || target) as CurrencyCode, target);
  }
  return totals;
}

function buildMerchantTotals(receipts: Receipt[], target: CurrencyCode): Record<string, { name: string; total: number; count: number }> {
  const totals: Record<string, { name: string; total: number; count: number }> = {};
  for (const r of receipts) {
    if (!r.merchant) continue;
    const key = r.merchant.toLowerCase().trim();
    if (!totals[key]) totals[key] = { name: r.merchant, total: 0, count: 0 };
    totals[key].total += toBase(r.total ?? 0, (r.currency || target) as CurrencyCode, target);
    totals[key].count++;
  }
  return totals;
}

function findBiggestExpense(receipts: Receipt[], target: CurrencyCode): { receipt: Receipt; converted: number } | null {
  let best: { receipt: Receipt; converted: number } | null = null;
  for (const r of receipts) {
    const val = toBase(r.total ?? 0, (r.currency || target) as CurrencyCode, target);
    if (!best || val > best.converted) best = { receipt: r, converted: val };
  }
  return best;
}

export function computeInsight(
  receipts: Receipt[],
  incomes: Income[],
  currency: CurrencyCode,
  resolve: CategoryNameResolver,
): InsightCard | null {
  const realReceipts = receipts.filter((r) => !r.savingsGoalId);
  const realIncomes = incomes.filter((i) => !i.savingsGoalId);

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthSameDay = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), 23, 59, 59, 999);

  if (realReceipts.length < 3) {
    const streak = getStreak(realReceipts);
    if (realReceipts.length === 0)
      return { titleKey: "ai.bootstrapTitle", bodyKey: "ai.bootstrapZero", bodyParams: {}, showCta: false, progress: { current: 0, total: 3 } };
    return { titleKey: "ai.bootstrapTitle", bodyKey: streak >= 2 ? "ai.bootstrapFewStreak" : "ai.bootstrapFew", bodyParams: { remaining: 3 - realReceipts.length, days: streak }, showCta: false, progress: { current: realReceipts.length, total: 3 } };
  }

  const monthReceipts = realReceipts.filter((r) => new Date(r.date) >= thirtyDaysAgo);
  if (monthReceipts.length === 0) return null;
  if (monthReceipts.length < 3) return null;

  const monthTotal = sumReceipts(monthReceipts, currency);
  const calendarReceipts = realReceipts.filter((r) => new Date(r.date) >= startOfMonth);
  const calendarTotal = sumReceipts(calendarReceipts, currency);
  const monthIncome = sumIncomes(realIncomes.filter((i) => new Date(i.date) >= startOfMonth), currency);

  if (monthIncome > 0 && calendarTotal > 0) {
    const ratio = Math.round((calendarTotal / monthIncome) * 100);
    if (ratio >= 85) return { titleKey: "ai.headsUpTitle", bodyKey: "ai.incomeRatioHigh", bodyParams: { percentage: ratio }, showCta: true };
  }

  const impulsiveReceipts = calendarReceipts.filter((r) => r.isImpulsive);
  if (impulsiveReceipts.length >= 3 && calendarTotal > 0) {
    const impulsiveTotal = sumReceipts(impulsiveReceipts, currency);
    const impulsivePercent = Math.round((impulsiveTotal / calendarTotal) * 100);
    if (impulsivePercent >= 20) return { titleKey: "ai.headsUpTitle", bodyKey: "ai.impulseHigh", bodyParams: { count: impulsiveReceipts.length, amount: money(impulsiveTotal, currency), percentage: impulsivePercent }, showCta: true };
  }

  const pool: InsightCard[] = [];

  if (monthIncome > 0 && calendarTotal < monthIncome) {
    const savingsRate = Math.round(((monthIncome - calendarTotal) / monthIncome) * 100);
    if (savingsRate >= 20) pool.push({ titleKey: "ai.greatTitle", bodyKey: "ai.savingsRateHigh", bodyParams: { percentage: savingsRate }, showCta: false });
  }
  if (monthIncome > 0 && calendarTotal > 0) {
    const ratio = Math.round((calendarTotal / monthIncome) * 100);
    if (ratio <= 40) pool.push({ titleKey: "ai.noticeTitle", bodyKey: "ai.incomeRatioLow", bodyParams: { percentage: ratio }, showCta: true });
  }

  const lastMonthCalReceipts = realReceipts.filter((r) => {
    const d = new Date(r.date);
    return d >= startOfLastMonth && d <= lastMonthSameDay;
  });
  if (lastMonthCalReceipts.length >= 3 && calendarTotal > 0) {
    const lastMonthPace = sumReceipts(lastMonthCalReceipts, currency);
    if (lastMonthPace > 0) {
      const momPercent = Math.round(((calendarTotal - lastMonthPace) / lastMonthPace) * 100);
      if (momPercent >= 20) pool.push({ titleKey: "ai.headsUpTitle", bodyKey: "ai.momHigh", bodyParams: { percentage: momPercent }, showCta: true });
      else if (momPercent <= -15) pool.push({ titleKey: "ai.greatTitle", bodyKey: "ai.momLow", bodyParams: { percentage: Math.abs(momPercent) }, showCta: true });
    }
  }

  const categoryTotals = buildCategoryTotals(monthReceipts, currency, resolve);
  const topCatEntry = Object.values(categoryTotals).sort((a, b) => b.total - a.total)[0];
  if (topCatEntry && monthTotal > 0) {
    const pct = Math.round((topCatEntry.total / monthTotal) * 100);
    if (pct >= 30) pool.push({ titleKey: "ai.noticeTitle", bodyKey: "ai.topCategoryInsight", bodyParams: { percentage: pct, category: topCatEntry.name, amount: money(topCatEntry.total, currency) }, showCta: true });
  }

  if (lastMonthCalReceipts.length >= 3 && calendarReceipts.length >= 3) {
    const lastCalCatTotals = buildCategoryTotals(lastMonthCalReceipts, currency, resolve);
    const thisCalCatTotals = buildCategoryTotals(calendarReceipts, currency, resolve);
    let topGrowth: { name: string; pct: number } | null = null;
    for (const [catId, thisData] of Object.entries(thisCalCatTotals)) {
      const lastData = lastCalCatTotals[catId];
      if (lastData && lastData.total > 0 && calendarTotal > 0 && thisData.total >= calendarTotal * 0.1) {
        const growthPct = Math.round(((thisData.total - lastData.total) / lastData.total) * 100);
        if (growthPct >= 40 && (!topGrowth || growthPct > topGrowth.pct)) topGrowth = { name: thisData.name, pct: growthPct };
      }
    }
    if (topGrowth) pool.push({ titleKey: "ai.headsUpTitle", bodyKey: "ai.categoryGrowth", bodyParams: { category: topGrowth.name, percentage: topGrowth.pct }, showCta: true });
  }

  const thisWeekReceipts = realReceipts.filter((r) => new Date(r.date) >= sevenDaysAgo);
  const lastWeekReceipts = realReceipts.filter((r) => new Date(r.date) >= fourteenDaysAgo && new Date(r.date) < sevenDaysAgo);
  const thisWeekTotal = sumReceipts(thisWeekReceipts, currency);
  const lastWeekTotal = sumReceipts(lastWeekReceipts, currency);
  if (lastWeekTotal > 0 && thisWeekTotal > 0) {
    const diff = Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100);
    if (diff >= 30) pool.push({ titleKey: "ai.headsUpTitle", bodyKey: "ai.weeklySpike", bodyParams: { percentage: diff }, showCta: true });
    else if (diff <= -20) pool.push({ titleKey: "ai.greatTitle", bodyKey: "ai.weeklyDrop", bodyParams: { percentage: Math.abs(diff) }, showCta: true });
  }

  const merchantTotals = buildMerchantTotals(calendarReceipts, currency);
  const topMerchant = Object.values(merchantTotals).sort((a, b) => b.total - a.total)[0];
  if (topMerchant && calendarTotal > 0 && Math.round((topMerchant.total / calendarTotal) * 100) >= 20 && topMerchant.count >= 3)
    pool.push({ titleKey: "ai.noticeTitle", bodyKey: "ai.topMerchant", bodyParams: { merchant: topMerchant.name, count: topMerchant.count, amount: money(topMerchant.total, currency) }, showCta: false });

  if (monthReceipts.length >= 10 && monthTotal > 0) {
    let weekendTotal = 0;
    for (const r of monthReceipts) {
      const dow = new Date(r.date).getDay();
      if (dow === 0 || dow === 6) weekendTotal += toBase(r.total ?? 0, (r.currency || currency) as CurrencyCode, currency);
    }
    const weekendPct = Math.round((weekendTotal / monthTotal) * 100);
    if (weekendPct >= 50) pool.push({ titleKey: "ai.noticeTitle", bodyKey: "ai.weekendHigh", bodyParams: { percentage: weekendPct }, showCta: true });
  }

  const biggest = findBiggestExpense(monthReceipts, currency);
  if (biggest && biggest.converted > 0)
    pool.push({
      titleKey: "ai.noticeTitle",
      bodyKey: "ai.biggestExpense",
      bodyParams: {
        merchant: biggest.receipt.merchant || resolve(biggest.receipt.category.id, biggest.receipt.category.name, !!biggest.receipt.category.isCustom),
        amount: money(biggest.converted, currency),
      },
      showCta: true,
    });

  if (pool.length === 0) return null;

  const TITLE_PRIORITY: Record<string, number> = {
    "ai.headsUpTitle": 3,
    "ai.noticeTitle": 2,
    "ai.greatTitle": 1,
  };
  pool.sort((a, b) => {
    const pa = TITLE_PRIORITY[a.titleKey] ?? 0;
    const pb = TITLE_PRIORITY[b.titleKey] ?? 0;
    if (pa !== pb) return pb - pa;
    return ((b.bodyParams.percentage as number) ?? 0) - ((a.bodyParams.percentage as number) ?? 0);
  });
  return pool[0];
}

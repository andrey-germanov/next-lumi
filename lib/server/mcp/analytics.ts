// Aggregations behind the MCP tools. Everything is computed in one currency
// (the user's main currency unless the agent asks for another) and bucketed by
// calendar day/month in the user's timezone, so "October" means the same
// thing it does in the app.
//
// Definitions the agent is told about (see server instructions):
//   expenses     — receipts that are not savings-goal contributions
//   income       — incomes that are not savings-goal withdrawals
//   savedToGoals — net money moved into savings goals
//   net          — income − expenses (what was left, before goal transfers)
import {
  amountIn,
  detectBaseCurrency,
  getRates,
  loadUserData,
  makeConverter,
  type Budget,
  type Converter,
  type Txn,
  type UserData,
} from "./data";

export interface Ctx {
  data: UserData;
  base: string;
  tz: string;
  convert: Converter;
  /** Amount of a transaction in the base currency. */
  inBase: (t: Txn) => number;
  dayKey: (d: Date) => string; // YYYY-MM-DD in tz
  today: string;
}

export async function makeCtx(uid: string, currency?: string, timezone?: string): Promise<Ctx> {
  const tz = timezone || "UTC";
  let fmt: Intl.DateTimeFormat;
  try {
    fmt = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" });
  } catch {
    throw new Error(`Unknown timezone "${tz}". Use an IANA name like "Europe/Berlin".`);
  }
  const [data, rates] = await Promise.all([loadUserData(uid), getRates()]);
  const base = (currency || detectBaseCurrency(data.txns)).toUpperCase();
  if (!rates[base]) throw new Error(`Unsupported currency "${base}".`);
  const convert = makeConverter(rates);
  const dayKey = (d: Date) => fmt.format(d);
  return { data, base, tz, convert, inBase: (t) => amountIn(t, base, convert), dayKey, today: dayKey(new Date()) };
}

export const round = (n: number) => Math.round(n * 100) / 100;
const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 1000) / 10 : null);

export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return d.toISOString().slice(0, 7);
}

const daysInMonth = (month: string) => {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
};

/** Transactions whose local day falls in [from, to] (inclusive YYYY-MM-DD). */
export function inRange(ctx: Ctx, from: string, to: string): Txn[] {
  return ctx.data.txns.filter((t) => {
    const day = ctx.dayKey(t.date);
    return day >= from && day <= to;
  });
}

const isSpending = (t: Txn) => t.kind === "expense" && !t.isSavingsMove;
const isEarning = (t: Txn) => t.kind === "income" && !t.isSavingsMove;

export interface MonthRow {
  month: string;
  income: number;
  expenses: number;
  savedToGoals: number;
  net: number;
  savingsRatePct: number | null;
  transactions: number;
}

export function monthRows(ctx: Ctx, months: string[]): MonthRow[] {
  const rows = new Map(months.map((m) => [m, { income: 0, expenses: 0, savedToGoals: 0, transactions: 0 }]));
  for (const t of ctx.data.txns) {
    const row = rows.get(ctx.dayKey(t.date).slice(0, 7));
    if (!row) continue;
    const v = ctx.inBase(t);
    row.transactions++;
    if (isSpending(t)) row.expenses += v;
    else if (isEarning(t)) row.income += v;
    else if (t.kind === "expense") row.savedToGoals += v;
    else row.savedToGoals -= v;
  }
  return months.map((month) => {
    const r = rows.get(month)!;
    const net = r.income - r.expenses;
    return {
      month,
      income: round(r.income),
      expenses: round(r.expenses),
      savedToGoals: round(r.savedToGoals),
      net: round(net),
      savingsRatePct: pct(net, r.income),
      transactions: r.transactions,
    };
  });
}

export function averageRows(rows: MonthRow[]) {
  const n = rows.length || 1;
  const sum = (k: "income" | "expenses" | "savedToGoals" | "net") => rows.reduce((s, r) => s + r[k], 0);
  return {
    months: rows.length,
    income: round(sum("income") / n),
    expenses: round(sum("expenses") / n),
    savedToGoals: round(sum("savedToGoals") / n),
    net: round(sum("net") / n),
    savingsRatePct: pct(sum("net"), sum("income")),
  };
}

/** Last `count` complete months before the current one, oldest first. */
export function completeMonths(ctx: Ctx, count: number): string[] {
  const current = ctx.today.slice(0, 7);
  return Array.from({ length: count }, (_, i) => shiftMonth(current, i - count));
}

export function currentMonthToDate(ctx: Ctx) {
  const month = ctx.today.slice(0, 7);
  const [row] = monthRows(ctx, [month]);
  const elapsed = Number(ctx.today.slice(8, 10));
  const total = daysInMonth(month);
  return {
    ...row,
    daysElapsed: elapsed,
    daysInMonth: total,
    expensesPaceForFullMonth: round((row.expenses / elapsed) * total),
  };
}

interface Bucket {
  total: number;
  count: number;
  months: Set<string>;
  merchants: Map<string, number>;
}

/** Spending (or income) per category over [from, to], with top merchants and a month-over-month trend. */
export function categoryBreakdown(ctx: Ctx, from: string, to: string, kind: "expense" | "income" = "expense", topMerchants = 5) {
  const txns = inRange(ctx, from, to).filter(kind === "expense" ? isSpending : isEarning);
  const buckets = new Map<string, Bucket & { name: string }>();
  let grand = 0;
  for (const t of txns) {
    const v = ctx.inBase(t);
    grand += v;
    let b = buckets.get(t.categoryId);
    if (!b) {
      b = { name: t.categoryName, total: 0, count: 0, months: new Set(), merchants: new Map() };
      buckets.set(t.categoryId, b);
    }
    b.total += v;
    b.count++;
    b.months.add(ctx.dayKey(t.date).slice(0, 7));
    b.merchants.set(t.title, (b.merchants.get(t.title) ?? 0) + v);
  }
  const spanMonths = monthSpan(from, to);
  return {
    total: round(grand),
    categories: [...buckets.entries()]
      .sort((a, b) => b[1].total - a[1].total)
      .map(([id, b]) => ({
        categoryId: id,
        category: b.name,
        total: round(b.total),
        sharePct: pct(b.total, grand),
        transactions: b.count,
        avgPerMonth: round(b.total / spanMonths),
        avgTicket: round(b.total / b.count),
        topMerchants: [...b.merchants.entries()]
          .sort((x, y) => y[1] - x[1])
          .slice(0, topMerchants)
          .map(([name, total]) => ({ name, total: round(total) })),
      })),
  };
}

function monthSpan(from: string, to: string): number {
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  return Math.max(1, (ty - fy) * 12 + (tm - fm) + 1);
}

/** Per-category change: average of the last `window` complete months vs the `window` before. */
export function categoryTrends(ctx: Ctx, window = 3) {
  const months = completeMonths(ctx, window * 2);
  const recent = new Set(months.slice(window));
  const totals = new Map<string, { name: string; prev: number; recent: number }>();
  const all = new Set(months);
  for (const t of ctx.data.txns) {
    if (!isSpending(t)) continue;
    const m = ctx.dayKey(t.date).slice(0, 7);
    if (!all.has(m)) continue;
    const entry = totals.get(t.categoryId) ?? { name: t.categoryName, prev: 0, recent: 0 };
    if (recent.has(m)) entry.recent += ctx.inBase(t);
    else entry.prev += ctx.inBase(t);
    totals.set(t.categoryId, entry);
  }
  return [...totals.entries()]
    .map(([id, e]) => ({
      categoryId: id,
      category: e.name,
      avgPerMonthRecent: round(e.recent / window),
      avgPerMonthBefore: round(e.prev / window),
      changePct: e.prev > 0 ? Math.round(((e.recent - e.prev) / e.prev) * 1000) / 10 : null,
    }))
    .sort((a, b) => b.avgPerMonthRecent - a.avgPerMonthRecent);
}

export function topMerchants(ctx: Ctx, from: string, to: string, limit: number) {
  const map = new Map<string, { total: number; count: number; months: Set<string>; categories: Map<string, number> }>();
  for (const t of inRange(ctx, from, to)) {
    if (!isSpending(t)) continue;
    const key = t.title.trim();
    const e = map.get(key) ?? { total: 0, count: 0, months: new Set<string>(), categories: new Map() };
    e.total += ctx.inBase(t);
    e.count++;
    e.months.add(ctx.dayKey(t.date).slice(0, 7));
    e.categories.set(t.categoryName, (e.categories.get(t.categoryName) ?? 0) + 1);
    map.set(key, e);
  }
  const span = monthSpan(from, to);
  return [...map.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, limit)
    .map(([name, e]) => ({
      merchant: name,
      category: [...e.categories.entries()].sort((a, b) => b[1] - a[1])[0][0],
      total: round(e.total),
      transactions: e.count,
      avgTicket: round(e.total / e.count),
      avgPerMonth: round(e.total / span),
      activeMonths: e.months.size,
    }));
}

const monthlyFactor = { weekly: 52 / 12, monthly: 1, yearly: 1 / 12 } as const;

/** Recurring templates set up in the app + repeating charges detected from history (likely subscriptions). */
export function recurringCommitments(ctx: Ctx) {
  const templates = ctx.data.recurring.map((r) => ({
    name: r.name,
    kind: r.kind,
    category: r.categoryName,
    amount: r.amount,
    currency: r.currency,
    frequency: r.frequency,
    monthlyEquivalent: round(ctx.convert(r.amount, r.currency, ctx.base) * monthlyFactor[r.frequency]),
  }));
  templates.sort((a, b) => b.monthlyEquivalent - a.monthlyEquivalent);

  // Same merchant charged about once a month (≤2 times), similar amount (±15%),
  // in ≥3 of the last 6 complete months. Weekly groceries have a steady monthly
  // total too, so the per-month count is what separates a subscription.
  const months = new Set(completeMonths(ctx, 6));
  const known = new Set(ctx.data.recurring.map((r) => r.name.trim().toLowerCase()));
  const byMerchant = new Map<string, { name: string; category: string; perMonth: Map<string, number>; counts: Map<string, number> }>();
  for (const t of ctx.data.txns) {
    if (!isSpending(t) || t.isRecurring) continue;
    const m = ctx.dayKey(t.date).slice(0, 7);
    if (!months.has(m)) continue;
    const key = t.title.trim().toLowerCase();
    if (!key || known.has(key)) continue;
    const e = byMerchant.get(key) ?? { name: t.title.trim(), category: t.categoryName, perMonth: new Map(), counts: new Map() };
    e.perMonth.set(m, (e.perMonth.get(m) ?? 0) + ctx.inBase(t));
    e.counts.set(m, (e.counts.get(m) ?? 0) + 1);
    byMerchant.set(key, e);
  }
  const detected = [...byMerchant.values()]
    .filter((e) => {
      const values = [...e.perMonth.values()];
      if (values.length < 3 || [...e.counts.values()].some((n) => n > 2)) return false;
      const avg = values.reduce((s, v) => s + v, 0) / values.length;
      return values.every((v) => Math.abs(v - avg) <= avg * 0.15);
    })
    .map((e) => {
      const values = [...e.perMonth.values()];
      return {
        name: e.name,
        category: e.category,
        avgPerMonth: round(values.reduce((s, v) => s + v, 0) / values.length),
        monthsSeen: values.length,
      };
    })
    .sort((a, b) => b.avgPerMonth - a.avgPerMonth);

  const sumKind = (kind: "expense" | "income") =>
    round(templates.filter((t) => t.kind === kind).reduce((s, t) => s + t.monthlyEquivalent, 0));
  return {
    monthlyRecurringExpenses: sumKind("expense"),
    monthlyRecurringIncome: sumKind("income"),
    templates,
    detectedRepeatingCharges: detected,
  };
}

/**
 * Mirrors the app's budgetService.getBudgetsForMonth (month is 0-11), except a
 * recurring budget created mid-month already counts for that month — the app
 * starts it from the next one, which reads as "no budget" to an agent.
 */
function budgetApplies(b: Budget, year: number, month0: number, now: Date): boolean {
  const monthStart = new Date(Date.UTC(year, month0, 1));
  const monthEnd = new Date(Date.UTC(year, month0 + 1, 1) - 1);
  if (b.isRecurring) {
    if (b.recurringEndDate && b.recurringEndDate < monthStart) return false;
    return b.createdAt <= monthEnd;
  }
  if (b.month === undefined && b.year === undefined) {
    return monthStart >= new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  }
  return (b.month ?? now.getUTCMonth()) === month0 && (b.year ?? now.getUTCFullYear()) === year;
}

export function budgetsForMonth(ctx: Ctx, month: string) {
  const [y, m] = month.split("-").map(Number);
  const names = new Map<string, string>();
  for (const c of ctx.data.categories) names.set(c.id, c.name);
  const spent = new Map<string, number>(); // categoryId → in base
  for (const t of ctx.data.txns) {
    if (!isSpending(t) || ctx.dayKey(t.date).slice(0, 7) !== month) continue;
    names.set(t.categoryId, names.get(t.categoryId) ?? t.categoryName);
    spent.set(t.categoryId, (spent.get(t.categoryId) ?? 0) + ctx.inBase(t));
  }
  const isCurrent = month === ctx.today.slice(0, 7);
  const elapsedShare = isCurrent ? Number(ctx.today.slice(8, 10)) / daysInMonth(month) : 1;
  return ctx.data.budgets
    .filter((b) => budgetApplies(b, y, m - 1, new Date()))
    .map((b) => {
      const used = ctx.convert(spent.get(b.categoryId) ?? 0, ctx.base, b.currency);
      return {
        category: names.get(b.categoryId) ?? b.categoryId,
        limit: b.amount,
        currency: b.currency,
        spent: round(used),
        remaining: round(b.amount - used),
        usedPct: pct(used, b.amount),
        monthElapsedPct: Math.round(elapsedShare * 1000) / 10,
        recurring: b.isRecurring,
      };
    })
    .sort((a, b) => (b.usedPct ?? 0) - (a.usedPct ?? 0));
}

export function savingsGoals(ctx: Ctx) {
  const now = new Date();
  const recentMonths = new Set(completeMonths(ctx, 3));
  return ctx.data.goals.map((g) => {
    const remaining = Math.max(0, g.targetAmount - g.currentAmount);
    const monthsLeft = g.deadline
      ? Math.max(1, Math.ceil((g.deadline.getTime() - now.getTime()) / (30.44 * 24 * 60 * 60_000)))
      : null;
    const recent = g.contributions
      .filter((c) => recentMonths.has(ctx.dayKey(c.date).slice(0, 7)))
      .reduce((s, c) => s + c.amount, 0);
    return {
      name: g.name,
      currency: g.currency,
      target: g.targetAmount,
      saved: g.currentAmount,
      remaining: round(remaining),
      progressPct: pct(g.currentAmount, g.targetAmount),
      completed: g.isCompleted,
      priority: g.priority,
      deadline: g.deadline ? ctx.dayKey(g.deadline) : null,
      neededPerMonthToHitDeadline: monthsLeft && !g.isCompleted ? round(remaining / monthsLeft) : null,
      avgContributedPerMonthLast3: round(recent / 3),
    };
  });
}

/** Per-account balance in the account's own currency, the way the app computes it. */
export function accountBalances(ctx: Ctx) {
  const { accounts, transfers, txns } = ctx.data;
  return accounts.map((a) => {
    let balance = a.initialBalance;
    for (const t of txns) {
      if (t.accountId !== a.id) continue;
      const v = amountIn(t, a.currency, ctx.convert);
      balance += t.kind === "income" ? v : -v;
    }
    for (const tr of transfers) {
      if (tr.fromAccountId === a.id) balance -= tr.amount;
      if (tr.toAccountId === a.id) balance += tr.toAmount ?? tr.amount;
    }
    return {
      account: a.name,
      currency: a.currency,
      balance: round(balance),
      balanceInBase: round(ctx.convert(balance, a.currency, ctx.base)),
      archived: a.isArchived,
    };
  });
}

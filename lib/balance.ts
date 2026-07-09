// ============================================================================
// Balance — port of the app's `multiCurrencyBalanceService`
// (calculateBalanceInCurrency). ALL-TIME income − expenses across every
// receipt/income, grouped by currency then converted to the target currency.
// Note: like the app, savings-deposit receipts/incomes are NOT excluded here —
// they count toward the running balance.
// ============================================================================

import type { Receipt, Income, CurrencyCode } from "@/types/web";
import { convert } from "./exchangeRate";

export interface CurrencyBalance {
  currency: CurrencyCode;
  balance: number;
  expenses: number;
  income: number;
}

function groupByCurrency<T>(items: T[], amountOf: (x: T) => number, currencyOf: (x: T) => string): Map<CurrencyCode, number> {
  const map = new Map<CurrencyCode, number>();
  for (const item of items) {
    const cur = (currencyOf(item) || "USD") as CurrencyCode;
    map.set(cur, (map.get(cur) || 0) + amountOf(item));
  }
  return map;
}

export function calculateBalance(receipts: Receipt[], incomes: Income[], target: CurrencyCode): CurrencyBalance {
  const expensesByCurrency = groupByCurrency(receipts, (r) => r.total, (r) => r.currency ?? "USD");
  const incomeByCurrency = groupByCurrency(incomes, (i) => i.amount, (i) => i.currency ?? "USD");

  let totalExpenses = 0;
  for (const [currency, amount] of expensesByCurrency.entries()) {
    totalExpenses += currency === target ? amount : convert(amount, currency, target);
  }

  let totalIncome = 0;
  for (const [currency, amount] of incomeByCurrency.entries()) {
    totalIncome += currency === target ? amount : convert(amount, currency, target);
  }

  return {
    currency: target,
    balance: totalIncome - totalExpenses,
    expenses: totalExpenses,
    income: totalIncome,
  };
}

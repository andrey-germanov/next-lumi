// Shared-expense math. Pure and deterministic, so every phone and the live
// web page (next-lumi/lib/groupMath.ts is a byte-for-byte copy — keep them in
// sync) arrive at exactly the same balances and "who pays whom".
//
// All money is integer minor units (cents; yen have none, dinars have three),
// so a split never loses or invents a cent: leftover units go to the members
// with the largest fractional remainder, ties broken by member order.

export type ExpenseKind = 'expense' | 'refund' | 'settlement';
export type SplitMode = 'equal' | 'exact' | 'shares';

export interface ExpenseLike {
  kind: ExpenseKind;
  amountMinor: number;
  currency: string;
  rateToBase: number;
  paidBy: string;
  splits: Record<string, number>;
  deletedAt?: number | null;
}

export interface SettleTransfer {
  from: string;
  to: string;
  amountMinor: number;
}

const ZERO_DECIMAL = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'ISK', 'JPY', 'KMF', 'KRW', 'PYG', 'RWF', 'UGX', 'UYI', 'VND', 'VUV', 'XAF', 'XOF', 'XPF',
]);
const THREE_DECIMAL = new Set(['BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND']);

export const minorDigits = (currency: string): number =>
  ZERO_DECIMAL.has(currency) ? 0 : THREE_DECIMAL.has(currency) ? 3 : 2;

export const toMinor = (amount: number, currency: string): number =>
  Math.round(amount * 10 ** minorDigits(currency));

export const fromMinor = (minor: number, currency: string): number =>
  minor / 10 ** minorDigits(currency);

/** Split a non-negative integer total into integer parts proportional to weights. */
export function allocate(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + Math.max(0, b), 0);
  if (total <= 0 || sum <= 0) return weights.map(() => 0);
  const raw = weights.map(w => (total * Math.max(0, w)) / sum);
  const parts = raw.map(Math.floor);
  let remainder = total - parts.reduce((a, b) => a + b, 0);
  const order = raw
    .map((value, index) => ({ index, frac: value - Math.floor(value) }))
    .filter(({ index }) => weights[index] > 0)
    .sort((a, b) => b.frac - a.frac || a.index - b.index);
  for (let k = 0; remainder > 0 && order.length > 0; k++, remainder--) {
    parts[order[k % order.length].index] += 1;
  }
  return parts;
}

/**
 * Turn what the user entered into final per-member amounts (expense currency,
 * minor units). Returns null when the input can't produce a valid split
 * (nobody selected, or exact amounts that don't add up to the total).
 */
export function computeSplits(
  mode: SplitMode,
  input: Record<string, number>,
  amountMinor: number,
  memberOrder: string[],
): Record<string, number> | null {
  const ids = memberOrder.filter(id => (input[id] ?? 0) > 0);
  if (ids.length === 0 || amountMinor <= 0) return null;
  if (mode === 'exact') {
    const values = ids.map(id => Math.round(input[id]));
    if (values.reduce((a, b) => a + b, 0) !== amountMinor) return null;
    return Object.fromEntries(ids.map((id, i) => [id, values[i]]));
  }
  const parts = allocate(amountMinor, ids.map(id => (mode === 'equal' ? 1 : input[id])));
  return Object.fromEntries(ids.map((id, i) => [id, parts[i]]));
}

export function convertMinor(minor: number, from: string, to: string, rate: number): number {
  if (from === to) return minor;
  return Math.round(fromMinor(minor, from) * rate * 10 ** minorDigits(to));
}

/** Expense total and splits in the group's base currency; splits always sum to the total. */
export function expenseInBase(
  expense: ExpenseLike,
  baseCurrency: string,
  memberOrder: string[],
): { total: number; splits: Record<string, number> } {
  const total = convertMinor(expense.amountMinor, expense.currency, baseCurrency, expense.rateToBase);
  const ids = [
    ...memberOrder.filter(id => expense.splits[id] != null),
    ...Object.keys(expense.splits).filter(id => !memberOrder.includes(id)).sort(),
  ];
  if (expense.currency === baseCurrency) {
    return { total, splits: Object.fromEntries(ids.map(id => [id, expense.splits[id]])) };
  }
  const parts = allocate(total, ids.map(id => expense.splits[id]));
  return { total, splits: Object.fromEntries(ids.map((id, i) => [id, parts[i]])) };
}

/**
 * Net balance per member in base minor units. Positive = the group owes them,
 * negative = they owe the group. Always sums to exactly 0.
 *   expense:    payer +total, each split member −share
 *   refund:     money came back to the payer → the reverse
 *   settlement: debtor (paidBy) +amount, receiver (the single split) −amount
 */
export function computeBalances(
  expenses: ExpenseLike[],
  baseCurrency: string,
  memberOrder: string[],
): Record<string, number> {
  const balances: Record<string, number> = {};
  memberOrder.forEach(id => { balances[id] = 0; });
  const add = (id: string, value: number) => { balances[id] = (balances[id] ?? 0) + value; };
  for (const expense of expenses) {
    if (expense.deletedAt) continue;
    const { total, splits } = expenseInBase(expense, baseCurrency, memberOrder);
    const sign = expense.kind === 'refund' ? -1 : 1;
    add(expense.paidBy, sign * total);
    for (const [id, share] of Object.entries(splits)) add(id, -sign * share);
  }
  return balances;
}

/** Minimum set of payments that zeroes every balance (greedy, deterministic). */
export function simplifyDebts(balances: Record<string, number>, memberOrder: string[]): SettleTransfer[] {
  const rank = (id: string) => {
    const i = memberOrder.indexOf(id);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  const creditors = Object.entries(balances)
    .filter(([, v]) => v > 0)
    .map(([id, v]) => ({ id, left: v }))
    .sort((a, b) => b.left - a.left || rank(a.id) - rank(b.id));
  const debtors = Object.entries(balances)
    .filter(([, v]) => v < 0)
    .map(([id, v]) => ({ id, left: -v }))
    .sort((a, b) => b.left - a.left || rank(a.id) - rank(b.id));

  const transfers: SettleTransfer[] = [];
  let c = 0;
  let d = 0;
  while (c < creditors.length && d < debtors.length) {
    const amount = Math.min(creditors[c].left, debtors[d].left);
    if (amount > 0) transfers.push({ from: debtors[d].id, to: creditors[c].id, amountMinor: amount });
    creditors[c].left -= amount;
    debtors[d].left -= amount;
    if (creditors[c].left === 0) c++;
    if (debtors[d].left === 0) d++;
  }
  return transfers;
}

/** Who owes whom without re-routing — only between people who actually shared costs. */
export function pairwiseDebts(expenses: ExpenseLike[], baseCurrency: string, memberOrder: string[]): SettleTransfer[] {
  const owed = new Map<string, number>(); // "a|b" → a owes b
  const addDebt = (a: string, b: string, value: number) => {
    if (a === b || value <= 0) return;
    const reverseKey = `${b}|${a}`;
    const reverse = owed.get(reverseKey) ?? 0;
    const offset = Math.min(reverse, value);
    if (offset > 0) owed.set(reverseKey, reverse - offset);
    const rest = value - offset;
    if (rest > 0) owed.set(`${a}|${b}`, (owed.get(`${a}|${b}`) ?? 0) + rest);
  };
  for (const expense of expenses) {
    if (expense.deletedAt) continue;
    const { splits } = expenseInBase(expense, baseCurrency, memberOrder);
    for (const [id, share] of Object.entries(splits)) {
      if (expense.kind === 'refund') addDebt(expense.paidBy, id, share);
      else addDebt(id, expense.paidBy, share); // expense: member owes payer; settlement: receiver "owes back"
    }
  }
  const rank = (id: string) => memberOrder.indexOf(id);
  return Array.from(owed.entries())
    .filter(([, v]) => v > 0)
    .map(([key, amountMinor]) => {
      const [from, to] = key.split('|');
      return { from, to, amountMinor };
    })
    .sort((a, b) => rank(a.from) - rank(b.from) || rank(a.to) - rank(b.to));
}

export function settleUp(
  expenses: ExpenseLike[],
  baseCurrency: string,
  memberOrder: string[],
  simplify: boolean,
): SettleTransfer[] {
  return simplify
    ? simplifyDebts(computeBalances(expenses, baseCurrency, memberOrder), memberOrder)
    : pairwiseDebts(expenses, baseCurrency, memberOrder);
}

/** What the group actually spent (expenses minus refunds), base minor units. */
export function totalSpent(expenses: ExpenseLike[], baseCurrency: string, memberOrder: string[]): number {
  return expenses.reduce((sum, expense) => {
    if (expense.deletedAt || expense.kind === 'settlement') return sum;
    const { total } = expenseInBase(expense, baseCurrency, memberOrder);
    return sum + (expense.kind === 'refund' ? -total : total);
  }, 0);
}

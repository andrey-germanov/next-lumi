"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import type {
  Receipt,
  Income,
  Budget,
  SavingsGoal,
  SavingsContribution,
  Category,
  IncomeCategory,
  CurrencySettings,
  BudgetPeriod,
  SavingsGoalCategory,
  SavingsGoalPriority,
} from "@/types/web";
import type { CurrencyCode } from "@/utils/currencyUtils";
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from "@/lib/categories";
import { refreshRates } from "@/lib/exchangeRate";
import {
  subscribeReceipts,
  subscribeIncomes,
  subscribeBudgets,
  subscribeGoals,
  subscribeCategories,
  upsertReceipt,
  upsertIncome,
  upsertBudget,
  upsertGoal,
  upsertCategory,
  deleteEntry,
  clearAll,
} from "@/lib/sync";

const CURRENCY_KEY = "lumi-currency-pref";

function uid(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

const nowISO = () => new Date().toISOString();

function loadCurrencyPref(): CurrencySettings {
  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(CURRENCY_KEY);
      if (raw) return JSON.parse(raw) as CurrencySettings;
    } catch {
      /* ignore */
    }
  }
  return { primary: "USD", secondary: ["EUR"] };
}

// ── Context shape ────────────────────────────────────────────────────────────

interface StoreValue {
  receipts: Receipt[];
  incomes: Income[];
  budgets: Budget[];
  goals: SavingsGoal[];
  expenseCategories: Category[];
  incomeCategories: IncomeCategory[];
  currency: CurrencySettings;

  addExpense: (input: { merchant: string; total: number; categoryId: string; date: string; currency: CurrencyCode; note?: string }) => void;
  addIncome: (input: { source: string; amount: number; categoryId: string; date: string; currency: CurrencyCode; description?: string }) => void;
  addBudget: (input: { categoryId: string; amount: number; period: BudgetPeriod; currency: CurrencyCode }) => void;
  updateBudget: (id: string, patch: { amount: number; period: BudgetPeriod }) => void;
  deleteBudget: (id: string) => void;
  addGoal: (input: { name: string; targetAmount: number; currentAmount: number; category: SavingsGoalCategory; priority: SavingsGoalPriority; deadline?: string; currency: CurrencyCode; icon: string; color: string }) => void;
  updateGoal: (id: string, patch: { name: string; targetAmount: number; priority: SavingsGoalPriority; deadline?: string }) => void;
  deleteGoal: (id: string) => void;
  contributeToGoal: (goalId: string, amount: number) => void;
  addExpenseCategory: (input: { name: string; icon: string; color: string }) => void;
  deleteExpenseCategory: (id: string) => void;
  setPrimaryCurrency: (code: CurrencyCode) => void;
  toggleSecondaryCurrency: (code: CurrencyCode) => void;
  reset: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const MILESTONES = [25, 50, 75, 100];

export function StoreProvider({ uid: userId, children }: { uid: string; children: React.ReactNode }) {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [customCategories, setCustomCategories] = useState<Category[]>([]);
  const [currency, setCurrency] = useState<CurrencySettings>(loadCurrencyPref);
  const [ready, setReady] = useState(false);

  // Live Firestore subscriptions — same documents the mobile app reads/writes.
  useEffect(() => {
    const unsubs = [
      subscribeReceipts(userId, (r) => {
        setReceipts(r);
        setReady(true); // first snapshot (even empty) means we're synced
      }),
      subscribeIncomes(userId, setIncomes),
      subscribeBudgets(userId, setBudgets),
      subscribeGoals(userId, setGoals),
      subscribeCategories(userId, setCustomCategories),
    ];
    return () => unsubs.forEach((u) => u());
  }, [userId]);

  // Keep FX rates fresh for the user's currencies (no-op for single currency).
  useEffect(() => {
    const codes = [currency.primary, ...currency.secondary];
    const dataCodes = [...receipts, ...incomes].map((x) => x.currency).filter(Boolean) as CurrencyCode[];
    refreshRates([...codes, ...dataCodes]);
  }, [currency.primary, currency.secondary, receipts, incomes]);

  const expenseCategories = useMemo<Category[]>(
    () => [...DEFAULT_EXPENSE_CATEGORIES, ...customCategories],
    [customCategories],
  );
  const incomeCategories = DEFAULT_INCOME_CATEGORIES;

  const findExpenseCat = useCallback(
    (id: string) => expenseCategories.find((c) => c.id === id) ?? expenseCategories[0],
    [expenseCategories],
  );

  // ── Mutators (write straight to Firestore; UI updates via subscriptions) ──

  const addExpense = useCallback<StoreValue["addExpense"]>((input) => {
    const category = findExpenseCat(input.categoryId);
    const receipt: Receipt = {
      id: uid(),
      date: input.date,
      merchant: input.merchant,
      total: input.total,
      currency: input.currency,
      category,
      items: [],
      tags: input.note ? [input.note] : undefined,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    upsertReceipt(userId, receipt).catch(() => {});
  }, [userId, findExpenseCat]);

  const addIncome = useCallback<StoreValue["addIncome"]>((input) => {
    const category = incomeCategories.find((c) => c.id === input.categoryId) ?? incomeCategories[0];
    const income: Income = {
      id: uid(),
      source: input.source,
      amount: input.amount,
      date: input.date,
      currency: input.currency,
      category,
      description: input.description,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    upsertIncome(userId, income).catch(() => {});
  }, [userId, incomeCategories]);

  const addBudget = useCallback<StoreValue["addBudget"]>((input) => {
    const now = nowISO();
    const budget: Budget = {
      id: uid(),
      categoryId: input.categoryId,
      amount: input.amount,
      currency: input.currency,
      period: input.period,
      isRecurring: input.period === "monthly",
      createdAt: now,
      updatedAt: now,
    };
    upsertBudget(userId, budget).catch(() => {});
  }, [userId]);

  const updateBudget = useCallback<StoreValue["updateBudget"]>((id, patch) => {
    const existing = budgets.find((b) => b.id === id);
    if (!existing) return;
    upsertBudget(userId, {
      ...existing,
      amount: patch.amount,
      period: patch.period,
      isRecurring: patch.period === "monthly",
      updatedAt: nowISO(),
    }).catch(() => {});
  }, [userId, budgets]);

  const deleteBudget = useCallback<StoreValue["deleteBudget"]>((id) => {
    deleteEntry(userId, "budgets", id).catch(() => {});
  }, [userId]);

  const addGoal = useCallback<StoreValue["addGoal"]>((input) => {
    const now = nowISO();
    const goal: SavingsGoal = {
      id: uid(),
      name: input.name,
      targetAmount: input.targetAmount,
      currentAmount: input.currentAmount,
      currency: input.currency,
      icon: input.icon,
      color: input.color,
      category: input.category,
      priority: input.priority,
      deadline: input.deadline,
      contributions: [],
      currentStreak: 0,
      longestStreak: 0,
      milestonesReached: MILESTONES.filter((m) => input.targetAmount > 0 && (input.currentAmount / input.targetAmount) * 100 >= m),
      isCompleted: input.currentAmount >= input.targetAmount,
      createdAt: now,
      updatedAt: now,
    };
    upsertGoal(userId, goal).catch(() => {});
  }, [userId]);

  const updateGoal = useCallback<StoreValue["updateGoal"]>((id, patch) => {
    const g = goals.find((x) => x.id === id);
    if (!g) return;
    const pct = patch.targetAmount > 0 ? (g.currentAmount / patch.targetAmount) * 100 : 0;
    upsertGoal(userId, {
      ...g,
      name: patch.name,
      targetAmount: patch.targetAmount,
      priority: patch.priority,
      deadline: patch.deadline,
      milestonesReached: MILESTONES.filter((m) => pct >= m),
      isCompleted: g.currentAmount >= patch.targetAmount,
      updatedAt: nowISO(),
    }).catch(() => {});
  }, [userId, goals]);

  const deleteGoal = useCallback<StoreValue["deleteGoal"]>((id) => {
    deleteEntry(userId, "savingsGoals", id).catch(() => {});
  }, [userId]);

  const contributeToGoal = useCallback<StoreValue["contributeToGoal"]>((goalId, amount) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    const now = nowISO();
    const contribution: SavingsContribution = {
      id: uid(),
      goalId,
      type: "deposit",
      amount,
      currency: goal.currency,
      date: now,
    };
    const currentAmount = goal.currentAmount + amount;
    const pct = goal.targetAmount > 0 ? (currentAmount / goal.targetAmount) * 100 : 0;
    const updated: SavingsGoal = {
      ...goal,
      currentAmount,
      contributions: [...goal.contributions, contribution],
      lastContributionDate: now,
      milestonesReached: MILESTONES.filter((m) => pct >= m),
      isCompleted: currentAmount >= goal.targetAmount,
      completedAt: currentAmount >= goal.targetAmount ? (goal.completedAt ?? now) : undefined,
      updatedAt: now,
    };
    upsertGoal(userId, updated).catch(() => {});
  }, [userId, goals]);

  const addExpenseCategory = useCallback<StoreValue["addExpenseCategory"]>((input) => {
    const category: Category = {
      id: uid(),
      name: input.name,
      icon: input.icon,
      color: input.color,
      isCustom: true,
    };
    upsertCategory(userId, category).catch(() => {});
  }, [userId]);

  const deleteExpenseCategory = useCallback<StoreValue["deleteExpenseCategory"]>((id) => {
    deleteEntry(userId, "categories", id).catch(() => {});
  }, [userId]);

  const persistCurrency = useCallback((next: CurrencySettings) => {
    setCurrency(next);
    try {
      localStorage.setItem(CURRENCY_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const setPrimaryCurrency = useCallback<StoreValue["setPrimaryCurrency"]>((code) => {
    setCurrency((cur) => {
      const next = { primary: code, secondary: cur.secondary.filter((c) => c !== code) };
      try { localStorage.setItem(CURRENCY_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const toggleSecondaryCurrency = useCallback<StoreValue["toggleSecondaryCurrency"]>((code) => {
    setCurrency((cur) => {
      if (code === cur.primary) return cur;
      const has = cur.secondary.includes(code);
      const next = {
        ...cur,
        secondary: has ? cur.secondary.filter((c) => c !== code) : [...cur.secondary, code],
      };
      try { localStorage.setItem(CURRENCY_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    clearAll(userId).catch(() => {});
    persistCurrency({ primary: "USD", secondary: ["EUR"] });
  }, [userId, persistCurrency]);

  const value = useMemo<StoreValue>(
    () => ({
      receipts,
      incomes,
      budgets,
      goals,
      expenseCategories,
      incomeCategories,
      currency,
      addExpense,
      addIncome,
      addBudget,
      updateBudget,
      deleteBudget,
      addGoal,
      updateGoal,
      deleteGoal,
      contributeToGoal,
      addExpenseCategory,
      deleteExpenseCategory,
      setPrimaryCurrency,
      toggleSecondaryCurrency,
      reset,
    }),
    [receipts, incomes, budgets, goals, expenseCategories, incomeCategories, currency, addExpense, addIncome, addBudget, updateBudget, deleteBudget, addGoal, updateGoal, deleteGoal, contributeToGoal, addExpenseCategory, deleteExpenseCategory, setPrimaryCurrency, toggleSecondaryCurrency, reset],
  );

  if (!ready) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 14, color: "#63636B" }}>Syncing your data…</p>
      </div>
    );
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within <StoreProvider>");
  return ctx;
}

// ============================================================================
// Lumi — Web version shared types
// ----------------------------------------------------------------------------
// Canonical data shapes for the Lumi web client. Unlike the mobile app (which
// hydrates `Date` objects at runtime), the web client consumes JSON straight
// from the Firestore sync layer, so every timestamp here is an ISO 8601 string
// (`2026-07-08T12:00:00.000Z`) and every date-only field is `YYYY-MM-DD`.
//
// Keep these in sync with `src/types/index.ts`, `src/types/savings.ts` and the
// Firestore documents written by `src/services/syncService.ts`.
// ============================================================================

import { CurrencyCode } from '../utils/currencyUtils';

export type { CurrencyCode };

// Convenience aliases so intent is explicit at call sites.
export type ISODateTimeString = string; // e.g. "2026-07-08T12:00:00.000Z"
export type ISODateString = string; // e.g. "2026-07-08"

export type TransactionType = 'income' | 'expense';
export type RecurringFrequency = 'weekly' | 'monthly' | 'yearly';

// ============================================================================
// LOCATION / SHARED
// ============================================================================

export interface GeoLocation {
  city?: string;
  country?: string;
}

// ============================================================================
// CATEGORIES
// ============================================================================

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isCustom?: boolean;
}

export interface IncomeCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  isTaxable?: boolean;
  isCustom?: boolean;
}

// ============================================================================
// TRANSACTIONS — EXPENSES (Receipts)
// ============================================================================

export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount?: number; // amount off in currency units
  originalPrice?: number; // price before discount
}

export interface Receipt {
  id: string;
  date: ISODateTimeString;
  merchant?: string;
  total: number;
  currency?: CurrencyCode;
  category: Category;
  imageUri?: string;
  items: ReceiptItem[];
  savingsGoalId?: string;
  savingsContributionId?: string;
  tags?: string[];
  location?: GeoLocation;
  isImpulsive?: boolean;
  recurring?: boolean;
  frequency?: RecurringFrequency;
  recurringDay?: number;
  recurringMonth?: number; // 1-12 for yearly
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

// ============================================================================
// TRANSACTIONS — INCOME
// ============================================================================

export interface Income {
  id: string;
  source: string;
  amount: number;
  date: ISODateTimeString;
  currency?: CurrencyCode;
  category: IncomeCategory;
  description?: string;
  recurring?: boolean;
  frequency?: RecurringFrequency;
  recurringDay?: number;
  recurringMonth?: number;
  savingsGoalId?: string;
  savingsContributionId?: string;
  tags?: string[];
  location?: GeoLocation;
  isImpulsive?: boolean;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

/**
 * Unified transaction view for lists/tables where expenses and income are
 * shown together. Derived from `Receipt` / `Income` on the client.
 */
export interface UnifiedTransaction {
  id: string;
  type: TransactionType;
  title: string; // merchant (expense) or source (income)
  amount: number; // always positive; sign implied by `type`
  currency?: CurrencyCode;
  date: ISODateTimeString;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  tags?: string[];
  note?: string;
  imageUri?: string;
}

// ============================================================================
// BUDGETS
// ============================================================================

export type BudgetPeriod = 'monthly' | 'yearly' | 'weekly';

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  currency?: CurrencyCode;
  period: BudgetPeriod;
  month?: number; // 0-11
  year?: number;
  isRecurring?: boolean;
  recurringEndDate?: ISODateString;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

/** Budget joined with its live spend — for progress bars/cards on the web. */
export interface BudgetProgress {
  budget: Budget;
  spent: number;
  remaining: number;
  percentUsed: number; // 0-100+
  isExceeded: boolean;
}

// ============================================================================
// SAVINGS
// ============================================================================

export type SavingsGoalCategory =
  | 'emergency'
  | 'vacation'
  | 'purchase'
  | 'investment'
  | 'education'
  | 'home'
  | 'retirement'
  | 'gift'
  | 'custom';

export type SavingsGoalPriority = 'high' | 'medium' | 'low';
export type ContributionType = 'deposit' | 'withdrawal';

export interface SavingsContribution {
  id: string;
  goalId: string;
  type: ContributionType;
  amount: number;
  currency: CurrencyCode;
  date: ISODateTimeString;
  note?: string;
  convertedAmount?: number;
  conversionRate?: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  currency: CurrencyCode;
  icon: string;
  color: string;
  category: SavingsGoalCategory;
  priority: SavingsGoalPriority;
  deadline?: ISODateString;
  contributions: SavingsContribution[];
  currentStreak: number;
  longestStreak: number;
  lastContributionDate?: ISODateTimeString;
  milestonesReached: number[]; // e.g. [25, 50, 75, 100]
  isCompleted: boolean;
  completedAt?: ISODateTimeString;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

// ============================================================================
// BANK IMPORT (web upload flow)
// ============================================================================

export interface NormalizedTransaction {
  id: string;
  date: ISODateString;
  description: string;
  amount: number; // negative = expense, positive = income
  currency: string;
  amountInAccountCurrency?: number;
  accountCurrency?: string;
  balance?: number;
  isPending?: boolean;
  type: TransactionType;
  suggestedCategoryId: string;
}

export interface ImportResult {
  bankId: string;
  bankName: string;
  accountCurrency: string;
  transactions: NormalizedTransaction[];
  dateFrom: ISODateString;
  dateTo: ISODateString;
}

// ============================================================================
// SETTINGS / USER
// ============================================================================

export type ThemePreference = 'light' | 'dark' | 'system';

export interface CurrencySettings {
  primary: CurrencyCode;
  secondary: CurrencyCode[];
}

export interface UserProfile {
  id: string;
  email?: string;
  displayName?: string;
  photoUrl?: string;
  isPremium: boolean;
  createdAt: ISODateTimeString;
}

export interface AppSettings {
  currency: CurrencySettings;
  language: string; // 'en' | 'ru' | 'uk' | 'de' | 'es' | 'it' | 'ja' | 'pl' | 'ro'
  theme: ThemePreference;
}

// ============================================================================
// SYNC / API
// ============================================================================

/** Full snapshot the web client pulls from / pushes to the backend. */
export interface SyncSnapshot {
  receipts: Receipt[];
  incomes: Income[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  customCategories: Category[];
  customIncomeCategories: IncomeCategory[];
  settings: AppSettings;
  lastSyncedAt: ISODateTimeString;
}

/** Generic API envelope for web fetch calls. */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// ANALYTICS (web dashboard)
// ============================================================================

export interface CategorySpend {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  total: number;
  percentage: number; // 0-100 of total spend
  transactionCount: number;
}

export interface PeriodSummary {
  from: ISODateString;
  to: ISODateString;
  currency: CurrencyCode;
  totalIncome: number;
  totalExpenses: number;
  net: number; // income - expenses
  byCategory: CategorySpend[];
}

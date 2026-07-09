import type { Category, IncomeCategory } from "@/types/web";

// These MUST stay in sync with the mobile app's `src/constants/categories.ts`
// (same ids, icons, colors) so that receipts/incomes/budgets created on either
// platform group and match correctly across web and app.

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: "food", name: "Food & Dining", icon: "🍽️", color: "#F59E0B" },
  { id: "groceries", name: "Groceries", icon: "🛒", color: "#84CC16" },
  { id: "shopping", name: "Shopping", icon: "🛍️", color: "#A78BFA" },
  { id: "transport", name: "Transportation", icon: "🚗", color: "#6C63FF" },
  { id: "entertainment", name: "Entertainment", icon: "🎬", color: "#EC4899" },
  { id: "healthcare", name: "Healthcare", icon: "🏥", color: "#F87171" },
  { id: "utilities", name: "Utilities", icon: "⚡", color: "#34D399" },
  { id: "education", name: "Education", icon: "📚", color: "#06B6D4" },
  { id: "travel", name: "Travel", icon: "✈️", color: "#F97316" },
  { id: "fuel", name: "Fuel", icon: "⛽", color: "#F59E0B" },
  { id: "subscriptions", name: "Subscriptions", icon: "📱", color: "#6C63FF" },
  { id: "beauty", name: "Beauty & Care", icon: "💅", color: "#EC4899" },
  { id: "pets", name: "Pets", icon: "🐾", color: "#F97316" },
  { id: "gifts", name: "Gifts", icon: "🎁", color: "#A78BFA" },
  { id: "home", name: "Home & Garden", icon: "🏡", color: "#84CC16" },
  { id: "clothing", name: "Clothing", icon: "👕", color: "#06B6D4" },
  { id: "sports", name: "Sports & Fitness", icon: "🏋️", color: "#F59E0B" },
  { id: "coffee", name: "Coffee & Cafes", icon: "☕", color: "#F59E0B" },
  { id: "alcohol", name: "Bars & Drinks", icon: "🍺", color: "#F97316" },
  { id: "insurance", name: "Insurance", icon: "🛡️", color: "#06B6D4" },
  { id: "rent", name: "Rent", icon: "🏘️", color: "#A78BFA" },
  { id: "taxes", name: "Taxes & Fees", icon: "📄", color: "#6B7280" },
  { id: "charity", name: "Charity & Donations", icon: "❤️", color: "#F87171" },
  { id: "kids", name: "Kids & Family", icon: "👶", color: "#EC4899" },
  { id: "electronics", name: "Electronics", icon: "💻", color: "#6C63FF" },
  { id: "pharmacy", name: "Pharmacy", icon: "💊", color: "#34D399" },
  { id: "parking", name: "Parking", icon: "🅿️", color: "#38BDF8" },
  { id: "car_maintenance", name: "Car Maintenance", icon: "🔧", color: "#F59E0B" },
  { id: "internet", name: "Internet & Phone", icon: "📡", color: "#84CC16" },
  { id: "loan_payment", name: "Loan Payment", icon: "💳", color: "#6B7280" },
  { id: "other", name: "Other", icon: "📋", color: "#6B7280" },
  { id: "savings_deposit", name: "Savings", icon: "🏦", color: "#6C63FF" },
];

export const DEFAULT_INCOME_CATEGORIES: IncomeCategory[] = [
  { id: "salary", name: "Salary", icon: "💰", color: "#34D399", isTaxable: true },
  { id: "freelance", name: "Freelance", icon: "💻", color: "#6C63FF", isTaxable: true },
  { id: "investment", name: "Investment", icon: "📈", color: "#A78BFA", isTaxable: true },
  { id: "business", name: "Business", icon: "🏢", color: "#F59E0B", isTaxable: true },
  { id: "rental", name: "Rental Income", icon: "🏠", color: "#06B6D4", isTaxable: true },
  { id: "dividend", name: "Dividend", icon: "📊", color: "#34D399", isTaxable: true },
  { id: "bonus", name: "Bonus", icon: "🎯", color: "#EC4899", isTaxable: true },
  { id: "gift", name: "Gift", icon: "🎁", color: "#F97316", isTaxable: false },
  { id: "refund", name: "Refund", icon: "↩️", color: "#84CC16", isTaxable: false },
  { id: "pension", name: "Pension", icon: "👴", color: "#A78BFA", isTaxable: false },
  { id: "grant", name: "Grant & Scholarship", icon: "🏆", color: "#F59E0B", isTaxable: false },
  { id: "royalty", name: "Royalties", icon: "📜", color: "#06B6D4", isTaxable: true },
  { id: "crypto", name: "Crypto", icon: "₿", color: "#F97316", isTaxable: true },
  { id: "side_hustle", name: "Side Hustle", icon: "💡", color: "#34D399", isTaxable: true },
  { id: "other", name: "Other", icon: "📦", color: "#6B7280", isTaxable: false },
  { id: "savings_withdrawal", name: "Savings Withdrawal", icon: "🏦", color: "#6C63FF", isTaxable: false },
];

export const SITE_URL = "https://lumi.herman-apps.com";
export const SITE_NAME = "Lumi";
export const SITE_TITLE = "Lumi — Expense Tracker & Spending Forecast";
export const SITE_DESCRIPTION =
  "Lumi logs expenses the moment you pay — via Apple Pay or a Back Tap on your iPhone. AI forecasts your month-end balance before you overspend. Receipt scanner, budgets, savings goals. No bank login. Privacy-first.";

export const APP_STORE_URL =
  "https://apps.apple.com/app/lumi-bills-spending-log/id6754805457";

export const SOCIAL_LINKS = {
  threads: "https://www.threads.net/@lumiapp",
  twitter: "https://twitter.com/LumiExpense",
  instagram: "https://instagram.com/lumiapp",
};

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
] as const;

export const FEATURES = [
  {
    id: "back-tap",
    title: "Back Tap — zero friction logging",
    description:
      "Double-tap the back of your iPhone. Lumi opens instantly in recording mode — no unlocking, no searching, no scrolling. Expense logged in under 3 seconds.",
    icon: "tap" as const,
    size: "large" as const,
    accent: "#6C63FF",
  },
  {
    id: "apple-pay",
    title: "Apple Pay auto-import",
    description:
      "Pay contactless. The expense appears in Lumi automatically — amount, merchant, time. No manual entry, ever.",
    icon: "pay" as const,
    size: "medium" as const,
    accent: "#34D399",
  },
  {
    id: "forecast",
    title: "AI Spending Forecast",
    description:
      "Lumi compares your current daily spend rate against the last 3 months and shows where you'll land by month-end — with a warning 7–10 days before you overspend.",
    icon: "chart" as const,
    size: "medium" as const,
    accent: "#A78BFA",
  },
  {
    id: "receipt",
    title: "Receipt Scanner",
    description:
      "Point your camera at any receipt. AI reads amount, merchant, date, and category in seconds — in any language.",
    icon: "scan" as const,
    size: "small" as const,
    accent: "#F59E0B",
  },
  {
    id: "budgets",
    title: "Category Budgets",
    description:
      "Set monthly limits by category. Live progress bars show the real picture. Alerts before you hit the ceiling.",
    icon: "budget" as const,
    size: "small" as const,
    accent: "#F87171",
  },
  {
    id: "savings",
    title: "Savings Goals",
    description:
      "Set a target, track progress, get milestones. See exactly how your spending habits shift the timeline.",
    icon: "goal" as const,
    size: "small" as const,
    accent: "#34D399",
  },
] as const;

export const COMPARISON_DATA = [
  {
    feature: "Back Tap logging",
    lumi: "✓",
    ynab: "—",
    monarch: "—",
    copilot: "—",
    wally: "—",
  },
  {
    feature: "Apple Pay auto-import",
    lumi: "✓",
    ynab: "—",
    monarch: "—",
    copilot: "—",
    wally: "—",
  },
  {
    feature: "AI Spending Forecast",
    lumi: "✓",
    ynab: "—",
    monarch: "—",
    copilot: "Basic",
    wally: "—",
  },
  {
    feature: "AI Receipt Scanning",
    lumi: "✓",
    ynab: "—",
    monarch: "—",
    copilot: "—",
    wally: "Basic OCR",
  },
  {
    feature: "Bank login required",
    lumi: "Never",
    ynab: "Required",
    monarch: "Required",
    copilot: "Required",
    wally: "Required",
  },
  {
    feature: "Works offline",
    lumi: "✓",
    ynab: "—",
    monarch: "—",
    copilot: "—",
    wally: "—",
  },
  {
    feature: "Data stored on device",
    lumi: "✓",
    ynab: "Cloud",
    monarch: "Cloud",
    copilot: "Cloud",
    wally: "Cloud",
  },
  {
    feature: "Price",
    lumi: "Free / $4.99/mo",
    ynab: "$109/yr",
    monarch: "$100/yr",
    copilot: "$96/yr",
    wally: "$40/yr",
  },
] as const;

export const FREE_FEATURES = [
  "10 AI receipt scans / month",
  "2 budgets",
  "Basic analytics",
  "Unlimited manual entries",
  "Back Tap quick logging",
  "Apple Pay auto-import",
  "1 primary + 1 additional currency",
];

export const PREMIUM_FEATURES = [
  "Unlimited AI receipt scans",
  "Unlimited budgets",
  "Full multi-currency (150+ currencies)",
  "AI Spending Forecast",
  "Advanced analytics + period comparison",
  "PDF / CSV / JSON export",
  "Priority support",
];

export const FAQ = [
  {
    question: "Does Lumi require access to my bank account?",
    answer:
      "No. Lumi never asks for bank credentials, card numbers, or financial institution access. All data is stored locally on your device. Apple Pay transactions are imported via iOS Shortcuts — a one-time setup that requires no third-party access.",
  },
  {
    question: "How does Back Tap logging work?",
    answer:
      "Back Tap is a built-in iOS accessibility gesture — double-tap the back of your iPhone to trigger any action. In Lumi, it opens the app directly in expense-recording mode. No unlocking, no searching for the app, no extra taps. You can log an expense in under 3 seconds from any situation.",
  },
  {
    question: "How does Apple Pay auto-import work?",
    answer:
      "Set up a one-time iOS Shortcut that triggers when Apple Pay is used. Every contactless payment automatically creates an expense entry in Lumi with the correct amount, merchant name, and timestamp. No manual input required after setup.",
  },
  {
    question: "How accurate is the AI spending forecast?",
    answer:
      "Lumi calculates your average daily spend rate from the last 3 months (excluding statistical outliers like one-off large purchases), then projects it to month-end. If you have income data entered, it also shows your projected balance. Confidence scores are shown so you always know how reliable the forecast is.",
  },
  {
    question: "Is Lumi available on Android?",
    answer:
      "Currently Lumi is iOS only. Back Tap and Apple Pay integrations are iOS-native features. An Android version is on the roadmap.",
  },
  {
    question: "What currencies does Lumi support?",
    answer:
      "The free plan includes 2 currencies with real-time conversion. Premium includes 150+ currencies with automatic exchange rate updates. Useful for travel, expat life, or managing income in multiple currencies.",
  },
  {
    question: "Is my financial data private and secure?",
    answer:
      "All your data is stored exclusively on your device — Lumi has no servers storing your transactions. There is no account required to use the app. No data is sold or shared with third parties. You can export or delete everything at any time.",
  },
  {
    question: "How does the receipt scanner work?",
    answer:
      "Point your iPhone camera at any paper or digital receipt. Lumi's AI Vision reads the total amount, date, merchant name, and assigns a spending category — even for receipts in foreign languages. The scan takes 2–3 seconds.",
  },
  {
    question: "Is Lumi free to use?",
    answer:
      "Yes. The free plan includes 10 AI receipt scans per month, 2 budgets, Back Tap logging, Apple Pay auto-import, and basic analytics. Lumi Premium ($4.99/month or $39.99/year) unlocks unlimited scans, unlimited budgets, AI forecasting, advanced analytics, and full multi-currency support.",
  },
  {
    question: "What makes Lumi different from YNAB, Copilot, or Monarch?",
    answer:
      "Three things no competitor offers simultaneously: (1) Back Tap instant logging — log without opening the app. (2) Apple Pay auto-import — zero-effort automatic logging. (3) Local-first privacy — no bank login, no cloud, your data never leaves your phone. YNAB, Monarch, and Copilot all require bank account access and store data in the cloud.",
  },
] as const;

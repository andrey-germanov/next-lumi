import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Providers } from "./providers";
import { LanguageProvider } from "@/components/dash/i18n";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Lumi — Expense Tracker & Spending Forecast",
    default:
      "Lumi — Expense Tracker | Back Tap Logging, Apple Pay Import, AI Forecast",
  },
  description:
    "Lumi logs expenses the moment you pay — via Apple Pay, Back Tap, or your voice. AI forecasts your month-end balance before you overspend. Receipt scanner, budgets, savings goals. No bank login. Privacy-first.",
  keywords: [
    "expense tracker no bank login",
    "spending tracker no bank login",
    "Apple Pay expense tracker",
    "Apple Pay spending tracker",
    "Back Tap expense logging",
    "voice expense tracker",
    "log expenses by voice",
    "AI spending forecast",
    "receipt scanner app",
    "budget app iOS",
    "budgeting app iOS",
    "spending tracker app",
    "personal finance privacy",
    "offline expense tracker",
    "offline budgeting app",
    "multi currency budget",
    "multi currency spending tracker",
    "spending forecast app",
    "automatic expense logging",
    "money tracker iPhone",
    "money management app",
    "savings goal tracker app",
    "savings tracker iOS",
    "financial goals app",
    "best free budgeting app",
    "best free expense tracker",
    "top budgeting apps 2026",
    "best apps for financial goals",
  ],
  authors: [{ name: "Lumi" }],
  creator: "Lumi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Lumi",
    title: "Lumi — AI Expense Tracker | Scan Receipts, No Bank Login",
    description:
      "AI scans receipts, listens to your voice, and imports Apple Pay automatically. Track spending in any currency — no bank login. Free to start.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumi — AI Expense Tracker",
    description:
      "Snap a receipt or say it out loud — AI logs it instantly. Track spending across currencies, no bank login needed.",
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Lumi: Bills & Spending Log",
              image: `${SITE_URL}/images/logo/logo-512.png`,
              operatingSystem: "iOS 16.0 or later",
              applicationCategory: "FinanceApplication",
              applicationSubCategory: "Personal Finance",
              description:
                "Lumi logs expenses via Apple Pay auto-import, Back Tap gesture, or voice — no manual entry needed. AI forecasts your month-end balance 7–10 days in advance. Receipt scanner, category budgets, savings goals. No bank login. Data stored on your device.",
              url: "https://apps.apple.com/app/lumi-bills-spending-log/id6754805457",
              downloadUrl: "https://apps.apple.com/app/lumi-bills-spending-log/id6754805457",
              offers: [
                {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                  description: "Free plan with 10 AI scans/month and 2 budgets",
                },
                {
                  "@type": "Offer",
                  price: "4.99",
                  priceCurrency: "USD",
                  description: "Premium monthly — unlimited scans, budgets, AI forecast",
                },
              ],
              featureList: [
                "Back Tap instant expense logging — no app opening needed",
                "Apple Pay automatic expense import via iOS Shortcuts",
                "Voice input — log expenses by speaking naturally",
                "AI Spending Forecast — predicts month-end balance from 3-month history",
                "AI Receipt Scanner — reads amount, merchant, category in any language",
                "Category budget limits with live progress bars",
                "Savings goals with milestone tracking",
                "150+ currencies with real-time conversion",
                "Works offline — no internet required",
                "No bank login required",
                "Data stored locally on device — not in the cloud",
                "PDF, CSV, and JSON export",
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>
          <LanguageProvider>{children}</LanguageProvider>
        </Providers>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}

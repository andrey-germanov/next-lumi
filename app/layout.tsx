import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://lumi.herman-apps.com"),
  title: {
    template: "%s | Lumi — Expense Tracker & Spending Forecast",
    default:
      "Lumi — Expense Tracker | Back Tap Logging, Apple Pay Import, AI Forecast",
  },
  description:
    "Lumi logs expenses the moment you pay — via Apple Pay or a Back Tap on your iPhone. AI forecasts your month-end balance before you overspend. Receipt scanner, budgets, savings goals. No bank login. Privacy-first.",
  keywords: [
    "expense tracker no bank login",
    "Apple Pay expense tracker",
    "Back Tap expense logging",
    "AI spending forecast",
    "receipt scanner app",
    "budget app iOS",
    "personal finance privacy",
    "offline expense tracker",
    "multi currency budget",
    "spending forecast app",
    "automatic expense logging",
    "money tracker iPhone",
  ],
  authors: [{ name: "Lumi" }],
  creator: "Lumi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lumi.herman-apps.com",
    siteName: "Lumi",
    title: "Lumi — AI Expense Tracker | Scan Receipts, No Bank Login",
    description:
      "AI scans your receipts. Track spending in any currency. No bank login required. Free to start.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lumi — AI Expense Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumi — AI Expense Tracker",
    description:
      "Snap a receipt. AI extracts everything. Track spending across currencies — no bank login needed.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://lumi.herman-apps.com",
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
              operatingSystem: "iOS 16.0 or later",
              applicationCategory: "FinanceApplication",
              applicationSubCategory: "Personal Finance",
              description:
                "Lumi logs expenses via Apple Pay auto-import or Back Tap gesture — no manual entry needed. AI forecasts your month-end balance 7–10 days in advance. Receipt scanner, category budgets, savings goals. No bank login. Data stored on your device.",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

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
    template: "%s | Lumi",
    default: "Lumi — Voice Expense Tracker & AI Budget App for iPhone",
  },
  description:
    "Say “coffee, five euros” — logged. Voice input, Apple Pay auto-import, and an AI forecast of your month-end balance. No bank login, privacy-first. Free on iOS.",
  keywords: [
    "voice expense tracker",
    "log expenses by voice",
    "expense tracker no bank login",
    "Apple Pay expense tracker",
    "AI spending forecast",
    "receipt scanner app",
    "budget app iOS",
    "multi currency expense tracker",
    "offline budgeting app",
    "money tracker iPhone",
  ],
  authors: [{ name: "Lumi" }],
  creator: "Lumi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Lumi",
    title: "Lumi — Voice Expense Tracker for iPhone",
    description:
      "Say an expense out loud — AI logs the amount, merchant, and category. Apple Pay auto-import, month-end forecast. No bank login. Free to start.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumi — Voice Expense Tracker for iPhone",
    description:
      "Say an expense out loud — AI logs the amount, merchant, and category. Apple Pay auto-import, month-end forecast. No bank login. Free to start.",
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
              name: "Lumi: Budget & Expense Tracker",
              alternateName: "Lumi — Voice Money Manager",
              image: `${SITE_URL}/images/logo/logo-512.png`,
              operatingSystem: "iOS 16.0 or later",
              applicationCategory: "FinanceApplication",
              applicationSubCategory: "Personal Finance",
              description:
                "Lumi logs expenses by voice — say “coffee, five euros” and AI records the amount, merchant, and category. Apple Pay auto-import, Back Tap logging, AI month-end forecast, receipt scanner, budgets, savings goals. No bank login. Data stored on your device.",
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
                "Voice input — log expenses by speaking naturally",
                "Apple Pay automatic expense import via iOS Shortcuts",
                "Back Tap instant expense logging — no app opening needed",
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

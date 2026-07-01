import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Lumi Privacy Policy — how we handle your data.",
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="mt-4 text-text-muted">Last updated: March 2026</p>

          <div className="prose mt-8">
            <h2>Our Commitment to Privacy</h2>
            <p>
              Lumi is built on a fundamental principle: your financial data
              belongs to you. We don&apos;t ask for bank credentials, we don&apos;t sync
              with financial institutions, and we don&apos;t store your data on our
              servers.
            </p>

            <h2>Data Storage</h2>
            <p>
              All your financial data — transactions, budgets, goals, and
              settings — is stored locally on your device using encrypted
              storage (MMKV). Your data never leaves your phone unless you
              explicitly export it.
            </p>

            <h2>AI Receipt Scanning</h2>
            <p>
              When you scan a receipt, the image is sent to OpenAI&apos;s Vision API
              for processing. The image is processed in real-time and is not
              stored by OpenAI or Lumi servers. Only the extracted data
              (amount, date, merchant, items) is saved locally on your device.
            </p>

            <h2>Analytics</h2>
            <p>
              We use PostHog for anonymous usage analytics to understand how
              people use the app and improve it. This includes:
            </p>
            <ul>
              <li>Anonymous feature usage (which screens are visited, which features are used)</li>
              <li>App performance metrics</li>
              <li>Crash reports</li>
            </ul>
            <p>
              We do NOT collect: transaction amounts, merchant names, category
              data, budget details, or any personally identifiable financial
              information through analytics.
            </p>

            <h2>Subscriptions</h2>
            <p>
              Premium subscriptions are managed through Apple&apos;s App Store via
              Adapty. Payment processing is handled entirely by Apple. We do
              not have access to your payment details.
            </p>

            <h2>Data Export</h2>
            <p>
              You can export all your data at any time in PDF, CSV, or JSON
              format. This export is generated locally on your device.
            </p>

            <h2>Biometric Security</h2>
            <p>
              Lumi supports Face ID and Touch ID for app access. Biometric
              data is handled by iOS and never accessed by our app.
            </p>

            <h2>Third-Party Services</h2>
            <ul>
              <li><strong>OpenAI</strong> — Receipt image processing (images not stored)</li>
              <li><strong>PostHog</strong> — Anonymous usage analytics</li>
              <li><strong>Adapty</strong> — Subscription management</li>
              <li><strong>Apple App Store</strong> — Payment processing</li>
            </ul>

            <h2>Contact</h2>
            <p>
              Questions about privacy? Contact us at{" "}
              <a href="mailto:hello@getlumi.app">hello@getlumi.app</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

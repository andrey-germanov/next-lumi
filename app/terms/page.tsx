import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Lumi Terms of Service.",
  alternates: {
    canonical: "https://getlumi.app/terms",
  },
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="mt-4 text-text-muted">Last updated: March 2026</p>

          <div className="prose mt-8">
            <h2>Acceptance of Terms</h2>
            <p>
              By downloading, installing, or using Lumi (&ldquo;the App&rdquo;), you agree
              to be bound by these Terms of Service. If you do not agree, do
              not use the App.
            </p>

            <h2>Description of Service</h2>
            <p>
              Lumi is a personal expense tracking application that provides AI
              receipt scanning, multi-currency expense tracking, budgeting, and
              savings goal features. The App is designed for personal financial
              management and is not intended as professional financial advice.
            </p>

            <h2>User Accounts</h2>
            <p>
              Lumi does not require account creation. All data is stored
              locally on your device. You are responsible for maintaining the
              security of your device and any data stored within the App.
            </p>

            <h2>Subscriptions</h2>
            <p>
              Lumi offers a free tier and a premium subscription. Premium
              subscriptions are billed through the Apple App Store. You can
              manage or cancel your subscription through your App Store
              account settings. Refunds are handled by Apple according to
              their refund policy.
            </p>

            <h2>AI Receipt Scanning</h2>
            <p>
              The AI receipt scanning feature provides automated extraction of
              data from receipt images. While we strive for accuracy, the
              extracted data may contain errors. You are responsible for
              verifying the accuracy of scanned data. Lumi is not liable for
              any inaccuracies in AI-extracted information.
            </p>

            <h2>Currency Conversion</h2>
            <p>
              Currency conversion rates are provided for informational and
              tracking purposes only. Rates may not reflect real-time exchange
              rates and should not be used for financial transactions or
              trading decisions.
            </p>

            <h2>Data and Privacy</h2>
            <p>
              Your use of the App is also governed by our{" "}
              <a href="/privacy">Privacy Policy</a>. Your financial data is
              stored locally on your device. We do not have access to your
              financial data.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              The App, including its design, code, and content, is the
              property of Lumi and is protected by applicable intellectual
              property laws. You may not copy, modify, distribute, or reverse
              engineer any part of the App.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              Lumi is provided &ldquo;as is&rdquo; without warranties of any kind. We are
              not liable for any damages arising from your use of the App,
              including but not limited to financial decisions made based on
              data displayed in the App.
            </p>

            <h2>Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of
              the App after changes constitutes acceptance of the updated
              Terms.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these Terms? Contact us at{" "}
              <a href="mailto:hello@getlumi.app">hello@getlumi.app</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Lumi Refund Policy — how subscriptions, billing, and refunds work.",
  alternates: {
    canonical: `${SITE_URL}/refund-policy`,
  },
};

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-3xl font-bold">Refund Policy</h1>
          <p className="mt-4 text-text-muted">Last updated: July 2026</p>

          <div className="prose mt-8">
            <h2>Overview</h2>
            <p>
              Lumi is free to download and use, with an optional Lumi Premium
              subscription. This policy explains how billing works and how to
              request a refund.
            </p>

            <h2>Free plan</h2>
            <p>
              The free plan involves no payment, so there is nothing to refund.
              You can use it for as long as you like without a subscription.
            </p>

            <h2>Premium subscriptions</h2>
            <p>
              Lumi Premium is offered as an auto-renewing subscription (monthly
              or yearly). Your subscription renews automatically at the end of
              each period unless you cancel at least 24 hours before it renews.
              Cancelling stops future charges; it does not retroactively refund
              the current period.
            </p>

            <h2>Purchases through the Apple App Store</h2>
            <p>
              Premium purchased on iOS is billed by Apple through your Apple
              account. Apple processes all payments and refunds — Lumi never
              receives your card details and cannot issue App Store refunds
              directly.
            </p>
            <p>To request a refund for an App Store purchase:</p>
            <ul>
              <li>
                Go to{" "}
                <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener noreferrer">
                  reportaproblem.apple.com
                </a>{" "}
                and sign in with your Apple ID, or
              </li>
              <li>On your iPhone: Settings → your name → Media &amp; Purchases → Purchase History → the item → Report a Problem.</li>
            </ul>
            <p>
              Refunds for App Store purchases are granted at Apple&apos;s
              discretion, in line with Apple&apos;s Media Services Terms and the
              consumer laws of your country.
            </p>

            <h2>Managing or cancelling your subscription</h2>
            <p>
              You can cancel auto-renewal any time on your iPhone: Settings →
              your name → Subscriptions → Lumi → Cancel Subscription. You keep
              Premium access until the end of the paid period.
            </p>

            <h2>Purchases through our website</h2>
            <p>
              If Lumi Premium is ever purchased directly on our website, the
              payment is processed by our third-party payment provider acting as
              the merchant of record, and refunds are handled according to that
              provider&apos;s terms. If you bought Premium on the web and would
              like a refund, contact us and we will help — where a purchase is
              faulty or not as described, you are entitled to a remedy under
              applicable consumer law.
            </p>

            <h2>Exceptional circumstances</h2>
            <p>
              If you were charged in error, billed twice, or experienced a
              technical issue that prevented you from using Premium, email us and
              we will review your case and help resolve it.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about billing or refunds? Contact us at{" "}
              <a href="mailto:hello@getlumi.app">hello@getlumi.app</a> and
              include the email or Apple ID used for the purchase.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

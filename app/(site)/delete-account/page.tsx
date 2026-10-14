import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Delete Your Lumi Account",
  description: "How to delete your Lumi account and the data linked to it.",
  alternates: {
    canonical: `${SITE_URL}/delete-account`,
  },
};

export default function DeleteAccountPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-3xl font-bold">Delete Your Lumi Account</h1>
          <p className="mt-4 text-text-muted">Last updated: October 2026</p>

          <div className="prose mt-8">
            <p>
              This page explains how to delete your account in the Lumi app
              (developer: Andrii Hermanov) and what happens to your
              data. You only have an account if you signed in with email or
              Google; if you use Lumi without signing in, your data stays on
              your device and is removed when you uninstall the app.
            </p>
            <p>
              Want to delete only some of your data and keep the account? See{" "}
              <Link href="/delete-data">Delete your data</Link>.
            </p>

            <h2>Option 1: Delete in the app</h2>
            <ol>
              <li>Open Lumi and go to <strong>Settings</strong>.</li>
              <li>Tap <strong>Account info</strong>.</li>
              <li>Tap <strong>Delete Account</strong>.</li>
              <li>
                Optionally export your data first (CSV or JSON), then confirm
                deletion.
              </li>
            </ol>
            <p>
              Deletion happens immediately. If the app asks you to sign in
              again, do so and repeat the steps.
            </p>

            <h2>Option 2: Request deletion by email</h2>
            <ol>
              <li>
                Send an email to{" "}
                <a href="mailto:ange.germanov@gmail.com?subject=Delete%20my%20Lumi%20account">
                  ange.germanov@gmail.com
                </a>{" "}
                with the subject <strong>&quot;Delete my Lumi account&quot;</strong>.
              </li>
              <li>
                Send it from the email address you use to sign in to Lumi (for
                Google sign-in, your Google account email).
              </li>
              <li>
                We will confirm the request and delete your account and data
                within 30 days.
              </li>
            </ol>

            <h2>What is deleted</h2>
            <ul>
              <li>Your Lumi account and sign-in credentials</li>
              <li>
                All data synced to your account: transactions, accounts,
                transfers, budgets, savings goals, recurring payments and
                categories
              </li>
              <li>All receipt photos stored in the cloud</li>
              <li>The local copy of your account&apos;s data on the device used to delete it</li>
              <li>
                For requests by email, also your analytics profile (the email
                and account ID linked to usage analytics)
              </li>
            </ul>

            <h2>What is kept</h2>
            <ul>
              <li>
                Usage analytics and crash reports are kept for a limited period
                and then deleted or aggregated. To have your analytics profile
                deleted too, use Option 2.
              </li>
              <li>
                Data on other devices where you used Lumi without signing in,
                and files you exported yourself, are not affected.
              </li>
              <li>
                Purchase records kept by Google Play or the App Store are
                governed by their policies. Deleting your account does not
                cancel a subscription — cancel it in Google Play or App Store
                settings.
              </li>
            </ul>

            <h2>Questions</h2>
            <p>
              Contact us at{" "}
              <a href="mailto:ange.germanov@gmail.com">ange.germanov@gmail.com</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

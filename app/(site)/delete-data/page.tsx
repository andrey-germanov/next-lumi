import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Delete Your Lumi Data",
  description: "How to delete some or all of your data in Lumi without deleting your account, and what is kept and for how long.",
  alternates: {
    canonical: `${SITE_URL}/delete-data`,
  },
};

const MAILTO = "mailto:ange.germanov@gmail.com?subject=Delete%20my%20Lumi%20data";

export default function DeleteDataPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-3xl font-bold">Delete Your Lumi Data</h1>
          <p className="mt-4 text-text-muted">Last updated: October 2026</p>

          <div className="prose mt-8">
            <p>
              This page explains how to delete some or all of your data in the
              app <strong>Lumi: Budget &amp; Expense Tracker</strong> (developer:
              Andrii Hermanov) without deleting your account. To delete your
              account and everything linked to it, see{" "}
              <Link href="/delete-account">Delete your account</Link> instead.
            </p>

            <h2>Option 1: Delete data in the app</h2>
            <p>You can delete any record yourself at any time:</p>
            <ol>
              <li>
                <strong>An expense, income or transfer:</strong> open it from the
                Home screen or the transactions list and tap{" "}
                <strong>Delete</strong>, or long-press it in the list and confirm.
                Its receipt photo is deleted with it.
              </li>
              <li>
                <strong>A budget:</strong> open the budget and tap{" "}
                <strong>Delete</strong>.
              </li>
              <li>
                <strong>A savings goal:</strong> open the goal and tap{" "}
                <strong>Delete Goal</strong>.
              </li>
              <li>
                <strong>A custom category:</strong> open category management,
                choose the category and tap <strong>Delete Category</strong>.
              </li>
              <li>
                <strong>An account (wallet):</strong> open the account switcher,
                choose the account and tap <strong>Delete account</strong>. Its
                transactions move back to the combined view.
              </li>
              <li>
                <strong>Location:</strong> the city saved with a transaction is
                deleted together with that transaction. To stop saving location,
                turn off location access for Lumi in your phone&apos;s settings.
              </li>
            </ol>
            <p>
              If you are signed in and your data is synced, deletions are applied
              to the cloud copy the next time the app syncs, usually within
              seconds when you are online. Receipt photos of deleted records are
              removed from cloud storage at the same time.
            </p>

            <h2>Option 2: Request deletion by email</h2>
            <p>
              Use this if you want us to delete data for you, for example all
              data synced to your account while keeping the account itself, your
              receipt photos, or your analytics profile.
            </p>
            <ol>
              <li>
                Send an email to{" "}
                <a href={MAILTO}>ange.germanov@gmail.com</a> with the subject{" "}
                <strong>&quot;Delete my Lumi data&quot;</strong>.
              </li>
              <li>
                Send it from the email address you use to sign in to Lumi (for
                Google sign-in, your Google account email). If you don&apos;t have
                an account, include the email you gave us, for example when you
                signed up for the Android beta.
              </li>
              <li>
                Say which data you want deleted: all synced financial data, receipt
                photos only, your analytics profile, your Android beta signup, or
                records from a specific period.
              </li>
              <li>
                We confirm the request by email and complete it within 30 days.
              </li>
            </ol>

            <h2>What can be deleted</h2>
            <ul>
              <li>
                Transactions: expenses, income and transfers, with their notes,
                receipt items and saved city
              </li>
              <li>Receipt photos stored in the cloud</li>
              <li>Budgets, savings goals, recurring payments, accounts and custom categories</li>
              <li>
                Your analytics profile (the account ID and email linked to usage
                analytics)
              </li>
              <li>Your Android beta tester signup (email and phone model)</li>
              <li>Push notification tokens and device names stored for sync</li>
            </ul>

            <h2>What is kept, and for how long</h2>
            <ul>
              <li>
                <strong>Your account</strong> (email address, sign-in method and
                user ID) is kept until you delete the account.
              </li>
              <li>
                <strong>Shared group expenses</strong> you added to a group stay
                visible to its members while the group exists. You can delete your
                expenses in the group or leave it; the group owner can delete the
                whole group.
              </li>
              <li>
                <strong>Crash reports</strong> (Android) contain no financial data
                and are kept by Firebase Crashlytics for 90 days.
              </li>
              <li>
                <strong>Usage analytics</strong> contain no transaction amounts,
                merchants or notes. Unless you ask us to delete your analytics
                profile, they are kept for up to 12 months and then deleted or
                aggregated.
              </li>
              <li>
                <strong>Purchase records</strong> are kept by Google Play or the
                App Store under their policies, and subscription status by our
                purchase provider for as long as needed to provide Premium.
              </li>
              <li>
                <strong>Data on your device</strong>, including automatic local
                backup snapshots and files you exported yourself, stays on the
                device until you delete it or uninstall the app.
              </li>
            </ul>
            <p>
              More details are in our <Link href="/privacy">Privacy Policy</Link>.
            </p>

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

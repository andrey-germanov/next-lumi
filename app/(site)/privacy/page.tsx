import type { Metadata } from "next";
import Link from "next/link";
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

// Same text as the in-app policy (iOS src/constants/legalContent.json), plus the Android crash-reporting note.
type Block = [kind: "Section" | "Paragraph" | "Bullet" | "Contact" | "Footer" | "DeleteLink", text: string];

const POLICY: Block[] = [
  ["Section", "1. Introduction"],
  ["Paragraph", "This Privacy Policy explains what data Lumi (\"Lumi\", \"we\", \"our\" or \"us\") collects when you use the Lumi mobile app, why we collect it, who processes it on our behalf, and the choices you have. We built Lumi to work without an account: if you never sign in, your financial records stay on your device, apart from the specific features described below that you choose to use."],
  ["Section", "2. Data You Enter"],
  ["Paragraph", "Lumi stores the data you add to it:"],
  ["Bullet", "Expenses and income: amount, currency, date, category, merchant or description, notes, tags and receipt line items"],
  ["Bullet", "Accounts and balances, transfers, budgets, savings goals and recurring payments"],
  ["Bullet", "Receipt photos you take or pick from your gallery"],
  ["Bullet", "Settings such as your currency, language, categories and notification preferences"],
  ["Paragraph", "This data is stored in the app's storage on your device. Lumi also keeps automatic local backup snapshots on your device so your data can be restored if something goes wrong."],
  ["Section", "3. Your Lumi Account and Sync"],
  ["Paragraph", "An account is optional. If you sign in with email and password, Apple or Google, we use Google Firebase:"],
  ["Bullet", "Firebase Authentication stores your email address, your sign-in provider and a user ID. With Apple or Google sign-in we receive only what that provider shares with us (usually your name and email)."],
  ["Bullet", "Cloud Firestore stores a copy of your financial data so it can be synced between your devices and restored after reinstalling the app."],
  ["Bullet", "Firebase Storage stores the receipt photos attached to your records."],
  ["Paragraph", "If you sign in with the same account on several devices (for example, a shared household), every device sees the same data. Lumi stores a display name and a push notification token for each device so the other devices can be notified when a new transaction is added."],
  ["Section", "4. Shared Expense Groups"],
  ["Paragraph", "If you create or join a group, the group's name, its members' display names, and the expenses and settlements added to the group are stored on our server (hosted by Vercel) and are visible to all members of that group. Anyone with an invite link can view the group's invitation. Expenses you do not add to a group are never shared with its members."],
  ["Section", "5. AI Features"],
  ["Paragraph", "Some features use artificial intelligence. When you use them, the content below is sent through our server to the AI provider, processed, and returned to the app. Our server does not keep a copy of it."],
  ["Bullet", "Receipt scanning: the receipt photo is sent to OpenAI to read the merchant, date, items and totals."],
  ["Bullet", "Voice and text input: the text you typed or dictated is sent to Anthropic (Claude) to turn it into transactions."],
  ["Bullet", "Statement import: when you import a CSV file from another app or bank, column headers, sample rows and transaction descriptions are sent to Anthropic (Claude) to recognise the file format and suggest categories. Files exported from Lumi itself are processed entirely on your device."],
  ["Paragraph", "Both providers process this data under their API terms, which do not allow it to be used to train their models. You can always add transactions manually instead."],
  ["Section", "6. Other Data Processed on Your Device"],
  ["Bullet", "Speech: dictation is converted to text by your phone's built-in speech recognition (Apple or Google), subject to your device settings."],
  ["Bullet", "Location (optional): if you allow it, Lumi records the city and country where a transaction was added. Your coordinates are converted to a city by your phone's geocoding service and are not stored."],
  ["Bullet", "Biometrics: Face ID, Touch ID or fingerprint unlock is handled entirely by your device's operating system. Lumi never receives your biometric data."],
  ["Bullet", "Notifications: reminders and insights are scheduled locally on your device."],
  ["Section", "7. Analytics and Diagnostics"],
  ["Paragraph", "We use PostHog to understand how the app is used and to find problems. It receives events such as which screens and features are used, error and storage-health reports, your device model, operating system, app version and language, together with a random identifier (and your account ID if you are signed in). Analytics events do not include your transaction amounts, merchant names or notes. We do not sell this data or use it for advertising."],
  ["Paragraph", "On Android, crash reports are sent to Google Firebase Crashlytics. A report contains the error details, your device model, operating system and app version, and a random installation identifier. Crash reports do not include your financial data."],
  ["Section", "8. Purchases"],
  ["Paragraph", "Lumi Premium is sold through the App Store or Google Play. Payments are handled by Apple or Google; we never see your card details. We use Adapty to check which subscription you have. Adapty receives your purchase history for Lumi and, if you are signed in, your account ID."],
  ["Section", "9. Other Services"],
  ["Bullet", "Exchange rates are downloaded from ExchangeRate-API. These requests contain no personal or financial data."],
  ["Paragraph", "We do not sell or rent your personal data and do not share it with anyone except the service providers listed in this policy, who process it only to provide their service to Lumi, or when we are required to do so by law."],
  ["Section", "10. Data Retention"],
  ["Paragraph", "Data on your device is kept until you delete it or uninstall the app. Data in your Lumi account is kept until you delete it or delete your account. Shared group data is kept while the group exists. Analytics data is kept for a limited period and then deleted or aggregated."],
  ["Section", "11. Your Rights and Choices"],
  ["Bullet", "Access and export: you can export all your data as CSV or JSON from Settings at any time"],
  ["Bullet", "Correction and deletion: you can edit or delete any record in the app"],
  ["Bullet", "Account deletion: you can delete your account in Settings, which permanently removes your account and the data synced to it, including receipt photos"],
  ["DeleteLink", ""],
  ["Bullet", "Permissions: camera, photos, microphone, location and notifications can be turned off in your device settings at any time"],
  ["Paragraph", "Depending on where you live (for example, in the EU, UK or California), you may have additional rights, such as to object to or restrict processing or to complain to a data protection authority. To exercise any of these rights, contact us at the address below."],
  ["Section", "12. Security"],
  ["Paragraph", "Data is transmitted over encrypted connections (HTTPS), and access to your synced data is restricted to your account. No method of storage or transmission is completely secure, so we cannot guarantee absolute security. Protecting your device with a passcode and turning on the app lock in Settings helps keep your data private."],
  ["Section", "13. International Transfers"],
  ["Paragraph", "Our service providers may process data in the United States and other countries outside your own. Where required, these transfers rely on appropriate safeguards such as the providers' standard contractual clauses."],
  ["Section", "14. Children's Privacy"],
  ["Paragraph", "Lumi is not intended for children under 13 (or the minimum age in your country). We do not knowingly collect personal data from children. If you believe a child has given us personal data, please contact us and we will delete it."],
  ["Section", "15. Changes to This Policy"],
  ["Paragraph", "We may update this Privacy Policy from time to time. We will post the new version in the app and update the \"Last updated\" date above. If the changes are significant, we will also tell you in the app."],
  ["Section", "16. Contact Us"],
  ["Paragraph", "If you have any questions or requests about this Privacy Policy or your data, contact us at:"],
  ["Contact", "Email: ange.germanov@gmail.com"],
  ["Footer", "This Privacy Policy is effective as of the date listed above and applies to all users of Lumi."],
];

function renderBlocks(blocks: Block[]) {
  const out: React.ReactNode[] = [];
  let bullets: React.ReactNode[] = [];
  const flush = () => {
    if (bullets.length) out.push(<ul key={`ul-${out.length}`}>{bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>);
    bullets = [];
  };
  blocks.forEach(([kind, text], i) => {
    if (kind === "Bullet") return void bullets.push(text);
    if (kind === "DeleteLink")
      return void bullets.push(
        <>Deletion without the app: you can also request account deletion by email, see <Link href="/delete-account">Delete your account</Link></>,
      );
    flush();
    if (kind === "Section") out.push(<h2 key={i}>{text}</h2>);
    else if (kind === "Contact")
      out.push(<p key={i}>Email: <a href="mailto:ange.germanov@gmail.com">ange.germanov@gmail.com</a></p>);
    else if (kind === "Footer") out.push(<p key={i} className="text-text-muted">{text}</p>);
    else out.push(<p key={i}>{text}</p>);
  });
  flush();
  return out;
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="mt-4 text-text-muted">Last updated: October 4, 2026</p>

          <div className="prose mt-8">{renderBlocks(POLICY)}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}

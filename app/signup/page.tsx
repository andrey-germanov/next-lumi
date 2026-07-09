import type { Metadata } from "next";
import SignupForm from "@/components/SignupForm";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a Lumi account to sync your budgets, forecasts, and savings goals across devices.",
  alternates: {
    canonical: `${SITE_URL}/signup`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function SignupPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
      <div
        className="hero-orb pointer-events-none absolute"
        style={{ top: -450, left: "50%", transform: "translateX(-50%)", opacity: 0.7 }}
      />
      <div className="relative flex w-full justify-center">
        <SignupForm />
      </div>
    </main>
  );
}

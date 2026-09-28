import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Lumi account to sync budgets, forecasts, and savings goals across your devices.",
  alternates: {
    canonical: `${SITE_URL}/login`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
      {/* Ambient orb — matches the rest of the site */}
      <div
        className="hero-orb pointer-events-none absolute"
        style={{ top: -450, left: "50%", transform: "translateX(-50%)", opacity: 0.7 }}
      />
      <div className="relative flex w-full justify-center">
        <LoginForm />
      </div>
    </main>
  );
}

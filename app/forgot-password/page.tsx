import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset the password for your Lumi account.",
  alternates: {
    canonical: `${SITE_URL}/forgot-password`,
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function ForgotPasswordPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
      <div
        className="hero-orb pointer-events-none absolute"
        style={{ top: -450, left: "50%", transform: "translateX(-50%)", opacity: 0.7 }}
      />
      <div className="relative flex w-full justify-center">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import OAuthConsent from "@/components/OAuthConsent";

export const metadata: Metadata = {
  title: "Connect an AI assistant",
  robots: { index: false, follow: false },
};

export default function AuthorizePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
      <div
        className="hero-orb pointer-events-none absolute"
        style={{ top: -450, left: "50%", transform: "translateX(-50%)", opacity: 0.7 }}
      />
      <div className="relative flex w-full justify-center">
        <Suspense>
          <OAuthConsent />
        </Suspense>
      </div>
    </main>
  );
}

"use client";

import { useEffect } from "react";
import { initPostHog } from "@/lib/posthog";
import { onConsentChange, readConsent } from "@/lib/consent";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // PostHog starts only after the visitor accepts cookies (CookieBanner).
    if (readConsent() === "granted") initPostHog();
    return onConsentChange((value) => {
      if (value === "granted") initPostHog();
    });
  }, []);

  return <>{children}</>;
}

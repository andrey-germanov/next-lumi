"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { onConsentChange, readConsent } from "@/lib/consent";

/** Google Analytics, mounted only once the visitor has accepted cookies. */
export function ConsentAnalytics({ gaId }: { gaId: string }) {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    setGranted(readConsent() === "granted");
    return onConsentChange((value) => setGranted(value === "granted"));
  }, []);

  return granted ? <GoogleAnalytics gaId={gaId} /> : null;
}

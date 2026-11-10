"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/dash/i18n";
import { onConsentOpen, readConsent, writeConsent, type Consent } from "@/lib/consent";

/** Bottom card asking to allow analytics cookies; shown until the visitor chooses. */
export function CookieBanner() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (readConsent() === null) setOpen(true);
    return onConsentOpen(() => setOpen(true));
  }, []);

  if (!open) return null;

  const choose = (value: Consent) => {
    setOpen(false);
    writeConsent(value);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-2xl flex-col gap-4 rounded-2xl border border-black/8 bg-white p-5 shadow-xl sm:flex-row sm:items-center"
    >
      <p className="flex-1 text-sm leading-relaxed text-text-muted">
        {t("consent.text")}{" "}
        <Link href="/privacy" className="font-semibold text-primary hover:underline">
          {t("lp2.footPrivacy")}
        </Link>
      </p>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => choose("denied")}
          className="flex-1 rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:bg-black/5 sm:flex-none"
        >
          {t("consent.decline")}
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className="flex-1 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:flex-none"
        >
          {t("consent.accept")}
        </button>
      </div>
    </div>
  );
}

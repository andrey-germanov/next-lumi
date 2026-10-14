"use client";

import Link from "next/link";
import { useLang } from "@/components/dash/i18n";
import { getAndroidBetaCopy } from "@/lib/androidBetaI18n";
import { trackEvent } from "@/lib/posthog";

/** Secondary CTA to the Android closed-beta signup, sized to sit next to AppStoreButton. */
export default function AndroidBetaButton({ location, onDark = false }: { location: string; onDark?: boolean }) {
  const { locale } = useLang();
  return (
    <Link
      href={locale === "en" ? "/android" : `/${locale}/android`}
      onClick={() => trackEvent("android_beta_cta_click", { location, locale })}
      className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-base font-semibold !no-underline transition-all duration-200 ${
        onDark
          ? "bg-white hover:bg-[#3DDC84]/90"
          : "bg-white/70 shadow-[inset_0_0_0_1.5px_rgba(0,0,0,0.14)] hover:bg-[#3DDC84]/10 hover:shadow-[inset_0_0_0_1.5px_#3DDC84]"
      }`}
      style={{ color: "#0A0A0A" }}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#3DDC84" aria-hidden="true">
        <path d="M17.6 9.48l1.84-3.18a.38.38 0 0 0-.66-.38l-1.86 3.22A11.4 11.4 0 0 0 12 8.1c-1.75 0-3.4.39-4.92 1.04L5.22 5.92a.38.38 0 0 0-.66.38L6.4 9.48A10.8 10.8 0 0 0 1 18h22a10.8 10.8 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
      </svg>
      {getAndroidBetaCopy(locale).heroCta}
    </Link>
  );
}

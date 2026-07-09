"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NAV_LINKS, APP_STORE_URL } from "@/lib/constants";
import { trackAppStoreClick } from "@/lib/posthog";
import { useLang } from "@/components/dash/i18n";
import { Select } from "@/components/dash/Select";
import { LOCALES, localePath, type Locale } from "@/lib/i18n";

function navKey(href: string): string {
  if (href === "#features") return "lp.navFeatures";
  if (href === "#pricing") return "lp.navPricing";
  if (href === "/faq") return "lp.navFaq";
  return "lp.navBlog";
}

export default function Header() {
  const { t, locale, setLocale } = useLang();
  const router = useRouter();

  // Switching language navigates to the localized landing (SEO-crawlable URL)
  // and persists the choice for other pages.
  function changeLocale(next: Locale) {
    setLocale(next);
    router.push(localePath(next));
  }

  return (
    <header className="fixed top-0 z-50 w-full" style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link href="/" className="flex items-center gap-2" style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.5px" }}>
          <Image src="/images/logo/logo.png" alt="Lumi" width={28} height={28} style={{ borderRadius: 7 }} priority />
          <span style={{ color: "#6C63FF" }}>Lumi</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={(link.href === "/faq" || link.href === "/blog") && locale !== "en" ? `/${locale}${link.href}` : link.href}
              style={{ fontSize: 14, color: "#63636B", transition: "color 0.15s" }}
              className="hover:text-text"
            >
              {t(navKey(link.href))}
            </Link>
          ))}
        </div>

        {/* Right side — always visible */}
        <div className="flex items-center gap-3">
          <span className="hidden md:block">
            <Select
              value={locale}
              onChange={(v) => changeLocale(v as Locale)}
              fullWidth={false}
              style={{ width: 128 }}
              options={LOCALES.map((l) => ({ value: l.code, label: l.label }))}
            />
          </span>
          <Link
            href="/login"
            style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", transition: "color 0.15s" }}
            className="hidden sm:inline hover:text-primary"
          >
            {t("lp.signIn")}
          </Link>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackAppStoreClick("header")}
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              background: "#6C63FF",
              borderRadius: 10,
              padding: "8px 16px",
              transition: "background 0.15s",
            }}
            className="hover:bg-primary-dark"
          >
            {t("lp.download")}
          </a>
        </div>
      </nav>
    </header>
  );
}

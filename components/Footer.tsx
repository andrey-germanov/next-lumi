"use client";

import Image from "next/image";
import Link from "next/link";
import { SOCIAL_LINKS, APP_STORE_URL } from "@/lib/constants";
import { useLang } from "@/components/dash/i18n";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-black/8 py-12 text-center">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <Image src="/images/logo/logo.png" alt="" width={24} height={24} style={{ borderRadius: 6 }} />
              Lumi
            </Link>
            <p className="mt-2 text-sm text-text-muted">
              {t("lp.footerTagline")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-text">{t("lp2.footProduct")}</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <Link href="/#features" className="hover:text-text transition-colors">
                  {t("lp2.footFeatures")}
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-text transition-colors">
                  {t("lp2.footPricing")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-text transition-colors">
                  {t("lp2.footFaq")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-text transition-colors">
                  {t("lp2.footBlog")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-text">{t("lp2.footLegal")}</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <Link href="/privacy" className="hover:text-text transition-colors">
                  {t("lp2.footPrivacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-text transition-colors">
                  {t("lp2.footTerms")}
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-text transition-colors">
                  {t("lp2.footRefund")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-text">{t("lp2.footConnect")}</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <a
                  href={SOCIAL_LINKS.threads}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-text transition-colors"
                >
                  Threads
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-black/8 pt-8 md:flex-row">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Lumi. {t("lp2.footRights")}
          </p>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-text hover:text-primary transition-colors"
          >
            {t("lp2.footDownload")} &rarr;
          </a>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 mt-8 flex flex-wrap items-center justify-center gap-4">
        <a href="https://saasgrow.app?ref=lumi.herman-apps.com" target="_blank" rel="noopener">
          <img src="https://saasgrow.app/api/badge?type=top&style=dark" alt="Lumi: Spending Auto Tracker on SaaSGrow" width="240" height="54" />
        </a>
        <a href="https://startuptrusted.com?ref=lumi.herman-apps.com" target="_blank" rel="noopener">
          <img src="https://startuptrusted.com/api/badge?type=top&style=light" alt="Lumi AI: Expense AutoTracker on StartupTrusted" width="240" height="54" />
        </a>
        <a href="https://fazier.com/launches/lumi.herman-apps.com" target="_blank"><img src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=neutral" width="250" alt="Fazier badge" /></a>
        <a href="https://www.foundrlist.com/product/lumi?utm_source=badge&amp;utm_medium=embed" target="_blank" rel="noopener">
          <img src="https://www.foundrlist.com/api/badge/lumi" alt="Featured on FoundrList" width="150" height="48" />
        </a>
        <a href="https://startupfa.me/s/lumi.herman-apps.com-937?utm_source=lumi.herman-apps.com" target="_blank" rel="noopener">
          <img src="https://startupfa.me/badges/featured/default.webp" alt="Featured on Startup Fame" width="171" height="54" />
        </a>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AppIcon } from "@/components/dash/AppIcon";
import { useLang } from "@/components/dash/i18n";
import { localePath, type Locale } from "@/lib/i18n";
import { TOOLS } from "@/lib/tools";

export default function ToolsHub({ locale }: { locale: Locale }) {
  const { t } = useLang();
  const base = locale === "en" ? "/tools" : `${localePath(locale)}/tools`;

  return (
    <>
      <Header />
      <main className="pt-24">
        <div className="relative overflow-hidden">
          <div className="hero-orb pointer-events-none absolute" style={{ top: -420, left: "50%", transform: "translateX(-50%)", opacity: 0.5 }} />
          <div className="relative mx-auto max-w-4xl px-6 py-16">
            <p className="label" style={{ marginBottom: 14 }}>{t("tools.eyebrow")}</p>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-1.5px", color: "#0A0A0A", lineHeight: 1.08, marginBottom: 16 }}>
              {t("tools.hubTitle")}
            </h1>
            <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#63636B", lineHeight: 1.6, maxWidth: 620, marginBottom: 40 }}>
              {t("tools.hubSubtitle")}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {TOOLS.map((tool) => (
                <Link key={tool.slug} href={`${base}/${tool.slug}`} className="surface group block rounded-2xl" style={{ padding: 22 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 46, height: 46, borderRadius: 13, background: `${tool.color}1A`, marginBottom: 14 }}>
                    <AppIcon name={tool.icon} color={tool.color} size={24} />
                  </span>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0A0A0A", marginBottom: 6 }} className="group-hover:text-primary">{t(tool.titleKey)}</h2>
                  <p style={{ fontSize: 14, color: "#63636B", lineHeight: 1.5 }}>{t(tool.descKey)}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

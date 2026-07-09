"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppStoreButton from "@/components/AppStoreButton";
import FAQAccordion from "@/components/FAQAccordion";
import { AppIcon } from "@/components/dash/AppIcon";
import { useLang } from "@/components/dash/i18n";
import { localePath, type Locale } from "@/lib/i18n";
import { TOOLS, getTool } from "@/lib/tools";
import { CALCULATORS } from "./calculators";

interface FaqItem {
  question: string;
  answer: string;
}

export default function ToolPage({ slug, locale, faq }: { slug: string; locale: Locale; faq: FaqItem[] }) {
  const { t } = useLang();
  const meta = getTool(slug);
  const Calculator = CALCULATORS[slug];
  if (!meta || !Calculator) return null;

  const faqJsonLd = faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
      }
    : null;

  const toolsBase = locale === "en" ? "/tools" : `${localePath(locale)}/tools`;
  const related = TOOLS.filter((tool) => tool.slug !== slug);

  return (
    <>
      <Header />
      <main className="pt-24">
        <div className="relative overflow-hidden">
          <div className="hero-orb pointer-events-none absolute" style={{ top: -420, left: "50%", transform: "translateX(-50%)", opacity: 0.5 }} />
          <div className="relative mx-auto max-w-4xl px-6 py-14">
            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#63636B", marginBottom: 28, flexWrap: "wrap" }}>
              <Link href={localePath(locale)} className="hover:text-text transition-colors" style={{ color: "#63636B" }}>Lumi</Link>
              <span>/</span>
              <Link href={toolsBase} className="hover:text-text transition-colors" style={{ color: "#63636B" }}>{t("nav.tools")}</Link>
              <span>/</span>
              <span style={{ color: "#0A0A0A" }}>{t(meta.titleKey)}</span>
            </div>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 15, background: `${meta.color}1A`, flexShrink: 0 }}>
                <AppIcon name={meta.icon} color={meta.color} size={28} />
              </span>
              <h1 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-1.5px", color: "#0A0A0A", lineHeight: 1.05 }}>
                {t(meta.titleKey)}
              </h1>
            </div>
            <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#63636B", lineHeight: 1.6, maxWidth: 620, marginBottom: 36 }}>
              {t(meta.descKey)}
            </p>

            {/* Calculator */}
            <Calculator />

            {/* Lumi CTA */}
            <div className="surface-dark rounded-3xl" style={{ padding: "clamp(28px, 5vw, 44px)", marginTop: 44, textAlign: "center" }}>
              <p className="label" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>Lumi</p>
              <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, letterSpacing: "-1px", color: "#fff", lineHeight: 1.1, marginBottom: 12 }}>
                {t("tools.ctaTitle")}
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.6 }}>
                {t("tools.ctaBody")}
              </p>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <AppStoreButton location="tools_cta" />
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{t("lp.ctaFootnote")}</p>
              </div>
            </div>

            {/* FAQ */}
            {faq.length > 0 && (
              <div style={{ marginTop: 48 }}>
                {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
                <h2 style={{ fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 800, letterSpacing: "-0.8px", color: "#0A0A0A", marginBottom: 20 }}>
                  {t("faq.eyebrow")}
                </h2>
                <FAQAccordion items={faq} />
              </div>
            )}

            {/* Related tools */}
            <div style={{ marginTop: 44 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A", marginBottom: 16 }}>{t("tools.related")}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {related.map((tool) => (
                  <Link key={tool.slug} href={`${toolsBase}/${tool.slug}`} className="surface group flex items-center gap-3 rounded-2xl" style={{ padding: 16 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 12, background: `${tool.color}1A`, flexShrink: 0 }}>
                      <AppIcon name={tool.icon} color={tool.color} size={22} />
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A" }} className="group-hover:text-primary">{t(tool.titleKey)}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

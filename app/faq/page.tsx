import type { Metadata } from "next";
import Link from "next/link";
import { FAQ, APP_STORE_URL, SITE_URL } from "@/lib/constants";
import FAQAccordion from "@/components/FAQAccordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Privacy, logging, forecasting, and pricing — answered.",
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
};

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative min-h-screen pt-24 pb-24">
        {/* Single faint orb */}
        <div
          className="hero-orb pointer-events-none absolute"
          style={{ top: -400, left: "50%", transform: "translateX(-50%)", opacity: 0.6 }}
        />

        <div className="relative mx-auto max-w-2xl px-6">
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#63636B", marginBottom: 40 }}>
            <Link href="/" style={{ color: "#63636B" }} className="hover:text-text transition-colors">Lumi</Link>
            <span>/</span>
            <span style={{ color: "#0A0A0A" }}>FAQ</span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <p className="label" style={{ marginBottom: 16 }}>Frequently Asked Questions</p>
            <h1
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                color: "#0A0A0A",
                letterSpacing: "-1.5px",
                lineHeight: 1.08,
                marginBottom: 16,
              }}
            >
              Everything about Lumi
            </h1>
            <p style={{ fontSize: 15, color: "#63636B", lineHeight: 1.6 }}>
              Privacy, logging, forecasting, and pricing — answered.
            </p>
          </div>

          {/* Questions */}
          <FAQAccordion items={FAQ} />

          {/* Bottom CTA */}
          <div className="surface rounded-2xl text-center" style={{ padding: "40px 32px", marginTop: 40 }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.4px", marginBottom: 8 }}>
              Still have questions?
            </p>
            <p style={{ fontSize: 14, color: "#63636B", marginBottom: 24 }}>
              Download Lumi free and try it yourself. No bank login, no commitment.
            </p>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-violet inline-flex items-center gap-2"
              style={{ padding: "13px 24px", fontSize: 14 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M11.2 5c-.7.9-1.9 1.6-3 1.5-.1-1.2.4-2.4 1.1-3.2.7-.9 2-1.5 3-1.5.1 1.3-.4 2.5-1.1 3.2zm1 1.7c-1.7-.1-3.1.9-3.9.9-.8 0-2-.9-3.3-.8-1.7 0-3.3 1-4.1 2.5-1.8 3-.5 7.4 1.3 9.8.8 1.2 1.8 2.5 3.1 2.5 1.2 0 1.7-.8 3.2-.8 1.5 0 1.9.8 3.2.7 1.3 0 2.2-1.2 3-2.4.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.5-1-2.5-3.7 0-2.3 1.9-3.4 2-3.5-.9-1.5-2.5-1.5-3.3-1.5z"/>
              </svg>
              Download on App Store — Free
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import FAQAccordion from "@/components/FAQAccordion";
import { getLocalizedFaq } from "@/lib/faqI18n";
import { useLang } from "@/components/dash/i18n";
import { localePath } from "@/lib/i18n";

/**
 * Objection-handling block on the landing page, placed just before the final
 * CTA. Reuses the localized FAQ content; shows the six highest-intent
 * questions and links to the full /faq page. Emits FAQPage JSON-LD for the
 * shown questions.
 */
export default function LandingFAQ() {
  const { t, locale } = useLang();
  const all = getLocalizedFaq(locale);
  const items = all.slice(0, 6);
  const faqHref = locale === "en" ? "/faq" : `${localePath(locale)}/faq`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center" style={{ marginBottom: 40 }}>
          <p className="label" style={{ marginBottom: 16 }}>{t("faq.eyebrow")}</p>
          <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ letterSpacing: "-1px" }}>
            {t("faq.title")}
          </h2>
        </div>

        <FAQAccordion items={items} />

        <div className="mt-8 text-center">
          <Link
            href={faqHref}
            className="text-sm font-medium text-primary hover:text-accent transition-colors"
          >
            {t("lp2.faqSeeAll")} &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

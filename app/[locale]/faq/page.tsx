import type { Metadata } from "next";
import FaqBody from "@/components/FaqBody";
import { SITE_URL } from "@/lib/constants";
import { translate, pageLanguagesMap, PREFIXED_LOCALES, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return PREFIXED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/faq">): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const title = `${translate(l, "faq.eyebrow")} · Lumi`;
  const description = translate(l, "faq.subtitle");
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/faq`,
      languages: pageLanguagesMap(SITE_URL, "faq"),
    },
    openGraph: { title, description, url: `${SITE_URL}/${locale}/faq`, locale: l, type: "website", siteName: "Lumi" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LocaleFAQPage({ params }: PageProps<"/[locale]/faq">) {
  const { locale } = await params;
  return <FaqBody locale={locale as Locale} />;
}

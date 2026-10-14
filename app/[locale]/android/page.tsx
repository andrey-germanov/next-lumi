import type { Metadata } from "next";
import AndroidBetaBody from "@/components/androidBeta/AndroidBetaBody";
import { SITE_URL } from "@/lib/constants";
import { pageLanguagesMap, PREFIXED_LOCALES, type Locale } from "@/lib/i18n";
import { getAndroidBetaCopy } from "@/lib/androidBetaI18n";

export function generateStaticParams() {
  return PREFIXED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/android">): Promise<Metadata> {
  const { locale } = await params;
  const { metaTitle: title, metaDescription: description } = getAndroidBetaCopy(locale as Locale);
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/android`,
      languages: pageLanguagesMap(SITE_URL, "android"),
    },
    openGraph: { title, description, url: `${SITE_URL}/${locale}/android`, locale, type: "website", siteName: "Lumi" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LocaleAndroidBetaPage({ params }: PageProps<"/[locale]/android">) {
  const { locale } = await params;
  return <AndroidBetaBody locale={locale as Locale} />;
}

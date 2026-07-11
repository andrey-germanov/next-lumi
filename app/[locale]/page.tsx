import type { Metadata } from "next";
import LandingContent from "@/components/LandingContent";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";
import { translate, landingLanguagesMap, PREFIXED_LOCALES, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return PREFIXED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const title = translate(l, "seo.title");
  const description = translate(l, "seo.description");
  const url = `${SITE_URL}/${locale}`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: landingLanguagesMap(SITE_URL),
    },
    openGraph: { title, description, url, locale: l, type: "website", siteName: "Lumi" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LocaleHome({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  return <LandingContent posts={getAllPosts(locale)} />;
}

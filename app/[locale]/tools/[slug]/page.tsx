import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolPage from "@/components/tools/ToolPage";
import { SITE_URL } from "@/lib/constants";
import { translate, pageLanguagesMap, PREFIXED_LOCALES, type Locale } from "@/lib/i18n";
import { TOOL_SLUGS, getTool } from "@/lib/tools";
import { getToolFaq } from "@/lib/toolsFaq";

export function generateStaticParams() {
  return PREFIXED_LOCALES.flatMap((locale) => TOOL_SLUGS.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/tools/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = locale as Locale;
  const meta = getTool(slug);
  if (!meta) return {};
  const title = `${translate(l, meta.titleKey)} · Lumi`;
  const description = translate(l, meta.descKey);
  const url = `${SITE_URL}/${locale}/tools/${slug}`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: pageLanguagesMap(SITE_URL, `tools/${slug}`),
    },
    openGraph: { title, description, url, locale: l, type: "website", siteName: "Lumi" },
  };
}

export default async function LocaleToolSlugPage({ params }: PageProps<"/[locale]/tools/[slug]">) {
  const { locale, slug } = await params;
  if (!getTool(slug)) notFound();
  return <ToolPage slug={slug} locale={locale as Locale} faq={getToolFaq(slug, locale)} />;
}

import type { Metadata } from "next";
import ToolsHub from "@/components/tools/ToolsHub";
import { SITE_URL } from "@/lib/constants";
import { translate, pageLanguagesMap, PREFIXED_LOCALES, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return PREFIXED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/tools">): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const title = `${translate(l, "tools.hubTitle")} · Lumi`;
  const description = translate(l, "tools.hubSubtitle");
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/tools`,
      languages: pageLanguagesMap(SITE_URL, "tools"),
    },
    openGraph: { title, description, url: `${SITE_URL}/${locale}/tools`, locale: l, type: "website", siteName: "Lumi" },
  };
}

export default async function LocaleToolsHubPage({ params }: PageProps<"/[locale]/tools">) {
  const { locale } = await params;
  return <ToolsHub locale={locale as Locale} />;
}

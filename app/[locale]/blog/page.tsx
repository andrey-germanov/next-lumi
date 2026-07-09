import type { Metadata } from "next";
import BlogListBody from "@/components/BlogListBody";
import { SITE_URL } from "@/lib/constants";
import { translate, pageLanguagesMap, PREFIXED_LOCALES, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return PREFIXED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await params;
  const l = locale as Locale;
  const title = `${translate(l, "lp.navBlog")} · Lumi`;
  const description = translate(l, "blog.metaDescription");
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/blog`,
      languages: pageLanguagesMap(SITE_URL, "blog"),
    },
    openGraph: { title, description, url: `${SITE_URL}/${locale}/blog`, locale: l, type: "website", siteName: "Lumi" },
  };
}

export default async function LocaleBlogPage({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  return <BlogListBody locale={locale as Locale} />;
}

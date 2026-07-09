import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolPage from "@/components/tools/ToolPage";
import { SITE_URL } from "@/lib/constants";
import { translate, pageLanguagesMap } from "@/lib/i18n";
import { TOOL_SLUGS, getTool } from "@/lib/tools";
import { getToolFaq } from "@/lib/toolsFaq";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return TOOL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = getTool(slug);
  if (!meta) return {};
  const title = `${translate("en", meta.titleKey)} · Lumi`;
  const description = translate("en", meta.descKey);
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${SITE_URL}/tools/${slug}`,
      languages: pageLanguagesMap(SITE_URL, `tools/${slug}`),
    },
    openGraph: { title, description, url: `${SITE_URL}/tools/${slug}`, type: "website", siteName: "Lumi" },
  };
}

export default async function ToolSlugPage({ params }: PageProps) {
  const { slug } = await params;
  if (!getTool(slug)) notFound();
  return <ToolPage slug={slug} locale="en" faq={getToolFaq(slug, "en")} />;
}

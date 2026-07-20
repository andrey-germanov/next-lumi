import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostBody from "@/components/BlogPostBody";
import { getPostBySlug, getAllSlugs, hasTranslation, translatedLocales } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";
import { postLanguagesMap, PREFIXED_LOCALES, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return PREFIXED_LOCALES.flatMap((locale) => getAllSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const post = getPostBySlug(slug, locale);
    const url = `${SITE_URL}/${locale}/blog/${slug}`;
    const metaTitle = post.seoTitle ?? post.title;
    // When no translation exists this route still renders — but it renders the
    // English file. Point the canonical at the English URL and keep it out of
    // hreflang so it doesn't compete with /blog/<slug> in the index.
    const translated = hasTranslation(slug, locale);
    return {
      title: { absolute: metaTitle },
      description: post.description,
      authors: [{ name: post.author }],
      openGraph: { type: "article", title: metaTitle, description: post.description, publishedTime: post.date, authors: [post.author], url, locale },
      twitter: { card: "summary_large_image", title: metaTitle, description: post.description },
      robots: translated ? undefined : { index: false, follow: true },
      alternates: {
        canonical: translated ? url : `${SITE_URL}/blog/${slug}`,
        languages: postLanguagesMap(SITE_URL, slug, translatedLocales(slug)),
      },
    };
  } catch {
    return {};
  }
}

export default async function LocaleBlogPostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  let post;
  try {
    post = getPostBySlug(slug, locale);
  } catch {
    notFound();
  }
  return <BlogPostBody post={post} locale={locale as Locale} />;
}

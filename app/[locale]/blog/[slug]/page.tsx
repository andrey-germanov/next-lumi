import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostBody from "@/components/BlogPostBody";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";
import { pageLanguagesMap, PREFIXED_LOCALES, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return PREFIXED_LOCALES.flatMap((locale) => getAllSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const post = getPostBySlug(slug, locale);
    const url = `${SITE_URL}/${locale}/blog/${slug}`;
    const metaTitle = post.seoTitle ?? post.title;
    return {
      title: { absolute: metaTitle },
      description: post.description,
      authors: [{ name: post.author }],
      openGraph: { type: "article", title: metaTitle, description: post.description, publishedTime: post.date, authors: [post.author], url, locale },
      twitter: { card: "summary_large_image", title: metaTitle, description: post.description },
      alternates: {
        canonical: url,
        languages: pageLanguagesMap(SITE_URL, `blog/${slug}`),
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

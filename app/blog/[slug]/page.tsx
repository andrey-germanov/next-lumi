import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostBody from "@/components/BlogPostBody";
import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";
import { pageLanguagesMap } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = getPostBySlug(slug);
    // `absolute` bypasses the root layout's "%s | Lumi" template, which would
    // otherwise add 7 characters to every blog title and push it past the
    // ~70-character limit search engines truncate at.
    const metaTitle = post.seoTitle ?? post.title;
    return {
      title: { absolute: metaTitle },
      description: post.description,
      authors: [{ name: post.author }],
      openGraph: {
        type: "article",
        title: metaTitle,
        description: post.description,
        publishedTime: post.date,
        authors: [post.author],
      },
      twitter: {
        card: "summary_large_image",
        title: metaTitle,
        description: post.description,
      },
      alternates: {
        canonical: `${SITE_URL}/blog/${slug}`,
        languages: pageLanguagesMap(SITE_URL, `blog/${slug}`),
      },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }
  return <BlogPostBody post={post} locale="en" />;
}

import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppStoreButton from "@/components/AppStoreButton";
import { SITE_URL } from "@/lib/constants";
import { translate, INTL_LOCALE, localePath, type Locale } from "@/lib/i18n";
import type { BlogPost } from "@/lib/blog";

function makeCta(label: string) {
  return function ArticleCTA() {
    return (
      <div className="surface-dark my-8 rounded-2xl p-6 text-center">
        <p className="mb-4 font-medium" style={{ color: "#FFFFFF" }}>{label}</p>
        <AppStoreButton location="blog_inline" />
      </div>
    );
  };
}

/**
 * Keeps readers inside their language. MDX bodies author internal links
 * unprefixed (`/blog/how-to-budget`) so the same source works for every locale;
 * without this override a reader on /de/blog/x clicks through to English.
 * External links, anchors, and mailto are left alone.
 */
function makeAnchor(locale: Locale) {
  return function MdxAnchor({ href = "", ...props }: React.ComponentPropsWithoutRef<"a">) {
    const isInternal = href.startsWith("/") && !href.startsWith("//");
    if (!isInternal) return <a href={href} {...props} />;
    const prefixed = locale === "en" ? href : `${localePath(locale)}${href}`;
    return <Link href={prefixed} {...props} />;
  };
}

export default function BlogPostBody({ post, locale }: { post: BlogPost; locale: Locale }) {
  const t = (k: string) => translate(locale, k);
  const intl = INTL_LOCALE[locale];
  const ArticleCTA = makeCta(t("blog.cta"));
  const a = makeAnchor(locale);
  const blogHref = locale === "en" ? "/blog" : `${localePath(locale)}/blog`;
  const canonicalPath = locale === "en" ? `/blog/${post.slug}` : `${localePath(locale)}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: locale,
    author: { "@type": "Person", name: post.author, url: SITE_URL },
    publisher: { "@type": "Organization", name: "Lumi", url: SITE_URL },
    image: `${SITE_URL}/blog/${post.slug}/opengraph-image`,
    mainEntityOfPage: `${SITE_URL}${canonicalPath}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Lumi", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}${blogHref}` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}${canonicalPath}` },
    ],
  };

  return (
    <>
      <Header />
      <main className="pt-24">
        <article className="mx-auto max-w-3xl px-6 py-16">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

          <Link href={blogHref} className="text-sm text-text-muted hover:text-text transition-colors">
            {t("blog.back")}
          </Link>

          <header className="mt-6">
            <div className="flex items-center gap-3 text-sm text-text-muted">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString(intl, { year: "numeric", month: "long", day: "numeric" })}
              </time>
              <span>&middot;</span>
              <span>{post.readingTime}</span>
              <span>&middot;</span>
              <span>{post.author}</span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl" style={{ letterSpacing: "-1px" }}>
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-surface-2 px-3 py-1 text-xs text-text-muted">{tag}</span>
              ))}
            </div>
          </header>

          <div className="prose mt-12">
            <MDXRemote
              source={post.content}
              components={{ ArticleCTA, a }}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
                },
              }}
            />
          </div>

          <div className="mt-12">
            <ArticleCTA />
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

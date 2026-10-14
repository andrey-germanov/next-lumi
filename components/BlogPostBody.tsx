import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppStoreButton from "@/components/AppStoreButton";
import AndroidBetaButton from "@/components/AndroidBetaButton";
import { APP_STORE_URL, BRAND_ENTITY_NAME, FOUNDER, FOUNDER_BYLINE, SITE_URL } from "@/lib/constants";
import { translate, INTL_LOCALE, localePath, type Locale } from "@/lib/i18n";
import { getRelatedPosts, hasTranslation, type BlogPost } from "@/lib/blog";

function makeCta(label: string, android: boolean) {
  return function ArticleCTA() {
    return (
      <div className="surface-dark my-8 rounded-2xl p-6 text-center">
        <p className="mb-4 font-medium" style={{ color: "#FFFFFF" }}>{label}</p>
        {android ? <AndroidBetaButton location="blog_inline" onDark /> : <AppStoreButton location="blog_inline" />}
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
    // An untranslated post renders an English fallback that is noindexed and
    // canonicalized to /blog/<slug>; link straight there instead.
    const postSlug = href.match(/^\/blog\/([^/?#]+)/)?.[1];
    const keepEnglish = locale === "en" || (postSlug !== undefined && !hasTranslation(postSlug, locale));
    const prefixed = keepEnglish ? href : `${localePath(locale)}${href}`;
    return <Link href={prefixed} {...props} />;
  };
}

/** Row of phone screenshots with step captions, used as <Screenshots><Screenshot … /></Screenshots> in MDX. */
function Screenshots({ children }: { children: React.ReactNode }) {
  return <div className="not-prose my-8 grid grid-cols-3 gap-3 sm:gap-5">{children}</div>;
}

function Screenshot({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="m-0">
      <Image
        src={src}
        alt={alt}
        width={540}
        height={1168}
        sizes="(max-width: 768px) 33vw, 240px"
        className="w-full rounded-2xl border border-black/5"
        style={{ aspectRatio: "540 / 1168", objectFit: "cover" }}
      />
      {caption && <figcaption className="mt-2 text-center text-xs text-text-muted sm:text-sm">{caption}</figcaption>}
    </figure>
  );
}

export default function BlogPostBody({ post, locale }: { post: BlogPost; locale: Locale }) {
  const t = (k: string) => translate(locale, k);
  const intl = INTL_LOCALE[locale];
  const ArticleCTA = makeCta(t(post.cta === "android" ? "blog.ctaAndroid" : "blog.cta"), post.cta === "android");
  const a = makeAnchor(locale);
  const blogHref = locale === "en" ? "/blog" : `${localePath(locale)}/blog`;
  const canonicalPath = locale === "en" ? `/blog/${post.slug}` : `${localePath(locale)}/blog/${post.slug}`;

  const isFounderPost = post.author === FOUNDER_BYLINE;
  const related = getRelatedPosts(post.slug, locale);
  const postHref = (slug: string) => (locale === "en" ? `/blog/${slug}` : `${localePath(locale)}/blog/${slug}`);
  const formatDate = (d: string) => new Date(d).toLocaleDateString(intl, { year: "numeric", month: "long", day: "numeric" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: locale,
    // A named person where the founder wrote it (E-E-A-T); otherwise the
    // organization, whose /about page names the people behind it.
    author: isFounderPost
      ? { "@type": "Person", name: FOUNDER.name, jobTitle: FOUNDER.jobTitle, url: FOUNDER.url, sameAs: FOUNDER.sameAs }
      : { "@type": "Organization", name: post.author, url: `${SITE_URL}/about` },
    publisher: { "@type": "Organization", name: "Lumi", url: SITE_URL, logo: `${SITE_URL}/images/logo/logo-512.png` },
    // Same entity name as the root SoftwareApplication schema, so answer
    // engines resolve "Lumi" to this app rather than other products named Lumi.
    about: { "@type": "SoftwareApplication", name: BRAND_ENTITY_NAME, operatingSystem: "iOS", applicationCategory: "FinanceApplication", url: APP_STORE_URL },
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
              {post.updated && post.updated !== post.date ? (
                <span>
                  {t("blog.updated")} <time dateTime={post.updated}>{formatDate(post.updated)}</time>
                </span>
              ) : (
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              )}
              <span>&middot;</span>
              <span>{post.readingTime}</span>
              <span>&middot;</span>
              <Link href="/about" rel="author" className="hover:text-text transition-colors">{post.author}</Link>
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

          {post.image && (
            <Image
              src={post.image}
              alt={post.title}
              width={1200}
              height={630}
              priority
              sizes="(max-width: 768px) 100vw, 720px"
              className="mt-8 w-full rounded-2xl border border-black/5"
              style={{ aspectRatio: "1200 / 630", objectFit: "cover" }}
            />
          )}

          <div className="prose mt-12">
            <MDXRemote
              source={post.content}
              components={{ ArticleCTA, a, Screenshots, Screenshot }}
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

          {related.length > 0 && (
            <nav aria-labelledby="related-heading" className="mt-12">
              <h2 id="related-heading" className="text-xl font-bold">{t("blog.related")}</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={postHref(r.slug)}
                      className="block h-full rounded-2xl border border-black/5 bg-surface-2 p-4 transition-colors hover:border-primary/30"
                    >
                      <span className="font-semibold text-text">{r.title}</span>
                      <span className="mt-1 line-clamp-2 block text-sm text-text-muted">{r.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <aside className="mt-8 rounded-2xl border border-black/5 bg-surface-2 p-6 text-sm text-text-muted">
            <p className="mb-2 font-semibold text-text">{t("blog.aboutTitle")}</p>
            <p>{t("blog.aboutBody")}</p>
          </aside>
        </article>
      </main>
      <Footer />
    </>
  );
}

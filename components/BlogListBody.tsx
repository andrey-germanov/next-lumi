import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/blog";
import { translate, INTL_LOCALE, localePath, type Locale } from "@/lib/i18n";

export default function BlogListBody({ locale }: { locale: Locale }) {
  const posts = getAllPosts(locale);
  const t = (k: string) => translate(locale, k);
  const intl = INTL_LOCALE[locale];
  const base = locale === "en" ? "/blog" : `${localePath(locale)}/blog`;

  return (
    <>
      <Header />
      <main className="pt-24">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h1 className="text-4xl font-extrabold" style={{ letterSpacing: "-1px" }}>{t("lp.navBlog")}</h1>
          <p className="mt-4 text-text-muted">{t("blog.subtitle")}</p>

          <div className="mt-12 space-y-8">
            {posts.map((post) => (
              <Link key={post.slug} href={`${base}/${post.slug}`} className="surface group block rounded-2xl p-6 transition-all">
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString(intl, { year: "numeric", month: "long", day: "numeric" })}
                  </time>
                  <span>&middot;</span>
                  <span>{post.readingTime}</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold transition-colors group-hover:text-primary">{post.title}</h2>
                <p className="mt-2 text-text-muted">{post.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-full bg-surface-2 px-3 py-1 text-xs text-text-muted">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

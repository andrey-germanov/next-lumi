"use client";

import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import { useLang } from "@/components/dash/i18n";

interface BlogPreviewProps {
  posts: BlogPost[];
}

export default function BlogPreview({ posts }: BlogPreviewProps) {
  const { t, locale, formatDate } = useLang();
  if (posts.length === 0) return null;

  const prefix = locale === "en" ? "" : `/${locale}`;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ letterSpacing: "-1px" }}>
            {t("lp2.blogTitle")}
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post.slug}
              href={`${prefix}/blog/${post.slug}`}
              className="surface group rounded-2xl p-6 transition-all"
            >
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <time dateTime={post.date}>
                  {formatDate(post.date, { year: "numeric", month: "long", day: "numeric" })}
                </time>
                <span>&middot;</span>
                <span>{post.readingTime}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold transition-colors group-hover:text-primary">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-text-muted line-clamp-2">
                {post.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={`${prefix}/blog`}
            className="text-sm font-medium text-primary hover:text-accent transition-colors"
          >
            {t("lp2.blogViewAll")} &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

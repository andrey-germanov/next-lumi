import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips on personal finance, budgeting, expense tracking, and making the most of your money. From the team behind Lumi.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <main className="pt-24">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h1 className="text-4xl font-extrabold" style={{ letterSpacing: "-1px" }}>Blog</h1>
          <p className="mt-4 text-text-muted">
            Tips on personal finance, budgeting, and making the most of your
            money.
          </p>

          <div className="mt-12 space-y-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="surface group block rounded-2xl p-6 transition-all"
              >
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span>&middot;</span>
                  <span>{post.readingTime}</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold transition-colors group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mt-2 text-text-muted">{post.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface-2 px-3 py-1 text-xs text-text-muted"
                    >
                      {tag}
                    </span>
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

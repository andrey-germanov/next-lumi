import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

interface BlogPreviewProps {
  posts: BlogPost[];
}

export default function BlogPreview({ posts }: BlogPreviewProps) {
  if (posts.length === 0) return null;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Learn to spend smarter
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {posts.slice(0, 3).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-white/5 bg-bg-secondary p-6 transition-all hover:border-primary/20"
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
            href="/blog"
            className="text-sm font-medium text-primary hover:text-accent transition-colors"
          >
            View all articles &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

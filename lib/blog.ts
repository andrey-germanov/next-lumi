import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  image: string;
  tags: string[];
  readingTime: string;
  content: string;
}

export function getAllPosts(locale?: string): BlogPost[] {
  const posts = getAllSlugs().map((slug) => getPostBySlug(slug, locale));

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/** Localized MDX path if present (content/blog/<locale>/<slug>.mdx), else English. */
function resolvePostPath(slug: string, locale?: string): string {
  if (locale && locale !== "en") {
    const localized = path.join(BLOG_DIR, locale, `${slug}.mdx`);
    if (fs.existsSync(localized)) return localized;
  }
  return path.join(BLOG_DIR, `${slug}.mdx`);
}

export function getPostBySlug(slug: string, locale?: string): BlogPost {
  const filePath = resolvePostPath(slug, locale);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author,
    image: data.image,
    tags: data.tags || [],
    readingTime: stats.text,
    content,
  };
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  /**
   * Optional frontmatter `seoTitle:` — used for the <title> tag and og/twitter
   * titles when the editorial `title` (the on-page H1) exceeds ~70 characters.
   * Falls back to `title` when absent.
   */
  seoTitle?: string;
  description: string;
  date: string;
  /** Optional frontmatter `updated:` — last substantive edit, used for sitemap + dateModified. */
  updated?: string;
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

/**
 * Slugs that have a real translation file, per locale. Built once at module
 * load — the content directory does not change at runtime.
 */
const translatedSlugs: Map<string, Set<string>> = (() => {
  const map = new Map<string, Set<string>>();
  for (const entry of fs.readdirSync(BLOG_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const slugs = fs
      .readdirSync(path.join(BLOG_DIR, entry.name))
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
    map.set(entry.name, new Set(slugs));
  }
  return map;
})();

/**
 * True when `slug` has an actual translation for `locale`.
 *
 * `getPostBySlug` falls back to the English file when a translation is missing,
 * which is fine for rendering but must NOT be treated as a localized page: the
 * sitemap, hreflang, and canonical all need to know the difference, otherwise
 * we advertise English content as if it were localized.
 */
export function hasTranslation(slug: string, locale?: string): boolean {
  if (!locale || locale === "en") return true;
  return translatedSlugs.get(locale)?.has(slug) ?? false;
}

/** Locales (excluding "en") that have a real translation of `slug`. */
export function translatedLocales(slug: string): string[] {
  return [...translatedSlugs.entries()]
    .filter(([, slugs]) => slugs.has(slug))
    .map(([locale]) => locale);
}

export function getPostBySlug(slug: string, locale?: string): BlogPost {
  const filePath = resolvePostPath(slug, locale);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title,
    seoTitle: data.seoTitle,
    description: data.description,
    date: data.date,
    updated: data.updated,
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

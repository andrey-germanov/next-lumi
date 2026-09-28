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

  // Only surface a cover image the site can actually render: a local
  // /images/... path whose file exists under public/. Missing files (many
  // legacy posts reference covers that were never added) resolve to "" so the
  // article page can safely skip the hero instead of showing a broken image.
  const rawImage: string = data.image ?? "";
  const image =
    rawImage.startsWith("/") && !fs.existsSync(path.join(process.cwd(), "public", rawImage))
      ? ""
      : rawImage;

  return {
    slug,
    title: data.title,
    seoTitle: data.seoTitle,
    description: data.description,
    date: data.date,
    updated: data.updated,
    author: data.author,
    image,
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

/**
 * Posts kept live (existing links, citations) but out of the index: the
 * cost-of-living city pages rank 60–80 in GSC and pull traffic unrelated to the
 * app. They're noindexed, dropped from the sitemap, and not suggested as
 * related reading. Delete the prefix here to bring them back.
 */
const NOINDEX_PREFIXES = ["cost-of-living-"];

export function isNoindexPost(slug: string): boolean {
  return NOINDEX_PREFIXES.some((prefix) => slug.startsWith(prefix));
}

const RELATED_COUNT = 4;
/** Slug words that say nothing about the topic. */
const SLUG_STOPWORDS = new Set(["how", "the", "and", "for", "your", "you", "what", "best", "with", "does", "make", "2026", "vs"]);

const relatedCache = new Map<string, Map<string, string[]>>();

/**
 * Related slugs for every indexable post in a locale. Posts sharing rare tags
 * and slug words score highest (IDF-weighted, so "personal finance" on every
 * post counts for little). The first slots take the closest matches; the last
 * slot goes to the closest post that has the fewest inbound related links so
 * far — without it, most links pile onto a few hubs and dozens of posts end up
 * reachable only from the /blog listing.
 */
function relatedMap(locale: string): Map<string, string[]> {
  const cached = relatedCache.get(locale);
  if (cached) return cached;

  const slugs = getAllSlugs()
    .filter((slug) => !isNoindexPost(slug) && hasTranslation(slug, locale))
    .sort();
  // Always the English frontmatter: tags are English keywords in every locale.
  const tokens = new Map(
    slugs.map((slug) => {
      const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), "utf-8"));
      const tags: string[] = (data.tags ?? []).map((t: string) => t.toLowerCase());
      const words = slug.split("-").filter((w) => w.length > 2 && !SLUG_STOPWORDS.has(w));
      return [slug, new Set([...tags, ...words])];
    })
  );
  const df = new Map<string, number>();
  for (const set of tokens.values()) for (const t of set) df.set(t, (df.get(t) ?? 0) + 1);
  const idf = (t: string) => Math.log(slugs.length / (df.get(t) ?? 1));
  const score = (a: string, b: string) => {
    let s = 0;
    for (const t of tokens.get(a)!) if (tokens.get(b)!.has(t)) s += idf(t);
    return s;
  };

  const ranked = new Map(
    slugs.map((slug) => [
      slug,
      slugs
        .filter((other) => other !== slug)
        .map((other) => ({ other, s: score(slug, other) }))
        .sort((x, y) => y.s - x.s || x.other.localeCompare(y.other))
        .map((x) => x.other),
    ])
  );

  const inbound = new Map<string, number>(slugs.map((slug) => [slug, 0]));
  const result = new Map<string, string[]>();
  for (const slug of slugs) {
    const picks = ranked.get(slug)!.slice(0, RELATED_COUNT - 1);
    picks.forEach((p) => inbound.set(p, inbound.get(p)! + 1));
    result.set(slug, picks);
  }
  // Least-linked first, so orphans claim discovery slots before hubs do.
  const byNeed = [...slugs].sort((a, b) => inbound.get(a)! - inbound.get(b)! || a.localeCompare(b));
  for (const target of byNeed) {
    if (inbound.get(target)! > 0) break;
    // Give the orphan to the post that ranks it highest and has a free slot.
    const host = slugs
      .filter((s) => s !== target && result.get(s)!.length < RELATED_COUNT)
      .sort((a, b) => ranked.get(a)!.indexOf(target) - ranked.get(b)!.indexOf(target))[0];
    if (!host) break;
    result.get(host)!.push(target);
    inbound.set(target, 1);
  }
  for (const slug of slugs) {
    const picks = result.get(slug)!;
    if (picks.length >= RELATED_COUNT) continue;
    const candidates = ranked.get(slug)!.slice(RELATED_COUNT - 1, 30).filter((c) => !picks.includes(c));
    const pick = candidates.sort((a, b) => inbound.get(a)! - inbound.get(b)!)[0];
    if (pick) {
      picks.push(pick);
      inbound.set(pick, inbound.get(pick)! + 1);
    }
  }

  relatedCache.set(locale, result);
  return result;
}

/** Up to RELATED_COUNT related posts in `locale` (only real translations). */
export function getRelatedPosts(slug: string, locale: string = "en"): BlogPost[] {
  return (relatedMap(locale).get(slug) ?? []).map((s) => getPostBySlug(s, locale));
}

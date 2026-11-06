// Markdown renderings of content pages for AI agents (llms-visibility).
// Served at `/blog/<slug>.md` and `/tools/<slug>.md` and via
// `Accept: text/markdown` negotiation in proxy.ts. Built from the same sources
// as the HTML pages so the two never drift apart.

import { getAllSlugs, getPostBySlug, hasTranslation, isNoindexPost } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";
import { faqPlainText } from "@/lib/faqI18n";
import { PREFIXED_LOCALES, translate } from "@/lib/i18n";
import { TOOLS, getTool } from "@/lib/tools";
import { getToolFaq } from "@/lib/toolsFaq";

/**
 * Strip MDX-only syntax so the body reads as plain Markdown: the editorial
 * CTA component is dropped, screenshot galleries become Markdown images, and
 * any remaining JSX-looking block is removed.
 */
export function cleanMdx(content: string): string {
  return content
    .replace(/<ArticleCTA\s*\/>/g, "")
    .replace(/<Screenshots>\s*([\s\S]*?)<\/Screenshots>/g, (_, inner: string) =>
      inner
        .replace(
          /<Screenshot\s+src="([^"]+)"\s+alt="([^"]*)"(?:\s+caption="([^"]*)")?\s*\/>/g,
          (__, src: string, alt: string, caption?: string) =>
            `![${alt}](${SITE_URL}${src})${caption ? `\n*${caption}*` : ""}\n`
        )
    )
    .replace(/^\s*<\/?[A-Z][A-Za-z0-9]*[^>]*>\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function postMarkdown(slug: string, locale?: string): string | null {
  if (isNoindexPost(slug)) return null;
  let post;
  try {
    post = getPostBySlug(slug, locale);
  } catch {
    return null;
  }
  const isLocalized = locale && locale !== "en" && hasTranslation(slug, locale);
  const url = `${SITE_URL}${isLocalized ? `/${locale}` : ""}/blog/${slug}`;
  const lines = [
    `# ${post.title}`,
    "",
    `> ${post.description}`,
    "",
    `- Author: ${post.author}`,
    `- Published: ${post.date}`,
    post.updated ? `- Updated: ${post.updated}` : null,
    `- Reading time: ${post.readingTime}`,
    `- Canonical URL: ${url}`,
    "",
    cleanMdx(post.content),
    "",
  ];
  return lines.filter((l) => l !== null).join("\n");
}

export function toolMarkdown(slug: string): string | null {
  const meta = getTool(slug);
  if (!meta) return null;
  const title = translate("en", meta.titleKey);
  const description = translate("en", meta.descKey);
  const faq = getToolFaq(slug, "en");
  const faqBlock = faq.length
    ? ["## Frequently asked questions", "", ...faq.flatMap((f) => [`**${f.question}**`, "", faqPlainText(f.answer, SITE_URL), ""])]
    : [];
  return [
    `# ${title}`,
    "",
    `> ${description}`,
    "",
    `Free calculator by Lumi, the iPhone budgeting app. Canonical URL: ${SITE_URL}/tools/${slug}`,
    "",
    "Lumi is an iOS budgeting app that logs expenses by voice and imports Apple Pay payments without bank login.",
    "",
    ...faqBlock,
  ].join("\n");
}

/** Every Markdown route segment set: `blog/<slug>`, `<locale>/blog/<slug>`, `tools/<slug>`. */
export function markdownSegments(): string[][] {
  const blogSlugs = getAllSlugs().filter((slug) => !isNoindexPost(slug));
  const blog = blogSlugs.flatMap((slug) => [
    ["blog", slug],
    ...PREFIXED_LOCALES.filter((locale) => hasTranslation(slug, locale)).map((locale) => [locale, "blog", slug]),
  ]);
  const tools = TOOLS.map((t) => ["tools", t.slug]);
  return [...blog, ...tools];
}

/** Full English corpus for /llms-full.txt. */
export function llmsFullText(): string {
  const posts = getAllSlugs()
    .filter((slug) => !isNoindexPost(slug))
    .map((slug) => getPostBySlug(slug))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const sections = [
    `# Lumi (iPhone) — full site content`,
    "",
    `> Lumi is an iOS budgeting app that logs expenses by voice, auto-imports Apple Pay payments via iOS Shortcuts and works without bank login. Data stays on the device. Site: ${SITE_URL}. Index: ${SITE_URL}/llms.txt.`,
    "",
    "## Free calculators",
    "",
    ...TOOLS.map((t) => toolMarkdown(t.slug)),
    "",
    "## Blog posts",
    "",
    ...posts.map((p) => `### ${p.title}\n\nSource: ${SITE_URL}/blog/${p.slug}.md\n\n${cleanMdx(p.content)}\n`),
  ];
  return sections.join("\n");
}

#!/usr/bin/env node
/**
 * Mechanical QA for localized blog posts (docs/translation-plan.md §6).
 *
 *   node scripts/check-translations.mjs            # all locales
 *   node scripts/check-translations.mjs de es      # only these
 *
 * Checks each translated file against its English source. Exits 1 on any error.
 * Warnings (structure drift) don't fail the run — translators legitimately merge
 * or split the occasional paragraph — but they're worth eyeballing.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");
const TITLE_LIMIT = 70;
const DESC_MIN = 120;
const DESC_MAX = 160;
/** Frontmatter that must be byte-identical to the English source. */
const PRESERVED = ["date", "author", "image"];

const errors = [];
const warnings = [];
const err = (f, m) => errors.push(`${f}: ${m}`);
const warn = (f, m) => warnings.push(`${f}: ${m}`);

const read = (p) => matter(fs.readFileSync(p, "utf-8"));
const countHeadings = (body) => (body.match(/^#{2,4} /gm) ?? []).length;
const countTableRows = (body) => (body.match(/^\|/gm) ?? []).length;
const countCta = (body) => (body.match(/<ArticleCTA\s*\/>/g) ?? []).length;

const englishSlugs = fs
  .readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith(".mdx"))
  .map((f) => f.replace(/\.mdx$/, ""));

const allLocales = fs
  .readdirSync(BLOG_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const requested = process.argv.slice(2);
const locales = requested.length ? requested.filter((l) => allLocales.includes(l)) : allLocales;

for (const bad of requested.filter((l) => !allLocales.includes(l))) {
  console.error(`unknown locale: ${bad}`);
  process.exit(2);
}

let checked = 0;

for (const locale of locales) {
  const dir = path.join(BLOG_DIR, locale);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const label = `${locale}/${slug}`;
    checked++;

    // Orphan: a translated file whose English source no longer exists. It will
    // never be routed (getAllSlugs reads the English dir) and is dead weight.
    if (!englishSlugs.includes(slug)) {
      err(label, "no matching English source — orphaned file");
      continue;
    }

    let en, loc;
    try {
      en = read(path.join(BLOG_DIR, `${slug}.mdx`));
      loc = read(path.join(dir, file));
    } catch (e) {
      err(label, `frontmatter failed to parse: ${e.message}`);
      continue;
    }

    for (const key of PRESERVED) {
      if (String(loc.data[key] ?? "") !== String(en.data[key] ?? "")) {
        err(label, `${key} drifted from English ("${loc.data[key]}" vs "${en.data[key]}")`);
      }
    }

    if (!loc.data.title) err(label, "missing title");
    if (!loc.data.description) err(label, "missing description");

    // The <title> tag uses seoTitle when present — that's the string that must fit.
    const effective = loc.data.seoTitle ?? loc.data.title ?? "";
    if (effective.length > TITLE_LIMIT) {
      err(label, `title ${effective.length} chars (>${TITLE_LIMIT}) — add or shorten seoTitle`);
    }

    const desc = loc.data.description ?? "";
    if (desc && (desc.length < DESC_MIN || desc.length > DESC_MAX)) {
      warn(label, `description ${desc.length} chars (target ${DESC_MIN}-${DESC_MAX})`);
    }

    if (!Array.isArray(loc.data.tags) || loc.data.tags.length === 0) {
      warn(label, "no tags");
    }

    // Untranslated leftovers: identical title almost always means a copied file.
    if (loc.data.title === en.data.title) {
      warn(label, "title identical to English — possibly untranslated");
    }

    const enCta = countCta(en.content);
    const locCta = countCta(loc.content);
    if (enCta !== locCta) err(label, `ArticleCTA count ${locCta}, English has ${enCta}`);

    const enH = countHeadings(en.content);
    const locH = countHeadings(loc.content);
    if (enH !== locH) warn(label, `${locH} headings, English has ${enH}`);

    const enRows = countTableRows(en.content);
    const locRows = countTableRows(loc.content);
    if (enRows !== locRows) warn(label, `${locRows} table rows, English has ${enRows}`);

    // Internal links stay unprefixed in MDX; BlogPostBody adds the locale at
    // render time. A hardcoded prefix here would double up (/de/de/blog/...).
    const prefixed = loc.content.match(/\]\(\/(de|es|it|ja|ka|pl|ro|ru|uk)\//g);
    if (prefixed) err(label, `${prefixed.length} locale-prefixed internal link(s) — leave hrefs unprefixed`);
  }
}

const coverage = locales
  .map((l) => {
    const n = fs.readdirSync(path.join(BLOG_DIR, l)).filter((f) => f.endsWith(".mdx")).length;
    return `${l} ${n}/${englishSlugs.length}`;
  })
  .join("  ");

console.log(`\nchecked ${checked} files across ${locales.length} locale(s)`);
console.log(`coverage: ${coverage}\n`);

if (warnings.length) {
  console.log(`⚠ ${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  ${w}`);
  console.log("");
}

if (errors.length) {
  console.error(`✗ ${errors.length} error(s):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

console.log("✓ no errors");

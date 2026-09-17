// Tell IndexNow (Bing, Yandex & friends) about pages that changed.
// Bing flags whole-sitemap submissions as "batch mode", so the default is to
// send only what a deploy actually touched.
//
// Usage:
//   node scripts/indexnow.mjs                    → blog posts changed in the last commit (HEAD~1..HEAD)
//   node scripts/indexnow.mjs --since <ref>      → blog posts changed since <ref> (e.g. the previous deploy)
//   node scripts/indexnow.mjs <url> [<url>…]     → specific URLs only (landing, tools, FAQ edits)
//   node scripts/indexnow.mjs --all              → entire live sitemap; rare, e.g. after a site-wide change
// Run after the deploy is live, not before.

import { execFileSync } from "node:child_process";

const HOST = "lumi.herman-apps.com";
const SITE = `https://${HOST}`;
const KEY = "0f504d3c86b760b326a5e8a25374699e"; // must match public/<key>.txt
const LARGE_BATCH = 100;

async function getSitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

/** content/blog/<slug>.mdx → /blog/<slug>; content/blog/<locale>/<slug>.mdx → /<locale>/blog/<slug>. */
function changedPostUrls(since) {
  const out = execFileSync("git", ["diff", "--name-only", `${since}..HEAD`, "--", "content/blog"], { encoding: "utf8" });
  const urls = new Set();
  for (const file of out.split("\n").filter(Boolean)) {
    const m = file.match(/^content\/blog\/(?:([a-z]{2})\/)?([^/]+)\.mdx$/);
    if (!m) continue;
    const [, locale, slug] = m;
    const prefix = locale ? `/${locale}` : "";
    urls.add(`${SITE}${prefix}/blog/${slug}`);
    // New or removed posts also change the blog index listing.
    urls.add(`${SITE}${prefix}/blog`);
  }
  return [...urls];
}

const args = process.argv.slice(2);
let urlList;
if (args.includes("--all")) {
  urlList = await getSitemapUrls();
  console.warn(`⚠ Submitting the whole sitemap (${urlList.length} URLs). Bing reports this as batch mode — prefer changed URLs.`);
} else if (args.length && !args[0].startsWith("--")) {
  urlList = args;
} else {
  const sinceIdx = args.indexOf("--since");
  const since = sinceIdx >= 0 ? args[sinceIdx + 1] : "HEAD~1";
  if (!since) throw new Error("--since needs a git ref");
  urlList = changedPostUrls(since);
  console.log(`Blog posts changed since ${since}:`);
}

if (!urlList.length) {
  console.log("Nothing to submit.");
  process.exit(0);
}
if (urlList.length > LARGE_BATCH && !args.includes("--all")) {
  console.warn(`⚠ ${urlList.length} URLs is a large batch; Bing may flag it. Consider submitting in smaller deploys.`);
}
for (const u of urlList) console.log(`  ${u}`);
console.log(`Submitting ${urlList.length} URL(s) to IndexNow…`);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList,
  }),
});

// 200 = submitted, 202 = accepted (key not verified yet) — both are success.
console.log(`IndexNow response: ${res.status} ${res.statusText}`);
if (res.status >= 400) {
  console.error(await res.text());
  process.exit(1);
}

// Submit all sitemap URLs to IndexNow (Bing & friends pick them up instantly).
// Usage:
//   node scripts/indexnow.mjs                  → submit every URL from the live sitemap
//   node scripts/indexnow.mjs <url> [<url>…]   → submit specific URLs only
// Run after each deploy that adds or updates content.

const HOST = "lumi.herman-apps.com";
const KEY = "0f504d3c86b760b326a5e8a25374699e"; // must match public/<key>.txt

async function getSitemapUrls() {
  const res = await fetch(`https://${HOST}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const urlList = process.argv.length > 2 ? process.argv.slice(2) : await getSitemapUrls();
console.log(`Submitting ${urlList.length} URLs to IndexNow…`);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  }),
});

// 200 = submitted, 202 = accepted (key not verified yet) — both are success.
console.log(`IndexNow response: ${res.status} ${res.statusText}`);
if (res.status >= 400) {
  console.error(await res.text());
  process.exit(1);
}

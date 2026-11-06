import { SITE_URL } from "@/lib/constants";

// Served as a route handler (not app/robots.ts) so the Content-Signal line,
// which MetadataRoute.Robots cannot express, can be added. Search and
// AI-input use are allowed; AI training is left to the site owner.
// AI search & assistant crawlers are listed explicitly for GEO intent.
const AI_CRAWLERS = [
  "OAI-SearchBot", "GPTBot", "ChatGPT-User",
  "Claude-SearchBot", "ClaudeBot", "Claude-User", "anthropic-ai",
  "PerplexityBot", "Perplexity-User",
  "Google-Extended",
  "Applebot", "Applebot-Extended",
  "Amazonbot", "DuckAssistBot", "meta-externalagent", "CCBot",
];

export const dynamic = "force-static";

export function GET() {
  const groups = [
    ["*"],
    AI_CRAWLERS,
  ]
    .map((agents) =>
      [
        ...agents.map((a) => `User-Agent: ${a}`),
        "Content-Signal: search=yes, ai-input=yes",
        "Allow: /",
        "Disallow: /api/",
      ].join("\n")
    )
    .join("\n\n");

  return new Response(`${groups}\n\nSitemap: ${SITE_URL}/sitemap.xml\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

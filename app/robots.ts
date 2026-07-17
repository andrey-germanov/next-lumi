import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

// AI search & assistant crawlers, explicitly welcomed for GEO (generative
// engine optimization). "*" already allows them, but explicit groups document
// intent and survive future tightening of the default rule.
const AI_CRAWLERS = [
  // OpenAI: search index, training, user-triggered browsing
  "OAI-SearchBot",
  "GPTBot",
  "ChatGPT-User",
  // Anthropic
  "Claude-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google Gemini / AI Overviews grounding
  "Google-Extended",
  // Apple Intelligence / Siri
  "Applebot",
  "Applebot-Extended",
  // Others used by AI assistants
  "Amazonbot",
  "DuckAssistBot",
  "meta-externalagent",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
        disallow: "/api/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

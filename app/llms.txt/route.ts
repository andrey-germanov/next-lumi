import { getAllPosts, isNoindexPost } from "@/lib/blog";
import { TOOLS } from "@/lib/tools";
import { faqPlainText } from "@/lib/faqI18n";
import { FAQ, SITE_URL, APP_STORE_URL, BRAND_ENTITY_NAME } from "@/lib/constants";
import { translate } from "@/lib/i18n";

// llms.txt — a curated, plain-markdown map of the site for AI assistants and
// answer engines (https://llmstxt.org). Regenerated at build time.
export const dynamic = "force-static";

export async function GET() {
  const posts = getAllPosts().filter((p) => !isNoindexPost(p.slug));

  const blogLines = posts
    .map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`)
    .join("\n");

  const toolLines = TOOLS.map(
    (t) => `- [${translate("en", t.titleKey)}](${SITE_URL}/tools/${t.slug}): ${translate("en", t.descKey)}`
  ).join("\n");

  const faqLines = FAQ.map((f) => `- **${f.question}** ${faqPlainText(f.answer, SITE_URL)}`).join("\n");

  const body = `# ${BRAND_ENTITY_NAME} (iPhone)

> Lumi is an iOS budgeting app that logs expenses by voice ("coffee, five euros"),
> auto-imports Apple Pay payments via iOS Shortcuts, and logs spending with a
> Back Tap gesture without opening the app. No bank login required — all data
> stays on the device. Includes an AI month-end spending forecast, AI receipt
> scanner, category budgets, savings goals, and 150+ currencies.

Key facts:
- Platform: iOS 16+ (iPhone). An Android version is in closed beta on Google Play; sign up at ${SITE_URL}/android.
- Pricing: Free plan (10 AI receipt scans/month, 2 budgets, voice input, Apple Pay import, Back Tap). Premium $4.99/month or $39.99/year (unlimited scans and budgets, AI forecast, full multi-currency).
- Privacy: no bank account connection, no cloud storage of transactions, data stored on-device.
- Differentiators vs YNAB / Monarch / Copilot: Back Tap instant logging, Apple Pay auto-import without bank access, local-first privacy.
- App Store: ${APP_STORE_URL}
- App languages: English, Russian, Ukrainian, German, Spanish, Italian, Polish, Romanian, Japanese, Georgian.
- Website languages: English, German, Spanish, Italian, Romanian, Russian, Ukrainian.
- Not to be confused with other products named Lumi: this is the personal finance app for iPhone at ${SITE_URL}.

## Product

- [Homepage](${SITE_URL}/): what Lumi does and how voice logging works
- [FAQ](${SITE_URL}/faq): privacy, Apple Pay import, Back Tap, forecast accuracy, pricing
- [Android beta](${SITE_URL}/android): join the closed beta of Lumi for Android on Google Play
- [Privacy Policy](${SITE_URL}/privacy)
- [Terms of Service](${SITE_URL}/terms)

## FAQ (canonical answers)

${faqLines}

## Free Calculators

${toolLines}

## Blog

${blogLines}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

# Blog Translation Plan — 754 articles × 8 locales

**Scope:** translate all 124 English blog posts into `de`, `es`, `it`, `ja`, `pl`, `ro`, `ru`, `uk`.
`ka` (Georgian) is explicitly out of scope and stays at its current 7 posts.

**Status:** §2 blockers shipped, §6 QA script shipped. Translation batches not started.
`node scripts/check-translations.mjs` currently reports **0 errors** across 245 localized files.

---

## 1. Where we are

124 English posts in `content/blog/*.mdx`. Localized copies live at
`content/blog/<locale>/<slug>.mdx` and share the English slug.

| Locale | Have | Missing | Words to translate |
|---|---:|---:|---:|
| de | 61 | 63 | 32,732 |
| ro | 48 | 76 | 42,168 |
| ru | 48 | 76 | 42,168 |
| uk | 48 | 76 | 42,168 |
| es | 12 | 112 | 72,752 |
| it | 7 | 117 | 77,029 |
| ja | 7 | 117 | 77,029 |
| pl | 7 | 117 | 77,029 |
| **Total** | **248** | **754** | **463,075** |

### Missing posts by content cluster

| Cluster | EN posts | Avg words | es | ja | de | it | pl | ru | uk | ro | Missing |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| cost-of-living | 30 | 522 | 30 | 30 | 30 | 30 | 30 | 30 | 30 | 30 | **240** |
| how-to | 26 | 793 | 21 | 24 | 12 | 24 | 24 | 16 | 16 | 16 | 153 |
| other | 20 | 588 | 17 | 18 | 13 | 18 | 18 | 16 | 16 | 16 | 132 |
| glossary (`what-is-*`) | 22 | 459 | 22 | 22 | 0 | 22 | 22 | 2 | 2 | 2 | 94 |
| best-apps | 17 | 1,352 | 13 | 14 | 2 | 14 | 14 | 6 | 6 | 6 | 75 |
| comparison (`lumi-vs-*`) | 9 | 579 | 9 | 9 | 6 | 9 | 9 | 6 | 6 | 6 | 60 |

Two things fall out of this table:

- **`cost-of-living` is 0% translated in every single locale** — 240 of the 754 missing posts,
  32% of the backlog. It is also the cheapest cluster per post (522 words avg).
- **`de` has the glossary fully done** (22/22) while every other locale except ru/uk/ro has none.
  Coverage is uneven *within* locales, not just across them.

---

## 2. Three blockers to fix before translating anything — ✅ done

These are pre-existing bugs. Each one gets multiplied by 754 if we translate first and fix
later. All three are now fixed; the sections below describe what shipped.

> **Verification caveat.** `next build` could not be run during implementation (the sandbox is
> arm64; `node_modules` carries the macOS SWC binary). `tsc --noEmit` is clean and the gating
> logic was verified against the real content tree with a mirror script, but **run
> `npm run build` locally before deploying.**

### 2.1 The sitemap advertises translations that don't exist

`app/sitemap.ts` emits every slug × every prefixed locale unconditionally:

```ts
...PREFIXED_LOCALES.map((locale) => ({
  url: `${SITE_URL}/${locale}/blog/${slug}`, ...
}))
```

and `pageLanguagesMap()` declares full hreflang for all 10 locales on every post. But
`resolvePostPath()` in `lib/blog.ts` silently falls back to the English file when a
translation is missing. Net effect today: **~870 URLs serve English content at localized
URLs**, in the sitemap, with hreflang asserting they are German / Japanese / Polish.

**Fix (decided: gate the sitemap, keep the routes live):**

1. Add `hasTranslation(slug, locale): boolean` to `lib/blog.ts` — an `fs.existsSync` check on
   the same path `resolvePostPath` resolves, memoized at module load.
2. Add a per-slug `postLanguagesMap(siteUrl, slug)` alongside `pageLanguagesMap` that emits
   `en` / `x-default` plus only the locales where `hasTranslation` is true.
3. `app/sitemap.ts` — filter the locale entries through `hasTranslation`.
4. Both blog `generateMetadata` functions — use `postLanguagesMap`, and when the post is an
   English fallback set `alternates.canonical` to the **English** URL rather than the localized
   one. This is what keeps the route live without competing with itself in the index.
5. Optional but recommended: `robots: { index: false, follow: true }` on fallback pages.

The URLs come back into the sitemap automatically as translation files land — no manual list
to maintain.

### 2.2 Every internal link inside a translated post points at English

There are **802 internal links across the 248 existing translated posts, and 0 of them are
locale-prefixed.** A German reader on `/de/blog/how-to-budget` clicks a link and lands on
English `/blog/what-is-a-sinking-fund`.

`BlogPostBody.tsx` passes `components={{ ArticleCTA }}` to `MDXRemote` with no `a` override,
so relative hrefs in MDX render verbatim.

**Fix:** add an anchor override in `BlogPostBody.tsx` that prefixes same-origin hrefs with
`localePath(locale)`. Roughly:

```tsx
const A = ({ href = "", ...props }) =>
  href.startsWith("/") && locale !== "en"
    ? <Link href={`${localePath(locale)}${href}`} {...props} />
    : <a href={href} {...props} />;
// components={{ ArticleCTA, a: A }}
```

One change repairs all 802 existing links and means the 754 new posts can keep unprefixed
hrefs in their MDX — which is what makes translation a pure text operation.

Caveat to verify: `/tools/*` pages are localized (`app/[locale]/tools` exists), so prefixing is
safe there. Confirm any other linked paths have locale routes before shipping.

### 2.3 `seoTitle` is English-only

We added optional `seoTitle` frontmatter to keep `<title>` under 70 characters. The metadata
layer already falls back correctly (`post.seoTitle ?? post.title`), so nothing breaks — but
the localized titles have the same length problem:

| Locale | Titles over 70 chars |
|---|---:|
| ro | 33 of 48 |
| de | 23 of 61 |
| uk | 21 of 48 |
| ru | 19 of 48 |
| es | 7 of 12 |
| it | 5 of 7 |
| pl | 6 of 7 |
| ja | 0 of 7 |

German and Romanian run long against English by a wide margin, so this will recur on the new
posts. **Make `seoTitle` part of the translation contract** (§4) rather than a cleanup pass.

---

## 3. Sequencing

Priority is **market entry, not current footprint** — where we want to grow, not where we
already rank.

### Tier 1 — es, ja, de (292 posts, 182,513 words)

- **es** (112 missing) — largest addressable audience in the set.
- **ja** (117 missing) — high-value iOS market, weak local competition in budgeting content.
  Also the only locale with zero title-length problems, so it's cheap on that axis.
- **de** (63 missing) — smallest remaining gap of the three; reaching 100% here is the fastest
  full-locale win, and it unlocks complete hreflang reciprocity for a whole language.

Suggested order *within* tier 1: **de first** (finish it, prove the pipeline on the locale with
the most existing material to pattern-match against), then **es**, then **ja**.

### Tier 2 — it, pl (234 posts, 154,058 words)

Both sit at 7/124. Effectively greenfield; no reason to split them.

### Tier 3 — ru, uk, ro (228 posts, 126,504 words)

All three at 48/124 with identical gaps. Cheapest per locale to finish, lowest strategic
priority under a growth-first ranking. Worth reconsidering if these turn out to carry real
traffic — see §7.

### Cross-cutting quick win

`cost-of-living` × all 8 locales = **240 posts at ~522 words each**. It's a third of the
backlog, it's the cheapest cluster, and it's the one where zero locales have any coverage.
Consider running it as a dedicated sweep either before or in parallel with tier 1 — city
+ cost queries are high-intent and the posts are short and formulaic.

---

## 4. Translation contract

Derived from comparing existing `de` and `ru` files against their English sources.

**Translate:**

- `title`, `description`, `tags` (localized keyword equivalents, not transliterations)
- `seoTitle` — **required whenever the translated `title` exceeds 70 characters**
- All body prose, headings, table cell text, image alt text

**Preserve verbatim:**

- Filename / slug — `content/blog/<locale>/<same-slug>.mdx`
- `date`, `updated`, `author`, `image` (all locales share the English hero image)
- Product names (Qapital, Digit, Acorns, YNAB, Monarch, Lumi …)
- `<ArticleCTA />` component tags
- Internal link hrefs — leave unprefixed, §2.2 handles prefixing at render time
- Markdown structure: heading levels, table shape, bold/emphasis placement

**Localize, don't translate:**

- **Currency — decided.** `cost-of-living` posts **convert fully to the reader's local
  currency**. These describe real local spending, so a German reader should see euros rather
  than doing the conversion in their head.
  **Exception: app subscription prices stay in USD** (`4,99 $/Monat`, not `4,59 €/Monat`).
  Vendors like YNAB and Monarch price in USD and vary by store, so converting would invent
  numbers that go stale with the exchange rate. Apply local number formatting (comma decimal,
  postfix symbol) but keep the currency. This also resolves an existing inconsistency — the
  current German files mix `$4.99` and `4,99 $` within the same locale.
- Date and number formatting per locale convention.
- USDA / US-specific benchmarks — flag rather than silently transplant. Several `how-to` and
  grocery posts lean on US government data that has no local equivalent; the honest move is
  to keep the source attributed as US data.
- Register: `du` vs `Sie` in German, `ты` vs `вы` in Russian/Ukrainian. Existing `de` and `ru`
  files use the informal register — match it.

---

## 5. Batching

Batch = **one cluster × one locale**, capped at ~10 posts (~8k words). That yields roughly
**75–80 batches** for the full 754.

Rationale: cluster-scoped batches share terminology, tone, and structure, so a translator
(human or agent) builds context once and applies it consistently. Locale-scoped keeps register
decisions stable. The 10-post cap keeps any single unit reviewable in one sitting and
recoverable if it goes wrong.

Suggested batch ordering for de (the pilot locale):

| # | Batch | Posts | Words |
|---|---|---:|---:|
| 1 | de × cost-of-living (1/3) | 10 | ~5,200 |
| 2 | de × cost-of-living (2/3) | 10 | ~5,200 |
| 3 | de × cost-of-living (3/3) | 10 | ~5,200 |
| 4 | de × how-to | 12 | ~9,500 |
| 5 | de × other | 13 | ~7,600 |
| 6 | de × comparison | 6 | ~3,500 |
| 7 | de × best-apps | 2 | ~2,700 |
| | **de complete** | **63** | **~32,700** |

Run batch 1 alone and review it end-to-end before committing to the pattern.

### Batch 1 — ✅ shipped

Cities were chosen by relevance to a German reader rather than alphabetically: **Berlin,
Barcelona, Lissabon, Prag, Rom, Warschau, Bukarest, Bali, Bangkok, Dubai** (10 posts,
~5,300 words EN → ~5,500 words DE). `de` coverage 61 → 71/124; sitemap 369 → 379 URLs.

Conventions established here, applied to all future cost-of-living batches:

- **Reference currency swapped, not the local one.** The English posts quote the city's
  currency with a USD gloss (`30,000–45,000 Kč (~$1,300–2,000)`). German versions keep the
  local currency as primary and replace the USD gloss with EUR. Rome's stray `£684` was
  dropped outright.
- **Round-number FAQ headings get re-rounded.** "Can you live in Bangkok on $1,000 a month?"
  became "…von 900 € im Monat?" — a literal conversion (920 €) reads like a translation
  artifact in a headline.
- **Descriptions written to 120–160 chars**, not carried over from the English (which run
  165–200 and are the source of the 183 standing warnings).

Verified: heading count, table row count, and `<ArticleCTA />` position match the English
source exactly for all 10.

### Batch 2 — ✅ shipped

The international (non-US) remainder: **Tokio, Istanbul, Kyjiw, Tiflis, Mexiko-Stadt,
Medellín, Kuala Lumpur, Ho-Chi-Minh-Stadt, Kapstadt, Buenos Aires.** `de` coverage 71 → 81/124.
Zero errors, zero warnings on the new files, structural parity exact on all 10.

Additional conventions settled here:

- **City names use the German exonym** where one is standard: Tokio, Tiflis, Kapstadt,
  Mexiko-Stadt, Lissabon, Kyjiw. Slugs stay English (`cost-of-living-in-tbilisi`) — they're
  shared across all locales and must not be translated.
- **Kyiv is a judgment call.** German media and the Auswärtiges Amt have moved to *Kyjiw*, but
  German searchers still type *Kiew*. The H1 uses Kyjiw, the `seoTitle` carries
  "Kyjiw (Kiew)", and "Kiew" appears in the tags and first sentence. Worth revisiting if
  keyword data ever becomes available.
- **Currency-volatility posts keep their framing.** Istanbul, Buenos Aires, and Kyiv are
  written around "spend in the local currency, think in a hard one" — for German readers the
  hard currency is EUR rather than USD, which the translations reflect throughout, not just
  in the tables.

### Batch 3 — ✅ shipped

The 10 US cities: **Austin, Chicago, Denver, Houston, Los Angeles, Miami, New York City,
Phoenix, San Francisco, Seattle.** `de` coverage 81 → 91/124. **The cost-of-living cluster is
now 30/30 complete for German** — the first cluster finished in any locale.

US-specific conventions:

- **A `~EUR` column was added** to tables that had only `Monthly cost (USD)`. Adding a column
  leaves the row count unchanged, so structural parity holds.
- **Salaries stay in USD** (`60.000–80.000 $`). These are US job offers — a German reader
  evaluating one sees the dollar figure. Costs get the EUR reference because those are what
  you compare against life at home. Same logic as app-subscription pricing.
- **Imperial units converted**: `$5+ gas` → `ab rund 1,20 € pro Liter`; `70-mile-wide valley`
  → `110 Kilometer breit`. Gallons and miles are noise to a German reader.

### Batches 4–5 — ✅ shipped

**Batch 4** (8 posts): the remaining `comparison` cluster (`lumi-vs-bread`, `-buddy`,
`-budget-bestie`, `-fleur`, `-tapsheet`, `-toshl`) plus `best-budget-apps-for-families/students`.
**Comparison and best-apps clusters now complete for German.**

**Batch 5** (12 posts): the whole `how-to` cluster — the six `how-much-savings-by-*` posts, the
four `how-to-budget-in-your-*0s` posts, `how-much-to-spend-on-groceries`, and
`how-to-save-money-on-a-low-income`. **`how-to` cluster complete for German.**

`de` coverage 91 → **111/124**; sitemap 399 → 419 URLs. Zero errors, structural parity exact
on all 20.

#### Handling US-specific financial content — the rule applied

This batch was the first to hit content built on institutions that don't exist in Germany.
The contract says *flag, don't silently transplant*; in practice that meant three tiers:

1. **Currency-neutral logic passes through unchanged.** The Fidelity ladder (1× salary by 30,
   2× by 35 …) is a multiple of income, so it translates directly.
2. **US statistics stay in USD, explicitly attributed.** Median balances (`5.400 $`,
   `115.000 $`) are labelled as US survey data, and every savings-by-age post carries a one-line
   note that 401(k)/IRA map to *betriebliche Altersvorsorge, Basisrente, ETF-Sparplan* — the
   multiples transfer, the institutions don't.
3. **Actionable US advice is genuinely re-pointed.** "Max your 401(k), then IRA" is useless to a
   German reader, so the sequence became *bAV bis zum Arbeitgeberzuschuss → Basisrente →
   ETF-Sparplan*. `how-much-savings-by-50` needed the most work: US catch-up contributions have
   no German equivalent, so that section now names the mechanism, says plainly that it doesn't
   exist here, and gives the German lever with the same effect (Basisrente deduction ceiling +
   Entgeltumwandlung). "Social Security replaces ~40%" became the German Rentenniveau of ~48%.

**`how-much-to-spend-on-groceries` was deliberately left as US data.** The whole article is the
USDA four-tier table; there is no verified German equivalent to substitute, so the tiers stay in
USD with an explicit note that they are US prices and don't transfer — while the 10–15%-of-net
income rule, which does transfer, is given in euros. Inventing German grocery statistics would
have been worse than attributing American ones.

### Cost-of-living cluster: status

| Locale | Done | Remaining |
|---|---:|---:|
| de | **30/30** ✅ | 0 |
| es, it, ja, pl, ro, ru, uk | 0/30 | 30 each |

### Batch 6 — ✅ shipped — **German complete at 124/124**

The final 13 `other` posts: the `grocery-budget-family-of-4/5/6` series,
`single-person-monthly-budget`, `family-of-4-monthly-budget`, `average-monthly-expenses-2026`,
`average-savings-by-age`, `money-milestones-by-age`, `budgeting-when-living-alone`,
`budgeting-for-beginners`, `budgeting-mistakes-beginners-make`, `budgeting-for-large-families`,
`52-week-money-saving-challenge`.

**`de` is the first locale at 100%.** Sitemap 419 → 432 URLs; German hreflang is now complete
and reciprocal across all 124 posts. Structural parity verified across the entire locale —
124/124 posts match the English source on heading count, table rows, and `<ArticleCTA />`
position. Zero errors, `tsc` clean.

The USD-attribution rule from batch 5 carried through: BLS household averages, USDA grocery
tiers, and Fed median-savings data all stay in dollars with an explicit note that the
*structure and shares* transfer while the absolute amounts don't. Illustrative euro figures
(what a reader plugs their own numbers into) are localized throughout.

### German progress by cluster

| Cluster | de status |
|---|---|
| cost-of-living (30) | ✅ complete |
| glossary (22) | ✅ complete |
| how-to (26) | ✅ complete |
| comparison (9) | ✅ complete |
| best-apps (17) | ✅ complete |
| other (20) | ✅ complete |

**German: 124/124. Locale done.**

## 7b. Tier-1 push: es → it → ja

Priority reset to **es, it, ja** (346 posts). `es` and `it` both use EUR as the reader's
reference currency, so every euro figure computed for German transfers directly — the work is
prose translation, not re-deriving numbers. `ja` needs JPY as the reference and its own answer
for pension vehicles (iDeCo / NISA in place of bAV / Basisrente).

**`es` — 87/124.** Three clusters complete: **cost-of-living 30/30**, **comparison 9/9**,
**glossary 22/22**. How-to at 14/21. Zero errors, structural parity exact across all 87.
Sitemap 432 → 507 URLs.

Remaining for `es` (37): other 17, best-apps 13, how-to 7.

#### Spanish pension adaptation (savings-by-age series)

Same three-tier treatment as German, with Spain-specific answers:

- 401(k)/IRA → **planes de empleo, planes de pensiones individuales, cartera de fondos
  indexados**. Noted in every post that the multiples transfer but the institutions don't.
- US catch-up contributions have no Spanish equivalent either. `how-much-savings-by-50` names
  the US mechanism, says plainly it doesn't exist here, and points at the real Spanish lever:
  **planes de empleo admit a substantially higher deductible limit than individual plans**,
  which bites hardest exactly when the marginal rate is highest.
- **Social Security → pensión pública, handled carefully.** Germany got a concrete figure
  (Rentenniveau ~48%). Spain's replacement rate is historically among the highest in the OECD
  — well above the ~40% the US original assumes — but ongoing reform is moving it. Rather than
  quote a precise number I can't verify, the post frames it qualitatively: *a floor that is
  eroding, not the plan*. Directionally true, and it doesn't invent a statistic.

**The QA script earned its keep here.** While writing `what-is-a-shared-budget` I copied the
frontmatter skeleton from a neighbouring glossary post and carried over the wrong `date`
(2026-07-15 instead of 2026-07-16). `check-translations.mjs` failed the run immediately on the
preserved-field check. That class of error — a silently wrong date feeding the sitemap's
`lastModified` — is invisible to proofreading and would have quietly degraded crawl signals.
Worth remembering when adding new checks: the mechanical ones catch what human review can't.

Spanish glossary note: these posts use a fixed four-section skeleton (definition → *Cómo
funciona* → *Por qué importa* → *Cómo ayuda Lumi* → related links). Keeping that skeleton
identical is what holds structural parity, and the illustrative euro amounts are re-based to
European salary levels (e.g. a raise example of 3.000 € → 3.800 € rather than the US
$4,000 → $5,000) so the arithmetic reads natively.

Spanish-specific conventions settled:

- **City names use Spanish exonyms**: Berlín, Lisboa, Praga, Varsovia, Bucarest, Tokio,
  Estambul, Dubái, Ciudad del Cabo, Ciudad Ho Chi Minh. Slugs stay English.
- **Voice-logging examples stay in the local language of the city** («caña dos cincuenta» in
  Barcelona, «pivo cincuenta coronas» in Prague) — the same choice made for German.
- Remaining for `es` cost-of-living: the 10 US cities plus Tiflis and Kyiv.

## 8. Where the project stands

| Locale | Coverage | Remaining |
|---|---:|---:|
| **de** | **124/124** ✅ | **0** |
| ro | 48/124 | 76 |
| ru | 48/124 | 76 |
| uk | 48/124 | 76 |
| es | 12/124 | 112 |
| it | 7/124 | 117 |
| ja | 7/124 | 117 |
| pl | 7/124 | 117 |
| **Total remaining (excl. ka)** | | **691** |

63 of the original 754 are done. Every convention the remaining 691 need is now settled and
proven end-to-end on a full locale: currency handling, city exonyms, US-data attribution,
description length, structural parity, and the QA gate. A second locale should move
substantially faster than the first.

**Recommended next:** `es` and `ja` were your tier-1 growth markets. Either is now a
mechanical application of the established conventions — the only genuinely new work per locale
is the US-institution adaptation in the savings-by-age series (§ batch 5), which needs a
country-specific answer for pension vehicles each time.

---

## 6. QA checklist

Per batch, mechanical checks first (scriptable), then editorial:

- [ ] File count matches the batch manifest; filenames identical to English slugs
- [ ] Frontmatter parses (`gray-matter`); `date`, `author`, `image` byte-identical to English
- [ ] Effective title (`seoTitle ?? title`) ≤ 70 characters
- [ ] `description` present, 120–160 characters
- [ ] Heading count and levels match the English source
- [ ] Table row/column counts match the English source
- [ ] `<ArticleCTA />` present, same position as English
- [ ] No untranslated English paragraphs (spot-check + language-detect pass)
- [ ] `npm run build` succeeds; `npx tsc --noEmit` clean
- [ ] Sitemap URL count increased by exactly the batch size
- [ ] Native-speaker read of at least 1 post per batch, 100% for `ja`

`scripts/check-translations.mjs` implements every mechanical item above.

```
node scripts/check-translations.mjs          # all locales
node scripts/check-translations.mjs de es    # only these
```

Exits non-zero on errors, so it can gate CI. Structure drift (heading/table/description
counts) is reported as a warning rather than an error — translators legitimately merge the
occasional paragraph — but warnings are where the real bugs showed up.

**What it caught on first run:** five files (`de` ×4, `es` ×1) had silently dropped their
entire `## Quick comparison` section — heading plus a 7–8 row table — while translating the
surrounding prose correctly. Three more (`ru`/`uk`/`ro` `how-to-log-expenses-without-typing`)
had dropped the FAQ entry about non-English voice input, which is the single most relevant
question for those audiences. All eight are fixed. Since the same slug broke across multiple
locales, this looks like systematic behavior in whatever produced these files rather than
eight independent mistakes — worth understanding before running 754 more posts through it.

Remaining: **183 description-length warnings** (descriptions running 160–260 chars against a
120–160 target). Pre-existing, cosmetic, and not yet addressed.

---

## 7. Open questions

1. **No traffic data exists to validate any of this.** The PostHog project has no `$pageview`
   event — it's the mobile app project, not the web property. Ahrefs and SimilarWeb connectors
   are installed but unauthorized, and `docs/seo-content-plan.md:202` already flags this as the
   missing input. Authorizing one of them, or wiring Search Console, would let us re-rank tiers
   against real demand instead of intent. **Recommend doing this before tier 2 starts.**
2. **Currency policy for `cost-of-living`** (§4) — needs a decision before the 240-post sweep.
3. **Who translates.** This plan is pipeline-agnostic. `docs/seo-content-plan.md` refers to an
   "existing translation-agent pipeline"; that isn't in this repo (`scripts/` contains only
   `indexnow.mjs`), so the actual mechanism needs to be identified or built.
4. **`ka` divergence.** Georgian stays at 7/124 and will fall further behind. If the sitemap
   gate ships, its 117 phantom URLs disappear — which is correct, but worth a conscious call.
5. **IndexNow.** `scripts/indexnow.mjs` exists; confirm new localized URLs get submitted as
   batches land rather than waiting on organic recrawl.

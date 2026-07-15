# Lumi SEO Content Plan — 3 Archetypes

Goal: build a programmatic content engine to close the gap with Finny (~320 posts) using
Lumi's structural advantage: **every English post ships in 10 languages** (hreflang), so
each article = 10 indexed pages. Finny is English-only.

Three archetypes, in priority order for Lumi:
1. **"What is X"** — evergreen glossary/definition pages (cheap, high informational volume).
2. **"Best X apps 2026"** — commercial listicles by niche / audience / geo / feature (BOFU, converts).
3. **How-to / guides** — practical mid-funnel guides.

Existing posts (do NOT duplicate): `best-apps-for-financial-goals-2026`,
`best-budget-apps-2026`, `best-free-budgeting-apps-2026`, `how-to-budget`,
`how-to-track-spending-that-actually-sticks`, `i-built-an-app-to-solve-my-spending-problem`,
`what-quitting-smoking-taught-me-about-impulse-spending`.

Every post uses the existing MDX system (`content/blog/<slug>.mdx`, frontmatter +
`<ArticleCTA />`), auto-registers via `getAllSlugs()`, gets dynamic OG image, and is
translated ×9 with the existing agent pipeline into `content/blog/<locale>/<slug>.mdx`.

---

## Prioritization principle

Rank by **intent × Lumi-relevance**, not raw volume. Lead with topics that both rank AND
convert for Lumi — its differentiators: **no bank login, Apple Pay / Back Tap, multi-currency,
AI receipt scanning, voice input, iOS, privacy, offline**. Exact search volumes require Ahrefs
(connector needs auth); priority tiers below are intent+fit based.

- **Tier 1 (do first):** high intent OR directly showcases a Lumi differentiator.
- **Tier 2:** solid evergreen volume, moderate fit.
- **Tier 3:** topical-authority filler (investing/tax adjacency), batch later.

---

## Archetype 1 — "What is X" glossary

Route/section idea: keep in `/blog` (fastest) or a dedicated `/learn/<slug>` glossary type
later. Template below. ~350–700 words each. Each links to a related calculator and/or Lumi feature.

### Tier 1 (budgeting / spending / tracking core)
| Slug | Primary keyword | Lumi angle / internal link |
|---|---|---|
| what-is-a-sinking-fund | what is a sinking fund | budgets feature; link how-to-build-emergency-fund |
| what-is-the-50-30-20-rule | what is the 50/30/20 rule | link 50-30-20-budget-calculator + how-to-budget |
| what-is-zero-based-budgeting | zero-based budgeting | link how-to-budget |
| what-is-the-envelope-method | envelope method / cash stuffing | category budgets |
| what-is-pay-yourself-first | pay yourself first | savings goals |
| what-is-an-emergency-fund | what is an emergency fund | emergency-fund-calculator |
| what-is-discretionary-spending | discretionary spending | spending-by-category |
| what-is-a-variable-expense | variable expense | forecast |
| what-is-a-fixed-expense | fixed expense | budgets |
| what-is-lifestyle-creep | lifestyle creep / inflation | analytics/period comparison |
| what-is-impulse-spending | impulse spending | link existing quit-smoking post |
| what-is-a-spending-trigger | spending trigger | insights |
| what-is-the-30-day-rule | 30-day rule (saving) | savings goals |
| what-is-conscious-spending | conscious spending | forecast |
| what-is-a-spending-limit | spending limit | category budgets |
| what-is-a-budget | what is a budget | how-to-budget pillar |
| what-is-expense-tracking | what is expense tracking | Back Tap / Apple Pay |
| what-is-a-no-spend-challenge | no-spend challenge | how-to-do-a-no-spend-month |
| what-is-a-financial-goal | what is a financial goal | savings goals + goals calculator |
| what-is-net-worth | what is net worth | analytics |

### Tier 2 (adjacent money concepts)
what-is-cash-flow · what-is-the-latte-factor · what-is-frugal-living ·
what-is-a-high-yield-savings-account · what-is-a-money-date · what-is-a-money-mindset ·
what-is-financial-literacy · what-is-a-cash-diet · what-is-a-no-spend-day ·
what-is-a-spending-fast · what-is-good-debt-vs-bad-debt · what-is-a-credit-score ·
what-is-credit-utilization-ratio · what-is-debt-to-income-ratio

### Tier 3 (investing/tax adjacency — topical authority, batch later)
what-is-compound-interest (link ci-calculator!) · what-is-apr-vs-apy · what-is-a-roth-ira ·
what-is-a-401k · what-is-an-index-fund · what-is-an-etf · what-is-fire ·
what-is-the-4-percent-rule · what-is-passive-income · what-is-inflation ·
what-is-dollar-cost-averaging · what-is-a-tax-bracket · what-is-capital-gains-tax

---

## Archetype 2 — "Best X apps 2026" listicles

Commercial/BOFU. Must be honest comparisons (real competitor data via research), Lumi featured
where it genuinely wins. 1,200–1,800 words. Include a comparison table + FAQ (FAQPage JSON-LD).
**Requires a research step per article** (WebSearch competitor pricing/features).

### Tier 1 — Lumi-differentiator cuts (rank + convert best)
| Slug | Primary keyword | Why Tier 1 |
|---|---|---|
| best-expense-trackers-no-bank-login-2026 | expense tracker no bank login | Lumi's #1 differentiator |
| best-receipt-scanner-apps-2026 | best receipt scanner apps | AI scan core feature |
| best-multi-currency-expense-tracker-2026 | multi-currency expense tracker | 150+ currencies |
| best-apps-to-track-apple-pay-spending-2026 | track Apple Pay spending | Tap/Back Tap unique |
| best-ios-budget-apps-2026 | best iOS budget apps | iOS-only product |
| best-ynab-alternatives-2026 | YNAB alternatives | huge BOFU volume |
| best-mint-alternatives-2026 | Mint alternatives | Mint shut down, high demand |

### Tier 2 — audience cuts
best-budget-apps-for-students-2026 · best-budgeting-app-for-couples-2026 ·
best-expense-tracker-for-freelancers-2026 · best-budget-apps-for-families-2026 ·
best-travel-budget-apps-2026 · best-budget-apps-for-adhd-2026 ·
best-offline-expense-tracker-apps-2026 · best-voice-expense-tracker-apps-2026 ·
best-monarch-money-alternatives-2026 · best-simple-budget-apps-2026

### Tier 3 — geo cuts (leverage i18n; pair with localized versions)
best-budgeting-apps-europe-2026 · best-budgeting-apps-uk-2026 ·
best-budgeting-apps-canada-2026 · best-budgeting-apps-australia-2026 ·
best-budgeting-apps-india-2026 · best-euro-expense-trackers-2026

---

## Archetype 3 — How-to / guides

Practical, mid-funnel. 900–1,400 words. Actionable steps + Lumi as the effortless way.

### Tier 1 — Lumi-native workflows + high intent
| Slug | Primary keyword |
|---|---|
| how-to-track-apple-pay-spending | how to track Apple Pay spending |
| how-to-log-expenses-without-typing | log expenses without typing |
| how-to-track-cash-spending | how to track cash spending |
| how-to-track-expenses-for-taxes | track expenses for taxes |
| how-to-budget-with-variable-income | budgeting with irregular income |
| how-to-stop-overspending | how to stop overspending |
| how-to-track-spending-with-adhd | track spending with ADHD |
| how-to-track-multiple-currencies | track expenses in multiple currencies |

### Tier 2 — life-event budgeting (long-tail, high intent)
how-to-budget-for-a-wedding · how-to-budget-for-a-baby · how-to-budget-for-a-move ·
how-to-budget-for-groceries · how-to-budget-in-your-20s · how-to-split-expenses-on-a-trip ·
how-to-split-bills-with-roommates · how-to-recover-from-overspending-on-vacation

### Tier 3 — saving/method guides
how-to-save-money-fast · how-to-save-money-on-a-low-income · how-to-build-an-emergency-fund-fast ·
how-to-do-a-no-spend-month · how-to-track-business-expenses-on-iphone ·
how-to-avoid-foreign-transaction-fees · how-to-save-money-for-students

---

## Article templates (reusable)

### "What is X"
1. H1 = "What Is [X]? [Plain-English Definition]"
2. 2–3 sentence direct answer in the first paragraph (featured-snippet target).
3. How it works / example with numbers.
4. Why it matters / common mistakes.
5. How Lumi helps (1 short paragraph) + `<ArticleCTA />`.
6. Related terms (internal links to other glossary posts) + related calculator.
7. Optional 2–3 Q&A → FAQPage JSON-LD.

### "Best X apps 2026"
1. H1 = "Best [X] Apps in 2026: [angle]"
2. Quick verdict / top pick table (comparison table).
3. 5–10 apps, each: what it's best for, pricing, pros/cons. Lumi featured honestly.
4. Buyer's guide (what to look for).
5. FAQ → FAQPage JSON-LD. `<ArticleCTA />` mid-article.
   **Research step required:** WebSearch each competitor for current pricing/features.

### How-to
1. H1 = "How to [do X]"
2. Short intro naming the pain.
3. Numbered steps.
4. Tips / mistakes.
5. "The effortless way" → Lumi + `<ArticleCTA />`.
6. Optional FAQ JSON-LD.

---

## Internal linking / topic clusters

- **Pillars** (already exist / strong): `how-to-budget`, `how-to-track-spending-that-actually-sticks`.
- Each glossary term links up to its pillar and sideways to 3–5 sibling terms.
- Each how-to links to relevant glossary terms + a calculator + a "best apps" listicle.
- Each "best apps" listicle links to how-tos and the calculators.
- Every article links to the relevant **calculator** (`/tools/*`) and one Lumi feature.

## Production pipeline

1. **Generate EN drafts in batches** via subagents (per-archetype template prompt).
   - Glossary + how-to: template-driven, no research → fast, high parallelism.
   - "Best apps": add a WebSearch research step per article (real competitor data).
2. **QA pass**: MDX safety (no bare `<` before letters), `<ArticleCTA />` present, internal links valid, `npm run build`.
3. **Translate ×9** with the existing translation-agent pipeline → `content/blog/<locale>/<slug>.mdx`.
4. **Ship**: auto-sitemap + hreflang already handle indexing. Submit sitemap in Search Console.

## Phasing (suggested)

| Phase | Scope | EN posts | With ×10 i18n = indexed pages |
|---|---|---:|---:|
| 1 | All Tier 1 across 3 archetypes (20 T1 glossary + 7 T1 listicles + 8 T1 how-to) | ~35 | ~350 |
| 2 | Tier 2 across all three | ~32 | ~320 |
| 3 | Tier 3 (glossary investing/tax, geo listicles, saving guides) | ~33 | ~330 |
| **Total** | | **~100 EN** | **~1,000 pages** |

At ~100 English posts × 10 locales = **~1,000 indexed pages** — exceeding Finny's ~320
English URLs, on the same content, using the i18n multiplier they don't have.

## Cadence options
- **Sprint (recommended):** run Phase 1 as one batch (subagents), ship ~35 posts + translations in a few passes.
- **Drip:** N posts/week via a repeatable batch command.

## Open items needing your input / auth
- Authorize **Ahrefs / SimilarWeb** connectors → real search volumes + keyword-gap to reorder priorities by actual demand.
- Decide: keep glossary in `/blog` (fastest) or add a dedicated `/learn/<slug>` type (cleaner IA, slightly more work).
- Confirm competitor set + honesty stance for "best apps" listicles (Lumi featured but truthful).

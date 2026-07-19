# Content Plan — Age Series, Audience Series, City Series

Extends `seo-content-plan.md`. Same MDX pipeline, same templates, ×10 locales.
Principle: win **long-tails with a number or a named modifier** in the query — big sites
target "how to budget"; we target "how much should I have saved by 35" and
"grocery budget for a family of 5". Low competition, snippet-friendly, converts to a tracker app.

---

## Series A — Money by age (20 / 25 / 30 / 35 / 40 / 45 / 50)

Two query families. The decade form ("in your 20s") carries advice intent; the exact-age
form ("by 25") carries **benchmark intent** — people want a number. Benchmark pages are the
biggest winnable long-tail here: every bank targets "savings by age" generically, few have a
dedicated page per age.

### A1. Benchmark pages (highest priority — featured-snippet targets)
| Slug | Primary keyword | Long-tails absorbed |
|---|---|---|
| average-savings-by-age | average savings by age (pillar) | median savings by age, savings benchmarks |
| how-much-savings-by-25 | how much money should I have saved by 25 | average savings at 25, net worth at 25 |
| how-much-savings-by-30 | how much money should I have saved by 30 | savings by 30, 1x salary by 30 |
| how-much-savings-by-35 | how much saved by 35 | average 401k at 35, behind on savings at 35 |
| how-much-savings-by-40 | how much saved by 40 | 3x salary by 40, catch up savings 40 |
| how-much-savings-by-45 | how much saved by 45 | behind on retirement at 45 |
| how-much-savings-by-50 | how much saved by 50 | retirement savings at 50, catch-up contributions |

Template: direct answer with the number in paragraph 1 (Fidelity multiples + Fed SCF
median/average table) → "why most people are behind" → "how to catch up" → tracking as step 1
→ Lumi CTA. Each links to the emergency-fund + 50/30/20 calculators and to its neighbors
(by-30 ↔ by-35). Pillar links to all seven.

### A2. Decade guides (advice intent)
| Slug | Primary keyword |
|---|---|
| how-to-budget-in-your-20s | budgeting in your 20s (already in old plan Tier 2 — promote) |
| how-to-budget-in-your-30s | budgeting in your 30s (mortgage, childcare, lifestyle creep) |
| how-to-budget-in-your-40s | budgeting in your 40s (peak earnings, catch-up) |
| how-to-budget-in-your-50s | budgeting in your 50s (pre-retirement) |
| money-milestones-by-age | financial milestones by age 25/30/35/40 (bridges A1↔A2) |

### A3. Optional money-amount series (later; user said "можно про деньги тоже")
how-to-live-on-2000-a-month · how-to-live-on-2500-a-month · how-to-live-on-3000-a-month ·
budgeting-on-a-30k-salary · budgeting-on-a-40k-salary · budgeting-on-a-50k-salary.
Same benchmark logic (query contains a number). Ship after A1/A2 prove out.

---

## Series B — Audience budgeting guides

### B1. Beginners ("budgeting for dummies")
| Slug | Primary keyword | Notes |
|---|---|---|
| budgeting-for-beginners | budgeting for beginners / budgeting for dummies | Pillar #2 next to `how-to-budget`. "How to budget" = method; this = zero-knowledge on-ramp: first budget in 30 minutes, jargon-free, links every glossary term |
| budgeting-mistakes-beginners-make | common budgeting mistakes | listicle, links to pillar |

### B2. Singles
| Slug | Primary keyword | Notes |
|---|---|---|
| single-person-monthly-budget | average monthly expenses for one person / single person budget | dedicated page; `average-monthly-expenses-2026` links down to it |
| budgeting-when-living-alone | living alone budget / first apartment budget | rent-heavy math, no one to split with |

### B3. Families (large + by size — mini programmatic set)
| Slug | Primary keyword | Notes |
|---|---|---|
| budgeting-for-large-families | large family budget / budgeting for big families | pillar for the set |
| family-of-4-monthly-budget | average monthly budget family of 4 | benchmark numbers (BLS/USDA) |
| grocery-budget-family-of-4 | grocery budget for family of 4 | USDA food-plan tiers table |
| grocery-budget-family-of-5 | grocery budget for family of 5 | $939–$1,520/mo USDA range |
| grocery-budget-family-of-6 | grocery budget for family of 6 | thrifty vs liberal plan table |
| best-budget-apps-for-families-2026 | family budget app | already in old plan Tier 2 — promote, links from all of B3 |

Family-size grocery pages are the same programmatic trick as cost-of-living cities:
one template, USDA data, number-in-query long-tails with weak competition
(mostly mom-blogs, no product sites).

---

## Series C — Cost of living, cities (mix US + world)

Existing series: 20 international cities (nomad-tilted). Extend with the two gaps:
**US majors** (main traffic market, zero coverage now) and **top-demand world capitals**.

### C1. US cities (priority — matches US search market)
new-york-city · los-angeles · chicago · san-francisco · miami · austin · seattle ·
denver · houston · phoenix
(slug pattern: `cost-of-living-in-<city>`, same template as existing 20)

### C2. World capitals (extend existing series)
london · paris · amsterdam · madrid · singapore · toronto · sydney · seoul ·
vienna · budapest

### C3. Long-tails inside each city page (H2 sections, not separate pages)
- "Cost of living in X for a single person" (links to B2)
- "for a family of 4" (links to B3)
- "vs [nearby cheaper city]" comparison sentence
- "rent in X" own H2 (rent-specific queries collapse into the page)

Each city page already converts well for Lumi: multi-currency + moving/nomad audience.
US pages additionally link to A1 benchmarks ("is my rent normal for my age/income").

---

## Which long-tails we can actually take (summary logic)

1. **Number-in-query** — "by 35", "family of 5", "on $2,500 a month": SERPs are weaker
   (banks answer generically, blogs are thin), snippet extractable, we answer with a table.
2. **Audience modifier** — "for beginners", "living alone", "large family": competitor
   listicles ignore these; we pair each with an existing best-apps listicle for BOFU capture.
3. **City + situation** — "cost of living in Austin for a single person": covered as H2s,
   ranks via the city page without extra URLs.
4. **×10 locale multiplier** — every page ships in 10 languages; localized versions of
   number-queries ("сколько нужно накопить к 30") have near-zero competition.

Validate/reorder with real volumes once the **Ahrefs connector is authorized** (currently not).

---

## Phasing

| Phase | Content | EN posts | ×10 locales |
|---|---|---:|---:|
| 1 | A1 benchmarks (7) + B1 beginners (2) + C1 US cities (10) | 19 | 190 |
| 2 | A2 decade guides (5) + B2 singles (2) + B3 families (6) | 13 | 130 |
| 3 | C2 world capitals (10) + A3 money-amounts (6) | 16 | 160 |
| **Total** | | **48** | **~480** |

Production: same subagent batch pipeline as `seo-content-plan.md` (draft → MDX QA →
`npm run build` → translate ×9 → sitemap). A1 and B3 require a small research step per
article (Fed SCF / Fidelity / USDA / BLS numbers); city pages reuse the existing
cost-of-living research template.

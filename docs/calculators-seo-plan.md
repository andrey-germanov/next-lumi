# Калькуляторы Lumi — план на максимальную SEO-отдачу

Что сделано: в движок `/tools/[slug]` добавлено **13 новых калькуляторов** (было 8, стало 21). Все на английском, остальные 9 локалей рендерятся через fallback до перевода. Каждый роут уже получает hreflang ×10, FAQPage + Breadcrumb JSON-LD, related-linking и CTA — автоматически из реестра.

Новые: loan, monthly-budget, salary, inflation, discount, vat, sales-tax, simple-interest, auto-loan, rent-affordability, debt-consolidation, retirement, roi.

## Почему это прибыльно для SEO

Калькуляторы — лучший actbr формат для программатик-SEO: высокий informational + commercial intent, вечнозелёные, естественно набирают backlinks, и у Lumi структурное преимущество — **каждый = 10 индексируемых страниц** (hreflang). 21 калькулятор × 10 языков = **210 страниц** из ~1000 строк кода, без ручного контента на каждую.

FAQ на каждой странице сериализуется в FAQPage schema → шанс на rich snippets и попадание в AI-ответы (важно, у вас уже есть `llms.txt` и GEO-стратегия).

## Приоритет запуска (по intent × fit)

Tier 1 — толкать первыми (высокий объём + прямой мост к продукту): **monthly-budget, loan, salary, discount, inflation**. Budget и salary — вход в воронку Lumi; discount/inflation — массовый casual-трафик для link velocity.

Tier 2: **vat, sales-tax, auto-loan, rent-affordability, simple-interest**. VAT/sales-tax критичны для EU/US локалей соответственно.

Tier 3: **debt-consolidation, retirement, roi** — topical authority, добивать позже.

## Внутренняя перелинковка (главный рычаг)

Движок уже линкует related-калькуляторы между собой. Чтобы выжать максимум, добавьте ручные связки калькулятор ↔ блог (у вас 320+ постов в плане):

- monthly-budget ↔ `how-to-budget`, `what-is-a-budget`, `how-to-track-spending-that-actually-sticks`
- loan / debt-consolidation ↔ `how-to-stop-overspending`, посты про долги
- salary ↔ `how-to-budget-in-your-30s`, `how-to-save-money-on-a-low-income`
- rent-affordability ↔ `cost-of-living-in-*` (у вас уже есть Chicago, Kyiv, SF, Denver, Mexico City — идеальный якорь)
- retirement / roi ↔ `best-apps-for-financial-goals`, FIRE-калькулятор

Действие: в каждый релевантный MDX-пост добавьте ссылку на калькулятор, а в описания калькуляторов — обратные ссылки на 1-2 поста. Cost-of-living посты → rent-affordability даёт самый сильный тематический кластер.

## Монетизация (воронка в приложение)

Каждый калькулятор уже заканчивается CTA-блоком «Track it for real in Lumi» + App Store кнопкой с `location="tools_cta"`. Убедитесь, что этот location трекается в аналитике (PostHog проект уже подключён) — так увидите, какие калькуляторы реально конвертят в установки, и удвоите контент вокруг победителей.

Быстрая победа: budget, rent, salary калькуляторы показывают «что делать дальше» — там CTA конвертит лучше всего, потому что пользователь уже в режиме планирования.

## Перевод (следующий шаг)

Сейчас новые строки только `en` (~90 ключей в `MESSAGES` + FAQ в `content/tools-faq/en.json`). Чтобы включить мультиязычное преимущество, прогоните существующий agent-пайплайн переводов по:
1. Новым ключам `calc.*` в `lib/i18n.ts` (заполнить ru/uk/ro/de/es/it/pl/ja/ka).
2. FAQ: создать `content/tools-faq/{locale}.json` по образцу `en.json`.

До перевода локали показывают English (fallback) — не битые страницы, но hreflang уже заявляет локализованную версию, поэтому перевод FAQ/полей стоит сделать в приоритете для EU-языков (de/es/it/pl) и ru/uk.

## Где что лежит

Реестр: `lib/tools.ts` · Компоненты + математика: `components/tools/calculators.tsx` · Строки: `lib/i18n.ts` · FAQ: `content/tools-faq/en.json` · Роуты/sitemap/hreflang — уже generic, править не нужно.

Проверка: `npx tsc --noEmit` проходит; консистентность реестр↔компоненты↔ключи↔FAQ — 21/21; математика сверена с эталонными значениями (заём 20k/7.5%/5л = $400.76/мес).

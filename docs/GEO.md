# GEO (Generative Engine Optimization) — план для Lumi

Цель: попадать в ответы ChatGPT, Perplexity, Claude, Gemini / AI Overviews по запросам вида "best budget app iphone", "expense tracker without bank login", "YNAB alternatives".

## Что уже сделано (июль 2026)

- `robots.ts` — явно разрешены все AI-краулеры: OAI-SearchBot, GPTBot, ChatGPT-User, Claude-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot и др.
- `/llms.txt` — карта сайта для LLM: факты о продукте, цены, отличия от конкурентов, FAQ с готовыми ответами, все статьи блога и калькуляторы. Генерируется на билде.
- JSON-LD уже был: SoftwareApplication (layout), FAQPage (все локали), Article (блог).
- Sitemap с hreflang и честными lastModified.

## Как AI-поиски выбирают источники

- ChatGPT search берёт результаты из **индекса Bing** → без индексации в Bing вас там нет.
- Perplexity — свой индекс (PerplexityBot) + любит свежие даты и таблицы.
- Gemini / AI Overviews — индекс Google, grounding через Google-Extended.
- Все движки чаще цитируют страницы с прямым ответом в первых 1–2 предложениях под заголовком, таблицами сравнения, конкретными цифрами и датой обновления.

## Что делать дальше (по приоритету)

1. **Bing Webmaster Tools** — зарегистрировать сайт, отправить sitemap. Это самый быстрый выигрыш для ChatGPT search. Заодно включить **IndexNow** (мгновенная индексация новых статей в Bing).
2. **Off-site упоминания** — LLM доверяют консенсусу источников. Lumi должен упоминаться там, откуда движки берут ответы про budget apps: Reddit (r/personalfinance, r/ynab, r/iphone — честные посты, не спам), Product Hunt, обзорные статьи-листиклы сторонних сайтов, YouTube-обзоры. Одно упоминание в чужом "best budget apps 2026" листикле весит больше, чем десять своих статей.
3. **Формат статей** (уже близко к идеалу, поддерживать):
   - прямой ответ в первых 40–60 словах под каждым H2;
   - таблицы сравнения (уже есть);
   - конкретные цифры и цены, `updated:` в frontmatter при правках;
   - год в заголовке ("2026") — обновлять ежегодно.
4. **Свежесть** — раз в квартал обновлять топ-статьи (цены конкурентов меняются) и ставить `updated:` — dateModified попадает в schema и sitemap.
5. **Замер** — в PostHog построить insight по referrer: `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `claude.ai`, `copilot.microsoft.com`. Это и есть GEO-трафик. Плюс раз в месяц вручную спрашивать движки "best voice expense tracker iphone" и смотреть, цитируют ли Lumi.

## Проверка после деплоя

- `https://lumi.herman-apps.com/llms.txt` открывается и содержит актуальные статьи.
- `https://lumi.herman-apps.com/robots.txt` содержит группы AI-ботов.
- В логах хостинга появляются заходы GPTBot / PerplexityBot / ClaudeBot.

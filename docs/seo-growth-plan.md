# SEO-план органического роста Lumi

Текущая база: 42 EN-статьи (10 листиклов, 10 how-to, 21 глоссарий, 2 истории), полный DE-перевод, 6 калькуляторов, hreflang + x-default, Article-schema. База сильная — рост дадут кластеры ниже.

## 1. Главные дыры (быстрые победы)

**ES-блог: 7 из 42 статей.** Испанский — 2-й язык по объёму поиска в вашей теме, страница-лендинг уже локализована. Дотянуть 35 статей — самый дешёвый прирост трафика.

**Нет pillar-страницы под «voice expense tracker».** Мы поставили voice в title сайта, но единственная страница, которая может ранжироваться по этому запросу, — сам лендинг. Конкуренция по запросу почти нулевая (ниша новая) — нужна отдельная статья-хаб.

**Кластер couples из ASO отсутствует в блоге.** В сторе «couples/shared» теперь в 20+ локалях, в блоге — ноль целевых статей. Запросы типа «budget app for couples with separate accounts» — низкая конкуренция, высокий интент.

**Fake lastModified в sitemap.** `new Date()` при каждом билде помечает все страницы «обновлёнными» — Google быстро перестаёт доверять таким датам. Брать дату из frontmatter поста.

**Article-schema без dateModified и автора-Person.** Добавить `dateModified`, автора как Person со ссылкой на страницу /about (E-E-A-T). Страницы /about сейчас нет — а история «solo developer построил трекер без доступа к банку» это и E-E-A-T, и линкбейт.

## 2. Лонгтейл-ядро: новые статьи по кластерам

### Voice (приоритет 1 — под новое позиционирование)
| Slug | Целевой запрос |
|---|---|
| best-voice-expense-tracker-apps-2026 | voice expense tracker |
| how-to-log-expenses-by-voice-iphone | log expenses by voice / hands free expense tracking |
| track-expenses-with-siri-shortcuts | siri expense tracking, shortcuts expense log |

### Couples / shared (приоритет 1 — синхрон с ASO)
| Slug | Целевой запрос |
|---|---|
| best-budget-apps-for-couples-2026 | budget app for couples |
| how-to-budget-as-a-couple-separate-accounts | budgeting with separate accounts |
| how-to-split-expenses-with-your-partner | split expenses with partner |
| what-is-a-shared-budget | shared budget (глоссарий) |

### Apple Pay / iPhone-механики (приоритет 2 — TOFU-трафик с высоким объёмом)
| Slug | Целевой запрос |
|---|---|
| how-to-see-apple-pay-transaction-history | where to see apple pay transactions (большой объём, слабая выдача) |
| what-is-back-tap-iphone | back tap iphone (фичевый запрос → продукт) |
| apple-pay-vs-card-spending-awareness | does apple pay make you spend more (вопросный запрос) |

### Subscriptions (в сторе есть блок, в блоге — ничего)
| Slug | Целевой запрос |
|---|---|
| how-to-track-subscriptions | subscription tracker, track subscriptions |
| how-to-find-forgotten-subscriptions | forgotten subscriptions, unused subscriptions |
| average-subscription-spending-2026 | how much do people spend on subscriptions (data-статья → бэклинки) |

### Альтернативы конкурентам (приоритет 2 — высокий интент; есть только Mint и YNAB)
best-monarch-money-alternatives-2026, best-rocket-money-alternatives-2026, best-copilot-money-alternatives-2026, best-spendee-alternatives-2026, best-monefy-alternatives-2026 (последние два сильны в EU — под it/pl/ro локали).

### Ситуативный лонгтейл (приоритет 3)
expense-tracker-for-freelancers-iphone, how-to-track-expenses-while-traveling, budget-app-for-digital-nomads, how-to-track-expenses-in-two-currencies (уже частично есть — сузить заголовок под запрос).

## 3. Новые калькуляторы (programmatic лонгтейл)

Калькуляторы — ваш лучший формат: нулевой износ, ссылки, hreflang уже настроен. Добавить:

- **subscription-cost-calculator** — «how much do my subscriptions cost per year» (связка с кластером subscriptions)
- **couple-expense-split-calculator** — раздельный/пропорциональный сплит по доходам (связка с couples)
- **daily-spending-calculator** — «how much can I spend per day» (высокочастотный практический запрос)
- **vacation-savings-calculator** — сезонный трафик
- **latte-factor-calculator** — «small purchases add up» — вирусный формат

К каждому калькулятору — FAQ-блок с FAQPage-schema (у tools уже есть schema-инфраструктура) и 2–3 перелинкованные статьи.

## 4. Заголовки: правки существующих статей

Паттерн сейчас хороший («10 Best…», «How to…», «What is…»). Усилить мелочами:

- В листиклы добавить год И месяц обновления в подзаголовке («Updated July 2026») + реальный dateModified — CTR в выдаче заметно выше у «свежих».
- «how-to-log-expenses-without-typing» → переименовать H1/title в «How to Log Expenses by Voice (Without Typing a Word)» — сейчас статья не таргетирует voice-запрос, хотя контент о нём.
- В what-is-статьи добавить блок «People also ask» (3–4 вопроса с короткими ответами) + FAQPage-schema — шанс попасть в PAA-сниппеты.
- У всех листиклов проверить, что Lumi не первый в списке ранжирования — «честный» обзор с Lumi на 2–3 месте конвертирует и линкуется лучше.

## 5. Мелочи (техническое и он-пейдж)

1. sitemap: lastModified из frontmatter, а не `new Date()`.
2. Article-schema: + dateModified, + author как Person → /about.
3. BreadcrumbList-schema на blog и tools (сейчас нет).
4. aggregateRating в SoftwareApplication JSON-LD, как только в сторе будет ≥5 оценок — звёзды в выдаче.
5. Страница /about (история solo-разработчика) + указать её в Organization/Person schema.
6. Хаб-страница глоссария /blog/glossary со списком всех 21 what-is-статей — концентрирует внутренние ссылки.
7. Внутренняя перелинковка по правилу: каждая статья → 1 калькулятор + 2 статьи своего кластера + 1 листикл. Сейчас проверить автоматом (скрипт: посты без внутренних ссылок).
8. Related posts под статьёй по тегам (если ещё нет).
9. В конце каждой статьи кластера — CTA под кластер (voice-статьи → voice-демо, couples → couples-секция), а не общий.
10. Alt-тексты картинок блога с ключевиком.
11. Search Console: проверить индексацию всех 10 локалей, следить за каннибализацией листиклов (best-budget vs best-free-budgeting vs best-ios — близкие запросы; развести интенты в title).
12. RSS-фид блога (дистрибуция + быстрая индексация).

## 6. Порядок работ

1. Мелочи 1–3 + переименование voice-статьи — один день, эффект на весь сайт.
2. Voice-кластер (3 статьи) + best-budget-apps-for-couples — закрывает новое позиционирование.
3. ES-переводы догнать до 42.
4. Subscription-кластер + subscription-калькулятор.
5. Остальные альтернативы конкурентам + couples-калькулятор.
6. Дальше — по данным Search Console: расширять то, что уже показывается на 8–20 позициях.

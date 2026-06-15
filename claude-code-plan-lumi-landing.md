# Claude Code Plan: Lumi Landing Page

> **Инструкция для Claude Code.** Скопируй этот файл и скорми Claude Code как промпт.
> Он создаст полностью рабочий Next.js проект с SEO-оптимизированным лендингом + блогом.

---

## Контекст продукта (ОБЯЗАТЕЛЬНО для Claude Code)

**Lumi** — iOS-приложение (React Native + Expo, версия 2.43.0) для трекинга финансов.

**Ключевые фичи (реально реализованные):**
- AI-сканирование чеков через OpenAI Vision API (не базовый OCR — полноценный LLM-парсинг: сумма, дата, магазин, категория, список товаров, работает с чеками на любом языке)
- Multi-currency поддержка с автоматической конвертацией по реальным курсам
- Бюджеты с алертами и визуальным прогрессом
- Savings goals с отслеживанием прогресса и milestone-ами
- Аналитика: категории, тренды, daily heatmap, сравнение периодов, AI-прогнозирование расходов
- Quick Actions (шаблоны для частых расходов — 1 тап)
- Трекинг доходов
- Экспорт: PDF, CSV, JSON
- Локализация: EN / RU / UA
- Тёмная тема (основной дизайн приложения: градиент #0A0E1A → #1A1F2E)
- Biometric security (Face ID / Touch ID)
- Полностью offline — данные хранятся локально (MMKV + AsyncStorage)
- Adapty для подписок, PostHog для аналитики

**Чего НЕТ (by design):**
- Bank sync — нет и не планируется (privacy-first positioning)
- Cloud sync
- Recurring transactions (пока)

**Монетизация:**
- Free: 10 AI-сканов/мес, 2 бюджета, базовая аналитика, неограниченный ручной ввод
- Premium: безлимитные сканы, безлимитные бюджеты, мультивалюта, расширенная аналитика + прогнозирование, PDF-экспорт

**Позиционирование (из ASO-исследования 18 конкурентов):**
> Lumi — единственное приложение на пересечении: AI-сканирование чеков + мультивалюта + privacy-first.
> Ближайшие конкуренты: Wally (базовый OCR, не AI), Expensify (бизнес, не для личных финансов).

**App Store listing (уже утверждено):**
- Title: `Lumi: AI Expense Tracker`
- Subtitle: `Receipt Scanner & Budget`
- A/B варианты subtitle: `Smart Receipt & Money Tracker` | `Scan Receipts, Track Spending`

**Целевая аудитория:** 20–30 лет, global EN, путешественники, экспаты, digital nomads, фрилансеры, privacy-conscious Gen Z.

**Существующие маркетинговые ресурсы:**
- 15 скриншотов приложения в `/marketing-assets/` (AiInsights, Balance, Budget, Goal, Analytics, QuickExpense, Recommendation и др.)
- Threads-стратегия на 30 дней
- Reddit-анализ с цитатами пользователей
- Готовые описания на 3 языках
- financial-health-test.html (интерактивный тест)
- lumi-intro-animation.html, lumi-marketing-video.html

---

## Что нужно создать

SEO-оптимизированный лендинг + блог. Лендинг конвертирует посетителей в установки из App Store. Блог генерирует органический SEO-трафик по long-tail запросам.

---

## Стек

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** (анимации)
- **next-mdx-remote** или **contentlayer** (для блога на MDX)
- Deploy: **Vercel**

---

## Структура проекта

```
lumi-landing/
├── app/
│   ├── layout.tsx              # Root layout: шрифты, мета, PostHog analytics
│   ├── page.tsx                # Главная страница (лендинг)
│   ├── blog/
│   │   ├── page.tsx            # Список статей блога
│   │   └── [slug]/
│   │       └── page.tsx        # Отдельная статья
│   ├── privacy/
│   │   └── page.tsx            # Privacy Policy
│   ├── terms/
│   │   └── page.tsx            # Terms of Service
│   ├── sitemap.ts              # Динамический sitemap
│   ├── robots.ts               # robots.txt
│   └── opengraph-image.tsx     # OG image generation (dynamic)
├── components/
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── HowItWorks.tsx
│   ├── MultiCurrency.tsx       # NEW: отдельная секция для мультивалюты
│   ├── Comparison.tsx
│   ├── Pricing.tsx             # Free vs Premium тiers
│   ├── Testimonials.tsx
│   ├── CTA.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── AppStoreButton.tsx
│   └── blog/
│       ├── BlogCard.tsx
│       └── TableOfContents.tsx
├── content/
│   └── blog/                   # MDX файлы статей
│       ├── best-budget-apps-2026.mdx
│       └── i-built-an-app-to-solve-my-spending-problem.mdx
├── lib/
│   ├── blog.ts                 # Утилиты для чтения MDX
│   └── constants.ts            # Тексты, ссылки, мета-данные
├── public/
│   ├── images/                 # Скриншоты из marketing-assets/
│   │   ├── screenshots/        # Реальные скриншоты приложения
│   │   └── blog/               # OG-картинки для статей
│   └── fonts/
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## SEO-требования (критически важно)

### 1. Metadata API

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://getlumi.app'),
  title: {
    template: '%s | Lumi — AI Expense Tracker',
    default: 'Lumi — AI Expense Tracker | Scan Receipts, Track Spending, No Bank Login',
  },
  description: 'Lumi is an AI-powered expense tracker. Scan receipts with AI Vision, track spending in any currency, set budgets and savings goals — all without connecting your bank. Privacy-first. Free to start.',
  keywords: ['AI expense tracker', 'receipt scanner', 'budget app', 'expense tracker no bank', 'multi currency expense tracker', 'personal finance', 'spending tracker', 'money management', 'travel expense tracker', 'private budget app'],
  authors: [{ name: 'Lumi' }],
  creator: 'Lumi',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://getlumi.app',
    siteName: 'Lumi',
    title: 'Lumi — AI Expense Tracker | Scan Receipts, No Bank Login',
    description: 'AI scans your receipts. Track spending in any currency. No bank login required. Free to start.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Lumi — AI Expense Tracker' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumi — AI Expense Tracker',
    description: 'Snap a receipt. AI extracts everything. Track spending across currencies — no bank login needed.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://getlumi.app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};
```

**Важно:** Keywords таргетируют low-competition запросы из ASO-исследования: "AI expense tracker" (difficulty 10-20), "receipt scanner budget" (15-25), "expense tracker no bank" (10-15), "multi currency expense" (10-15), "travel expense tracker" (25-35).

### 2. JSON-LD Structured Data

```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Lumi: AI Expense Tracker",
  "operatingSystem": "iOS",
  "applicationCategory": "FinanceApplication",
  "description": "AI-powered expense tracker with receipt scanning, multi-currency support, and budgets. No bank login required.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "AI Receipt Scanning",
    "Multi-Currency Support",
    "Budget Management",
    "Savings Goals",
    "Expense Analytics",
    "AI Spending Forecast",
    "PDF/CSV/JSON Export"
  ]
})}} />
```

Для блога — Article schema с author, datePublished, publisher.

### 3. Sitemap, robots.ts, Performance

Те же требования что и раньше: SSG, next/image, next/font, PostHog (уже используется в приложении — consistency).

---

## Секции лендинга (app/page.tsx)

### Секция 1: Hero

```
H1: "Snap a receipt. AI does the rest."
Subheadline: "Lumi extracts every detail from your receipts in seconds —
              amount, items, category. Track spending in any currency.
              No bank login. No manual typing. Just point and shoot."
CTA: [Download Free on App Store]
Visual: Мокап iPhone с экраном AI-сканирования (использовать скриншот из
        marketing-assets/add-expense-modal-with-scan-receipt.jpg)
Trust line: "Free to start · Works in any currency · No bank login · 🔒 Privacy-first"
```

**SEO:** H1 содержит "receipt" + "AI". Подзаголовок содержит "currency", "bank login", "spending".

### Секция 2: Problem → Solution

```
H2: "Tired of apps that just show you charts?"

Три боли из Reddit-исследования:
Pain 1: "Manual entry is homework nobody wants to do"
  → Solution: "Scan a receipt in 2 seconds. AI reads amount, date, merchant, items — in any language."

Pain 2: "I don't want to give my bank credentials to an app"
  → Solution: "Lumi never asks for bank access. Your data stays on your device."

Pain 3: "I travel — my budget app only works in USD"
  → Solution: "Track expenses in dollars, euros, yen — any currency. Auto-conversion at real rates."
```

### Секция 3: Features (4 столпа — добавлена мультивалюта)

```
H2: "Everything you need to understand your money."

Feature 1: "AI Receipt Scanning"
- Snap a photo → AI Vision extracts amount, date, merchant, category, items
- Works with receipts in any language
- Parses individual items with prices
- Скриншот: marketing-assets/AiInsights.jpg

Feature 2: "Multi-Currency, Everywhere"
- Track in $, €, ¥, £, ₽, ₴ or any currency
- Automatic real-time conversion
- Perfect for travel, expat life, remote work
- Скриншот: marketing-assets/Balance.jpg

Feature 3: "Budgets That Alert You"
- Set spending limits by category
- Visual progress indicators
- Alerts before you overspend
- Скриншот: marketing-assets/budget.jpg

Feature 4: "Savings Goals"
- Set targets with progress tracking
- Milestone celebrations
- See how your habits affect the timeline
- Скриншот: marketing-assets/goal.jpg
```

### Секция 4: How It Works

```
H2: "3 taps. 2 seconds. Done."

Step 1: "Point your camera at a receipt" → скриншот сканирования
Step 2: "AI extracts everything instantly" → скриншот результата парсинга
Step 3: "See your full picture — budgets, goals, analytics" → скриншот дашборда

CTA: [Start for Free]
```

### Секция 5: Comparison Table

```
H2: "How Lumi compares to other budget apps"

| Feature | Lumi | YNAB ($109/yr) | Monarch ($100/yr) | Copilot ($96/yr) | Wally ($40/yr) |
|---------|------|----------------|-------------------|------------------|----------------|
| AI Receipt Scanning | ✅ AI Vision | ❌ | ❌ | ❌ | ⚠️ Basic OCR |
| Multi-Currency | ✅ Auto-convert | ⚠️ Limited | ❌ | ❌ | ✅ |
| Bank Login Required | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Works Offline | ✅ | ❌ | ❌ | ❌ | ❌ |
| AI Forecasting | ✅ | ❌ | ❌ | ⚠️ Basic | ❌ |
| Privacy-First | ✅ Local storage | ❌ Cloud | ❌ Cloud | ❌ Cloud | ❌ Cloud |
| Price | Free / Premium | $109/yr | $100/yr | $96/yr | $40/yr |
```

**SEO:** Эта таблица таргетирует "YNAB alternative", "Monarch Money vs", "best budget app comparison", "Copilot alternative".

### Секция 6: Pricing (Free vs Premium)

```
H2: "Start free. Upgrade when you're ready."

FREE:
- 10 AI receipt scans/month
- 2 budgets
- Basic analytics
- Unlimited manual entries
- 1 primary + 1 additional currency
CTA: [Download Free]

PREMIUM:
- Unlimited AI scans
- Unlimited budgets
- Full multi-currency support
- Advanced analytics + AI forecasting
- Period comparison
- PDF export
- Priority support
CTA: [Start Free Trial]
```

### Секция 7: Social Proof

```
H2: "Built by a solo developer. Loved by people who hate spreadsheets."

Reddit-цитаты (реальные боли → как Lumi решает):
- "Manual entry is homework nobody wants to do" — r/personalfinance
  → "That's why Lumi scans receipts. Zero typing."

- "Why do all budget apps want my bank login?" — r/YNAB
  → "Lumi doesn't. Your data stays on your phone."

Факт: "Analyzed 18 competitors. Lumi is the only app combining AI scanning + multi-currency + privacy."
```

### Секция 8: Blog Preview

```
H2: "Learn to spend smarter"
3 последних статьи из блога
```

### Секция 9: Final CTA

```
H2: "Your receipts tell a story. Let AI read it."
Subtext: "Free to start. No bank login. No credit card required."
CTA: [Download Lumi on App Store]
```

### Footer

```
Links: Blog, Privacy Policy, Terms of Service, Contact
Social: Threads, Twitter/X, Instagram
Languages: 🇺🇸 English · 🇷🇺 Русский · 🇺🇦 Українська
App Store badge
"Built with ❤️ for people who want to understand their money"
```

**Privacy Policy и Terms:** уже существуют в проекте как HTML файлы — конвертировать в Next.js страницы.

---

## Блог (app/blog/)

### Реализация

MDX файлы в `content/blog/`. Каждая статья:
- Уникальный `<title>` и `<meta description>`
- JSON-LD Article schema
- Dynamic OG image
- Table of Contents из H2/H3
- Related articles внизу
- CTA к App Store после 2-го раздела и в конце
- Время чтения (автоматически)

### SEO-стратегия для блога (из ASO-исследования)

Приоритет — long-tail запросы с низкой конкуренцией:
- "best budget apps 2026 comparison" (intent: informational → landing)
- "expense tracker without bank login" (intent: commercial → App Store)
- "AI receipt scanner app" (intent: commercial → App Store)
- "multi currency expense tracker travel" (intent: commercial → App Store)
- "how to track spending" (intent: informational → awareness)

---

## Analytics

**PostHog** (уже используется в приложении — consistency):
- Page views, session duration
- App Store click events
- Blog article read depth
- UTM parameter tracking

---

## Команды для запуска

```bash
npx create-next-app@latest lumi-landing --typescript --tailwind --app --src-dir=false
cd lumi-landing
npm install framer-motion next-mdx-remote gray-matter reading-time rehype-slug rehype-autolink-headings remark-gfm posthog-js
npm run dev
```

---

## Дизайн-токены (из реального UI приложения)

```css
/* Цветовая палитра — соответствует dark theme приложения */
--color-bg-primary: #0A0E1A;     /* Основной фон (из дизайна приложения) */
--color-bg-secondary: #1A1F2E;   /* Вторичный фон / карточки */
--color-bg-card: #1E293B;        /* Карточки */
--color-primary: #6366F1;        /* Indigo — основной акцент */
--color-primary-dark: #4F46E5;
--color-accent: #22D3EE;         /* Cyan — вторичный акцент */
--color-success: #10B981;        /* Green — savings, goals achieved */
--color-warning: #F59E0B;        /* Amber — budget alerts */
--color-danger: #EF4444;         /* Red — overspending */
--color-text: #F8FAFC;           /* Основной текст */
--color-text-muted: #94A3B8;     /* Вторичный текст */

/* Типографика */
--font-heading: 'Inter', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
```

Стиль: dark fintech, consistent с дизайном приложения. Ориентиры: Mercury, Linear, Vercel. Лендинг должен визуально продолжать UI приложения.

---

## Чеклист после создания

- [ ] Lighthouse: Performance 95+, SEO 100, Accessibility 95+
- [ ] Все страницы: уникальный title, description, OG image
- [ ] sitemap.xml генерируется с блогом
- [ ] JSON-LD валиден (Google Rich Results Test)
- [ ] Все изображения: next/image + alt-text
- [ ] App Store кнопка: PostHog event tracking
- [ ] Блог: SSG, без client-side fetching
- [ ] Mobile responsive: 375px, 390px, 428px
- [ ] Dark theme (основной — соответствует приложению)
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] Privacy Policy и Terms конвертированы из существующих HTML
- [ ] Скриншоты из marketing-assets/ используются в секциях
- [ ] PostHog интегрирован (consistency с iOS-приложением)

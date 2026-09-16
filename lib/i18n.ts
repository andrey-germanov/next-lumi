// ============================================================================
// Lumi web i18n — 10 languages.
// Category names are lifted verbatim from the mobile app's locale files so they
// match across platforms; the UI microcopy below is web-specific.
// ============================================================================

import landingEn from "@/content/landing/en.json";
import landingRu from "@/content/landing/ru.json";
import landingUk from "@/content/landing/uk.json";
import landingRo from "@/content/landing/ro.json";
import landingDe from "@/content/landing/de.json";
import landingEs from "@/content/landing/es.json";
import landingIt from "@/content/landing/it.json";

export type Locale = "en" | "ru" | "uk" | "ro" | "de" | "es" | "it";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "uk", label: "Українська" },
  { code: "ro", label: "Română" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
];

export const DEFAULT_LOCALE: Locale = "en";

// Default locale (en) lives at "/"; the rest are path-prefixed (e.g. "/ru").
export const PREFIXED_LOCALES: Locale[] = LOCALES.map((l) => l.code).filter((c) => c !== "en") as Locale[];

export function localePath(locale: Locale): string {
  return locale === "en" ? "/" : `/${locale}`;
}

/**
 * hreflang map for a page. `path` is the route after the locale, e.g. "" for
 * the landing or "faq". en/x-default point to the unprefixed URL; other locales
 * to `/{locale}/{path}`.
 */
export function pageLanguagesMap(siteUrl: string, path = ""): Record<string, string> {
  const seg = path ? `/${path}` : "";
  const enUrl = `${siteUrl}${seg || "/"}`;
  const map: Record<string, string> = { "x-default": enUrl };
  for (const { code } of LOCALES) {
    map[code] = code === "en" ? enUrl : `${siteUrl}/${code}${seg}`;
  }
  return map;
}

/**
 * hreflang map for a blog post, restricted to locales that actually have a
 * translation. `availableLocales` comes from `translatedLocales(slug)`.
 *
 * Unlike `pageLanguagesMap`, this never claims a localized version exists just
 * because the route resolves — the route falls back to English content, and
 * advertising that as a translation is what produces duplicate content.
 */
export function postLanguagesMap(siteUrl: string, slug: string, availableLocales: string[]): Record<string, string> {
  const enUrl = `${siteUrl}/blog/${slug}`;
  const map: Record<string, string> = { "x-default": enUrl, en: enUrl };
  for (const code of availableLocales) {
    if (code === "en") continue;
    map[code] = `${siteUrl}/${code}/blog/${slug}`;
  }
  return map;
}

/** hreflang map for the landing (kept for existing callers). */
export function landingLanguagesMap(siteUrl: string): Record<string, string> {
  return pageLanguagesMap(siteUrl, "");
}

// Intl locale tags for date formatting.
export const INTL_LOCALE: Record<Locale, string> = {
  en: "en-US", ru: "ru-RU", uk: "uk-UA", ro: "ro-RO", de: "de-DE",
  es: "es-ES", it: "it-IT",
};

type Entry = Partial<Record<Locale, string>>;
type Messages = Record<string, Entry>;

export const MESSAGES: Messages = {
  // ── Nav ──
  "nav.dashboard": { en: "Dashboard", ru: "Обзор", uk: "Огляд", ro: "Panou", de: "Übersicht", es: "Resumen", it: "Riepilogo" },
  "nav.add": { en: "Add transaction", ru: "Добавить", uk: "Додати", ro: "Adaugă", de: "Hinzufügen", es: "Añadir", it: "Aggiungi" },
  "nav.budgets": { en: "Budgets", ru: "Бюджеты", uk: "Бюджети", ro: "Bugete", de: "Budgets", es: "Presupuestos", it: "Budget" },
  "nav.goals": { en: "Goals", ru: "Цели", uk: "Цілі", ro: "Obiective", de: "Ziele", es: "Metas", it: "Obiettivi" },
  "nav.forecast": { en: "Forecast", ru: "Прогноз", uk: "Прогноз", ro: "Prognoză", de: "Prognose", es: "Previsión", it: "Previsione" },
  "nav.categories": { en: "Categories", ru: "Категории", uk: "Категорії", ro: "Categorii", de: "Kategorien", es: "Categorías", it: "Categorie" },
  "nav.currency": { en: "Currency", ru: "Валюта", uk: "Валюта", ro: "Monedă", de: "Währung", es: "Moneda", it: "Valuta" },

  // ── Common ──
  "common.language": { en: "Language", ru: "Язык", uk: "Мова", ro: "Limbă", de: "Sprache", es: "Idioma", it: "Lingua" },
  "common.close": { en: "Close", ru: "Закрыть", uk: "Закрити", ro: "Închide", de: "Schließen", es: "Cerrar", it: "Chiudi" },
  "common.of": { en: "of", ru: "из", uk: "з", ro: "din", de: "von", es: "de", it: "di" },
  "common.monthly": { en: "Monthly", ru: "Ежемесячно", uk: "Щомісяця", ro: "Lunar", de: "Monatlich", es: "Mensual", it: "Mensile" },
  "common.weekly": { en: "Weekly", ru: "Еженедельно", uk: "Щотижня", ro: "Săptămânal", de: "Wöchentlich", es: "Semanal", it: "Settimanale" },
  "common.yearly": { en: "Yearly", ru: "Ежегодно", uk: "Щороку", ro: "Anual", de: "Jährlich", es: "Anual", it: "Annuale" },
  "common.expense": { en: "Expense", ru: "Расход", uk: "Витрата", ro: "Cheltuială", de: "Ausgabe", es: "Gasto", it: "Spesa" },
  "common.income": { en: "Income", ru: "Доход", uk: "Дохід", ro: "Venit", de: "Einnahme", es: "Ingreso", it: "Entrata" },
  "common.high": { en: "High", ru: "Высокий", uk: "Високий", ro: "Ridicat", de: "Hoch", es: "Alta", it: "Alta" },
  "common.medium": { en: "Medium", ru: "Средний", uk: "Середній", ro: "Mediu", de: "Mittel", es: "Media", it: "Media" },
  "common.low": { en: "Low", ru: "Низкий", uk: "Низький", ro: "Scăzut", de: "Niedrig", es: "Baja", it: "Bassa" },
  "common.date": { en: "Date", ru: "Дата", uk: "Дата", ro: "Data", de: "Datum", es: "Fecha", it: "Data" },
  "common.amount": { en: "Amount", ru: "Сумма", uk: "Сума", ro: "Sumă", de: "Betrag", es: "Importe", it: "Importo" },
  "common.name": { en: "Name", ru: "Название", uk: "Назва", ro: "Nume", de: "Name", es: "Nombre", it: "Nome" },
  "common.category": { en: "Category", ru: "Категория", uk: "Категорія", ro: "Categorie", de: "Kategorie", es: "Categoría", it: "Categoria" },
  "common.period": { en: "Period", ru: "Период", uk: "Період", ro: "Perioadă", de: "Zeitraum", es: "Período", it: "Periodo" },
  "common.type": { en: "Type", ru: "Тип", uk: "Тип", ro: "Tip", de: "Typ", es: "Tipo", it: "Tipo" },
  "common.color": { en: "Color", ru: "Цвет", uk: "Колір", ro: "Culoare", de: "Farbe", es: "Color", it: "Colore" },
  "common.icon": { en: "Icon", ru: "Иконка", uk: "Іконка", ro: "Pictogramă", de: "Symbol", es: "Icono", it: "Icona" },
  "common.priority": { en: "Priority", ru: "Приоритет", uk: "Пріоритет", ro: "Prioritate", de: "Priorität", es: "Prioridad", it: "Priorità" },
  "common.showMore": { en: "Show all ({n})", ru: "Показать все ({n})", uk: "Показати всі ({n})", ro: "Arată toate ({n})", de: "Alle anzeigen ({n})", es: "Mostrar todas ({n})", it: "Mostra tutte ({n})" },
  "common.showLess": { en: "Show less", ru: "Свернуть", uk: "Згорнути", ro: "Arată mai puțin", de: "Weniger anzeigen", es: "Mostrar menos", it: "Mostra meno" },
  "common.edit": { en: "Edit", ru: "Изменить", uk: "Змінити", ro: "Editează", de: "Bearbeiten", es: "Editar", it: "Modifica" },
  "common.delete": { en: "Delete", ru: "Удалить", uk: "Видалити", ro: "Șterge", de: "Löschen", es: "Eliminar", it: "Elimina" },
  "common.save": { en: "Save", ru: "Сохранить", uk: "Зберегти", ro: "Salvează", de: "Speichern", es: "Guardar", it: "Salva" },
  "common.cancel": { en: "Cancel", ru: "Отмена", uk: "Скасувати", ro: "Anulează", de: "Abbrechen", es: "Cancelar", it: "Annulla" },
  "cat.deleteConfirm": { en: "Delete this category?", ru: "Удалить эту категорию?", uk: "Видалити цю категорію?", ro: "Ștergi această categorie?", de: "Diese Kategorie löschen?", es: "¿Eliminar esta categoría?", it: "Eliminare questa categoria?" },
  "goal.deleteConfirm": { en: "Delete this goal?", ru: "Удалить эту цель?", uk: "Видалити цю ціль?", ro: "Ștergi acest obiectiv?", de: "Dieses Ziel löschen?", es: "¿Eliminar esta meta?", it: "Eliminare questo obiettivo?" },
  "dash.trajectory": { en: "Spending trajectory", ru: "Траектория расходов", uk: "Траєкторія витрат", ro: "Traiectoria cheltuielilor", de: "Ausgabenverlauf", es: "Trayectoria de gasto", it: "Traiettoria di spesa" },
  "dash.trend": { en: "6-month trend", ru: "Тренд за 6 месяцев", uk: "Тренд за 6 місяців", ro: "Tendință pe 6 luni", de: "6-Monats-Trend", es: "Tendencia de 6 meses", it: "Andamento a 6 mesi" },
  "dash.actualLabel": { en: "Actual", ru: "Факт", uk: "Факт", ro: "Real", de: "Ist", es: "Real", it: "Effettivo" },
  "dash.projectedLabel": { en: "Projected", ru: "Прогноз", uk: "Прогноз", ro: "Estimat", de: "Prognose", es: "Previsto", it: "Previsto" },

  // ── Account / shell ──
  "account.title": { en: "Your account", ru: "Ваш аккаунт", uk: "Ваш акаунт", ro: "Contul tău", de: "Dein Konto", es: "Tu cuenta", it: "Il tuo account" },
  "account.signOut": { en: "Sign out", ru: "Выйти", uk: "Вийти", ro: "Deconectare", de: "Abmelden", es: "Cerrar sesión", it: "Esci" },
  "account.syncing": { en: "Syncing your data…", ru: "Синхронизация данных…", uk: "Синхронізація даних…", ro: "Se sincronizează datele…", de: "Daten werden synchronisiert…", es: "Sincronizando tus datos…", it: "Sincronizzazione dei dati…" },
  "account.loading": { en: "Loading…", ru: "Загрузка…", uk: "Завантаження…", ro: "Se încarcă…", de: "Wird geladen…", es: "Cargando…", it: "Caricamento…" },

  // ── Dashboard ──
  "dash.subtitle": { en: "Your money at a glance — income, spending, and where the month is heading.", ru: "Ваши финансы с первого взгляда — доходы, расходы и куда движется месяц.", uk: "Ваші фінанси з першого погляду — доходи, витрати й куди рухається місяць.", ro: "Banii tăi dintr-o privire — venituri, cheltuieli și încotro se îndreaptă luna.", de: "Deine Finanzen auf einen Blick — Einnahmen, Ausgaben und wohin der Monat steuert.", es: "Tu dinero de un vistazo: ingresos, gastos y hacia dónde va el mes.", it: "I tuoi soldi in un colpo d'occhio: entrate, spese e come sta andando il mese." },
  "dash.addTx": { en: "+ Add transaction", ru: "+ Добавить операцию", uk: "+ Додати операцію", ro: "+ Adaugă tranzacție", de: "+ Transaktion hinzufügen", es: "+ Añadir transacción", it: "+ Aggiungi transazione" },
  "dash.net": { en: "Net this month", ru: "Итог за месяц", uk: "Підсумок за місяць", ro: "Net luna aceasta", de: "Saldo diesen Monat", es: "Neto este mes", it: "Netto questo mese" },
  "dash.balance": { en: "Balance", ru: "Баланс", uk: "Баланс", ro: "Sold", de: "Kontostand", es: "Saldo", it: "Saldo" },
  "dash.allTime": { en: "All time", ru: "За всё время", uk: "За весь час", ro: "Din totdeauna", de: "Gesamt", es: "Histórico", it: "Da sempre" },
  "dash.expenses": { en: "Expenses", ru: "Расходы", uk: "Витрати", ro: "Cheltuieli", de: "Ausgaben", es: "Gastos", it: "Spese" },
  "dash.projected": { en: "Projected spend", ru: "Прогноз расходов", uk: "Прогноз витрат", ro: "Cheltuieli estimate", de: "Prognostizierte Ausgaben", es: "Gasto previsto", it: "Spesa prevista" },
  "dash.byCategory": { en: "Spending by category", ru: "Расходы по категориям", uk: "Витрати за категоріями", ro: "Cheltuieli pe categorii", de: "Ausgaben nach Kategorie", es: "Gastos por categoría", it: "Spese per categoria" },
  "dash.incomeByCategory": { en: "Income by category", ru: "Доходы по категориям", uk: "Доходи за категоріями", ro: "Venituri pe categorii", de: "Einnahmen nach Kategorie", es: "Ingresos por categoría", it: "Entrate per categoria" },
  "dash.noExpenses": { en: "No expenses yet this month.", ru: "Пока нет расходов в этом месяце.", uk: "Поки що немає витрат цього місяця.", ro: "Nicio cheltuială luna aceasta.", de: "Noch keine Ausgaben diesen Monat.", es: "Aún no hay gastos este mes.", it: "Ancora nessuna spesa questo mese." },
  "dash.byPartner": { en: "Spending by partner", ru: "Расходы по участникам", uk: "Витрати за учасниками", ro: "Cheltuieli pe partener", de: "Ausgaben nach Partner", es: "Gastos por integrante", it: "Spese per membro" },
  "dash.unassignedAuthor": { en: "Not tagged", ru: "Без указания автора", uk: "Без вказання автора", ro: "Fără etichetă", de: "Nicht zugeordnet", es: "Sin etiquetar", it: "Non assegnato" },
  "dash.monthForecast": { en: "Month forecast", ru: "Прогноз на месяц", uk: "Прогноз на місяць", ro: "Prognoză lunară", de: "Monatsprognose", es: "Previsión del mes", it: "Previsione del mese" },
  "dash.projectedEnd": { en: "Projected month-end spend · {pct}% confidence", ru: "Прогноз расходов на конец месяца · уверенность {pct}%", uk: "Прогноз витрат на кінець місяця · впевненість {pct}%", ro: "Cheltuieli estimate la final de lună · încredere {pct}%", de: "Prognostizierte Ausgaben zum Monatsende · {pct}% Konfidenz", es: "Gasto estimado a fin de mes · confianza {pct}%", it: "Spesa prevista a fine mese · affidabilità {pct}%" },
  "dash.seeForecast": { en: "See full forecast →", ru: "Смотреть прогноз →", uk: "Дивитися прогноз →", ro: "Vezi prognoza →", de: "Zur Prognose →", es: "Ver previsión →", it: "Vedi previsione →" },
  "dash.recent": { en: "Recent transactions", ru: "Последние операции", uk: "Останні операції", ro: "Tranzacții recente", de: "Letzte Transaktionen", es: "Transacciones recientes", it: "Transazioni recenti" },
  "dash.nothing": { en: "Nothing logged yet.", ru: "Пока ничего нет.", uk: "Поки що нічого немає.", ro: "Nimic înregistrat încă.", de: "Noch nichts erfasst.", es: "Aún no hay nada.", it: "Ancora niente." },

  // ── Add transaction ──
  "add.eyebrow": { en: "New entry", ru: "Новая запись", uk: "Новий запис", ro: "Intrare nouă", de: "Neuer Eintrag", es: "Nueva entrada", it: "Nuova voce" },
  "add.title": { en: "Add transaction", ru: "Добавить операцию", uk: "Додати операцію", ro: "Adaugă tranzacție", de: "Transaktion hinzufügen", es: "Añadir transacción", it: "Aggiungi transazione" },
  "add.subtitle": { en: "Log an expense or a source of income. It updates your dashboard, budgets, and forecast instantly.", ru: "Запишите расход или источник дохода — обзор, бюджеты и прогноз обновятся сразу.", uk: "Запишіть витрату або джерело доходу — огляд, бюджети та прогноз оновляться миттєво.", ro: "Înregistrează o cheltuială sau o sursă de venit. Panoul, bugetele și prognoza se actualizează instant.", de: "Erfasse eine Ausgabe oder Einnahmequelle. Übersicht, Budgets und Prognose werden sofort aktualisiert.", es: "Registra un gasto o una fuente de ingreso. El resumen, los presupuestos y la previsión se actualizan al instante.", it: "Registra una spesa o una fonte di reddito. Riepilogo, budget e previsione si aggiornano subito." },
  "add.merchant": { en: "Merchant", ru: "Продавец", uk: "Продавець", ro: "Comerciant", de: "Händler", es: "Comercio", it: "Esercente" },
  "add.source": { en: "Source", ru: "Источник", uk: "Джерело", ro: "Sursă", de: "Quelle", es: "Fuente", it: "Fonte" },
  "add.merchantPh": { en: "e.g. Whole Foods", ru: "напр. супермаркет", uk: "напр. супермаркет", ro: "ex. supermarket", de: "z. B. Supermarkt", es: "ej. supermercado", it: "es. supermercato" },
  "add.sourcePh": { en: "e.g. Acme Corp", ru: "напр. работодатель", uk: "напр. роботодавець", ro: "ex. angajator", de: "z. B. Arbeitgeber", es: "ej. empleador", it: "es. datore di lavoro" },
  "add.noteOpt": { en: "Note (optional)", ru: "Заметка (необязательно)", uk: "Нотатка (необов'язково)", ro: "Notă (opțional)", de: "Notiz (optional)", es: "Nota (opcional)", it: "Nota (facoltativa)" },
  "add.notePh": { en: "Add a note", ru: "Добавить заметку", uk: "Додати нотатку", ro: "Adaugă o notă", de: "Notiz hinzufügen", es: "Añadir una nota", it: "Aggiungi una nota" },
  "add.saveExpense": { en: "Save expense", ru: "Сохранить расход", uk: "Зберегти витрату", ro: "Salvează cheltuiala", de: "Ausgabe speichern", es: "Guardar gasto", it: "Salva spesa" },
  "add.saveIncome": { en: "Save income", ru: "Сохранить доход", uk: "Зберегти дохід", ro: "Salvează venitul", de: "Einnahme speichern", es: "Guardar ingreso", it: "Salva entrata" },

  // ── Budgets ──
  "bud.eyebrow": { en: "This month", ru: "Этот месяц", uk: "Цей місяць", ro: "Luna aceasta", de: "Dieser Monat", es: "Este mes", it: "Questo mese" },
  "bud.subtitle": { en: "Set a monthly limit per category. Lumi tracks spend in real time and warns you before you hit the ceiling.", ru: "Задайте месячный лимит по категории. Lumi отслеживает расходы в реальном времени и предупреждает до превышения.", uk: "Задайте місячний ліміт за категорією. Lumi відстежує витрати в реальному часі й попереджає до перевищення.", ro: "Setează o limită lunară per categorie. Lumi urmărește cheltuielile în timp real și te avertizează înainte de depășire.", de: "Lege ein monatliches Limit pro Kategorie fest. Lumi verfolgt Ausgaben in Echtzeit und warnt dich vor dem Überschreiten.", es: "Fija un límite mensual por categoría. Lumi controla el gasto en tiempo real y te avisa antes de pasarte.", it: "Imposta un limite mensile per categoria. Lumi monitora le spese in tempo reale e ti avvisa prima di sforare." },
  "bud.new": { en: "+ New budget", ru: "+ Новый бюджет", uk: "+ Новий бюджет", ro: "+ Buget nou", de: "+ Neues Budget", es: "+ Nuevo presupuesto", it: "+ Nuovo budget" },
  "bud.create": { en: "Create budget", ru: "Создать бюджет", uk: "Створити бюджет", ro: "Creează buget", de: "Budget erstellen", es: "Crear presupuesto", it: "Crea budget" },
  "bud.hasBudget": { en: "has budget", ru: "есть бюджет", uk: "є бюджет", ro: "are buget", de: "hat Budget", es: "con presupuesto", it: "ha budget" },
  "bud.none": { en: "No budgets yet. Create one to start tracking a category.", ru: "Пока нет бюджетов. Создайте первый, чтобы отслеживать категорию.", uk: "Поки що немає бюджетів. Створіть перший, щоб відстежувати категорію.", ro: "Niciun buget încă. Creează unul pentru a urmări o categorie.", de: "Noch keine Budgets. Erstelle eines, um eine Kategorie zu verfolgen.", es: "Aún no hay presupuestos. Crea uno para empezar a controlar una categoría.", it: "Ancora nessun budget. Creane uno per iniziare a monitorare una categoria." },
  "bud.amountCur": { en: "Amount ({cur})", ru: "Сумма ({cur})", uk: "Сума ({cur})", ro: "Sumă ({cur})", de: "Betrag ({cur})", es: "Importe ({cur})", it: "Importo ({cur})" },
  "bud.leftUsed": { en: "{left} {cur} left · {pct}% used", ru: "{left} {cur} осталось · использовано {pct}%", uk: "{left} {cur} залишилось · використано {pct}%", ro: "{left} {cur} rămași · {pct}% folosit", de: "{left} {cur} übrig · {pct}% genutzt", es: "{left} {cur} restante · {pct}% usado", it: "{left} {cur} rimasti · {pct}% usato" },
  "bud.overBy": { en: "Over by {amt}", ru: "Превышено на {amt}", uk: "Перевищено на {amt}", ro: "Depășit cu {amt}", de: "Überschritten um {amt}", es: "Excedido en {amt}", it: "Superato di {amt}" },

  // ── Goals ──
  "goal.eyebrow": { en: "Savings", ru: "Накопления", uk: "Накопичення", ro: "Economii", de: "Ersparnisse", es: "Ahorros", it: "Risparmi" },
  "goal.subtitle": { en: "Set a target, track your progress, and hit milestones. Add contributions as you save.", ru: "Задайте цель, следите за прогрессом и достигайте вех. Пополняйте по мере накоплений.", uk: "Задайте ціль, стежте за прогресом і досягайте віх. Поповнюйте в міру накопичень.", ro: "Setează o țintă, urmărește progresul și atinge etapele. Adaugă contribuții pe măsură ce economisești.", de: "Setze ein Ziel, verfolge deinen Fortschritt und erreiche Meilensteine. Füge Einzahlungen hinzu, während du sparst.", es: "Fija una meta, sigue tu progreso y alcanza hitos. Añade aportes mientras ahorras.", it: "Fissa un obiettivo, monitora i progressi e raggiungi i traguardi. Aggiungi versamenti mentre risparmi." },
  "goal.new": { en: "+ New goal", ru: "+ Новая цель", uk: "+ Нова ціль", ro: "+ Obiectiv nou", de: "+ Neues Ziel", es: "+ Nueva meta", it: "+ Nuovo obiettivo" },
  "goal.create": { en: "Create goal", ru: "Создать цель", uk: "Створити ціль", ro: "Creează obiectiv", de: "Ziel erstellen", es: "Crear meta", it: "Crea obiettivo" },
  "goal.namePh": { en: "e.g. New MacBook", ru: "напр. Новый ноутбук", uk: "напр. Новий ноутбук", ro: "ex. Laptop nou", de: "z. B. Neuer Laptop", es: "ej. Portátil nuevo", it: "es. Nuovo laptop" },
  "goal.target": { en: "Target amount ({cur})", ru: "Цель ({cur})", uk: "Ціль ({cur})", ro: "Sumă țintă ({cur})", de: "Zielbetrag ({cur})", es: "Meta ({cur})", it: "Obiettivo ({cur})" },
  "goal.saved": { en: "Already saved ({cur})", ru: "Уже накоплено ({cur})", uk: "Вже накопичено ({cur})", ro: "Deja economisit ({cur})", de: "Bereits gespart ({cur})", es: "Ya ahorrado ({cur})", it: "Già risparmiato ({cur})" },
  "goal.deadlineOpt": { en: "Deadline (optional)", ru: "Срок (необязательно)", uk: "Термін (необов'язково)", ro: "Termen (opțional)", de: "Frist (optional)", es: "Fecha límite (opcional)", it: "Scadenza (facoltativa)" },
  "goal.done": { en: "DONE", ru: "ГОТОВО", uk: "ГОТОВО", ro: "GATA", de: "FERTIG", es: "HECHO", it: "FATTO" },
  "goal.none": { en: "No goals yet. Create one to start saving toward something.", ru: "Пока нет целей. Создайте первую, чтобы начать копить.", uk: "Поки що немає цілей. Створіть першу, щоб почати накопичувати.", ro: "Niciun obiectiv încă. Creează unul ca să începi să economisești.", de: "Noch keine Ziele. Erstelle eines, um mit dem Sparen zu beginnen.", es: "Aún no hay metas. Crea una para empezar a ahorrar.", it: "Ancora nessun obiettivo. Creane uno per iniziare a risparmiare." },
  "goal.by": { en: "by {date}", ru: "до {date}", uk: "до {date}", ro: "până la {date}", de: "bis {date}", es: "para {date}", it: "entro {date}" },
  "goal.priorityLabel": { en: "{p} priority", ru: "приоритет: {p}", uk: "пріоритет: {p}", ro: "prioritate {p}", de: "Priorität {p}", es: "prioridad {p}", it: "priorità {p}" },
  "goal.addPh": { en: "Add {cur}", ru: "Добавить {cur}", uk: "Додати {cur}", ro: "Adaugă {cur}", de: "{cur} hinzufügen", es: "Añadir {cur}", it: "Aggiungi {cur}" },
  "goal.add": { en: "Add", ru: "Добавить", uk: "Додати", ro: "Adaugă", de: "Hinzufügen", es: "Añadir", it: "Aggiungi" },
  "goal.history": { en: "History", ru: "История", uk: "Історія", ro: "Istoric", de: "Verlauf", es: "Historial", it: "Cronologia" },
  "goal.noContributions": { en: "No contributions yet.", ru: "Пока нет операций.", uk: "Поки що немає операцій.", ro: "Nicio contribuție încă.", de: "Noch keine Einzahlungen.", es: "Aún no hay aportes.", it: "Ancora nessun versamento." },
  "goal.deposit": { en: "Deposit", ru: "Пополнение", uk: "Поповнення", ro: "Depunere", de: "Einzahlung", es: "Aporte", it: "Versamento" },
  "goal.withdrawal": { en: "Withdrawal", ru: "Списание", uk: "Списання", ro: "Retragere", de: "Abhebung", es: "Retiro", it: "Prelievo" },

  // Goal types
  "goaltype.emergency": { en: "Emergency", ru: "Резерв", uk: "Резерв", ro: "Urgențe", de: "Notfall", es: "Emergencia", it: "Emergenza" },
  "goaltype.vacation": { en: "Vacation", ru: "Отпуск", uk: "Відпустка", ro: "Vacanță", de: "Urlaub", es: "Vacaciones", it: "Vacanza" },
  "goaltype.purchase": { en: "Purchase", ru: "Покупка", uk: "Покупка", ro: "Achiziție", de: "Kauf", es: "Compra", it: "Acquisto" },
  "goaltype.investment": { en: "Investment", ru: "Инвестиция", uk: "Інвестиція", ro: "Investiție", de: "Investition", es: "Inversión", it: "Investimento" },
  "goaltype.education": { en: "Education", ru: "Образование", uk: "Освіта", ro: "Educație", de: "Bildung", es: "Educación", it: "Istruzione" },
  "goaltype.home": { en: "Home", ru: "Дом", uk: "Дім", ro: "Casă", de: "Zuhause", es: "Hogar", it: "Casa" },
  "goaltype.retirement": { en: "Retirement", ru: "Пенсия", uk: "Пенсія", ro: "Pensionare", de: "Ruhestand", es: "Jubilación", it: "Pensione" },
  "goaltype.gift": { en: "Gift", ru: "Подарок", uk: "Подарунок", ro: "Cadou", de: "Geschenk", es: "Regalo", it: "Regalo" },
  "goaltype.custom": { en: "Custom", ru: "Своя", uk: "Власна", ro: "Personalizat", de: "Eigenes", es: "Personalizado", it: "Personalizzato" },

  // ── Forecast ──
  "fc.subtitle": { en: "Lumi projects your month-end spend from your current daily rate, then compares it against your budgets.", ru: "Lumi прогнозирует расходы на конец месяца по текущему дневному темпу и сравнивает их с бюджетами.", uk: "Lumi прогнозує витрати на кінець місяця за поточним денним темпом і порівнює їх із бюджетами.", ro: "Lumi estimează cheltuielile de la finalul lunii pe baza ritmului zilnic actual și le compară cu bugetele.", de: "Lumi prognostiziert deine Ausgaben zum Monatsende anhand deiner aktuellen Tagesrate und vergleicht sie mit deinen Budgets.", es: "Lumi proyecta tu gasto a fin de mes según tu ritmo diario actual y lo compara con tus presupuestos.", it: "Lumi proietta la spesa di fine mese in base al ritmo giornaliero attuale e la confronta con i tuoi budget." },
  "fc.onTrack": { en: "On track", ru: "В норме", uk: "У нормі", ro: "În grafic", de: "Im Plan", es: "En camino", it: "In linea" },
  "fc.watch": { en: "Watch spending", ru: "Следите за тратами", uk: "Стежте за витратами", ro: "Atenție la cheltuieli", de: "Ausgaben beobachten", es: "Cuidado con el gasto", it: "Occhio alle spese" },
  "fc.over": { en: "Heading over budget", ru: "Превышение бюджета", uk: "Перевищення бюджету", ro: "Depășești bugetul", de: "Über Budget", es: "Te pasas del presupuesto", it: "Oltre il budget" },
  "fc.projectedEnd": { en: "Projected month-end spend", ru: "Прогноз расходов на конец месяца", uk: "Прогноз витрат на кінець місяця", ro: "Cheltuieli estimate la final de lună", de: "Prognostizierte Ausgaben zum Monatsende", es: "Gasto estimado a fin de mes", it: "Spesa prevista a fine mese" },
  "fc.spentSoFar": { en: "You've spent {amt} so far — about {rate}/day over {days} days.", ru: "Вы потратили {amt} — примерно {rate}/день за {days} дн.", uk: "Ви витратили {amt} — приблизно {rate}/день за {days} дн.", ro: "Ai cheltuit {amt} până acum — aproximativ {rate}/zi în {days} zile.", de: "Du hast bisher {amt} ausgegeben — etwa {rate}/Tag über {days} Tage.", es: "Has gastado {amt} hasta ahora — unos {rate}/día en {days} días.", it: "Finora hai speso {amt} — circa {rate}/giorno in {days} giorni." },
  "fc.dayOf": { en: "Day {d} of {total}", ru: "День {d} из {total}", uk: "День {d} з {total}", ro: "Ziua {d} din {total}", de: "Tag {d} von {total}", es: "Día {d} de {total}", it: "Giorno {d} di {total}" },
  "fc.daysLeft": { en: "{n} days left", ru: "осталось {n} дн.", uk: "залишилось {n} дн.", ro: "{n} zile rămase", de: "{n} Tage übrig", es: "{n} días restantes", it: "{n} giorni rimasti" },
  "fc.confidence": { en: "Forecast confidence", ru: "Уверенность прогноза", uk: "Впевненість прогнозу", ro: "Încrederea prognozei", de: "Prognosesicherheit", es: "Confianza de la previsión", it: "Affidabilità previsione" },
  "fc.projectedNet": { en: "Projected net", ru: "Прогноз итога", uk: "Прогноз підсумку", ro: "Net estimat", de: "Prognostiziertes Netto", es: "Neto previsto", it: "Netto previsto" },
  "fc.vsBudget": { en: "Projected vs budget", ru: "Прогноз и бюджет", uk: "Прогноз і бюджет", ro: "Estimare vs buget", de: "Prognose vs. Budget", es: "Previsión vs presupuesto", it: "Previsione vs budget" },
  "fc.setBudgets": { en: "Set monthly budgets to compare your projection against a target.", ru: "Задайте месячные бюджеты, чтобы сравнить прогноз с целью.", uk: "Задайте місячні бюджети, щоб порівняти прогноз із ціллю.", ro: "Setează bugete lunare pentru a compara estimarea cu o țintă.", de: "Lege monatliche Budgets fest, um deine Prognose mit einem Ziel zu vergleichen.", es: "Fija presupuestos mensuales para comparar tu previsión con un objetivo.", it: "Imposta budget mensili per confrontare la previsione con un obiettivo." },
  "fc.budget": { en: "budget", ru: "бюджет", uk: "бюджет", ro: "buget", de: "Budget", es: "presupuesto", it: "budget" },
  "fc.exceedBy": { en: "Projected to exceed budget by {amt} {cur}.", ru: "Прогноз превышает бюджет на {amt} {cur}.", uk: "Прогноз перевищує бюджет на {amt} {cur}.", ro: "Prognoza depășește bugetul cu {amt} {cur}.", de: "Prognose überschreitet das Budget um {amt} {cur}.", es: "La previsión supera el presupuesto en {amt} {cur}.", it: "La previsione supera il budget di {amt} {cur}." },
  "fc.underBy": { en: "Projected to stay {amt} {cur} under budget.", ru: "Прогноз ниже бюджета на {amt} {cur}.", uk: "Прогноз нижчий за бюджет на {amt} {cur}.", ro: "Prognoza rămâne cu {amt} {cur} sub buget.", de: "Prognose bleibt {amt} {cur} unter dem Budget.", es: "La previsión queda {amt} {cur} por debajo del presupuesto.", it: "La previsione resta {amt} {cur} sotto il budget." },
  "fc.whereGoing": { en: "Where it's going", ru: "Куда уходят деньги", uk: "Куди йдуть гроші", ro: "Unde se duc banii", de: "Wohin es fließt", es: "A dónde va", it: "Dove va" },
  "fc.noSpending": { en: "No spending recorded yet.", ru: "Расходов пока нет.", uk: "Витрат поки немає.", ro: "Nicio cheltuială înregistrată.", de: "Noch keine Ausgaben erfasst.", es: "Aún no hay gastos registrados.", it: "Nessuna spesa registrata." },
  "fc.projShort": { en: "proj.", ru: "прог.", uk: "прог.", ro: "est.", de: "Prog.", es: "prev.", it: "prev." },
  "fc.projectedExpenses": { en: "Projected month-end expenses", ru: "Прогноз расходов на конец месяца", uk: "Прогноз витрат на кінець місяця", ro: "Cheltuieli estimate la final de lună", de: "Prognostizierte Ausgaben zum Monatsende", es: "Gastos estimados a fin de mes", it: "Spese previste a fine mese" },
  "fc.statusRisk": { en: "At risk", ru: "Риск", uk: "Ризик", ro: "Risc", de: "Risiko", es: "En riesgo", it: "A rischio" },
  "fc.statusOnTrack": { en: "On track", ru: "В норме", uk: "У нормі", ro: "În grafic", de: "Im Plan", es: "En camino", it: "In linea" },
  "fc.statusSurplus": { en: "Surplus", ru: "Профицит", uk: "Профіцит", ro: "Surplus", de: "Überschuss", es: "Superávit", it: "Avanzo" },
  "fc.projectedBalance": { en: "Projected balance", ru: "Прогноз баланса", uk: "Прогноз балансу", ro: "Sold estimat", de: "Prognostizierter Saldo", es: "Saldo estimado", it: "Saldo previsto" },
  "fc.income": { en: "Income this month", ru: "Доход за месяц", uk: "Дохід за місяць", ro: "Venit luna aceasta", de: "Einnahmen diesen Monat", es: "Ingreso este mes", it: "Entrate questo mese" },
  "fc.saved": { en: "Saved this month", ru: "Отложено за месяц", uk: "Відкладено за місяць", ro: "Economisit luna aceasta", de: "Diesen Monat gespart", es: "Ahorrado este mes", it: "Risparmiato questo mese" },
  "fc.range": { en: "Likely range", ru: "Вероятный диапазон", uk: "Ймовірний діапазон", ro: "Interval probabil", de: "Wahrscheinlicher Bereich", es: "Rango probable", it: "Intervallo probabile" },
  "fc.noIncomeHint": { en: "Add income this month to see your projected balance.", ru: "Добавьте доход за месяц, чтобы увидеть прогноз баланса.", uk: "Додайте дохід за місяць, щоб побачити прогноз балансу.", ro: "Adaugă venit luna aceasta pentru a vedea soldul estimat.", de: "Füge Einnahmen für diesen Monat hinzu, um deinen prognostizierten Saldo zu sehen.", es: "Añade ingresos de este mes para ver tu saldo estimado.", it: "Aggiungi entrate di questo mese per vedere il saldo previsto." },
  "fc.topDriver": { en: "Biggest driver vs usual", ru: "Главный драйвер против нормы", uk: "Головний драйвер проти норми", ro: "Principalul factor față de obicei", de: "Größter Treiber ggü. üblich", es: "Mayor factor vs lo habitual", it: "Fattore principale vs solito" },
  "fc.aboveUsual": { en: "{amt} {cur} above usual", ru: "на {amt} {cur} выше обычного", uk: "на {amt} {cur} вище звичного", ro: "cu {amt} {cur} peste obicei", de: "{amt} {cur} über üblich", es: "{amt} {cur} sobre lo habitual", it: "{amt} {cur} sopra il solito" },
  "fc.noData": { en: "Add a few expenses this month and the forecast will appear here.", ru: "Добавьте несколько расходов за месяц — прогноз появится здесь.", uk: "Додайте кілька витрат за місяць — прогноз з'явиться тут.", ro: "Adaugă câteva cheltuieli luna aceasta și prognoza va apărea aici.", de: "Füge ein paar Ausgaben diesen Monat hinzu und die Prognose erscheint hier.", es: "Añade algunos gastos este mes y la previsión aparecerá aquí.", it: "Aggiungi qualche spesa questo mese e la previsione apparirà qui." },

  // ── Categories ──
  "cat.eyebrow": { en: "Organize", ru: "Организация", uk: "Організація", ro: "Organizează", de: "Organisieren", es: "Organiza", it: "Organizza" },
  "cat.subtitle": { en: "The categories Lumi uses to sort your spending and income. Add your own to fit how you think about money.", ru: "Категории, по которым Lumi сортирует ваши расходы и доходы. Добавьте свои под ваш взгляд на деньги.", uk: "Категорії, за якими Lumi сортує ваші витрати й доходи. Додайте власні під ваш підхід до грошей.", ro: "Categoriile pe care Lumi le folosește pentru a-ți sorta cheltuielile și veniturile. Adaugă-le pe ale tale.", de: "Die Kategorien, mit denen Lumi deine Ausgaben und Einnahmen sortiert. Füge eigene hinzu.", es: "Las categorías que Lumi usa para ordenar tus gastos e ingresos. Añade las tuyas.", it: "Le categorie che Lumi usa per ordinare spese ed entrate. Aggiungi le tue." },
  "cat.new": { en: "+ New category", ru: "+ Новая категория", uk: "+ Нова категорія", ro: "+ Categorie nouă", de: "+ Neue Kategorie", es: "+ Nueva categoría", it: "+ Nuova categoria" },
  "cat.namePh": { en: "e.g. Pets", ru: "напр. Питомцы", uk: "напр. Улюбленці", ro: "ex. Animale", de: "z. B. Haustiere", es: "ej. Mascotas", it: "es. Animali" },
  "cat.preview": { en: "Preview:", ru: "Предпросмотр:", uk: "Перегляд:", ro: "Previzualizare:", de: "Vorschau:", es: "Vista previa:", it: "Anteprima:" },
  "cat.previewName": { en: "Category name", ru: "Название категории", uk: "Назва категорії", ro: "Nume categorie", de: "Kategoriename", es: "Nombre de categoría", it: "Nome categoria" },
  "cat.create": { en: "Create category", ru: "Создать категорию", uk: "Створити категорію", ro: "Creează categorie", de: "Kategorie erstellen", es: "Crear categoría", it: "Crea categoria" },
  "cat.expenseCats": { en: "Expense categories", ru: "Категории расходов", uk: "Категорії витрат", ro: "Categorii de cheltuieli", de: "Ausgabenkategorien", es: "Categorías de gastos", it: "Categorie di spesa" },
  "cat.incomeCats": { en: "Income categories", ru: "Категории доходов", uk: "Категорії доходів", ro: "Categorii de venit", de: "Einnahmekategorien", es: "Categorías de ingresos", it: "Categorie di entrata" },
  "cat.custom": { en: "Custom", ru: "Своя", uk: "Власна", ro: "Personalizat", de: "Eigene", es: "Personalizada", it: "Personalizzata" },
  "cat.taxable": { en: "Taxable", ru: "Облагается налогом", uk: "Оподатковується", ro: "Impozabil", de: "Steuerpflichtig", es: "Imponible", it: "Tassabile" },

  // ── Currency ──
  "cur.eyebrow": { en: "Settings", ru: "Настройки", uk: "Налаштування", ro: "Setări", de: "Einstellungen", es: "Ajustes", it: "Impostazioni" },
  "cur.subtitle": { en: "Pick your primary currency for totals and forecasts, plus any secondary currencies you use for travel or income.", ru: "Выберите основную валюту для итогов и прогнозов, а также дополнительные — для поездок или дохода.", uk: "Оберіть основну валюту для підсумків і прогнозів, а також додаткові — для поїздок чи доходу.", ro: "Alege moneda principală pentru totaluri și prognoze, plus monede secundare pentru călătorii sau venituri.", de: "Wähle deine Hauptwährung für Summen und Prognosen sowie Zweitwährungen für Reisen oder Einnahmen.", es: "Elige tu moneda principal para totales y previsiones, más monedas secundarias para viajes o ingresos.", it: "Scegli la valuta principale per totali e previsioni, più valute secondarie per viaggi o entrate." },
  "cur.primary": { en: "Primary", ru: "Основная", uk: "Основна", ro: "Principală", de: "Primär", es: "Principal", it: "Principale" },
  "cur.secondaryN": { en: "Secondary ({n})", ru: "Дополнительные ({n})", uk: "Додаткові ({n})", ro: "Secundare ({n})", de: "Sekundär ({n})", es: "Secundarias ({n})", it: "Secondarie ({n})" },
  "cur.noneSel": { en: "None selected. Tap a currency below to add one.", ru: "Не выбрано. Нажмите валюту ниже, чтобы добавить.", uk: "Не вибрано. Натисніть валюту нижче, щоб додати.", ro: "Niciuna selectată. Atinge o monedă de mai jos pentru a adăuga.", de: "Keine ausgewählt. Tippe unten auf eine Währung, um sie hinzuzufügen.", es: "Ninguna seleccionada. Toca una moneda abajo para añadirla.", it: "Nessuna selezionata. Tocca una valuta qui sotto per aggiungerla." },
  "cur.searchPh": { en: "Search currencies by name, code, or country…", ru: "Поиск валюты по названию, коду или стране…", uk: "Пошук валюти за назвою, кодом або країною…", ro: "Caută monede după nume, cod sau țară…", de: "Währungen nach Name, Code oder Land suchen…", es: "Buscar monedas por nombre, código o país…", it: "Cerca valute per nome, codice o paese…" },
  "cur.primaryBadge": { en: "PRIMARY", ru: "ОСНОВНАЯ", uk: "ОСНОВНА", ro: "PRINCIPALĂ", de: "PRIMÄR", es: "PRINCIPAL", it: "PRINCIPALE" },
  "cur.set": { en: "Set", ru: "Выбрать", uk: "Обрати", ro: "Setează", de: "Wählen", es: "Elegir", it: "Imposta" },

  // ── AI insight card (ported from the app's aiInsightCard.*) ──
  "ai.noticeTitle": { en: "I noticed something", ru: "Я кое-что заметила", uk: "Я дещо помітила", ro: "Am observat ceva", de: "Ich habe etwas bemerkt", es: "Noté algo", it: "Ho notato qualcosa" },
  "ai.headsUpTitle": { en: "Heads up", ru: "Обрати внимание", uk: "Зверни увагу", ro: "Atenție", de: "Achtung", es: "Atención", it: "Attenzione" },
  "ai.greatTitle": { en: "Looking good!", ru: "Отлично!", uk: "Чудово!", ro: "Arată bine!", de: "Sieht gut aus!", es: "¡Se ve bien!", it: "Ottimo andamento!" },
  "ai.bootstrapTitle": { en: "Hey, I'm Lumi!", ru: "Привет, я Lumi!", uk: "Привіт, я Lumi!", ro: "Hei, sunt Lumi!", de: "Hey, ich bin Lumi!", es: "¡Hola, soy Lumi!", it: "Ciao, sono Lumi!" },
  "ai.bootstrapZero": { en: "I'm Lumi! Add your first expense and I'll start learning your habits.", ru: "Я Lumi! Добавь первый расход, и я начну изучать твои привычки.", uk: "Я Lumi! Додай першу витрату, і я почну вивчати твої звички.", ro: "Sunt Lumi! Adaugă prima cheltuială și voi începe să-ți învăț obiceiurile.", de: "Ich bin Lumi! Füge deine erste Ausgabe hinzu und ich lerne deine Gewohnheiten kennen.", es: "¡Soy Lumi! Agrega tu primer gasto y empezaré a aprender tus hábitos.", it: "Sono Lumi! Aggiungi la tua prima spesa e inizierò ad imparare le tue abitudini." },
  "ai.bootstrapFew": { en: "{remaining} more to go — I'm already looking for patterns!", ru: "Ещё {remaining} — я уже ищу закономерности!", uk: "Ще {remaining} — я вже шукаю закономірності!", ro: "Încă {remaining} — deja caut tipare!", de: "Noch {remaining} – ich suche bereits nach Mustern!", es: "{remaining} más — ¡ya estoy buscando patrones!", it: "Ancora {remaining} — sto già cercando i pattern!" },
  "ai.bootstrapFewStreak": { en: "{remaining} more! You've been at it {days} days straight — love the consistency.", ru: "Ещё {remaining}! Ты уже {days} дней подряд — обожаю такую стабильность.", uk: "Ще {remaining}! Ти вже {days} днів поспіль — обожнюю таку стабільність.", ro: "Încă {remaining}! Ești activ de {days} zile consecutive — îmi place consecvența.", de: "Noch {remaining}! Du machst es seit {days} Tagen in Folge – ich liebe die Konsequenz.", es: "¡{remaining} más! Llevas {days} días seguidos — me encanta la constancia.", it: "Ancora {remaining}! Sei qui da {days} giorni di fila — adoro la costanza." },
  "ai.incomeRatioHigh": { en: "You've spent {percentage}% of your income this month. Might be worth a second look.", ru: "Ты потратил {percentage}% от дохода за этот месяц. Стоит присмотреться.", uk: "Ти витратив {percentage}% від доходу цього місяця. Варто придивитись.", ro: "Ai cheltuit {percentage}% din venitul tău luna aceasta. Poate merită o privire.", de: "Du hast diesen Monat {percentage}% deines Einkommens ausgegeben. Vielleicht mal genauer hinschauen.", es: "Gastaste {percentage}% de tus ingresos este mes. Quizás vale la pena revisarlo.", it: "Hai speso il {percentage}% del tuo reddito questo mese. Forse vale la pena rivedere." },
  "ai.incomeRatioLow": { en: "Nice — you've only used {percentage}% of your income. You're in great shape!", ru: "Отлично — использовано всего {percentage}% дохода. Всё под контролем!", uk: "Чудово — використано лише {percentage}% доходу. Все під контролем!", ro: "Bine — ai folosit doar {percentage}% din venit. Ești în formă excelentă!", de: "Toll – du hast nur {percentage}% deines Einkommens genutzt. Du bist in großer Form!", es: "Muy bien — solo usaste {percentage}% de tus ingresos. ¡Estás en gran forma!", it: "Bene — hai usato solo il {percentage}% del tuo reddito. Sei in ottima forma!" },
  "ai.savingsRateHigh": { en: "You're saving {percentage}% of your income this month. Excellent financial health!", ru: "Ты откладываешь {percentage}% дохода в этом месяце. Отличное финансовое здоровье!", uk: "Ти відкладаєш {percentage}% доходу цього місяця. Відмінне фінансове здоров'я!", ro: "Economisești {percentage}% din venit luna aceasta. Sănătate financiară excelentă!", de: "Du sparst diesen Monat {percentage}% deines Einkommens. Exzellente finanzielle Gesundheit!", es: "Estás ahorrando {percentage}% de tus ingresos este mes. ¡Excelente salud financiera!", it: "Stai risparmiando il {percentage}% del tuo reddito questo mese. Salute finanziaria eccellente!" },
  "ai.momHigh": { en: "You're spending {percentage}% more than last month at this point — worth a look.", ru: "Ты тратишь на {percentage}% больше, чем в прошлом месяце на этом этапе — стоит обратить внимание.", uk: "Ти витрачаєш на {percentage}% більше, ніж минулого місяця на цьому етапі — варто звернути увагу.", ro: "Cheltuiești cu {percentage}% mai mult decât luna trecută — merită o privire.", de: "Du gibst {percentage}% mehr aus als letzten Monat – einen Blick wert.", es: "Estás gastando {percentage}% más que el mes pasado — vale la pena revisarlo.", it: "Stai spendendo il {percentage}% in più rispetto al mese scorso a questo punto — vale la pena controllare." },
  "ai.momLow": { en: "You're {percentage}% below last month's pace. Great progress!", ru: "Ты тратишь на {percentage}% меньше, чем в прошлом месяце. Отличный прогресс!", uk: "Ти витрачаєш на {percentage}% менше, ніж минулого місяця. Чудовий прогрес!", ro: "Ești cu {percentage}% sub ritmul lunii trecute. Progres excelent!", de: "Du liegst {percentage}% unter dem Tempo des letzten Monats. Toller Fortschritt!", es: "Estás {percentage}% por debajo del ritmo del mes pasado. ¡Gran progreso!", it: "Sei il {percentage}% sotto il ritmo del mese scorso. Ottimi progressi!" },
  "ai.impulseHigh": { en: "{count} impulsive buys this month totaled {amount} — that's {percentage}% of your spending. Worth it?", ru: "{count} импульсных покупок на {amount} — {percentage}% расходов. Оно того стоило?", uk: "{count} імпульсних покупок на {amount} — {percentage}% витрат. Воно того варте?", ro: "{count} cumpărături impulsive luna aceasta au totalizat {amount} — adică {percentage}% din cheltuieli. A meritat?", de: "{count} Impulskäufe diesen Monat summierten sich auf {amount} – das sind {percentage}% deiner Ausgaben. War es das wert?", es: "{count} compras impulsivas este mes sumaron {amount} — eso es {percentage}% de tu gasto. ¿Valió la pena?", it: "{count} acquisti impulsivi questo mese per un totale di {amount} — il {percentage}% della tua spesa. Ne valeva la pena?" },
  "ai.topCategoryInsight": { en: "{percentage}% of your spending went to {category} ({amount}). That's your biggest area.", ru: "{percentage}% расходов ушло на {category} ({amount}). Это твоя основная статья.", uk: "{percentage}% витрат пішло на {category} ({amount}). Це твоя основна стаття.", ro: "{percentage}% din cheltuieli au mers la {category} ({amount}). Acesta este domeniul tău principal.", de: "{percentage}% deiner Ausgaben gingen an {category} ({amount}). Das ist dein größter Bereich.", es: "{percentage}% de tu gasto fue a {category} ({amount}). Es tu área principal.", it: "Il {percentage}% della tua spesa è andato a {category} ({amount}). È la tua area principale." },
  "ai.categoryGrowth": { en: "Your {category} spending jumped {percentage}% vs last month.", ru: "Расходы на {category} выросли на {percentage}% по сравнению с прошлым месяцем.", uk: "Витрати на {category} зросли на {percentage}% порівняно з минулим місяцем.", ro: "Cheltuielile tale pentru {category} au crescut cu {percentage}% față de luna trecută.", de: "Deine {category}-Ausgaben stiegen {percentage}% gegenüber letztem Monat.", es: "Tu gasto en {category} subió {percentage}% vs el mes pasado.", it: "La tua spesa per {category} è aumentata del {percentage}% rispetto al mese scorso." },
  "ai.weeklySpike": { en: "Spending jumped {percentage}% this week compared to last. Something come up?", ru: "Расходы выросли на {percentage}% по сравнению с прошлой неделей. Что-то случилось?", uk: "Витрати зросли на {percentage}% порівняно з минулим тижнем. Щось трапилось?", ro: "Cheltuielile au crescut cu {percentage}% săptămâna aceasta față de precedenta. S-a întâmplat ceva?", de: "Ausgaben stiegen {percentage}% diese Woche gegenüber letzter. Ist etwas passiert?", es: "Los gastos subieron {percentage}% esta semana vs la anterior. ¿Pasó algo?", it: "La spesa è aumentata del {percentage}% questa settimana rispetto alla scorsa. È successo qualcosa?" },
  "ai.weeklyDrop": { en: "Great job! You spent {percentage}% less this week. Keep it up!", ru: "Молодец! На {percentage}% меньше, чем на прошлой неделе. Так держать!", uk: "Молодець! На {percentage}% менше, ніж минулого тижня. Так тримати!", ro: "Bravo! Ai cheltuit cu {percentage}% mai puțin săptămâna aceasta. Continuă!", de: "Toll! Du hast {percentage}% weniger diese Woche ausgegeben. Weiter so!", es: "¡Muy bien! Gastaste {percentage}% menos esta semana. ¡Sigue así!", it: "Ottimo lavoro! Hai speso il {percentage}% in meno questa settimana. Continua così!" },
  "ai.topMerchant": { en: "{merchant} is your top spot — {count} visits, {amount} spent this month.", ru: "{merchant} — твоё любимое место: {count} визита, потрачено {amount} в этом месяце.", uk: "{merchant} — твоє улюблене місце: {count} відвідувань, витрачено {amount} цього місяця.", ro: "{merchant} este locul tău preferat — {count} vizite, {amount} cheltuiți luna aceasta.", de: "{merchant} ist dein Lieblingsort – {count} Besuche, {amount} diesen Monat ausgegeben.", es: "{merchant} es tu lugar favorito — {count} visitas, {amount} gastado este mes.", it: "{merchant} è il tuo posto preferito — {count} visite, {amount} spesi questo mese." },
  "ai.weekendHigh": { en: "{percentage}% of your spending happens on weekends. Weekdays help your wallet!", ru: "{percentage}% расходов приходится на выходные. Будни помогают кошельку!", uk: "{percentage}% витрат припадає на вихідні. Будні допомагають гаманцю!", ro: "{percentage}% din cheltuieli au loc în weekend. Zilele de lucru ajută portofelul!", de: "{percentage}% deiner Ausgaben passieren am Wochenende. Wochentage schonen dein Portemonnaie!", es: "{percentage}% de tu gasto ocurre los fines de semana. ¡Los días de semana ayudan a tu cartera!", it: "Il {percentage}% della tua spesa avviene nei fine settimana. I giorni feriali aiutano il tuo portafoglio!" },
  "ai.biggestExpense": { en: "Your biggest expense was {amount} at {merchant}. Was that planned?", ru: "Самый крупный расход — {amount} ({merchant}). Это было запланировано?", uk: "Найбільша витрата — {amount} ({merchant}). Це було заплановано?", ro: "Cea mai mare cheltuială a ta a fost {amount} la {merchant}. A fost planificată?", de: "Deine größte Ausgabe war {amount} bei {merchant}. War das geplant?", es: "Tu gasto más grande fue {amount} en {merchant}. ¿Estaba planeado?", it: "La tua spesa più grande è stata {amount} da {merchant}. Era pianificata?" },
  "ai.seeAnalysis": { en: "See analysis", ru: "Смотреть аналитику", uk: "Дивитись аналітику", ro: "Vezi analiza", de: "Analyse ansehen", es: "Ver análisis", it: "Vedi analisi" },

  // ── Landing page ──
  "lp.navFeatures": { en: "Features", ru: "Возможности", uk: "Можливості", ro: "Funcții", de: "Funktionen", es: "Funciones", it: "Funzioni" },
  "lp.navPricing": { en: "Pricing", ru: "Цены", uk: "Ціни", ro: "Prețuri", de: "Preise", es: "Precios", it: "Prezzi" },
  "lp.navFaq": { en: "FAQ", ru: "Вопросы", uk: "Питання", ro: "Întrebări", de: "FAQ", es: "Preguntas", it: "FAQ" },
  "lp.navBlog": { en: "Blog", ru: "Блог", uk: "Блог", ro: "Blog", de: "Blog", es: "Blog", it: "Blog" },
  "lp.signIn": { en: "Sign in", ru: "Войти", uk: "Увійти", ro: "Autentificare", de: "Anmelden", es: "Iniciar sesión", it: "Accedi" },
  "lp.download": { en: "Download", ru: "Скачать", uk: "Завантажити", ro: "Descarcă", de: "Herunterladen", es: "Descargar", it: "Scarica" },

  "lp.heroLabel": { en: "Voice expense tracker for iPhone", ru: "Голосовой трекер расходов для iPhone", uk: "Голосовий трекер витрат для iPhone", ro: "Tracker de cheltuieli cu voce pentru iPhone", de: "Sprachgesteuerter Ausgaben-Tracker fürs iPhone", es: "Registro de gastos por voz para iPhone", it: "Tracker di spese vocale per iPhone" },
  "lp.heroTitle1": { en: "“Coffee, five euros.”", ru: "«Кофе, пять евро».", uk: "«Кава, п’ять євро».", ro: "„Cafea, cinci euro.”", de: "„Kaffee, fünf Euro.“", es: "«Café, cinco euros».", it: "«Caffè, cinque euro»." },
  "lp.heroTitle2": { en: "Logged.", ru: "Записано.", uk: "Записано.", ro: "Înregistrat.", de: "Erfasst.", es: "Registrado.", it: "Registrato." },
  "lp.heroSubtitle": { en: "Say an expense out loud — Lumi's AI logs the amount, merchant, and category. Apple Pay imports the rest automatically, and the forecast shows your month-end balance before you overspend.", ru: "Скажите трату вслух — ИИ Lumi сам запишет сумму, продавца и категорию. Apple Pay импортирует остальное автоматически, а прогноз покажет баланс на конец месяца до перерасхода.", uk: "Скажіть витрату вголос — ШІ Lumi сам запише суму, продавця й категорію. Apple Pay імпортує решту автоматично, а прогноз покаже баланс на кінець місяця до перевитрат.", ro: "Spune cheltuiala cu voce tare — IA din Lumi înregistrează suma, comerciantul și categoria. Apple Pay importă restul automat, iar prognoza îți arată soldul de final de lună înainte să cheltuiești prea mult.", de: "Sprich eine Ausgabe einfach aus — die KI von Lumi erfasst Betrag, Händler und Kategorie. Apple Pay importiert den Rest automatisch, und die Prognose zeigt deinen Monatsendsaldo, bevor du zu viel ausgibst.", es: "Di un gasto en voz alta: la IA de Lumi registra el importe, el comercio y la categoría. Apple Pay importa el resto automáticamente y la previsión muestra tu saldo de fin de mes antes de que gastes de más.", it: "Di' una spesa ad alta voce: l'IA di Lumi registra importo, esercente e categoria. Apple Pay importa il resto in automatico e la previsione mostra il saldo di fine mese prima che tu spenda troppo." },
  "lp.tagNoBank": { en: "No bank login", ru: "Без доступа к банку", uk: "Без доступу до банку", ro: "Fără acces bancar", de: "Kein Bank-Login", es: "Sin acceso bancario", it: "Nessun accesso bancario" },
  "lp.tagOnDevice": { en: "Data on device", ru: "Данные на устройстве", uk: "Дані на пристрої", ro: "Date pe dispozitiv", de: "Daten auf dem Gerät", es: "Datos en el dispositivo", it: "Dati sul dispositivo" },
  "lp.tagOffline": { en: "Works offline", ru: "Работает офлайн", uk: "Працює офлайн", ro: "Funcționează offline", de: "Funktioniert offline", es: "Funciona sin conexión", it: "Funziona offline" },
  "lp.tagFree": { en: "Free", ru: "Бесплатно", uk: "Безкоштовно", ro: "Gratuit", de: "Kostenlos", es: "Gratis", it: "Gratis" },
  "lp.val2sec": { en: "2 sec", ru: "2 сек", uk: "2 сек", ro: "2 sec", de: "2 Sek.", es: "2 seg", it: "2 sec" },
  "lp.val0taps": { en: "0 taps", ru: "0 нажатий", uk: "0 натискань", ro: "0 atingeri", de: "0 Taps", es: "0 toques", it: "0 tocchi" },
  "lp.val0banks": { en: "0 banks", ru: "0 банков", uk: "0 банків", ro: "0 bănci", de: "0 Banken", es: "0 bancos", it: "0 banche" },
  "lp.statBackTap": { en: "to log via Back Tap", ru: "на запись через Back Tap", uk: "на запис через Back Tap", ro: "pentru înregistrare cu Back Tap", de: "zum Erfassen per Back Tap", es: "para registrar con Back Tap", it: "per registrare con Back Tap" },
  "lp.statApplePay": { en: "with Apple Pay", ru: "с Apple Pay", uk: "з Apple Pay", ro: "cu Apple Pay", de: "mit Apple Pay", es: "con Apple Pay", it: "con Apple Pay" },
  "lp.statCurrencies": { en: "currencies", ru: "валют", uk: "валют", ro: "monede", de: "Währungen", es: "monedas", it: "valute" },
  "lp.statBanks": { en: "connected. Ever.", ru: "подключено. Никогда.", uk: "підключено. Ніколи.", ro: "conectate. Vreodată.", de: "verbunden. Niemals.", es: "conectados. Nunca.", it: "collegate. Mai." },

  "lp.ctaLabel": { en: "Start for free", ru: "Начните бесплатно", uk: "Почніть безкоштовно", ro: "Începe gratuit", de: "Kostenlos starten", es: "Empieza gratis", it: "Inizia gratis" },
  "lp.ctaTitle1": { en: "Your next expense", ru: "Ваш следующий расход", uk: "Ваша наступна витрата", ro: "Următoarea ta cheltuială", de: "Deine nächste Ausgabe", es: "Tu próximo gasto", it: "La tua prossima spesa" },
  "lp.ctaTitle2": { en: "logs itself.", ru: "запишется сам.", uk: "запишеться сам.", ro: "se înregistrează singură.", de: "erfasst sich selbst.", es: "se registra solo.", it: "si registra da sola." },
  "lp.ctaSubtitle": { en: "Set up Apple Pay import once. Enable Back Tap. Then forget about manual logging forever.", ru: "Настройте импорт Apple Pay один раз. Включите Back Tap. И забудьте о ручном вводе навсегда.", uk: "Налаштуйте імпорт Apple Pay один раз. Увімкніть Back Tap. І забудьте про ручний ввід назавжди.", ro: "Configurează importul Apple Pay o dată. Activează Back Tap. Apoi uită de înregistrarea manuală pentru totdeauna.", de: "Richte den Apple-Pay-Import einmal ein. Aktiviere Back Tap. Dann vergiss manuelles Erfassen für immer.", es: "Configura la importación de Apple Pay una vez. Activa Back Tap. Y olvídate del registro manual para siempre.", it: "Configura l'importazione da Apple Pay una volta. Attiva Back Tap. Poi dimentica per sempre l'inserimento manuale." },
  "lp.ctaFootnote": { en: "Free · No bank login · iOS 16+", ru: "Бесплатно · Без доступа к банку · iOS 16+", uk: "Безкоштовно · Без доступу до банку · iOS 16+", ro: "Gratuit · Fără acces bancar · iOS 16+", de: "Kostenlos · Kein Bank-Login · iOS 16+", es: "Gratis · Sin acceso bancario · iOS 16+", it: "Gratis · Nessun accesso bancario · iOS 16+" },
  "lp.footerTagline": { en: "AI-powered expense tracker. Privacy-first.", ru: "Трекер расходов на базе ИИ. Приватность прежде всего.", uk: "Трекер витрат на базі ШІ. Приватність передусім.", ro: "Tracker de cheltuieli cu IA. Confidențialitatea pe primul loc.", de: "KI-gestützter Ausgaben-Tracker. Datenschutz zuerst.", es: "Rastreador de gastos con IA. Privacidad ante todo.", it: "Tracker delle spese con IA. Privacy al primo posto." },

  "lp.previewLabel": { en: "Your dashboard", ru: "Ваш дашборд", uk: "Ваш дашборд", ro: "Panoul tău", de: "Dein Dashboard", es: "Tu panel", it: "La tua dashboard" },
  "lp.previewTitle": { en: "Everything in one glance", ru: "Всё с первого взгляда", uk: "Усе з першого погляду", ro: "Totul dintr-o privire", de: "Alles auf einen Blick", es: "Todo de un vistazo", it: "Tutto in un colpo d'occhio" },
  "lp.previewSubtitle": { en: "Balance, spending by category, and an AI insight — synced across your devices.", ru: "Баланс, расходы по категориям и ИИ-инсайт — синхронно на всех устройствах.", uk: "Баланс, витрати за категоріями та ШІ-інсайт — синхронно на всіх пристроях.", ro: "Sold, cheltuieli pe categorii și un insight IA — sincronizate pe toate dispozitivele.", de: "Saldo, Ausgaben nach Kategorie und ein KI-Insight — geräteübergreifend synchronisiert.", es: "Saldo, gastos por categoría y un insight de IA, sincronizados en todos tus dispositivos.", it: "Saldo, spese per categoria e un insight IA, sincronizzati su tutti i dispositivi." },
  "lp.previewInsight": { en: "You've spent 38% of your income this month — right on track.", ru: "В этом месяце потрачено 38% дохода — всё в норме.", uk: "Цього місяця витрачено 38% доходу — усе в нормі.", ro: "Ai cheltuit 38% din venit luna aceasta — exact în grafic.", de: "Du hast diesen Monat 38 % deines Einkommens ausgegeben — genau im Plan.", es: "Has gastado el 38% de tus ingresos este mes: justo en camino.", it: "Hai speso il 38% del reddito questo mese: sei in linea." },

  // ── FAQ page chrome ──
  "faq.eyebrow": { en: "Frequently Asked Questions", ru: "Частые вопросы", uk: "Часті запитання", ro: "Întrebări frecvente", de: "Häufige Fragen", es: "Preguntas frecuentes", it: "Domande frequenti" },
  "faq.title": { en: "Everything about Lumi", ru: "Всё о Lumi", uk: "Усе про Lumi", ro: "Totul despre Lumi", de: "Alles über Lumi", es: "Todo sobre Lumi", it: "Tutto su Lumi" },
  "faq.subtitle": { en: "Privacy, logging, forecasting, and pricing — answered.", ru: "Приватность, запись трат, прогноз и цены — отвечаем.", uk: "Приватність, запис витрат, прогноз і ціни — відповідаємо.", ro: "Confidențialitate, înregistrare, prognoză și prețuri — pe scurt.", de: "Datenschutz, Erfassung, Prognose und Preise — beantwortet.", es: "Privacidad, registro, previsión y precios: resueltos.", it: "Privacy, registrazione, previsioni e prezzi: le risposte." },
  "faq.stillQuestion": { en: "Still have questions?", ru: "Остались вопросы?", uk: "Залишились питання?", ro: "Mai ai întrebări?", de: "Noch Fragen?", es: "¿Aún tienes preguntas?", it: "Hai ancora domande?" },
  "faq.stillBody": { en: "Download Lumi free and try it yourself. No bank login, no commitment.", ru: "Скачайте Lumi бесплатно и попробуйте сами. Без входа в банк, без обязательств.", uk: "Завантажте Lumi безкоштовно і спробуйте самі. Без входу в банк, без зобов'язань.", ro: "Descarcă Lumi gratuit și încearcă singur. Fără acces bancar, fără obligații.", de: "Lade Lumi kostenlos herunter und probiere es selbst. Kein Bank-Login, keine Verpflichtung.", es: "Descarga Lumi gratis y pruébalo. Sin acceso bancario, sin compromiso.", it: "Scarica Lumi gratis e provalo. Nessun accesso bancario, nessun impegno." },
  "faq.downloadCta": { en: "Download on App Store — Free", ru: "Скачать в App Store — бесплатно", uk: "Завантажити в App Store — безкоштовно", ro: "Descarcă din App Store — gratuit", de: "Im App Store laden — kostenlos", es: "Descargar en App Store — gratis", it: "Scarica su App Store — gratis" },

  // ── Blog chrome ──
  "blog.subtitle": { en: "Tips on personal finance, budgeting, and making the most of your money.", ru: "Советы о личных финансах, бюджетировании и о том, как выжать максимум из денег.", uk: "Поради щодо особистих фінансів, бюджетування та як отримати максимум від грошей.", ro: "Sfaturi despre finanțe personale, bugetare și cum să profiți la maximum de banii tăi.", de: "Tipps zu persönlichen Finanzen, Budgetierung und wie du das Meiste aus deinem Geld holst.", es: "Consejos sobre finanzas personales, presupuestos y cómo sacar el máximo partido a tu dinero.", it: "Consigli su finanze personali, budgeting e come sfruttare al meglio i tuoi soldi." },
  "blog.metaDescription": { en: "Tips on personal finance, budgeting, expense tracking, and making the most of your money. From the team behind Lumi.", ru: "Советы о личных финансах, бюджетировании, учёте расходов и о том, как выжать максимум из денег. От команды Lumi.", uk: "Поради щодо особистих фінансів, бюджетування, обліку витрат і як отримати максимум від грошей. Від команди Lumi.", ro: "Sfaturi despre finanțe personale, bugetare, urmărirea cheltuielilor și cum să profiți de banii tăi. De la echipa Lumi.", de: "Tipps zu persönlichen Finanzen, Budgetierung, Ausgaben-Tracking und dem Meisten aus deinem Geld. Vom Lumi-Team.", es: "Consejos sobre finanzas personales, presupuestos, control de gastos y cómo aprovechar tu dinero. Del equipo de Lumi.", it: "Consigli su finanze personali, budgeting, monitoraggio delle spese e come sfruttare i tuoi soldi. Dal team di Lumi." },
  "blog.aboutTitle": { en: "About Lumi", ru: "О Lumi", uk: "Про Lumi", ro: "Despre Lumi", de: "Über Lumi", es: "Sobre Lumi", it: "Informazioni su Lumi" },
  "blog.aboutBody": { en: "Lumi: Budget & Expense Tracker is an iPhone app for logging spending in seconds: by voice, with a Back Tap, or automatically from Apple Pay. It never asks for a bank login and includes budgets, a receipt scanner, and an AI month-end forecast.", ru: "Lumi: Budget & Expense Tracker — приложение для iPhone, чтобы записывать траты за секунды: голосом, касанием по задней панели (Back Tap) или автоматически из Apple Pay. Не требует входа в банк, есть бюджеты, сканер чеков и ИИ-прогноз на конец месяца.", uk: "Lumi: Budget & Expense Tracker — застосунок для iPhone, щоб записувати витрати за секунди: голосом, дотиком до задньої панелі (Back Tap) або автоматично з Apple Pay. Не потребує входу в банк, має бюджети, сканер чеків і ШІ-прогноз на кінець місяця.", ro: "Lumi: Budget & Expense Tracker este o aplicație pentru iPhone cu care înregistrezi cheltuielile în câteva secunde: cu vocea, cu Back Tap sau automat din Apple Pay. Nu cere logare la bancă și include bugete, scanner de bonuri și o prognoză AI pentru finalul lunii.", de: "Lumi: Budget & Expense Tracker ist eine iPhone-App, mit der du Ausgaben in Sekunden erfasst: per Sprache, mit Back Tap oder automatisch über Apple Pay. Sie fragt nie nach einem Bank-Login und bietet Budgets, einen Belegscanner und eine KI-Prognose zum Monatsende.", es: "Lumi: Budget & Expense Tracker es una app para iPhone que registra gastos en segundos: por voz, con Back Tap o automáticamente desde Apple Pay. Nunca pide acceso a tu banco e incluye presupuestos, escáner de tickets y una previsión con IA para fin de mes.", it: "Lumi: Budget & Expense Tracker è un'app per iPhone che registra le spese in pochi secondi: con la voce, con Back Tap o in automatico da Apple Pay. Non chiede mai l'accesso alla banca e include budget, scanner degli scontrini e una previsione IA di fine mese." },
  "blog.back": { en: "← Back to blog", ru: "← Назад в блог", uk: "← Назад до блогу", ro: "← Înapoi la blog", de: "← Zurück zum Blog", es: "← Volver al blog", it: "← Torna al blog" },
  "blog.cta": { en: "Ready to take control of your spending?", ru: "Готовы взять расходы под контроль?", uk: "Готові взяти витрати під контроль?", ro: "Gata să-ți controlezi cheltuielile?", de: "Bereit, deine Ausgaben in den Griff zu bekommen?", es: "¿Listo para controlar tus gastos?", it: "Pronto a prendere il controllo delle tue spese?" },

  // ── Tools / calculators ──
  "tools.eyebrow": { en: "Free tools", ru: "Бесплатные инструменты", uk: "Безкоштовні інструменти", ro: "Instrumente gratuite", de: "Kostenlose Tools", es: "Herramientas gratis", it: "Strumenti gratuiti" },
  "tools.hubTitle": { en: "Free financial calculators", ru: "Бесплатные финансовые калькуляторы", uk: "Безкоштовні фінансові калькулятори", ro: "Calculatoare financiare gratuite", de: "Kostenlose Finanzrechner", es: "Calculadoras financieras gratis", it: "Calcolatori finanziari gratuiti" },
  "tools.hubSubtitle": { en: "Quick, no-signup calculators for budgeting, saving, and paying off debt — then track it for real in Lumi.", ru: "Быстрые калькуляторы без регистрации для бюджета, накоплений и погашения долгов — а затем ведите учёт в Lumi.", uk: "Швидкі калькулятори без реєстрації для бюджету, заощаджень і погашення боргів — а потім ведіть облік у Lumi.", ro: "Calculatoare rapide, fără cont, pentru buget, economii și achitarea datoriilor — apoi urmărește-le în Lumi.", de: "Schnelle Rechner ohne Anmeldung für Budget, Sparen und Schuldenabbau — dann verfolge alles in Lumi.", es: "Calculadoras rápidas y sin registro para presupuesto, ahorro y pago de deudas — luego llévalo de verdad en Lumi.", it: "Calcolatori rapidi e senza registrazione per budget, risparmio e debiti — poi tieni traccia davvero in Lumi." },
  "tools.ctaTitle": { en: "Track it for real in Lumi", ru: "Ведите учёт по-настоящему в Lumi", uk: "Ведіть облік по-справжньому в Lumi", ro: "Urmărește-le cu adevărat în Lumi", de: "Behalte alles wirklich im Blick — mit Lumi", es: "Llévalo de verdad en Lumi", it: "Tieni traccia sul serio con Lumi" },
  "tools.ctaBody": { en: "A calculator is a snapshot. Lumi tracks your real spending, forecasts your month-end balance, and keeps your goals on track — no bank login, privacy-first.", ru: "Калькулятор — это снимок. Lumi отслеживает реальные траты, прогнозирует баланс на конец месяца и держит цели под контролем — без входа в банк, приватно.", uk: "Калькулятор — це знімок. Lumi відстежує реальні витрати, прогнозує баланс на кінець місяця й тримає цілі під контролем — без входу в банк, приватно.", ro: "Un calculator e o poză de moment. Lumi urmărește cheltuielile reale, estimează soldul lunii și îți ține obiectivele pe drum — fără acces bancar, confidențial.", de: "Ein Rechner ist eine Momentaufnahme. Lumi verfolgt deine echten Ausgaben, prognostiziert den Monatsendsaldo und hält deine Ziele im Blick — kein Bank-Login, datenschutzfreundlich.", es: "Una calculadora es una foto fija. Lumi controla tu gasto real, prevé tu saldo de fin de mes y mantiene tus metas en marcha — sin acceso bancario, privado.", it: "Un calcolatore è un'istantanea. Lumi monitora le spese reali, prevede il saldo di fine mese e tiene i tuoi obiettivi in carreggiata — nessun accesso bancario, privacy." },
  "tools.related": { en: "More calculators", ru: "Другие калькуляторы", uk: "Інші калькулятори", ro: "Alte calculatoare", de: "Weitere Rechner", es: "Más calculadoras", it: "Altri calcolatori" },
  "nav.tools": { en: "Calculators", ru: "Калькуляторы", uk: "Калькулятори", ro: "Calculatoare", de: "Rechner", es: "Calculadoras", it: "Calcolatori" },

  // Shared calculator input labels
  "calc.principal": { en: "Initial amount", ru: "Начальная сумма", uk: "Початкова сума", ro: "Sumă inițială", de: "Startbetrag", es: "Cantidad inicial", it: "Importo iniziale" },
  "calc.monthly": { en: "Monthly contribution", ru: "Ежемесячный взнос", uk: "Щомісячний внесок", ro: "Contribuție lunară", de: "Monatlicher Beitrag", es: "Aporte mensual", it: "Versamento mensile" },
  "calc.rate": { en: "Annual interest rate (%)", ru: "Годовая ставка (%)", uk: "Річна ставка (%)", ro: "Rată anuală (%)", de: "Jährlicher Zinssatz (%)", es: "Tasa anual (%)", it: "Tasso annuo (%)" },
  "calc.years": { en: "Years", ru: "Лет", uk: "Років", ro: "Ani", de: "Jahre", es: "Años", it: "Anni" },
  "calc.income": { en: "Monthly after-tax income", ru: "Доход в месяц (после налогов)", uk: "Дохід на місяць (після податків)", ro: "Venit lunar (după taxe)", de: "Monatliches Nettoeinkommen", es: "Ingreso mensual neto", it: "Reddito mensile netto" },
  "calc.essentials": { en: "Monthly essential expenses", ru: "Обязательные расходы в месяц", uk: "Обов'язкові витрати на місяць", ro: "Cheltuieli esențiale lunare", de: "Monatliche Grundausgaben", es: "Gastos esenciales mensuales", it: "Spese essenziali mensili" },
  "calc.buffer": { en: "Months of buffer", ru: "Месяцев запаса", uk: "Місяців запасу", ro: "Luni de rezervă", de: "Monate Puffer", es: "Meses de colchón", it: "Mesi di riserva" },
  "calc.goalAmount": { en: "Goal amount", ru: "Целевая сумма", uk: "Цільова сума", ro: "Sumă țintă", de: "Zielbetrag", es: "Cantidad objetivo", it: "Importo obiettivo" },
  "calc.saved": { en: "Already saved", ru: "Уже накоплено", uk: "Вже накопичено", ro: "Deja economisit", de: "Bereits gespart", es: "Ya ahorrado", it: "Già risparmiato" },
  "calc.balance": { en: "Current balance", ru: "Текущий баланс", uk: "Поточний баланс", ro: "Sold curent", de: "Aktueller Saldo", es: "Saldo actual", it: "Saldo attuale" },
  "calc.apr": { en: "Interest rate APR (%)", ru: "Ставка APR (%)", uk: "Ставка APR (%)", ro: "Dobândă APR (%)", de: "Zinssatz APR (%)", es: "Interés APR (%)", it: "Tasso APR (%)" },
  "calc.payment": { en: "Monthly payment", ru: "Ежемесячный платёж", uk: "Щомісячний платіж", ro: "Plată lunară", de: "Monatliche Rate", es: "Pago mensual", it: "Pagamento mensile" },
  "calc.annualExpenses": { en: "Annual expenses", ru: "Годовые расходы", uk: "Річні витрати", ro: "Cheltuieli anuale", de: "Jährliche Ausgaben", es: "Gastos anuales", it: "Spese annue" },
  "calc.annualSavings": { en: "Annual savings", ru: "Годовые накопления", uk: "Річні заощадження", ro: "Economii anuale", de: "Jährliche Ersparnisse", es: "Ahorro anual", it: "Risparmio annuo" },
  "calc.returnRate": { en: "Expected annual return (%)", ru: "Ожидаемая доходность (%)", uk: "Очікувана дохідність (%)", ro: "Randament anual estimat (%)", de: "Erwartete jährl. Rendite (%)", es: "Rendimiento anual esperado (%)", it: "Rendimento annuo atteso (%)" },

  // Shared calculator result labels
  "calc.futureValue": { en: "Future value", ru: "Итоговая сумма", uk: "Підсумкова сума", ro: "Valoare viitoare", de: "Endbetrag", es: "Valor futuro", it: "Valore futuro" },
  "calc.contributed": { en: "Total contributed", ru: "Всего внесено", uk: "Усього внесено", ro: "Total contribuit", de: "Insgesamt eingezahlt", es: "Total aportado", it: "Totale versato" },
  "calc.interestEarned": { en: "Interest earned", ru: "Проценты", uk: "Відсотки", ro: "Dobândă câștigată", de: "Zinsertrag", es: "Interés ganado", it: "Interessi maturati" },
  "calc.needs": { en: "Needs (50%)", ru: "Нужды (50%)", uk: "Потреби (50%)", ro: "Nevoi (50%)", de: "Bedürfnisse (50%)", es: "Necesidades (50%)", it: "Necessità (50%)" },
  "calc.wants": { en: "Wants (30%)", ru: "Желания (30%)", uk: "Бажання (30%)", ro: "Dorințe (30%)", de: "Wünsche (30%)", es: "Deseos (30%)", it: "Desideri (30%)" },
  "calc.savingsCat": { en: "Savings (20%)", ru: "Накопления (20%)", uk: "Заощадження (20%)", ro: "Economii (20%)", de: "Sparen (20%)", es: "Ahorro (20%)", it: "Risparmio (20%)" },
  "calc.targetFund": { en: "Target emergency fund", ru: "Целевая подушка", uk: "Цільова подушка", ro: "Fond de urgență țintă", de: "Ziel-Notgroschen", es: "Fondo de emergencia objetivo", it: "Fondo di emergenza obiettivo" },
  "calc.stillToSave": { en: "Still to save", ru: "Ещё накопить", uk: "Ще накопичити", ro: "De economisit", de: "Noch zu sparen", es: "Falta ahorrar", it: "Ancora da risparmiare" },
  "calc.monthsToGoal": { en: "Time to reach goal", ru: "Время до цели", uk: "Час до цілі", ro: "Timp până la obiectiv", de: "Zeit bis zum Ziel", es: "Tiempo para la meta", it: "Tempo per l'obiettivo" },
  "calc.timeToPayoff": { en: "Time to pay off", ru: "Срок погашения", uk: "Термін погашення", ro: "Timp de achitare", de: "Tilgungsdauer", es: "Tiempo de pago", it: "Tempo di estinzione" },
  "calc.totalInterestPaid": { en: "Total interest paid", ru: "Всего процентов", uk: "Усього відсотків", ro: "Total dobândă plătită", de: "Gezahlte Zinsen gesamt", es: "Interés total pagado", it: "Interessi totali pagati" },
  "calc.fireNumber": { en: "Your FIRE number", ru: "Ваше число FIRE", uk: "Ваше число FIRE", ro: "Numărul tău FIRE", de: "Deine FIRE-Zahl", es: "Tu número FIRE", it: "Il tuo numero FIRE" },
  "calc.yearsToFire": { en: "Years to financial independence", ru: "Лет до фин. независимости", uk: "Років до фін. незалежності", ro: "Ani până la independență", de: "Jahre bis zur finanziellen Freiheit", es: "Años hasta la independencia", it: "Anni all'indipendenza finanziaria" },
  "calc.years_unit": { en: "yr", ru: "лет", uk: "р.", ro: "ani", de: "J.", es: "años", it: "anni" },
  "calc.months_unit": { en: "mo", ru: "мес.", uk: "міс.", ro: "luni", de: "Mon.", es: "meses", it: "mesi" },
  "calc.never": { en: "Payment too low to ever pay off", ru: "Платёж слишком мал для погашения", uk: "Платіж замалий для погашення", ro: "Plată prea mică pentru achitare", de: "Rate zu niedrig zur Tilgung", es: "Pago demasiado bajo para saldar", it: "Pagamento troppo basso per estinguere" },

  // Budget v2 — compare actual spending
  "calc.compareTitle": { en: "Compare with your actual spending", ru: "Сравните с реальными тратами", uk: "Порівняйте з реальними витратами", ro: "Compară cu cheltuielile tale reale", de: "Mit deinen tatsächlichen Ausgaben vergleichen", es: "Compara con tu gasto real", it: "Confronta con la tua spesa reale" },
  "calc.compareHint": { en: "Optional — enter what you actually spend to see where you're over or under the 50/30/20 targets.", ru: "Необязательно — введите реальные траты, чтобы увидеть, где вы выше или ниже нормы 50/30/20.", uk: "Необов'язково — введіть реальні витрати, щоб побачити, де ви вище чи нижче норми 50/30/20.", ro: "Opțional — introdu cât cheltuiești ca să vezi unde ești peste sau sub țintele 50/30/20.", de: "Optional — trage deine echten Ausgaben ein, um zu sehen, wo du über oder unter den 50/30/20-Zielen liegst.", es: "Opcional: introduce lo que gastas para ver dónde estás por encima o por debajo del 50/30/20.", it: "Opzionale — inserisci quanto spendi per vedere dove sei sopra o sotto gli obiettivi 50/30/20." },
  "calc.onTrack": { en: "on track", ru: "в норме", uk: "у нормі", ro: "în grafic", de: "im Plan", es: "en línea", it: "in linea" },
  "calc.over": { en: "{amt} over", ru: "на {amt} больше", uk: "на {amt} більше", ro: "cu {amt} peste", de: "{amt} über", es: "{amt} de más", it: "{amt} in più" },
  "calc.under": { en: "{amt} under", ru: "на {amt} меньше", uk: "на {amt} менше", ro: "cu {amt} sub", de: "{amt} unter", es: "{amt} de menos", it: "{amt} in meno" },

  // Emergency v2
  "calc.fundedPct": { en: "Funded", ru: "Собрано", uk: "Зібрано", ro: "Acoperit", de: "Gedeckt", es: "Cubierto", it: "Coperto" },
  "calc.timeToFund": { en: "Time to fully funded", ru: "Время до полной подушки", uk: "Час до повної подушки", ro: "Timp până la fondul complet", de: "Zeit bis vollständig gedeckt", es: "Tiempo hasta completarlo", it: "Tempo per completarlo" },
  "calc.done": { en: "Fully funded 🎉", ru: "Подушка собрана 🎉", uk: "Подушку зібрано 🎉", ro: "Fond complet 🎉", de: "Vollständig gedeckt 🎉", es: "¡Completado! 🎉", it: "Completato 🎉" },

  // Savings v2 — modes
  "calc.modeByAmount": { en: "I save monthly", ru: "Откладываю в месяц", uk: "Відкладаю на місяць", ro: "Economisesc lunar", de: "Ich spare monatlich", es: "Ahorro al mes", it: "Risparmio al mese" },
  "calc.modeByDate": { en: "I have a deadline", ru: "Есть срок", uk: "Є термін", ro: "Am un termen", de: "Ich habe eine Frist", es: "Tengo una fecha", it: "Ho una scadenza" },
  "calc.deadlineMonths": { en: "Months until you need it", ru: "Через сколько месяцев нужно", uk: "Через скільки місяців потрібно", ro: "În câte luni ai nevoie", de: "Monate bis du es brauchst", es: "Meses hasta que lo necesitas", it: "Mesi entro cui ti serve" },
  "calc.requiredMonthly": { en: "Save this per month", ru: "Откладывать в месяц", uk: "Відкладати на місяць", ro: "Economisește pe lună", de: "Pro Monat sparen", es: "Ahorra al mes", it: "Risparmia al mese" },
  "calc.returnOptional": { en: "Annual return (%) — optional", ru: "Годовая доходность (%) — необязательно", uk: "Річна дохідність (%) — необов'язково", ro: "Randament anual (%) — opțional", de: "Jährliche Rendite (%) — optional", es: "Rendimiento anual (%) — opcional", it: "Rendimento annuo (%) — opzionale" },
  "calc.reached": { en: "You've already reached your goal 🎉", ru: "Цель уже достигнута 🎉", uk: "Ціль уже досягнута 🎉", ro: "Ai atins deja obiectivul 🎉", de: "Du hast dein Ziel bereits erreicht 🎉", es: "Ya alcanzaste tu meta 🎉", it: "Hai già raggiunto l'obiettivo 🎉" },

  // Per-calculator title + description (also used for <title>/meta)
  "calc.ci.title": { en: "Compound Interest Calculator", ru: "Калькулятор сложных процентов", uk: "Калькулятор складних відсотків", ro: "Calculator dobândă compusă", de: "Zinseszins-Rechner", es: "Calculadora de interés compuesto", it: "Calcolatore interesse composto" },
  "calc.ci.desc": { en: "See how your savings grow over time with monthly contributions and compounding returns.", ru: "Посмотрите, как ваши накопления растут со временем с ежемесячными взносами и сложным процентом.", uk: "Подивіться, як ваші заощадження зростають із щомісячними внесками та складним відсотком.", ro: "Vezi cum cresc economiile în timp cu contribuții lunare și dobândă compusă.", de: "Sieh, wie deine Ersparnisse mit monatlichen Beiträgen und Zinseszins wachsen.", es: "Mira cómo crecen tus ahorros con aportes mensuales e interés compuesto.", it: "Scopri come crescono i risparmi nel tempo con versamenti mensili e interesse composto." },
  "calc.budget.title": { en: "50/30/20 Budget Calculator", ru: "Калькулятор бюджета 50/30/20", uk: "Калькулятор бюджету 50/30/20", ro: "Calculator buget 50/30/20", de: "50/30/20-Budgetrechner", es: "Calculadora de presupuesto 50/30/20", it: "Calcolatore budget 50/30/20" },
  "calc.budget.desc": { en: "Split your income into needs, wants, and savings with the popular 50/30/20 rule.", ru: "Разделите доход на нужды, желания и накопления по популярному правилу 50/30/20.", uk: "Розділіть дохід на потреби, бажання та заощадження за правилом 50/30/20.", ro: "Împarte-ți venitul în nevoi, dorințe și economii cu regula 50/30/20.", de: "Teile dein Einkommen mit der 50/30/20-Regel in Bedürfnisse, Wünsche und Sparen auf.", es: "Divide tus ingresos en necesidades, deseos y ahorro con la regla 50/30/20.", it: "Dividi il reddito in necessità, desideri e risparmio con la regola 50/30/20." },
  "calc.emergency.title": { en: "Emergency Fund Calculator", ru: "Калькулятор подушки безопасности", uk: "Калькулятор фінансової подушки", ro: "Calculator fond de urgență", de: "Notgroschen-Rechner", es: "Calculadora de fondo de emergencia", it: "Calcolatore fondo di emergenza" },
  "calc.emergency.desc": { en: "Find out how big your emergency fund should be and how much is left to save.", ru: "Узнайте, какой должна быть подушка безопасности и сколько осталось накопить.", uk: "Дізнайтеся, якою має бути фінансова подушка і скільки залишилось накопичити.", ro: "Află cât de mare ar trebui să fie fondul de urgență și cât mai ai de economisit.", de: "Finde heraus, wie groß dein Notgroschen sein sollte und wie viel noch fehlt.", es: "Descubre qué tan grande debe ser tu fondo de emergencia y cuánto falta.", it: "Scopri quanto dovrebbe essere grande il fondo di emergenza e quanto manca." },
  "calc.savings.title": { en: "Savings Goal Calculator", ru: "Калькулятор цели накоплений", uk: "Калькулятор цілі заощаджень", ro: "Calculator obiectiv de economii", de: "Sparziel-Rechner", es: "Calculadora de meta de ahorro", it: "Calcolatore obiettivo di risparmio" },
  "calc.savings.desc": { en: "See how long it takes to reach a savings goal at your current monthly pace.", ru: "Узнайте, за сколько достигнете цели при текущем ежемесячном темпе.", uk: "Дізнайтеся, за скільки досягнете цілі за поточним темпом.", ro: "Vezi în cât timp atingi un obiectiv la ritmul tău lunar actual.", de: "Sieh, wie lange du für ein Sparziel bei deinem aktuellen Tempo brauchst.", es: "Mira cuánto tardas en alcanzar una meta a tu ritmo mensual actual.", it: "Scopri quanto ci vuole per raggiungere un obiettivo al ritmo attuale." },
  "calc.debt.title": { en: "Debt Payoff Calculator", ru: "Калькулятор погашения долга", uk: "Калькулятор погашення боргу", ro: "Calculator achitare datorii", de: "Schuldentilgungs-Rechner", es: "Calculadora de pago de deudas", it: "Calcolatore estinzione debiti" },
  "calc.debt.desc": { en: "See how long it takes to clear a debt and how much interest you'll pay.", ru: "Узнайте, за сколько закроете долг и сколько заплатите процентов.", uk: "Дізнайтеся, за скільки закриєте борг і скільки заплатите відсотків.", ro: "Vezi în cât timp achiți o datorie și câtă dobândă plătești.", de: "Sieh, wie lange die Tilgung dauert und wie viel Zinsen anfallen.", es: "Mira cuánto tardas en saldar una deuda y cuánto interés pagarás.", it: "Scopri in quanto tempo estingui un debito e quanti interessi pagherai." },
  "calc.fire.title": { en: "FIRE Calculator", ru: "Калькулятор FIRE", uk: "Калькулятор FIRE", ro: "Calculator FIRE", de: "FIRE-Rechner", es: "Calculadora FIRE", it: "Calcolatore FIRE" },
  "calc.fire.desc": { en: "Estimate your financial-independence number and how many years until you can retire early.", ru: "Оцените число финансовой независимости и через сколько лет сможете выйти на раннюю пенсию.", uk: "Оцініть число фінансової незалежності й через скільки років вийдете на ранню пенсію.", ro: "Estimează numărul independenței financiare și în câți ani te poți retrage devreme.", de: "Schätze deine Zahl für finanzielle Freiheit und wie viele Jahre bis zur Frührente.", es: "Estima tu número de independencia financiera y en cuántos años puedes jubilarte antes.", it: "Stima il tuo numero d'indipendenza finanziaria e tra quanti anni puoi ritirarti prima." },
  "calc.subs.title": { en: "Subscription Cost Calculator", ru: "Калькулятор стоимости подписок", uk: "Калькулятор вартості підписок", ro: "Calculator cost abonamente", de: "Abo-Kosten-Rechner", es: "Calculadora de suscripciones", it: "Calcolatore costi abbonamenti" },
  "calc.subs.desc": { en: "Add up what your subscriptions really cost per month and year — and what that money could become instead.", ru: "Посчитайте, сколько подписки стоят в месяц и в год на самом деле — и чем эти деньги могли бы стать.", uk: "Порахуйте, скільки підписки коштують на місяць і на рік насправді — і чим ці гроші могли б стати.", ro: "Calculează cât costă abonamentele tale pe lună și pe an — și ce ar putea deveni acei bani.", de: "Rechne zusammen, was deine Abos pro Monat und Jahr wirklich kosten — und was dieses Geld stattdessen werden könnte.", es: "Suma lo que tus suscripciones cuestan realmente al mes y al año — y en qué podría convertirse ese dinero.", it: "Somma quanto costano davvero i tuoi abbonamenti al mese e all'anno — e cosa potrebbero diventare quei soldi." },
  "calc.subs.name": { en: "Subscription", ru: "Подписка", uk: "Підписка", ro: "Abonament", de: "Abo", es: "Suscripción", it: "Abbonamento" },
  "calc.subs.price": { en: "Price", ru: "Цена", uk: "Ціна", ro: "Preț", de: "Preis", es: "Precio", it: "Prezzo" },
  "calc.subs.perMonth": { en: "/ month", ru: "/ месяц", uk: "/ місяць", ro: "/ lună", de: "/ Monat", es: "/ mes", it: "/ mese" },
  "calc.subs.perYear": { en: "/ year", ru: "/ год", uk: "/ рік", ro: "/ an", de: "/ Jahr", es: "/ año", it: "/ anno" },
  "calc.subs.add": { en: "+ Add subscription", ru: "+ Добавить подписку", uk: "+ Додати підписку", ro: "+ Adaugă abonament", de: "+ Abo hinzufügen", es: "+ Añadir suscripción", it: "+ Aggiungi abbonamento" },
  "calc.subs.totalYear": { en: "Cost per year", ru: "Стоимость в год", uk: "Вартість на рік", ro: "Cost pe an", de: "Kosten pro Jahr", es: "Coste al año", it: "Costo all'anno" },
  "calc.subs.totalMonth": { en: "Per month", ru: "В месяц", uk: "На місяць", ro: "Pe lună", de: "Pro Monat", es: "Al mes", it: "Al mese" },
  "calc.subs.perDay": { en: "Per day", ru: "В день", uk: "На день", ro: "Pe zi", de: "Pro Tag", es: "Al día", it: "Al giorno" },
  "calc.subs.invested": { en: "In 5 years if invested (7%)", ru: "Через 5 лет, если инвестировать (7%)", uk: "Через 5 років, якщо інвестувати (7%)", ro: "În 5 ani dacă investești (7%)", de: "In 5 Jahren, wenn investiert (7 %)", es: "En 5 años si se invierte (7%)", it: "In 5 anni se investiti (7%)" },

  "calc.split.title": { en: "Couple Expense Split Calculator", ru: "Калькулятор раздела расходов для пар", uk: "Калькулятор поділу витрат для пар", ro: "Calculator împărțire cheltuieli în cuplu", de: "Paar-Kostenaufteilungs-Rechner", es: "Calculadora de gastos en pareja", it: "Calcolatore divisione spese di coppia" },
  "calc.split.desc": { en: "Split shared expenses fairly — 50/50 or proportional to income. See exactly what each partner should contribute.", ru: "Делите общие расходы честно — 50/50 или пропорционально доходу. Точно увидите вклад каждого.", uk: "Діліть спільні витрати чесно — 50/50 або пропорційно доходу. Точно побачите внесок кожного.", ro: "Împarte cheltuielile comune corect — 50/50 sau proporțional cu venitul. Vezi exact contribuția fiecăruia.", de: "Teile gemeinsame Ausgaben fair — 50/50 oder proportional zum Einkommen. Sieh genau, was jeder beitragen sollte.", es: "Divide los gastos comunes de forma justa: 50/50 o proporcional a los ingresos. Ve exactamente cuánto aporta cada uno.", it: "Dividi le spese comuni equamente — 50/50 o in proporzione al reddito. Vedi esattamente quanto contribuisce ciascuno." },
  "calc.split.income1": { en: "Your net income / month", ru: "Ваш доход в месяц (нетто)", uk: "Ваш дохід на місяць (нетто)", ro: "Venitul tău net / lună", de: "Dein Nettoeinkommen / Monat", es: "Tus ingresos netos / mes", it: "Il tuo reddito netto / mese" },
  "calc.split.income2": { en: "Partner's net income / month", ru: "Доход партнёра в месяц (нетто)", uk: "Дохід партнера на місяць (нетто)", ro: "Venitul net al partenerului / lună", de: "Nettoeinkommen des Partners / Monat", es: "Ingresos netos de tu pareja / mes", it: "Reddito netto del partner / mese" },
  "calc.split.shared": { en: "Shared expenses / month", ru: "Общие расходы в месяц", uk: "Спільні витрати на місяць", ro: "Cheltuieli comune / lună", de: "Gemeinsame Ausgaben / Monat", es: "Gastos comunes / mes", it: "Spese comuni / mese" },
  "calc.split.mode5050": { en: "50/50", ru: "50/50", uk: "50/50", ro: "50/50", de: "50/50", es: "50/50", it: "50/50" },
  "calc.split.modeProp": { en: "By income", ru: "По доходу", uk: "За доходом", ro: "După venit", de: "Nach Einkommen", es: "Según ingresos", it: "In base al reddito" },
  "calc.split.yourShare": { en: "Your share", ru: "Ваша доля", uk: "Ваша частка", ro: "Partea ta", de: "Dein Anteil", es: "Tu parte", it: "La tua quota" },
  "calc.split.partnerShare": { en: "Partner's share", ru: "Доля партнёра", uk: "Частка партнера", ro: "Partea partenerului", de: "Anteil des Partners", es: "Parte de tu pareja", it: "Quota del partner" },
  "calc.split.leftover1": { en: "You keep after shared costs", ru: "У вас остаётся после общих расходов", uk: "У вас лишається після спільних витрат", ro: "Îți rămâne după cheltuielile comune", de: "Dir bleibt nach gemeinsamen Kosten", es: "Te queda tras los gastos comunes", it: "Ti resta dopo le spese comuni" },
  "calc.split.leftover2": { en: "Partner keeps after shared costs", ru: "У партнёра остаётся после общих расходов", uk: "У партнера лишається після спільних витрат", ro: "Partenerului îi rămâne după cheltuieli", de: "Dem Partner bleibt nach gemeinsamen Kosten", es: "A tu pareja le queda tras los gastos", it: "Al partner resta dopo le spese comuni" },

  // ── New calculators (English-first; other locales fall back to en) ──────────
  // Titles & descriptions
  "calc.loan.title": { en: "Loan Calculator", ru: "Кредитный калькулятор", uk: "Кредитний калькулятор", ro: "Calculator de credit", de: "Kreditrechner", es: "Calculadora de préstamos", it: "Calcolatore di prestiti" },
  "calc.loan.desc": { en: "Work out the monthly payment, total cost, and interest on any personal or fixed-rate loan.", ru: "Рассчитайте ежемесячный платёж, полную стоимость и проценты по любому кредиту с фиксированной ставкой.", uk: "Розрахуйте щомісячний платіж, повну вартість і відсотки за будь-яким кредитом із фіксованою ставкою.", ro: "Calculează rata lunară, costul total și dobânda pentru orice credit cu rată fixă.", de: "Berechne die monatliche Rate, Gesamtkosten und Zinsen für jeden Kredit mit festem Zinssatz.", es: "Calcula la cuota mensual, el coste total y los intereses de cualquier préstamo a tipo fijo.", it: "Calcola la rata mensile, il costo totale e gli interessi di qualsiasi prestito a tasso fisso." },
  "calc.mbudget.title": { en: "Monthly Budget Calculator", ru: "Калькулятор месячного бюджета", uk: "Калькулятор місячного бюджету", ro: "Calculator de buget lunar", de: "Monatsbudget-Rechner", es: "Calculadora de presupuesto mensual", it: "Calcolatore budget mensile" },
  "calc.mbudget.desc": { en: "Add up your monthly expenses, see what's left to save, and check your savings rate at a glance.", ru: "Сложите месячные расходы, посмотрите, сколько остаётся на накопления, и оцените норму сбережений с одного взгляда.", uk: "Складіть місячні витрати, подивіться, скільки лишається на заощадження, і оцініть норму збережень з одного погляду.", ro: "Adună cheltuielile lunare, vezi cât rămâne de economisit și verifică rata de economisire dintr-o privire.", de: "Addiere deine monatlichen Ausgaben, sieh, was zum Sparen bleibt, und prüfe deine Sparquote auf einen Blick.", es: "Suma tus gastos mensuales, mira cuánto queda para ahorrar y comprueba tu tasa de ahorro de un vistazo.", it: "Somma le spese mensili, vedi quanto resta da risparmiare e controlla il tuo tasso di risparmio a colpo d'occhio." },
  "calc.salary.title": { en: "Salary Calculator", ru: "Калькулятор зарплаты", uk: "Калькулятор зарплати", ro: "Calculator de salariu", de: "Gehaltsrechner", es: "Calculadora de salario", it: "Calcolatore di stipendio" },
  "calc.salary.desc": { en: "Convert any wage between hourly, weekly, monthly, and annual pay in one place.", ru: "Переводите любую оплату между часовой, недельной, месячной и годовой в одном месте.", uk: "Переводьте будь-яку оплату між годинною, тижневою, місячною та річною в одному місці.", ro: "Convertește orice remunerație între orară, săptămânală, lunară și anuală într-un singur loc.", de: "Rechne jede Bezahlung zwischen Stunden-, Wochen-, Monats- und Jahreslohn um — an einem Ort.", es: "Convierte cualquier sueldo entre por hora, semanal, mensual y anual en un solo lugar.", it: "Converti qualsiasi retribuzione tra oraria, settimanale, mensile e annuale in un unico posto." },
  "calc.infl.title": { en: "Inflation Calculator", ru: "Калькулятор инфляции", uk: "Калькулятор інфляції", ro: "Calculator de inflație", de: "Inflationsrechner", es: "Calculadora de inflación", it: "Calcolatore di inflazione" },
  "calc.infl.desc": { en: "See what a sum of money will cost in the future and how much buying power it loses to inflation.", ru: "Узнайте, сколько сумма будет стоить в будущем и сколько покупательной способности она теряет из-за инфляции.", uk: "Дізнайтеся, скільки сума коштуватиме в майбутньому і скільки купівельної спроможності вона втрачає через інфляцію.", ro: "Află cât va costa o sumă în viitor și câtă putere de cumpărare pierde din cauza inflației.", de: "Sieh, was eine Geldsumme in Zukunft kostet und wie viel Kaufkraft sie durch Inflation verliert.", es: "Descubre cuánto costará una cantidad en el futuro y cuánto poder adquisitivo pierde por la inflación.", it: "Scopri quanto costerà una somma in futuro e quanto potere d'acquisto perde a causa dell'inflazione." },
  "calc.disc.title": { en: "Discount Calculator", ru: "Калькулятор скидки", uk: "Калькулятор знижки", ro: "Calculator de reducere", de: "Rabattrechner", es: "Calculadora de descuento", it: "Calcolatore di sconto" },
  "calc.disc.desc": { en: "Find the sale price and how much you save with any percentage discount.", ru: "Найдите цену со скидкой и сколько вы экономите при любом проценте скидки.", uk: "Знайдіть ціну зі знижкою і скільки ви заощаджуєте за будь-якого відсотка знижки.", ro: "Află prețul redus și cât economisești la orice procent de reducere.", de: "Finde den Aktionspreis und wie viel du bei jedem Rabattprozentsatz sparst.", es: "Calcula el precio con descuento y cuánto ahorras con cualquier porcentaje de descuento.", it: "Trova il prezzo scontato e quanto risparmi con qualsiasi percentuale di sconto." },
  "calc.vat.title": { en: "VAT Calculator", ru: "Калькулятор НДС", uk: "Калькулятор ПДВ", ro: "Calculator TVA", de: "Mehrwertsteuer-Rechner", es: "Calculadora de IVA", it: "Calcolatore IVA" },
  "calc.vat.desc": { en: "Add VAT to a net price or extract VAT from a gross price at any rate.", ru: "Добавьте НДС к цене без налога или выделите НДС из цены с налогом по любой ставке.", uk: "Додайте ПДВ до ціни без податку або виділіть ПДВ із ціни з податком за будь-якою ставкою.", ro: "Adaugă TVA la un preț fără taxă sau extrage TVA dintr-un preț cu taxă, la orice cotă.", de: "Füge Mehrwertsteuer zu einem Nettopreis hinzu oder rechne sie aus einem Bruttopreis heraus — bei jedem Satz.", es: "Añade IVA a un precio sin impuestos o extrae el IVA de un precio con impuestos a cualquier tipo.", it: "Aggiungi l'IVA a un prezzo netto o estrai l'IVA da un prezzo lordo con qualsiasi aliquota." },
  "calc.stax.title": { en: "Sales Tax Calculator", ru: "Калькулятор налога с продаж", uk: "Калькулятор податку з продажу", ro: "Calculator taxă de vânzare", de: "Umsatzsteuer-Rechner", es: "Calculadora de impuesto sobre ventas", it: "Calcolatore imposta sulle vendite" },
  "calc.stax.desc": { en: "Calculate sales tax on a purchase and the final total you'll pay at checkout.", ru: "Рассчитайте налог с продаж на покупку и итоговую сумму к оплате на кассе.", uk: "Розрахуйте податок з продажу на покупку та підсумкову суму до сплати на касі.", ro: "Calculează taxa de vânzare pentru o achiziție și totalul final de plată la casă.", de: "Berechne die Verkaufssteuer auf einen Einkauf und den Endbetrag an der Kasse.", es: "Calcula el impuesto sobre ventas de una compra y el total final que pagarás en caja.", it: "Calcola l'imposta sulle vendite di un acquisto e il totale finale da pagare alla cassa." },
  "calc.si.title": { en: "Simple Interest Calculator", ru: "Калькулятор простых процентов", uk: "Калькулятор простих відсотків", ro: "Calculator dobândă simplă", de: "Rechner für einfache Zinsen", es: "Calculadora de interés simple", it: "Calcolatore interesse semplice" },
  "calc.si.desc": { en: "Calculate simple interest and the total value on a loan or deposit over time.", ru: "Рассчитайте простые проценты и итоговую сумму по вкладу или займу за период.", uk: "Розрахуйте прості відсотки та підсумкову суму за вкладом або позикою за період.", ro: "Calculează dobânda simplă și valoarea totală a unui depozit sau împrumut în timp.", de: "Berechne einfache Zinsen und den Gesamtwert einer Anlage oder eines Kredits über die Zeit.", es: "Calcula el interés simple y el valor total de un depósito o préstamo a lo largo del tiempo.", it: "Calcola l'interesse semplice e il valore totale di un deposito o prestito nel tempo." },
  "calc.auto.title": { en: "Car Loan Calculator", ru: "Калькулятор автокредита", uk: "Калькулятор автокредиту", ro: "Calculator credit auto", de: "Autokredit-Rechner", es: "Calculadora de préstamo de coche", it: "Calcolatore prestito auto" },
  "calc.auto.desc": { en: "Estimate your car loan payment after down payment and trade-in, plus total interest.", ru: "Оцените платёж по автокредиту после первого взноса и трейд-ина, а также общие проценты.", uk: "Оцініть платіж за автокредитом після першого внеску й трейд-іну, а також загальні відсотки.", ro: "Estimează rata creditului auto după avans și trade-in, plus dobânda totală.", de: "Schätze deine Autokreditrate nach Anzahlung und Inzahlungnahme sowie die Gesamtzinsen.", es: "Estima la cuota de tu préstamo de coche tras la entrada y el vehículo entregado, más los intereses totales.", it: "Stima la rata del prestito auto dopo anticipo e permuta, più gli interessi totali." },
  "calc.rent.title": { en: "Rent Affordability Calculator", ru: "Калькулятор доступной аренды", uk: "Калькулятор доступної оренди", ro: "Calculator chirie accesibilă", de: "Mietbudget-Rechner", es: "Calculadora de alquiler asequible", it: "Calcolatore affitto sostenibile" },
  "calc.rent.desc": { en: "See how much rent you can comfortably afford based on your income.", ru: "Узнайте, какую аренду вы можете комфортно позволить, исходя из дохода.", uk: "Дізнайтеся, яку оренду ви можете комфортно дозволити, виходячи з доходу.", ro: "Află ce chirie îți poți permite confortabil în funcție de venit.", de: "Sieh, welche Miete du dir auf Basis deines Einkommens bequem leisten kannst.", es: "Descubre cuánto alquiler puedes permitirte cómodamente según tus ingresos.", it: "Scopri quale affitto puoi permetterti comodamente in base al reddito." },
  "calc.consol.title": { en: "Debt Consolidation Calculator", ru: "Калькулятор консолидации долгов", uk: "Калькулятор консолідації боргів", ro: "Calculator consolidare datorii", de: "Rechner zur Schuldenkonsolidierung", es: "Calculadora de consolidación de deudas", it: "Calcolatore consolidamento debiti" },
  "calc.consol.desc": { en: "Compare your current debt with a single consolidation loan and see how much interest you could save.", ru: "Сравните текущий долг с одним кредитом на консолидацию и посмотрите, сколько процентов можно сэкономить.", uk: "Порівняйте поточний борг з одним кредитом на консолідацію і подивіться, скільки відсотків можна заощадити.", ro: "Compară datoria actuală cu un singur credit de consolidare și vezi câtă dobândă poți economisi.", de: "Vergleiche deine aktuellen Schulden mit einem einzigen Konsolidierungskredit und sieh, wie viel Zinsen du sparen kannst.", es: "Compara tu deuda actual con un único préstamo de consolidación y mira cuánto interés puedes ahorrar.", it: "Confronta il debito attuale con un unico prestito di consolidamento e vedi quanti interessi puoi risparmiare." },
  "calc.ret.title": { en: "Retirement Calculator", ru: "Пенсионный калькулятор", uk: "Пенсійний калькулятор", ro: "Calculator de pensionare", de: "Rentenrechner", es: "Calculadora de jubilación", it: "Calcolatore pensione" },
  "calc.ret.desc": { en: "Project your retirement savings and estimated monthly income from your contributions.", ru: "Спрогнозируйте пенсионные накопления и ожидаемый месячный доход от ваших взносов.", uk: "Спрогнозуйте пенсійні заощадження та очікуваний місячний дохід від ваших внесків.", ro: "Estimează economiile pentru pensie și venitul lunar estimat din contribuțiile tale.", de: "Prognostiziere deine Altersvorsorge und das geschätzte monatliche Einkommen aus deinen Beiträgen.", es: "Proyecta tus ahorros para la jubilación y el ingreso mensual estimado de tus aportaciones.", it: "Prevedi i risparmi per la pensione e il reddito mensile stimato dai tuoi versamenti." },
  "calc.roi.title": { en: "ROI Calculator", ru: "Калькулятор ROI (окупаемости)", uk: "Калькулятор ROI (окупності)", ro: "Calculator ROI (randament)", de: "ROI-Rechner (Kapitalrendite)", es: "Calculadora de ROI (retorno)", it: "Calcolatore ROI (rendimento)" },
  "calc.roi.desc": { en: "Calculate return on investment, net profit, and annualized return on any investment.", ru: "Рассчитайте окупаемость инвестиций, чистую прибыль и годовую доходность по любому вложению.", uk: "Розрахуйте окупність інвестицій, чистий прибуток і річну дохідність за будь-яким вкладенням.", ro: "Calculează randamentul investiției, profitul net și randamentul anualizat pentru orice investiție.", de: "Berechne die Kapitalrendite, den Nettogewinn und die annualisierte Rendite jeder Investition.", es: "Calcula el retorno de la inversión, el beneficio neto y la rentabilidad anualizada de cualquier inversión.", it: "Calcola il ritorno sull'investimento, l'utile netto e il rendimento annualizzato di qualsiasi investimento." },
  // Field & result labels
  "calc.loanAmount": { en: "Loan amount", ru: "Сумма кредита", uk: "Сума кредиту", ro: "Suma creditului", de: "Kreditbetrag", es: "Importe del préstamo", it: "Importo del prestito" },
  "calc.termYears": { en: "Term (years)", ru: "Срок (лет)", uk: "Строк (років)", ro: "Termen (ani)", de: "Laufzeit (Jahre)", es: "Plazo (años)", it: "Durata (anni)" },
  "calc.monthlyPayment": { en: "Monthly payment", ru: "Ежемесячный платёж", uk: "Щомісячний платіж", ro: "Rată lunară", de: "Monatliche Rate", es: "Cuota mensual", it: "Rata mensile" },
  "calc.totalPaid": { en: "Total paid", ru: "Всего выплачено", uk: "Усього виплачено", ro: "Total plătit", de: "Insgesamt gezahlt", es: "Total pagado", it: "Totale pagato" },
  "calc.exp.housing": { en: "Housing / rent", ru: "Жильё / аренда", uk: "Житло / оренда", ro: "Locuință / chirie", de: "Wohnen / Miete", es: "Vivienda / alquiler", it: "Casa / affitto" },
  "calc.exp.food": { en: "Food & groceries", ru: "Еда и продукты", uk: "Їжа та продукти", ro: "Mâncare și alimente", de: "Essen & Lebensmittel", es: "Comida y alimentos", it: "Cibo e spesa" },
  "calc.exp.transport": { en: "Transport", ru: "Транспорт", uk: "Транспорт", ro: "Transport", de: "Transport", es: "Transporte", it: "Trasporti" },
  "calc.exp.other": { en: "Other expenses", ru: "Прочие расходы", uk: "Інші витрати", ro: "Alte cheltuieli", de: "Sonstige Ausgaben", es: "Otros gastos", it: "Altre spese" },
  "calc.leftover": { en: "Left to save", ru: "Остаётся на накопления", uk: "Лишається на заощадження", ro: "Rămâne de economisit", de: "Bleibt zum Sparen", es: "Queda para ahorrar", it: "Resta da risparmiare" },
  "calc.totalExpenses": { en: "Total expenses", ru: "Всего расходов", uk: "Усього витрат", ro: "Total cheltuieli", de: "Ausgaben gesamt", es: "Gastos totales", it: "Spese totali" },
  "calc.savingsRate": { en: "Savings rate", ru: "Норма сбережений", uk: "Норма збережень", ro: "Rată de economisire", de: "Sparquote", es: "Tasa de ahorro", it: "Tasso di risparmio" },
  "calc.salaryAmount": { en: "Amount", ru: "Сумма", uk: "Сума", ro: "Sumă", de: "Betrag", es: "Cantidad", it: "Importo" },
  "calc.per": { en: "Per", ru: "За период", uk: "За період", ro: "Pe", de: "Pro", es: "Por", it: "Per" },
  "calc.perHour": { en: "Hour", ru: "Час", uk: "Година", ro: "Oră", de: "Stunde", es: "Hora", it: "Ora" },
  "calc.perWeek": { en: "Week", ru: "Неделя", uk: "Тиждень", ro: "Săptămână", de: "Woche", es: "Semana", it: "Settimana" },
  "calc.perMonth2": { en: "Month", ru: "Месяц", uk: "Місяць", ro: "Lună", de: "Monat", es: "Mes", it: "Mese" },
  "calc.perYear2": { en: "Year", ru: "Год", uk: "Рік", ro: "An", de: "Jahr", es: "Año", it: "Anno" },
  "calc.hoursWeek": { en: "Hours per week", ru: "Часов в неделю", uk: "Годин на тиждень", ro: "Ore pe săptămână", de: "Stunden pro Woche", es: "Horas por semana", it: "Ore a settimana" },
  "calc.amountToday": { en: "Amount today", ru: "Сумма сегодня", uk: "Сума сьогодні", ro: "Sumă azi", de: "Betrag heute", es: "Cantidad hoy", it: "Importo oggi" },
  "calc.inflRate": { en: "Annual inflation rate (%)", ru: "Годовая инфляция (%)", uk: "Річна інфляція (%)", ro: "Rată anuală inflație (%)", de: "Jährliche Inflation (%)", es: "Inflación anual (%)", it: "Inflazione annua (%)" },
  "calc.futureCost": { en: "Equivalent cost in the future", ru: "Эквивалентная стоимость в будущем", uk: "Еквівалентна вартість у майбутньому", ro: "Costul echivalent în viitor", de: "Entsprechende Kosten in der Zukunft", es: "Coste equivalente en el futuro", it: "Costo equivalente in futuro" },
  "calc.buyingPower": { en: "Future buying power of that amount", ru: "Будущая покупательная способность этой суммы", uk: "Майбутня купівельна спроможність цієї суми", ro: "Puterea de cumpărare viitoare a sumei", de: "Künftige Kaufkraft dieses Betrags", es: "Poder adquisitivo futuro de esa cantidad", it: "Potere d'acquisto futuro di quella somma" },
  "calc.origPrice": { en: "Original price", ru: "Первоначальная цена", uk: "Початкова ціна", ro: "Preț inițial", de: "Ursprungspreis", es: "Precio original", it: "Prezzo originale" },
  "calc.discountPct": { en: "Discount (%)", ru: "Скидка (%)", uk: "Знижка (%)", ro: "Reducere (%)", de: "Rabatt (%)", es: "Descuento (%)", it: "Sconto (%)" },
  "calc.finalPrice": { en: "You pay", ru: "К оплате", uk: "До сплати", ro: "De plată", de: "Zu zahlen", es: "Pagas", it: "Paghi" },
  "calc.youSave": { en: "You save", ru: "Экономия", uk: "Заощадження", ro: "Economisești", de: "Du sparst", es: "Ahorras", it: "Risparmi" },
  "calc.amount": { en: "Amount", ru: "Сумма", uk: "Сума", ro: "Sumă", de: "Betrag", es: "Cantidad", it: "Importo" },
  "calc.vatRate": { en: "VAT rate (%)", ru: "Ставка НДС (%)", uk: "Ставка ПДВ (%)", ro: "Cotă TVA (%)", de: "Mehrwertsteuersatz (%)", es: "Tipo de IVA (%)", it: "Aliquota IVA (%)" },
  "calc.addVat": { en: "Add VAT", ru: "Добавить НДС", uk: "Додати ПДВ", ro: "Adaugă TVA", de: "MwSt. hinzufügen", es: "Añadir IVA", it: "Aggiungi IVA" },
  "calc.extractVat": { en: "Remove VAT", ru: "Выделить НДС", uk: "Виділити ПДВ", ro: "Extrage TVA", de: "MwSt. herausrechnen", es: "Extraer IVA", it: "Estrai IVA" },
  "calc.gross": { en: "Gross (incl. VAT)", ru: "С НДС (брутто)", uk: "З ПДВ (брутто)", ro: "Cu TVA (brut)", de: "Brutto (inkl. MwSt.)", es: "Con IVA (bruto)", it: "Lordo (IVA incl.)" },
  "calc.net": { en: "Net (excl. VAT)", ru: "Без НДС (нетто)", uk: "Без ПДВ (нетто)", ro: "Fără TVA (net)", de: "Netto (ohne MwSt.)", es: "Sin IVA (neto)", it: "Netto (IVA escl.)" },
  "calc.vatAmount": { en: "VAT amount", ru: "Сумма НДС", uk: "Сума ПДВ", ro: "Valoare TVA", de: "MwSt.-Betrag", es: "Importe del IVA", it: "Importo IVA" },
  "calc.preTaxPrice": { en: "Pre-tax price", ru: "Цена без налога", uk: "Ціна без податку", ro: "Preț fără taxă", de: "Preis vor Steuer", es: "Precio sin impuestos", it: "Prezzo al netto d'imposta" },
  "calc.taxRate": { en: "Sales tax rate (%)", ru: "Ставка налога с продаж (%)", uk: "Ставка податку з продажу (%)", ro: "Cotă taxă de vânzare (%)", de: "Umsatzsteuersatz (%)", es: "Tipo de impuesto (%)", it: "Aliquota d'imposta (%)" },
  "calc.totalWithTax": { en: "Total with tax", ru: "Итого с налогом", uk: "Разом з податком", ro: "Total cu taxă", de: "Gesamt inkl. Steuer", es: "Total con impuesto", it: "Totale con imposta" },
  "calc.taxAmount": { en: "Tax amount", ru: "Сумма налога", uk: "Сума податку", ro: "Valoare taxă", de: "Steuerbetrag", es: "Importe del impuesto", it: "Importo imposta" },
  "calc.totalValue": { en: "Total value", ru: "Итоговая сумма", uk: "Підсумкова сума", ro: "Valoare totală", de: "Gesamtwert", es: "Valor total", it: "Valore totale" },
  "calc.vehiclePrice": { en: "Vehicle price", ru: "Цена автомобиля", uk: "Ціна автомобіля", ro: "Preț vehicul", de: "Fahrzeugpreis", es: "Precio del vehículo", it: "Prezzo del veicolo" },
  "calc.downPayment": { en: "Down payment", ru: "Первоначальный взнос", uk: "Початковий внесок", ro: "Avans", de: "Anzahlung", es: "Entrada", it: "Anticipo" },
  "calc.tradeIn": { en: "Trade-in value", ru: "Стоимость трейд-ина", uk: "Вартість трейд-іну", ro: "Valoare trade-in", de: "Inzahlungnahmewert", es: "Valor del vehículo entregado", it: "Valore permuta" },
  "calc.amountFinanced": { en: "Amount financed", ru: "Сумма финансирования", uk: "Сума фінансування", ro: "Sumă finanțată", de: "Finanzierter Betrag", es: "Importe financiado", it: "Importo finanziato" },
  "calc.grossIncome": { en: "Gross monthly income", ru: "Валовой доход в месяц", uk: "Валовий дохід на місяць", ro: "Venit brut lunar", de: "Monatliches Bruttoeinkommen", es: "Ingreso bruto mensual", it: "Reddito lordo mensile" },
  "calc.rentPct": { en: "Share of income spent on rent", ru: "Доля дохода на аренду", uk: "Частка доходу на оренду", ro: "Cota din venit pentru chirie", de: "Anteil des Einkommens für Miete", es: "Parte del ingreso en alquiler", it: "Quota di reddito per l'affitto" },
  "calc.recRent": { en: "Recommended rent", ru: "Рекомендуемая аренда", uk: "Рекомендована оренда", ro: "Chirie recomandată", de: "Empfohlene Miete", es: "Alquiler recomendado", it: "Affitto consigliato" },
  "calc.conservative": { en: "Conservative (25%)", ru: "Осторожно (25%)", uk: "Обережно (25%)", ro: "Conservator (25%)", de: "Konservativ (25%)", es: "Conservador (25%)", it: "Conservativo (25%)" },
  "calc.stretch": { en: "Stretch (35%)", ru: "С запасом (35%)", uk: "З натяжкою (35%)", ro: "La limită (35%)", de: "Ambitioniert (35%)", es: "Al límite (35%)", it: "Al limite (35%)" },
  "calc.annualRent": { en: "Annual rent", ru: "Аренда за год", uk: "Оренда за рік", ro: "Chirie anuală", de: "Jahresmiete", es: "Alquiler anual", it: "Affitto annuo" },
  "calc.currentApr": { en: "Current APR (%)", ru: "Текущая ставка APR (%)", uk: "Поточна ставка APR (%)", ro: "APR curent (%)", de: "Aktueller effektiver Jahreszins (%)", es: "TAE actual (%)", it: "TAEG attuale (%)" },
  "calc.currentPayment": { en: "Current monthly payment", ru: "Текущий ежемесячный платёж", uk: "Поточний щомісячний платіж", ro: "Rată lunară curentă", de: "Aktuelle Monatsrate", es: "Cuota mensual actual", it: "Rata mensile attuale" },
  "calc.newApr": { en: "New loan APR (%)", ru: "APR нового кредита (%)", uk: "APR нового кредиту (%)", ro: "APR credit nou (%)", de: "Effektiver Jahreszins des neuen Kredits (%)", es: "TAE del nuevo préstamo (%)", it: "TAEG nuovo prestito (%)" },
  "calc.newPayment": { en: "New monthly payment", ru: "Новый ежемесячный платёж", uk: "Новий щомісячний платіж", ro: "Rată lunară nouă", de: "Neue Monatsrate", es: "Nueva cuota mensual", it: "Nuova rata mensile" },
  "calc.newInterest": { en: "Interest on new loan", ru: "Проценты по новому кредиту", uk: "Відсотки за новим кредитом", ro: "Dobânda la creditul nou", de: "Zinsen für den neuen Kredit", es: "Intereses del nuevo préstamo", it: "Interessi sul nuovo prestito" },
  "calc.interestSaved": { en: "Interest saved", ru: "Экономия на процентах", uk: "Заощадження на відсотках", ro: "Dobândă economisită", de: "Gesparte Zinsen", es: "Intereses ahorrados", it: "Interessi risparmiati" },
  "calc.currentAge": { en: "Current age", ru: "Текущий возраст", uk: "Поточний вік", ro: "Vârsta actuală", de: "Aktuelles Alter", es: "Edad actual", it: "Età attuale" },
  "calc.retireAge": { en: "Retirement age", ru: "Возраст выхода на пенсию", uk: "Вік виходу на пенсію", ro: "Vârsta de pensionare", de: "Renteneintrittsalter", es: "Edad de jubilación", it: "Età pensionabile" },
  "calc.nestEgg": { en: "Nest egg at retirement", ru: "Накопления к пенсии", uk: "Накопичення до пенсії", ro: "Economii la pensionare", de: "Vermögen bei Renteneintritt", es: "Ahorros al jubilarte", it: "Capitale alla pensione" },
  "calc.retIncome": { en: "Est. monthly income (4% rule)", ru: "Ориентировочный доход в месяц (правило 4%)", uk: "Орієнтовний дохід на місяць (правило 4%)", ro: "Venit lunar estimat (regula 4%)", de: "Geschätztes Monatseinkommen (4%-Regel)", es: "Ingreso mensual estimado (regla del 4%)", it: "Reddito mensile stimato (regola del 4%)" },
  "calc.amountInvested": { en: "Amount invested", ru: "Вложенная сумма", uk: "Вкладена сума", ro: "Sumă investită", de: "Investierter Betrag", es: "Cantidad invertida", it: "Importo investito" },
  "calc.finalValue": { en: "Final value", ru: "Итоговая стоимость", uk: "Підсумкова вартість", ro: "Valoare finală", de: "Endwert", es: "Valor final", it: "Valore finale" },
  "calc.yearsOptional": { en: "Years held (optional)", ru: "Срок владения, лет (необязательно)", uk: "Термін володіння, років (необов'язково)", ro: "Ani deținuți (opțional)", de: "Haltedauer in Jahren (optional)", es: "Años mantenido (opcional)", it: "Anni di detenzione (facoltativo)" },
  "calc.roiPct": { en: "Return on investment", ru: "Окупаемость инвестиций", uk: "Окупність інвестицій", ro: "Randamentul investiției", de: "Kapitalrendite", es: "Retorno de la inversión", it: "Ritorno sull'investimento" },
  "calc.netProfit": { en: "Net profit", ru: "Чистая прибыль", uk: "Чистий прибуток", ro: "Profit net", de: "Nettogewinn", es: "Beneficio neto", it: "Utile netto" },
  "calc.annualizedRoi": { en: "Annualized return", ru: "Годовая доходность", uk: "Річна дохідність", ro: "Randament anualizat", de: "Annualisierte Rendite", es: "Rentabilidad anualizada", it: "Rendimento annualizzato" },
  "calc.extraPayment": { en: "Extra monthly payment", ru: "Доп. платёж в месяц", uk: "Дод. платіж на місяць", ro: "Plată lunară suplimentară", de: "Zusätzliche Monatsrate", es: "Pago mensual extra", it: "Rata mensile extra" },
  "calc.principalPart": { en: "Principal", ru: "Тело долга", uk: "Тіло боргу", ro: "Principal", de: "Kapital", es: "Capital", it: "Capitale" },
  "calc.interestPart": { en: "Interest", ru: "Проценты", uk: "Відсотки", ro: "Dobândă", de: "Zinsen", es: "Intereses", it: "Interessi" },
  "calc.balanceOverTime": { en: "Balance over time", ru: "Баланс во времени", uk: "Баланс у часі", ro: "Sold în timp", de: "Saldo im Zeitverlauf", es: "Saldo a lo largo del tiempo", it: "Saldo nel tempo" },
  "calc.balanceCol": { en: "Balance", ru: "Баланс", uk: "Баланс", ro: "Sold", de: "Saldo", es: "Saldo", it: "Saldo" },
  "calc.showSchedule": { en: "Show year-by-year breakdown", ru: "Показать разбивку по годам", uk: "Показати розбивку за роками", ro: "Arată defalcarea pe ani", de: "Aufschlüsselung nach Jahren anzeigen", es: "Ver desglose año por año", it: "Mostra il dettaglio anno per anno" },
  "calc.yearCol": { en: "Year", ru: "Год", uk: "Рік", ro: "An", de: "Jahr", es: "Año", it: "Anno" },
  "calc.weeksYear": { en: "Weeks per year", ru: "Недель в году", uk: "Тижнів на рік", ro: "Săptămâni pe an", de: "Wochen pro Jahr", es: "Semanas por año", it: "Settimane all'anno" },
  "calc.costCol": { en: "Cost", ru: "Стоимость", uk: "Вартість", ro: "Cost", de: "Kosten", es: "Coste", it: "Costo" },
  "calc.powerCol": { en: "Buying power", ru: "Покупательная способность", uk: "Купівельна спроможність", ro: "Putere de cumpărare", de: "Kaufkraft", es: "Poder adquisitivo", it: "Potere d'acquisto" },
  "calc.autoTaxRate": { en: "Sales tax on price (%)", ru: "Налог с продаж на цену (%)", uk: "Податок з продажу на ціну (%)", ro: "Taxă de vânzare la preț (%)", de: "Umsatzsteuer auf Preis (%)", es: "Impuesto sobre el precio (%)", it: "Imposta sul prezzo (%)" },
  "calc.inflAdjustRate": { en: "Inflation rate (%)", ru: "Инфляция (%)", uk: "Інфляція (%)", ro: "Rată inflație (%)", de: "Inflationsrate (%)", es: "Tasa de inflación (%)", it: "Tasso d'inflazione (%)" },
  "calc.todaysMoney": { en: "In today's money", ru: "В сегодняшних деньгах", uk: "У сьогоднішніх грошах", ro: "În banii de azi", de: "In heutigem Geld", es: "En dinero de hoy", it: "In denaro di oggi" },
  "calc.contributions": { en: "Contributions", ru: "Взносы", uk: "Внески", ro: "Contribuții", de: "Einzahlungen", es: "Aportaciones", it: "Versamenti" },
  "calc.growth": { en: "Growth", ru: "Рост", uk: "Зростання", ro: "Creștere", de: "Wachstum", es: "Crecimiento", it: "Crescita" },
  "calc.ins.loan": { en: "Interest adds {amt} — {pct}% on top of what you borrow.", ru: "Проценты добавят {amt} — это {pct}% сверх суммы займа.", uk: "Відсотки додадуть {amt} — це {pct}% понад суму позики.", ro: "Dobânda adaugă {amt} — {pct}% peste suma împrumutată.", de: "Zinsen kosten {amt} — {pct}% zusätzlich zur Kreditsumme.", es: "Los intereses suman {amt} — un {pct}% sobre lo que pides.", it: "Gli interessi aggiungono {amt} — il {pct}% oltre l'importo preso." },
  "calc.ins.budgetOk": { en: "You're keeping {amt} a month — a {pct}% savings rate. Put it to work automatically.", ru: "Вы сохраняете {amt} в месяц — норма {pct}%. Заставьте эти деньги работать.", uk: "Ви зберігаєте {amt} на місяць — норма {pct}%. Змусьте ці гроші працювати.", ro: "Păstrezi {amt} pe lună — o rată de {pct}%. Pune banii la treabă.", de: "Du behältst {amt} im Monat — eine Sparquote von {pct}%. Lass das Geld arbeiten.", es: "Guardas {amt} al mes — una tasa del {pct}%. Haz que ese dinero trabaje.", it: "Metti da parte {amt} al mese — un tasso del {pct}%. Falli fruttare." },
  "calc.ins.budgetOver": { en: "You're over budget by {amt} a month. Trim your biggest categories to close the gap.", ru: "Вы превышаете бюджет на {amt} в месяц. Сократите крупнейшие статьи, чтобы закрыть разрыв.", uk: "Ви перевищуєте бюджет на {amt} на місяць. Скоротіть найбільші статті, щоб закрити розрив.", ro: "Depășești bugetul cu {amt} pe lună. Reduce categoriile mari ca să acoperi diferența.", de: "Du liegst {amt} im Monat über dem Budget. Kürze die größten Posten, um die Lücke zu schließen.", es: "Te pasas del presupuesto en {amt} al mes. Recorta las categorías mayores para cerrar la brecha.", it: "Sfori il budget di {amt} al mese. Taglia le categorie più grandi per colmare il divario." },
  "calc.ins.salary": { en: "That's about {amt} per hour for a {hours}-hour week.", ru: "Это примерно {amt} в час при {hours}-часовой неделе.", uk: "Це приблизно {amt} на годину за {hours}-годинного тижня.", ro: "Adică aproximativ {amt} pe oră pentru o săptămână de {hours} ore.", de: "Das sind etwa {amt} pro Stunde bei einer {hours}-Stunden-Woche.", es: "Son unos {amt} por hora en una semana de {hours} horas.", it: "Sono circa {amt} l'ora per una settimana di {hours} ore." },
  "calc.ins.inflation": { en: "In {years} years this will cost {amt}, and today's amount will buy only {amt2} worth.", ru: "Через {years} лет это будет стоить {amt}, а сегодняшняя сумма купит лишь на {amt2}.", uk: "Через {years} років це коштуватиме {amt}, а сьогоднішня сума купить лише на {amt2}.", ro: "Peste {years} ani va costa {amt}, iar suma de azi va cumpăra doar {amt2}.", de: "In {years} Jahren kostet das {amt}, und der heutige Betrag kauft nur noch {amt2}.", es: "En {years} años costará {amt}, y la cantidad de hoy comprará solo {amt2}.", it: "Tra {years} anni costerà {amt}, e la somma di oggi comprerà solo {amt2}." },
  "calc.ins.discount": { en: "{pct}% off saves you {amt} — you pay {price}.", ru: "Скидка {pct}% экономит {amt} — вы платите {price}.", uk: "Знижка {pct}% заощаджує {amt} — ви платите {price}.", ro: "{pct}% reducere economisește {amt} — plătești {price}.", de: "{pct}% Rabatt sparen {amt} — du zahlst {price}.", es: "Un {pct}% de descuento te ahorra {amt} — pagas {price}.", it: "Il {pct}% di sconto ti fa risparmiare {amt} — paghi {price}." },
  "calc.ins.rent": { en: "At {pct}% of income, that leaves {amt} a month for everything else.", ru: "При {pct}% дохода остаётся {amt} в месяц на всё остальное.", uk: "За {pct}% доходу лишається {amt} на місяць на все інше.", ro: "La {pct}% din venit, rămân {amt} pe lună pentru restul.", de: "Bei {pct}% des Einkommens bleiben {amt} im Monat für alles andere.", es: "Al {pct}% de los ingresos, quedan {amt} al mes para todo lo demás.", it: "Al {pct}% del reddito, restano {amt} al mese per tutto il resto." },
  "calc.ins.saved": { en: "Consolidating could save about {amt} in interest versus your current plan.", ru: "Консолидация может сэкономить около {amt} процентов по сравнению с текущим планом.", uk: "Консолідація може заощадити близько {amt} відсотків порівняно з поточним планом.", ro: "Consolidarea ar putea economisi circa {amt} din dobândă față de planul actual.", de: "Die Konsolidierung könnte gegenüber deinem aktuellen Plan etwa {amt} an Zinsen sparen.", es: "Consolidar podría ahorrar unos {amt} en intereses frente a tu plan actual.", it: "Consolidare potrebbe far risparmiare circa {amt} di interessi rispetto al piano attuale." },
  "calc.ins.retire": { en: "You put in {amtC}; investment growth adds {amtG} on top.", ru: "Вы вносите {amtC}; рост инвестиций добавляет сверху {amtG}.", uk: "Ви вносите {amtC}; зростання інвестицій додає зверху {amtG}.", ro: "Contribui {amtC}; creșterea investiției adaugă {amtG}.", de: "Du zahlst {amtC} ein; das Anlagewachstum legt {amtG} obendrauf.", es: "Aportas {amtC}; el crecimiento de la inversión añade {amtG} más.", it: "Versi {amtC}; la crescita dell'investimento aggiunge {amtG}." },
  "calc.ins.roi": { en: "A {pct}% total return — about {ann}% per year.", ru: "Общая доходность {pct}% — около {ann}% в год.", uk: "Загальна дохідність {pct}% — близько {ann}% на рік.", ro: "Un randament total de {pct}% — circa {ann}% pe an.", de: "Eine Gesamtrendite von {pct}% — etwa {ann}% pro Jahr.", es: "Un retorno total del {pct}% — cerca del {ann}% anual.", it: "Un rendimento totale del {pct}% — circa il {ann}% l'anno." },
  "calc.ins.roiSimple": { en: "A {pct}% return — {amt} of net profit.", ru: "Доходность {pct}% — {amt} чистой прибыли.", uk: "Дохідність {pct}% — {amt} чистого прибутку.", ro: "Un randament de {pct}% — {amt} profit net.", de: "Eine Rendite von {pct}% — {amt} Nettogewinn.", es: "Un retorno del {pct}% — {amt} de beneficio neto.", it: "Un rendimento del {pct}% — {amt} di utile netto." },
  "calc.ins.compound": { en: "Interest makes up {pct}% of your final balance — the rest is what you put in.", ru: "Проценты составляют {pct}% итоговой суммы — остальное вы внесли сами.", uk: "Відсотки становлять {pct}% підсумкової суми — решту ви внесли самі.", ro: "Dobânda reprezintă {pct}% din suma finală — restul e ce ai depus tu.", de: "Zinsen machen {pct}% deines Endbetrags aus — der Rest sind deine Einzahlungen.", es: "Los intereses son el {pct}% del saldo final — el resto es lo que aportaste.", it: "Gli interessi sono il {pct}% del saldo finale — il resto è ciò che hai versato." },
  "calc.ins.emergency": { en: "You're {pct}% of the way to a fully funded safety net.", ru: "Вы прошли {pct}% пути к полной финансовой подушке.", uk: "Ви пройшли {pct}% шляху до повної фінансової подушки.", ro: "Ești la {pct}% dintr-un fond de siguranță complet.", de: "Du bist zu {pct}% bei einem voll gedeckten Notgroschen.", es: "Vas por el {pct}% de un colchón totalmente financiado.", it: "Sei al {pct}% di un fondo di emergenza completo." },
  "calc.ins.savings": { en: "At {amt} a month, you reach your goal in {dur}.", ru: "При {amt} в месяц вы достигнете цели за {dur}.", uk: "За {amt} на місяць ви досягнете цілі за {dur}.", ro: "Cu {amt} pe lună, atingi obiectivul în {dur}.", de: "Mit {amt} im Monat erreichst du dein Ziel in {dur}.", es: "Con {amt} al mes, alcanzas tu meta en {dur}.", it: "Con {amt} al mese, raggiungi l'obiettivo in {dur}." },
  "calc.ins.debt": { en: "You'll pay {amt} in interest before the balance hits zero.", ru: "Вы заплатите {amt} процентов, прежде чем баланс обнулится.", uk: "Ви заплатите {amt} відсотків, перш ніж баланс обнулиться.", ro: "Vei plăti {amt} dobândă până când soldul ajunge la zero.", de: "Du zahlst {amt} an Zinsen, bis der Saldo bei null ist.", es: "Pagarás {amt} en intereses antes de que el saldo llegue a cero.", it: "Pagherai {amt} di interessi prima che il saldo arrivi a zero." },
  "calc.ins.fire": { en: "At this pace, financial independence is about {dur} away.", ru: "При таком темпе до финансовой независимости примерно {dur}.", uk: "За такого темпу до фінансової незалежності приблизно {dur}.", ro: "În acest ritm, independența financiară e la circa {dur} distanță.", de: "In diesem Tempo ist die finanzielle Freiheit etwa {dur} entfernt.", es: "A este ritmo, la independencia financiera está a unos {dur}.", it: "A questo ritmo, l'indipendenza finanziaria è a circa {dur}." },
  "calc.ins.subs": { en: "That's {amt} a year — invested instead, about {amt2} in five years.", ru: "Это {amt} в год — вложив эти деньги, вы получили бы около {amt2} за пять лет.", uk: "Це {amt} на рік — вклавши ці гроші, ви отримали б близько {amt2} за п'ять років.", ro: "Adică {amt} pe an — investiți, ar deveni circa {amt2} în cinci ani.", de: "Das sind {amt} im Jahr — investiert wären es in fünf Jahren etwa {amt2}.", es: "Son {amt} al año — invertidos serían unos {amt2} en cinco años.", it: "Sono {amt} l'anno — investiti, circa {amt2} in cinque anni." },
  "calc.ins.couple": { en: "You cover {pct}% of shared costs, leaving you {amt} a month.", ru: "Вы покрываете {pct}% общих расходов, у вас остаётся {amt} в месяц.", uk: "Ви покриваєте {pct}% спільних витрат, у вас лишається {amt} на місяць.", ro: "Acoperi {pct}% din cheltuielile comune, îți rămân {amt} pe lună.", de: "Du trägst {pct}% der gemeinsamen Kosten, dir bleiben {amt} im Monat.", es: "Cubres el {pct}% de los gastos comunes, te quedan {amt} al mes.", it: "Copri il {pct}% delle spese comuni, ti restano {amt} al mese." },


  // ── SEO (localized <title> / meta description for the landing) ──
  "seo.title": {
    en: "Lumi — Voice Expense Tracker & AI Budget",
    ru: "Lumi — голосовой трекер расходов и ИИ-бюджет",
    uk: "Lumi — голосовий трекер витрат і ШІ-бюджет",
    ro: "Lumi — tracker de cheltuieli cu voce și buget AI",
    de: "Lumi — Ausgaben-Tracker per Sprache & KI-Budget",
    es: "Lumi — Registro de gastos por voz e IA",
    it: "Lumi — Tracker di spese vocale e budget IA",
  },
  "seo.description": {
    en: "Log expenses by voice, Back Tap, or Apple Pay in seconds. AI forecasts your month-end balance. No bank login, privacy-first. Free to start.",
    ru: "Записывайте расходы голосом, через Back Tap или Apple Pay за секунды. ИИ прогнозирует баланс на конец месяца. Без доступа к банку, приватно. Бесплатно.",
    uk: "Записуйте витрати голосом, через Back Tap або Apple Pay за секунди. ШІ прогнозує баланс на кінець місяця. Без доступу до банку, приватно. Безкоштовно.",
    ro: "Înregistrează cheltuielile cu vocea, Back Tap sau Apple Pay în secunde. IA prognozează soldul lunii. Fără acces bancar, confidențial. Gratuit.",
    de: "Erfasse Ausgaben per Sprache, Back Tap oder Apple Pay in Sekunden. KI prognostiziert deinen Monatsendsaldo. Kein Bank-Login, datenschutzfreundlich. Kostenlos.",
    es: "Registra gastos por voz, Back Tap o Apple Pay en segundos. La IA prevé tu saldo de fin de mes. Sin acceso bancario, privado. Gratis.",
    it: "Registra le spese con la voce, Back Tap o Apple Pay in secondi. L'IA prevede il saldo di fine mese. Nessun accesso bancario, privacy. Gratis.",
  },
};

// ── Landing-page microcopy, merged from per-locale JSON files ────────────────
// Kept in content/landing/{locale}.json so translators (and agents) can edit
// them without touching this file. English is the source; empty locale files
// fall back to English via translate().
const LANDING_MESSAGES: Record<Locale, Record<string, string>> = {
  en: landingEn, ru: landingRu, uk: landingUk, ro: landingRo, de: landingDe,
  es: landingEs, it: landingIt,
};
for (const [loc, dict] of Object.entries(LANDING_MESSAGES)) {
  for (const [key, value] of Object.entries(dict)) {
    (MESSAGES[key] ??= {})[loc as Locale] = value;
  }
}

// ── Category names (verbatim from the mobile app's locale files) ─────────────

export const EXPENSE_CATEGORY_NAMES: Record<string, Partial<Record<Locale, string>>> = {
  "food": { en: "Food & Dining", ru: "Еда и рестораны", uk: "Їжа та ресторани", ro: "Mâncare și restaurant", de: "Essen & Restaurant", es: "Comida y restaurantes", it: "Cibo e ristoranti" },
  "transport": { en: "Transportation", ru: "Транспорт", uk: "Транспорт", ro: "Transport", de: "Transport", es: "Transporte", it: "Trasporti" },
  "shopping": { en: "Shopping", ru: "Покупки", uk: "Покупки", ro: "Cumpărături", de: "Einkaufen", es: "Compras", it: "Shopping" },
  "entertainment": { en: "Entertainment", ru: "Развлечения", uk: "Розваги", ro: "Divertisment", de: "Unterhaltung", es: "Entretenimiento", it: "Intrattenimento" },
  "healthcare": { en: "Healthcare", ru: "Здравоохранение", uk: "Охорона здоров'я", ro: "Sănătate", de: "Gesundheit", es: "Salud", it: "Salute" },
  "utilities": { en: "Utilities", ru: "Коммунальные услуги", uk: "Комунальні послуги", ro: "Utilități", de: "Nebenkosten", es: "Servicios", it: "Utenze" },
  "education": { en: "Education", ru: "Образование", uk: "Освіта", ro: "Educație", de: "Bildung", es: "Educación", it: "Istruzione" },
  "travel": { en: "Travel", ru: "Путешествия", uk: "Подорожі", ro: "Călătorie", de: "Reisen", es: "Viajes", it: "Viaggi" },
  "groceries": { en: "Groceries", ru: "Продукты", uk: "Продукти", ro: "Alimente", de: "Lebensmittel", es: "Supermercado", it: "Spesa" },
  "fuel": { en: "Fuel", ru: "Топливо", uk: "Паливо", ro: "Combustibil", de: "Kraftstoff", es: "Combustible", it: "Carburante" },
  "subscriptions": { en: "Subscriptions", ru: "Подписки", uk: "Підписки", ro: "Abonamente", de: "Abonnements", es: "Suscripciones", it: "Abbonamenti" },
  "beauty": { en: "Beauty & Care", ru: "Красота и уход", uk: "Краса та догляд", ro: "Frumusețe și îngrijire", de: "Beauty & Pflege", es: "Belleza y cuidado", it: "Bellezza e cura" },
  "pets": { en: "Pets", ru: "Домашние животные", uk: "Домашні тварини", ro: "Animale de companie", de: "Haustiere", es: "Mascotas", it: "Animali" },
  "gifts": { en: "Gifts", ru: "Подарки", uk: "Подарунки", ro: "Cadouri", de: "Geschenke", es: "Regalos", it: "Regali" },
  "home": { en: "Home & Garden", ru: "Дом и сад", uk: "Дім та сад", ro: "Casă și grădină", de: "Haus & Garten", es: "Hogar y jardín", it: "Casa e giardino" },
  "clothing": { en: "Clothing", ru: "Одежда", uk: "Одяг", ro: "Îmbrăcăminte", de: "Kleidung", es: "Ropa", it: "Abbigliamento" },
  "sports": { en: "Sports & Fitness", ru: "Спорт и фитнес", uk: "Спорт та фітнес", ro: "Sport și fitness", de: "Sport & Fitness", es: "Deporte y fitness", it: "Sport e fitness" },
  "coffee": { en: "Coffee & Cafes", ru: "Кофе и кафе", uk: "Кава та кафе", ro: "Cafea și cafenele", de: "Kaffee & Cafés", es: "Café y cafeterías", it: "Caffè e bar" },
  "alcohol": { en: "Bars & Drinks", ru: "Бары и напитки", uk: "Бари та напої", ro: "Baruri și băuturi", de: "Bars & Getränke", es: "Bares y bebidas", it: "Bar e bevande" },
  "insurance": { en: "Insurance", ru: "Страхование", uk: "Страхування", ro: "Asigurări", de: "Versicherung", es: "Seguro", it: "Assicurazioni" },
  "rent": { en: "Rent", ru: "Аренда", uk: "Оренда", ro: "Chirie", de: "Miete", es: "Renta", it: "Affitto" },
  "taxes": { en: "Taxes & Fees", ru: "Налоги и сборы", uk: "Податки та збори", ro: "Taxe și impozite", de: "Steuern & Gebühren", es: "Impuestos y tasas", it: "Tasse e imposte" },
  "charity": { en: "Charity & Donations", ru: "Благотворительность", uk: "Благодійність", ro: "Caritate și donații", de: "Spenden & Wohltätigkeit", es: "Caridad y donaciones", it: "Beneficenza e donazioni" },
  "kids": { en: "Kids & Family", ru: "Дети и семья", uk: "Діти та сім'я", ro: "Copii și familie", de: "Kinder & Familie", es: "Niños y familia", it: "Bambini e famiglia" },
  "electronics": { en: "Electronics", ru: "Электроника", uk: "Електроніка", ro: "Electronice", de: "Elektronik", es: "Electrónica", it: "Elettronica" },
  "pharmacy": { en: "Pharmacy", ru: "Аптека", uk: "Аптека", ro: "Farmacie", de: "Apotheke", es: "Farmacia", it: "Farmacia" },
  "parking": { en: "Parking", ru: "Парковка", uk: "Парковка", ro: "Parcare", de: "Parken", es: "Estacionamiento", it: "Parcheggio" },
  "car_maintenance": { en: "Car Maintenance", ru: "Обслуживание авто", uk: "Обслуговування авто", ro: "Întreținere auto", de: "Auto-Wartung", es: "Mantenimiento del auto", it: "Manutenzione auto" },
  "internet": { en: "Internet & Phone", ru: "Интернет и телефон", uk: "Інтернет та телефон", ro: "Internet și telefon", de: "Internet & Telefon", es: "Internet y teléfono", it: "Internet e telefono" },
  "other": { en: "Other", ru: "Другое", uk: "Інше", ro: "Altele", de: "Sonstiges", es: "Otros", it: "Altro" },
  "loan_payment": { en: "Loan Payment", ru: "Платёж по кредиту", uk: "Платіж за кредитом", ro: "Rată credit", de: "Kreditrate", es: "Pago de préstamo", it: "Rata del prestito" },
  "savings_deposit": { en: "Savings", ru: "Накопления", uk: "Накопичення", ro: "Economii", de: "Ersparnisse", es: "Ahorros", it: "Risparmi" },
};

export const INCOME_CATEGORY_NAMES: Record<string, Partial<Record<Locale, string>>> = {
  "salary": { en: "Salary", ru: "Зарплата", uk: "Зарплата", ro: "Salariu", de: "Gehalt", es: "Salario", it: "Stipendio" },
  "freelance": { en: "Freelance", ru: "Фриланс", uk: "Фріланс", ro: "Freelance", de: "Freelance", es: "Freelance", it: "Freelance" },
  "investment": { en: "Investment", ru: "Инвестиции", uk: "Інвестиції", ro: "Investiție", de: "Investition", es: "Inversión", it: "Investimento" },
  "business": { en: "Business", ru: "Бизнес", uk: "Бізнес", ro: "Afaceri", de: "Geschäft", es: "Negocio", it: "Attività commerciale" },
  "rental": { en: "Rental Income", ru: "Арендный доход", uk: "Дохід від оренди", ro: "Venit din chirie", de: "Mieteinnahmen", es: "Ingreso por renta", it: "Reddito da affitto" },
  "dividend": { en: "Dividend", ru: "Дивиденды", uk: "Дивіденди", ro: "Dividende", de: "Dividende", es: "Dividendo", it: "Dividendo" },
  "bonus": { en: "Bonus", ru: "Бонус", uk: "Бонус", ro: "Bonus", de: "Bonus", es: "Bono", it: "Bonus" },
  "gift": { en: "Gift", ru: "Подарок", uk: "Подарунок", ro: "Cadou", de: "Geschenk", es: "Regalo", it: "Regalo" },
  "refund": { en: "Refund", ru: "Возврат", uk: "Повернення", ro: "Rambursare", de: "Erstattung", es: "Reembolso", it: "Rimborso" },
  "pension": { en: "Pension", ru: "Пенсия", uk: "Пенсія", ro: "Pensie", de: "Rente", es: "Pensión", it: "Pensione" },
  "grant": { en: "Grant & Scholarship", ru: "Грант и стипендия", uk: "Грант та стипендія", ro: "Grant și bursă", de: "Stipendium & Förderung", es: "Beca y subsidio", it: "Borsa di studio" },
  "royalty": { en: "Royalties", ru: "Роялти", uk: "Роялті", ro: "Drepturi de autor", de: "Lizenzgebühren", es: "Regalías", it: "Royalties" },
  "crypto": { en: "Crypto", ru: "Крипто", uk: "Крипто", ro: "Crypto", de: "Krypto", es: "Cripto", it: "Crypto" },
  "side_hustle": { en: "Side Hustle", ru: "Подработка", uk: "Підробіток", ro: "Sursă secundară", de: "Nebenjob", es: "Ingreso extra", it: "Lavoro extra" },
  "other": { en: "Other", ru: "Другое", uk: "Інше", ro: "Altele", de: "Sonstiges", es: "Otros", it: "Altro" },
  "savings_withdrawal": { en: "Savings Withdrawal", ru: "Снятие с накоплений", uk: "Зняття з накопичень", ro: "Retragere din economii", de: "Sparentnahme", es: "Retiro de ahorros", it: "Prelievo risparmi" },
};

// ── Runtime helpers ──────────────────────────────────────────────────────────

export function translate(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const entry = MESSAGES[key];
  let text = entry?.[locale] ?? entry?.en ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return text;
}

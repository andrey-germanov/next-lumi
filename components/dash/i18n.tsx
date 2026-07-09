"use client";

import { createContext, useContext, useCallback, useEffect, useMemo, useState } from "react";
import {
  translate,
  INTL_LOCALE,
  EXPENSE_CATEGORY_NAMES,
  INCOME_CATEGORY_NAMES,
  DEFAULT_LOCALE,
  LOCALES,
  type Locale,
} from "@/lib/i18n";

const STORAGE_KEY = "lumi-locale";

function detectInitial(): Locale {
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LOCALES.some((l) => l.code === saved)) return saved as Locale;
  }
  if (typeof navigator !== "undefined") {
    const nav = navigator.language.slice(0, 2).toLowerCase();
    if (LOCALES.some((l) => l.code === nav)) return nav as Locale;
  }
  return DEFAULT_LOCALE;
}

interface LangValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  /** Localized name for a category by id, falling back to the stored (custom) name. */
  tCategoryName: (id: string, fallback: string, kind?: "expense" | "income") => string;
  formatDate: (iso: string, opts?: Intl.DateTimeFormatOptions) => string;
  formatMonth: (date?: Date) => string;
}

const LangContext = createContext<LangValue | null>(null);

export function LanguageProvider({ initialLocale, children }: { initialLocale?: Locale; children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? DEFAULT_LOCALE);

  // When the locale comes from the URL (SEO routes) it's authoritative — don't
  // override from storage/navigator. Otherwise auto-detect on mount.
  useEffect(() => {
    if (initialLocale) return;
    setLocaleState(detectInitial());
  }, [initialLocale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<LangValue>(() => {
    const intl = INTL_LOCALE[locale];
    return {
      locale,
      setLocale,
      t: (key, vars) => translate(locale, key, vars),
      tCategoryName: (id, fallback, kind = "expense") => {
        const table = kind === "income" ? INCOME_CATEGORY_NAMES : EXPENSE_CATEGORY_NAMES;
        return table[id]?.[locale] ?? table[id]?.en ?? fallback;
      },
      formatDate: (iso, opts = { month: "short", day: "numeric" }) => {
        try {
          return new Date(iso).toLocaleDateString(intl, opts);
        } catch {
          return new Date(iso).toLocaleDateString("en-US", opts);
        }
      },
      formatMonth: (date = new Date()) => {
        try {
          return date.toLocaleDateString(intl, { month: "long", year: "numeric" });
        } catch {
          return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        }
      },
    };
  }, [locale, setLocale]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within <LanguageProvider>");
  return ctx;
}

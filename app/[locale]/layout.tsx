import { notFound } from "next/navigation";
import { LanguageProvider } from "@/components/dash/i18n";
import HtmlLang from "@/components/HtmlLang";
import { PREFIXED_LOCALES, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return PREFIXED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!PREFIXED_LOCALES.includes(locale as Locale)) notFound();

  return (
    <LanguageProvider initialLocale={locale as Locale}>
      <HtmlLang locale={locale} />
      {children}
    </LanguageProvider>
  );
}

import { notFound } from "next/navigation";
import RootDocument, { rootMetadata } from "@/components/RootDocument";
import { PREFIXED_LOCALES, type Locale } from "@/lib/i18n";

export const metadata = rootMetadata;

export function generateStaticParams() {
  return PREFIXED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!PREFIXED_LOCALES.includes(locale as Locale)) notFound();

  return (
    <RootDocument lang={locale} locale={locale as Locale}>
      {children}
    </RootDocument>
  );
}

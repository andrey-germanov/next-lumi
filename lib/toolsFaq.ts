import fs from "fs";
import path from "path";

export interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_DIR = path.join(process.cwd(), "content/tools-faq");

function readLocaleFaq(locale: string): Record<string, FaqItem[]> {
  try {
    const raw = fs.readFileSync(path.join(FAQ_DIR, `${locale}.json`), "utf-8");
    return JSON.parse(raw) as Record<string, FaqItem[]>;
  } catch {
    return {};
  }
}

/** FAQ for a calculator, in the given locale, falling back to English per item. */
export function getToolFaq(slug: string, locale: string): FaqItem[] {
  const en = readLocaleFaq("en")[slug] ?? [];
  if (locale === "en") return en;
  const localized = readLocaleFaq(locale)[slug];
  if (!localized) return en;
  return en.map((item, i) => localized[i] ?? item);
}

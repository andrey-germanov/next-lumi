import type { Metadata } from "next";
import FaqBody from "@/components/FaqBody";
import { SITE_URL } from "@/lib/constants";
import { pageLanguagesMap } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Privacy, logging, forecasting, and pricing — answered.",
  alternates: {
    canonical: `${SITE_URL}/faq`,
    languages: pageLanguagesMap(SITE_URL, "faq"),
  },
};

export default function FAQPage() {
  return <FaqBody locale="en" />;
}

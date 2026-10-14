import type { Metadata } from "next";
import AndroidBetaBody from "@/components/androidBeta/AndroidBetaBody";
import { SITE_URL } from "@/lib/constants";
import { pageLanguagesMap } from "@/lib/i18n";
import { getAndroidBetaCopy } from "@/lib/androidBetaI18n";

const copy = getAndroidBetaCopy("en");

export const metadata: Metadata = {
  title: { absolute: copy.metaTitle },
  description: copy.metaDescription,
  alternates: {
    canonical: `${SITE_URL}/android`,
    languages: pageLanguagesMap(SITE_URL, "android"),
  },
  openGraph: { title: copy.metaTitle, description: copy.metaDescription, url: `${SITE_URL}/android`, type: "website", siteName: "Lumi" },
  twitter: { card: "summary_large_image", title: copy.metaTitle, description: copy.metaDescription },
};

export default function AndroidBetaPage() {
  return <AndroidBetaBody locale="en" />;
}

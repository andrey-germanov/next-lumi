import type { Metadata } from "next";
import ToolsHub from "@/components/tools/ToolsHub";
import { SITE_URL } from "@/lib/constants";
import { translate, pageLanguagesMap } from "@/lib/i18n";

export const metadata: Metadata = {
  title: translate("en", "tools.hubTitle"),
  description: translate("en", "tools.hubSubtitle"),
  alternates: {
    canonical: `${SITE_URL}/tools`,
    languages: pageLanguagesMap(SITE_URL, "tools"),
  },
};

export default function ToolsHubPage() {
  return <ToolsHub locale="en" />;
}

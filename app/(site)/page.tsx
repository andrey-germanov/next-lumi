import type { Metadata } from "next";
import LandingContent from "@/components/LandingContent";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";
import { landingLanguagesMap } from "@/lib/i18n";

export const metadata: Metadata = {
  alternates: {
    canonical: `${SITE_URL}/`,
    languages: landingLanguagesMap(SITE_URL),
  },
};

export default function Home() {
  return <LandingContent posts={getAllPosts()} />;
}

import type { Metadata } from "next";
import BlogListBody from "@/components/BlogListBody";
import { SITE_URL } from "@/lib/constants";
import { pageLanguagesMap } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips on personal finance, budgeting, expense tracking, and making the most of your money. From the team behind Lumi.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
    languages: pageLanguagesMap(SITE_URL, "blog"),
  },
};

export default function BlogPage() {
  return <BlogListBody locale="en" />;
}

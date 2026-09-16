import type { Metadata } from "next";
import BlogListBody from "@/components/BlogListBody";
import { SITE_URL } from "@/lib/constants";
import { pageLanguagesMap } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Budgeting & Expense Tracking Blog",
  description:
    "Practical guides on budgeting, tracking expenses, Apple Pay spending, and saving by age. Written by the team behind Lumi, the iPhone expense tracker.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
    languages: pageLanguagesMap(SITE_URL, "blog"),
  },
};

export default function BlogPage() {
  return <BlogListBody locale="en" />;
}

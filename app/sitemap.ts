import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/blog";
import { SITE_URL } from "@/lib/constants";
import { PREFIXED_LOCALES, landingLanguagesMap, pageLanguagesMap } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = getAllSlugs();
  const blogEntries = blogSlugs.flatMap((slug) => {
    const langs = pageLanguagesMap(SITE_URL, `blog/${slug}`);
    return [
      { url: `${SITE_URL}/blog/${slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7, alternates: { languages: langs } },
      ...PREFIXED_LOCALES.map((locale) => ({
        url: `${SITE_URL}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: { languages: langs },
      })),
    ];
  });

  const blogLanguages = pageLanguagesMap(SITE_URL, "blog");
  const blogLocaleEntries = PREFIXED_LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}/blog`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
    alternates: { languages: blogLanguages },
  }));

  const languages = landingLanguagesMap(SITE_URL);

  // Localized landing variants (/ru, /de, …) with hreflang alternates.
  const localeEntries = PREFIXED_LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
    alternates: { languages },
  }));

  // Localized FAQ variants.
  const faqLanguages = pageLanguagesMap(SITE_URL, "faq");
  const faqLocaleEntries = PREFIXED_LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}/faq`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    alternates: { languages: faqLanguages },
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages },
    },
    ...localeEntries,
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages: faqLanguages },
    },
    ...faqLocaleEntries,
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: blogLanguages },
    },
    ...blogLocaleEntries,
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...blogEntries,
  ];
}

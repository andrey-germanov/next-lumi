import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppStoreButton from "@/components/AppStoreButton";
import { APP_STORE_URL, BRAND_ENTITY_NAME, FOUNDER, SITE_URL, SOCIAL_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Lumi and Its Founder",
  description:
    "Who builds Lumi: Budget & Expense Tracker, why it never asks for a bank login, and how the blog is written and kept up to date.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: `${SITE_URL}/about`,
  mainEntity: {
    "@type": "Organization",
    name: "Lumi",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo/logo-512.png`,
    sameAs: [APP_STORE_URL, SOCIAL_LINKS.threads],
    founder: {
      "@type": "Person",
      name: FOUNDER.name,
      jobTitle: FOUNDER.jobTitle,
      url: FOUNDER.url,
      sameAs: FOUNDER.sameAs,
    },
    owns: { "@type": "SoftwareApplication", name: BRAND_ENTITY_NAME, operatingSystem: "iOS", applicationCategory: "FinanceApplication", url: APP_STORE_URL },
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <h1 className="text-3xl font-bold">About Lumi</h1>

          <div className="prose mt-8">
            <p>
              {BRAND_ENTITY_NAME} is an iPhone app for logging spending in seconds — by voice, with a Back Tap,
              or automatically from Apple Pay. It never asks for a bank login, and your transactions are stored
              on your device, not on our servers.
            </p>

            <h2>Who builds it</h2>
            <p>
              Lumi is an independent app built by {FOUNDER.name}, a software developer who tried the big
              budgeting apps, kept abandoning them, and didn&apos;t want to hand a third party read access to his
              bank account. Lumi is the tool he built for himself first: fast input, multi-currency from day one,
              and no bank connection. The full story is in{" "}
              <Link href="/blog/i-built-an-app-to-solve-my-spending-problem">
                I built an app to solve my own spending problem
              </Link>
              .
            </p>
            <p>
              You can follow development on <a href={SOCIAL_LINKS.threads}>Threads</a>.
            </p>

            <h2>What we believe</h2>
            <ul>
              <li>Tracking fails because of friction, not because people are bad with money.</li>
              <li>A budgeting app doesn&apos;t need your bank password to be useful.</li>
              <li>Your financial history belongs on your phone, not in someone else&apos;s cloud.</li>
            </ul>

            <h2>How the blog is written</h2>
            <p>
              Articles on the Lumi blog are written by the Lumi team; posts signed by {FOUNDER.name} are his
              first-hand experience. When an article is revised with
              new data, its &ldquo;Updated&rdquo; date changes. Articles that compare apps say so when Lumi is one of
              them — we make Lumi, so read those with that in mind.
            </p>

            <h2>Contact</h2>
            <p>
              Questions, corrections, or press: <a href="mailto:ange.germanov@gmail.com">ange.germanov@gmail.com</a>.
            </p>
          </div>

          <div className="mt-12">
            <AppStoreButton location="about" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

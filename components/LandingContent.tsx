import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SetupOnce from "@/components/SetupOnce";
import FeatureGrid from "@/components/FeatureGrid";
import Pricing from "@/components/Pricing";
import LandingFAQ from "@/components/LandingFAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { ScrollDepthTracker, TrackView } from "@/components/FunnelTracker";
import type { BlogPost } from "@/lib/blog";

// Mirrors the App Store screenshots: Apple Pay hook → one-time setup → the rest of the app → offer.
// `posts` is still passed by the pages; the blog is reachable from the header and footer.
export default function LandingContent(_props: { posts: BlogPost[] }) {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SetupOnce />
        <FeatureGrid />
        <TrackView name="pricing">
          <Pricing />
        </TrackView>
        <LandingFAQ />
        <CTA />
      </main>
      <Footer />
      <StickyMobileCTA />
      <ScrollDepthTracker />
    </>
  );
}

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import VoiceInput from "@/components/VoiceInput";
import Comparison from "@/components/Comparison";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import LandingFAQ from "@/components/LandingFAQ";
import CTA from "@/components/CTA";
import BlogPreview from "@/components/BlogPreview";
import Footer from "@/components/Footer";
import DashboardPreview from "@/components/DashboardPreview";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import { ScrollDepthTracker, TrackView } from "@/components/FunnelTracker";
import type { BlogPost } from "@/lib/blog";

export default function LandingContent({ posts }: { posts: BlogPost[] }) {
  return (
    <>
      <Header />
      <main>
        {/* Hook → agitate the pain → show the mechanism → prove it → offer */}
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <Features />
        <VoiceInput />
        <DashboardPreview />
        <Comparison />
        <Testimonials />
        <TrackView name="pricing">
          <Pricing />
        </TrackView>
        <LandingFAQ />
        <CTA />
        <BlogPreview posts={posts} />
      </main>
      <Footer />
      <StickyMobileCTA />
      <ScrollDepthTracker />
    </>
  );
}

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProblemSolution from "@/components/ProblemSolution";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import VoiceInput from "@/components/VoiceInput";
import Comparison from "@/components/Comparison";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import BlogPreview from "@/components/BlogPreview";
import Footer from "@/components/Footer";
import DashboardPreview from "@/components/DashboardPreview";
import type { BlogPost } from "@/lib/blog";

export default function LandingContent({ posts }: { posts: BlogPost[] }) {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <DashboardPreview />
        <VoiceInput />
        <ProblemSolution />
        <HowItWorks />
        <Features />
        <Comparison />
        <Testimonials />
        <Pricing />
        <CTA />
        <BlogPreview posts={posts} />
      </main>
      <Footer />
    </>
  );
}

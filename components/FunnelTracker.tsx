"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/posthog";

/**
 * Fires scroll-depth milestones (25/50/75/100%) once each, so the funnel drop
 * point is visible in PostHog. Renders nothing.
 */
export function ScrollDepthTracker() {
  const fired = useRef<Set<number>>(new Set());

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = Math.round((window.scrollY / scrollable) * 100);
      for (const m of [25, 50, 75, 100]) {
        if (pct >= m && !fired.current.has(m)) {
          fired.current.add(m);
          trackEvent("scroll_depth", { depth: m });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}

/**
 * Fires `section_view` the first time a wrapped section scrolls into view.
 * Lets us see how many visitors actually reach pricing, comparison, etc.
 */
export function TrackView({ name, children }: { name: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !seen.current) {
            seen.current = true;
            trackEvent("section_view", { section: name });
            obs.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [name]);

  return <div ref={ref}>{children}</div>;
}

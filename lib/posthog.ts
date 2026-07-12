"use client";

import posthog from "posthog-js";

export function initPostHog() {
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_POSTHOG_KEY
  ) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
    });
  }
}

export function trackAppStoreClick(location: string) {
  posthog.capture("app_store_click", { location });
}

/** Generic funnel event (section views, scroll depth, etc.). */
export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  posthog.capture(name, props);
}

export default posthog;

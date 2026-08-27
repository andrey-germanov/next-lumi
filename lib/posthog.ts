"use client";

import posthog from "posthog-js";

/**
 * Reads the current-touch traffic source (UTM params + referrer) from the page.
 * PostHog also captures $referrer / $geoip_* automatically, but we attach a
 * normalized `traffic_source` so breakdowns stay clean and reliable.
 */
function getTrafficSource(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const out: Record<string, string> = {};
  const params = new URLSearchParams(window.location.search);

  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ] as const;
  for (const k of utmKeys) {
    const v = params.get(k);
    if (v) out[k] = v;
  }

  const ref = typeof document !== "undefined" ? document.referrer : "";
  let referringDomain = "";
  if (ref) {
    try {
      referringDomain = new URL(ref).hostname;
    } catch {
      /* ignore malformed referrer */
    }
    out.referrer = ref;
    if (referringDomain) out.referring_domain = referringDomain;
  }

  // Single normalized value for easy breakdowns in PostHog.
  const isSelf = referringDomain.includes("lumi.herman-apps.com");
  out.traffic_source =
    out.utm_source || (referringDomain && !isSelf ? referringDomain : "") || "direct";

  return out;
}

export function initPostHog() {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
    });

    // First-touch attribution: stick the landing source to every event in this
    // browser, so a CTA click still carries its source even after the visitor
    // navigates to another page (where the UTM query string is already gone).
    const src = getTrafficSource();
    const firstTouch: Record<string, string> = {
      initial_traffic_source: src.traffic_source || "direct",
    };
    if (src.utm_source) firstTouch.initial_utm_source = src.utm_source;
    if (src.utm_medium) firstTouch.initial_utm_medium = src.utm_medium;
    if (src.utm_campaign) firstTouch.initial_utm_campaign = src.utm_campaign;
    if (src.referring_domain)
      firstTouch.initial_referring_domain = src.referring_domain;
    posthog.register_once(firstTouch);

    // Tag every web event so it is separable from the iOS app,
    // which reports into the same PostHog project.
    posthog.register({ platform: "web" });
  }
}

export function trackAppStoreClick(location: string) {
  // location = which CTA was clicked (hero, pricing, sticky_mobile, ...).
  // Country is added automatically by PostHog GeoIP ($geoip_country_name).
  posthog.capture("app_store_click", {
    location,
    ...getTrafficSource(),
  });
}

/** Generic funnel event (section views, scroll depth, etc.). */
export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  posthog.capture(name, props);
}

/** Tie subsequent events to a signed-in user (email login / signup). */
export function identifyUser(id: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  posthog.identify(id, props);
}

export default posthog;

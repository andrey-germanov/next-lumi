"use client";

/**
 * Cookie consent for the site's analytics (Google Analytics, PostHog).
 * Nothing analytics-related loads until the visitor accepts; the choice lives in localStorage.
 */
export type Consent = "granted" | "denied";

const STORAGE_KEY = "lumi-consent";
const CHANGE_EVENT = "lumi-consent-change";
const OPEN_EVENT = "lumi-consent-open";

export function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: Consent) {
  const before = readConsent();
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* private mode: the choice lasts for this page only */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: value }));
  // Taking consent back: drop the cookies GA and PostHog set, then reload without them.
  if (value === "denied" && before === "granted") {
    forgetAnalytics();
    window.location.reload();
  }
}

export function onConsentChange(handler: (value: Consent) => void): () => void {
  const listener = (event: Event) => handler((event as CustomEvent<Consent>).detail);
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}

/** Shows the banner again (footer "Cookies" link). */
export function openConsent() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onConsentOpen(handler: () => void): () => void {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}

function forgetAnalytics() {
  const host = window.location.hostname;
  const domains = [host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!/^(_ga|_gid|ph_)/.test(name)) continue;
    document.cookie = `${name}=; Max-Age=0; path=/`;
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
  }
  try {
    for (const key of Object.keys(window.localStorage)) if (key.startsWith("ph_")) window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

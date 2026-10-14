"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/lib/posthog";
import { SOCIAL_LINKS } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";
import type { AndroidBetaCopy } from "@/lib/androidBetaI18n";

type Status = "idle" | "sending" | "done" | "already" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontSize: 16, // ≥16px keeps iOS Safari from zooming on focus
  padding: "14px 16px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "#FFFFFF",
  color: "#0A0A0A",
  outline: "none",
};

export default function AndroidBetaForm({ copy, locale }: { copy: AndroidBetaCopy; locale: Locale }) {
  const [email, setEmail] = useState("");
  const [device, setDevice] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    if (!EMAIL_RE.test(email.trim())) {
      setError(copy.errInvalid);
      return;
    }
    setError("");
    setStatus("sending");
    try {
      const params = new URLSearchParams(window.location.search);
      const res = await fetch("/api/android-beta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, device, website, locale, source: params.get("utm_source") ?? document.referrer }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; already?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("idle");
        setError(data.error === "invalid_email" ? copy.errInvalid : copy.errGeneric);
        return;
      }
      setStatus(data.already ? "already" : "done");
      trackEvent("android_beta_signup", { already: !!data.already, locale, has_device: !!device.trim() });
    } catch {
      setStatus("idle");
      setError(copy.errGeneric);
    }
  }

  const finished = status === "done" || status === "already";

  return (
    <div id="join" className="surface rounded-3xl" style={{ padding: "clamp(24px, 4vw, 32px)", scrollMarginTop: 96 }}>
      <AnimatePresence mode="wait" initial={false}>
        {finished ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-center"
            role="status"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/android-beta/confirmed.svg" alt="" width={220} height={160} style={{ margin: "0 auto 20px", height: 150, width: "auto" }} />
            <p style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.6px", color: "#0A0A0A", marginBottom: 10 }}>
              {copy.successTitle}
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: "#63636B", marginBottom: 24 }}>
              {status === "already" ? copy.successAlready : copy.successBody}
            </p>
            <a
              href={SOCIAL_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("android_beta_telegram_click", { locale })}
              className="btn-violet inline-flex items-center justify-center gap-2"
              style={{ padding: "13px 22px", fontSize: 14 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M21.9 4.3 18.7 19.4c-.2 1.1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13 1.4 11.5c-1-.3-1-1 .2-1.5L20.6 2.8c.9-.3 1.6.2 1.3 1.5z" />
              </svg>
              {copy.successTg}
            </a>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <label htmlFor="beta-email" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#0A0A0A", marginBottom: 8 }}>
              {copy.emailLabel}
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", display: "flex" }}>
                <GoogleG />
              </span>
              <input
                id="beta-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder={copy.emailPlaceholder}
                aria-invalid={!!error}
                aria-describedby="beta-email-hint beta-email-error"
                className="focus:border-primary focus:ring-4 focus:ring-primary/15 transition"
                style={{ ...inputStyle, paddingLeft: 44, borderColor: error ? "#D63B57" : undefined }}
              />
            </div>
            <p id="beta-email-error" aria-live="polite" style={{ fontSize: 13, color: "#D63B57", marginTop: error ? 8 : 0, minHeight: 0 }}>
              {error}
            </p>
            <p id="beta-email-hint" style={{ fontSize: 13, lineHeight: 1.5, color: "#63636B", marginTop: 8 }}>
              {copy.emailHint}
            </p>

            <label htmlFor="beta-device" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#0A0A0A", margin: "20px 0 8px" }}>
              {copy.deviceLabel}
            </label>
            <input
              id="beta-device"
              type="text"
              autoComplete="off"
              maxLength={80}
              value={device}
              onChange={(e) => setDevice(e.target.value)}
              placeholder={copy.devicePlaceholder}
              className="focus:border-primary focus:ring-4 focus:ring-primary/15 transition"
              style={inputStyle}
            />

            {/* Honeypot — hidden from people and screen readers, bots fill it in. */}
            <div aria-hidden="true" style={{ position: "absolute", left: -10000, width: 1, height: 1, overflow: "hidden" }}>
              <label>
                Website
                <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </label>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-violet w-full inline-flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ marginTop: 24, padding: "15px 24px", fontSize: 15 }}
            >
              {status === "sending" ? copy.submitting : copy.submit}
              {status !== "sending" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              )}
            </button>
            <p style={{ fontSize: 12, lineHeight: 1.5, color: "#8E8E93", marginTop: 14, textAlign: "center" }}>{copy.privacyNote}</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

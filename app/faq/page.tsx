"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FAQ, APP_STORE_URL } from "@/lib/constants";

function FAQItem({ item, index }: { item: typeof FAQ[number]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="surface rounded-2xl overflow-hidden"
    >
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: "#fff", letterSpacing: "-0.2px" }}>
          {item.question}
        </span>
        <div
          style={{
            flexShrink: 0,
            width: 26, height: 26,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.10)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.25s ease",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v8M2 6h8" stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <div
              style={{
                padding: "0 24px 20px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: 16,
                fontSize: 14,
                color: "#777",
                lineHeight: 1.7,
              }}
            >
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative min-h-screen pt-24 pb-24">
        {/* Single faint orb */}
        <div
          className="hero-orb pointer-events-none absolute"
          style={{ top: -400, left: "50%", transform: "translateX(-50%)", opacity: 0.6 }}
        />

        <div className="relative mx-auto max-w-2xl px-6">
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#444", marginBottom: 40 }}>
            <Link href="/" style={{ color: "#444" }} className="hover:text-white transition-colors">Lumi</Link>
            <span>/</span>
            <span style={{ color: "#fff" }}>FAQ</span>
          </div>

          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <p className="label" style={{ marginBottom: 16 }}>Frequently Asked Questions</p>
            <h1
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "-1.5px",
                lineHeight: 1.08,
                marginBottom: 16,
              }}
            >
              Everything about Lumi
            </h1>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.6 }}>
              Privacy, logging, forecasting, and pricing — answered.
            </p>
          </div>

          {/* Questions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {FAQ.map((item, i) => (
              <FAQItem key={i} item={item} index={i} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="surface rounded-2xl text-center" style={{ padding: "40px 32px", marginTop: 40 }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#fff", letterSpacing: "-0.4px", marginBottom: 8 }}>
              Still have questions?
            </p>
            <p style={{ fontSize: 14, color: "#555", marginBottom: 24 }}>
              Download Lumi free and try it yourself. No bank login, no commitment.
            </p>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-violet inline-flex items-center gap-2"
              style={{ padding: "13px 24px", fontSize: 14 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M11.2 5c-.7.9-1.9 1.6-3 1.5-.1-1.2.4-2.4 1.1-3.2.7-.9 2-1.5 3-1.5.1 1.3-.4 2.5-1.1 3.2zm1 1.7c-1.7-.1-3.1.9-3.9.9-.8 0-2-.9-3.3-.8-1.7 0-3.3 1-4.1 2.5-1.8 3-.5 7.4 1.3 9.8.8 1.2 1.8 2.5 3.1 2.5 1.2 0 1.7-.8 3.2-.8 1.5 0 1.9.8 3.2.7 1.3 0 2.2-1.2 3-2.4.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.5-1-2.5-3.7 0-2.3 1.9-3.4 2-3.5-.9-1.5-2.5-1.5-3.3-1.5z"/>
              </svg>
              Download on App Store — Free
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

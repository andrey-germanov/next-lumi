"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Manual entry is homework nobody wants to do",
    source: "r/personalfinance",
    response: "That's why Lumi scans receipts. Zero typing.",
  },
  {
    quote: "Why do all budget apps want my bank login?",
    source: "r/YNAB",
    response: "Lumi doesn't. Your data stays on your phone.",
  },
  {
    quote: "I travel constantly and no app handles multiple currencies well",
    source: "r/digitalnomad",
    response:
      "Lumi tracks any currency with auto-conversion at real rates.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ letterSpacing: "-1px" }}>
            Built by a solo developer.
            <br />
            <span className="text-text-muted font-bold">
              Loved by people who hate spreadsheets.
            </span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="surface rounded-2xl p-6"
            >
              <div className="mb-4">
                <p className="italic text-text-muted">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <p className="mt-2 text-xs text-text-muted/50">
                  — {item.source}
                </p>
              </div>
              <div className="border-t border-black/8 pt-4">
                <p className="text-sm font-medium text-primary">
                  {item.response}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center text-sm text-text-muted"
        >
          Analyzed 18 competitors. Lumi is the only app combining AI scanning +
          multi-currency + privacy.
        </motion.p>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { useLang } from "@/components/dash/i18n";

const testimonials = [
  { quoteKey: "lp2.testQuote1", source: "r/personalfinance", responseKey: "lp2.testResponse1" },
  { quoteKey: "lp2.testQuote2", source: "r/YNAB", responseKey: "lp2.testResponse2" },
  { quoteKey: "lp2.testQuote3", source: "r/digitalnomad", responseKey: "lp2.testResponse3" },
];

export default function Testimonials() {
  const { t } = useLang();
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
            {t("lp2.testTitle1")}
            <br />
            <span className="text-text-muted font-bold">
              {t("lp2.testTitle2")}
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
                  &ldquo;{t(item.quoteKey)}&rdquo;
                </p>
                <p className="mt-2 text-xs text-text-muted/50">
                  — {item.source}
                </p>
              </div>
              <div className="border-t border-black/8 pt-4">
                <p className="text-sm font-medium text-primary">
                  {t(item.responseKey)}
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
          {t("lp2.testFooter")}
        </motion.p>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import AppStoreButton from "./AppStoreButton";

const steps = [
  {
    step: "1",
    title: "Point your camera at a receipt",
    description: "Open Lumi, tap scan, and snap a photo of any receipt.",
  },
  {
    step: "2",
    title: "AI extracts everything instantly",
    description:
      "Amount, date, merchant, category, individual items — parsed in seconds, in any language.",
  },
  {
    step: "3",
    title: "See your full picture",
    description:
      "Budgets, goals, analytics — your spending story, organized automatically.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            3 taps. 2 seconds. Done.
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-lg font-bold text-white">
                {item.step}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-text-muted">{item.description}</p>

              {/* Step screenshot placeholder */}
              <div className="mx-auto mt-6 h-64 w-48 overflow-hidden rounded-2xl border border-white/5 bg-bg-secondary">
                <div className="flex h-full items-center justify-center text-xs text-text-muted/50">
                  Step {item.step} screenshot
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <AppStoreButton location="how_it_works" />
        </motion.div>
      </div>
    </section>
  );
}

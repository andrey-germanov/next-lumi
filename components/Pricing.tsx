"use client";

import { motion } from "framer-motion";
import { FREE_FEATURES, PREMIUM_FEATURES } from "@/lib/constants";
import AppStoreButton from "./AppStoreButton";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ letterSpacing: "-1px" }}>
            Start free. Upgrade when you&apos;re ready.
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="surface rounded-2xl p-8"
          >
            <h3 className="text-lg font-semibold">Free</h3>
            <p className="mt-1 text-text-muted">Everything to get started</p>
            <div className="mt-6 mb-8">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-text-muted"> / forever</span>
            </div>
            <ul className="space-y-3">
              {FREE_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-text-muted"
                >
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <AppStoreButton location="pricing_free" variant="secondary" className="w-full justify-center" />
            </div>
          </motion.div>

          {/* Premium Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="surface-dark relative rounded-2xl p-8"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent px-4 py-1 text-xs font-semibold text-white">
              Most Popular
            </div>
            <h3 className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>Premium</h3>
            <p className="mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>Unlock everything</p>
            <div className="mt-6 mb-8">
              <span className="text-4xl font-bold" style={{ color: "#FFFFFF" }}>Pro</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}> / with free trial</span>
            </div>
            <ul className="space-y-3">
              {PREMIUM_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <AppStoreButton location="pricing_premium" className="w-full justify-center" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

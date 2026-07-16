"use client";

import { motion } from "framer-motion";
import AppStoreButton from "./AppStoreButton";
import { useLang } from "@/components/dash/i18n";

const FREE_FEATURE_KEYS = [
  "lp2.priceFree1", "lp2.priceFree2", "lp2.priceFree3", "lp2.priceFree4",
  "lp2.priceFree5", "lp2.priceFree7", "lp2.priceFree8",
];
const PREMIUM_FEATURE_KEYS = [
  "lp2.pricePrem8", "lp2.pricePrem1", "lp2.pricePrem2", "lp2.pricePrem3",
  "lp2.pricePrem4", "lp2.pricePrem5", "lp2.pricePrem6", "lp2.pricePrem7",
];

export default function Pricing() {
  const { t } = useLang();
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
            {t("lp2.priceTitle")}
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
            <h3 className="text-lg font-semibold">{t("lp2.priceFree")}</h3>
            <p className="mt-1 text-text-muted">{t("lp2.priceFreeSub")}</p>
            <div className="mt-6 mb-8">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-text-muted"> {t("lp2.priceForever")}</span>
            </div>
            <ul className="space-y-3">
              {FREE_FEATURE_KEYS.map((key) => (
                <li
                  key={key}
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
                  {t(key)}
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
              {t("lp2.priceMostPopular")}
            </div>
            <h3 className="text-lg font-semibold" style={{ color: "#FFFFFF" }}>{t("lp2.pricePremium")}</h3>
            <p className="mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>{t("lp2.pricePremiumSub")}</p>
            <div className="mt-6 mb-8">
              <span className="text-4xl font-bold" style={{ color: "#FFFFFF" }}>{t("lp2.pricePro")}</span>
              <span style={{ color: "rgba(255,255,255,0.55)" }}> {t("lp2.priceTrial")}</span>
            </div>
            <ul className="space-y-3">
              {PREMIUM_FEATURE_KEYS.map((key) => (
                <li
                  key={key}
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
                  {t(key)}
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

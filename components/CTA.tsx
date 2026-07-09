"use client";

import { motion } from "framer-motion";
import AppStoreButton from "./AppStoreButton";
import { useLang } from "@/components/dash/i18n";

export default function CTA() {
  const { t } = useLang();
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="surface-dark rounded-3xl text-center"
          style={{ padding: "clamp(40px, 8vw, 80px) clamp(24px, 6vw, 48px)" }}
        >
          <p className="label" style={{ marginBottom: 20, color: "rgba(255,255,255,0.5)" }}>{t("lp.ctaLabel")}</p>

          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-1.5px",
              lineHeight: 1.08,
              color: "#FFFFFF",
              marginBottom: 16,
            }}
          >
            {t("lp.ctaTitle1")}
            <br />
            <span style={{ color: "#9C8FFF" }}>{t("lp.ctaTitle2")}</span>
          </h2>

          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.6)", maxWidth: 420, margin: "0 auto 36px" }}>
            {t("lp.ctaSubtitle")}
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <AppStoreButton location="final_cta" />
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{t("lp.ctaFootnote")}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

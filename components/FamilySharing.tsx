"use client";

import { motion } from "framer-motion";
import { useLang } from "@/components/dash/i18n";

const stats = [
  { valueKey: "lp2.familyStat1Value", labelKey: "lp2.familyStat1Label", accent: "#6C63FF" },
  { valueKey: "lp2.familyStat2Value", labelKey: "lp2.familyStat2Label", accent: "#0A8F5F" },
  { valueKey: "lp2.familyStat3Value", labelKey: "lp2.familyStat3Label", accent: "#F472B6" },
  { valueKey: "lp2.familyStat4Value", labelKey: "lp2.familyStat4Label", accent: "#C9780A" },
];

export default function FamilySharing() {
  const { t } = useLang();
  return (
    <section id="family-sharing" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
          style={{ marginBottom: 48 }}
        >
          <div className="mb-4 inline-flex rounded-xl p-3" style={{ background: "#F472B61A", color: "#F472B6" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <p className="label" style={{ marginBottom: 16 }}>{t("lp2.familyLabel")}</p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              color: "#0A0A0A",
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
            }}
          >
            {t("lp2.familyTitle1")}
            <br />
            <span style={{ color: "#63636B", fontWeight: 400 }}>{t("lp2.familyTitle2")}</span>
          </h2>
          <p style={{ fontSize: 16, color: "#63636B", lineHeight: 1.6, maxWidth: 560, margin: "16px auto 0" }}>
            {t("lp2.familySubtitle")}
          </p>
        </motion.div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.valueKey}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="surface rounded-2xl text-center"
              style={{ padding: "28px 20px" }}
            >
              <p style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 800, letterSpacing: "-1px", color: s.accent }}>
                {t(s.valueKey)}
              </p>
              <p style={{ fontSize: 13, color: "#63636B", marginTop: 8, lineHeight: 1.4 }}>{t(s.labelKey)}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginTop: 32 }}
        >
          <a href="#pricing" className="btn-violet" style={{ display: "inline-block", padding: "13px 28px", fontSize: 15 }}>
            {t("lp2.familyCta")}
          </a>
          <p style={{ fontSize: 12, color: "#8E8E93", marginTop: 14 }}>{t("lp2.familyDisclaimer")}</p>
        </motion.div>
      </div>
    </section>
  );
}

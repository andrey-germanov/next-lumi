"use client";

import { motion } from "framer-motion";
import AppStoreButton from "./AppStoreButton";
import AppQR from "./AppQR";
import PhoneFrame from "./PhoneFrame";
import { useLang } from "@/components/dash/i18n";

function PhoneMockup() {
  return (
    <div className="relative animate-phone-float" style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.18))" }}>
      <PhoneFrame
        src="/images/screenshots-of-app/home-dashboard.png"
        alt="Lumi app home screen showing balance, month forecast, and recent transactions"
        width={272}
        sizes="272px"
        priority
      />
    </div>
  );
}

const stats = [
  { value: "2 sec", labelKey: "lp.statBackTap" },
  { value: "0 taps", labelKey: "lp.statApplePay" },
  { value: "150+", labelKey: "lp.statCurrencies" },
  { value: "0 banks", labelKey: "lp.statBanks" },
];

const trustTagKeys = ["lp.tagNoBank", "lp.tagOnDevice", "lp.tagOffline", "lp.tagFree"];

export default function Hero() {
  const { t } = useLang();
  return (
    <section className="relative overflow-hidden pt-20">
      {/* Ambient orb */}
      <div className="hero-orb pointer-events-none absolute" style={{ top: -450, left: "50%", transform: "translateX(-50%)" }} />

      <div className="relative mx-auto max-w-7xl px-6 w-full">

        {/* ── Main grid ─────────────────────────────────── */}
        <div className="grid items-center gap-12 lg:grid-cols-2" style={{ paddingTop: 32, paddingBottom: 32 }}>

          {/* Copy */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="label mb-5">{t("lp.heroLabel")}</p>

            <h1
              className="font-extrabold"
              style={{ fontSize: "clamp(40px, 6vw, 62px)", letterSpacing: "-2.5px", lineHeight: 1.04, color: "#0A0A0A" }}
            >
              {t("lp.heroTitle1")}
              <br />
              <span style={{ color: "#6C63FF" }}>{t("lp.heroTitle2")}</span>
            </h1>

            <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#63636B", lineHeight: 1.7, maxWidth: 460, marginTop: 20, marginBottom: 28 }}>
              {t("lp.heroSubtitle")}
            </p>

            {/* Trust tags — horizontal scroll on mobile */}
            <div style={{ display: "flex", gap: 8, marginBottom: 32, overflowX: "auto", paddingBottom: 2, WebkitOverflowScrolling: "touch" as "touch" }}>
              {trustTagKeys.map((key) => (
                <span key={key} style={{ flexShrink: 0, fontSize: 12, fontWeight: 500, color: "#63636B", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, padding: "5px 12px", whiteSpace: "nowrap" as "nowrap" }}>
                  {t(key)}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              <AppStoreButton location="hero" />
              <AppQR location="hero" />
            </div>
          </motion.div>

          {/* Phone — desktop only */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="hidden lg:flex justify-end"
          >
            <PhoneMockup />
          </motion.div>
        </div>

        {/* ── Stats — horizontal scroll on mobile, 4-col on desktop ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ paddingBottom: 32 }}
        >
          {/* Mobile: horizontal pills */}
          <div className="flex lg:hidden gap-3 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: "touch" as "touch" }}>
            {stats.map((s) => (
              <div key={s.labelKey} className="surface rounded-2xl flex-shrink-0" style={{ padding: "16px 20px", minWidth: 120 }}>
                <p style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-1px", color: "#0A0A0A", lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: "#63636B", marginTop: 5, lineHeight: 1.3 }}>{t(s.labelKey)}</p>
              </div>
            ))}
          </div>

          {/* Desktop: 4-col grid */}
          <div className="hidden lg:grid grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.labelKey} className="surface rounded-2xl" style={{ padding: "20px 24px" }}>
                <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-1px", color: "#0A0A0A" }}>{s.value}</p>
                <p style={{ fontSize: 13, color: "#63636B", marginTop: 4 }}>{t(s.labelKey)}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

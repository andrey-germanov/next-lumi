"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import AppStoreButton from "./AppStoreButton";
import AppQR from "./AppQR";
import AndroidBetaButton from "./AndroidBetaButton";
import MarkTitle from "./MarkTitle";
import { useLang } from "@/components/dash/i18n";

const trustTagKeys = ["lp.tagNoBank", "lp.tagOnDevice", "lp.tagOffline", "lp.tagFree"];

export default function Hero() {
  const { t, locale } = useLang();
  return (
    <section className="relative overflow-hidden pt-20" style={{ background: "#F9F9FD" }}>
      <div className="relative mx-auto max-w-6xl px-6 w-full">
        <div className="grid items-center gap-6 lg:gap-12 grid-cols-1 lg:grid-cols-[1.1fr_1fr]" style={{ paddingTop: 32 }}>
          {/* Copy */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="label mb-5" style={{ color: "#6C63FF" }}>{t("lp3.heroLabel")}</p>

            <h1
              className="font-extrabold"
              style={{ fontSize: "clamp(34px, 4.8vw, 58px)", letterSpacing: "-0.035em", lineHeight: 1.06, color: "#1B1A33", overflowWrap: "break-word" }}
            >
              <MarkTitle text={t("lp3.title.applepay")} marker="#CFC8FF" />
            </h1>

            <p style={{ fontSize: "clamp(16px, 2vw, 19px)", color: "#63636B", lineHeight: 1.6, maxWidth: 480, marginTop: 22, marginBottom: 26 }}>
              {t("lp3.heroSub")}
            </p>

            <div style={{ display: "flex", gap: 8, marginBottom: 30, flexWrap: "wrap" }}>
              {trustTagKeys.map((key) => (
                <span key={key} style={{ fontSize: 13, fontWeight: 600, color: "#4B4A63", background: "#FFFFFF", borderRadius: 999, padding: "6px 14px", whiteSpace: "nowrap", boxShadow: "0 1px 2px rgba(50,36,120,0.06)" }}>
                  {t(key)}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <AppStoreButton location="hero" />
                <AndroidBetaButton location="hero" />
              </div>
              <AppQR location="hero" />
            </div>
          </motion.div>

          {/* Apple Pay tap → Lumi logs it: the visual from App Store slide 1 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex justify-center lg:justify-end"
          >
            <Image
              src={`/images/landing/${locale}/applepay.webp`}
              alt={t("lp3.heroSub")}
              width={880}
              height={1389}
              sizes="(min-width: 1024px) 480px, 92vw"
              priority
              style={{ width: "100%", maxWidth: 480, height: "auto" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import AppStoreButton from "./AppStoreButton";

function PhoneMockup() {
  return (
    <div className="relative animate-phone-float">
      <div style={{ width: 256, height: 536, borderRadius: 44, background: "#1C1C1E", border: "1.5px solid rgba(0,0,0,0.15)", boxShadow: "0 30px 60px rgba(0,0,0,0.18)", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: "1.5px", borderRadius: 43, overflow: "hidden" }}>
          <Image
            src="/images/screenshots-of-app/home-dashboard.png"
            alt="Lumi app home screen showing balance, month forecast, and recent transactions"
            fill
            sizes="256px"
            style={{ objectFit: "cover", objectPosition: "top" }}
            priority
          />
        </div>
      </div>
    </div>
  );
}

const stats = [
  { value: "2 sec",   label: "to log via Back Tap" },
  { value: "0 taps",  label: "with Apple Pay" },
  { value: "150+",    label: "currencies" },
  { value: "0 banks", label: "connected. Ever." },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20">
      {/* Ambient orb */}
      <div className="hero-orb pointer-events-none absolute" style={{ top: -450, left: "50%", transform: "translateX(-50%)" }} />

      <div className="relative mx-auto max-w-7xl px-6 w-full">

        {/* ── Main grid ─────────────────────────────────── */}
        <div className="grid items-center gap-12 lg:grid-cols-2" style={{ paddingTop: 72, paddingBottom: 72 }}>

          {/* Copy */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="label mb-5">Available on the App Store</p>

            <h1
              className="font-extrabold"
              style={{ fontSize: "clamp(40px, 6vw, 62px)", letterSpacing: "-2.5px", lineHeight: 1.04, color: "#0A0A0A" }}
            >
              Know your money.
              <br />
              <span style={{ color: "#6C63FF" }}>Before it&apos;s gone.</span>
            </h1>

            <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#63636B", lineHeight: 1.7, maxWidth: 460, marginTop: 20, marginBottom: 28 }}>
              Back Tap your iPhone to log an expense in 2&nbsp;seconds.
              Apple Pay auto-imports the moment you pay.
              AI forecasts your month-end balance before you overspend.
            </p>

            {/* Trust tags — horizontal scroll on mobile */}
            <div style={{ display: "flex", gap: 8, marginBottom: 32, overflowX: "auto", paddingBottom: 2, WebkitOverflowScrolling: "touch" as "touch" }}>
              {["No bank login", "Data on device", "Works offline", "Free"].map((t) => (
                <span key={t} style={{ flexShrink: 0, fontSize: 12, fontWeight: 500, color: "#63636B", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, padding: "5px 12px", whiteSpace: "nowrap" as "nowrap" }}>
                  {t}
                </span>
              ))}
            </div>

            <AppStoreButton location="hero" />
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
          style={{ paddingBottom: 72 }}
        >
          {/* Mobile: horizontal pills */}
          <div className="flex lg:hidden gap-3 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: "touch" as "touch" }}>
            {stats.map((s) => (
              <div key={s.label} className="surface rounded-2xl flex-shrink-0" style={{ padding: "16px 20px", minWidth: 120 }}>
                <p style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-1px", color: "#0A0A0A", lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: "#63636B", marginTop: 5, lineHeight: 1.3 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Desktop: 4-col grid */}
          <div className="hidden lg:grid grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="surface rounded-2xl" style={{ padding: "20px 24px" }}>
                <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-1px", color: "#0A0A0A" }}>{s.value}</p>
                <p style={{ fontSize: 13, color: "#63636B", marginTop: 4 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

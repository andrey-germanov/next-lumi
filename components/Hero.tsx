"use client";

import { motion } from "framer-motion";
import AppStoreButton from "./AppStoreButton";

/* ── Sparkline (mirrors ForecastCard from the app) ───────────────────── */
function Sparkline() {
  const actual    = "M0,28 L18,25 L36,27 L54,21 L72,23 L90,16 L108,19 L126,12";
  const projected = "M126,12 L144,10 L162,7 L180,5";
  const fill      = `${actual} L126,36 L0,36 Z`;
  return (
    <svg viewBox="0 0 180 36" className="w-full" style={{ height: 36 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sf" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#6C63FF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#6C63FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill="url(#sf)" />
      <path d={actual} fill="none" stroke="#6C63FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={projected} fill="none" stroke="#6C63FF" strokeWidth="1" strokeDasharray="3,3" strokeLinecap="round" />
      <line x1="126" y1="0" x2="126" y2="36" stroke="#6C63FF" strokeWidth="0.5" strokeOpacity="0.35" />
    </svg>
  );
}

/* ── Phone mockup ─────────────────────────────────────────────────────── */
function PhoneMockup() {
  const transactions = [
    { icon: "🛒", name: "Whole Foods",  amount: "−$89.40", sub: "Today" },
    { icon: "☕", name: "Blue Bottle",  amount: "−$6.50",  sub: "Today" },
    { icon: "🍕", name: "Tony's Pizza", amount: "−$34.90", sub: "Yesterday" },
  ];

  return (
    <div className="relative animate-phone-float">
      {/* Phone frame */}
      <div
        style={{
          width: 256,
          height: 536,
          borderRadius: 44,
          background: "#000",
          border: "1.5px solid rgba(255,255,255,0.10)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.7)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Screen */}
        <div
          style={{
            position: "absolute",
            inset: "1.5px",
            borderRadius: 43,
            background: "#09090B",
            overflow: "hidden",
          }}
        >
          {/* Dynamic Island */}
          <div
            style={{
              position: "absolute",
              top: 14, left: "50%",
              transform: "translateX(-50%)",
              width: 108, height: 30,
              borderRadius: 20,
              background: "#000",
            }}
          />

          {/* Content */}
          <div style={{ padding: "56px 20px 20px", display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Label */}
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: "#555", textTransform: "uppercase", marginBottom: 8 }}>
              June 2026
            </p>

            {/* Balance */}
            <p style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-1.5px", color: "#fff", lineHeight: 1 }}>
              $2,847
            </p>
            <p style={{ fontSize: 11, color: "#555", marginTop: 4, marginBottom: 20 }}>
              spent this month
            </p>

            {/* Forecast mini card */}
            <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "12px 14px", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 10, color: "#555", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>Forecast</p>
                  <p style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px", color: "#fff", marginTop: 2 }}>~$3,420</p>
                </div>
                <span style={{ fontSize: 9, fontWeight: 600, color: "#34D399", background: "rgba(52,211,153,0.12)", borderRadius: 6, padding: "3px 7px" }}>
                  On Track
                </span>
              </div>
              <Sparkline />
            </div>

            {/* Transactions */}
            <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", color: "#444", textTransform: "uppercase", marginBottom: 10 }}>
              Recent
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {transactions.map((tx, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 10, background: "#111118", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                      {tx.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>{tx.name}</p>
                      <p style={{ fontSize: 9, color: "#555" }}>{tx.sub}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#F87171" }}>{tx.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────── */
export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
      {/* Single ambient orb — faint, no blur */}
      <div
        className="hero-orb pointer-events-none absolute"
        style={{ top: -450, left: "50%", transform: "translateX(-50%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-24 w-full">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="label mb-6">Available on the App Store</p>

            <h1
              className="font-bold text-white"
              style={{ fontSize: "clamp(38px, 5vw, 62px)", letterSpacing: "-2px", lineHeight: 1.05 }}
            >
              Know your money.
              <br />
              <span style={{ color: "#6C63FF" }}>Before it&apos;s gone.</span>
            </h1>

            <p
              style={{ fontSize: 18, color: "#888", lineHeight: 1.7, maxWidth: 460, marginTop: 24, marginBottom: 28 }}
            >
              Back Tap your iPhone to log an expense in 2 seconds.
              Apple Pay auto-imports the moment you pay.
              AI forecasts your month-end balance before you overspend.
            </p>

            {/* Trust tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
              {["No bank login", "Data stays on device", "Works offline", "Free to start"].map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 12, fontWeight: 500, color: "#555",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 8, padding: "5px 12px",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            <AppStoreButton location="hero" />
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex justify-center lg:justify-end"
          >
            <PhoneMockup />
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-24 grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {[
            { value: "2 sec",  label: "to log via Back Tap" },
            { value: "0 taps", label: "with Apple Pay" },
            { value: "150+",   label: "currencies" },
            { value: "0 banks", label: "connected. Ever." },
          ].map((s) => (
            <div key={s.label} className="surface rounded-2xl" style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-1px", color: "#fff" }}>{s.value}</p>
              <p style={{ fontSize: 13, color: "#555", marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

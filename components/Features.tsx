"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3" />
      </svg>
    ),
    title: "Back Tap logging",
    desc: "Double-tap the back of your iPhone. No unlocking, no finding the app. Lumi opens in recording mode — expense logged in under 3 seconds.",
    stat: "2 sec",
    statLabel: "avg. log time",
    accent: "#6C63FF",
    large: true,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    title: "Apple Pay auto-import",
    desc: "Pay contactless. The expense appears in Lumi automatically — amount, merchant, timestamp. Zero manual entry required.",
    stat: "0 taps",
    statLabel: "manual entries",
    accent: "#34D399",
    large: true,
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "AI Spending Forecast",
    desc: "Lumi compares your current spend rate against 3 months of history and shows exactly where you'll land — 7–10 days before month-end.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
      </svg>
    ),
    title: "Receipt Scanner",
    desc: "Point at any receipt — paper or screen. AI reads amount, date, merchant, and category in seconds. Works in any language.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z" />
      </svg>
    ),
    title: "Category Budgets",
    desc: "Set monthly limits per category. Lumi tracks live progress and warns you before you overspend — not after.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: "150+ currencies",
    desc: "Real-time conversion. Track in multiple currencies simultaneously. Perfect for travel or multi-currency income.",
  },
];

export default function Features() {
  const large = features.filter((f) => f.large);
  const small = features.filter((f) => !f.large);

  return (
    <section id="features" className="py-28">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 56 }}
        >
          <p className="label" style={{ marginBottom: 16 }}>What makes Lumi different</p>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-1.5px",
              lineHeight: 1.1,
              maxWidth: 520,
            }}
          >
            Logging that disappears
            <br />
            <span style={{ color: "#444", fontWeight: 400 }}>when you don&apos;t need it.</span>
          </h2>
        </motion.div>

        {/* Hero features — 2 col */}
        <div className="grid gap-4 md:grid-cols-2" style={{ marginBottom: 16 }}>
          {large.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="surface rounded-2xl"
              style={{ padding: "clamp(20px, 4vw, 36px)" }}
            >
              <div style={{ color: "#555", marginBottom: 20 }}>{f.icon}</div>

              <h3
                style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px", marginBottom: 10 }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.65, marginBottom: 24 }}>
                {f.desc}
              </p>

              {f.stat && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
                  <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-1.5px", color: f.accent }}>
                    {f.stat}
                  </p>
                  <p style={{ fontSize: 12, color: "#444", marginTop: 2 }}>{f.statLabel}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Secondary features — 2 col mobile, 4 col desktop */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {small.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.06 }}
              className="surface rounded-2xl"
              style={{ padding: "28px 28px" }}
            >
              <div style={{ color: "#555", marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px", marginBottom: 8 }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

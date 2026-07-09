"use client";

import { motion } from "framer-motion";
import { useLang } from "@/components/dash/i18n";
import { Money, CategoryDot } from "@/components/dash/ui";
import { AppIcon } from "@/components/dash/AppIcon";

// Static demo data mirroring the personal-cabinet dashboard.
const DEMO_BALANCE = 4820.5;
const DEMO_INCOME = 6200;
const DEMO_EXPENSES = 1379.5;

const DEMO_CATEGORIES = [
  { id: "groceries", icon: "🛒", color: "#84CC16", total: 512.4, pct: 37 },
  { id: "food", icon: "🍽️", color: "#F59E0B", total: 318.0, pct: 23 },
  { id: "transport", icon: "🚗", color: "#6C63FF", total: 205.2, pct: 15 },
  { id: "shopping", icon: "🛍️", color: "#A78BFA", total: 180.9, pct: 13 },
  { id: "entertainment", icon: "🎬", color: "#EC4899", total: 163.0, pct: 12 },
];

export default function DashboardPreview() {
  const { t, tCategoryName } = useLang();

  return (
    <section className="relative overflow-hidden" style={{ padding: "clamp(48px, 8vw, 96px) 0" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p className="label" style={{ marginBottom: 12 }}>{t("lp.previewLabel")}</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-1.5px", color: "#0A0A0A", lineHeight: 1.08 }}>
            {t("lp.previewTitle")}
          </h2>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "#63636B", lineHeight: 1.6, maxWidth: 520, margin: "16px auto 0" }}>
            {t("lp.previewSubtitle")}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="surface rounded-3xl"
          style={{ maxWidth: 920, margin: "0 auto", padding: "clamp(16px, 3vw, 28px)" }}
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
            {/* Left: balance + insight */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="surface-dark rounded-2xl" style={{ padding: 22 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p className="label" style={{ color: "rgba(255,255,255,0.5)" }}>{t("dash.balance")}</p>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.6px" }}>{t("dash.allTime")}</span>
                </div>
                <Money amount={DEMO_BALANCE} currency="USD" style={{ display: "block", fontSize: "clamp(30px, 5vw, 40px)", fontWeight: 800, letterSpacing: "-1.5px", color: "#fff", lineHeight: 1.05, marginTop: 6 }} />
                <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                    {t("common.income")} <Money amount={DEMO_INCOME} currency="USD" style={{ color: "#34D399", fontWeight: 600 }} />
                  </span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                    {t("dash.expenses")} <Money amount={DEMO_EXPENSES} currency="USD" style={{ color: "#F87171", fontWeight: 600 }} />
                  </span>
                </div>
              </div>

              {/* Insight */}
              <div className="surface rounded-2xl" style={{ padding: 18, display: "flex", alignItems: "flex-start", gap: 14 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 11, background: "rgba(10,143,95,0.1)", flexShrink: 0 }}>
                  <AppIcon name="✨" color="#0A8F5F" size={18} />
                </span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A", marginBottom: 3 }}>{t("ai.greatTitle")}</p>
                  <p style={{ fontSize: 13, color: "#63636B", lineHeight: 1.5 }}>{t("lp.previewInsight")}</p>
                </div>
              </div>
            </div>

            {/* Right: spending by category */}
            <div className="surface-raised rounded-2xl" style={{ padding: 22 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A", marginBottom: 16 }}>{t("dash.byCategory")}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {DEMO_CATEGORIES.map((c) => (
                  <div key={c.id}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <CategoryDot icon={c.icon} color={c.color} size={28} />
                      <span style={{ fontSize: 14, fontWeight: 500, color: "#0A0A0A", flex: 1 }}>{tCategoryName(c.id, c.id)}</span>
                      <Money amount={c.total} currency="USD" style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A" }} />
                      <span style={{ fontSize: 12, color: "#8E8E93", width: 34, textAlign: "right" }}>{c.pct}%</span>
                    </div>
                    <div style={{ height: 6, background: "#EDEDF0", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${c.pct}%`, background: c.color, borderRadius: 999 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

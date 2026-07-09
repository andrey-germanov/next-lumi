"use client";

import { useStore } from "@/components/dash/store";
import { useLang } from "@/components/dash/i18n";
import { PageHeader, Card, Money } from "@/components/dash/ui";
import { AppIcon } from "@/components/dash/AppIcon";
import { getPeriodSummary } from "@/lib/finance";
import { computeCurrentMonthForecast, type ForecastStatus } from "@/lib/currentMonthForecast";

const STATUS_META: Record<ForecastStatus, { key: string; color: string; bg: string }> = {
  risk: { key: "fc.statusRisk", color: "#D63B57", bg: "rgba(214,59,87,0.1)" },
  onTrack: { key: "fc.statusOnTrack", color: "#0A8F5F", bg: "rgba(10,143,95,0.1)" },
  surplus: { key: "fc.statusSurplus", color: "#6C63FF", bg: "rgba(108,99,255,0.1)" },
};

export default function ForecastPage() {
  const { receipts, incomes, currency } = useStore();
  const { t, tCategoryName, formatMonth } = useLang();
  const primary = currency.primary;
  const monthName = formatMonth();

  const f = computeCurrentMonthForecast(receipts, incomes, primary);
  const summary = getPeriodSummary(receipts, incomes, primary);

  if (!f) {
    return (
      <>
        <PageHeader eyebrow={monthName} title={t("dash.monthForecast")} subtitle={t("fc.subtitle")} />
        <Card><p style={{ fontSize: 14, color: "#8E8E93" }}>{t("fc.noData")}</p></Card>
      </>
    );
  }

  const status = STATUS_META[f.status];
  const confidencePct = Math.round(f.confidence * 100);
  const daysLeft = f.daysInMonth - f.daysPassed;
  // blendedRate reconstructed exactly: projectedRemaining = rate * daysLeft
  const dailyPace = daysLeft > 0 ? (f.projectedTotalExpenses - f.spentSoFar) / daysLeft : (f.daysPassed > 0 ? f.spentSoFar / f.daysPassed : 0);
  const elapsedPct = (f.daysPassed / f.daysInMonth) * 100;
  const fmt = (n: number) => new Intl.NumberFormat().format(Math.round(n));

  return (
    <>
      <PageHeader eyebrow={monthName} title={t("dash.monthForecast")} subtitle={t("fc.subtitle")} />

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        {/* Main projection */}
        <div className="surface-dark rounded-2xl" style={{ padding: "clamp(24px, 4vw, 34px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <p className="label" style={{ color: "rgba(255,255,255,0.5)" }}>{t("fc.projectedExpenses")}</p>
            <span style={{ fontSize: 12, fontWeight: 700, color: status.color, background: status.bg, padding: "5px 10px", borderRadius: 999 }}>{t(status.key)}</span>
          </div>

          <Money amount={f.projectedTotalExpenses} currency={primary} style={{ display: "block", fontSize: "clamp(38px, 7vw, 52px)", fontWeight: 800, letterSpacing: "-2px", color: "#fff", lineHeight: 1 }} />

          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 12 }}>
            {t("fc.spentSoFar", {
              amt: fmt(f.spentSoFar) + " " + primary,
              rate: fmt(dailyPace) + " " + primary,
              days: f.daysPassed,
            })}
          </p>

          {/* Month progress */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>
              <span>{t("fc.dayOf", { d: f.daysPassed, total: f.daysInMonth })}</span>
              <span>{t("fc.daysLeft", { n: daysLeft })}</span>
            </div>
            <div style={{ height: 8, background: "rgba(255,255,255,0.12)", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${elapsedPct}%`, background: "#9C8FFF", borderRadius: 999 }} />
            </div>
          </div>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{t("fc.confidence")}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{confidencePct}%</p>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{t("fc.projectedBalance")}</p>
              {f.hasIncomeData ? (
                <Money amount={f.projectedBalance} currency={primary} sign style={{ fontSize: 18, fontWeight: 700, color: f.projectedBalance >= 0 ? "#34D399" : "#F87171" }} />
              ) : (
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}>—</p>
              )}
            </div>
          </div>
        </div>

        {/* Balance breakdown + drivers */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A", marginBottom: 16 }}>{t("fc.projectedBalance")}</h2>
            {f.hasIncomeData ? (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <Row label={t("fc.income")}><Money amount={f.monthIncome} currency={primary} style={{ color: "#0A8F5F", fontWeight: 600 }} /></Row>
                  <Row label={t("dash.projected")}><Money amount={f.projectedTotalExpenses} currency={primary} style={{ color: "#0A0A0A", fontWeight: 600 }} /></Row>
                  {f.savedThisMonth > 0 && <Row label={t("fc.saved")}><Money amount={f.savedThisMonth} currency={primary} style={{ color: "#0A0A0A", fontWeight: 600 }} /></Row>}
                </div>
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.07)", marginTop: 14, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A" }}>{t("fc.projectedBalance")}</span>
                  <Money amount={f.projectedBalance} currency={primary} sign style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: f.projectedBalance >= 0 ? "#0A8F5F" : "#D63B57" }} />
                </div>
                <p style={{ fontSize: 12, color: "#8E8E93", marginTop: 8 }}>
                  {t("fc.range")}: <Money amount={f.confidenceLow} currency={primary} /> – <Money amount={f.confidenceHigh} currency={primary} />
                </p>
              </>
            ) : (
              <p style={{ fontSize: 14, color: "#8E8E93" }}>{t("fc.noIncomeHint")}</p>
            )}
          </Card>

          <Card style={{ flex: 1 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A", marginBottom: 16 }}>{t("fc.whereGoing")}</h2>

            {f.driver && (
              <div style={{ background: "#F7F7F8", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
                <p style={{ fontSize: 11, color: "#8E8E93", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{t("fc.topDriver")}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>{tCategoryName(f.driver.categoryId, f.driver.categoryName)}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#C9780A" }}>{t("fc.aboveUsual", { amt: fmt(f.driver.delta), cur: primary })}</span>
                </div>
              </div>
            )}

            {summary.byCategory.length === 0 ? (
              <p style={{ fontSize: 14, color: "#8E8E93" }}>{t("fc.noSpending")}</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {summary.byCategory.slice(0, 5).map((c) => (
                  <div key={c.categoryId} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <AppIcon name={c.categoryIcon} color={c.categoryColor} size={18} />
                    <span style={{ fontSize: 14, color: "#0A0A0A", flex: 1 }}>{tCategoryName(c.categoryId, c.categoryName)}</span>
                    <Money amount={c.total} currency={primary} style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A", width: 90, textAlign: "right" }} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ fontSize: 13, color: "#63636B" }}>{label}</span>
      <span style={{ fontSize: 14 }}>{children}</span>
    </div>
  );
}

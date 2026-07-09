"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/components/dash/store";
import { useLang } from "@/components/dash/i18n";
import { Card, Money, PageHeader, PrimaryButton, CategoryDot } from "@/components/dash/ui";
import InsightCard from "@/components/dash/InsightCard";
import DashboardCharts, { type CategorySelection } from "@/components/dash/Charts";
import CategoryTransactionsModal from "@/components/dash/CategoryTransactionsModal";
import { getPeriodSummary, toUnified } from "@/lib/finance";
import { computeCurrentMonthForecast } from "@/lib/currentMonthForecast";
import { calculateBalance } from "@/lib/balance";

export default function DashboardPage() {
  const { receipts, incomes, currency } = useStore();
  const { t, tCategoryName, formatMonth, formatDate } = useLang();
  const primary = currency.primary;

  const [monthOffset, setMonthOffset] = useState(0);
  const [selected, setSelected] = useState<CategorySelection | null>(null);
  const [showAllCats, setShowAllCats] = useState(false);
  const now = new Date();
  const refDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 15);
  const isCurrent = monthOffset === 0;
  const viewMonthName = formatMonth(refDate);

  const summary = getPeriodSummary(receipts, incomes, primary, refDate);
  const forecast = computeCurrentMonthForecast(receipts, incomes, primary);
  const balance = calculateBalance(receipts, incomes, primary);
  const transactions = toUnified(receipts, incomes).slice(0, 8);

  const monthName = formatMonth();
  const projectedSpend = forecast?.projectedTotalExpenses ?? 0;
  const confidencePct = Math.round((forecast?.confidence ?? 0) * 100);

  const stats = [
    { label: t("dash.net"), value: summary.net, sign: true, color: summary.net >= 0 ? "#0A8F5F" : "#D63B57" },
    { label: t("common.income"), value: summary.totalIncome, sign: false, color: "#0A0A0A" },
    { label: t("dash.expenses"), value: summary.totalExpenses, sign: false, color: "#0A0A0A" },
    ...(isCurrent ? [{ label: t("dash.projected"), value: projectedSpend, sign: false, color: "#6C63FF" }] : []),
  ];

  return (
    <>
      <PageHeader
        eyebrow={monthName}
        title={t("nav.dashboard")}
        subtitle={t("dash.subtitle")}
        action={
          <Link href="/transactions/new">
            <PrimaryButton>{t("dash.addTx")}</PrimaryButton>
          </Link>
        }
      />

      {/* Balance — all-time, identical to the app's home balance */}
      <div className="surface-dark rounded-2xl" style={{ padding: "clamp(20px, 4vw, 28px)", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p className="label" style={{ color: "rgba(255,255,255,0.5)" }}>{t("dash.balance")}</p>
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.6px" }}>{t("dash.allTime")}</span>
        </div>
        <Money amount={balance.balance} currency={primary} style={{ display: "block", fontSize: "clamp(34px, 6vw, 46px)", fontWeight: 800, letterSpacing: "-2px", color: "#fff", lineHeight: 1.05, marginTop: 6 }} />
        <div style={{ display: "flex", gap: 24, marginTop: 14 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            {t("common.income")} <Money amount={balance.income} currency={primary} style={{ color: "#34D399", fontWeight: 600 }} />
          </span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
            {t("dash.expenses")} <Money amount={balance.expenses} currency={primary} style={{ color: "#F87171", fontWeight: 600 }} />
          </span>
        </div>
      </div>

      <InsightCard />

      {/* Month switcher */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", borderRadius: 14, padding: "8px 12px", marginBottom: 16, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
        <button onClick={() => setMonthOffset((o) => o - 1)} aria-label="Previous month" style={{ width: 32, height: 32, borderRadius: 9, cursor: "pointer", background: "#F7F7F8", color: "#0A0A0A", fontSize: 16, lineHeight: 1 }}>‹</button>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>{viewMonthName}</span>
        <button
          onClick={() => setMonthOffset((o) => Math.min(o + 1, 0))}
          disabled={isCurrent}
          aria-label="Next month"
          style={{ width: 32, height: 32, borderRadius: 9, cursor: isCurrent ? "default" : "pointer", background: "#F7F7F8", color: isCurrent ? "#C7C7CC" : "#0A0A0A", fontSize: 16, lineHeight: 1 }}
        >›</button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 16, marginBottom: 20 }}>
        {stats.map((s) => (
          <Card key={s.label}>
            <p style={{ fontSize: 12, color: "#63636B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px" }}>{s.label}</p>
            <Money amount={s.value} currency={primary} sign={s.sign} style={{ display: "block", fontSize: 26, fontWeight: 800, letterSpacing: "-1px", color: s.color, marginTop: 8 }} />
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        {/* Spending by category */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A" }}>{t("dash.byCategory")}</h2>
            <span style={{ fontSize: 13, color: "#8E8E93" }}>{viewMonthName}</span>
          </div>
          {summary.byCategory.length === 0 ? (
            <p style={{ fontSize: 14, color: "#8E8E93" }}>{t("dash.noExpenses")}</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {(showAllCats ? summary.byCategory : summary.byCategory.slice(0, 5)).map((c) => (
                <button
                  key={c.categoryId}
                  onClick={() => setSelected({ cat: c, type: "expense" })}
                  style={{ display: "block", width: "100%", textAlign: "left", cursor: "pointer", background: "transparent", borderRadius: 8 }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <CategoryDot icon={c.categoryIcon} color={c.categoryColor} size={32} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#0A0A0A", flex: 1 }}>{tCategoryName(c.categoryId, c.categoryName)}</span>
                    <Money amount={c.total} currency={primary} style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A" }} />
                    <span style={{ fontSize: 12, color: "#8E8E93", width: 40, textAlign: "right" }}>{c.percentage.toFixed(0)}%</span>
                  </div>
                  <div style={{ height: 6, background: "#F0F0F2", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(c.percentage, 100)}%`, background: c.categoryColor, borderRadius: 999 }} />
                  </div>
                </button>
              ))}
              {summary.byCategory.length > 5 && (
                <button onClick={() => setShowAllCats((v) => !v)} style={{ alignSelf: "flex-start", fontSize: 13, fontWeight: 600, color: "#6C63FF", cursor: "pointer" }}>
                  {showAllCats ? t("common.showLess") : t("common.showMore", { n: summary.byCategory.length })}
                </button>
              )}
            </div>
          )}
        </Card>

        {/* Forecast + recent */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="surface-dark rounded-2xl" style={{ padding: 22 }}>
            <p className="label" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>{t("dash.monthForecast")}</p>
            <Money amount={projectedSpend} currency={primary} style={{ display: "block", fontSize: 30, fontWeight: 800, letterSpacing: "-1.2px", color: "#fff" }} />
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>
              {t("dash.projectedEnd", { pct: confidencePct })}
            </p>
            <Link href="/forecast" style={{ display: "inline-block", marginTop: 16, fontSize: 13, fontWeight: 600, color: "#9C8FFF" }}>
              {t("dash.seeForecast")}
            </Link>
          </div>

          <Card style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A" }}>{t("dash.recent")}</h2>
            </div>
            {transactions.length === 0 ? (
              <p style={{ fontSize: 14, color: "#8E8E93" }}>{t("dash.nothing")}</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {transactions.map((tx, i) => (
                  <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.05)" }}>
                    <CategoryDot icon={tx.categoryIcon} color={tx.categoryColor} size={34} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: "#0A0A0A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.title}</p>
                      <p style={{ fontSize: 12, color: "#8E8E93" }}>
                        {tCategoryName(tx.categoryId, tx.categoryName, tx.type === "income" ? "income" : "expense")} · {formatDate(tx.date)}
                      </p>
                    </div>
                    <Money
                      amount={tx.type === "income" ? tx.amount : -tx.amount}
                      currency={tx.currency ?? primary}
                      sign
                      style={{ fontSize: 14, fontWeight: 600, color: tx.type === "income" ? "#0A8F5F" : "#0A0A0A" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Charts */}
      <DashboardCharts refDate={refDate} isCurrent={isCurrent} onSelectCategory={setSelected} />

      {selected && (
        <CategoryTransactionsModal
          type={selected.type}
          categoryId={selected.cat.categoryId}
          categoryName={tCategoryName(selected.cat.categoryId, selected.cat.categoryName, selected.type)}
          categoryIcon={selected.cat.categoryIcon}
          categoryColor={selected.cat.categoryColor}
          refDate={refDate}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

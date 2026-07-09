"use client";

import { useStore } from "./store";
import { useLang } from "./i18n";
import { Card } from "./ui";
import { getMonthlyTotals, getPeriodSummary, getIncomeByCategory } from "@/lib/finance";
import { computeCurrentMonthForecast } from "@/lib/currentMonthForecast";
import { formatCurrency } from "@/utils/currencyUtils";
import type { CurrencyCode } from "@/utils/currencyUtils";
import type { CategorySpend } from "@/types/web";

export type CategorySelection = { cat: CategorySpend; type: "expense" | "income" };

function compact(n: number, currency: CurrencyCode): string {
  return formatCurrency.compact(Math.round(n), currency);
}

// ── Spending trajectory (actual + projected cumulative) ─────────────────────

function TrajectoryChart({ currency }: { currency: CurrencyCode }) {
  const { receipts, incomes } = useStore();
  const { t } = useLang();
  const f = computeCurrentMonthForecast(receipts, incomes, currency);
  if (!f) return null;

  const W = 520, H = 200, padX = 8, padTop = 16, padBottom = 24;
  const pts = f.dailyPoints;
  const maxVal = Math.max(...pts.map((p) => p.projected), 1);
  const x = (day: number) => padX + ((day - 1) / (f.daysInMonth - 1 || 1)) * (W - padX * 2);
  const y = (v: number) => padTop + (1 - v / maxVal) * (H - padTop - padBottom);

  const actualPts = pts.filter((p) => p.actual !== null).map((p) => `${x(p.day)},${y(p.actual as number)}`).join(" ");
  const projPts = pts.filter((p) => p.day >= f.daysPassed).map((p) => `${x(p.day)},${y(p.projected)}`).join(" ");
  const areaPts = `${padX},${y(0)} ${pts.filter((p) => p.actual !== null).map((p) => `${x(p.day)},${y(p.actual as number)}`).join(" ")} ${x(f.daysPassed)},${y(0)}`;

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A" }}>{t("dash.trajectory")}</h2>
        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#8E8E93" }}>
          <span><span style={{ color: "#6C63FF" }}>●</span> {t("dash.actualLabel")}</span>
          <span><span style={{ color: "#9C8FFF" }}>●</span> {t("dash.projectedLabel")}</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }} preserveAspectRatio="none">
        <polygon points={areaPts} fill="#6C63FF" opacity={0.08} />
        <polyline points={projPts} fill="none" stroke="#9C8FFF" strokeWidth={2} strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" />
        {actualPts && <polyline points={actualPts} fill="none" stroke="#6C63FF" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />}
        <circle cx={x(f.daysPassed)} cy={y(f.spentSoFar)} r={3.5} fill="#6C63FF" />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8E8E93", marginTop: 4 }}>
        <span>{compact(f.spentSoFar, currency)}</span>
        <span>→ {compact(f.projectedTotalExpenses, currency)}</span>
      </div>
    </Card>
  );
}

// ── 6-month income vs expenses ───────────────────────────────────────────────

function TrendChart({ currency }: { currency: CurrencyCode }) {
  const { receipts, incomes } = useStore();
  const { t, formatMonth } = useLang();
  const months = getMonthlyTotals(receipts, incomes, currency, 6);
  const max = Math.max(...months.map((m) => Math.max(m.income, m.expenses, m.savings)), 1);
  const ticks = [1, 0.75, 0.5, 0.25, 0]; // fractions of max, top → bottom
  const H = 150;
  const bar = (value: number, color: string) => (
    <div title={compact(value, currency)} style={{ width: "26%", height: `${(value / max) * 100}%`, minHeight: value > 0 ? 3 : 0, background: color, borderRadius: "4px 4px 0 0" }} />
  );

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A" }}>{t("dash.trend")}</h2>
        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#8E8E93" }}>
          <span><span style={{ color: "#34D399" }}>●</span> {t("common.income")}</span>
          <span><span style={{ color: "#F87171" }}>●</span> {t("dash.expenses")}</span>
          <span><span style={{ color: "#6C63FF" }}>●</span> {t("goal.eyebrow")}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {/* Y axis scale */}
        <div style={{ position: "relative", width: 42, height: H, flexShrink: 0 }}>
          {ticks.map((f) => (
            <span key={f} style={{ position: "absolute", right: 0, top: `${(1 - f) * 100}%`, transform: "translateY(-50%)", fontSize: 9, color: "#B0B0B8", whiteSpace: "nowrap" }}>
              {f === 0 ? "0" : compact(max * f, currency)}
            </span>
          ))}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Plot area with gridlines */}
          <div style={{ position: "relative", height: H }}>
            {ticks.map((f) => (
              <div key={f} style={{ position: "absolute", left: 0, right: 0, top: `${(1 - f) * 100}%`, borderTop: "1px dashed rgba(0,0,0,0.06)" }} />
            ))}
            <div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: 10, height: "100%" }}>
              {months.map((m, i) => (
                <div key={i} style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 3, height: "100%", justifyContent: "center" }}>
                  {bar(m.income, "#34D399")}
                  {bar(m.expenses, "#F87171")}
                  {bar(m.savings, "#6C63FF")}
                </div>
              ))}
            </div>
          </div>
          {/* X axis month labels */}
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            {months.map((m, i) => (
              <span key={i} style={{ flex: 1, textAlign: "center", fontSize: 10, color: "#8E8E93" }}>
                {formatMonth(m.date).split(" ")[0].slice(0, 3)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Category donut (generic, clickable) ──────────────────────────────────────

function DonutChart({
  title,
  centerLabel,
  data,
  type,
  currency,
  onSelect,
}: {
  title: string;
  centerLabel: string;
  data: CategorySpend[];
  type: "expense" | "income";
  currency: CurrencyCode;
  onSelect: (sel: CategorySelection) => void;
}) {
  const { tCategoryName } = useLang();
  const top = data.slice(0, 6);
  if (top.length === 0) return null;

  const total = top.reduce((s, c) => s + c.total, 0) || 1;
  const R = 60, C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <Card>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A", marginBottom: 16 }}>{title}</h2>
      <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <svg viewBox="0 0 160 160" width={150} height={150} style={{ flexShrink: 0 }}>
          <g transform="rotate(-90 80 80)">
            {top.map((c) => {
              const frac = c.total / total;
              const dash = frac * C;
              const seg = (
                <circle key={c.categoryId} cx={80} cy={80} r={R} fill="none" stroke={c.categoryColor} strokeWidth={20}
                  strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-offset}
                  style={{ cursor: "pointer" }} onClick={() => onSelect({ cat: c, type })} />
              );
              offset += dash;
              return seg;
            })}
          </g>
          <text x={80} y={76} textAnchor="middle" style={{ fontSize: 11, fill: "#8E8E93" }}>{centerLabel}</text>
          <text x={80} y={94} textAnchor="middle" style={{ fontSize: 15, fontWeight: 700, fill: "#0A0A0A" }}>{compact(total, currency)}</text>
        </svg>
        <div style={{ flex: 1, minWidth: 160, display: "flex", flexDirection: "column", gap: 4 }}>
          {top.map((c) => (
            <button
              key={c.categoryId}
              onClick={() => onSelect({ cat: c, type })}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px", borderRadius: 8, cursor: "pointer", background: "transparent", textAlign: "left", width: "100%" }}
              className="hover:bg-surface-2"
            >
              <span style={{ width: 10, height: 10, borderRadius: 3, background: c.categoryColor, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#0A0A0A", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tCategoryName(c.categoryId, c.categoryName, type)}</span>
              <span style={{ fontSize: 12, color: "#8E8E93" }}>{c.percentage.toFixed(0)}%</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function DashboardCharts({
  refDate,
  isCurrent,
  onSelectCategory,
}: {
  refDate: Date;
  isCurrent: boolean;
  onSelectCategory: (sel: CategorySelection) => void;
}) {
  const { receipts, incomes, currency } = useStore();
  const { t } = useLang();
  const primary = currency.primary;
  const expenseCats = getPeriodSummary(receipts, incomes, primary, refDate).byCategory;
  const incomeCats = getIncomeByCategory(incomes, primary, refDate);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 20 }}>
      <div className="grid gap-5 lg:grid-cols-2">
        {isCurrent && <TrajectoryChart currency={primary} />}
        <TrendChart currency={primary} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <DonutChart title={t("dash.byCategory")} centerLabel={t("dash.expenses")} data={expenseCats} type="expense" currency={primary} onSelect={onSelectCategory} />
        <DonutChart title={t("dash.incomeByCategory")} centerLabel={t("common.income")} data={incomeCats} type="income" currency={primary} onSelect={onSelectCategory} />
      </div>
    </div>
  );
}

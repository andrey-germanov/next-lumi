"use client";

import { useEffect } from "react";
import { useStore } from "./store";
import { useLang } from "./i18n";
import { Money, CategoryDot } from "./ui";
import { monthBounds } from "@/lib/finance";
import { convert } from "@/lib/exchangeRate";
import type { CurrencyCode } from "@/utils/currencyUtils";

export default function CategoryTransactionsModal({
  type = "expense",
  categoryId,
  categoryName,
  categoryIcon,
  categoryColor,
  refDate,
  onClose,
}: {
  type?: "expense" | "income";
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  refDate: Date;
  onClose: () => void;
}) {
  const { receipts, incomes, currency } = useStore();
  const { t, formatMonth, formatDate } = useLang();
  const primary = currency.primary;

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { from, to } = monthBounds(refDate);
  const source = type === "income"
    ? incomes.map((i) => ({ id: i.id, catId: i.category.id, date: i.date, amount: i.amount, currency: i.currency, title: i.source, note: i.description }))
    : receipts.map((r) => ({ id: r.id, catId: r.category.id, date: r.date, amount: r.total, currency: r.currency, title: r.merchant, note: r.tags?.[0] }));

  const items = source
    .filter((x) => x.catId === categoryId && new Date(x.date) >= from && new Date(x.date) <= to)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = items.reduce((s, x) => s + convert(x.amount, (x.currency || primary) as CurrencyCode, primary), 0);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(10,10,10,0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        padding: 16,
      }}
      className="sm:items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="surface rounded-3xl"
        style={{ width: "100%", maxWidth: 480, maxHeight: "85vh", display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 22px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <CategoryDot icon={categoryIcon} color={categoryColor} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A" }}>{categoryName}</p>
            <p style={{ fontSize: 12, color: "#8E8E93" }}>{formatMonth(refDate)} · {items.length}</p>
          </div>
          <Money amount={total} currency={primary} style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px", color: categoryColor }} />
          <button onClick={onClose} aria-label={t("common.close")} style={{ fontSize: 18, color: "#8E8E93", cursor: "pointer", padding: 4, marginLeft: 4 }} className="hover:text-text">✕</button>
        </div>

        {/* List */}
        <div style={{ overflowY: "auto", padding: "8px 22px 22px" }}>
          {items.length === 0 ? (
            <p style={{ fontSize: 14, color: "#8E8E93", padding: "16px 0" }}>{t("dash.noExpenses")}</p>
          ) : (
            items.map((x, i) => (
              <div key={x.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.05)" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "#0A0A0A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {x.title || categoryName}
                  </p>
                  <p style={{ fontSize: 12, color: "#8E8E93" }}>
                    {formatDate(x.date, { month: "short", day: "numeric", year: "numeric" })}
                    {x.note ? ` · ${x.note}` : ""}
                  </p>
                </div>
                <Money
                  amount={x.amount}
                  currency={(x.currency || primary) as CurrencyCode}
                  sign={type === "income"}
                  style={{ fontSize: 14, fontWeight: 600, color: type === "income" ? "#0A8F5F" : "#0A0A0A" }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

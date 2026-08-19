"use client";

import { useEffect } from "react";
import { useStore } from "./store";
import { useLang } from "./i18n";
import { Money, Avatar, CategoryDot } from "./ui";
import { monthBounds } from "@/lib/finance";
import { convert } from "@/lib/exchangeRate";
import type { CurrencyCode } from "@/utils/currencyUtils";

export default function AuthorTransactionsModal({
  authorName,
  refDate,
  onClose,
}: {
  authorName?: string;
  refDate: Date;
  onClose: () => void;
}) {
  const { receipts, currency } = useStore();
  const { t, formatMonth, formatDate, tCategoryName } = useLang();
  const primary = currency.primary;
  const label = authorName || t("dash.unassignedAuthor");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { from, to } = monthBounds(refDate);
  const items = receipts
    .filter((r) => (r.authorName ?? "") === (authorName ?? "") && new Date(r.date) >= from && new Date(r.date) <= to)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = items.reduce((s, r) => s + convert(r.total, (r.currency || primary) as CurrencyCode, primary), 0);

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
          <Avatar name={label} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A" }}>{label}</p>
            <p style={{ fontSize: 12, color: "#8E8E93" }}>{formatMonth(refDate)} · {items.length}</p>
          </div>
          <Money amount={total} currency={primary} style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px", color: "#0A0A0A" }} />
          <button onClick={onClose} aria-label={t("common.close")} style={{ fontSize: 18, color: "#8E8E93", cursor: "pointer", padding: 4, marginLeft: 4 }} className="hover:text-text">✕</button>
        </div>

        {/* List */}
        <div style={{ overflowY: "auto", padding: "8px 22px 22px" }}>
          {items.length === 0 ? (
            <p style={{ fontSize: 14, color: "#8E8E93", padding: "16px 0" }}>{t("dash.noExpenses")}</p>
          ) : (
            items.map((r, i) => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.05)" }}>
                <CategoryDot icon={r.category.icon} color={r.category.color} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "#0A0A0A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {r.merchant || tCategoryName(r.category.id, r.category.name)}
                  </p>
                  <p style={{ fontSize: 12, color: "#8E8E93" }}>
                    {formatDate(r.date, { month: "short", day: "numeric", year: "numeric" })} · {tCategoryName(r.category.id, r.category.name)}
                  </p>
                </div>
                <Money
                  amount={r.total}
                  currency={(r.currency || primary) as CurrencyCode}
                  style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

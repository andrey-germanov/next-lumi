"use client";

import { useEffect } from "react";
import { useLang } from "./i18n";
import { Money } from "./ui";
import { AppIcon } from "./AppIcon";
import type { SavingsGoal } from "@/types/web";

export default function GoalHistoryModal({ goal, onClose }: { goal: SavingsGoal; onClose: () => void }) {
  const { t, formatDate } = useLang();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const items = [...goal.contributions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 11, background: `${goal.color}1A`, flexShrink: 0 }}>
            <AppIcon name={goal.icon} color={goal.color} size={20} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A" }}>{goal.name}</p>
            <p style={{ fontSize: 12, color: "#8E8E93" }}>{t("goal.history")} · {items.length}</p>
          </div>
          <button onClick={onClose} aria-label={t("common.close")} style={{ fontSize: 18, color: "#8E8E93", cursor: "pointer", padding: 4, marginLeft: 4 }} className="hover:text-text">✕</button>
        </div>

        {/* List */}
        <div style={{ overflowY: "auto", padding: "8px 22px 22px" }}>
          {items.length === 0 ? (
            <p style={{ fontSize: 14, color: "#8E8E93", padding: "16px 0" }}>{t("goal.noContributions")}</p>
          ) : (
            items.map((c, i) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: i === 0 ? "none" : "1px solid rgba(0,0,0,0.05)" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "#0A0A0A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {c.type === "withdrawal" ? t("goal.withdrawal") : t("goal.deposit")}
                  </p>
                  <p style={{ fontSize: 12, color: "#8E8E93" }}>
                    {formatDate(c.date, { month: "short", day: "numeric", year: "numeric" })}
                    {c.note ? ` · ${c.note}` : ""}
                  </p>
                </div>
                <Money
                  amount={c.type === "withdrawal" ? -c.amount : c.amount}
                  currency={c.currency}
                  sign
                  style={{ fontSize: 14, fontWeight: 600, color: c.type === "withdrawal" ? "#0A0A0A" : "#0A8F5F" }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

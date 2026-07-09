"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useStore } from "./store";
import { useLang } from "./i18n";
import { AppIcon } from "./AppIcon";
import { computeInsight } from "@/lib/insights";

const ACCENT: Record<string, { icon: string; color: string }> = {
  "ai.headsUpTitle": { icon: "⚠️", color: "#D63B57" },
  "ai.noticeTitle": { icon: "💡", color: "#6C63FF" },
  "ai.greatTitle": { icon: "✨", color: "#0A8F5F" },
  "ai.bootstrapTitle": { icon: "🎯", color: "#6C63FF" },
};

const PROGRESS_TOTAL = 5;

export default function InsightCard() {
  const { receipts, incomes, currency } = useStore();
  const { t, tCategoryName } = useLang();

  const insight = useMemo(
    () =>
      computeInsight(receipts, incomes, currency.primary, (catId, name, isCustom) =>
        isCustom ? name : tCategoryName(catId, name),
      ),
    [receipts, incomes, currency.primary, tCategoryName],
  );

  if (!insight) return null;

  const accent = ACCENT[insight.titleKey] ?? { icon: "💡", color: "#6C63FF" };

  return (
    <div className="surface rounded-2xl" style={{ padding: 18, display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 38,
          height: 38,
          borderRadius: 11,
          background: `${accent.color}18`,
          flexShrink: 0,
        }}
      >
        <AppIcon name={accent.icon} color={accent.color} size={18} />
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.2px", marginBottom: 3 }}>
          {t(insight.titleKey)}
        </p>
        <p style={{ fontSize: 13, color: "#63636B", lineHeight: 1.5 }}>
          {t(insight.bodyKey, insight.bodyParams)}
        </p>

        {insight.progress && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 10 }}>
            {Array.from({ length: PROGRESS_TOTAL }, (_, i) => {
              const filled = i < insight.progress!.current;
              return (
                <span
                  key={i}
                  style={{
                    width: filled ? 16 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: filled ? accent.color : `${accent.color}28`,
                  }}
                />
              );
            })}
          </div>
        )}

        {insight.showCta && (
          <Link href="/forecast" style={{ display: "inline-block", marginTop: 10, fontSize: 13, fontWeight: 600, color: accent.color }}>
            {t("ai.seeAnalysis")} ›
          </Link>
        )}
      </div>
    </div>
  );
}

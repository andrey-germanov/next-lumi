"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/components/dash/store";
import { useLang } from "@/components/dash/i18n";
import { PageHeader, Card, fieldInput } from "@/components/dash/ui";
import { CURRENCIES } from "@/utils/currencyUtils";
import type { CurrencyCode } from "@/utils/currencyUtils";

const ALL_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

export default function CurrencyPage() {
  const { currency, setPrimaryCurrency, toggleSecondaryCurrency } = useStore();
  const { t } = useLang();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_CODES;
    return ALL_CODES.filter((code) => {
      const c = CURRENCIES[code];
      return code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q);
    });
  }, [query]);

  const primary = CURRENCIES[currency.primary];

  return (
    <>
      <PageHeader eyebrow={t("cur.eyebrow")} title={t("nav.currency")} subtitle={t("cur.subtitle")} />

      {/* Current selection */}
      <div className="grid gap-4 sm:grid-cols-2" style={{ marginBottom: 24 }}>
        <Card>
          <p className="label" style={{ marginBottom: 10 }}>{t("cur.primary")}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: "#6C63FF", width: 44 }}>{primary.symbol}</span>
            <div>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A" }}>{primary.code}</p>
              <p style={{ fontSize: 13, color: "#63636B" }}>{primary.name}</p>
            </div>
          </div>
        </Card>
        <Card>
          <p className="label" style={{ marginBottom: 10 }}>{t("cur.secondaryN", { n: currency.secondary.length })}</p>
          {currency.secondary.length === 0 ? (
            <p style={{ fontSize: 14, color: "#8E8E93" }}>{t("cur.noneSel")}</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {currency.secondary.map((code) => (
                <span key={code} style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", background: "#F0F0F2", borderRadius: 999, padding: "6px 12px" }}>
                  {CURRENCIES[code].symbol} {code}
                </span>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder={t("cur.searchPh")}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ ...fieldInput, marginBottom: 16 }}
      />

      {/* List */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
        {filtered.map((code) => {
          const c = CURRENCIES[code];
          const isPrimary = currency.primary === code;
          const isSecondary = currency.secondary.includes(code);
          return (
            <div
              key={code}
              className="surface rounded-2xl"
              style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, border: isPrimary ? "1.5px solid #6C63FF" : "1.5px solid transparent" }}
            >
              <span style={{ fontSize: 18, fontWeight: 700, color: "#6C63FF", width: 34, textAlign: "center", flexShrink: 0 }}>{c.symbol}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>{code}</p>
                <p style={{ fontSize: 12, color: "#8E8E93", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</p>
              </div>
              {isPrimary ? (
                <span style={{ fontSize: 11, fontWeight: 700, color: "#6C63FF", background: "rgba(108,99,255,0.1)", padding: "4px 8px", borderRadius: 999 }}>{t("cur.primaryBadge")}</span>
              ) : (
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => toggleSecondaryCurrency(code)}
                    style={{ fontSize: 12, fontWeight: 600, padding: "5px 9px", borderRadius: 8, cursor: "pointer",
                      background: isSecondary ? "#0A0A0A" : "#F0F0F2", color: isSecondary ? "#fff" : "#63636B" }}
                  >
                    {isSecondary ? "✓" : "+"}
                  </button>
                  <button
                    onClick={() => setPrimaryCurrency(code)}
                    style={{ fontSize: 12, fontWeight: 600, padding: "5px 9px", borderRadius: 8, cursor: "pointer", background: "#F0F0F2", color: "#63636B" }}
                    className="hover:text-primary"
                  >
                    {t("cur.set")}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

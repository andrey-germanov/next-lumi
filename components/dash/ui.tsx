"use client";

import { formatCurrency } from "@/utils/currencyUtils";
import type { CurrencyCode } from "@/utils/currencyUtils";
import { AppIcon } from "./AppIcon";

// ── Money ───────────────────────────────────────────────────────────────────

export function Money({
  amount,
  currency = "USD",
  sign = false,
  className,
  style,
}: {
  amount: number;
  currency?: CurrencyCode;
  sign?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const text = sign
    ? `${amount >= 0 ? "+" : "−"}${formatCurrency.withSeparator(Math.abs(amount), currency)}`
    : formatCurrency.withSeparator(amount, currency);
  return (
    <span className={className} style={style}>
      {text}
    </span>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────

export function Card({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`surface rounded-2xl ${className}`} style={{ padding: 22, ...style }}>
      {children}
    </div>
  );
}

// ── Page header ───────────────────────────────────────────────────────────────

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
      <div>
        {/* {eyebrow && <p className="label" style={{ marginBottom: 8 }}>{eyebrow}</p>} */}
        <h1 style={{ fontSize: "clamp(26px, 4vw, 34px)", fontWeight: 800, letterSpacing: "-1.2px", color: "#0A0A0A", lineHeight: 1.05 }}>
          {title}
        </h1>
        {subtitle && <p style={{ fontSize: 15, color: "#63636B", marginTop: 8, maxWidth: 560, lineHeight: 1.5 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Buttons / inputs ───────────────────────────────────────────────────────────

export function PrimaryButton({
  children,
  type = "button",
  onClick,
  disabled,
  style,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="btn-violet"
      style={{ fontSize: 14, padding: "11px 20px", opacity: disabled ? 0.6 : 1, cursor: disabled ? "default" : "pointer", ...style }}
    >
      {children}
    </button>
  );
}

export const fieldLabel: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#0A0A0A",
  marginBottom: 8,
};

export const fieldInput: React.CSSProperties = {
  width: "100%",
  fontSize: 15,
  color: "#0A0A0A",
  background: "#F7F7F8",
  border: "1px solid rgba(0,0,0,0.07)",
  borderRadius: 12,
  padding: "12px 14px",
  outline: "none",
};

export function CategoryDot({ icon, color, size = 40 }: { icon: string; color: string; size?: number }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: size / 3,
        background: `${color}1A`,
        flexShrink: 0,
      }}
    >
      <AppIcon name={icon} color={color} size={Math.round(size * 0.55)} />
    </span>
  );
}

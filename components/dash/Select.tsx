"use client";

import { useEffect, useRef, useState } from "react";
import { AppIcon } from "./AppIcon";

export interface SelectOption {
  value: string;
  label: string;
  icon?: string; // emoji / app-icon name
  color?: string;
  disabled?: boolean;
  hint?: string; // small trailing note (e.g. "has budget")
}

/**
 * Shared styled dropdown used across the app in place of native <select>.
 * Supports optional per-option icons (rendered via AppIcon) and colors.
 */
export function Select({
  value,
  onChange,
  options,
  placeholder,
  fullWidth = true,
  direction = "down",
  style,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  direction?: "down" | "up";
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} style={{ position: "relative", width: fullWidth ? "100%" : "auto", ...style }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 15,
          color: selected ? "#0A0A0A" : "#8E8E93",
          background: "#F7F7F8",
          border: `1px solid ${open ? "#6C63FF" : "rgba(0,0,0,0.07)"}`,
          borderRadius: 12,
          padding: "12px 14px",
          cursor: "pointer",
          textAlign: "left",
          boxShadow: open ? "0 0 0 3px rgba(108,99,255,0.12)" : "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
      >
        {selected?.icon && (
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 7, background: `${selected.color ?? "#6C63FF"}1A`, flexShrink: 0 }}>
            <AppIcon name={selected.icon} color={selected.color ?? "#6C63FF"} size={14} />
          </span>
        )}
        <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {selected ? selected.label : placeholder ?? ""}
        </span>
        <span style={{ flexShrink: 0, color: "#8E8E93", fontSize: 12, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>▾</span>
      </button>

      {open && (
        <div
          className="surface"
          style={{
            position: "absolute",
            ...(direction === "up" ? { bottom: "calc(100% + 6px)" } : { top: "calc(100% + 6px)" }),
            left: 0,
            right: 0,
            zIndex: 50,
            borderRadius: 12,
            padding: 6,
            maxHeight: 280,
            overflowY: "auto",
          }}
        >
          {options.map((o) => {
            const isSel = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                disabled={o.disabled}
                onClick={() => {
                  if (o.disabled) return;
                  onChange(o.value);
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 14,
                  color: o.disabled ? "#C7C7CC" : "#0A0A0A",
                  background: isSel ? "rgba(108,99,255,0.08)" : "transparent",
                  borderRadius: 8,
                  padding: "9px 10px",
                  cursor: o.disabled ? "default" : "pointer",
                  textAlign: "left",
                }}
                className={o.disabled ? undefined : "hover:bg-surface-2"}
              >
                {o.icon && (
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 7, background: `${o.color ?? "#6C63FF"}1A`, flexShrink: 0 }}>
                    <AppIcon name={o.icon} color={o.color ?? "#6C63FF"} size={14} />
                  </span>
                )}
                <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: isSel ? 600 : 500 }}>{o.label}</span>
                {o.hint && <span style={{ fontSize: 11, color: "#8E8E93" }}>{o.hint}</span>}
                {isSel && <span style={{ color: "#6C63FF", fontSize: 13 }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

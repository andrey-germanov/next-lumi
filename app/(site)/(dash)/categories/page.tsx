"use client";

import { useState } from "react";
import { useStore } from "@/components/dash/store";
import { useLang } from "@/components/dash/i18n";
import { PageHeader, Card, PrimaryButton, CategoryDot, fieldLabel, fieldInput } from "@/components/dash/ui";

const EMOJI_CHOICES = ["📦", "🍕", "🎮", "🏋️", "🎨", "☕", "💅", "🎁", "🎵", "📷", "💎", "🔥"];
const COLOR_CHOICES = ["#6C63FF", "#34D399", "#F59E0B", "#F472B6", "#0EA5E9", "#F87171", "#A78BFA", "#FBBF24"];

const LIMIT = 10;

export default function CategoriesPage() {
  const { expenseCategories, incomeCategories, addExpenseCategory, deleteExpenseCategory } = useStore();
  const { t, tCategoryName } = useLang();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(EMOJI_CHOICES[0]);
  const [color, setColor] = useState(COLOR_CHOICES[0]);
  const [showAllExpense, setShowAllExpense] = useState(false);
  const [showAllIncome, setShowAllIncome] = useState(false);

  const visibleExpense = showAllExpense ? expenseCategories : expenseCategories.slice(0, LIMIT);
  const visibleIncome = showAllIncome ? incomeCategories : incomeCategories.slice(0, LIMIT);

  function handleDelete(id: string) {
    if (confirm(t("cat.deleteConfirm"))) deleteExpenseCategory(id);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addExpenseCategory({ name: name.trim(), icon, color });
    setName("");
    setOpen(false);
  }

  return (
    <>
      <PageHeader
        eyebrow={t("cat.eyebrow")}
        title={t("nav.categories")}
        subtitle={t("cat.subtitle")}
        action={<PrimaryButton onClick={() => setOpen((v) => !v)}>{open ? t("common.close") : t("cat.new")}</PrimaryButton>}
      />

      {open && (
        <Card style={{ marginBottom: 24, maxWidth: 560 }}>
          <form onSubmit={handleCreate}>
            <label style={fieldLabel}>{t("common.name")}</label>
            <input type="text" required placeholder={t("cat.namePh")} value={name} onChange={(e) => setName(e.target.value)} style={{ ...fieldInput, marginBottom: 18 }} />

            <label style={fieldLabel}>{t("common.icon")}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
              {EMOJI_CHOICES.map((e) => (
                <button key={e} type="button" onClick={() => setIcon(e)}
                  style={{ fontSize: 20, width: 42, height: 42, borderRadius: 12, cursor: "pointer",
                    background: icon === e ? "rgba(108,99,255,0.1)" : "#F7F7F8", border: icon === e ? "1.5px solid #6C63FF" : "1.5px solid transparent" }}>
                  {e}
                </button>
              ))}
            </div>

            <label style={fieldLabel}>{t("common.color")}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
              {COLOR_CHOICES.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  style={{ width: 34, height: 34, borderRadius: 999, cursor: "pointer", background: c, border: color === c ? "3px solid rgba(0,0,0,0.15)" : "3px solid transparent" }} />
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <CategoryDot icon={icon} color={color} />
              <span style={{ fontSize: 14, color: "#63636B" }}>{t("cat.preview")} <strong style={{ color: "#0A0A0A" }}>{name || t("cat.previewName")}</strong></span>
            </div>

            <PrimaryButton type="submit">{t("cat.create")}</PrimaryButton>
          </form>
        </Card>
      )}

      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A", marginBottom: 14 }}>{t("cat.expenseCats")}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
        {visibleExpense.map((c) => (
          <div key={c.id} className="surface rounded-2xl" style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <CategoryDot icon={c.icon} color={c.color} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tCategoryName(c.id, c.name)}</p>
              {c.isCustom && <p style={{ fontSize: 11, color: "#6C63FF", fontWeight: 500 }}>{t("cat.custom")}</p>}
            </div>
            {c.isCustom && (
              <button onClick={() => handleDelete(c.id)} title={t("common.delete")} style={{ fontSize: 13, color: "#8E8E93", cursor: "pointer", padding: 2 }} className="hover:text-danger">✕</button>
            )}
          </div>
        ))}
      </div>
      {expenseCategories.length > LIMIT && (
        <button onClick={() => setShowAllExpense((v) => !v)} style={{ marginTop: 14, fontSize: 13, fontWeight: 600, color: "#6C63FF", cursor: "pointer" }}>
          {showAllExpense ? t("common.showLess") : t("common.showMore", { n: expenseCategories.length })}
        </button>
      )}

      <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A", margin: "36px 0 14px" }}>{t("cat.incomeCats")}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
        {visibleIncome.map((c) => (
          <div key={c.id} className="surface rounded-2xl" style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <CategoryDot icon={c.icon} color={c.color} />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tCategoryName(c.id, c.name, "income")}</p>
              {c.isTaxable && <p style={{ fontSize: 11, color: "#8E8E93" }}>{t("cat.taxable")}</p>}
            </div>
          </div>
        ))}
      </div>
      {incomeCategories.length > LIMIT && (
        <button onClick={() => setShowAllIncome((v) => !v)} style={{ marginTop: 14, fontSize: 13, fontWeight: 600, color: "#6C63FF", cursor: "pointer" }}>
          {showAllIncome ? t("common.showLess") : t("common.showMore", { n: incomeCategories.length })}
        </button>
      )}
    </>
  );
}

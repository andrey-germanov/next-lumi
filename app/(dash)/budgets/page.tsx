"use client";

import { useState } from "react";
import { useStore } from "@/components/dash/store";
import { useLang } from "@/components/dash/i18n";
import { PageHeader, Card, Money, PrimaryButton, CategoryDot, fieldLabel, fieldInput } from "@/components/dash/ui";
import { Select } from "@/components/dash/Select";
import { getBudgetProgress } from "@/lib/finance";
import type { BudgetPeriod } from "@/types/web";
import type { CurrencyCode } from "@/utils/currencyUtils";

export default function BudgetsPage() {
  const { budgets, receipts, expenseCategories, currency, addBudget, updateBudget, deleteBudget } = useStore();
  const { t, tCategoryName } = useLang();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editPeriod, setEditPeriod] = useState<BudgetPeriod>("monthly");

  function startEdit(id: string, amount: number, period: BudgetPeriod) {
    setEditId(id);
    setEditAmount(String(amount));
    setEditPeriod(period);
  }
  function saveEdit() {
    const value = parseFloat(editAmount);
    if (editId && value > 0) updateBudget(editId, { amount: value, period: editPeriod });
    setEditId(null);
  }

  const usedCategoryIds = new Set(budgets.map((b) => b.categoryId));
  const available = expenseCategories.filter((c) => !usedCategoryIds.has(c.id));

  const [categoryId, setCategoryId] = useState(available[0]?.id ?? expenseCategories[0].id);
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<BudgetPeriod>("monthly");
  const cur: CurrencyCode = currency.primary;

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) return;
    addBudget({ categoryId, amount: value, period, currency: cur });
    setAmount("");
    setOpen(false);
  }

  const cat = (id: string) => expenseCategories.find((c) => c.id === id);
  const periodLabel = (p: BudgetPeriod) => t(p === "weekly" ? "common.weekly" : p === "yearly" ? "common.yearly" : "common.monthly");
  const periodOptions = [
    { value: "monthly", label: t("common.monthly") },
    { value: "weekly", label: t("common.weekly") },
    { value: "yearly", label: t("common.yearly") },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t("bud.eyebrow")}
        title={t("nav.budgets")}
        subtitle={t("bud.subtitle")}
        action={<PrimaryButton onClick={() => setOpen((v) => !v)}>{open ? t("common.close") : t("bud.new")}</PrimaryButton>}
      />

      {open && (
        <Card style={{ marginBottom: 24, maxWidth: 640 }}>
          <form onSubmit={handleCreate}>
            <div className="grid gap-3 items-end sm:grid-cols-[1.4fr_1fr_1fr]">
              <div>
                <label style={fieldLabel}>{t("common.category")}</label>
                <Select
                  value={categoryId}
                  onChange={setCategoryId}
                  options={expenseCategories.map((c) => ({
                    value: c.id,
                    label: tCategoryName(c.id, c.name),
                    icon: c.icon,
                    color: c.color,
                    disabled: usedCategoryIds.has(c.id),
                    hint: usedCategoryIds.has(c.id) ? t("bud.hasBudget") : undefined,
                  }))}
                />
              </div>
              <div>
                <label style={fieldLabel}>{t("bud.amountCur", { cur })}</label>
                <input type="number" step="0.01" min="0" required placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} style={fieldInput} />
              </div>
              <div>
                <label style={fieldLabel}>{t("common.period")}</label>
                <Select value={period} onChange={(v) => setPeriod(v as BudgetPeriod)} options={periodOptions} />
              </div>
            </div>
            <PrimaryButton type="submit" style={{ marginTop: 18 }}>{t("bud.create")}</PrimaryButton>
          </form>
        </Card>
      )}

      {budgets.length === 0 ? (
        <Card><p style={{ fontSize: 14, color: "#8E8E93" }}>{t("bud.none")}</p></Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {budgets.map((b) => {
            const p = getBudgetProgress(b, receipts);
            const c = cat(b.categoryId);
            const barColor = p.isExceeded ? "#D63B57" : p.percentUsed > 90 ? "#C9780A" : c?.color ?? "#6C63FF";
            return (
              <Card key={b.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <CategoryDot icon={c?.icon ?? "📦"} color={c?.color ?? "#8E8E93"} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#0A0A0A" }}>{tCategoryName(b.categoryId, c?.name ?? b.categoryId)}</p>
                    <p style={{ fontSize: 12, color: "#8E8E93" }}>{periodLabel(b.period)}</p>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => startEdit(b.id, b.amount, b.period)} title={t("common.edit")} style={{ fontSize: 13, color: "#8E8E93", cursor: "pointer", padding: 4 }} className="hover:text-primary">✎</button>
                    <button onClick={() => deleteBudget(b.id)} title={t("common.delete")} style={{ fontSize: 13, color: "#8E8E93", cursor: "pointer", padding: 4 }} className="hover:text-danger">✕</button>
                  </div>
                </div>

                {editId === b.id ? (
                  <div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input type="number" step="0.01" min="0" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} autoFocus style={{ ...fieldInput, padding: "9px 12px", fontSize: 14 }} />
                      <Select value={editPeriod} onChange={(v) => setEditPeriod(v as BudgetPeriod)} fullWidth={false} style={{ width: 140 }} options={periodOptions} />
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <PrimaryButton onClick={saveEdit} style={{ flex: 1, padding: "9px" }}>{t("common.save")}</PrimaryButton>
                      <button onClick={() => setEditId(null)} style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#63636B", background: "#F0F0F2", borderRadius: 12, cursor: "pointer" }}>{t("common.cancel")}</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                      <Money amount={p.spent} currency={b.currency ?? cur} style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: barColor }} />
                      <span style={{ fontSize: 13, color: "#63636B" }}>{t("common.of")} <Money amount={b.amount} currency={b.currency ?? cur} /></span>
                    </div>

                    <div style={{ height: 8, background: "#F0F0F2", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(p.percentUsed, 100)}%`, background: barColor, borderRadius: 999, transition: "width 0.3s" }} />
                    </div>

                    <p style={{ fontSize: 12, marginTop: 8, color: p.isExceeded ? "#D63B57" : "#63636B" }}>
                      {p.isExceeded
                        ? t("bud.overBy", { amt: Math.abs(p.remaining).toFixed(2) })
                        : t("bud.leftUsed", { left: p.remaining.toFixed(2), cur: b.currency ?? cur, pct: p.percentUsed.toFixed(0) })}
                    </p>
                  </>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

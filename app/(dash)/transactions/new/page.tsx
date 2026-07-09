"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/dash/store";
import { useLang } from "@/components/dash/i18n";
import { PageHeader, Card, PrimaryButton, fieldLabel, fieldInput } from "@/components/dash/ui";
import { Select } from "@/components/dash/Select";
import { toISODate } from "@/lib/finance";
import { CURRENCIES } from "@/utils/currencyUtils";
import type { CurrencyCode } from "@/utils/currencyUtils";
import type { TransactionType } from "@/types/web";

export default function NewTransactionPage() {
  const router = useRouter();
  const { expenseCategories, incomeCategories, currency, addExpense, addIncome } = useStore();
  const { t, tCategoryName } = useLang();

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(expenseCategories[0].id);
  const [date, setDate] = useState(toISODate(new Date()));
  const [cur, setCur] = useState<CurrencyCode>(currency.primary);
  const [note, setNote] = useState("");

  const categories = type === "expense" ? expenseCategories : incomeCategories;
  const currencyOptions: CurrencyCode[] = [currency.primary, ...currency.secondary];

  function switchType(nextType: TransactionType) {
    setType(nextType);
    setCategoryId((nextType === "expense" ? expenseCategories : incomeCategories)[0].id);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) return;
    const isoDate = new Date(date + "T12:00:00").toISOString();
    const cat = categories.find((c) => c.id === categoryId)!;
    const fallbackTitle = tCategoryName(cat.id, cat.name, type === "income" ? "income" : "expense");

    if (type === "expense") {
      addExpense({ merchant: title || fallbackTitle, total: value, categoryId, date: isoDate, currency: cur, note: note || undefined });
    } else {
      addIncome({ source: title || fallbackTitle, amount: value, categoryId, date: isoDate, currency: cur, description: note || undefined });
    }
    router.push("/dashboard");
  }

  const isExpense = type === "expense";

  return (
    <>
      <PageHeader eyebrow={t("add.eyebrow")} title={t("add.title")} subtitle={t("add.subtitle")} />

      <div style={{ maxWidth: 560 }}>
        {/* Type toggle */}
        <div style={{ display: "flex", gap: 8, background: "#F0F0F2", borderRadius: 14, padding: 5, marginBottom: 22 }}>
          {(["expense", "income"] as TransactionType[]).map((tt) => (
            <button
              key={tt}
              type="button"
              onClick={() => switchType(tt)}
              style={{
                flex: 1,
                fontSize: 14,
                fontWeight: 600,
                padding: "10px",
                borderRadius: 10,
                cursor: "pointer",
                background: type === tt ? "#fff" : "transparent",
                color: type === tt ? (tt === "expense" ? "#D63B57" : "#0A8F5F") : "#63636B",
                boxShadow: type === tt ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {t(tt === "expense" ? "common.expense" : "common.income")}
            </button>
          ))}
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            {/* Amount + currency */}
            <label style={fieldLabel}>{t("common.amount")}</label>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ ...fieldInput, fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}
              />
              <Select
                value={cur}
                onChange={(v) => setCur(v as CurrencyCode)}
                fullWidth={false}
                style={{ width: 130 }}
                options={currencyOptions.map((c) => ({ value: c, label: `${CURRENCIES[c].symbol} ${c}` }))}
              />
            </div>

            {/* Title */}
            <label style={fieldLabel}>{isExpense ? t("add.merchant") : t("add.source")}</label>
            <input
              type="text"
              placeholder={isExpense ? t("add.merchantPh") : t("add.sourcePh")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ ...fieldInput, marginBottom: 20 }}
            />

            {/* Category */}
            <label style={fieldLabel}>{t("common.category")}</label>
            <div style={{ marginBottom: 20 }}>
              <Select
                value={categoryId}
                onChange={setCategoryId}
                options={categories.map((c) => ({
                  value: c.id,
                  label: tCategoryName(c.id, c.name, isExpense ? "expense" : "income"),
                  icon: c.icon,
                  color: c.color,
                }))}
              />
            </div>

            {/* Date + note */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              <div>
                <label style={fieldLabel}>{t("common.date")}</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={fieldInput} />
              </div>
              <div>
                <label style={fieldLabel}>{t("add.noteOpt")}</label>
                <input type="text" placeholder={t("add.notePh")} value={note} onChange={(e) => setNote(e.target.value)} style={fieldInput} />
              </div>
            </div>

            <PrimaryButton type="submit" style={{ width: "100%", padding: "13px", fontSize: 15 }}>
              {isExpense ? t("add.saveExpense") : t("add.saveIncome")}
            </PrimaryButton>
          </form>
        </Card>
      </div>
    </>
  );
}

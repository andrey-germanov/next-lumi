"use client";

import { useState } from "react";
import { useLang } from "@/components/dash/i18n";
import { INTL_LOCALE } from "@/lib/i18n";
import { Card, fieldInput, fieldLabel } from "@/components/dash/ui";

// ── Shared helpers ───────────────────────────────────────────────────────────

function useCalc() {
  const { t, locale } = useLang();
  const nf = new Intl.NumberFormat(INTL_LOCALE[locale] ?? "en-US");
  const fmt = (n: number) => (isFinite(n) ? nf.format(Math.round(n)) : "—");
  const dur = (months: number) => {
    if (!isFinite(months) || months < 0) return "—";
    const y = Math.floor(months / 12);
    const m = Math.round(months % 12);
    const yr = t("calc.years_unit");
    const mo = t("calc.months_unit");
    if (y === 0) return `${m} ${mo}`;
    if (m === 0) return `${y} ${yr}`;
    return `${y} ${yr} ${m} ${mo}`;
  };
  return { t, fmt, dur };
}

function Field({ label, value, onChange, step = "any", min = "0" }: { label: string; value: number; onChange: (n: number) => void; step?: string; min?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={fieldLabel}>{label}</label>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        min={min}
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        style={fieldInput}
      />
    </div>
  );
}

function ResultHero({ label, value, color = "#6C63FF" }: { label: string; value: string; color?: string }) {
  return (
    <div className="surface-dark rounded-2xl" style={{ padding: 22, marginBottom: 12 }}>
      <p className="label" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, letterSpacing: "-1.5px", color: "#fff", lineHeight: 1 }}>{value}</p>
      <span style={{ display: "none" }}>{color}</span>
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
      <span style={{ fontSize: 14, color: "#63636B" }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A" }}>{value}</span>
    </div>
  );
}

function Layout({ inputs, results }: { inputs: React.ReactNode; results: React.ReactNode }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card>{inputs}</Card>
      <div>{results}</div>
    </div>
  );
}

function Segmented<T extends string | number>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div style={{ display: "flex", gap: 6, background: "#F0F0F2", borderRadius: 12, padding: 4 }}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          style={{ flex: 1, fontSize: 13, fontWeight: 600, padding: "8px 6px", borderRadius: 9, cursor: "pointer", whiteSpace: "nowrap", background: value === o.value ? "#fff" : "transparent", color: value === o.value ? "#0A0A0A" : "#63636B", boxShadow: value === o.value ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** A budget bucket with target and optional actual-vs-target comparison. */
function Bucket({ label, target, actual, invert, fmt, t }: { label: string; target: number; actual: number; invert: boolean; fmt: (n: number) => string; t: (k: string, v?: Record<string, string | number>) => string }) {
  let badge: { text: string; color: string } | null = null;
  if (actual > 0) {
    const d = actual - target;
    if (Math.abs(d) < Math.max(target * 0.02, 1)) badge = { text: t("calc.onTrack"), color: "#0A8F5F" };
    else if (d > 0) badge = { text: t("calc.over", { amt: fmt(d) }), color: invert ? "#0A8F5F" : "#D63B57" };
    else badge = { text: t("calc.under", { amt: fmt(-d) }), color: invert ? "#D63B57" : "#0A8F5F" };
  }
  return (
    <div style={{ padding: "12px 0", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 14, color: "#63636B" }}>{label}</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A" }}>{fmt(target)}</span>
      </div>
      {badge && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: badge.color }}>{badge.text}</span>
        </div>
      )}
    </div>
  );
}

// ── Compound interest ────────────────────────────────────────────────────────

function CompoundInterest() {
  const { t, fmt } = useCalc();
  const [principal, setPrincipal] = useState(1000);
  const [monthly, setMonthly] = useState(200);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);

  const n = years * 12;
  const r = rate / 100 / 12;
  const fv = r === 0 ? principal + monthly * n : principal * (1 + r) ** n + monthly * (((1 + r) ** n - 1) / r);
  const contributed = principal + monthly * n;
  const interest = fv - contributed;

  return (
    <Layout
      inputs={
        <>
          <Field label={t("calc.principal")} value={principal} onChange={setPrincipal} />
          <Field label={t("calc.monthly")} value={monthly} onChange={setMonthly} />
          <Field label={t("calc.rate")} value={rate} onChange={setRate} />
          <Field label={t("calc.years")} value={years} onChange={setYears} step="1" />
        </>
      }
      results={
        <>
          <ResultHero label={t("calc.futureValue")} value={fmt(fv)} />
          <ResultRow label={t("calc.contributed")} value={fmt(contributed)} />
          <ResultRow label={t("calc.interestEarned")} value={fmt(interest)} />
        </>
      }
    />
  );
}

// ── 50/30/20 budget ──────────────────────────────────────────────────────────

function Budget() {
  const { t, fmt } = useCalc();
  const [income, setIncome] = useState(3000);
  const [compare, setCompare] = useState(false);
  const [aNeeds, setANeeds] = useState(0);
  const [aWants, setAWants] = useState(0);
  const [aSav, setASav] = useState(0);

  return (
    <Layout
      inputs={
        <>
          <Field label={t("calc.income")} value={income} onChange={setIncome} />
          <button type="button" onClick={() => setCompare((v) => !v)} style={{ fontSize: 13, fontWeight: 600, color: "#6C63FF", cursor: "pointer", marginBottom: compare ? 16 : 0 }}>
            {compare ? "− " : "+ "}{t("calc.compareTitle")}
          </button>
          {compare && (
            <>
              <p style={{ fontSize: 12, color: "#8E8E93", lineHeight: 1.5, marginBottom: 14 }}>{t("calc.compareHint")}</p>
              <Field label={t("calc.needs")} value={aNeeds} onChange={setANeeds} />
              <Field label={t("calc.wants")} value={aWants} onChange={setAWants} />
              <Field label={t("calc.savingsCat")} value={aSav} onChange={setASav} />
            </>
          )}
        </>
      }
      results={
        <Card>
          <Bucket label={t("calc.needs")} target={income * 0.5} actual={compare ? aNeeds : 0} invert={false} fmt={fmt} t={t} />
          <Bucket label={t("calc.wants")} target={income * 0.3} actual={compare ? aWants : 0} invert={false} fmt={fmt} t={t} />
          <Bucket label={t("calc.savingsCat")} target={income * 0.2} actual={compare ? aSav : 0} invert fmt={fmt} t={t} />
        </Card>
      }
    />
  );
}

// ── Emergency fund ───────────────────────────────────────────────────────────

function EmergencyFund() {
  const { t, fmt, dur } = useCalc();
  const [essentials, setEssentials] = useState(1500);
  const [buffer, setBuffer] = useState(6);
  const [saved, setSaved] = useState(2000);
  const [monthly, setMonthly] = useState(300);

  const target = essentials * buffer;
  const remaining = Math.max(target - saved, 0);
  const pct = target > 0 ? Math.min((saved / target) * 100, 100) : 0;
  const months = remaining <= 0 ? 0 : monthly > 0 ? Math.ceil(remaining / monthly) : Infinity;

  return (
    <Layout
      inputs={
        <>
          <Field label={t("calc.essentials")} value={essentials} onChange={setEssentials} />
          <div style={{ marginBottom: 16 }}>
            <label style={fieldLabel}>{t("calc.buffer")}</label>
            <Segmented options={[3, 6, 9, 12].map((n) => ({ value: n, label: String(n) }))} value={buffer} onChange={setBuffer} />
          </div>
          <Field label={t("calc.saved")} value={saved} onChange={setSaved} />
          <Field label={t("calc.monthly")} value={monthly} onChange={setMonthly} />
        </>
      }
      results={
        <>
          <ResultHero label={t("calc.targetFund")} value={fmt(target)} color="#F59E0B" />
          <div style={{ margin: "4px 0 10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#8E8E93", marginBottom: 5 }}>
              <span>{t("calc.fundedPct")}</span>
              <span>{pct.toFixed(0)}%</span>
            </div>
            <div style={{ height: 8, background: "#F0F0F2", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: "#F59E0B", borderRadius: 999 }} />
            </div>
          </div>
          <ResultRow label={t("calc.stillToSave")} value={fmt(remaining)} />
          <ResultRow label={t("calc.timeToFund")} value={remaining <= 0 ? t("calc.done") : dur(months)} />
        </>
      }
    />
  );
}

// ── Savings goal ─────────────────────────────────────────────────────────────

function SavingsGoal() {
  const { t, fmt, dur } = useCalc();
  const [mode, setMode] = useState<"amount" | "date">("amount");
  const [goal, setGoal] = useState(5000);
  const [saved, setSaved] = useState(1000);
  const [monthly, setMonthly] = useState(300);
  const [deadline, setDeadline] = useState(12);
  const [ret, setRet] = useState(0);

  const remaining = Math.max(goal - saved, 0);
  const reached = remaining <= 0;
  const i = ret / 100 / 12;

  // Mode A: months to reach goal at a fixed monthly contribution (with compounding).
  let months = Infinity;
  if (!reached) {
    if (monthly <= 0) months = Infinity;
    else if (i === 0) months = Math.ceil(remaining / monthly);
    else {
      for (let n = 1; n <= 1200; n++) {
        const fv = saved * (1 + i) ** n + monthly * (((1 + i) ** n - 1) / i);
        if (fv >= goal) { months = n; break; }
      }
    }
  }
  const contribA = isFinite(months) ? monthly * months : 0;
  const interestA = isFinite(months) ? goal - saved - contribA : 0;

  // Mode B: required monthly to hit the goal by a deadline (with compounding).
  const n = Math.max(deadline, 1);
  let required = 0;
  if (!reached) {
    if (i === 0) required = remaining / n;
    else required = (goal - saved * (1 + i) ** n) / (((1 + i) ** n - 1) / i);
    required = Math.max(required, 0);
  }

  return (
    <Layout
      inputs={
        <>
          <div style={{ marginBottom: 16 }}>
            <Segmented
              options={[{ value: "amount" as const, label: t("calc.modeByAmount") }, { value: "date" as const, label: t("calc.modeByDate") }]}
              value={mode}
              onChange={setMode}
            />
          </div>
          <Field label={t("calc.goalAmount")} value={goal} onChange={setGoal} />
          <Field label={t("calc.saved")} value={saved} onChange={setSaved} />
          {mode === "amount" ? (
            <Field label={t("calc.monthly")} value={monthly} onChange={setMonthly} />
          ) : (
            <Field label={t("calc.deadlineMonths")} value={deadline} onChange={setDeadline} step="1" min="1" />
          )}
          <Field label={t("calc.returnOptional")} value={ret} onChange={setRet} />
        </>
      }
      results={
        reached ? (
          <div className="surface rounded-2xl" style={{ padding: 22 }}>
            <p style={{ fontSize: 15, color: "#0A8F5F", fontWeight: 600 }}>{t("calc.reached")}</p>
          </div>
        ) : mode === "amount" ? (
          <>
            <ResultHero label={t("calc.monthsToGoal")} value={dur(months)} color="#0EA5E9" />
            <ResultRow label={t("calc.stillToSave")} value={fmt(remaining)} />
            {ret > 0 && isFinite(months) && <ResultRow label={t("calc.interestEarned")} value={fmt(Math.max(interestA, 0))} />}
          </>
        ) : (
          <>
            <ResultHero label={t("calc.requiredMonthly")} value={fmt(required)} color="#0EA5E9" />
            <ResultRow label={t("calc.stillToSave")} value={fmt(remaining)} />
          </>
        )
      }
    />
  );
}

// ── Debt payoff ──────────────────────────────────────────────────────────────

function DebtPayoff() {
  const { t, fmt, dur } = useCalc();
  const [balance, setBalance] = useState(5000);
  const [apr, setApr] = useState(19);
  const [payment, setPayment] = useState(200);

  const r = apr / 100 / 12;
  let months = Infinity;
  let totalInterest = Infinity;
  if (r === 0 && payment > 0) {
    months = Math.ceil(balance / payment);
    totalInterest = 0;
  } else if (payment > balance * r) {
    months = Math.ceil(Math.log(payment / (payment - balance * r)) / Math.log(1 + r));
    totalInterest = payment * months - balance;
  }
  const payable = isFinite(months);

  return (
    <Layout
      inputs={
        <>
          <Field label={t("calc.balance")} value={balance} onChange={setBalance} />
          <Field label={t("calc.apr")} value={apr} onChange={setApr} />
          <Field label={t("calc.payment")} value={payment} onChange={setPayment} />
        </>
      }
      results={
        payable ? (
          <>
            <ResultHero label={t("calc.timeToPayoff")} value={dur(months)} color="#F87171" />
            <ResultRow label={t("calc.totalInterestPaid")} value={fmt(totalInterest)} />
          </>
        ) : (
          <div className="surface rounded-2xl" style={{ padding: 22 }}>
            <p style={{ fontSize: 14, color: "#D63B57", fontWeight: 500 }}>{t("calc.never")}</p>
          </div>
        )
      }
    />
  );
}

// ── FIRE ─────────────────────────────────────────────────────────────────────

function Fire() {
  const { t, fmt, dur } = useCalc();
  const [annualExpenses, setAnnualExpenses] = useState(40000);
  const [saved, setSaved] = useState(50000);
  const [annualSavings, setAnnualSavings] = useState(20000);
  const [ret, setRet] = useState(5);

  const fireNumber = annualExpenses * 25;
  const r = ret / 100;
  let balance = saved;
  let years = 0;
  while (balance < fireNumber && years < 100) {
    balance = balance * (1 + r) + annualSavings;
    years++;
  }
  const months = years >= 100 && balance < fireNumber ? Infinity : years * 12;

  return (
    <Layout
      inputs={
        <>
          <Field label={t("calc.annualExpenses")} value={annualExpenses} onChange={setAnnualExpenses} />
          <Field label={t("calc.saved")} value={saved} onChange={setSaved} />
          <Field label={t("calc.annualSavings")} value={annualSavings} onChange={setAnnualSavings} />
          <Field label={t("calc.returnRate")} value={ret} onChange={setRet} />
        </>
      }
      results={
        <>
          <ResultHero label={t("calc.fireNumber")} value={fmt(fireNumber)} color="#A78BFA" />
          <ResultRow label={t("calc.yearsToFire")} value={dur(months)} />
        </>
      }
    />
  );
}

// ── Subscription cost ────────────────────────────────────────────────────────

interface SubRow {
  id: number;
  name: string;
  price: number;
  yearly: boolean;
}

function SubscriptionCost() {
  const { t, fmt } = useCalc();
  const [rows, setRows] = useState<SubRow[]>([
    { id: 1, name: "", price: 12.99, yearly: false },
    { id: 2, name: "", price: 4.99, yearly: false },
    { id: 3, name: "", price: 59.99, yearly: true },
  ]);

  const update = (id: number, patch: Partial<SubRow>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: number) => setRows((rs) => rs.filter((r) => r.id !== id));
  const add = () => setRows((rs) => [...rs, { id: Math.max(0, ...rs.map((r) => r.id)) + 1, name: "", price: 0, yearly: false }]);

  const perYear = rows.reduce((sum, r) => sum + (r.yearly ? r.price : r.price * 12), 0);
  const perMonth = perYear / 12;
  const perDay = perYear / 365;
  // FV of investing the monthly amount at 7% annual for 5 years.
  const r = 0.07 / 12;
  const n = 60;
  const invested = perMonth * (((1 + r) ** n - 1) / r);

  return (
    <Layout
      inputs={
        <>
          {rows.map((row, i) => (
            <div key={row.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
              <input
                type="text"
                placeholder={`${t("calc.subs.name")} ${i + 1}`}
                value={row.name}
                onChange={(e) => update(row.id, { name: e.target.value })}
                style={{ ...fieldInput, flex: 2, minWidth: 0 }}
              />
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                placeholder={t("calc.subs.price")}
                value={Number.isFinite(row.price) && row.price !== 0 ? row.price : ""}
                onChange={(e) => update(row.id, { price: parseFloat(e.target.value) || 0 })}
                style={{ ...fieldInput, flex: 1, minWidth: 72 }}
              />
              <button
                type="button"
                onClick={() => update(row.id, { yearly: !row.yearly })}
                style={{ flexShrink: 0, fontSize: 12, fontWeight: 600, padding: "8px 10px", borderRadius: 9, cursor: "pointer", background: "#F0F0F2", color: "#0A0A0A", whiteSpace: "nowrap" }}
              >
                {row.yearly ? t("calc.subs.perYear") : t("calc.subs.perMonth")}
              </button>
              <button
                type="button"
                aria-label="Remove"
                onClick={() => remove(row.id)}
                style={{ flexShrink: 0, fontSize: 16, color: "#8E8E93", cursor: "pointer", padding: "4px 6px", background: "transparent" }}
              >
                ×
              </button>
            </div>
          ))}
          <button type="button" onClick={add} style={{ fontSize: 13, fontWeight: 600, color: "#6C63FF", cursor: "pointer", background: "transparent", marginTop: 4 }}>
            {t("calc.subs.add")}
          </button>
        </>
      }
      results={
        <>
          <ResultHero label={t("calc.subs.totalYear")} value={fmt(perYear)} color="#EC4899" />
          <ResultRow label={t("calc.subs.totalMonth")} value={fmt(perMonth)} />
          <ResultRow label={t("calc.subs.perDay")} value={perDay >= 1 ? fmt(perDay) : perDay.toFixed(2)} />
          <ResultRow label={t("calc.subs.invested")} value={fmt(invested)} />
        </>
      }
    />
  );
}

export const CALCULATORS: Record<string, React.ComponentType> = {
  "compound-interest-calculator": CompoundInterest,
  "50-30-20-budget-calculator": Budget,
  "emergency-fund-calculator": EmergencyFund,
  "savings-goal-calculator": SavingsGoal,
  "debt-payoff-calculator": DebtPayoff,
  "fire-calculator": Fire,
  "subscription-cost-calculator": SubscriptionCost,
};

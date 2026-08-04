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

  const r = rate / 100 / 12;
  const balSeries = [principal], contribSeries = [principal], rows: string[][] = [];
  let bal = principal, contr = principal;
  for (let m = 1; m <= years * 12; m++) {
    bal = bal * (1 + r) + monthly;
    contr += monthly;
    if (m % 12 === 0) { balSeries.push(bal); contribSeries.push(contr); rows.push([String(m / 12), fmt(contr), fmt(bal - contr), fmt(bal)]); }
  }
  const fv = bal;
  const contributed = contr;
  const interest = fv - contributed;
  const intPct = fv > 0 ? (interest / fv) * 100 : 0;

  return (
    <>
      <Layout
        inputs={<>
          <SliderField label={t("calc.principal")} value={principal} onChange={setPrincipal} min={0} max={100000} step={100} />
          <SliderField label={t("calc.monthly")} value={monthly} onChange={setMonthly} min={0} max={5000} step={25} />
          <SliderField label={t("calc.rate")} value={rate} onChange={setRate} min={0} max={15} step={0.1} suffix="%" />
          <SliderField label={t("calc.years")} value={years} onChange={setYears} min={1} max={40} step={1} />
        </>}
        results={<>
          <ResultHero label={t("calc.futureValue")} value={fmt(fv)} />
          <ResultRow label={t("calc.contributed")} value={fmt(contributed)} />
          <ResultRow label={t("calc.interestEarned")} value={fmt(interest)} />
        </>}
      />
      <Extras>
        <div className="grid gap-5 lg:grid-cols-2">
          <AreaChart title={t("calc.balanceOverTime")} series={[{ name: t("calc.futureValue"), color: "#6C63FF", values: balSeries, area: true }, { name: t("calc.contributed"), color: "#8E8E93", values: contribSeries, dashed: true }]} fmt={fmt} />
          <SplitDonut title={t("calc.futureValue")} parts={[{ label: t("calc.contributed"), value: contributed, color: "#8E8E93" }, { label: t("calc.interestEarned"), value: interest, color: "#6C63FF" }]} centerTop={t("calc.futureValue")} centerVal={fmt(fv)} fmt={fmt} />
        </div>
        <Insight>{t("calc.ins.compound", { pct: intPct.toFixed(0) })}</Insight>
        <ScheduleTable title={t("calc.showSchedule")} headers={[t("calc.yearCol"), t("calc.contributed"), t("calc.interestEarned"), t("calc.balanceCol")]} rows={rows} />
      </Extras>
    </>
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
    <>
      <Layout
        inputs={
          <>
            <SliderField label={t("calc.income")} value={income} onChange={setIncome} min={500} max={15000} step={50} />
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
      <Extras>
        <SplitDonut
          title={t("calc.income")}
          parts={[
            { label: t("calc.needs"), value: income * 0.5, color: "#6C63FF" },
            { label: t("calc.wants"), value: income * 0.3, color: "#F59E0B" },
            { label: t("calc.savingsCat"), value: income * 0.2, color: "#34D399" },
          ]}
          centerTop={t("calc.income")}
          centerVal={fmt(income)}
          fmt={fmt}
        />
      </Extras>
    </>
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

  const steps = isFinite(months) ? Math.min(Math.max(months, 1), 120) : Math.min(buffer * 4, 48);
  const savedSeries: number[] = [], targetSeries: number[] = [];
  for (let i = 0; i <= steps; i++) { savedSeries.push(Math.min(saved + monthly * i, target)); targetSeries.push(target); }

  return (
    <>
      <Layout
        inputs={<>
          <SliderField label={t("calc.essentials")} value={essentials} onChange={setEssentials} min={0} max={10000} step={50} />
          <div style={{ marginBottom: 18 }}>
            <label style={fieldLabel}>{t("calc.buffer")}</label>
            <Segmented options={[3, 6, 9, 12].map((n) => ({ value: n, label: String(n) }))} value={buffer} onChange={setBuffer} />
          </div>
          <SliderField label={t("calc.saved")} value={saved} onChange={setSaved} min={0} max={50000} step={100} />
          <SliderField label={t("calc.monthly")} value={monthly} onChange={setMonthly} min={0} max={3000} step={25} />
        </>}
        results={<>
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
        </>}
      />
      <Extras>
        <AreaChart title={t("calc.targetFund")} series={[{ name: t("calc.saved"), color: "#F59E0B", values: savedSeries, area: true }, { name: t("calc.targetFund"), color: "#8E8E93", values: targetSeries, dashed: true }]} fmt={fmt} />
        <Insight>{t("calc.ins.emergency", { pct: pct.toFixed(0) })}</Insight>
      </Extras>
    </>
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

  const eff = mode === "amount" ? monthly : required;
  const balSeries = [saved], goalSeries = [goal];
  if (!reached && eff > 0) {
    let b = saved;
    const cap = mode === "date" ? Math.max(deadline, 1) : isFinite(months) ? months : 0;
    for (let m = 1; m <= Math.min(cap, 600); m++) {
      b = b * (1 + i) + eff;
      balSeries.push(Math.min(b, goal));
      goalSeries.push(goal);
      if (b >= goal) break;
    }
  }

  return (
    <>
      <Layout
        inputs={
          <>
            <div style={{ marginBottom: 18 }}>
              <Segmented
                options={[{ value: "amount" as const, label: t("calc.modeByAmount") }, { value: "date" as const, label: t("calc.modeByDate") }]}
                value={mode}
                onChange={setMode}
              />
            </div>
            <SliderField label={t("calc.goalAmount")} value={goal} onChange={setGoal} min={100} max={100000} step={100} />
            <SliderField label={t("calc.saved")} value={saved} onChange={setSaved} min={0} max={100000} step={100} />
            {mode === "amount" ? (
              <SliderField label={t("calc.monthly")} value={monthly} onChange={setMonthly} min={0} max={5000} step={25} />
            ) : (
              <SliderField label={t("calc.deadlineMonths")} value={deadline} onChange={setDeadline} min={1} max={120} step={1} />
            )}
            <SliderField label={t("calc.returnOptional")} value={ret} onChange={setRet} min={0} max={12} step={0.1} suffix="%" />
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
      {!reached && eff > 0 && balSeries.length > 1 && (
        <Extras>
          <AreaChart title={t("calc.goalAmount")} series={[{ name: t("calc.saved"), color: "#0EA5E9", values: balSeries, area: true }, { name: t("calc.goalAmount"), color: "#8E8E93", values: goalSeries, dashed: true }]} fmt={fmt} />
          {mode === "amount" && isFinite(months) && <Insight>{t("calc.ins.savings", { amt: fmt(eff), dur: dur(months) })}</Insight>}
          {mode === "date" && <Insight>{t("calc.ins.savings", { amt: fmt(eff), dur: dur(deadline) })}</Insight>}
        </Extras>
      )}
    </>
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

  const bby = [balance], yearly: string[][] = [];
  if (payable) {
    let bal = balance, yi = 0, yp = 0, m = 0;
    while (bal > 0.005 && m < months + 12) {
      m++;
      const it = bal * r;
      let pp = payment - it;
      if (pp > bal) pp = bal;
      bal -= pp; yi += it; yp += pp;
      if (m % 12 === 0) { bby.push(Math.max(bal, 0)); yearly.push([String(m / 12), fmt(yp), fmt(yi), fmt(Math.max(bal, 0))]); yi = 0; yp = 0; }
      if (bal <= 0.005) { if (m % 12 !== 0) { bby.push(0); yearly.push([String(Math.ceil(m / 12)), fmt(yp), fmt(yi), fmt(0)]); } break; }
    }
  }

  return (
    <>
      <Layout
        inputs={<>
          <SliderField label={t("calc.balance")} value={balance} onChange={setBalance} min={100} max={50000} step={100} />
          <SliderField label={t("calc.apr")} value={apr} onChange={setApr} min={0} max={36} step={0.5} suffix="%" />
          <SliderField label={t("calc.payment")} value={payment} onChange={setPayment} min={0} max={3000} step={10} />
        </>}
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
      {payable && (
        <Extras>
          <div className="grid gap-5 lg:grid-cols-2">
            <SplitDonut title={`${t("calc.principalPart")} vs ${t("calc.interestPart")}`} parts={[{ label: t("calc.principalPart"), value: balance, color: "#6C63FF" }, { label: t("calc.interestPart"), value: totalInterest, color: "#F87171" }]} centerTop={t("calc.totalPaid")} centerVal={fmt(balance + totalInterest)} fmt={fmt} />
            <AreaChart title={t("calc.balanceOverTime")} series={[{ name: t("calc.balanceCol"), color: "#F87171", values: bby, area: true }]} fmt={fmt} />
          </div>
          <Insight>{t("calc.ins.debt", { amt: fmt(totalInterest) })}</Insight>
          <ScheduleTable title={t("calc.showSchedule")} headers={[t("calc.yearCol"), t("calc.principalPart"), t("calc.interestPart"), t("calc.balanceCol")]} rows={yearly} />
        </Extras>
      )}
    </>
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
  const bby = [saved], fireLine = [fireNumber];
  while (balance < fireNumber && years < 100) {
    balance = balance * (1 + r) + annualSavings;
    years++;
    bby.push(balance);
    fireLine.push(fireNumber);
  }
  const months = years >= 100 && balance < fireNumber ? Infinity : years * 12;

  return (
    <>
      <Layout
        inputs={<>
          <SliderField label={t("calc.annualExpenses")} value={annualExpenses} onChange={setAnnualExpenses} min={5000} max={150000} step={1000} />
          <SliderField label={t("calc.saved")} value={saved} onChange={setSaved} min={0} max={1000000} step={5000} />
          <SliderField label={t("calc.annualSavings")} value={annualSavings} onChange={setAnnualSavings} min={0} max={100000} step={1000} />
          <SliderField label={t("calc.returnRate")} value={ret} onChange={setRet} min={0} max={12} step={0.1} suffix="%" />
        </>}
        results={<>
          <ResultHero label={t("calc.fireNumber")} value={fmt(fireNumber)} color="#A78BFA" />
          <ResultRow label={t("calc.yearsToFire")} value={dur(months)} />
        </>}
      />
      {isFinite(months) && bby.length > 1 && (
        <Extras>
          <AreaChart title={t("calc.balanceOverTime")} series={[{ name: t("calc.balanceCol"), color: "#A78BFA", values: bby, area: true }, { name: t("calc.fireNumber"), color: "#8E8E93", values: fireLine, dashed: true }]} fmt={fmt} />
          <Insight>{t("calc.ins.fire", { dur: dur(months) })}</Insight>
        </Extras>
      )}
    </>
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

  const subPal = ["#EC4899", "#6C63FF", "#F59E0B", "#0EA5E9", "#34D399", "#F87171", "#A78BFA", "#FB7185"];
  const subParts = rows.filter((row) => row.price > 0).map((row, idx) => ({ label: row.name || `#${idx + 1}`, value: row.yearly ? row.price / 12 : row.price, color: subPal[idx % subPal.length] }));

  return (
    <>
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
    {subParts.length > 0 && (
      <Extras>
        <SplitDonut title={t("calc.subs.totalMonth")} parts={subParts} centerTop={t("calc.subs.totalMonth")} centerVal={fmt(perMonth)} fmt={fmt} />
        <Insight>{t("calc.ins.subs", { amt: fmt(perYear), amt2: fmt(invested) })}</Insight>
      </Extras>
    )}
    </>
  );
}

// ── Couple expense split ─────────────────────────────────────────────────────

function CoupleSplit() {
  const { t, fmt } = useCalc();
  const [income1, setIncome1] = useState(3000);
  const [income2, setIncome2] = useState(2000);
  const [shared, setShared] = useState(1800);
  const [prop, setProp] = useState(true);

  const total = income1 + income2;
  const ratio1 = prop ? (total > 0 ? income1 / total : 0.5) : 0.5;
  const share1 = shared * ratio1;
  const share2 = shared - share1;
  const pct = (r: number) => `${Math.round(r * 100)}%`;

  return (
    <>
      <Layout
        inputs={<>
          <SliderField label={t("calc.split.income1")} value={income1} onChange={setIncome1} min={0} max={20000} step={100} />
          <SliderField label={t("calc.split.income2")} value={income2} onChange={setIncome2} min={0} max={20000} step={100} />
          <SliderField label={t("calc.split.shared")} value={shared} onChange={setShared} min={0} max={10000} step={50} />
          <Segmented
            options={[
              { value: "prop", label: t("calc.split.modeProp") },
              { value: "5050", label: t("calc.split.mode5050") },
            ]}
            value={prop ? "prop" : "5050"}
            onChange={(v) => setProp(v === "prop")}
          />
        </>}
        results={<>
          <ResultHero label={`${t("calc.split.yourShare")} · ${pct(ratio1)}`} value={fmt(share1)} color="#FB7185" />
          <ResultRow label={`${t("calc.split.partnerShare")} · ${pct(1 - ratio1)}`} value={fmt(share2)} />
          <ResultRow label={t("calc.split.leftover1")} value={fmt(Math.max(income1 - share1, 0))} />
          <ResultRow label={t("calc.split.leftover2")} value={fmt(Math.max(income2 - share2, 0))} />
        </>}
      />
      <Extras>
        <SplitDonut title={t("calc.split.shared")} parts={[{ label: t("calc.split.yourShare"), value: share1, color: "#FB7185" }, { label: t("calc.split.partnerShare"), value: share2, color: "#6C63FF" }]} centerTop={t("calc.split.shared")} centerVal={fmt(shared)} fmt={fmt} />
        <Insight>{t("calc.ins.couple", { pct: String(Math.round(ratio1 * 100)), amt: fmt(Math.max(income1 - share1, 0)) })}</Insight>
      </Extras>
    </>
  );
}

// ── Amortization helper (monthly payment on an amortizing loan) ──────────────

function amortize(principal: number, annualRatePct: number, months: number) {
  const r = annualRatePct / 100 / 12;
  const n = Math.max(Math.round(months), 0);
  if (n === 0) return { payment: 0, total: 0, interest: 0 };
  const payment = r === 0 ? principal / n : (principal * r) / (1 - (1 + r) ** -n);
  const total = payment * n;
  return { payment, total, interest: total - principal };
}

// ── Shared visual toolkit ────────────────────────────────────────────────────

/** Number input paired with a range slider. */
function SliderField({ label, value, onChange, min = 0, max, step = 1, suffix }: { label: string; value: number; onChange: (n: number) => void; min?: number; max: number; step?: number; suffix?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8, gap: 10 }}>
        <label style={fieldLabel}>{label}</label>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, flexShrink: 0 }}>
          <input
            type="number"
            inputMode="decimal"
            step={step}
            min={min}
            value={Number.isFinite(value) ? value : ""}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            style={{ width: 96, textAlign: "right", padding: "6px 9px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 9, fontSize: 14, fontWeight: 700, color: "#0A0A0A", background: "#fff" }}
          />
          {suffix && <span style={{ fontSize: 12, color: "#8E8E93" }}>{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(Math.max(Number.isFinite(value) ? value : min, min), max)}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "#6C63FF", cursor: "pointer" }}
      />
    </div>
  );
}

/** Line/area chart of one or more series over evenly-spaced points. */
function AreaChart({ title, series, height = 190, fmt }: { title: string; series: { name: string; color: string; values: number[]; dashed?: boolean; area?: boolean }[]; height?: number; fmt: (n: number) => string }) {
  const W = 520, H = height, padX = 10, padTop = 16, padBot = 22;
  const n = Math.max(...series.map((s) => s.values.length), 1);
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const x = (i: number) => padX + (n <= 1 ? 0 : (i / (n - 1)) * (W - padX * 2));
  const y = (v: number) => padTop + (1 - v / max) * (H - padTop - padBot);
  const poly = (vals: number[]) => vals.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const main = series[0];
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A" }}>{title}</h3>
        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#8E8E93" }}>
          {series.map((s) => (<span key={s.name}><span style={{ color: s.color }}>●</span> {s.name}</span>))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }} preserveAspectRatio="none">
        {[0.25, 0.5, 0.75].map((f) => {
          const yy = padTop + f * (H - padTop - padBot);
          return <line key={f} x1={padX} x2={W - padX} y1={yy} y2={yy} stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />;
        })}
        {series.filter((s) => s.area).map((s) => (
          <polygon key={s.name} points={`${x(0)},${y(0)} ${poly(s.values)} ${x(s.values.length - 1)},${y(0)}`} fill={s.color} opacity={0.1} />
        ))}
        {series.map((s) => (
          <polyline key={s.name} points={poly(s.values)} fill="none" stroke={s.color} strokeWidth={s.dashed ? 2 : 2.5} strokeDasharray={s.dashed ? "4 4" : undefined} strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#8E8E93", marginTop: 4 }}>
        <span>{fmt(main.values[0])}</span>
        <span>{fmt(main.values[main.values.length - 1])}</span>
      </div>
    </Card>
  );
}

/** Donut split into 2–3 parts with a legend. */
function SplitDonut({ title, parts, centerTop, centerVal, fmt }: { title: string; parts: { label: string; value: number; color: string }[]; centerTop: string; centerVal: string; fmt: (n: number) => string }) {
  const total = parts.reduce((s, p) => s + Math.max(p.value, 0), 0) || 1;
  const R = 60, C = 2 * Math.PI * R;
  let off = 0;
  return (
    <Card>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A", marginBottom: 16 }}>{title}</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <svg viewBox="0 0 160 160" width={140} height={140} style={{ flexShrink: 0 }}>
          <g transform="rotate(-90 80 80)">
            {parts.map((p) => {
              const frac = Math.max(p.value, 0) / total;
              const dash = frac * C;
              const el = <circle key={p.label} cx={80} cy={80} r={R} fill="none" stroke={p.color} strokeWidth={20} strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-off} />;
              off += dash;
              return el;
            })}
          </g>
          <text x={80} y={76} textAnchor="middle" style={{ fontSize: 11, fill: "#8E8E93" }}>{centerTop}</text>
          <text x={80} y={95} textAnchor="middle" style={{ fontSize: 15, fontWeight: 700, fill: "#0A0A0A" }}>{centerVal}</text>
        </svg>
        <div style={{ flex: 1, minWidth: 150, display: "flex", flexDirection: "column", gap: 10 }}>
          {parts.map((p) => (
            <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: p.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#63636B", flex: 1 }}>{p.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A" }}>{fmt(p.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/** Vertical comparison bars. */
function CompareBars({ title, items, fmt, height = 170 }: { title: string; items: { label: string; value: number; color: string }[]; fmt: (n: number) => string; height?: number }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <Card>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A", marginBottom: 16 }}>{title}</h3>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height, justifyContent: "space-around" }}>
        {items.map((i) => (
          <div key={i.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0A0A0A", marginBottom: 6 }}>{fmt(i.value)}</span>
            <div style={{ width: "70%", maxWidth: 60, height: `${(i.value / max) * 100}%`, minHeight: 4, background: i.color, borderRadius: "6px 6px 0 0" }} />
            <span style={{ fontSize: 11, color: "#8E8E93", marginTop: 8, textAlign: "center", lineHeight: 1.3 }}>{i.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Single horizontal bar split into parts (e.g. net vs tax). */
function SplitBar({ title, parts, fmt }: { title: string; parts: { label: string; value: number; color: string }[]; fmt: (n: number) => string }) {
  const total = parts.reduce((s, p) => s + Math.max(p.value, 0), 0) || 1;
  return (
    <Card>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A", marginBottom: 16 }}>{title}</h3>
      <div style={{ display: "flex", height: 30, borderRadius: 9, overflow: "hidden", marginBottom: 14 }}>
        {parts.map((p) => (
          <div key={p.label} style={{ width: `${(Math.max(p.value, 0) / total) * 100}%`, background: p.color, minWidth: p.value > 0 ? 2 : 0 }} />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {parts.map((p) => (
          <div key={p.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: p.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#63636B", flex: 1 }}>{p.label}</span>
            <span style={{ fontSize: 12, color: "#8E8E93" }}>{Math.round((Math.max(p.value, 0) / total) * 100)}%</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A", minWidth: 64, textAlign: "right" }}>{fmt(p.value)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Collapsible year-by-year table. */
function ScheduleTable({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  const [open, setOpen] = useState(false);
  if (rows.length === 0) return null;
  return (
    <div>
      <button type="button" onClick={() => setOpen((o) => !o)} style={{ fontSize: 13, fontWeight: 600, color: "#6C63FF", cursor: "pointer", background: "transparent", padding: "4px 0" }}>
        {open ? "− " : "+ "}{title}
      </button>
      {open && (
        <div className="surface rounded-2xl" style={{ padding: 4, maxHeight: 300, overflow: "auto", marginTop: 8 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                {headers.map((h, j) => (
                  <th key={h} style={{ textAlign: j === 0 ? "left" : "right", padding: "8px 10px", color: "#8E8E93", fontWeight: 600, position: "sticky", top: 0, background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j} style={{ textAlign: j === 0 ? "left" : "right", padding: "7px 10px", color: j === 0 ? "#8E8E93" : "#0A0A0A", fontWeight: j === 0 ? 600 : 500, borderBottom: "1px solid rgba(0,0,0,0.04)" }}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** Highlighted takeaway sentence. */
function Insight({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(108,99,255,0.06)", border: "1px solid rgba(108,99,255,0.16)", borderRadius: 14, padding: "13px 16px", fontSize: 14, color: "#3A3A42", lineHeight: 1.55 }}>
      {children}
    </div>
  );
}

/** Wraps the visual extras that sit full-width below the inputs/results row. */
function Extras({ children }: { children: React.ReactNode }) {
  return <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 20 }}>{children}</div>;
}

// ── Loan ─────────────────────────────────────────────────────────────────────

function loanAmortization(principal: number, ratePct: number, months: number, extra: number) {
  const r = ratePct / 100 / 12;
  const basePay = amortize(principal, ratePct, months).payment;
  const pay = basePay + Math.max(extra, 0);
  let bal = principal, yi = 0, yp = 0, totalInt = 0, m = 0;
  const yearly: { year: number; interest: number; principal: number; balance: number }[] = [];
  const balByYear = [principal];
  while (bal > 0.005 && m < months + 1200) {
    m++;
    const interest = bal * r;
    let principalPaid = pay - interest;
    if (principalPaid > bal) principalPaid = bal;
    bal -= principalPaid; yi += interest; yp += principalPaid; totalInt += interest;
    if (m % 12 === 0) { yearly.push({ year: m / 12, interest: yi, principal: yp, balance: Math.max(bal, 0) }); balByYear.push(Math.max(bal, 0)); yi = 0; yp = 0; }
    if (bal <= 0.005) { if (m % 12 !== 0) { yearly.push({ year: Math.ceil(m / 12), interest: yi, principal: yp, balance: 0 }); balByYear.push(0); } break; }
  }
  return { pay, months: m, totalInterest: totalInt, yearly, balByYear };
}

function Loan() {
  const { t, fmt, dur } = useCalc();
  const [amount, setAmount] = useState(20000);
  const [rate, setRate] = useState(7.5);
  const [years, setYears] = useState(5);
  const [extra, setExtra] = useState(0);

  const { pay, months, totalInterest, yearly, balByYear } = loanAmortization(amount, rate, years * 12, extra);
  const total = amount + totalInterest;
  const intPct = amount > 0 ? (totalInterest / amount) * 100 : 0;

  return (
    <>
      <Layout
        inputs={<>
          <SliderField label={t("calc.loanAmount")} value={amount} onChange={setAmount} min={500} max={100000} step={500} />
          <SliderField label={t("calc.rate")} value={rate} onChange={setRate} min={0} max={30} step={0.1} suffix="%" />
          <SliderField label={t("calc.termYears")} value={years} onChange={setYears} min={1} max={30} step={1} />
          <SliderField label={t("calc.extraPayment")} value={extra} onChange={setExtra} min={0} max={2000} step={10} />
        </>}
        results={<>
          <ResultHero label={t("calc.monthlyPayment")} value={fmt(pay)} color="#6C63FF" />
          <ResultRow label={t("calc.totalPaid")} value={fmt(total)} />
          <ResultRow label={t("calc.totalInterestPaid")} value={fmt(totalInterest)} />
          {extra > 0 && <ResultRow label={t("calc.timeToPayoff")} value={dur(months)} />}
        </>}
      />
      <Extras>
        <div className="grid gap-5 lg:grid-cols-2">
          <SplitDonut title={`${t("calc.principalPart")} vs ${t("calc.interestPart")}`} parts={[{ label: t("calc.principalPart"), value: amount, color: "#6C63FF" }, { label: t("calc.interestPart"), value: totalInterest, color: "#F87171" }]} centerTop={t("calc.totalPaid")} centerVal={fmt(total)} fmt={fmt} />
          <AreaChart title={t("calc.balanceOverTime")} series={[{ name: t("calc.balanceCol"), color: "#6C63FF", values: balByYear, area: true }]} fmt={fmt} />
        </div>
        <Insight>{t("calc.ins.loan", { amt: fmt(totalInterest), pct: intPct.toFixed(0) })}</Insight>
        <ScheduleTable title={t("calc.showSchedule")} headers={[t("calc.yearCol"), t("calc.principalPart"), t("calc.interestPart"), t("calc.balanceCol")]} rows={yearly.map((r) => [String(r.year), fmt(r.principal), fmt(r.interest), fmt(r.balance)])} />
      </Extras>
    </>
  );
}

// ── Monthly budget planner ───────────────────────────────────────────────────

function MonthlyBudget() {
  const { t, fmt } = useCalc();
  const [income, setIncome] = useState(3500);
  const [housing, setHousing] = useState(1200);
  const [food, setFood] = useState(500);
  const [transport, setTransport] = useState(300);
  const [other, setOther] = useState(400);

  const expenses = housing + food + transport + other;
  const leftover = income - expenses;
  const savingsRate = income > 0 ? (leftover / income) * 100 : 0;

  const parts = [
    { label: t("calc.exp.housing"), value: housing, color: "#6C63FF" },
    { label: t("calc.exp.food"), value: food, color: "#F59E0B" },
    { label: t("calc.exp.transport"), value: transport, color: "#0EA5E9" },
    { label: t("calc.exp.other"), value: other, color: "#F87171" },
    ...(leftover > 0 ? [{ label: t("calc.leftover"), value: leftover, color: "#34D399" }] : []),
  ];

  return (
    <>
      <Layout
        inputs={<>
          <SliderField label={t("calc.income")} value={income} onChange={setIncome} min={500} max={15000} step={50} />
          <SliderField label={t("calc.exp.housing")} value={housing} onChange={setHousing} min={0} max={6000} step={50} />
          <SliderField label={t("calc.exp.food")} value={food} onChange={setFood} min={0} max={3000} step={25} />
          <SliderField label={t("calc.exp.transport")} value={transport} onChange={setTransport} min={0} max={2000} step={25} />
          <SliderField label={t("calc.exp.other")} value={other} onChange={setOther} min={0} max={4000} step={25} />
        </>}
        results={<>
          <ResultHero label={t("calc.leftover")} value={fmt(leftover)} color={leftover >= 0 ? "#34D399" : "#F87171"} />
          <ResultRow label={t("calc.totalExpenses")} value={fmt(expenses)} />
          <ResultRow label={t("calc.savingsRate")} value={`${savingsRate.toFixed(0)}%`} />
        </>}
      />
      <Extras>
        <SplitDonut title={t("calc.totalExpenses")} parts={parts} centerTop={t("calc.income")} centerVal={fmt(income)} fmt={fmt} />
        <Insight>{leftover >= 0 ? t("calc.ins.budgetOk", { amt: fmt(leftover), pct: savingsRate.toFixed(0) }) : t("calc.ins.budgetOver", { amt: fmt(-leftover) })}</Insight>
      </Extras>
    </>
  );
}

// ── Salary converter ─────────────────────────────────────────────────────────

function Salary() {
  const { t, fmt } = useCalc();
  const [amount, setAmount] = useState(25);
  const [period, setPeriod] = useState<"hour" | "week" | "month" | "year">("hour");
  const [hours, setHours] = useState(40);
  const [weeks, setWeeks] = useState(52);

  const hrs = hours > 0 ? hours : 40;
  const wks = weeks > 0 ? weeks : 52;
  const annual =
    period === "hour" ? amount * hrs * wks : period === "week" ? amount * wks : period === "month" ? amount * 12 : amount;
  const hourly = annual / (hrs * wks);
  const weekly = annual / wks;
  const monthly = annual / 12;
  const amountMax = period === "hour" ? 200 : period === "week" ? 5000 : period === "month" ? 20000 : 300000;
  const amountStep = period === "hour" ? 1 : period === "year" ? 1000 : 50;

  return (
    <>
      <Layout
        inputs={<>
          <SliderField label={t("calc.salaryAmount")} value={amount} onChange={setAmount} min={0} max={amountMax} step={amountStep} />
          <div style={{ marginBottom: 18 }}>
            <label style={fieldLabel}>{t("calc.per")}</label>
            <Segmented
              options={[
                { value: "hour" as const, label: t("calc.perHour") },
                { value: "week" as const, label: t("calc.perWeek") },
                { value: "month" as const, label: t("calc.perMonth2") },
                { value: "year" as const, label: t("calc.perYear2") },
              ]}
              value={period}
              onChange={setPeriod}
            />
          </div>
          <SliderField label={t("calc.hoursWeek")} value={hours} onChange={setHours} min={1} max={80} step={1} />
          <SliderField label={t("calc.weeksYear")} value={weeks} onChange={setWeeks} min={1} max={52} step={1} />
        </>}
        results={<>
          <ResultHero label={t("calc.perYear2")} value={fmt(annual)} color="#0EA5E9" />
          <ResultRow label={t("calc.perMonth2")} value={fmt(monthly)} />
          <ResultRow label={t("calc.perWeek")} value={fmt(weekly)} />
          <ResultRow label={t("calc.perHour")} value={hourly >= 100 ? fmt(hourly) : hourly.toFixed(2)} />
        </>}
      />
      <Extras>
        <CompareBars title={t("calc.perWeek") + " · " + t("calc.perMonth2")} items={[{ label: t("calc.perWeek"), value: weekly, color: "#0EA5E9" }, { label: t("calc.perMonth2"), value: monthly, color: "#6C63FF" }]} fmt={fmt} />
        <Insight>{t("calc.ins.salary", { amt: hourly >= 100 ? fmt(hourly) : hourly.toFixed(2), hours: hrs })}</Insight>
      </Extras>
    </>
  );
}

// ── Inflation ────────────────────────────────────────────────────────────────

function Inflation() {
  const { t, fmt } = useCalc();
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(3);
  const [years, setYears] = useState(10);

  const f = (1 + rate / 100) ** years;
  const futureCost = amount * f;
  const buyingPower = amount / f;

  const costSeries: number[] = [], powerSeries: number[] = [], rows: string[][] = [];
  for (let y = 0; y <= years; y++) {
    const g = (1 + rate / 100) ** y;
    costSeries.push(amount * g);
    powerSeries.push(amount / g);
    rows.push([String(y), fmt(amount * g), fmt(amount / g)]);
  }

  return (
    <>
      <Layout
        inputs={<>
          <SliderField label={t("calc.amountToday")} value={amount} onChange={setAmount} min={0} max={100000} step={100} />
          <SliderField label={t("calc.inflRate")} value={rate} onChange={setRate} min={0} max={20} step={0.1} suffix="%" />
          <SliderField label={t("calc.years")} value={years} onChange={setYears} min={1} max={50} step={1} />
        </>}
        results={<>
          <ResultHero label={t("calc.futureCost")} value={fmt(futureCost)} color="#F59E0B" />
          <ResultRow label={t("calc.buyingPower")} value={fmt(buyingPower)} />
        </>}
      />
      <Extras>
        <AreaChart title={t("calc.buyingPower")} series={[{ name: t("calc.costCol"), color: "#F59E0B", values: costSeries }, { name: t("calc.powerCol"), color: "#6C63FF", values: powerSeries, area: true }]} fmt={fmt} />
        <Insight>{t("calc.ins.inflation", { years, amt: fmt(futureCost), amt2: fmt(buyingPower) })}</Insight>
        <ScheduleTable title={t("calc.showSchedule")} headers={[t("calc.yearCol"), t("calc.costCol"), t("calc.powerCol")]} rows={rows} />
      </Extras>
    </>
  );
}

// ── Discount ─────────────────────────────────────────────────────────────────

function Discount() {
  const { t, fmt } = useCalc();
  const [price, setPrice] = useState(120);
  const [pct, setPct] = useState(25);

  const saved = price * (pct / 100);
  const final = price - saved;

  return (
    <>
      <Layout
        inputs={<>
          <SliderField label={t("calc.origPrice")} value={price} onChange={setPrice} min={0} max={2000} step={5} />
          <SliderField label={t("calc.discountPct")} value={pct} onChange={setPct} min={0} max={90} step={1} suffix="%" />
        </>}
        results={<>
          <ResultHero label={t("calc.finalPrice")} value={fmt(final)} color="#EC4899" />
          <ResultRow label={t("calc.youSave")} value={fmt(saved)} />
        </>}
      />
      <Extras>
        <SplitBar title={t("calc.origPrice")} parts={[{ label: t("calc.finalPrice"), value: final, color: "#EC4899" }, { label: t("calc.youSave"), value: saved, color: "#34D399" }]} fmt={fmt} />
        <Insight>{t("calc.ins.discount", { pct: pct.toFixed(0), amt: fmt(saved), price: fmt(final) })}</Insight>
      </Extras>
    </>
  );
}

// ── VAT ──────────────────────────────────────────────────────────────────────

function Vat() {
  const { t, fmt } = useCalc();
  const [amount, setAmount] = useState(100);
  const [rate, setRate] = useState(20);
  const [add, setAdd] = useState(true);

  let net: number, vat: number, gross: number;
  if (add) {
    net = amount;
    vat = amount * (rate / 100);
    gross = amount + vat;
  } else {
    gross = amount;
    net = amount / (1 + rate / 100);
    vat = gross - net;
  }

  return (
    <>
      <Layout
        inputs={<>
          <SliderField label={t("calc.amount")} value={amount} onChange={setAmount} min={0} max={5000} step={10} />
          <SliderField label={t("calc.vatRate")} value={rate} onChange={setRate} min={0} max={30} step={0.5} suffix="%" />
          <Segmented
            options={[
              { value: "add", label: t("calc.addVat") },
              { value: "extract", label: t("calc.extractVat") },
            ]}
            value={add ? "add" : "extract"}
            onChange={(v) => setAdd(v === "add")}
          />
        </>}
        results={<>
          <ResultHero label={t("calc.gross")} value={fmt(gross)} color="#0EA5E9" />
          <ResultRow label={t("calc.net")} value={fmt(net)} />
          <ResultRow label={t("calc.vatAmount")} value={fmt(vat)} />
        </>}
      />
      <Extras>
        <SplitBar title={t("calc.gross")} parts={[{ label: t("calc.net"), value: net, color: "#0EA5E9" }, { label: t("calc.vatAmount"), value: vat, color: "#A78BFA" }]} fmt={fmt} />
      </Extras>
    </>
  );
}

// ── Sales tax ────────────────────────────────────────────────────────────────

function SalesTax() {
  const { t, fmt } = useCalc();
  const [price, setPrice] = useState(100);
  const [rate, setRate] = useState(8);

  const tax = price * (rate / 100);
  const total = price + tax;

  return (
    <>
      <Layout
        inputs={<>
          <SliderField label={t("calc.preTaxPrice")} value={price} onChange={setPrice} min={0} max={5000} step={5} />
          <SliderField label={t("calc.taxRate")} value={rate} onChange={setRate} min={0} max={25} step={0.25} suffix="%" />
        </>}
        results={<>
          <ResultHero label={t("calc.totalWithTax")} value={fmt(total)} color="#A78BFA" />
          <ResultRow label={t("calc.taxAmount")} value={fmt(tax)} />
        </>}
      />
      <Extras>
        <SplitBar title={t("calc.totalWithTax")} parts={[{ label: t("calc.preTaxPrice"), value: price, color: "#A78BFA" }, { label: t("calc.taxAmount"), value: tax, color: "#F87171" }]} fmt={fmt} />
      </Extras>
    </>
  );
}

// ── Simple interest ──────────────────────────────────────────────────────────

function SimpleInterest() {
  const { t, fmt } = useCalc();
  const [principal, setPrincipal] = useState(5000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(3);

  const interest = principal * (rate / 100) * years;
  const total = principal + interest;

  const balSeries: number[] = [], baseSeries: number[] = [], rows: string[][] = [];
  for (let y = 0; y <= years; y++) {
    const int = principal * (rate / 100) * y;
    balSeries.push(principal + int);
    baseSeries.push(principal);
    rows.push([String(y), fmt(int), fmt(principal + int)]);
  }

  return (
    <>
      <Layout
        inputs={<>
          <SliderField label={t("calc.principal")} value={principal} onChange={setPrincipal} min={0} max={100000} step={100} />
          <SliderField label={t("calc.rate")} value={rate} onChange={setRate} min={0} max={20} step={0.1} suffix="%" />
          <SliderField label={t("calc.years")} value={years} onChange={setYears} min={1} max={30} step={1} />
        </>}
        results={<>
          <ResultHero label={t("calc.totalValue")} value={fmt(total)} color="#34D399" />
          <ResultRow label={t("calc.interestEarned")} value={fmt(interest)} />
        </>}
      />
      <Extras>
        <AreaChart title={t("calc.balanceOverTime")} series={[{ name: t("calc.balanceCol"), color: "#34D399", values: balSeries, area: true }, { name: t("calc.principal"), color: "#8E8E93", values: baseSeries, dashed: true }]} fmt={fmt} />
        <ScheduleTable title={t("calc.showSchedule")} headers={[t("calc.yearCol"), t("calc.interestEarned"), t("calc.balanceCol")]} rows={rows} />
      </Extras>
    </>
  );
}

// ── Auto loan ────────────────────────────────────────────────────────────────

function AutoLoan() {
  const { t, fmt } = useCalc();
  const [price, setPrice] = useState(30000);
  const [down, setDown] = useState(5000);
  const [trade, setTrade] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(5);

  const financed = Math.max(price - down - trade, 0) + price * (taxRate / 100);
  const { pay, totalInterest, yearly, balByYear } = loanAmortization(financed, rate, years * 12, 0);

  return (
    <>
      <Layout
        inputs={<>
          <SliderField label={t("calc.vehiclePrice")} value={price} onChange={setPrice} min={0} max={150000} step={500} />
          <SliderField label={t("calc.downPayment")} value={down} onChange={setDown} min={0} max={50000} step={250} />
          <SliderField label={t("calc.tradeIn")} value={trade} onChange={setTrade} min={0} max={50000} step={250} />
          <SliderField label={t("calc.autoTaxRate")} value={taxRate} onChange={setTaxRate} min={0} max={15} step={0.5} suffix="%" />
          <SliderField label={t("calc.rate")} value={rate} onChange={setRate} min={0} max={25} step={0.1} suffix="%" />
          <SliderField label={t("calc.termYears")} value={years} onChange={setYears} min={1} max={8} step={1} />
        </>}
        results={<>
          <ResultHero label={t("calc.monthlyPayment")} value={fmt(pay)} color="#F87171" />
          <ResultRow label={t("calc.amountFinanced")} value={fmt(financed)} />
          <ResultRow label={t("calc.totalInterestPaid")} value={fmt(totalInterest)} />
        </>}
      />
      <Extras>
        <div className="grid gap-5 lg:grid-cols-2">
          <SplitDonut title={`${t("calc.amountFinanced")} vs ${t("calc.interestPart")}`} parts={[{ label: t("calc.amountFinanced"), value: financed, color: "#F87171" }, { label: t("calc.interestPart"), value: totalInterest, color: "#6C63FF" }]} centerTop={t("calc.totalPaid")} centerVal={fmt(financed + totalInterest)} fmt={fmt} />
          <AreaChart title={t("calc.balanceOverTime")} series={[{ name: t("calc.balanceCol"), color: "#F87171", values: balByYear, area: true }]} fmt={fmt} />
        </div>
        <ScheduleTable title={t("calc.showSchedule")} headers={[t("calc.yearCol"), t("calc.principalPart"), t("calc.interestPart"), t("calc.balanceCol")]} rows={yearly.map((r) => [String(r.year), fmt(r.principal), fmt(r.interest), fmt(r.balance)])} />
      </Extras>
    </>
  );
}

// ── Rent affordability ───────────────────────────────────────────────────────

function RentAffordability() {
  const { t, fmt } = useCalc();
  const [income, setIncome] = useState(4000);
  const [pct, setPct] = useState(30);

  const rent = income * (pct / 100);
  const leftover = income - rent;

  return (
    <>
      <Layout
        inputs={<>
          <SliderField label={t("calc.grossIncome")} value={income} onChange={setIncome} min={500} max={20000} step={50} />
          <div style={{ marginBottom: 18 }}>
            <label style={fieldLabel}>{t("calc.rentPct")}</label>
            <Segmented options={[25, 30, 35].map((n) => ({ value: n, label: `${n}%` }))} value={pct} onChange={setPct} />
          </div>
        </>}
        results={<>
          <ResultHero label={t("calc.recRent")} value={fmt(rent)} color="#6C63FF" />
          <ResultRow label={t("calc.conservative")} value={fmt(income * 0.25)} />
          <ResultRow label={t("calc.stretch")} value={fmt(income * 0.35)} />
          <ResultRow label={t("calc.annualRent")} value={fmt(rent * 12)} />
        </>}
      />
      <Extras>
        <CompareBars title={t("calc.recRent")} items={[{ label: t("calc.conservative"), value: income * 0.25, color: "#34D399" }, { label: "30%", value: income * 0.3, color: "#6C63FF" }, { label: t("calc.stretch"), value: income * 0.35, color: "#F59E0B" }]} fmt={fmt} />
        <Insight>{t("calc.ins.rent", { pct: String(pct), amt: fmt(leftover) })}</Insight>
      </Extras>
    </>
  );
}

// ── Debt consolidation ───────────────────────────────────────────────────────

function DebtConsolidation() {
  const { t, fmt } = useCalc();
  const [balance, setBalance] = useState(15000);
  const [curApr, setCurApr] = useState(22);
  const [curPayment, setCurPayment] = useState(450);
  const [newApr, setNewApr] = useState(11);
  const [years, setYears] = useState(3);

  // Current path
  const r = curApr / 100 / 12;
  let curInterest = Infinity;
  if (r === 0 && curPayment > 0) curInterest = 0;
  else if (curPayment > balance * r) {
    const months = Math.log(curPayment / (curPayment - balance * r)) / Math.log(1 + r);
    curInterest = curPayment * months - balance;
  }

  // Consolidated loan
  const { payment: newPayment, interest: newInterest } = amortize(balance, newApr, years * 12);
  const saved = isFinite(curInterest) ? curInterest - newInterest : Infinity;

  return (
    <>
      <Layout
        inputs={<>
          <SliderField label={t("calc.balance")} value={balance} onChange={setBalance} min={500} max={100000} step={500} />
          <SliderField label={t("calc.currentApr")} value={curApr} onChange={setCurApr} min={0} max={36} step={0.5} suffix="%" />
          <SliderField label={t("calc.currentPayment")} value={curPayment} onChange={setCurPayment} min={0} max={3000} step={10} />
          <SliderField label={t("calc.newApr")} value={newApr} onChange={setNewApr} min={0} max={36} step={0.5} suffix="%" />
          <SliderField label={t("calc.termYears")} value={years} onChange={setYears} min={1} max={10} step={1} />
        </>}
        results={<>
          <ResultHero label={t("calc.newPayment")} value={fmt(newPayment)} color="#FB7185" />
          <ResultRow label={t("calc.newInterest")} value={fmt(newInterest)} />
          <ResultRow label={t("calc.interestSaved")} value={isFinite(saved) ? fmt(Math.max(saved, 0)) : "—"} />
        </>}
      />
      <Extras>
        {isFinite(curInterest) && (
          <CompareBars title={t("calc.interestSaved")} items={[{ label: t("calc.currentPayment"), value: curInterest, color: "#F87171" }, { label: t("calc.newInterest"), value: newInterest, color: "#34D399" }]} fmt={fmt} />
        )}
        {isFinite(saved) && saved > 0 && <Insight>{t("calc.ins.saved", { amt: fmt(saved) })}</Insight>}
      </Extras>
    </>
  );
}

// ── Retirement ───────────────────────────────────────────────────────────────

function Retirement() {
  const { t, fmt } = useCalc();
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(65);
  const [saved, setSaved] = useState(20000);
  const [monthly, setMonthly] = useState(400);
  const [ret, setRet] = useState(6);
  const [infl, setInfl] = useState(2.5);

  const years = Math.max(retireAge - age, 0);
  const i = ret / 100 / 12;
  const balByYear = [saved], contribByYear = [saved], rows: string[][] = [];
  let bal = saved, contr = saved;
  for (let m = 1; m <= years * 12; m++) {
    bal = bal * (1 + i) + monthly;
    contr += monthly;
    if (m % 12 === 0) { balByYear.push(bal); contribByYear.push(contr); rows.push([String(age + m / 12), fmt(contr), fmt(bal)]); }
  }
  const nestEgg = bal;
  const contributed = contr;
  const growth = Math.max(nestEgg - contributed, 0);
  const todayMoney = nestEgg / (1 + infl / 100) ** years;
  const retIncome = (nestEgg * 0.04) / 12;

  return (
    <>
      <Layout
        inputs={<>
          <SliderField label={t("calc.currentAge")} value={age} onChange={setAge} min={16} max={75} step={1} />
          <SliderField label={t("calc.retireAge")} value={retireAge} onChange={setRetireAge} min={40} max={80} step={1} />
          <SliderField label={t("calc.saved")} value={saved} onChange={setSaved} min={0} max={500000} step={1000} />
          <SliderField label={t("calc.monthly")} value={monthly} onChange={setMonthly} min={0} max={5000} step={25} />
          <SliderField label={t("calc.returnRate")} value={ret} onChange={setRet} min={0} max={12} step={0.1} suffix="%" />
          <SliderField label={t("calc.inflAdjustRate")} value={infl} onChange={setInfl} min={0} max={10} step={0.1} suffix="%" />
        </>}
        results={<>
          <ResultHero label={t("calc.nestEgg")} value={fmt(nestEgg)} color="#10B981" />
          <ResultRow label={t("calc.todaysMoney")} value={fmt(todayMoney)} />
          <ResultRow label={t("calc.retIncome")} value={fmt(retIncome)} />
        </>}
      />
      <Extras>
        <div className="grid gap-5 lg:grid-cols-2">
          <AreaChart title={t("calc.balanceOverTime")} series={[{ name: t("calc.nestEgg"), color: "#10B981", values: balByYear, area: true }, { name: t("calc.contributions"), color: "#8E8E93", values: contribByYear, dashed: true }]} fmt={fmt} />
          <SplitDonut title={t("calc.nestEgg")} parts={[{ label: t("calc.contributions"), value: contributed, color: "#8E8E93" }, { label: t("calc.growth"), value: growth, color: "#10B981" }]} centerTop={t("calc.nestEgg")} centerVal={fmt(nestEgg)} fmt={fmt} />
        </div>
        <Insight>{t("calc.ins.retire", { amtC: fmt(contributed), amtG: fmt(growth) })}</Insight>
        <ScheduleTable title={t("calc.showSchedule")} headers={[t("calc.currentAge"), t("calc.contributions"), t("calc.balanceCol")]} rows={rows} />
      </Extras>
    </>
  );
}

// ── ROI ──────────────────────────────────────────────────────────────────────

function Roi() {
  const { t, fmt } = useCalc();
  const [invested, setInvested] = useState(10000);
  const [final, setFinal] = useState(13500);
  const [years, setYears] = useState(3);

  const profit = final - invested;
  const roi = invested > 0 ? (profit / invested) * 100 : 0;
  const annualized = years > 0 && invested > 0 && final > 0 ? ((final / invested) ** (1 / years) - 1) * 100 : null;

  const series: number[] = [];
  if (years > 0 && invested > 0 && final > 0) {
    const g = (final / invested) ** (1 / years) - 1;
    for (let y = 0; y <= years; y++) series.push(invested * (1 + g) ** y);
  }

  return (
    <>
      <Layout
        inputs={<>
          <SliderField label={t("calc.amountInvested")} value={invested} onChange={setInvested} min={0} max={200000} step={500} />
          <SliderField label={t("calc.finalValue")} value={final} onChange={setFinal} min={0} max={400000} step={500} />
          <SliderField label={t("calc.yearsOptional")} value={years} onChange={setYears} min={0} max={40} step={1} />
        </>}
        results={<>
          <ResultHero label={t("calc.roiPct")} value={`${roi.toFixed(1)}%`} color="#A78BFA" />
          <ResultRow label={t("calc.netProfit")} value={fmt(profit)} />
          {annualized !== null && <ResultRow label={t("calc.annualizedRoi")} value={`${annualized.toFixed(1)}%`} />}
        </>}
      />
      <Extras>
        {series.length > 1
          ? <AreaChart title={t("calc.balanceOverTime")} series={[{ name: t("calc.finalValue"), color: "#A78BFA", values: series, area: true }]} fmt={fmt} />
          : <CompareBars title={t("calc.roiPct")} items={[{ label: t("calc.amountInvested"), value: invested, color: "#8E8E93" }, { label: t("calc.finalValue"), value: final, color: "#A78BFA" }]} fmt={fmt} />}
        <Insight>{annualized !== null ? t("calc.ins.roi", { pct: roi.toFixed(1), ann: annualized.toFixed(1) }) : t("calc.ins.roiSimple", { pct: roi.toFixed(1), amt: fmt(profit) })}</Insight>
      </Extras>
    </>
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
  "couple-expense-split-calculator": CoupleSplit,
  "loan-calculator": Loan,
  "monthly-budget-calculator": MonthlyBudget,
  "salary-calculator": Salary,
  "inflation-calculator": Inflation,
  "discount-calculator": Discount,
  "vat-calculator": Vat,
  "sales-tax-calculator": SalesTax,
  "simple-interest-calculator": SimpleInterest,
  "auto-loan-calculator": AutoLoan,
  "rent-affordability-calculator": RentAffordability,
  "debt-consolidation-calculator": DebtConsolidation,
  "retirement-calculator": Retirement,
  "roi-calculator": Roi,
};

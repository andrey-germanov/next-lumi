"use client";

import { useState } from "react";
import { useStore } from "@/components/dash/store";
import { useLang } from "@/components/dash/i18n";
import { PageHeader, Card, Money, PrimaryButton, fieldLabel, fieldInput } from "@/components/dash/ui";
import { AppIcon } from "@/components/dash/AppIcon";
import type { SavingsGoalCategory, SavingsGoalPriority } from "@/types/web";
import type { CurrencyCode } from "@/utils/currencyUtils";

const GOAL_TYPES: { value: SavingsGoalCategory; icon: string; color: string }[] = [
  { value: "emergency", icon: "🆘", color: "#0A8F5F" },
  { value: "vacation", icon: "🏖️", color: "#6C63FF" },
  { value: "purchase", icon: "🛍️", color: "#F472B6" },
  { value: "investment", icon: "📈", color: "#F59E0B" },
  { value: "education", icon: "🎓", color: "#FBBF24" },
  { value: "home", icon: "🏠", color: "#0EA5E9" },
  { value: "retirement", icon: "🌴", color: "#34D399" },
  { value: "gift", icon: "🎁", color: "#F87171" },
  { value: "custom", icon: "⭐", color: "#9C8FFF" },
];

const MILESTONES = [25, 50, 75, 100];

export default function GoalsPage() {
  const { goals, currency, addGoal, updateGoal, deleteGoal, contributeToGoal } = useStore();
  const { t, formatDate } = useLang();
  const [open, setOpen] = useState(false);
  const cur: CurrencyCode = currency.primary;

  const [editId, setEditId] = useState<string | null>(null);
  const [eName, setEName] = useState("");
  const [eTarget, setETarget] = useState("");
  const [ePriority, setEPriority] = useState<SavingsGoalPriority>("medium");
  const [eDeadline, setEDeadline] = useState("");

  function startEdit(g: (typeof goals)[number]) {
    setEditId(g.id);
    setEName(g.name);
    setETarget(String(g.targetAmount));
    setEPriority(g.priority);
    setEDeadline(g.deadline ?? "");
  }
  function saveEdit() {
    const tgt = parseFloat(eTarget);
    if (editId && eName.trim() && tgt > 0) {
      updateGoal(editId, { name: eName.trim(), targetAmount: tgt, priority: ePriority, deadline: eDeadline || undefined });
    }
    setEditId(null);
  }
  function handleDelete(id: string) {
    if (confirm(t("goal.deleteConfirm"))) deleteGoal(id);
  }

  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [start, setStart] = useState("");
  const [typeIdx, setTypeIdx] = useState(0);
  const [priority, setPriority] = useState<SavingsGoalPriority>("medium");
  const [deadline, setDeadline] = useState("");

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const tgt = parseFloat(target);
    if (!name.trim() || !tgt || tgt <= 0) return;
    const type = GOAL_TYPES[typeIdx];
    addGoal({
      name: name.trim(),
      targetAmount: tgt,
      currentAmount: parseFloat(start) || 0,
      category: type.value,
      priority,
      deadline: deadline || undefined,
      currency: cur,
      icon: type.icon,
      color: type.color,
    });
    setName(""); setTarget(""); setStart(""); setDeadline("");
    setOpen(false);
  }

  return (
    <>
      <PageHeader
        eyebrow={t("goal.eyebrow")}
        title={t("nav.goals")}
        subtitle={t("goal.subtitle")}
        action={<PrimaryButton onClick={() => setOpen((v) => !v)}>{open ? t("common.close") : t("goal.new")}</PrimaryButton>}
      />

      {open && (
        <Card style={{ marginBottom: 24, maxWidth: 680 }}>
          <form onSubmit={handleCreate}>
            <div className="grid gap-3 sm:grid-cols-2" style={{ marginBottom: 16 }}>
              <div>
                <label style={fieldLabel}>{t("common.name")}</label>
                <input type="text" required placeholder={t("goal.namePh")} value={name} onChange={(e) => setName(e.target.value)} style={fieldInput} />
              </div>
              <div>
                <label style={fieldLabel}>{t("goal.target", { cur })}</label>
                <input type="number" step="0.01" min="0" required placeholder="0.00" value={target} onChange={(e) => setTarget(e.target.value)} style={fieldInput} />
              </div>
              <div>
                <label style={fieldLabel}>{t("goal.saved", { cur })}</label>
                <input type="number" step="0.01" min="0" placeholder="0.00" value={start} onChange={(e) => setStart(e.target.value)} style={fieldInput} />
              </div>
              <div>
                <label style={fieldLabel}>{t("goal.deadlineOpt")}</label>
                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={fieldInput} />
              </div>
            </div>

            <label style={fieldLabel}>{t("common.type")}</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(92px, 1fr))", gap: 8, marginBottom: 16 }}>
              {GOAL_TYPES.map((gt, i) => (
                <button key={gt.value} type="button" onClick={() => setTypeIdx(i)}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "10px 6px", borderRadius: 12, cursor: "pointer",
                    background: typeIdx === i ? `${gt.color}14` : "#F7F7F8", border: typeIdx === i ? `1.5px solid ${gt.color}` : "1.5px solid transparent" }}>
                  <AppIcon name={gt.icon} color={gt.color} size={22} />
                  <span style={{ fontSize: 11, fontWeight: 500, color: "#0A0A0A" }}>{t(`goaltype.${gt.value}`)}</span>
                </button>
              ))}
            </div>

            <label style={fieldLabel}>{t("common.priority")}</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {(["high", "medium", "low"] as SavingsGoalPriority[]).map((p) => (
                <button key={p} type="button" onClick={() => setPriority(p)}
                  style={{ flex: 1, fontSize: 13, fontWeight: 600, padding: "9px", borderRadius: 10, cursor: "pointer",
                    background: priority === p ? "#6C63FF" : "#F7F7F8", color: priority === p ? "#fff" : "#63636B" }}>
                  {t(`common.${p}`)}
                </button>
              ))}
            </div>

            <PrimaryButton type="submit">{t("goal.create")}</PrimaryButton>
          </form>
        </Card>
      )}

      {goals.length === 0 ? (
        <Card><p style={{ fontSize: 14, color: "#8E8E93" }}>{t("goal.none")}</p></Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {goals.map((g) => {
            const pct = g.targetAmount > 0 ? Math.min((g.currentAmount / g.targetAmount) * 100, 100) : 0;
            const priorityText = t("goal.priorityLabel", { p: t(`common.${g.priority}`) });
            const deadlineText = g.deadline ? ` · ${t("goal.by", { date: formatDate(g.deadline, { month: "short", year: "numeric" }) })}` : "";
            return (
              <Card key={g.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 13, background: `${g.color}1A`, flexShrink: 0 }}>
                    <AppIcon name={g.icon} color={g.color} size={24} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A" }}>{g.name}</p>
                    <p style={{ fontSize: 12, color: "#8E8E93" }}>{priorityText}{deadlineText}</p>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    {g.isCompleted && <span style={{ fontSize: 11, fontWeight: 700, color: "#0A8F5F", background: "rgba(10,143,95,0.1)", padding: "4px 8px", borderRadius: 999, alignSelf: "center" }}>{t("goal.done")}</span>}
                    <button onClick={() => startEdit(g)} title={t("common.edit")} style={{ fontSize: 13, color: "#8E8E93", cursor: "pointer", padding: 4 }} className="hover:text-primary">✎</button>
                    <button onClick={() => handleDelete(g.id)} title={t("common.delete")} style={{ fontSize: 13, color: "#8E8E93", cursor: "pointer", padding: 4 }} className="hover:text-danger">✕</button>
                  </div>
                </div>

                {editId === g.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <input type="text" value={eName} onChange={(e) => setEName(e.target.value)} placeholder={t("common.name")} style={{ ...fieldInput, padding: "9px 12px", fontSize: 14 }} />
                    <input type="number" step="0.01" min="0" value={eTarget} onChange={(e) => setETarget(e.target.value)} placeholder={t("goal.target", { cur })} style={{ ...fieldInput, padding: "9px 12px", fontSize: 14 }} />
                    <input type="date" value={eDeadline} onChange={(e) => setEDeadline(e.target.value)} style={{ ...fieldInput, padding: "9px 12px", fontSize: 14 }} />
                    <div style={{ display: "flex", gap: 6 }}>
                      {(["high", "medium", "low"] as SavingsGoalPriority[]).map((p) => (
                        <button key={p} type="button" onClick={() => setEPriority(p)} style={{ flex: 1, fontSize: 12, fontWeight: 600, padding: "8px", borderRadius: 9, cursor: "pointer", background: ePriority === p ? "#6C63FF" : "#F7F7F8", color: ePriority === p ? "#fff" : "#63636B" }}>
                          {t(`common.${p}`)}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <PrimaryButton onClick={saveEdit} style={{ flex: 1, padding: "9px" }}>{t("common.save")}</PrimaryButton>
                      <button onClick={() => setEditId(null)} style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#63636B", background: "#F0F0F2", borderRadius: 12, cursor: "pointer" }}>{t("common.cancel")}</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                      <Money amount={g.currentAmount} currency={g.currency} style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: g.color }} />
                      <span style={{ fontSize: 13, color: "#63636B" }}>{t("common.of")} <Money amount={g.targetAmount} currency={g.currency} /></span>
                    </div>

                    <div style={{ height: 8, background: "#F0F0F2", borderRadius: 999, overflow: "hidden", marginBottom: 8 }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: g.color, borderRadius: 999, transition: "width 0.3s" }} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                      {MILESTONES.map((m) => (
                        <span key={m} style={{ fontSize: 11, fontWeight: 600, color: pct >= m ? g.color : "#C7C7CC" }}>
                          {pct >= m ? "●" : "○"} {m}%
                        </span>
                      ))}
                    </div>

                    <ContributeRow onAdd={(amt) => contributeToGoal(g.id, amt)} currency={g.currency} />
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

function ContributeRow({ onAdd, currency }: { onAdd: (amount: number) => void; currency: CurrencyCode }) {
  const { t } = useLang();
  const [val, setVal] = useState("");
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); const a = parseFloat(val); if (a > 0) { onAdd(a); setVal(""); } }}
      style={{ display: "flex", gap: 8 }}
    >
      <input type="number" step="0.01" min="0" placeholder={t("goal.addPh", { cur: currency })} value={val} onChange={(e) => setVal(e.target.value)}
        style={{ ...fieldInput, padding: "9px 12px", fontSize: 14 }} />
      <button type="submit" style={{ fontSize: 13, fontWeight: 600, color: "#fff", background: "#0A0A0A", borderRadius: 10, padding: "0 16px", cursor: "pointer", flexShrink: 0 }}>{t("goal.add")}</button>
    </form>
  );
}

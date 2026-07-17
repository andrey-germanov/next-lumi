// Server-safe calculator registry (no React). Used by routes, the hub, and the
// sitemap. The interactive components live in components/tools/calculators.tsx.

export interface ToolMeta {
  slug: string;
  titleKey: string;
  descKey: string;
  icon: string; // emoji → rendered via AppIcon
  color: string;
}

export const TOOLS: ToolMeta[] = [
  { slug: "compound-interest-calculator", titleKey: "calc.ci.title", descKey: "calc.ci.desc", icon: "📈", color: "#6C63FF" },
  { slug: "50-30-20-budget-calculator", titleKey: "calc.budget.title", descKey: "calc.budget.desc", icon: "🧾", color: "#34D399" },
  { slug: "emergency-fund-calculator", titleKey: "calc.emergency.title", descKey: "calc.emergency.desc", icon: "🛟", color: "#F59E0B" },
  { slug: "savings-goal-calculator", titleKey: "calc.savings.title", descKey: "calc.savings.desc", icon: "🎯", color: "#0EA5E9" },
  { slug: "debt-payoff-calculator", titleKey: "calc.debt.title", descKey: "calc.debt.desc", icon: "💳", color: "#F87171" },
  { slug: "fire-calculator", titleKey: "calc.fire.title", descKey: "calc.fire.desc", icon: "🔥", color: "#A78BFA" },
  { slug: "subscription-cost-calculator", titleKey: "calc.subs.title", descKey: "calc.subs.desc", icon: "🔁", color: "#EC4899" },
  { slug: "couple-expense-split-calculator", titleKey: "calc.split.title", descKey: "calc.split.desc", icon: "💞", color: "#FB7185" },
];

export const TOOL_SLUGS = TOOLS.map((t) => t.slug);

export function getTool(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

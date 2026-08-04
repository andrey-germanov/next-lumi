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
  { slug: "loan-calculator", titleKey: "calc.loan.title", descKey: "calc.loan.desc", icon: "💰", color: "#6C63FF" },
  { slug: "monthly-budget-calculator", titleKey: "calc.mbudget.title", descKey: "calc.mbudget.desc", icon: "📊", color: "#34D399" },
  { slug: "salary-calculator", titleKey: "calc.salary.title", descKey: "calc.salary.desc", icon: "💵", color: "#0EA5E9" },
  { slug: "inflation-calculator", titleKey: "calc.infl.title", descKey: "calc.infl.desc", icon: "📉", color: "#F59E0B" },
  { slug: "discount-calculator", titleKey: "calc.disc.title", descKey: "calc.disc.desc", icon: "🏷️", color: "#EC4899" },
  { slug: "vat-calculator", titleKey: "calc.vat.title", descKey: "calc.vat.desc", icon: "🧮", color: "#0EA5E9" },
  { slug: "sales-tax-calculator", titleKey: "calc.stax.title", descKey: "calc.stax.desc", icon: "🛒", color: "#A78BFA" },
  { slug: "simple-interest-calculator", titleKey: "calc.si.title", descKey: "calc.si.desc", icon: "➗", color: "#34D399" },
  { slug: "auto-loan-calculator", titleKey: "calc.auto.title", descKey: "calc.auto.desc", icon: "🚗", color: "#F87171" },
  { slug: "rent-affordability-calculator", titleKey: "calc.rent.title", descKey: "calc.rent.desc", icon: "🏠", color: "#6C63FF" },
  { slug: "debt-consolidation-calculator", titleKey: "calc.consol.title", descKey: "calc.consol.desc", icon: "🔗", color: "#FB7185" },
  { slug: "retirement-calculator", titleKey: "calc.ret.title", descKey: "calc.ret.desc", icon: "🌴", color: "#10B981" },
  { slug: "roi-calculator", titleKey: "calc.roi.title", descKey: "calc.roi.desc", icon: "💹", color: "#A78BFA" },
];

export const TOOL_SLUGS = TOOLS.map((t) => t.slug);

export function getTool(slug: string): ToolMeta | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

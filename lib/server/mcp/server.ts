// The Lumi MCP server: read-only tools over the user's synced finances. A new
// McpServer is built per request (stateless transport), bound to the uid from
// the OAuth access token — tools never take a user id as input.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  accountBalances,
  averageRows,
  budgetsForMonth,
  categoryBreakdown,
  categoryTrends,
  completeMonths,
  currentMonthToDate,
  inRange,
  makeCtx,
  monthRows,
  recurringCommitments,
  round,
  savingsGoals,
  shiftMonth,
  topMerchants,
  type Ctx,
} from "./analytics";

const INSTRUCTIONS = `Lumi is a personal finance app. These tools read the user's own expenses, income, budgets, savings goals, recurring payments and accounts (read-only).

How to work with them:
- For open questions ("how can I save 15% more?", "where does my money go?") start with get_financial_overview, then drill down with get_spending_by_category, get_top_merchants, get_recurring_payments or list_transactions before giving advice. Base every recommendation on the user's actual numbers and name concrete categories, merchants and amounts.
- All amounts are converted into one currency (the user's main currency unless you pass "currency"). Pass "timezone" (IANA, e.g. "Europe/Kyiv") when you know it so months match the app.
- Definitions: expenses exclude transfers into savings goals; income excludes withdrawals from goals; savedToGoals = net money moved into savings goals; net = income − expenses; savingsRatePct = net / income.
- The current month is incomplete: averages use complete months only; compare the current month using expensesPaceForFullMonth.
- Users don't always log income. If income is 0 or clearly incomplete, say so and ask for their monthly income instead of assuming.
- Category and merchant names are the user's own; quote them as-is.`;

const currency = z
  .string()
  .regex(/^[A-Za-z]{3}$/)
  .optional()
  .describe("ISO 4217 code to report amounts in. Defaults to the user's main currency.");
const timezone = z.string().optional().describe('IANA timezone for month/day boundaries, e.g. "Europe/Berlin". Defaults to UTC.');
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD");

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false } as const;

const ok = (result: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(result) }] });
const fail = (message: string) => ({ content: [{ type: "text" as const, text: message }], isError: true });

/** Default range: the last `months` complete months plus the current month to date. */
function range(ctx: Ctx, from?: string, to?: string, months = 3) {
  return {
    from: from ?? `${shiftMonth(ctx.today.slice(0, 7), -months)}-01`,
    to: to ?? ctx.today,
  };
}

export function createLumiMcpServer(uid: string, premium: boolean): McpServer {
  const server = new McpServer({ name: "lumi", title: "Lumi", version: "1.0.0" }, { instructions: INSTRUCTIONS });

  /** Wraps a tool body: Premium gate, shared context, errors as tool errors the agent can relay. */
  const run =
    <A extends { currency?: string; timezone?: string }>(fn: (ctx: Ctx, args: A) => unknown) =>
    async (args: A) => {
      if (!premium) {
        return fail("The Lumi connector needs an active Lumi Pro subscription. Tell the user to upgrade in the Lumi app, then try again.");
      }
      try {
        const ctx = await makeCtx(uid, args.currency, args.timezone);
        if (ctx.data.txns.length === 0) {
          return fail("No synced transactions found. The user should open the Lumi app while signed in so their data syncs, then try again.");
        }
        return ok({ currency: ctx.base, ...(fn(ctx, args) as object) });
      } catch (error) {
        console.error("[mcp] tool failed", error);
        return fail(error instanceof Error ? error.message : "Failed to read Lumi data");
      }
    };

  server.registerTool(
    "get_financial_overview",
    {
      title: "Financial overview",
      description:
        "Big picture of the user's finances: monthly income, expenses, savings rate and net for recent complete months, the current month so far, biggest spending categories with trends, recurring commitments, budgets and savings goals. Start here for any open-ended question about saving, spending or financial health.",
      inputSchema: {
        months: z.number().int().min(1).max(24).default(6).describe("How many complete months to analyse."),
        currency,
        timezone,
      },
      annotations: READ_ONLY,
    },
    run((ctx, { months }: { months: number; currency?: string; timezone?: string }) => {
      const monthsList = completeMonths(ctx, months);
      const rows = monthRows(ctx, monthsList);
      // Complete months only: from the first listed month to the last day of the previous one.
      const breakdown = categoryBreakdown(ctx, `${monthsList[0]}-01`, shiftDay(`${ctx.today.slice(0, 7)}-01`), "expense", 3);
      const trends = new Map(categoryTrends(ctx, Math.min(3, Math.max(1, Math.floor(months / 2)))).map((t) => [t.categoryId, t.changePct]));
      const recurring = recurringCommitments(ctx);
      const first = ctx.data.txns[ctx.data.txns.length - 1];
      return {
        today: ctx.today,
        dataCoverage: { firstTransaction: ctx.dayKey(first.date), totalTransactions: ctx.data.txns.length },
        monthly: rows,
        averagePerMonth: averageRows(rows),
        currentMonthToDate: currentMonthToDate(ctx),
        topCategories: breakdown.categories.slice(0, 10).map((c) => ({
          category: c.category,
          avgPerMonth: c.avgPerMonth,
          sharePct: c.sharePct,
          recentTrendPct: trends.get(c.categoryId) ?? null,
          topMerchants: c.topMerchants,
        })),
        recurring: {
          monthlyRecurringExpenses: recurring.monthlyRecurringExpenses,
          monthlyRecurringIncome: recurring.monthlyRecurringIncome,
          biggest: recurring.templates.slice(0, 10),
          detectedRepeatingCharges: recurring.detectedRepeatingCharges.slice(0, 10),
        },
        budgetsThisMonth: budgetsForMonth(ctx, ctx.today.slice(0, 7)),
        savingsGoals: savingsGoals(ctx),
      };
    }),
  );

  server.registerTool(
    "get_monthly_summary",
    {
      title: "Monthly summary",
      description: "Income, expenses, money saved to goals, net and savings rate per month, optionally with spending per category for each month.",
      inputSchema: {
        months: z.number().int().min(1).max(36).default(12).describe("Number of months, ending with the current month."),
        byCategory: z.boolean().default(false).describe("Also return spending per category for every month."),
        currency,
        timezone,
      },
      annotations: READ_ONLY,
    },
    run((ctx, { months, byCategory }: { months: number; byCategory: boolean; currency?: string; timezone?: string }) => {
      const current = ctx.today.slice(0, 7);
      const list = Array.from({ length: months }, (_, i) => shiftMonth(current, i - months + 1));
      const rows = monthRows(ctx, list);
      if (!byCategory) return { months: rows };
      return {
        months: rows.map((r) => {
          const end = r.month === current ? ctx.today : `${r.month}-31`;
          const cats = categoryBreakdown(ctx, `${r.month}-01`, end, "expense", 0).categories;
          return { ...r, categories: Object.fromEntries(cats.map((c) => [c.category, c.total])) };
        }),
      };
    }),
  );

  server.registerTool(
    "get_spending_by_category",
    {
      title: "Spending by category",
      description: "Totals per category for a date range with share of total, average per month, average ticket and top merchants in each category. Use kind=income for income sources.",
      inputSchema: {
        from: day.optional().describe("Start date, inclusive. Defaults to 3 months ago."),
        to: day.optional().describe("End date, inclusive. Defaults to today."),
        kind: z.enum(["expense", "income"]).default("expense"),
        currency,
        timezone,
      },
      annotations: READ_ONLY,
    },
    run((ctx, args: { from?: string; to?: string; kind: "expense" | "income"; currency?: string; timezone?: string }) => {
      const r = range(ctx, args.from, args.to);
      return { ...r, ...categoryBreakdown(ctx, r.from, r.to, args.kind) };
    }),
  );

  server.registerTool(
    "get_top_merchants",
    {
      title: "Top merchants",
      description: "Where the money goes by merchant/payee for a date range: total, number of purchases, average ticket, average per month and in how many months the merchant appears.",
      inputSchema: {
        from: day.optional().describe("Start date, inclusive. Defaults to 3 months ago."),
        to: day.optional().describe("End date, inclusive. Defaults to today."),
        limit: z.number().int().min(1).max(100).default(25),
        currency,
        timezone,
      },
      annotations: READ_ONLY,
    },
    run((ctx, args: { from?: string; to?: string; limit: number; currency?: string; timezone?: string }) => {
      const r = range(ctx, args.from, args.to);
      return { ...r, merchants: topMerchants(ctx, r.from, r.to, args.limit) };
    }),
  );

  server.registerTool(
    "get_recurring_payments",
    {
      title: "Recurring payments",
      description: "Recurring expenses and income the user set up in Lumi (rent, subscriptions, salary…) with their monthly equivalent, plus repeating charges detected from history that may be untracked subscriptions.",
      inputSchema: { currency, timezone },
      annotations: READ_ONLY,
    },
    run((ctx) => recurringCommitments(ctx)),
  );

  server.registerTool(
    "get_budgets_and_goals",
    {
      title: "Budgets and savings goals",
      description: "Category budgets for a month (limit, spent, remaining, % used vs % of month elapsed) and all savings goals (progress, deadline, amount needed per month, recent contribution pace).",
      inputSchema: {
        month: z.string().regex(/^\d{4}-\d{2}$/).optional().describe("YYYY-MM. Defaults to the current month."),
        currency,
        timezone,
      },
      annotations: READ_ONLY,
    },
    run((ctx, { month }: { month?: string; currency?: string; timezone?: string }) => ({
      month: month ?? ctx.today.slice(0, 7),
      budgets: budgetsForMonth(ctx, month ?? ctx.today.slice(0, 7)),
      savingsGoals: savingsGoals(ctx),
    })),
  );

  server.registerTool(
    "get_accounts",
    {
      title: "Accounts and balances",
      description: "The user's accounts (cards, cash, bank accounts) with current balances in each account's currency and in the report currency.",
      inputSchema: { currency, timezone },
      annotations: READ_ONLY,
    },
    run((ctx) => {
      const accounts = accountBalances(ctx);
      return {
        accounts,
        totalInBase: round(accounts.filter((a) => !a.archived).reduce((s, a) => s + a.balanceInBase, 0)),
      };
    }),
  );

  server.registerTool(
    "list_transactions",
    {
      title: "List transactions",
      description: "Individual transactions, newest first, filtered by date range, type, category, text search (merchant, note, tags) and amount. Use it to inspect specific purchases behind a total.",
      inputSchema: {
        from: day.optional().describe("Start date, inclusive. Defaults to 3 months ago."),
        to: day.optional().describe("End date, inclusive. Defaults to today."),
        kind: z.enum(["expense", "income", "all"]).default("all"),
        category: z.string().optional().describe("Category name or id (case-insensitive)."),
        search: z.string().optional().describe("Substring matched against merchant/source, note and tags."),
        minAmount: z.number().optional().describe("In the report currency."),
        maxAmount: z.number().optional().describe("In the report currency."),
        limit: z.number().int().min(1).max(500).default(100),
        currency,
        timezone,
      },
      annotations: READ_ONLY,
    },
    run(
      (
        ctx,
        args: {
          from?: string;
          to?: string;
          kind: "expense" | "income" | "all";
          category?: string;
          search?: string;
          minAmount?: number;
          maxAmount?: number;
          limit: number;
          currency?: string;
          timezone?: string;
        },
      ) => {
        const r = range(ctx, args.from, args.to);
        const cat = args.category?.toLowerCase();
        const q = args.search?.toLowerCase();
        const matched = inRange(ctx, r.from, r.to).filter((t) => {
          if (args.kind !== "all" && t.kind !== args.kind) return false;
          if (cat && t.categoryName.toLowerCase() !== cat && t.categoryId.toLowerCase() !== cat) return false;
          if (q && ![t.title, t.note ?? "", ...(t.tags ?? [])].some((s) => s.toLowerCase().includes(q))) return false;
          const v = ctx.inBase(t);
          if (args.minAmount !== undefined && v < args.minAmount) return false;
          if (args.maxAmount !== undefined && v > args.maxAmount) return false;
          return true;
        });
        return {
          ...r,
          matched: matched.length,
          totalInBase: round(matched.reduce((s, t) => s + (t.kind === "income" ? 1 : -1) * ctx.inBase(t), 0)),
          truncated: matched.length > args.limit,
          transactions: matched.slice(0, args.limit).map((t) => ({
            date: ctx.dayKey(t.date),
            type: t.isSavingsMove ? (t.kind === "expense" ? "to_savings_goal" : "from_savings_goal") : t.kind,
            title: t.title,
            category: t.categoryName,
            amount: t.amount,
            currency: t.currency,
            amountInBase: round(ctx.inBase(t)),
            note: t.note,
            tags: t.tags,
            recurring: t.isRecurring || undefined,
            city: t.city,
            addedBy: t.author,
          })),
        };
      },
    ),
  );

  return server;
}

/** Day before a YYYY-MM-DD date. */
function shiftDay(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

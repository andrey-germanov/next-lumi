// Lumi messaging — manual campaigns (admin only, see lib/server/messaging/admin.ts).
//   GET  → recent campaigns
//   POST { channel: "push" | "email", audience, title?, subject?, body, deepLink?, cta?, dryRun? }
//        → { recipients } for a dry run, else { id, recipients, sent, failed, … }
import { handle, json, readJson, HttpError } from "@/lib/server/http";
import { requireAdmin } from "@/lib/server/messaging/admin";
import { listCampaigns, parseCampaign, runCampaign } from "@/lib/server/messaging/campaigns";
import { EmailConfigError } from "@/lib/server/messaging/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req: Request) {
  return handle(async () => {
    requireAdmin(req);
    return json({ campaigns: await listCampaigns() });
  });
}

export async function POST(req: Request) {
  return handle(async () => {
    requireAdmin(req);
    const input = parseCampaign(await readJson(req));
    try {
      return json(await runCampaign(input));
    } catch (error) {
      if (error instanceof EmailConfigError) throw new HttpError(503, "email_not_configured", { missing: error.missing });
      throw error;
    }
  });
}

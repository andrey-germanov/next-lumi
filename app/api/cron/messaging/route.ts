// Daily cron (vercel.json): welcome emails for accounts created in the last 72 h.
// Vercel sends `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is set.
import { handle, json, HttpError } from "@/lib/server/http";
import { runWelcomeSweep } from "@/lib/server/messaging/triggers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req: Request) {
  return handle(async () => {
    const secret = process.env.CRON_SECRET;
    if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) throw new HttpError(401, "unauthorized");
    return json({ welcome: await runWelcomeSweep() });
  });
}

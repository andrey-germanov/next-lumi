// POST /api/groups/:action — authenticated shared-expense group operations.
// Auth: `Authorization: Bearer <Firebase ID token>`.
import { handle, json, readJson, requireUser, HttpError } from "@/lib/server/http";
import {
  cleanupAccount,
  createGroup,
  deleteGroup,
  inviteOperation,
  joinGroup,
  keepActive,
  memberOperation,
  notifyActivity,
  publicLinkOperation,
} from "@/lib/server/groups";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request, ctx: { params: Promise<{ action: string }> }) {
  return handle(async () => {
    const { action } = await ctx.params;
    const user = await requireUser(req);
    const body = await readJson(req);

    switch (action) {
      case "create":
        return json(await createGroup(user.uid, body));
      case "join":
        return json(await joinGroup(user.uid, user.name, body));
      case "members":
        return json(await memberOperation(user.uid, body));
      case "delete":
        return json(await deleteGroup(user.uid, body));
      case "invite":
        return json(await inviteOperation(user.uid, body));
      case "public-link":
        return json(await publicLinkOperation(user.uid, body));
      case "keep-active":
        return json(await keepActive(user.uid, body));
      case "notify":
        return json(await notifyActivity(user.uid, body));
      case "account-cleanup":
        return json(await cleanupAccount(user.uid));
      default:
        throw new HttpError(404, "unknown_action");
    }
  });
}

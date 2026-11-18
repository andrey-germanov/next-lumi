// Email unsubscribe. Links are signed per address (lib/server/messaging/email.ts).
//   GET  → a confirm page with a button. Not an instant unsubscribe: mail
//          scanners prefetch links, and that would unsubscribe people silently.
//   POST → unsubscribes. Used by the page's button and by Gmail/Apple Mail's
//          one-click "Unsubscribe" (RFC 8058, List-Unsubscribe-Post).
import { suppressEmail, verifyUnsubscribe } from "@/lib/server/messaging/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const page = (title: string, body: string, status = 200) =>
  new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} · Lumi</title>
<style>:root{color-scheme:light dark}body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9f9fd;color:#1a1b2e;padding:16px}
@media (prefers-color-scheme:dark){body{background:#0B0D1E;color:#eef0ff}.card{background:#181D30!important}}
.card{background:#fff;border-radius:20px;padding:32px 28px;max-width:420px;width:100%;text-align:center}h1{font-size:22px;margin:0 0 10px}p{opacity:.75;line-height:1.5;margin:0 0 20px}
button{background:#6C63FF;color:#fff;border:0;border-radius:14px;padding:14px 22px;font-size:16px;font-weight:600;cursor:pointer}</style></head>
<body><div class="card">${body}</div></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );

const invalid = () => page("Link expired", "<h1>This link doesn't work</h1><p>It may be incomplete. Use the Unsubscribe link from the latest Lumi email.</p>", 400);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const e = url.searchParams.get("e");
  const t = url.searchParams.get("t");
  let email: string | null = null;
  try {
    email = verifyUnsubscribe(e, t);
  } catch {
    return invalid();
  }
  if (!email) return invalid();
  const masked = email.replace(/^(.)(.*)(@.*)$/, (_, a: string, b: string, c: string) => a + "•".repeat(Math.min(b.length, 6)) + c);
  return page(
    "Unsubscribe",
    `<h1>Unsubscribe from Lumi emails?</h1><p>${masked} will stop getting emails from Lumi.</p>
<form method="post" action="/api/messaging/unsubscribe?e=${encodeURIComponent(e!)}&t=${encodeURIComponent(t!)}"><button type="submit">Unsubscribe</button></form>`,
  );
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  let email: string | null = null;
  try {
    email = verifyUnsubscribe(url.searchParams.get("e"), url.searchParams.get("t"));
  } catch {
    return invalid();
  }
  if (!email) return invalid();
  await suppressEmail(email, "link");
  return page("Unsubscribed", "<h1>You're unsubscribed</h1><p>You won't get emails from Lumi anymore. The app keeps working as usual.</p>");
}

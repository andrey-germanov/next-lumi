// Email layout shared by the sender (lib/server/messaging/email.ts) and the
// live preview on /admin/messaging, so the preview is the exact email.
// Pure — no Node APIs — so it can run in the browser.

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Plain text → paragraphs; bare URLs become links. Good enough for campaign copy. */
function textToHtml(text: string): string {
  return text
    .trim()
    .split(/\n{2,}/)
    .map((paragraph) => {
      const html = escapeHtml(paragraph)
        .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#6C63FF">$1</a>')
        .replace(/\n/g, "<br>");
      return `<p style="margin:0 0 16px">${html}</p>`;
    })
    .join("");
}

export interface EmailContent {
  subject: string;
  /** Plain text; blank lines separate paragraphs. */
  body: string;
  cta?: { label: string; url: string };
  /** Footer line under the unsubscribe link, already localized. */
  footer?: { reason: string; unsubscribe: string };
}

const DEFAULT_FOOTER = {
  reason: "You're receiving this because you have a Lumi account.",
  unsubscribe: "Unsubscribe",
};

export function renderEmailLayout(content: EmailContent, unsub: string): { html: string; text: string } {
  const footer = content.footer ?? DEFAULT_FOOTER;
  const cta = content.cta
    ? `<p style="margin:24px 0 8px"><a href="${escapeHtml(content.cta.url)}" style="display:inline-block;background:#6C63FF;color:#fff;text-decoration:none;font-weight:600;padding:14px 22px;border-radius:14px">${escapeHtml(content.cta.label)}</a></p>`
    : "";
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(content.subject)}</title></head>
<body style="margin:0;background:#f9f9fd;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1b2e">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9fd"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">
<tr><td style="padding:0 4px 20px;font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#6C63FF">Lumi</td></tr>
<tr><td style="background:#fff;border-radius:20px;padding:28px 24px;font-size:16px;line-height:1.55">${textToHtml(content.body)}${cta}</td></tr>
<tr><td style="padding:20px 4px;font-size:12px;line-height:1.5;color:#8a8ca3">${escapeHtml(footer.reason)}<br><a href="${unsub}" style="color:#8a8ca3">${escapeHtml(footer.unsubscribe)}</a></td></tr>
</table></td></tr></table></body></html>`;
  const text = `${content.body.trim()}${content.cta ? `\n\n${content.cta.label}: ${content.cta.url}` : ""}\n\n—\n${footer.reason}\n${footer.unsubscribe}: ${unsub}`;
  return { html, text };
}

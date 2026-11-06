import { NextRequest, NextResponse } from "next/server";
import { PREFIXED_LOCALES } from "@/lib/i18n";
import { SITE_URL } from "@/lib/constants";

// llms-visibility: markdown alternates for blog posts and calculators.
//  - `/blog/<slug>.md` (and locale-prefixed) → rewritten to the markdown route.
//  - `Accept: text/markdown` on the HTML URL → same markdown body, only when the
//    client explicitly prefers markdown over HTML (q-values; ties go to HTML).
//  - HTML responses advertise the markdown URL via a Link header and set Vary.

const MD_PREFIX = "/agent-md";
// Routes with a markdown twin: `blog/<slug>`, `tools/<slug>`, and `faq`.
const LOCALE_GROUP = `(?:(${PREFIXED_LOCALES.join("|")})/)?`;
const ROUTE_GROUP = `(blog/[^/]+?|tools/[^/]+?|faq)`;
const PAGE_RE = new RegExp(`^/${LOCALE_GROUP}${ROUTE_GROUP}/?$`);
const MD_RE = new RegExp(`^/${LOCALE_GROUP}${ROUTE_GROUP}\\.md$`);

/** q-value of an explicit media type in an Accept header (0 when absent). */
function explicitQ(accept: string, type: string): number {
  for (const part of accept.split(",")) {
    const [range, ...params] = part.trim().split(";");
    if (range.trim().toLowerCase() !== type) continue;
    const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
    const value = q ? Number(q.slice(2)) : 1;
    return Number.isNaN(value) ? 0 : value;
  }
  return 0;
}

// q-value of text/html, falling back to the wildcard range when there is no explicit entry.
function htmlQ(accept: string): number {
  const explicit = explicitQ(accept, "text/html");
  if (explicit > 0 || accept.includes("text/html")) return explicit;
  return explicitQ(accept, "*/*");
}

function wantsMarkdown(accept: string): boolean {
  const md = explicitQ(accept, "text/markdown");
  return md > 0 && md > htmlQ(accept);
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const accept = request.headers.get("accept") ?? "";

  const mdMatch = pathname.match(MD_RE);
  if (mdMatch) {
    const [, locale, route] = mdMatch;
    const target = request.nextUrl.clone();
    target.pathname = `${MD_PREFIX}${locale ? `/${locale}` : ""}/${route}`;
    return NextResponse.rewrite(target);
  }

  const pageMatch = pathname.match(PAGE_RE);
  if (!pageMatch) return NextResponse.next();

  const [, locale, route] = pageMatch;
  const mdPath = `${locale ? `/${locale}` : ""}/${route}`;
  if (wantsMarkdown(accept)) {
    const response = NextResponse.rewrite(new URL(`${MD_PREFIX}${mdPath}${search}`, request.url));
    response.headers.set("Vary", "Accept");
    return response;
  }

  const response = NextResponse.next();
  response.headers.set("Vary", "Accept");
  response.headers.set("Link", `<${SITE_URL}${mdPath}.md>; rel="alternate"; type="text/markdown"`);
  return response;
}

export const config = {
  // Skip Next internals and static files; everything else is checked above.
  matcher: ["/((?!_next/|api/|images/|favicon|apple-icon|icon|opengraph-image|.*\\.(?!md$)[a-zA-Z0-9]+$).*)"],
};

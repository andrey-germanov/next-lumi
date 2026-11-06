import { markdownSegments, postMarkdown, toolMarkdown } from "@/lib/markdown";

// Internal target of the rewrites in proxy.ts: `/blog/<slug>.md` and
// `Accept: text/markdown` requests land here. Prerendered at build time, so
// no runtime filesystem access.
export const dynamicParams = false;

export function generateStaticParams() {
  return markdownSegments().map((path) => ({ path }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const [first, second, third] = path;

  let body: string | null = null;
  if (first === "tools" && second) {
    body = toolMarkdown(second);
  } else if (first === "blog" && second) {
    body = postMarkdown(second);
  } else if (second === "blog" && third) {
    body = postMarkdown(third, first);
  }

  if (!body) return new Response("Not found", { status: 404 });
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Vary: "Accept",
    },
  });
}

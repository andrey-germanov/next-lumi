import { llmsFullText } from "@/lib/markdown";

// Full-content companion to /llms.txt (https://llmstxt.org). Regenerated at build time.
export const dynamic = "force-static";

export async function GET() {
  return new Response(llmsFullText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

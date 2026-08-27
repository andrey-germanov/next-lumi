import { renderOgImage, ogImageSize } from "@/lib/og-image";
import { getPostBySlug } from "@/lib/blog";

export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  // Use the part before the first colon as the headline, and turn the
  // descriptive tail ("A vs B vs C") into a compact subtitle. When there's no
  // colon, show the full title with no subtitle.
  const [head, ...rest] = post.title.split(":");
  const tail = rest.join(":").trim();
  const title = head.trim();
  const subtitle = tail ? tail.replace(/\s+vs\.?\s+/gi, " · ") : undefined;

  // Eyebrow: leading word of the first tag + the post's year, e.g. "BUDGETING · 2026".
  const year = (post.date ?? "").slice(0, 4);
  const firstTag = post.tags?.[0]?.split(" ")[0];
  const eyebrow = [firstTag ? firstTag.toUpperCase() : "GUIDE", year]
    .filter(Boolean)
    .join(" · ");

  return renderOgImage(title, subtitle, eyebrow);
}

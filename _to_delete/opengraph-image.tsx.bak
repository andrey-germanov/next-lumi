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
  return renderOgImage(post.title, post.description);
}

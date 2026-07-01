import { renderOgImage, ogImageSize } from "@/lib/og-image";

export const alt = "Lumi — Privacy Policy";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage("Privacy Policy", "How Lumi handles your data.");
}

import { renderOgImage, ogImageSize } from "@/lib/og-image";

export const alt = "Lumi — Terms of Service";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage("Terms of Service");
}

import { renderOgImage, ogImageSize } from "@/lib/og-image";

export const alt = "Lumi — Frequently Asked Questions";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage(
    "Frequently Asked Questions",
    "Privacy, logging, forecasting, and pricing — answered."
  );
}

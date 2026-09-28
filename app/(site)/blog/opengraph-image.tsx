import { renderOgImage, ogImageSize } from "@/lib/og-image";

export const alt = "Lumi Blog — Personal Finance Tips";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage(
    "Lumi Blog",
    "Tips on personal finance, budgeting, and expense tracking."
  );
}

import { renderOgImage, ogImageSize } from "@/lib/og-image";

export const alt = "Lumi — AI Expense Tracker";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function Image() {
  return renderOgImage(
    "AI Expense Tracker",
    "Scan Receipts · Speak Expenses · Any Currency · No Bank Login"
  );
}

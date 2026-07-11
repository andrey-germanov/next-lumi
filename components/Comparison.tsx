"use client";

import { motion } from "framer-motion";
import { COMPARISON_DATA } from "@/lib/constants";
import { useLang } from "@/components/dash/i18n";

// Feature-row labels, in the same order as COMPARISON_DATA.
const FEATURE_KEYS = [
  "lp2.compFeatBackTap",
  "lp2.compFeatApplePay",
  "lp2.compFeatForecast",
  "lp2.compFeatReceipt",
  "lp2.compFeatVoice",
  "lp2.compFeatBankLogin",
  "lp2.compFeatOffline",
  "lp2.compFeatOnDevice",
  "lp2.compFeatPrice",
];

// Translatable cell text → i18n key. Symbols (✓, —) and prices pass through.
const CELL_KEYS: Record<string, string> = {
  "Basic": "lp2.compBasic",
  "Basic OCR": "lp2.compBasicOcr",
  "Never": "lp2.compNever",
  "Required": "lp2.compRequired",
  "Cloud": "lp2.compCloud",
  "Free / $4.99/mo": "lp2.compPriceLumi",
};

function CellValue({ value, display, isLumi }: { value: string; display: string; isLumi?: boolean }) {
  const partial = ["Basic", "Basic OCR"];
  const negative = ["Cloud", "Required"];

  if (isLumi) {
    return <span className="font-medium text-success">{display}</span>;
  }
  if (partial.includes(value)) {
    return <span className="text-warning">{display}</span>;
  }
  if (negative.includes(value)) {
    return <span className="text-text-muted/50">{display}</span>;
  }
  return <span className="text-text-muted">{display}</span>;
}

export default function Comparison() {
  const { t } = useLang();
  const tCell = (v: string) => (CELL_KEYS[v] ? t(CELL_KEYS[v]) : v);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ letterSpacing: "-1px" }}>
            {t("lp2.compTitle")}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 overflow-x-auto"
        >
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-black/12">
                <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                  {t("lp2.compFeature")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-primary">
                  Lumi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                  YNAB ($109/yr)
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                  Monarch ($100/yr)
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                  Copilot ($96/yr)
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">
                  Wally ($40/yr)
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DATA.map((row, i) => (
                <tr
                  key={row.feature}
                  className="border-b border-black/8 transition-colors hover:bg-black/[0.03]"
                >
                  <td className="px-4 py-3 text-sm font-medium text-text">
                    {t(FEATURE_KEYS[i])}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <CellValue value={row.lumi} display={tCell(row.lumi)} isLumi />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <CellValue value={row.ynab} display={tCell(row.ynab)} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <CellValue value={row.monarch} display={tCell(row.monarch)} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <CellValue value={row.copilot} display={tCell(row.copilot)} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <CellValue value={row.wally} display={tCell(row.wally)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}

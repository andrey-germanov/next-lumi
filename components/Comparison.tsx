"use client";

import { motion } from "framer-motion";
import { COMPARISON_DATA } from "@/lib/constants";

function CellValue({ value, isLumi }: { value: string; isLumi?: boolean }) {
  const positive = ["AI Vision", "Auto-convert", "No", "Yes", "Local storage", "Free / Premium"];
  const partial = ["Limited", "Basic"];
  const negative = ["No", "Cloud"];

  if (isLumi) {
    return <span className="font-medium text-success">{value}</span>;
  }
  if (positive.includes(value) && !isLumi) {
    // "No" for bank login required is good for lumi, bad for others
    return <span className="text-text-muted">{value}</span>;
  }
  if (partial.includes(value)) {
    return <span className="text-warning">{value}</span>;
  }
  if (value === "Yes" || negative.includes(value)) {
    return <span className="text-text-muted/50">{value}</span>;
  }
  return <span className="text-text-muted">{value}</span>;
}

export default function Comparison() {
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
            How Lumi compares to other budget apps
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
                  Feature
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
              {COMPARISON_DATA.map((row) => (
                <tr
                  key={row.feature}
                  className="border-b border-black/8 transition-colors hover:bg-black/[0.03]"
                >
                  <td className="px-4 py-3 text-sm font-medium text-text">
                    {row.feature}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <CellValue value={row.lumi} isLumi />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <CellValue value={row.ynab} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <CellValue value={row.monarch} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <CellValue value={row.copilot} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <CellValue value={row.wally} />
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

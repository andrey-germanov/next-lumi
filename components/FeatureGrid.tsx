"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import MarkTitle from "./MarkTitle";
import { useLang } from "@/components/dash/i18n";

// Same order and marker colours as App Store slides 3–8.
const CARDS = [
  { key: "home", marker: "#D6CCFF", h: 1116 },
  { key: "map", marker: "#B2E8D2", h: 1395 },
  { key: "voice", marker: "#FFD0B0", h: 1252 },
  { key: "insights", marker: "#FFDB85", h: 1149 },
  { key: "budgets", marker: "#FFC2D7", h: 1304 },
  { key: "savings", marker: "#B2E6E0", h: 1165 },
];

export default function FeatureGrid() {
  const { t, locale } = useLang();
  return (
    <section id="features" className="py-20 lg:py-24" style={{ background: "#F9F9FD" }}>
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-extrabold" style={{ fontSize: "clamp(32px, 4.6vw, 52px)", letterSpacing: "-0.03em", lineHeight: 1.08, color: "#1B1A33" }}>
          <MarkTitle text={t("lp3.featTitle")} marker="#CFC8FF" />
        </h2>
      </div>

      {/* Phone: swipeable row. Desktop: 3 × 2 grid. */}
      <div
        className="mt-10 flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:mx-auto lg:max-w-6xl"
        style={{ scrollPaddingLeft: 24, WebkitOverflowScrolling: "touch" }}
      >
        {CARDS.map(({ key, marker, h }, i) => (
          <motion.article
            key={key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: (i % 3) * 0.06 }}
            className="surface snap-start flex-none w-[82vw] max-w-[360px] lg:w-auto lg:max-w-none rounded-[28px] overflow-hidden flex flex-col"
            style={{ background: "#FFFFFF" }}
          >
            <div className="px-6 pt-7">
              <h3 className="font-extrabold" style={{ fontSize: 24, letterSpacing: "-0.02em", lineHeight: 1.15, color: "#1B1A33" }}>
                <MarkTitle text={t(`lp3.title.${key}`)} marker={marker} />
              </h3>
              <p style={{ fontSize: 15, color: "#63636B", lineHeight: 1.55, marginTop: 10 }}>{t(`lp3.desc.${key}`)}</p>
            </div>
            <div className="mt-6 flex-1 flex items-center" style={{ background: "#F9F9FD" }}>
              <Image
                src={`/images/landing/${locale}/${key}.webp`}
                alt={t(`lp3.desc.${key}`)}
                width={880}
                height={h}
                sizes="(min-width: 1024px) 360px, 82vw"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

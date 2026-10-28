"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import MarkTitle from "./MarkTitle";
import { useLang } from "@/components/dash/i18n";

const STEPS = [1, 2, 3];

export default function SetupOnce() {
  const { t, locale } = useLang();
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 grid items-center gap-10 lg:gap-16 grid-cols-1 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="order-2 lg:order-1 flex justify-center"
        >
          <div style={{ maxWidth: 460, width: "100%" }}>
            <Image
              src={`/images/landing/${locale}/setup.webp`}
              alt={t("lp3.setupStep1Desc")}
              width={880}
              height={1524}
              sizes="(min-width: 1024px) 460px, 92vw"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="order-1 lg:order-2"
        >
          <h2 className="font-extrabold" style={{ fontSize: "clamp(32px, 4.6vw, 52px)", letterSpacing: "-0.03em", lineHeight: 1.08, color: "#1B1A33" }}>
            <MarkTitle text={t("lp3.title.setup")} marker="#BCDDFF" />
          </h2>

          <ol className="mt-10 flex flex-col gap-7">
            {STEPS.map((n) => (
              <li key={n} className="flex gap-5">
                <span
                  className="flex-none flex items-center justify-center font-bold"
                  style={{ width: 40, height: 40, borderRadius: 12, background: "#EEEDFF", color: "#6C63FF", fontSize: 17 }}
                >
                  {n}
                </span>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: "#1B1A33" }}>{t(`lp3.setupStep${n}Title`)}</p>
                  <p style={{ fontSize: 16, color: "#63636B", lineHeight: 1.6, marginTop: 4, maxWidth: 440 }}>{t(`lp3.setupStep${n}Desc`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}

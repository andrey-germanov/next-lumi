"use client";

import { motion } from "framer-motion";
import AppStoreButton from "./AppStoreButton";
import PhoneFrame from "./PhoneFrame";
import { useLang } from "@/components/dash/i18n";

const steps = [
  {
    step: "1",
    titleKey: "lp2.howStep1Title",
    descKey: "lp2.howStep1Desc",
    image: "/images/demo-apple-pay/apple-pay-wallet-card.png",
    alt: "Holding an iPhone near a contactless reader to pay with Apple Pay",
  },
  {
    step: "2",
    titleKey: "lp2.howStep2Title",
    descKey: "lp2.howStep2Desc",
    image: "/images/demo-apple-pay/apple-pay-category-picker.png",
    alt: "Lumi category picker appearing right after an Apple Pay purchase",
  },
  {
    step: "3",
    titleKey: "lp2.howStep3Title",
    descKey: "lp2.howStep3Desc",
    image: "/images/demo-apple-pay/apple-pay-confirmation.png",
    alt: "Lumi confirming a Starbucks expense was saved and categorized automatically",
  },
];

export default function HowItWorks() {
  const { t } = useLang();
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
            {t("lp2.howTitle")}
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-lg font-bold text-white">
                {item.step}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{t(item.titleKey)}</h3>
              <p className="text-text-muted">{t(item.descKey)}</p>

              {/* Step screenshot */}
              <PhoneFrame
                src={item.image}
                alt={item.alt}
                width={200}
                sizes="200px"
                className="mx-auto mt-6"
                style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.14))" }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <AppStoreButton location="how_it_works" />
        </motion.div>
      </div>
    </section>
  );
}

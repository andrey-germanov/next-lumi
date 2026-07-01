"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import AppStoreButton from "./AppStoreButton";

const steps = [
  {
    step: "1",
    title: "Tap to pay",
    description: "Pay with Apple Pay like you always do. No extra app, no unlocking.",
    image: "/images/demo-apple-pay/apple-pay-wallet-card.png",
    alt: "Holding an iPhone near a contactless reader to pay with Apple Pay",
  },
  {
    step: "2",
    title: "Lumi picks it up instantly",
    description: "The expense appears with a category already suggested — tap to confirm.",
    image: "/images/demo-apple-pay/apple-pay-category-picker.png",
    alt: "Lumi category picker appearing right after an Apple Pay purchase",
  },
  {
    step: "3",
    title: "Done",
    description: "Saved, categorized, and added to your forecast automatically.",
    image: "/images/demo-apple-pay/apple-pay-confirmation.png",
    alt: "Lumi confirming a Starbucks expense was saved and categorized automatically",
  },
];

export default function HowItWorks() {
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
            1 tap. Seconds. Done.
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
              <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-text-muted">{item.description}</p>

              {/* Step screenshot */}
              <div
                className="mx-auto mt-6 relative overflow-hidden"
                style={{ width: 190, height: 400, borderRadius: 32, background: "#1C1C1E", border: "1.5px solid rgba(0,0,0,0.15)", boxShadow: "0 20px 40px rgba(0,0,0,0.14)" }}
              >
                <div className="relative" style={{ position: "absolute", inset: "1.5px", borderRadius: 31, overflow: "hidden" }}>
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="190px"
                    style={{ objectFit: "cover", objectPosition: "top" }}
                  />
                </div>
              </div>
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

"use client";

import { motion } from "framer-motion";
import AppStoreButton from "./AppStoreButton";

export default function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="surface rounded-3xl text-center"
          style={{ padding: "80px 48px" }}
        >
          <p className="label" style={{ marginBottom: 20 }}>Start for free</p>

          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: 700,
              letterSpacing: "-1.5px",
              lineHeight: 1.08,
              color: "#fff",
              marginBottom: 16,
            }}
          >
            Your next expense
            <br />
            <span style={{ color: "#6C63FF" }}>logs itself.</span>
          </h2>

          <p style={{ fontSize: 17, color: "#666", maxWidth: 420, margin: "0 auto 36px" }}>
            Set up Apple Pay import once. Enable Back Tap. Then forget about manual logging forever.
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <AppStoreButton location="final_cta" />
            <p style={{ fontSize: 13, color: "#444" }}>Free · No bank login · iOS 16+</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

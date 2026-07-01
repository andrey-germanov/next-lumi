"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const benefits = [
  "No typing, no category menus",
  "Works in multiple languages",
  "Logs amount, merchant, and category in one go",
];

export default function VoiceInput() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="label" style={{ marginBottom: 16 }}>New — Voice Input</p>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 800,
                color: "#0A0A0A",
                letterSpacing: "-1.5px",
                lineHeight: 1.1,
                marginBottom: 20,
              }}
            >
              Don&apos;t type it.
              <br />
              <span style={{ color: "#6C63FF" }}>Just say it.</span>
            </h2>
            <p style={{ fontSize: 16, color: "#63636B", lineHeight: 1.7, marginBottom: 24, maxWidth: 440 }}>
              Tap the mic and talk like you would to a friend. Lumi&apos;s AI pulls out the amount, merchant, and category — no forms, no menus, no typing.
            </p>

            <div className="surface" style={{ borderRadius: 16, padding: "16px 20px", marginBottom: 28, maxWidth: 440 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8E8E93", marginBottom: 8 }}>
                You say
              </p>
              <p style={{ fontSize: 16, fontWeight: 600, color: "#0A0A0A", fontStyle: "italic" }}>
                &ldquo;Coffee, five euros. Metro, two euros.&rdquo;
              </p>
            </div>

            <ul style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {benefits.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#63636B" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C63FF" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            <div
              className="relative"
              style={{ width: 256, height: 536, borderRadius: 44, background: "#1C1C1E", border: "1.5px solid rgba(0,0,0,0.15)", boxShadow: "0 30px 60px rgba(0,0,0,0.18)", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", inset: "1.5px", borderRadius: 43, overflow: "hidden" }}>
                <Image
                  src="/images/screenshots-of-app/voice-input.png"
                  alt="Lumi voice input screen with a microphone button and prompt to say an expense out loud"
                  fill
                  sizes="256px"
                  style={{ objectFit: "cover", objectPosition: "top" }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FAQ } from "@/lib/constants";

function FAQItem({ item, index }: { item: (typeof FAQ)[number]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="surface rounded-2xl overflow-hidden"
    >
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: "#0A0A0A", letterSpacing: "-0.2px" }}>
          {item.question}
        </span>
        <div
          style={{
            flexShrink: 0,
            width: 26, height: 26,
            borderRadius: "50%",
            border: "1px solid rgba(0,0,0,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform 0.25s ease",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v8M2 6h8" stroke="#63636B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <div
              style={{
                padding: "0 24px 20px",
                borderTop: "1px solid rgba(0,0,0,0.08)",
                paddingTop: 16,
                fontSize: 14,
                color: "#63636B",
                lineHeight: 1.7,
              }}
            >
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQAccordion({ items }: { items: typeof FAQ }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((item, i) => (
        <FAQItem key={i} item={item} index={i} />
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { APP_STORE_URL } from "@/lib/constants";
import { trackAppStoreClick } from "@/lib/posthog";
import { useLang } from "@/components/dash/i18n";

/**
 * Persistent bottom CTA on mobile. Appears once the user scrolls past the
 * hero so the primary action is always one tap away. Hidden on desktop
 * (which has the QR + inline CTAs instead).
 */
export default function StickyMobileCTA() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="lg:hidden"
      style={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: 12,
        zIndex: 50,
        transform: visible ? "translateY(0)" : "translateY(140%)",
        transition: "transform 0.3s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackAppStoreClick("sticky_mobile")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "100%",
          padding: "15px 20px",
          borderRadius: 14,
          background: "#6C63FF",
          color: "#fff",
          fontSize: 15,
          fontWeight: 700,
          boxShadow: "0 10px 30px rgba(108,99,255,0.4)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18 }}>
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
        {t("lp2.stickyCta")}
      </a>
    </div>
  );
}

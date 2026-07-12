"use client";

import Image from "next/image";
import { useLang } from "@/components/dash/i18n";
import { trackEvent } from "@/lib/posthog";

/**
 * Desktop-only download helper: a scannable QR to the App Store.
 * Closes the biggest funnel leak — desktop/SEO visitors who can't install
 * an iOS app from the browser. Hidden on touch/small screens.
 */
export default function AppQR({
  location,
  onLight = true,
}: {
  location: string;
  onLight?: boolean;
}) {
  const { t } = useLang();
  const captionColor = onLight ? "#63636B" : "rgba(255,255,255,0.6)";

  return (
    <div
      className="hidden lg:flex"
      style={{ alignItems: "center", gap: 14 }}
      onMouseEnter={() => trackEvent("qr_view", { location })}
    >
      <div
        style={{
          width: 148,
          height: 148,
          padding: 10,
          borderRadius: 16,
          background: "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          flexShrink: 0,
        }}
      >
        <Image
          src="/images/appstore-qr.svg"
          alt="QR code to download Lumi on the App Store"
          width={128}
          height={128}
          style={{ width: "100%", height: "100%", display: "block" }}
          unoptimized
        />
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.4, color: captionColor, maxWidth: 140 }}>
        {t("lp2.qrCaption")}
      </p>
    </div>
  );
}

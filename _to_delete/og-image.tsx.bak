import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";

export const ogImageSize = { width: 1200, height: 630 };

const logoDataUri = `data:image/png;base64,${fs
  .readFileSync(path.join(process.cwd(), "public/images/logo/logo-512.png"))
  .toString("base64")}`;

export function renderOgImage(title: string, subtitle?: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0E1A 0%, #1A1F2E 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            padding: "0 80px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoDataUri} width={64} height={64} style={{ borderRadius: 16 }} alt="" />
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: "#6366F1",
                letterSpacing: "-0.02em",
              }}
            >
              Lumi
            </div>
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#F8FAFC",
              textAlign: "center",
              maxWidth: "900px",
              lineHeight: 1.25,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 22,
                color: "#94A3B8",
                textAlign: "center",
                maxWidth: "700px",
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
    ),
    { ...ogImageSize }
  );
}

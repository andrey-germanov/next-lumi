import fs from "fs";
import path from "path";
import { ImageResponse } from "next/og";

export const ogImageSize = { width: 1200, height: 630 };

const logoDataUri = `data:image/png;base64,${fs
  .readFileSync(path.join(process.cwd(), "public/images/logo/logo-512.png"))
  .toString("base64")}`;

/**
 * Branded Open Graph card (1200x630), dark theme, left-aligned.
 * - `title`    headline (kept short; the blog route splits off any ": subtitle")
 * - `subtitle` optional supporting line under the accent rule
 * - `eyebrow`  optional uppercase kicker with a dot, e.g. "BUDGETING · 2026"
 */
export function renderOgImage(title: string, subtitle?: string, eyebrow?: string) {
  const titleSize = title.length > 42 ? 58 : title.length > 26 ? 68 : 78;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0A0E1A 0%, #151A2B 55%, #1E2542 100%)",
          padding: "72px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoDataUri} width={64} height={64} style={{ borderRadius: 18 }} alt="" />
          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: "#A5B4FF",
              marginLeft: 18,
              letterSpacing: "-0.01em",
            }}
          >
            Lumi
          </div>
        </div>

        {/* Spacer pushes the headline block to the lower third */}
        <div style={{ display: "flex", flexGrow: 1 }} />

        {/* Headline block */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {eyebrow ? (
            <div style={{ display: "flex", alignItems: "center", marginBottom: 22 }}>
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  background: "#6366F1",
                  marginRight: 14,
                }}
              />
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  color: "#8B93FF",
                }}
              >
                {eyebrow}
              </div>
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              fontSize: titleSize,
              fontWeight: 800,
              color: "#F8FAFC",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 1040,
            }}
          >
            {title}
          </div>

          {subtitle ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  width: 64,
                  height: 6,
                  borderRadius: 3,
                  background: "#6366F1",
                  margin: "34px 0 20px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  fontSize: 26,
                  color: "#94A3B8",
                  lineHeight: 1.4,
                  maxWidth: 900,
                }}
              >
                {subtitle}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...ogImageSize }
  );
}

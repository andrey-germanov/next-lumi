import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Lumi — AI Expense Tracker";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#6366F1",
              letterSpacing: "-0.02em",
            }}
          >
            Lumi
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: "#F8FAFC",
              textAlign: "center",
              maxWidth: "800px",
              lineHeight: 1.3,
            }}
          >
            AI Expense Tracker
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#94A3B8",
              textAlign: "center",
              maxWidth: "600px",
            }}
          >
            Scan Receipts &middot; Any Currency &middot; No Bank Login
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

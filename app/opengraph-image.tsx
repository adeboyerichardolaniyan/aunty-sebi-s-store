import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Aunty Sebi's Jewelry — Handcrafted Stories from Around the World";
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
          backgroundColor: "#FAF8F3",
          position: "relative",
        }}
      >
        {/* Bronze accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            backgroundColor: "#CD7F32",
          }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontFamily: "serif",
            color: "#1A1A1A",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "24px",
          }}
        >
          Aunty Sebi&apos;s Jewelry
        </div>

        {/* Bronze divider */}
        <div
          style={{
            width: "80px",
            height: "3px",
            backgroundColor: "#CD7F32",
            marginBottom: "24px",
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            fontFamily: "sans-serif",
            color: "rgba(26, 26, 26, 0.6)",
            textAlign: "center",
          }}
        >
          Handcrafted Stories from Around the World
        </div>
      </div>
    ),
    { ...size }
  );
}

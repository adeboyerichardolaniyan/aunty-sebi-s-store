import { ImageResponse } from "next/og";
import { getPieceBySlug } from "@/lib/data";

export const runtime = "edge";
export const alt = "Product image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
  const piece = getPieceBySlug(params.id);

  if (!piece) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FAF8F3",
            fontFamily: "serif",
            fontSize: 48,
            color: "#1A1A1A",
          }}
        >
          Piece Not Found
        </div>
      ),
      { ...size }
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: piece.currency,
    minimumFractionDigits: 0,
  }).format(piece.price);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
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

        {/* Origin */}
        <div
          style={{
            fontSize: 20,
            color: "rgba(139, 69, 19, 0.6)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            marginBottom: "16px",
          }}
        >
          {piece.origin.city}, {piece.origin.country}
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 64,
            fontFamily: "serif",
            color: "#1A1A1A",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          {piece.name}
        </div>

        {/* Price */}
        <div
          style={{
            fontSize: 36,
            fontFamily: "serif",
            color: "#CD7F32",
            marginBottom: "32px",
          }}
        >
          {formattedPrice}
        </div>

        {/* Bronze divider */}
        <div
          style={{
            width: "60px",
            height: "3px",
            backgroundColor: "rgba(205, 127, 50, 0.4)",
            marginBottom: "32px",
          }}
        />

        {/* Description (truncated) */}
        <div
          style={{
            fontSize: 22,
            fontFamily: "sans-serif",
            color: "rgba(26, 26, 26, 0.7)",
            lineHeight: 1.5,
            maxWidth: "800px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {piece.description}
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "80px",
            fontSize: 18,
            fontFamily: "serif",
            color: "rgba(26, 26, 26, 0.4)",
          }}
        >
          Aunty Sebi&apos;s Jewelry
        </div>
      </div>
    ),
    { ...size }
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Martua Kevin | Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Dynamic Open Graph image — generated at the edge (fast, zero-cost).
 * Previewed when sharing the portfolio link on LinkedIn, WhatsApp, Twitter, etc.
 */
export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0E0C0A 0%, #161310 50%, #0E0C0A 100%)",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,162,39,0.25) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-100px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(217,180,92,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Code tag brand */}
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            color: "#d4a93a",
            marginBottom: 32,
            letterSpacing: "-0.5px",
          }}
        >
          {"<Martua />"}
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.1,
            letterSpacing: "-2px",
            marginBottom: 20,
          }}
        >
          Martua Kevin
        </div>

        {/* Role */}
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#a59c8c",
            marginBottom: 48,
            fontWeight: 400,
          }}
        >
          Informatics Engineering Graduate & Web Developer
        </div>

        {/* Divider */}
        <div
          style={{
            width: 80,
            height: 4,
            background: "linear-gradient(90deg, #b08a1e, #d9b45c)",
            borderRadius: 2,
            marginBottom: 48,
          }}
        />

        {/* Tags */}
        <div style={{ display: "flex", gap: 16 }}>
          {["Next.js", "Supabase", "Python", "Deep Learning"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "10px 20px",
                background: "rgba(201,162,39,0.15)",
                border: "1px solid rgba(201,162,39,0.3)",
                borderRadius: 8,
                color: "#d9b45c",
                fontSize: 22,
                fontWeight: 500,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* URL watermark */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 80,
            fontSize: 22,
            color: "#5c5547",
          }}
        >
          martuakevin.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}

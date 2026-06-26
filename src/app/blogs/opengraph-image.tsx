import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Qasir Mehmood Blog";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function BlogOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px",
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: "white",
              marginBottom: 20,
              textAlign: "center",
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            Blog
          </div>
          <div
            style={{
              fontSize: 32,
              color: "rgba(255, 255, 255, 0.9)",
              textAlign: "center",
              maxWidth: 900,
              marginBottom: 40,
            }}
          >
            Full-Stack Development, Cloud Architecture & AI/ML Insights
          </div>
          <div
            style={{
              fontSize: 28,
              color: "rgba(255, 255, 255, 0.8)",
              fontWeight: 600,
            }}
          >
            Qasir Mehmood
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

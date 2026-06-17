import { ImageResponse } from "next/og";
import { PROFILE_DATA } from "@/lib/constants";

export const runtime = "edge";
export const alt = "Qasir Mehmood — Senior Full-Stack Developer & Azure AI Engineer";
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
          justifyContent: "center",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0f0a1e 0%, #1e1b4b 45%, #312e81 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32, marginBottom: 32 }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "4px solid #a78bfa",
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 700,
            }}
          >
            QM
          </div>
          <div>
            <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}>{PROFILE_DATA.name}</div>
            <div style={{ fontSize: 24, color: "#c4b5fd", marginTop: 8 }}>
              Azure AI Engineer (AI-102) · 12+ Years
            </div>
          </div>
        </div>
        <div style={{ fontSize: 28, lineHeight: 1.4, color: "#e9d5ff", maxWidth: 960 }}>
          Senior Full-Stack Developer — Next.js, React, TypeScript, FastAPI, Azure AI, RAG,
          LangGraph, Temporal & MCP
        </div>
        <div style={{ fontSize: 20, color: "#a5b4fc", marginTop: 32 }}>www.qasir.co.uk</div>
      </div>
    ),
    { ...size }
  );
}

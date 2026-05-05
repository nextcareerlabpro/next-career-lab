import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Upgrade Your Resume — Free ATS Resume Analyzer & AI Career Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background pattern dots */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo badge */}
        <div
          style={{
            width: "96px",
            height: "96px",
            background: "#10b981",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "32px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          <span
            style={{
              color: "white",
              fontSize: "42px",
              fontWeight: "900",
              letterSpacing: "-2px",
            }}
          >
            UR
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            color: "white",
            fontSize: "56px",
            fontWeight: "800",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "20px",
            maxWidth: "900px",
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          Upgrade Your Resume
        </div>

        {/* Subheadline */}
        <div
          style={{
            color: "#a7f3d0",
            fontSize: "28px",
            fontWeight: "500",
            textAlign: "center",
            marginBottom: "40px",
            maxWidth: "800px",
          }}
        >
          Free ATS Score · AI Resume Writer · Cover Letter · LinkedIn Optimizer
        </div>

        {/* CTA pill */}
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "1.5px solid rgba(255,255,255,0.3)",
            borderRadius: "100px",
            padding: "14px 40px",
            color: "white",
            fontSize: "22px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span>✓</span>
          <span>Free to start — No credit card required</span>
        </div>

        {/* Domain watermark */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            right: "40px",
            color: "rgba(167,243,208,0.7)",
            fontSize: "18px",
            fontWeight: "500",
          }}
        >
          upgradeyourresume.com
        </div>
      </div>
    ),
    { ...size }
  );
}

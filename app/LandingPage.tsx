"use client";
import React from "react";

interface Props {
  onLogin: () => void;
}

export default function LandingPage({ onLogin }: Props) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div>
          <span style={{ fontSize: "20px", fontWeight: 800 }}>
            <span style={{ color: "#059669" }}>Upgrade </span>
            <span style={{ color: "#f97316" }}>Your </span>
            <span style={{ color: "#059669" }}>Resume</span>
          </span>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "1px" }}>AI Powered Career Suite</div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onLogin} style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: "#374151", background: "#fff", border: "1.5px solid #d1d5db", cursor: "pointer" }}>Sign In</button>
          <button onClick={onLogin} style={{ padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: "#fff", background: "#059669", border: "none", cursor: "pointer" }}>Get Started Free →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)", padding: "72px 24px 80px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(5,150,105,0.15)", border: "1px solid rgba(5,150,105,0.4)", borderRadius: "20px", padding: "5px 16px", fontSize: "12px", color: "#34d399", fontWeight: 600, marginBottom: "20px", letterSpacing: "0.05em" }}>
          🚀 AI-POWERED CAREER TOOLS
        </div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: "#fff", margin: "0 0 16px", lineHeight: 1.15 }}>
          Get Your Dream Job<br />
          <span style={{ color: "#34d399" }}>Faster with AI</span>
        </h1>
        <p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: "#94a3b8", maxWidth: "560px", margin: "0 auto 32px", lineHeight: 1.7 }}>
          Check your ATS score, rewrite your resume with AI, generate cover letters, and match yourself to any job — all in one place.
        </p>
        <button onClick={onLogin} style={{ padding: "14px 36px", borderRadius: "12px", fontSize: "16px", fontWeight: 700, color: "#fff", background: "linear-gradient(135deg, #059669, #34d399)", border: "none", cursor: "pointer", boxShadow: "0 8px 24px rgba(5,150,105,0.4)" }}>
          Start For Free — No Credit Card Needed
        </button>
        <p style={{ fontSize: "12px", color: "#64748b", marginTop: "12px" }}>3 free ATS scans every month · No signup hassle · Google Sign-In</p>

        {/* Score Preview Card */}
        <div style={{ maxWidth: "380px", margin: "48px auto 0", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", textAlign: "left" }}>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>ATS Score Preview</p>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "conic-gradient(#059669 252deg, #1e293b 0)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: "#34d399" }}>70%</span>
              </div>
            </div>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#e2e8f0", margin: "0 0 6px" }}>Good Match</p>
              <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>✅ Matched: React, Node.js, AWS</p>
              <p style={{ fontSize: "11px", color: "#64748b", margin: "3px 0 0" }}>❌ Missing: Docker, Kubernetes</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "64px 24px", maxWidth: "1000px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Everything You Need to Land the Job</h2>
        <p style={{ textAlign: "center", color: "#6b7280", fontSize: "14px", margin: "0 0 40px" }}>5 powerful AI tools. One platform.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
          {[
            { icon: "🔍", title: "ATS Resume Analyzer", desc: "Upload your resume + job description. Instantly see your ATS score, matched keywords, and missing skills.", badge: "Free" },
            { icon: "✍️", title: "AI Resume Writer", desc: "Paste any bullet point. AI rewrites it with measurable achievements and recruiter-friendly language.", badge: "Pro" },
            { icon: "📝", title: "Cover Letter Generator", desc: "Enter role + company. Get a tailored, professional cover letter in seconds.", badge: "Pro" },
            { icon: "💼", title: "LinkedIn Optimizer", desc: "Enter your job role. Get an optimized LinkedIn headline and About section.", badge: "Pro" },
            { icon: "🎯", title: "JD Analyzer", desc: "Paste any job description. Get a detailed match report, skill gaps, and resume tweaks.", badge: "Pro" },
          ].map((f, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: "14px", padding: "24px", border: "1px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "28px", marginBottom: "12px" }}>{f.icon}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#111827", margin: 0 }}>{f.title}</p>
                <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", background: f.badge === "Free" ? "#f0fdf4" : "#fff7ed", color: f.badge === "Free" ? "#059669" : "#f97316" }}>{f.badge}</span>
              </div>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{ background: "#f1f5f9", padding: "64px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(20px, 3vw, 30px)", fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Simple, Honest Pricing</h2>
        <p style={{ textAlign: "center", color: "#6b7280", fontSize: "14px", margin: "0 0 40px" }}>Start free. Upgrade when you're ready.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", maxWidth: "900px", margin: "0 auto" }}>
          {[
            { name: "Free", price: "₹0", per: "/month", features: ["3 ATS scans/month", "PDF report download", "Basic resume analysis"], color: "#6b7280", bg: "#fff" },
            { name: "Pro Monthly", price: "₹299", per: "/month", features: ["Unlimited ATS scans", "All 5 AI tools", "All resume templates", "Priority support"], color: "#059669", bg: "#fff", popular: false },
            { name: "Pro Quarterly", price: "₹199", per: "/month", features: ["Everything in Monthly", "Billed ₹597 / 3 months", "Save 33%", "Early access features"], color: "#06b6d4", bg: "linear-gradient(135deg,#f0fdf4,#ecfeff)", popular: true },
            { name: "Pro Annual", price: "₹149", per: "/month", features: ["Everything in Pro", "Billed ₹1,788 / year", "Save 50%", "Best value"], color: "#f97316", bg: "#fff" },
          ].map((p, i) => (
            <div key={i} style={{ background: p.bg, borderRadius: "14px", padding: "24px", border: p.popular ? `2px solid ${p.color}` : "1px solid #e5e7eb", position: "relative", boxShadow: p.popular ? "0 4px 20px rgba(6,182,212,0.15)" : "0 1px 4px rgba(0,0,0,0.05)" }}>
              {p.popular && <span style={{ position: "absolute", top: "-10px", left: "16px", background: "#06b6d4", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px" }}>POPULAR</span>}
              <p style={{ fontSize: "13px", fontWeight: 700, color: p.color, margin: "0 0 8px" }}>{p.name}</p>
              <p style={{ fontSize: "28px", fontWeight: 800, color: "#111827", margin: "0 0 16px" }}>{p.price}<span style={{ fontSize: "12px", fontWeight: 400, color: "#9ca3af" }}>{p.per}</span></p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px" }}>
                {p.features.map((f, j) => <li key={j} style={{ fontSize: "12px", color: "#374151", marginBottom: "6px" }}>✅ {f}</li>)}
              </ul>
              <button onClick={onLogin} style={{ width: "100%", padding: "9px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: i === 0 ? "#374151" : "#fff", background: i === 0 ? "#f3f4f6" : p.color, border: "none", cursor: "pointer" }}>
                {i === 0 ? "Start Free" : `Get ${p.name}`}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0f172a", padding: "32px 24px", textAlign: "center" }}>
        <div style={{ marginBottom: "12px" }}>
          <a href="/terms.html" target="_blank" style={{ color: "#64748b", textDecoration: "none", margin: "0 12px", fontSize: "12px" }}>Terms & Conditions</a>
          <a href="/privacy.html" target="_blank" style={{ color: "#64748b", textDecoration: "none", margin: "0 12px", fontSize: "12px" }}>Privacy Policy</a>
          <a href="/refund.html" target="_blank" style={{ color: "#64748b", textDecoration: "none", margin: "0 12px", fontSize: "12px" }}>Refund Policy</a>
        </div>
        <p style={{ color: "#475569", fontSize: "12px", margin: 0 }}>© 2026 Upgrade Your Resume. All rights reserved.</p>
      </footer>

    </div>
  );
}

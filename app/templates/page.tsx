"use client";

import React, { useEffect, useState } from "react";
import { auth, db, provider } from "../firebase";
import {
  signInWithPopup, signInWithRedirect,
  getRedirectResult, onAuthStateChanged, signOut,
} from "firebase/auth";
import {
  addDoc, collection, getDocs, query,
  serverTimestamp, updateDoc, where,
} from "firebase/firestore";
import { parseAndEnhanceResume, emptyResumeData, ResumeData } from "../../lib/resumeParser";
import { generateResumePdf } from "../../lib/resumePdfTemplates";

// ── Template preview data ────────────────────────────────────────
const TEMPLATES = [
  {
    id: 1, name: "Sharp", tag: "Corporate", isPro: false,
    desc: "Dark sidebar, bold typography. Perfect for senior roles.",
    accent: "#0f172a", badge: "#0ea5e9",
    preview: (
      <div style={{ background: "#f8fafc", height: "100%", display: "flex" }}>
        <div style={{ background: "#0f172a", width: "38%", padding: "10px 7px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#fff", marginBottom: "3px" }}>ALEX MORGAN</div>
          <div style={{ fontSize: "7px", color: "#7dd3fc", marginBottom: "8px" }}>Senior Engineer</div>
          <div style={{ fontSize: "6px", color: "#38bdf8", fontWeight: 700, marginBottom: "3px" }}>SKILLS</div>
          {["React", "Node.js", "AWS", "Docker", "Python"].map(s => (
            <div key={s} style={{ background: "#1e3a5f", borderRadius: "3px", padding: "2px 4px", marginBottom: "2px", fontSize: "6px", color: "#7dd3fc" }}>{s}</div>
          ))}
          <div style={{ fontSize: "6px", color: "#38bdf8", fontWeight: 700, marginTop: "8px", marginBottom: "3px" }}>EDUCATION</div>
          <div style={{ fontSize: "6px", color: "#cbd5e1" }}>B.Tech CS</div>
          <div style={{ fontSize: "6px", color: "#94a3b8" }}>IIT Delhi · 2018</div>
        </div>
        <div style={{ flex: 1, padding: "10px 8px" }}>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#0f172a", borderBottom: "1.5px solid #0ea5e9", paddingBottom: "2px", marginBottom: "5px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "7.5px", fontWeight: 700, color: "#0f172a" }}>Lead Developer</div>
          <div style={{ fontSize: "6.5px", color: "#0ea5e9", marginBottom: "3px" }}>TechCorp · 2021–Now</div>
          <div style={{ fontSize: "6px", color: "#475569" }}>▸ Built APIs for 2M+ users</div>
          <div style={{ fontSize: "6px", color: "#475569" }}>▸ Reduced latency by 40%</div>
          <div style={{ fontSize: "6px", color: "#475569" }}>▸ Led team of 12 engineers</div>
        </div>
      </div>
    ),
  },
  {
    id: 2, name: "Ivy", tag: "Academic", isPro: false,
    desc: "Elegant centered layout. Ideal for academia & senior management.",
    accent: "#8b693c", badge: "#a16207",
    preview: (
      <div style={{ background: "#fdf8f0", height: "100%", padding: "10px 12px" }}>
        <div style={{ textAlign: "center", borderBottom: "1px solid #8b693c", paddingBottom: "8px", marginBottom: "8px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#3c280a" }}>PRIYA SHARMA</div>
          <div style={{ fontSize: "8px", color: "#8b693c", fontStyle: "italic" }}>Chief Marketing Officer</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginTop: "2px" }}>priya@corp.com · Delhi · +91 98765</div>
        </div>
        <div style={{ fontSize: "7px", fontWeight: 700, color: "#8b693c", textAlign: "center", letterSpacing: "0.1em", marginBottom: "3px" }}>EXPERIENCE</div>
        <div style={{ borderBottom: "0.5px solid #d4a96a", marginBottom: "5px" }}></div>
        <div style={{ fontSize: "8px", fontWeight: 700, color: "#3c280a" }}>VP Marketing — GlobalBrand</div>
        <div style={{ fontSize: "7px", color: "#8b693c", fontStyle: "italic", marginBottom: "3px" }}>2019 – Present</div>
        <div style={{ fontSize: "6.5px", color: "#374151" }}>◦ Grew revenue by ₹12Cr in 18 months</div>
        <div style={{ fontSize: "6.5px", color: "#374151" }}>◦ Led team of 45 across 3 cities</div>
        <div style={{ fontSize: "7px", fontWeight: 700, color: "#8b693c", textAlign: "center", letterSpacing: "0.1em", marginTop: "7px", marginBottom: "3px" }}>COMPETENCIES</div>
        <div style={{ borderBottom: "0.5px solid #d4a96a", marginBottom: "4px" }}></div>
        <div style={{ fontSize: "6.5px", color: "#374151", textAlign: "center" }}>Strategy · Analytics · Branding · Digital</div>
      </div>
    ),
  },
  {
    id: 3, name: "Slate", tag: "Tech / Startup", isPro: false,
    desc: "Teal accent, 2-column. Modern feel for tech & product roles.",
    accent: "#0f766e", badge: "#14b8a6",
    preview: (
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ background: "#0f766e", width: "38%", padding: "10px 7px" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>RAHUL VERMA</div>
          <div style={{ fontSize: "7px", color: "#99f6e4", marginBottom: "8px" }}>Product Manager</div>
          <div style={{ fontSize: "6px", color: "#5eead4", fontWeight: 700, marginBottom: "3px" }}>SKILLS</div>
          {["Agile/Scrum", "Figma", "SQL", "Jira", "Python"].map(s => (
            <div key={s} style={{ background: "#0d9488", borderRadius: "3px", padding: "2px 4px", marginBottom: "2px", fontSize: "6px", color: "#ccfbf1" }}>{s}</div>
          ))}
          <div style={{ fontSize: "6px", color: "#5eead4", fontWeight: 700, marginTop: "8px", marginBottom: "2px" }}>EDUCATION</div>
          <div style={{ fontSize: "6px", color: "#fff" }}>MBA — IIM Bangalore</div>
          <div style={{ fontSize: "6px", color: "#99f6e4" }}>2019</div>
        </div>
        <div style={{ background: "#f0fdfa", flex: 1, padding: "10px 8px" }}>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#0f766e", borderBottom: "1px solid #5eead4", paddingBottom: "2px", marginBottom: "5px" }}>ABOUT ME</div>
          <div style={{ fontSize: "6.5px", color: "#374151", marginBottom: "6px" }}>Results-driven PM with 6+ years launching B2B products...</div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#0f766e", borderBottom: "1px solid #5eead4", paddingBottom: "2px", marginBottom: "5px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "7.5px", fontWeight: 700, color: "#0f172a" }}>Sr. Product Manager</div>
          <div style={{ fontSize: "6.5px", color: "#0f766e", marginBottom: "3px" }}>GrowthCo · 2020–Now</div>
          <div style={{ fontSize: "6px", color: "#475569" }}>▸ Launched 3 products, 50K+ users</div>
          <div style={{ fontSize: "6px", color: "#475569" }}>▸ Increased retention by 35%</div>
        </div>
      </div>
    ),
  },
  {
    id: 4, name: "Ember", tag: "Creative", isPro: false,
    desc: "Warm orange tones. Great for marketing, design & creative fields.",
    accent: "#ea580c", badge: "#f97316",
    preview: (
      <div style={{ background: "#fff7ed", height: "100%" }}>
        <div style={{ background: "#ea580c", padding: "10px 12px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>SNEHA KAPOOR</div>
          <div style={{ fontSize: "8px", color: "#fed7aa", marginTop: "1px" }}>UX Design Lead</div>
          <div style={{ fontSize: "6.5px", color: "#fb923c", marginTop: "2px" }}>sneha@design.io · Mumbai</div>
        </div>
        <div style={{ padding: "8px 10px" }}>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "6px" }}>
            {["Figma", "UX Research", "Prototyping", "CSS"].map(s => (
              <span key={s} style={{ background: "#ffedd5", color: "#9a3412", borderRadius: "3px", padding: "1.5px 5px", fontSize: "6px", fontWeight: 700 }}>{s}</span>
            ))}
          </div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#9a3412", marginBottom: "2px" }}>EXPERIENCE</div>
          <div style={{ borderBottom: "1px solid #fb923c", marginBottom: "4px" }}></div>
          <div style={{ fontSize: "7.5px", fontWeight: 700, color: "#1c1917" }}>Design Lead — PixelHub</div>
          <div style={{ fontSize: "6.5px", color: "#ea580c", marginBottom: "3px" }}>2021 – Present</div>
          <div style={{ fontSize: "6px", color: "#44403c" }}>• Led redesign boosting retention 35%</div>
          <div style={{ fontSize: "6px", color: "#44403c" }}>• Built design system for 20+ devs</div>
        </div>
      </div>
    ),
  },
  {
    id: 5, name: "Clarity", tag: "Minimal", isPro: false,
    desc: "Ultra-clean with bold left rule. Timeless for consulting & finance.",
    accent: "#111827", badge: "#6b7280",
    preview: (
      <div style={{ background: "#fff", height: "100%", display: "flex" }}>
        <div style={{ width: "4px", background: "#111827", flexShrink: 0 }}></div>
        <div style={{ padding: "10px 10px", flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>AMIT PATEL</div>
          <div style={{ fontSize: "8px", color: "#6b7280", marginBottom: "2px" }}>Data Scientist</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginBottom: "8px" }}>amit@data.io · Bangalore · +91 87654</div>
          <div style={{ borderBottom: "0.5px solid #e5e7eb", marginBottom: "5px" }}></div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", marginBottom: "3px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#111827" }}>Data Scientist — Analytics Co</div>
          <div style={{ fontSize: "6.5px", color: "#6b7280", marginBottom: "3px" }}>2020 – Present</div>
          <div style={{ fontSize: "6px", color: "#4b5563" }}>— Built ML models with 94% accuracy</div>
          <div style={{ fontSize: "6px", color: "#4b5563" }}>— Automated reports saving 20hrs/week</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginTop: "6px" }}>Python  ·  TensorFlow  ·  SQL  ·  Tableau</div>
        </div>
      </div>
    ),
  },
  {
    id: 6, name: "Royal", tag: "Executive",
    desc: "Navy & gold. Commands authority for C-suite & senior leadership.",
    accent: "#0f172a", badge: "#a1823c", isPro: false,
    preview: (
      <div style={{ background: "#faf9f6", height: "100%" }}>
        <div style={{ background: "#0f172a", padding: "10px 12px", textAlign: "center" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>SUNITA KAPOOR</div>
          <div style={{ fontSize: "8px", color: "#d4b46e", marginTop: "1px" }}>Chief Executive Officer</div>
          <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginTop: "4px" }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#a1823c" }}></div>)}
          </div>
        </div>
        <div style={{ padding: "8px 10px" }}>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#a1823c", textAlign: "center", letterSpacing: "0.1em", marginBottom: "3px" }}>EXECUTIVE PROFILE</div>
          <div style={{ borderBottom: "0.5px solid #a1823c", marginBottom: "5px" }}></div>
          <div style={{ fontSize: "6.5px", color: "#374151", fontStyle: "italic", marginBottom: "6px" }}>Visionary leader with 20+ years driving digital transformation and revenue growth...</div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#a1823c", textAlign: "center", letterSpacing: "0.1em", marginBottom: "3px" }}>CORE COMPETENCIES</div>
          <div style={{ borderBottom: "0.5px solid #a1823c", marginBottom: "4px" }}></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
            {["▪ P&L Management", "▪ M&A Strategy", "▪ Board Relations", "▪ Global Ops"].map(s => (
              <div key={s} style={{ fontSize: "6px", color: "#374151" }}>{s}</div>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  // ── PRO TEMPLATES ─────────────────────────────────────────────

  // Modern
  {
    id: 7, name: "Vanguard", tag: "Modern", isPro: true,
    desc: "Deep indigo sidebar with violet accents. Standout look for tech & product.",
    accent: "#312e81", badge: "#818cf8",
    preview: (
      <div style={{ background: "#f8fafc", height: "100%", display: "flex" }}>
        <div style={{ background: "#312e81", width: "38%", padding: "10px 7px" }}>
          <div style={{ fontSize: "9px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>ALEX MORGAN</div>
          <div style={{ fontSize: "5.5px", color: "#818cf8", marginBottom: "6px" }}>Software Engineer</div>
          <div style={{ fontSize: "5px", color: "#a5b4fc", fontWeight: 700, marginBottom: "2px" }}>SKILLS</div>
          {["React", "TypeScript", "AWS"].map(s => (<div key={s} style={{ background: "#4338ca", borderRadius: "2px", padding: "1.5px 3px", marginBottom: "2px", fontSize: "5px", color: "#c7d2fe" }}>{s}</div>))}
        </div>
        <div style={{ flex: 1, padding: "10px 8px" }}>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#312e81", borderBottom: "1.5px solid #818cf8", paddingBottom: "1px", marginBottom: "4px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#1e1b4b" }}>Lead Engineer</div>
          <div style={{ fontSize: "5.5px", color: "#818cf8", marginBottom: "2px" }}>TechCorp · 2021–Now</div>
          <div style={{ fontSize: "5px", color: "#475569" }}>▸ Scaled platform to 5M users</div>
          <div style={{ fontSize: "5px", color: "#475569" }}>▸ Reduced deploy time by 60%</div>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#312e81", borderBottom: "1.5px solid #818cf8", paddingBottom: "1px", marginTop: "6px", marginBottom: "4px" }}>EDUCATION</div>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#1e1b4b" }}>B.Tech CS · IIT Delhi</div>
          <div style={{ fontSize: "5.5px", color: "#818cf8" }}>2018</div>
        </div>
      </div>
    ),
  },
  {
    id: 8, name: "Metro Linear", tag: "Modern", isPro: true,
    desc: "Bold navy banner header with bright blue accent stripe. Clean & corporate.",
    accent: "#1e3a5f", badge: "#3b82f6",
    preview: (
      <div style={{ background: "#f0f9ff", height: "100%" }}>
        <div style={{ background: "#1e3a5f", padding: "10px 12px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>PRIYA SHARMA</div>
          <div style={{ fontSize: "7.5px", color: "#93c5fd", marginTop: "1px" }}>Product Manager</div>
          <div style={{ fontSize: "6px", color: "#60a5fa", marginTop: "2px" }}>priya@corp.com · Mumbai</div>
        </div>
        <div style={{ background: "#3b82f6", height: "3px" }}></div>
        <div style={{ padding: "8px 10px" }}>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "3px", marginBottom: "5px" }}>
            {["Agile", "SQL", "Figma"].map(s => (<span key={s} style={{ background: "#dbeafe", color: "#1e3a8a", borderRadius: "3px", padding: "1.5px 4px", fontSize: "5.5px", fontWeight: 700 }}>{s}</span>))}
          </div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#1e3a5f", marginBottom: "2px" }}>EXPERIENCE</div>
          <div style={{ borderBottom: "1px solid #93c5fd", marginBottom: "3px" }}></div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#111827" }}>Sr. Product Manager</div>
          <div style={{ fontSize: "5.5px", color: "#1e3a5f", marginBottom: "2px" }}>GrowthCo · 2020–Now</div>
          <div style={{ fontSize: "5.5px", color: "#475569" }}>• Launched 3 products, 50K+ users</div>
          <div style={{ fontSize: "5.5px", color: "#475569" }}>• Increased retention by 35%</div>
        </div>
      </div>
    ),
  },
  {
    id: 9, name: "Slate & Steel", tag: "Modern", isPro: true,
    desc: "Dark slate sidebar, steel-gray accents. Sophisticated modern professional look.",
    accent: "#1e293b", badge: "#64748b",
    preview: (
      <div style={{ background: "#f8fafc", height: "100%", display: "flex" }}>
        <div style={{ background: "#1e293b", width: "38%", padding: "10px 7px" }}>
          <div style={{ fontSize: "9px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>RAHUL VERMA</div>
          <div style={{ fontSize: "5.5px", color: "#94a3b8", marginBottom: "6px" }}>Data Engineer</div>
          <div style={{ fontSize: "5px", color: "#64748b", fontWeight: 700, marginBottom: "2px" }}>SKILLS</div>
          {["Python", "Spark", "AWS"].map(s => (<div key={s} style={{ background: "#334155", borderRadius: "2px", padding: "1.5px 3px", marginBottom: "2px", fontSize: "5px", color: "#94a3b8" }}>{s}</div>))}
        </div>
        <div style={{ flex: 1, padding: "10px 8px" }}>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#1e293b", borderBottom: "1.5px solid #64748b", paddingBottom: "1px", marginBottom: "4px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#0f172a" }}>Data Engineer</div>
          <div style={{ fontSize: "5.5px", color: "#64748b", marginBottom: "2px" }}>CloudCo · 2020–Now</div>
          <div style={{ fontSize: "5px", color: "#475569" }}>▸ Built pipelines for 10TB/day</div>
          <div style={{ fontSize: "5px", color: "#475569" }}>▸ Reduced query time by 70%</div>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#1e293b", borderBottom: "1.5px solid #64748b", paddingBottom: "1px", marginTop: "6px", marginBottom: "4px" }}>EDUCATION</div>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#0f172a" }}>M.Tech CS · NIT</div>
          <div style={{ fontSize: "5.5px", color: "#64748b" }}>2020</div>
        </div>
      </div>
    ),
  },
  {
    id: 10, name: "Apex Corporate", tag: "Modern", isPro: true,
    desc: "Charcoal header with gold accent stripe. Polished corporate presence.",
    accent: "#111827", badge: "#f59e0b",
    preview: (
      <div style={{ background: "#fff", height: "100%" }}>
        <div style={{ background: "#111827", padding: "10px 12px", textAlign: "center" as const }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>AMIT PATEL</div>
          <div style={{ fontSize: "7.5px", color: "#fcd34d", marginTop: "1px" }}>Business Analyst</div>
          <div style={{ fontSize: "6px", color: "#f59e0b", marginTop: "2px" }}>amit@corp.com · Ahmedabad</div>
        </div>
        <div style={{ background: "#f59e0b", height: "2px" }}></div>
        <div style={{ padding: "8px 10px" }}>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#f59e0b", textAlign: "center" as const, marginBottom: "3px" }}>CORE COMPETENCIES</div>
          <div style={{ borderBottom: "0.5px solid #f59e0b", marginBottom: "4px" }}></div>
          <div style={{ fontSize: "6px", color: "#374151", textAlign: "center" as const, marginBottom: "5px" }}>Strategy · Analytics · Finance · Operations</div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#f59e0b", textAlign: "center" as const, marginBottom: "3px" }}>EXPERIENCE</div>
          <div style={{ borderBottom: "0.5px solid #f59e0b", marginBottom: "4px" }}></div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#111827" }}>Senior Analyst — InfraGroup</div>
          <div style={{ fontSize: "6px", color: "#f59e0b", marginBottom: "2px" }}>2020 – Present</div>
          <div style={{ fontSize: "5.5px", color: "#374151" }}>*  Drove $5Cr cost reduction</div>
        </div>
      </div>
    ),
  },

  // Classic
  {
    id: 11, name: "Executive Traditional", tag: "Classic", isPro: true,
    desc: "Warm burgundy header, centered layout. Distinguished old-world executive style.",
    accent: "#7c2d12", badge: "#b45309",
    preview: (
      <div style={{ background: "#fff", height: "100%" }}>
        <div style={{ background: "#7c2d12", padding: "10px 12px", textAlign: "center" as const }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>RAJAN MEHTA</div>
          <div style={{ fontSize: "7.5px", color: "#fbbf24", marginTop: "1px" }}>Director, Operations</div>
          <div style={{ fontSize: "6px", color: "#fcd34d", marginTop: "2px" }}>rajan@corp.com · Delhi</div>
        </div>
        <div style={{ background: "#b45309", height: "2px" }}></div>
        <div style={{ padding: "8px 10px" }}>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#b45309", textAlign: "center" as const, marginBottom: "3px" }}>PROFESSIONAL PROFILE</div>
          <div style={{ borderBottom: "0.5px solid #b45309", marginBottom: "4px" }}></div>
          <div style={{ fontSize: "6px", color: "#374151", fontStyle: "italic" as const, marginBottom: "5px" }}>Seasoned operations leader with 15+ years of P&L ownership...</div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#b45309", textAlign: "center" as const, marginBottom: "2px" }}>EXPERIENCE</div>
          <div style={{ borderBottom: "0.5px solid #b45309", marginBottom: "3px" }}></div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#1c1917" }}>Director — MegaCorp</div>
          <div style={{ fontSize: "6px", color: "#b45309" }}>2018 – Present</div>
        </div>
      </div>
    ),
  },
  {
    id: 12, name: "Ivy League Classic", tag: "Classic", isPro: true,
    desc: "Rich forest green header, centered serif-inspired layout. Academia & consulting.",
    accent: "#064e3b", badge: "#059669",
    preview: (
      <div style={{ background: "#fff", height: "100%" }}>
        <div style={{ background: "#064e3b", padding: "10px 12px", textAlign: "center" as const }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>NISHA AGARWAL</div>
          <div style={{ fontSize: "7.5px", color: "#6ee7b7", marginTop: "1px" }}>Senior Consultant</div>
          <div style={{ fontSize: "6px", color: "#34d399", marginTop: "2px" }}>nisha@mckinsey.com · Pune</div>
        </div>
        <div style={{ background: "#059669", height: "2px" }}></div>
        <div style={{ padding: "8px 10px" }}>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#059669", textAlign: "center" as const, marginBottom: "3px" }}>PROFESSIONAL PROFILE</div>
          <div style={{ borderBottom: "0.5px solid #059669", marginBottom: "4px" }}></div>
          <div style={{ fontSize: "6px", color: "#374151", fontStyle: "italic" as const, marginBottom: "5px" }}>Strategy consultant with expertise in market entry and operational efficiency...</div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#059669", textAlign: "center" as const, marginBottom: "2px" }}>EXPERIENCE</div>
          <div style={{ borderBottom: "0.5px solid #059669", marginBottom: "3px" }}></div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#022c22" }}>Consultant — BCG Mumbai</div>
          <div style={{ fontSize: "6px", color: "#059669" }}>2020 – Present</div>
        </div>
      </div>
    ),
  },
  {
    id: 13, name: "Century Executive", tag: "Classic", isPro: true,
    desc: "Timeless charcoal left rule, clean white canvas. Consulting & finance favourite.",
    accent: "#1f2937", badge: "#4b5563",
    preview: (
      <div style={{ background: "#fff", height: "100%", display: "flex" }}>
        <div style={{ width: "4px", background: "#1f2937", flexShrink: 0 }}></div>
        <div style={{ padding: "10px 10px", flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>SURESH IYER</div>
          <div style={{ fontSize: "8px", color: "#4b5563", marginBottom: "2px" }}>CFO</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginBottom: "8px" }}>suresh@firm.com · Chennai</div>
          <div style={{ borderBottom: "0.5px solid #e5e7eb", marginBottom: "5px" }}></div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", marginBottom: "3px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#111827" }}>CFO — FinGroup India</div>
          <div style={{ fontSize: "6.5px", color: "#4b5563", marginBottom: "3px" }}>2019 – Present</div>
          <div style={{ fontSize: "6px", color: "#374151" }}>— Led IPO raising ₹500Cr</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginTop: "5px" }}>Finance  ·  Strategy  ·  Compliance</div>
        </div>
      </div>
    ),
  },
  {
    id: 14, name: "Vintage Professional", tag: "Classic", isPro: true,
    desc: "Rich sepia tones with an amber accent bar. Warm, trusted, timeless appeal.",
    accent: "#78350f", badge: "#d97706",
    preview: (
      <div style={{ background: "#fefce8", height: "100%" }}>
        <div style={{ background: "#78350f", padding: "10px 12px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>KAVITA DESAI</div>
          <div style={{ fontSize: "7.5px", color: "#fde68a", marginTop: "1px" }}>HR Director</div>
          <div style={{ fontSize: "6px", color: "#fcd34d", marginTop: "2px" }}>kavita@hr.com · Kolkata</div>
        </div>
        <div style={{ background: "#d97706", height: "3px" }}></div>
        <div style={{ padding: "8px 10px" }}>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "3px", marginBottom: "5px" }}>
            {["HRBP", "Talent Acq.", "L&D"].map(s => (<span key={s} style={{ background: "#fef3c7", color: "#78350f", borderRadius: "3px", padding: "1.5px 4px", fontSize: "5.5px", fontWeight: 700 }}>{s}</span>))}
          </div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#78350f", marginBottom: "2px" }}>EXPERIENCE</div>
          <div style={{ borderBottom: "1px solid #fbbf24", marginBottom: "3px" }}></div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#1c1917" }}>HR Director — LargeCorp</div>
          <div style={{ fontSize: "5.5px", color: "#78350f" }}>2019 – Present</div>
          <div style={{ fontSize: "5.5px", color: "#44403c" }}>• Built HR team from 3 to 25</div>
        </div>
      </div>
    ),
  },

  // Creative
  {
    id: 15, name: "Studio Vanguard", tag: "Creative", isPro: true,
    desc: "Bold purple header with violet accents. Artistic and eye-catching for creative roles.",
    accent: "#6b21a8", badge: "#a855f7",
    preview: (
      <div style={{ background: "#faf5ff", height: "100%" }}>
        <div style={{ background: "#6b21a8", padding: "10px 12px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>ISHA KAPOOR</div>
          <div style={{ fontSize: "7.5px", color: "#e9d5ff", marginTop: "1px" }}>Creative Director</div>
          <div style={{ fontSize: "6px", color: "#d8b4fe", marginTop: "2px" }}>isha@studio.io · Bangalore</div>
        </div>
        <div style={{ background: "#a855f7", height: "3px" }}></div>
        <div style={{ padding: "8px 10px" }}>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "3px", marginBottom: "5px" }}>
            {["Branding", "Figma", "Motion"].map(s => (<span key={s} style={{ background: "#f3e8ff", color: "#6b21a8", borderRadius: "3px", padding: "1.5px 4px", fontSize: "5.5px", fontWeight: 700 }}>{s}</span>))}
          </div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#6b21a8", marginBottom: "2px" }}>EXPERIENCE</div>
          <div style={{ borderBottom: "1px solid #c084fc", marginBottom: "3px" }}></div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#2e1065" }}>Creative Director — AdFirm</div>
          <div style={{ fontSize: "5.5px", color: "#6b21a8" }}>2021 – Present</div>
          <div style={{ fontSize: "5.5px", color: "#44403c" }}>• Rebranded 20+ enterprise clients</div>
        </div>
      </div>
    ),
  },
  {
    id: 16, name: "Spectrum Dynamic", tag: "Creative", isPro: true,
    desc: "Hot pink sidebar, vibrant & bold. Makes a lasting first impression.",
    accent: "#be185d", badge: "#f472b6",
    preview: (
      <div style={{ background: "#fdf2f8", height: "100%", display: "flex" }}>
        <div style={{ background: "#be185d", width: "38%", padding: "10px 7px" }}>
          <div style={{ fontSize: "9px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>MEERA NAIR</div>
          <div style={{ fontSize: "5.5px", color: "#f9a8d4", marginBottom: "6px" }}>UX Researcher</div>
          <div style={{ fontSize: "5px", color: "#fbcfe8", fontWeight: 700, marginBottom: "2px" }}>SKILLS</div>
          {["User Testing", "Figma", "Miro"].map(s => (<div key={s} style={{ background: "#db2777", borderRadius: "2px", padding: "1.5px 3px", marginBottom: "2px", fontSize: "5px", color: "#fce7f3" }}>{s}</div>))}
        </div>
        <div style={{ flex: 1, padding: "10px 8px" }}>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#be185d", borderBottom: "1.5px solid #f472b6", paddingBottom: "1px", marginBottom: "4px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#500724" }}>UX Lead</div>
          <div style={{ fontSize: "5.5px", color: "#be185d", marginBottom: "2px" }}>DesignLab · 2022–Now</div>
          <div style={{ fontSize: "5px", color: "#475569" }}>▸ Led 0-to-1 product design</div>
          <div style={{ fontSize: "5px", color: "#475569" }}>▸ Improved NPS score by 40%</div>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#be185d", borderBottom: "1.5px solid #f472b6", paddingBottom: "1px", marginTop: "5px", marginBottom: "3px" }}>EDUCATION</div>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#500724" }}>M.Des — NID</div>
        </div>
      </div>
    ),
  },
  {
    id: 17, name: "Prism Flow", tag: "Creative", isPro: true,
    desc: "Teal header with lime-green accent. Fresh, energetic, design-forward.",
    accent: "#0f766e", badge: "#84cc16",
    preview: (
      <div style={{ background: "#fff", height: "100%" }}>
        <div style={{ background: "#0f766e", padding: "10px 12px", textAlign: "center" as const }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>ARJUN REDDY</div>
          <div style={{ fontSize: "7.5px", color: "#d9f99d", marginTop: "1px" }}>Motion Designer</div>
          <div style={{ fontSize: "6px", color: "#bef264", marginTop: "2px" }}>arjun@design.io · Hyderabad</div>
        </div>
        <div style={{ background: "#84cc16", height: "2px" }}></div>
        <div style={{ padding: "8px 10px" }}>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#84cc16", textAlign: "center" as const, marginBottom: "3px" }}>CORE COMPETENCIES</div>
          <div style={{ borderBottom: "0.5px solid #84cc16", marginBottom: "4px" }}></div>
          <div style={{ fontSize: "6px", color: "#374151", textAlign: "center" as const, marginBottom: "5px" }}>After Effects · Premiere Pro · 3D · Branding</div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#84cc16", textAlign: "center" as const, marginBottom: "2px" }}>EXPERIENCE</div>
          <div style={{ borderBottom: "0.5px solid #84cc16", marginBottom: "3px" }}></div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#0f172a" }}>Motion Lead — Studio X</div>
          <div style={{ fontSize: "5.5px", color: "#0f766e" }}>*  Created viral campaign with 10M views</div>
        </div>
      </div>
    ),
  },
  {
    id: 18, name: "Bold Curator", tag: "Creative", isPro: true,
    desc: "Crimson left rule on white. Bold, assertive, minimally creative.",
    accent: "#991b1b", badge: "#ef4444",
    preview: (
      <div style={{ background: "#fff", height: "100%", display: "flex" }}>
        <div style={{ width: "4px", background: "#991b1b", flexShrink: 0 }}></div>
        <div style={{ padding: "10px 10px", flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>ZARA KHAN</div>
          <div style={{ fontSize: "8px", color: "#6b7280", marginBottom: "2px" }}>Art Director</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginBottom: "8px" }}>zara@art.io · Delhi</div>
          <div style={{ borderBottom: "0.5px solid #fee2e2", marginBottom: "5px" }}></div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em", marginBottom: "3px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#111827" }}>Art Director — MediaCo</div>
          <div style={{ fontSize: "6.5px", color: "#6b7280", marginBottom: "3px" }}>2020 – Present</div>
          <div style={{ fontSize: "6px", color: "#374151" }}>— Won 3 national design awards</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginTop: "5px" }}>Illustration  ·  Typography  ·  Brand</div>
        </div>
      </div>
    ),
  },

  // Minimal
  {
    id: 19, name: "Clean Slate", tag: "Minimal", isPro: true,
    desc: "Grey left rule, pure white canvas. Ultra-clean for any industry.",
    accent: "#374151", badge: "#9ca3af",
    preview: (
      <div style={{ background: "#fff", height: "100%", display: "flex" }}>
        <div style={{ width: "4px", background: "#374151", flexShrink: 0 }}></div>
        <div style={{ padding: "10px 10px", flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>DIVYA MENON</div>
          <div style={{ fontSize: "8px", color: "#6b7280", marginBottom: "2px" }}>Operations Manager</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginBottom: "8px" }}>divya@ops.com · Kochi</div>
          <div style={{ borderBottom: "0.5px solid #e5e7eb", marginBottom: "5px" }}></div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", marginBottom: "3px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#111827" }}>Ops Manager — LogiCo</div>
          <div style={{ fontSize: "6.5px", color: "#6b7280", marginBottom: "3px" }}>2021 – Present</div>
          <div style={{ fontSize: "6px", color: "#374151" }}>— Reduced cost by 25%</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginTop: "6px" }}>Lean  ·  Six Sigma  ·  ERP  ·  SCM</div>
        </div>
      </div>
    ),
  },
  {
    id: 20, name: "Pure Typographic", tag: "Minimal", isPro: true,
    desc: "Black rule, pure typography. Absolute minimalism for bold first impressions.",
    accent: "#111827", badge: "#6b7280",
    preview: (
      <div style={{ background: "#fff", height: "100%", display: "flex" }}>
        <div style={{ width: "4px", background: "#000", flexShrink: 0 }}></div>
        <div style={{ padding: "10px 10px", flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#000" }}>ROHAN GUPTA</div>
          <div style={{ fontSize: "8px", color: "#6b7280", marginBottom: "2px" }}>Strategy Consultant</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginBottom: "8px" }}>rohan@mcg.com · Gurgaon</div>
          <div style={{ borderBottom: "0.5px solid #111827", marginBottom: "5px" }}></div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#6b7280", letterSpacing: "0.12em", marginBottom: "3px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#000" }}>Consultant — Big4</div>
          <div style={{ fontSize: "6.5px", color: "#6b7280", marginBottom: "3px" }}>2021 – Present</div>
          <div style={{ fontSize: "6px", color: "#374151" }}>— Led digital transformation</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginTop: "6px" }}>Strategy  ·  Finance  ·  Ops  ·  Tech</div>
        </div>
      </div>
    ),
  },
  {
    id: 21, name: "Linear Accent", tag: "Minimal", isPro: true,
    desc: "Deep indigo sidebar, minimal layout. Premium feel for tech and finance.",
    accent: "#3730a3", badge: "#6366f1",
    preview: (
      <div style={{ background: "#f8fafc", height: "100%", display: "flex" }}>
        <div style={{ background: "#3730a3", width: "38%", padding: "10px 7px" }}>
          <div style={{ fontSize: "9px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>VIKRAM SINGH</div>
          <div style={{ fontSize: "5.5px", color: "#a5b4fc", marginBottom: "6px" }}>Quant Analyst</div>
          <div style={{ fontSize: "5px", color: "#c7d2fe", fontWeight: 700, marginBottom: "2px" }}>SKILLS</div>
          {["Python", "R", "FinTech"].map(s => (<div key={s} style={{ background: "#4f46e5", borderRadius: "2px", padding: "1.5px 3px", marginBottom: "2px", fontSize: "5px", color: "#e0e7ff" }}>{s}</div>))}
        </div>
        <div style={{ flex: 1, padding: "10px 8px" }}>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#3730a3", borderBottom: "1.5px solid #6366f1", paddingBottom: "1px", marginBottom: "4px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#1e1b4b" }}>Quant Analyst</div>
          <div style={{ fontSize: "5.5px", color: "#6366f1", marginBottom: "2px" }}>HedgeFund · 2021–Now</div>
          <div style={{ fontSize: "5px", color: "#475569" }}>▸ 28% alpha on models built</div>
          <div style={{ fontSize: "5px", color: "#475569" }}>▸ Automated 15 workflows</div>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#3730a3", borderBottom: "1.5px solid #6366f1", paddingBottom: "1px", marginTop: "5px", marginBottom: "3px" }}>EDUCATION</div>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#1e1b4b" }}>M.Sc Statistics · ISI</div>
        </div>
      </div>
    ),
  },
  {
    id: 22, name: "Nordic Minimal", tag: "Minimal", isPro: true,
    desc: "Arctic blue rule on white. Calm, clean Scandinavian-inspired minimalism.",
    accent: "#0c4a6e", badge: "#0ea5e9",
    preview: (
      <div style={{ background: "#fff", height: "100%", display: "flex" }}>
        <div style={{ width: "4px", background: "#0c4a6e", flexShrink: 0 }}></div>
        <div style={{ padding: "10px 10px", flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#0c4a6e" }}>ANANYA ROY</div>
          <div style={{ fontSize: "8px", color: "#0ea5e9", marginBottom: "2px" }}>Product Designer</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginBottom: "8px" }}>ananya@ux.io · Bengaluru</div>
          <div style={{ borderBottom: "0.5px solid #bae6fd", marginBottom: "5px" }}></div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#0ea5e9", letterSpacing: "0.1em", marginBottom: "3px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#0c4a6e" }}>Sr. Designer — PixelCo</div>
          <div style={{ fontSize: "6.5px", color: "#0ea5e9", marginBottom: "3px" }}>2021 – Present</div>
          <div style={{ fontSize: "6px", color: "#374151" }}>— Led design system for 50+ devs</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginTop: "6px" }}>Figma  ·  Prototyping  ·  UX Research</div>
        </div>
      </div>
    ),
  },

  // Tech
  {
    id: 23, name: "Stack Developer", tag: "Tech", isPro: true,
    desc: "Dark terminal-inspired layout with green accents. Made for developers.",
    accent: "#15803d", badge: "#4ade80",
    preview: (
      <div style={{ background: "#0d1117", height: "100%", display: "flex" }}>
        <div style={{ background: "#161b22", width: "38%", padding: "10px 7px", borderRight: "1px solid #30363d" }}>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#4ade80", marginBottom: "2px" }}>{"> NIKHIL DEV"}</div>
          <div style={{ fontSize: "5.5px", color: "#86efac", marginBottom: "6px" }}>Full Stack Engineer</div>
          <div style={{ fontSize: "5px", color: "#4ade80", fontWeight: 700, marginBottom: "2px" }}># TECH STACK</div>
          {["React", "Node.js", "Go"].map(s => (<div key={s} style={{ fontSize: "5px", color: "#6ee7b7", marginBottom: "2px" }}>{`+ ${s}`}</div>))}
        </div>
        <div style={{ flex: 1, padding: "10px 8px" }}>
          <div style={{ fontSize: "5.5px", color: "#4ade80", fontWeight: 700, marginBottom: "1px" }}>{"// EXPERIENCE"}</div>
          <div style={{ borderBottom: "0.5px solid #4ade80", marginBottom: "4px" }}></div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#fff" }}>Sr. Engineer</div>
          <div style={{ fontSize: "5.5px", color: "#4ade80", marginBottom: "2px" }}>{"TechCo @ 2021–Now"}</div>
          <div style={{ fontSize: "5px", color: "#9ca3af" }}>{"> Built micro-services for 2M users"}</div>
          <div style={{ fontSize: "5px", color: "#9ca3af" }}>{"> OSS contributor 1k+ stars"}</div>
          <div style={{ fontSize: "5.5px", color: "#4ade80", fontWeight: 700, marginTop: "5px", marginBottom: "1px" }}>{"// EDUCATION"}</div>
          <div style={{ borderBottom: "0.5px solid #4ade80", marginBottom: "3px" }}></div>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#fff" }}>B.Tech CS — NIT</div>
        </div>
      </div>
    ),
  },
  {
    id: 24, name: "Cloud Architect", tag: "Tech", isPro: true,
    desc: "Sky blue sidebar, tech-forward. Built for cloud and infrastructure roles.",
    accent: "#0c4a6e", badge: "#0ea5e9",
    preview: (
      <div style={{ background: "#f0f9ff", height: "100%", display: "flex" }}>
        <div style={{ background: "#0c4a6e", width: "38%", padding: "10px 7px" }}>
          <div style={{ fontSize: "9px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>ARPIT SHAH</div>
          <div style={{ fontSize: "5.5px", color: "#7dd3fc", marginBottom: "6px" }}>Cloud Architect</div>
          <div style={{ fontSize: "5px", color: "#38bdf8", fontWeight: 700, marginBottom: "2px" }}>SKILLS</div>
          {["AWS", "Terraform", "K8s"].map(s => (<div key={s} style={{ background: "#0369a1", borderRadius: "2px", padding: "1.5px 3px", marginBottom: "2px", fontSize: "5px", color: "#bae6fd" }}>{s}</div>))}
        </div>
        <div style={{ flex: 1, padding: "10px 8px" }}>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#0c4a6e", borderBottom: "1.5px solid #0ea5e9", paddingBottom: "1px", marginBottom: "4px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#0c2340" }}>Cloud Architect</div>
          <div style={{ fontSize: "5.5px", color: "#0ea5e9", marginBottom: "2px" }}>CloudCorp · 2020–Now</div>
          <div style={{ fontSize: "5px", color: "#475569" }}>▸ Migrated 200+ apps to AWS</div>
          <div style={{ fontSize: "5px", color: "#475569" }}>▸ Saved ₹2Cr in infra costs</div>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#0c4a6e", borderBottom: "1.5px solid #0ea5e9", paddingBottom: "1px", marginTop: "5px", marginBottom: "3px" }}>EDUCATION</div>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#0c2340" }}>B.Tech CSE · BITS</div>
        </div>
      </div>
    ),
  },
  {
    id: 25, name: "Git Commit", tag: "Tech", isPro: true,
    desc: "Emerald-green left rule on white. Developer-friendly, clean, readable.",
    accent: "#16c784", badge: "#10b981",
    preview: (
      <div style={{ background: "#fff", height: "100%", display: "flex" }}>
        <div style={{ width: "4px", background: "#16c784", flexShrink: 0 }}></div>
        <div style={{ padding: "10px 10px", flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>KARAN MEHTA</div>
          <div style={{ fontSize: "8px", color: "#6b7280", marginBottom: "2px" }}>Backend Engineer</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginBottom: "8px" }}>karan@dev.io · Pune</div>
          <div style={{ borderBottom: "0.5px solid #d1fae5", marginBottom: "5px" }}></div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#374151", letterSpacing: "0.1em", marginBottom: "3px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#111827" }}>Backend Eng. — PayCo</div>
          <div style={{ fontSize: "6.5px", color: "#6b7280", marginBottom: "3px" }}>2021 – Present</div>
          <div style={{ fontSize: "6px", color: "#374151" }}>— Processed 10M txns/day</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginTop: "6px" }}>Go  ·  Kafka  ·  PostgreSQL  ·  Docker</div>
        </div>
      </div>
    ),
  },
  {
    id: 26, name: "UI Wireframe", tag: "Tech", isPro: true,
    desc: "Cool slate rule, technical precision layout. Perfect for UI/UX engineers.",
    accent: "#374151", badge: "#9ca3af",
    preview: (
      <div style={{ background: "#fff", height: "100%", display: "flex" }}>
        <div style={{ width: "4px", background: "#374151", flexShrink: 0 }}></div>
        <div style={{ padding: "10px 10px", flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#1f2937" }}>PALLAVI RAO</div>
          <div style={{ fontSize: "8px", color: "#6b7280", marginBottom: "2px" }}>Frontend Engineer</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginBottom: "8px" }}>pallavi@frontend.io · Hyderabad</div>
          <div style={{ borderBottom: "0.5px solid #e5e7eb", marginBottom: "5px" }}></div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#6b7280", letterSpacing: "0.1em", marginBottom: "3px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#1f2937" }}>Frontend Eng. — SaaSCo</div>
          <div style={{ fontSize: "6.5px", color: "#6b7280", marginBottom: "3px" }}>2020 – Present</div>
          <div style={{ fontSize: "6px", color: "#374151" }}>— Built component library used by 50+ devs</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginTop: "6px" }}>React  ·  TypeScript  ·  CSS  ·  A11y</div>
        </div>
      </div>
    ),
  },

  // Executive
  {
    id: 27, name: "Chief Executive", tag: "Executive", isPro: true,
    desc: "Deep navy banner with gold accent bar. Commands authority at the C-suite level.",
    accent: "#0f172a", badge: "#f59e0b",
    preview: (
      <div style={{ background: "#faf9f6", height: "100%" }}>
        <div style={{ background: "#0f172a", padding: "10px 12px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>RAJESH KAPOOR</div>
          <div style={{ fontSize: "7.5px", color: "#fbbf24", marginTop: "1px" }}>Chief Executive Officer</div>
          <div style={{ fontSize: "6px", color: "#d4b46e", marginTop: "2px" }}>rajesh@corp.com · Mumbai</div>
        </div>
        <div style={{ background: "#f59e0b", height: "3px" }}></div>
        <div style={{ padding: "8px 10px" }}>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "3px", marginBottom: "5px" }}>
            {["P&L", "M&A", "Board"].map(s => (<span key={s} style={{ background: "#fef3c7", color: "#78350f", borderRadius: "3px", padding: "1.5px 4px", fontSize: "5.5px", fontWeight: 700 }}>{s}</span>))}
          </div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#161130", marginBottom: "2px" }}>EXPERIENCE</div>
          <div style={{ borderBottom: "1px solid #f59e0b", marginBottom: "3px" }}></div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#0f172a" }}>CEO — Fortune 500 India</div>
          <div style={{ fontSize: "5.5px", color: "#a1823c" }}>2018 – Present</div>
          <div style={{ fontSize: "5.5px", color: "#44403c" }}>• Grew revenue from ₹100Cr to ₹500Cr</div>
        </div>
      </div>
    ),
  },
  {
    id: 28, name: "Enterprise Pillar", tag: "Executive", isPro: true,
    desc: "Charcoal sidebar, steel-gray accents. Strong, authoritative executive presence.",
    accent: "#1e293b", badge: "#475569",
    preview: (
      <div style={{ background: "#f8fafc", height: "100%", display: "flex" }}>
        <div style={{ background: "#1e293b", width: "38%", padding: "10px 7px" }}>
          <div style={{ fontSize: "9px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>VIVEK SHARMA</div>
          <div style={{ fontSize: "5.5px", color: "#94a3b8", marginBottom: "6px" }}>VP Engineering</div>
          <div style={{ fontSize: "5px", color: "#475569", fontWeight: 700, marginBottom: "2px" }}>SKILLS</div>
          {["Leadership", "P&L", "Scaling"].map(s => (<div key={s} style={{ background: "#334155", borderRadius: "2px", padding: "1.5px 3px", marginBottom: "2px", fontSize: "5px", color: "#94a3b8" }}>{s}</div>))}
        </div>
        <div style={{ flex: 1, padding: "10px 8px" }}>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#1e293b", borderBottom: "1.5px solid #475569", paddingBottom: "1px", marginBottom: "4px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#0f172a" }}>VP Engineering</div>
          <div style={{ fontSize: "5.5px", color: "#475569", marginBottom: "2px" }}>BigTech · 2019–Now</div>
          <div style={{ fontSize: "5px", color: "#475569" }}>▸ Led 200-person eng org</div>
          <div style={{ fontSize: "5px", color: "#475569" }}>▸ $50M ARR product portfolio</div>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#1e293b", borderBottom: "1.5px solid #475569", paddingBottom: "1px", marginTop: "5px", marginBottom: "3px" }}>EDUCATION</div>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#0f172a" }}>MBA · IIM A · 2011</div>
        </div>
      </div>
    ),
  },
  {
    id: 29, name: "Vice President", tag: "Executive", isPro: true,
    desc: "Deep wine header with champagne gold accents. Elegant VP and Director-level.",
    accent: "#450a0a", badge: "#fbbf24",
    preview: (
      <div style={{ background: "#fffdf7", height: "100%" }}>
        <div style={{ background: "#450a0a", padding: "10px 12px", textAlign: "center" as const }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>SANJAY BATRA</div>
          <div style={{ fontSize: "7.5px", color: "#fde68a", marginTop: "1px" }}>Vice President, Sales</div>
          <div style={{ fontSize: "6px", color: "#fbbf24", marginTop: "2px" }}>sanjay@corp.com · Delhi</div>
        </div>
        <div style={{ background: "#fbbf24", height: "2px" }}></div>
        <div style={{ padding: "8px 10px" }}>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#fbbf24", textAlign: "center" as const, marginBottom: "3px" }}>PROFESSIONAL PROFILE</div>
          <div style={{ borderBottom: "0.5px solid #fbbf24", marginBottom: "4px" }}></div>
          <div style={{ fontSize: "6px", color: "#374151", fontStyle: "italic" as const, marginBottom: "5px" }}>Sales executive with 18 years building enterprise relationships across APAC...</div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#fbbf24", textAlign: "center" as const, marginBottom: "2px" }}>EXPERIENCE</div>
          <div style={{ borderBottom: "0.5px solid #fbbf24", marginBottom: "3px" }}></div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#1c0505" }}>VP Sales — TechGiant India</div>
          <div style={{ fontSize: "5.5px", color: "#fbbf24" }}>*  Closed ₹200Cr in 2023</div>
        </div>
      </div>
    ),
  },
  {
    id: 30, name: "Visionary Officer", tag: "Executive", isPro: true,
    desc: "Black rule with gold section labels. Stark, powerful, C-suite authority.",
    accent: "#000000", badge: "#a1823c",
    preview: (
      <div style={{ background: "#fff", height: "100%", display: "flex" }}>
        <div style={{ width: "4px", background: "#000", flexShrink: 0 }}></div>
        <div style={{ padding: "10px 10px", flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#000" }}>ADITYA BIRLA</div>
          <div style={{ fontSize: "8px", color: "#6b7280", marginBottom: "2px" }}>Chief Operating Officer</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginBottom: "8px" }}>aditya@corp.com · Mumbai</div>
          <div style={{ borderBottom: "0.5px solid #000", marginBottom: "5px" }}></div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#a1823c", letterSpacing: "0.1em", marginBottom: "3px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#000" }}>COO — Industrial Group</div>
          <div style={{ fontSize: "6.5px", color: "#6b7280", marginBottom: "3px" }}>2016 – Present</div>
          <div style={{ fontSize: "6px", color: "#374151" }}>— Integrated 5 acquisitions, $2B AUM</div>
          <div style={{ fontSize: "6.5px", color: "#a1823c", marginTop: "6px" }}>Strategy  ·  M&A  ·  Ops  ·  P&L</div>
        </div>
      </div>
    ),
  },

  // Entry-Level
  {
    id: 31, name: "Graduate Launchpad", tag: "Entry-Level", isPro: true,
    desc: "Emerald green banner — fresh, energetic. Ideal for new grads & interns.",
    accent: "#065f46", badge: "#10b981",
    preview: (
      <div style={{ background: "#f0fdf4", height: "100%" }}>
        <div style={{ background: "#065f46", padding: "10px 12px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>RITU GUPTA</div>
          <div style={{ fontSize: "7.5px", color: "#6ee7b7", marginTop: "1px" }}>Fresh Graduate · CS</div>
          <div style={{ fontSize: "6px", color: "#34d399", marginTop: "2px" }}>ritu@gmail.com · Jaipur</div>
        </div>
        <div style={{ background: "#10b981", height: "3px" }}></div>
        <div style={{ padding: "8px 10px" }}>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "3px", marginBottom: "5px" }}>
            {["Python", "SQL", "Excel"].map(s => (<span key={s} style={{ background: "#d1fae5", color: "#065f46", borderRadius: "3px", padding: "1.5px 4px", fontSize: "5.5px", fontWeight: 700 }}>{s}</span>))}
          </div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#065f46", marginBottom: "2px" }}>PROJECTS</div>
          <div style={{ borderBottom: "1px solid #6ee7b7", marginBottom: "3px" }}></div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#022c22" }}>Final Year: ML Price Predictor</div>
          <div style={{ fontSize: "5.5px", color: "#065f46" }}>• 93% accuracy on test set</div>
          <div style={{ fontSize: "5.5px", color: "#065f46" }}>• Published on GitHub (250+ stars)</div>
        </div>
      </div>
    ),
  },
  {
    id: 32, name: "Project Engine", tag: "Entry-Level", isPro: true,
    desc: "Electric blue sidebar — confident and modern for early-career candidates.",
    accent: "#1d4ed8", badge: "#60a5fa",
    preview: (
      <div style={{ background: "#f0f9ff", height: "100%", display: "flex" }}>
        <div style={{ background: "#1d4ed8", width: "38%", padding: "10px 7px" }}>
          <div style={{ fontSize: "9px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>SONAL PATEL</div>
          <div style={{ fontSize: "5.5px", color: "#93c5fd", marginBottom: "6px" }}>Junior Developer</div>
          <div style={{ fontSize: "5px", color: "#bfdbfe", fontWeight: 700, marginBottom: "2px" }}>SKILLS</div>
          {["React", "Node.js", "Git"].map(s => (<div key={s} style={{ background: "#2563eb", borderRadius: "2px", padding: "1.5px 3px", marginBottom: "2px", fontSize: "5px", color: "#dbeafe" }}>{s}</div>))}
        </div>
        <div style={{ flex: 1, padding: "10px 8px" }}>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#1d4ed8", borderBottom: "1.5px solid #60a5fa", paddingBottom: "1px", marginBottom: "4px" }}>PROJECTS</div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#1e3a8a" }}>E-commerce Platform</div>
          <div style={{ fontSize: "5.5px", color: "#60a5fa", marginBottom: "2px" }}>React + Node + MongoDB</div>
          <div style={{ fontSize: "5px", color: "#475569" }}>▸ 500+ active users</div>
          <div style={{ fontSize: "5px", color: "#475569" }}>▸ Stripe payments integrated</div>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#1d4ed8", borderBottom: "1.5px solid #60a5fa", paddingBottom: "1px", marginTop: "5px", marginBottom: "3px" }}>EDUCATION</div>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#1e3a8a" }}>B.Tech IT · VIT · 2024</div>
        </div>
      </div>
    ),
  },
  {
    id: 33, name: "Career Pivot", tag: "Entry-Level", isPro: true,
    desc: "Sky blue centered header. Perfect for career changers & lateral moves.",
    accent: "#0369a1", badge: "#38bdf8",
    preview: (
      <div style={{ background: "#f0f9ff", height: "100%" }}>
        <div style={{ background: "#0369a1", padding: "10px 12px", textAlign: "center" as const }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>MOHAN DAS</div>
          <div style={{ fontSize: "7.5px", color: "#bae6fd", marginTop: "1px" }}>Career Transitioner → Data</div>
          <div style={{ fontSize: "6px", color: "#7dd3fc", marginTop: "2px" }}>mohan@email.com · Chennai</div>
        </div>
        <div style={{ background: "#38bdf8", height: "2px" }}></div>
        <div style={{ padding: "8px 10px" }}>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#38bdf8", textAlign: "center" as const, marginBottom: "3px" }}>TRANSFERABLE SKILLS</div>
          <div style={{ borderBottom: "0.5px solid #38bdf8", marginBottom: "4px" }}></div>
          <div style={{ fontSize: "6px", color: "#374151", textAlign: "center" as const, marginBottom: "5px" }}>Python  ·  Tableau  ·  SQL  ·  Excel  ·  Statistics</div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#38bdf8", textAlign: "center" as const, marginBottom: "2px" }}>RELEVANT PROJECTS</div>
          <div style={{ borderBottom: "0.5px solid #38bdf8", marginBottom: "3px" }}></div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#0c4a6e" }}>Sales Dashboard — Tableau</div>
          <div style={{ fontSize: "5.5px", color: "#0369a1" }}>*  Presented to 50-person sales team</div>
        </div>
      </div>
    ),
  },
  {
    id: 34, name: "Bold Ambition", tag: "Entry-Level", isPro: true,
    desc: "Fiery orange banner — high energy and enthusiasm. Stand out from the crowd.",
    accent: "#c2410c", badge: "#fb923c",
    preview: (
      <div style={{ background: "#fff7ed", height: "100%" }}>
        <div style={{ background: "#c2410c", padding: "10px 12px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>NEHA JOSHI</div>
          <div style={{ fontSize: "7.5px", color: "#fed7aa", marginTop: "1px" }}>Marketing Intern → Associate</div>
          <div style={{ fontSize: "6px", color: "#fb923c", marginTop: "2px" }}>neha@email.com · Indore</div>
        </div>
        <div style={{ background: "#f97316", height: "3px" }}></div>
        <div style={{ padding: "8px 10px" }}>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "3px", marginBottom: "5px" }}>
            {["Social Media", "Canva", "SEO"].map(s => (<span key={s} style={{ background: "#ffedd5", color: "#9a3412", borderRadius: "3px", padding: "1.5px 4px", fontSize: "5.5px", fontWeight: 700 }}>{s}</span>))}
          </div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#c2410c", marginBottom: "2px" }}>EXPERIENCE</div>
          <div style={{ borderBottom: "1px solid #fb923c", marginBottom: "3px" }}></div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#1c1917" }}>Marketing Intern — StartupX</div>
          <div style={{ fontSize: "5.5px", color: "#c2410c" }}>• Grew Instagram from 2K to 50K</div>
          <div style={{ fontSize: "5.5px", color: "#c2410c" }}>• Ran ₹5L campaign, 3x ROI</div>
        </div>
      </div>
    ),
  },

  // Industry-Specific
  {
    id: 35, name: "Clinical Specialist", tag: "Healthcare", isPro: true,
    desc: "Medical blue rule on white. Professional, trustworthy — built for healthcare.",
    accent: "#1e3a8a", badge: "#3b82f6",
    preview: (
      <div style={{ background: "#fff", height: "100%", display: "flex" }}>
        <div style={{ width: "4px", background: "#1e3a8a", flexShrink: 0 }}></div>
        <div style={{ padding: "10px 10px", flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#1e3a8a" }}>DR. POOJA RAO</div>
          <div style={{ fontSize: "8px", color: "#3b82f6", marginBottom: "2px" }}>Clinical Pharmacist</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginBottom: "8px" }}>pooja@hospital.com · Bangalore</div>
          <div style={{ borderBottom: "0.5px solid #bfdbfe", marginBottom: "5px" }}></div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#3b82f6", letterSpacing: "0.1em", marginBottom: "3px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "8px", fontWeight: 700, color: "#1e3a8a" }}>Clinical Pharmacist — Apollo</div>
          <div style={{ fontSize: "6.5px", color: "#6b7280", marginBottom: "3px" }}>2020 – Present</div>
          <div style={{ fontSize: "6px", color: "#374151" }}>— Managed formulary for 300-bed ICU</div>
          <div style={{ fontSize: "6.5px", color: "#9ca3af", marginTop: "6px" }}>Pharm.D  ·  ICU  ·  Drug Safety  ·  DUE</div>
        </div>
      </div>
    ),
  },
  {
    id: 36, name: "Financial Quant", tag: "Finance", isPro: true,
    desc: "Forest green sidebar, trusted & established. Finance, banking & investment.",
    accent: "#14532d", badge: "#16a34a",
    preview: (
      <div style={{ background: "#f0fdf4", height: "100%", display: "flex" }}>
        <div style={{ background: "#14532d", width: "38%", padding: "10px 7px" }}>
          <div style={{ fontSize: "9px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>ROHIT BANSAL</div>
          <div style={{ fontSize: "5.5px", color: "#86efac", marginBottom: "6px" }}>Investment Analyst</div>
          <div style={{ fontSize: "5px", color: "#4ade80", fontWeight: 700, marginBottom: "2px" }}>SKILLS</div>
          {["DCF", "Python", "Bloomberg"].map(s => (<div key={s} style={{ background: "#15803d", borderRadius: "2px", padding: "1.5px 3px", marginBottom: "2px", fontSize: "5px", color: "#bbf7d0" }}>{s}</div>))}
        </div>
        <div style={{ flex: 1, padding: "10px 8px" }}>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#14532d", borderBottom: "1.5px solid #16a34a", paddingBottom: "1px", marginBottom: "4px" }}>EXPERIENCE</div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#052e16" }}>Investment Analyst</div>
          <div style={{ fontSize: "5.5px", color: "#16a34a", marginBottom: "2px" }}>PE Firm · 2021–Now</div>
          <div style={{ fontSize: "5px", color: "#475569" }}>▸ Screened 200+ deals annually</div>
          <div style={{ fontSize: "5px", color: "#475569" }}>▸ Modeled ₹500Cr exits</div>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#14532d", borderBottom: "1.5px solid #16a34a", paddingBottom: "1px", marginTop: "5px", marginBottom: "3px" }}>EDUCATION</div>
          <div style={{ fontSize: "6px", fontWeight: 700, color: "#052e16" }}>MBA Finance · IIM C</div>
        </div>
      </div>
    ),
  },
  {
    id: 37, name: "Legal Associate", tag: "Legal", isPro: true,
    desc: "Charcoal header with amber law accents. Authoritative and precise for legal.",
    accent: "#1c1917", badge: "#a16207",
    preview: (
      <div style={{ background: "#fafaf9", height: "100%" }}>
        <div style={{ background: "#1c1917", padding: "10px 12px", textAlign: "center" as const }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>ADV. SUPRIYA NAIR</div>
          <div style={{ fontSize: "7.5px", color: "#fcd34d", marginTop: "1px" }}>Corporate Lawyer</div>
          <div style={{ fontSize: "6px", color: "#d97706", marginTop: "2px" }}>supriya@lawfirm.com · Bombay HC</div>
        </div>
        <div style={{ background: "#a16207", height: "2px" }}></div>
        <div style={{ padding: "8px 10px" }}>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#a16207", textAlign: "center" as const, marginBottom: "3px" }}>PROFESSIONAL PROFILE</div>
          <div style={{ borderBottom: "0.5px solid #a16207", marginBottom: "4px" }}></div>
          <div style={{ fontSize: "6px", color: "#374151", fontStyle: "italic" as const, marginBottom: "5px" }}>Corporate counsel specialising in M&A, joint ventures and regulatory compliance...</div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#a16207", textAlign: "center" as const, marginBottom: "2px" }}>EXPERIENCE</div>
          <div style={{ borderBottom: "0.5px solid #a16207", marginBottom: "3px" }}></div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#1c1917" }}>Associate — AZB & Partners</div>
          <div style={{ fontSize: "5.5px", color: "#a16207" }}>*  Advised on ₹1,000Cr acquisition</div>
        </div>
      </div>
    ),
  },
  {
    id: 38, name: "Nonprofit Advocate", tag: "NGO / Social", isPro: true,
    desc: "Deep forest green banner with amber. Warm & mission-driven for NGO/CSR roles.",
    accent: "#0f4c35", badge: "#d97706",
    preview: (
      <div style={{ background: "#f0fdf4", height: "100%" }}>
        <div style={{ background: "#0f4c35", padding: "10px 12px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>SHWETA BOSE</div>
          <div style={{ fontSize: "7.5px", color: "#6ee7b7", marginTop: "1px" }}>Program Manager · NGO</div>
          <div style={{ fontSize: "6px", color: "#34d399", marginTop: "2px" }}>shweta@ngo.org · Kolkata</div>
        </div>
        <div style={{ background: "#d97706", height: "3px" }}></div>
        <div style={{ padding: "8px 10px" }}>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "3px", marginBottom: "5px" }}>
            {["Fundraising", "M&E", "Grants"].map(s => (<span key={s} style={{ background: "#d1fae5", color: "#065f46", borderRadius: "3px", padding: "1.5px 4px", fontSize: "5.5px", fontWeight: 700 }}>{s}</span>))}
          </div>
          <div style={{ fontSize: "6.5px", fontWeight: 700, color: "#0f4c35", marginBottom: "2px" }}>EXPERIENCE</div>
          <div style={{ borderBottom: "1px solid #6ee7b7", marginBottom: "3px" }}></div>
          <div style={{ fontSize: "7px", fontWeight: 700, color: "#022c22" }}>Program Manager — ChildFirst</div>
          <div style={{ fontSize: "5.5px", color: "#0f4c35" }}>• Raised ₹2Cr in grants, FY 2023</div>
          <div style={{ fontSize: "5.5px", color: "#0f4c35" }}>• Managed 50+ field staff across 3 states</div>
        </div>
      </div>
    ),
  },
];

// ── Field helpers ────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, multiline = false }: any) {
  const inp: any = {
    background: "#fff", border: "1.5px solid #d1fae5", color: "#111827",
    borderRadius: "10px", padding: "10px 12px", width: "100%",
    fontSize: "13px", outline: "none", fontFamily: "inherit", boxSizing: "border-box",
  };
  return (
    <div>
      <p style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "5px", margin: "0 0 5px" }}>{label}</p>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...inp, resize: "vertical" }} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inp} />
      }
    </div>
  );
}

function SectionTitle({ children }: any) {
  return (
    <p style={{ fontSize: "13px", fontWeight: 700, color: "#059669", margin: "18px 0 10px", paddingBottom: "6px", borderBottom: "1.5px solid #d1fae5" }}>
      {children}
    </p>
  );
}

// ── Main Component ───────────────────────────────────────────────
export default function TemplatesPage() {
  const [user, setUser] = useState<any>(null);
  const [booting, setBooting] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [toast, setToast] = useState("");

  const [step, setStep] = useState<"gallery" | "form">("gallery");
  const [selectedId, setSelectedId] = useState(1);
  const [parsing, setParsing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [data, setData] = useState<ResumeData>(emptyResumeData);
  const [includeDeclaration, setIncludeDeclaration] = useState(false);
  const [noResumeWarning, setNoResumeWarning] = useState(false);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3500); }

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => { if (result?.user) setUser(result.user); })
      .catch((err) => { if (err?.code !== "auth/no-current-user") showToast("Sign-in failed. Open in Chrome or Safari and try again."); });
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Load resume text from sessionStorage (passed from main page)
        const stored = sessionStorage.getItem("ncl_resume_text");
        if (stored) { setResumeText(stored); }
        else { setNoResumeWarning(true); }
        // Load pro status — also grant first-session users full access
        const snap = await getDocs(query(collection(db, "users"), where("uid", "==", u.uid)));
        if (!snap.empty) {
          const ud = snap.docs[0].data();
          setIsPro(ud.plan === "pro" || ud.firstSessionActive === true);
        }
      }
      setBooting(false);
    });
    return () => unsub();
  }, []);

  async function login() {
    try {
      const ua = navigator.userAgent;
      const isInApp = /FBAN|FBAV|Instagram|WhatsApp|Line|Twitter|TikTok|MicroMessenger/i.test(ua);
      if (isInApp) {
        alert("Please open this page in Chrome or Safari to sign in with Google.");
        return;
      }
      try {
        await signInWithPopup(auth, provider);
      } catch (e: any) {
        if (e?.code === "auth/popup-blocked") {
          await signInWithRedirect(auth, provider);
        } else if (e?.code !== "auth/popup-closed-by-user") {
          throw e;
        }
      }
    } catch { alert("Login failed. Please try again."); }
  }

  async function handleUseTemplate(id: number) {
    setSelectedId(id);
    if (!user) { alert("Please login first."); return; }
    if (!resumeText.trim()) {
      showToast("⚠️ Please upload your resume in ATS Analyzer first.");
      setNoResumeWarning(true);
      return;
    }
    setParsing(true);
    setNoResumeWarning(false);
    showToast("⏳ AI is enhancing your resume...");
    try {
      const token = await user.getIdToken();
      const parsed = await parseAndEnhanceResume(resumeText, token);
      if (!parsed.name && !parsed.email && !parsed.role) {
        showToast("⚠️ AI couldn't read resume data. Please fill the form manually.");
      } else {
        showToast("✨ Resume enhanced! Review and edit before downloading.");
      }
      setData(parsed);
    } catch (e: any) {
      showToast(`❌ ${e?.message || "Parse failed"}. Fill the form manually.`);
      setData(emptyResumeData);
    }
    setParsing(false);
    setStep("form");
  }

  function handleDownload() {
    if (!isPro) { showToast("Upgrade to Pro to download!"); return; }
    if (!data.name.trim()) { showToast("Please fill your name first!"); return; }
    setDownloading(true);
    try {
      console.log("includeDeclaration value:", includeDeclaration);
      generateResumePdf(data, selectedId, includeDeclaration);
      showToast("✅ Resume downloaded!");
    } catch { showToast("Download failed. Try again."); }
    setDownloading(false);
  }

  function upd(field: keyof ResumeData) {
    return (val: string) => setData(prev => ({ ...prev, [field]: val }));
  }

  if (booting) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #e6faf5 0%, #fef9f0 60%, #fde8e8 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Inter, -apple-system, sans-serif", gap: "20px" }}>
      <div style={{ position: "relative", width: "52px", height: "52px" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid #d1fae5" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid transparent", borderTopColor: "#059669", animation: "spin 0.8s linear infinite" }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "16px", fontWeight: 700, color: "#059669", margin: "0 0 4px" }}>Loading Resume Templates</p>
        <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>Setting up your workspace...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const selectedTemplate = TEMPLATES.find(t => t.id === selectedId)!;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        .tmpl-page { min-height: 100vh; background: linear-gradient(135deg, #e6faf5 0%, #fef9f0 60%, #fde8e8 100%); font-family: 'Inter', -apple-system, sans-serif; }
        .tmpl-container { max-width: 1100px; margin: 0 auto; padding: 20px 16px; }

        /* Header */
        .tmpl-header { background: #fff; border-radius: 14px; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border: 1px solid #d1fae5; box-shadow: 0 2px 12px rgba(5,150,105,0.08); }
        .tmpl-logo { font-size: 20px; font-weight: 700; text-decoration: none; }
        .back-link { font-size: 13px; font-weight: 600; color: #059669; text-decoration: none; padding: 7px 14px; border-radius: 8px; border: 1.5px solid #059669; background: #fff; cursor: pointer; }
        .back-link:hover { background: #f0fdf4; }

        /* Card */
        .tmpl-card { background: rgba(255,255,255,0.93); border-radius: 16px; border: 1px solid #d1fae5; padding: 24px; box-shadow: 0 2px 16px rgba(5,150,105,0.07); }
        .tmpl-card-title { font-size: 22px; font-weight: 700; color: #059669; margin: 0 0 6px; }
        .tmpl-subtitle { font-size: 13px; color: #6b7280; margin: 0 0 24px; }

        /* Gallery grid */
        .gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .g-card { border-radius: 14px; border: 2px solid #e5e7eb; overflow: hidden; cursor: pointer; transition: all 0.2s; background: #fff; }
        .g-card:hover { border-color: #059669; box-shadow: 0 6px 24px rgba(5,150,105,0.15); transform: translateY(-3px); }
        .g-card.selected { border-color: #059669; box-shadow: 0 6px 24px rgba(5,150,105,0.2); }
        .g-preview { height: 190px; overflow: hidden; }
        .g-footer { padding: 10px 14px; border-top: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center; }
        .g-name { font-size: 13px; font-weight: 700; color: #111827; }
        .g-tag { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 20px; background: #f0fdf4; color: #059669; }
        .g-use-btn { font-size: 12px; font-weight: 700; padding: 7px 16px; border-radius: 9px; background: #059669; color: #fff; border: none; cursor: pointer; transition: background 0.15s; }
        .g-use-btn:hover { background: #047857; }

        /* Pro gate banner */
        .pro-banner { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; border-radius: 12px; background: #fff7ed; border: 1px solid #fed7aa; flex-wrap: wrap; gap: 10px; margin-top: 20px; }

        /* Form */
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .form-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px; }
        .btn-dl { padding: 13px 28px; border-radius: 11px; font-size: 14px; font-weight: 700; border: none; cursor: pointer; }
        .btn-back { padding: 13px 20px; border-radius: 11px; font-size: 13px; font-weight: 600; background: #f9fafb; color: #374151; border: 1px solid #e5e7eb; cursor: pointer; }

        /* AI improvements box */
        .ai-box { background: linear-gradient(135deg, #f0fdf4, #ecfeff); border: 1px solid #a7f3d0; border-radius: 12px; padding: 14px 16px; margin-bottom: 18px; }
        .ai-box-title { font-size: 13px; font-weight: 700; color: #059669; margin: 0 0 8px; }
        .ai-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .ai-chip { font-size: 11px; padding: 4px 10px; border-radius: 20px; background: #fff; border: 1px solid #6ee7b7; color: "#065f46"; font-weight: 500; }

        /* Jobs notice */
        .jobs-notice { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 12px 14px; margin-bottom: 16px; font-size: 12px; color: "#1e40af"; }

        /* Toast */
        .toast { position: fixed; top: 16px; left: 50%; transform: translateX(-50%); z-index: 999; padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 600; background: #fff; border: 1.5px solid #059669; color: #059669; box-shadow: 0 4px 20px rgba(5,150,105,0.15); white-space: nowrap; }

        @media (max-width: 900px) { .gallery-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) {
          .gallery-grid { grid-template-columns: 1fr; }
          .form-grid-2, .form-grid-3 { grid-template-columns: 1fr; }
          .g-preview { height: 160px; }
        }
      `}</style>

      <div className="tmpl-page">
        {toast && <div className="toast">{toast}</div>}
        <div className="tmpl-container">

          {/* Header */}
          <header className="tmpl-header">
            <a href="/" className="tmpl-logo">
              <span style={{ color: "#059669" }}>Upgrade </span>
              <span style={{ color: "#f97316" }}>Your </span>
              <span style={{ color: "#059669" }}>Resume</span>
            </a>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              {user ? (
                <>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "6px 12px" }}>
                    {user.displayName?.split(" ")[0] || user.email}
                    {isPro && <span style={{ marginLeft: "5px", color: "#f97316" }}>⭐</span>}
                  </span>
                  <a href="/" className="back-link">← Back to App</a>
                </>
              ) : (
                <>
                  <button onClick={login} style={{ fontSize: "13px", fontWeight: 600, color: "#fff", background: "#059669", border: "none", borderRadius: "8px", padding: "7px 14px", cursor: "pointer" }}>Login</button>
                  <a href="/" className="back-link">← Back to App</a>
                </>
              )}
            </div>
          </header>

          <div className="tmpl-card">

            {/* GALLERY VIEW */}
            {step === "gallery" && (
              <>
                <p className="tmpl-card-title">📄 Resume Templates</p>
                <p className="tmpl-subtitle">Choose a template — AI will fill it from your uploaded resume. All fields are editable before downloading.</p>

                {noResumeWarning && (
                  <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: "12px", padding: "16px 20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "22px" }}>⚠️</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "#b91c1c", margin: "0 0 4px" }}>No resume uploaded</p>
                      <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>Please go back to the ATS Analyzer tab, upload your resume, then come back here.</p>
                    </div>
                    <a href="/" style={{ padding: "9px 18px", borderRadius: "9px", fontSize: "13px", fontWeight: 700, background: "#059669", color: "#fff", textDecoration: "none", whiteSpace: "nowrap" }}>
                      ← Go Upload Resume
                    </a>
                  </div>
                )}

                {!noResumeWarning && resumeText.trim() && (
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "10px 16px", marginBottom: "18px", fontSize: "13px", color: "#059669", fontWeight: 600 }}>
                    ✅ Resume detected — AI will auto-fill the form when you click "Use This →"
                  </div>
                )}

                <div className="gallery-grid">
                  {TEMPLATES.map(t => {
                    const isProTemplate = (t as any).isPro === true;
                    const locked = isProTemplate && !isPro;
                    return (
                      <div key={t.id} className={`g-card ${selectedId === t.id ? "selected" : ""}`} onClick={() => setSelectedId(t.id)}
                        style={{ opacity: locked ? 0.85 : 1 }}>
                        <div style={{ position: "relative" }}>
                          <div className="g-preview">{t.preview}</div>
                          {/* FREE / PRO badge */}
                          {isProTemplate ? (
                            <div style={{ position: "absolute", top: "8px", right: "8px", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "3px 8px", borderRadius: "20px", letterSpacing: "0.04em" }}>⭐ PRO</div>
                          ) : (
                            <div style={{ position: "absolute", top: "8px", right: "8px", background: "#059669", color: "#fff", fontSize: "9px", fontWeight: 700, padding: "3px 8px", borderRadius: "20px" }}>FREE</div>
                          )}
                          {/* Lock overlay for non-Pro users on Pro templates */}
                          {locked && (
                            <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ background: "rgba(255,255,255,0.92)", borderRadius: "10px", padding: "8px 14px", textAlign: "center" as const }}>
                                <div style={{ fontSize: "18px", marginBottom: "2px" }}>🔒</div>
                                <div style={{ fontSize: "10px", fontWeight: 700, color: "#0f172a" }}>Pro Template</div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div style={{ padding: "8px 14px 4px", borderTop: "1px solid #f3f4f6" }}>
                          <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 4px" }}>{t.desc}</p>
                        </div>
                        <div className="g-footer">
                          <div>
                            <span className="g-name">{t.name}</span>
                            <span className="g-tag" style={{ marginLeft: "6px" }}>{t.tag}</span>
                          </div>
                          <button
                            className="g-use-btn"
                            style={{ background: locked ? "#9ca3af" : t.accent, cursor: locked ? "not-allowed" : "pointer" }}
                            onClick={e => {
                              e.stopPropagation();
                              if (locked) {
                                showToast("🔒 This is a Pro template. Upgrade to access all 32 Pro designs.");
                                return;
                              }
                              handleUseTemplate(t.id);
                            }}
                            disabled={parsing && selectedId === t.id}
                          >
                            {parsing && selectedId === t.id ? "⏳ AI Working..." : locked ? "🔒 Pro Only" : "Use This →"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!isPro && (
                  <div className="pro-banner">
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "#c2410c", margin: "0 0 2px" }}>🔒 32 Pro templates + AI download</p>
                      <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>6 FREE templates available now. Upgrade to unlock all 32 Pro designs & PDF download.</p>
                    </div>
                    <a href="/" style={{ padding: "9px 18px", borderRadius: "9px", fontSize: "13px", fontWeight: 700, background: "#f97316", color: "#fff", textDecoration: "none" }}>
                      Upgrade to Pro →
                    </a>
                  </div>
                )}
              </>
            )}

            {/* FORM VIEW */}
            {step === "form" && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px", flexWrap: "wrap" }}>
                  <button onClick={() => setStep("gallery")} className="back-link">← Templates</button>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: selectedTemplate.accent }}></div>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>{selectedTemplate.name}</span>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", background: "#f0fdf4", color: "#059669", fontWeight: 600 }}>{selectedTemplate.tag}</span>
                  </div>
                </div>

                {/* AI Improvements box */}
                {data.aiImprovements && (
                  <div className="ai-box">
                    <p className="ai-box-title">✨ AI Enhanced Your Resume</p>
                    <div className="ai-chips">
                      {data.aiImprovements.split("|").map((imp, i) => (
                        <span key={i} className="ai-chip">✅ {imp.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Jobs notice */}
                {data.totalJobsFound > 0 && (
                  <div className="jobs-notice">
                    <strong>🤖 AI Job Detection:</strong> Found {data.totalJobsFound} jobs in your resume — all included below with no content removed.
                  </div>
                )}

                {/* Personal Info */}
                <SectionTitle>👤 Personal Information</SectionTitle>
                <div className="form-grid-2" style={{ marginBottom: "12px" }}>
                  <Field label="Full Name" value={data.name} onChange={upd("name")} placeholder="e.g. Rahul Sharma" />
                  <Field label="Job Title / Role" value={data.role} onChange={upd("role")} placeholder="e.g. Software Engineer" />
                  <Field label="Email" value={data.email} onChange={upd("email")} placeholder="you@email.com" />
                  <Field label="Phone" value={data.phone} onChange={upd("phone")} placeholder="+91 98765 43210" />
                  <Field label="Location" value={data.location} onChange={upd("location")} placeholder="City, State" />
                </div>

                <SectionTitle>💼 Professional Summary</SectionTitle>
                <Field label="Summary" value={data.summary} onChange={upd("summary")} placeholder="2-3 powerful sentences about your professional background..." multiline />

                <SectionTitle>⚡ Skills</SectionTitle>
                <Field label="Skills (comma separated)" value={data.skills} onChange={upd("skills")} placeholder="React, Node.js, Python, AWS, Docker, Agile..." />

                <SectionTitle>🏢 Experience — Job 1 (Most Recent)</SectionTitle>
                <div className="form-grid-3" style={{ marginBottom: "10px" }}>
                  <Field label="Job Title" value={data.exp1Title} onChange={upd("exp1Title")} placeholder="Senior Developer" />
                  <Field label="Company" value={data.exp1Company} onChange={upd("exp1Company")} placeholder="Google" />
                  <Field label="Duration" value={data.exp1Duration} onChange={upd("exp1Duration")} placeholder="Jan 2022 – Present" />
                </div>
                <Field label="Key Achievements (separate with | character)" value={data.exp1Points} onChange={upd("exp1Points")} placeholder="Built API for 1M users | Reduced costs 30% | Led team of 8" multiline />

                <SectionTitle>🏢 Experience — Job 2</SectionTitle>
                <div className="form-grid-3" style={{ marginBottom: "10px" }}>
                  <Field label="Job Title" value={data.exp2Title} onChange={upd("exp2Title")} placeholder="Developer" />
                  <Field label="Company" value={data.exp2Company} onChange={upd("exp2Company")} placeholder="Infosys" />
                  <Field label="Duration" value={data.exp2Duration} onChange={upd("exp2Duration")} placeholder="Jun 2019 – Dec 2021" />
                </div>
                <Field label="Key Achievements (separate with | character)" value={data.exp2Points} onChange={upd("exp2Points")} placeholder="Developed mobile app 50K downloads | Improved test coverage 85%" multiline />

                <SectionTitle>🏢 Experience — Job 3</SectionTitle>
                <div className="form-grid-3" style={{ marginBottom: "10px" }}>
                  <Field label="Job Title" value={data.exp3Title} onChange={upd("exp3Title")} placeholder="Junior Developer" />
                  <Field label="Company" value={data.exp3Company} onChange={upd("exp3Company")} placeholder="Wipro" />
                  <Field label="Duration" value={data.exp3Duration} onChange={upd("exp3Duration")} placeholder="Jun 2017 – May 2019" />
                </div>
                <Field label="Key Achievements (separate with | character)" value={data.exp3Points} onChange={upd("exp3Points")} placeholder="Maintained legacy system | Onboarded 5 new clients" multiline />

                {data.exp4Title && (
                  <>
                    <SectionTitle>🏢 Experience — Job 4</SectionTitle>
                    <div className="form-grid-3" style={{ marginBottom: "10px" }}>
                      <Field label="Job Title" value={data.exp4Title} onChange={upd("exp4Title")} placeholder="" />
                      <Field label="Company" value={data.exp4Company} onChange={upd("exp4Company")} placeholder="" />
                      <Field label="Duration" value={data.exp4Duration} onChange={upd("exp4Duration")} placeholder="" />
                    </div>
                    <Field label="Key Achievements (separate with | character)" value={data.exp4Points} onChange={upd("exp4Points")} placeholder="" multiline />
                  </>
                )}

                {data.exp5Title && (
                  <>
                    <SectionTitle>🏢 Experience — Job 5</SectionTitle>
                    <div className="form-grid-3" style={{ marginBottom: "10px" }}>
                      <Field label="Job Title" value={data.exp5Title} onChange={upd("exp5Title")} placeholder="" />
                      <Field label="Company" value={data.exp5Company} onChange={upd("exp5Company")} placeholder="" />
                      <Field label="Duration" value={data.exp5Duration} onChange={upd("exp5Duration")} placeholder="" />
                    </div>
                    <Field label="Key Achievements (separate with | character)" value={data.exp5Points} onChange={upd("exp5Points")} placeholder="" multiline />
                  </>
                )}

                {data.exp6Title && (
                  <>
                    <SectionTitle>🏢 Experience — Job 6</SectionTitle>
                    <div className="form-grid-3" style={{ marginBottom: "10px" }}>
                      <Field label="Job Title" value={data.exp6Title} onChange={upd("exp6Title")} placeholder="" />
                      <Field label="Company" value={data.exp6Company} onChange={upd("exp6Company")} placeholder="" />
                      <Field label="Duration" value={data.exp6Duration} onChange={upd("exp6Duration")} placeholder="" />
                    </div>
                    <Field label="Key Achievements (separate with | character)" value={data.exp6Points} onChange={upd("exp6Points")} placeholder="" multiline />
                  </>
                )}

                {data.exp7Title && (
                  <>
                    <SectionTitle>🏢 Experience — Job 7</SectionTitle>
                    <div className="form-grid-3" style={{ marginBottom: "10px" }}>
                      <Field label="Job Title" value={data.exp7Title} onChange={upd("exp7Title")} placeholder="" />
                      <Field label="Company" value={data.exp7Company} onChange={upd("exp7Company")} placeholder="" />
                      <Field label="Duration" value={data.exp7Duration} onChange={upd("exp7Duration")} placeholder="" />
                    </div>
                    <Field label="Key Achievements (separate with | character)" value={data.exp7Points} onChange={upd("exp7Points")} placeholder="" multiline />
                  </>
                )}

                <SectionTitle>🎓 Education</SectionTitle>
                <div className="form-grid-3" style={{ marginBottom: "10px" }}>
                  <Field label="Degree & Field" value={data.edu1Degree} onChange={upd("edu1Degree")} placeholder="B.Tech Computer Science" />
                  <Field label="University / College" value={data.edu1School} onChange={upd("edu1School")} placeholder="IIT Delhi" />
                  <Field label="Year" value={data.edu1Year} onChange={upd("edu1Year")} placeholder="2019" />
                </div>
                <div className="form-grid-3">
                  <Field label="Degree 2 (if any)" value={data.edu2Degree} onChange={upd("edu2Degree")} placeholder="MBA Finance" />
                  <Field label="University 2" value={data.edu2School} onChange={upd("edu2School")} placeholder="IIM Calcutta" />
                  <Field label="Year 2" value={data.edu2Year} onChange={upd("edu2Year")} placeholder="2021" />
                </div>

                <SectionTitle>🏆 Certifications & Languages</SectionTitle>
                <div className="form-grid-2">
                  <Field label="Certifications (comma separated)" value={data.certifications} onChange={upd("certifications")} placeholder="AWS Solutions Architect, PMP, ITIL V3" />
                  <Field label="Languages (comma separated)" value={data.languages} onChange={upd("languages")} placeholder="Hindi, English, Marathi" />
                </div>

                <SectionTitle>📁 Key Projects</SectionTitle>
                <Field label="Key Projects (separate each with |)" value={data.projects} onChange={upd("projects")} placeholder="Service Desk Automation using Python APIs | Cloud Migration Support for enterprise clients" multiline />

                <SectionTitle>🥇 Achievements & Awards</SectionTitle>
                <Field label="Achievements (separate each with |)" value={data.achievements} onChange={upd("achievements")} placeholder="Best Team Leader Award 2022 | Recognized for Excellence in Customer Support" multiline />

                <SectionTitle>➕ Additional Sections</SectionTitle>
                <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px", marginTop: "-8px" }}>
                  Any section not listed above — Additional Information, Tools & Technologies, Volunteer Work, Publications, References, etc. Each section separated by <strong>===</strong>. Format: Section Title on first line, items separated by <strong>|</strong> on second line.
                </p>
                <Field label="Extra Sections (AI auto-filled from your resume)" value={data.extraSections} onChange={upd("extraSections")} placeholder={"Additional Information\nStrong communicator | Works under pressure | Remote team experience\n===\nTools & Technologies\nServiceNow | Jira | Grafana | Kibana"} multiline />

                {/* AI note */}
                <div style={{ marginTop: "20px", padding: "12px 16px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0", fontSize: "12px", color: "#059669" }}>
                  ✨ <strong>AI Enhanced:</strong> Content professionally improved. Review all fields — you can edit anything before downloading.
                </div>

                {/* Action buttons */}
                {/* Declaration Checkbox */}
                  <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="checkbox"
                      id="includeDeclaration"
                      checked={includeDeclaration}
                      onChange={e => setIncludeDeclaration(e.target.checked)}
                      style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#059669" }}
                    />
                    <label htmlFor="includeDeclaration" style={{ fontSize: "13px", color: "#374151", cursor: "pointer", fontWeight: 600 }}>
                      Include Declaration in Resume
                    </label>

                <div className="form-actions">
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="btn-dl"
                    style={{
                      background: isPro ? selectedTemplate.accent : "#9ca3af",
                      color: "#fff",
                      opacity: downloading ? 0.7 : 1,
                      cursor: isPro ? "pointer" : "not-allowed",
                    }}
                  >
                    {downloading ? "⏳ Generating PDF..." : isPro ? "⬇ Download Resume PDF" : "🔒 Upgrade to Download"}
                  </button>

                  </div>
                  <button onClick={() => setStep("gallery")} className="btn-back">← Change Template</button>
                </div>

                {!isPro && (
                  <div style={{ marginTop: "10px", padding: "12px 14px", borderRadius: "10px", background: "#fff7ed", border: "1px solid #fed7aa", fontSize: "13px", color: "#c2410c" }}>
                    🔒 Download requires Pro plan.{" "}
                    <a href="/" style={{ color: "#f97316", fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>Upgrade here →</a>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

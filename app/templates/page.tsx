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
    id: 1, name: "Sharp", tag: "Corporate",
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
    id: 2, name: "Ivy", tag: "Academic",
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
    id: 3, name: "Slate", tag: "Tech / Startup",
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
    id: 4, name: "Ember", tag: "Creative",
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
    id: 5, name: "Clarity", tag: "Minimal",
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
    accent: "#0f172a", badge: "#a1823c",
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
    getRedirectResult(auth).catch(console.error);
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Load resume text from sessionStorage (passed from main page)
        const stored = sessionStorage.getItem("ncl_resume_text");
        if (stored) { setResumeText(stored); }
        else { setNoResumeWarning(true); }
        // Load pro status
        const snap = await getDocs(query(collection(db, "users"), where("uid", "==", u.uid)));
        if (!snap.empty) setIsPro(snap.docs[0].data().plan === "pro");
      }
      setBooting(false);
    });
    return () => unsub();
  }, []);

  async function login() {
    try {
      try { await signInWithPopup(auth, provider); }
      catch { await signInWithRedirect(auth, provider); }
    } catch { alert("Login failed."); }
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
                  {TEMPLATES.map(t => (
                    <div key={t.id} className={`g-card ${selectedId === t.id ? "selected" : ""}`} onClick={() => setSelectedId(t.id)}>
                      <div className="g-preview">{t.preview}</div>
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
                          style={{ background: t.accent }}
                          onClick={e => { e.stopPropagation(); handleUseTemplate(t.id); }}
                          disabled={parsing}
                        >
                          {parsing && selectedId === t.id ? "⏳ AI Working..." : "Use This →"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {!isPro && (
                  <div className="pro-banner">
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "#c2410c", margin: "0 0 2px" }}>🔒 Download requires Pro plan</p>
                      <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>Browse and preview freely. Upgrade to download your AI-enhanced resume.</p>
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

"use client";
import React, { useState } from "react";

interface Props {
  onLogin: () => void;
}

export default function LandingPage({ onLogin }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div style={{ fontFamily: "'Segoe UI', -apple-system, Arial, sans-serif", background: "#f8fafc", color: "#1e293b" }}>

      {/* NAV */}
      <nav style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <div>
          <div style={{ fontSize: "22px", fontWeight: 900 }}>
            <span style={{ color: "#059669" }}>Upgrade </span>
            <span style={{ color: "#f97316" }}>Your </span>
            <span style={{ color: "#059669" }}>Resume</span>
          </div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "1px" }}>AI Powered Career Suite</div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onLogin} style={{ padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: "#374151", background: "#fff", border: "1.5px solid #d1d5db", cursor: "pointer" }}>Sign In</button>
          <button onClick={onLogin} style={{ padding: "8px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, color: "#fff", background: "#059669", border: "none", cursor: "pointer" }}>Get Started Free →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #0f172a 0%, #0d2a4a 60%, #0f172a 100%)", padding: "80px 24px 90px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(5,150,105,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "inline-block", background: "rgba(5,150,105,0.15)", border: "1px solid rgba(5,150,105,0.4)", borderRadius: "20px", padding: "5px 16px", fontSize: "12px", color: "#34d399", fontWeight: 600, marginBottom: "22px", letterSpacing: "0.06em", position: "relative" }}>
          🚀 AI-POWERED CAREER TOOLS — TRUSTED BY JOB SEEKERS ACROSS INDIA
        </div>

        <h1 style={{ fontSize: "clamp(28px, 5vw, 54px)", fontWeight: 900, color: "#fff", lineHeight: 1.12, marginBottom: "18px", position: "relative" }}>
          73% of Resumes Never Reach<br />a Human Recruiter.<br />
          <span style={{ color: "#34d399" }}>Is Yours One of Them?</span>
        </h1>

        <p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: "#94a3b8", maxWidth: "580px", margin: "0 auto 36px", lineHeight: 1.75, position: "relative" }}>
          Companies use ATS software to auto-reject resumes before anyone reads them. Our AI checks your resume against the same filters — and tells you exactly what to fix in 60 seconds.
        </p>

        <button onClick={onLogin} style={{ display: "inline-block", padding: "15px 40px", borderRadius: "12px", fontSize: "17px", fontWeight: 800, color: "#fff", background: "linear-gradient(135deg, #059669, #34d399)", border: "none", cursor: "pointer", boxShadow: "0 8px 28px rgba(5,150,105,0.45)", position: "relative" }}>
          Check My Resume Free →
        </button>
        <p style={{ fontSize: "12px", color: "#475569", marginTop: "14px", position: "relative" }}>
          ✅ No credit card &nbsp;·&nbsp; ✅ No signup required &nbsp;·&nbsp; ✅ 3 free scans every month
        </p>

        {/* First Session Callout */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "linear-gradient(135deg, rgba(249,115,22,0.18), rgba(5,150,105,0.18))", border: "1.5px solid rgba(249,115,22,0.5)", borderRadius: "14px", padding: "12px 22px", marginTop: "18px", position: "relative" }}>
          <span style={{ fontSize: "22px" }}>🎁</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "13px", fontWeight: 800, color: "#fbbf24", lineHeight: 1.3 }}>First Login = Every Pro Feature Unlocked — 100% Free</div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Resume Writer · Cover Letter · LinkedIn Optimizer · JD Analyzer — all yours on your first session. No card. No catch.</div>
          </div>
        </div>

        {/* Score Preview Card */}
        <div style={{ maxWidth: "400px", margin: "52px auto 0", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "18px", padding: "24px", textAlign: "left", position: "relative", backdropFilter: "blur(4px)" }}>
          <div style={{ fontSize: "11px", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>📊 Live ATS Score Example</div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "conic-gradient(#34d399 252deg, #1e293b 0)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <div style={{ width: "58px", height: "58px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                <span style={{ fontSize: "18px", fontWeight: 900, color: "#34d399", lineHeight: 1 }}>70</span>
                <span style={{ fontSize: "10px", color: "#475569" }}>%</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#e2e8f0", marginBottom: "8px" }}>Good Match — Can Be Better</div>
              <p style={{ fontSize: "11px", color: "#34d399", margin: "0 0 4px" }}>✅ Matched: React, Node.js, REST API</p>
              <p style={{ fontSize: "11px", color: "#f87171", margin: "0 0 4px" }}>❌ Missing: Docker, Kubernetes, CI/CD</p>
              <p style={{ fontSize: "11px", color: "#475569", marginTop: "6px" }}>Fix these keywords → Score jumps to 91%</p>
            </div>
          </div>
        </div>
      </section>

      {/* STAT STRIP */}
      <div style={{ background: "#059669", padding: "28px 24px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px" }}>
          {[
            { num: "98%", txt: "Fortune 500 companies use ATS to filter resumes" },
            { num: "75%", txt: "Resumes rejected before a recruiter sees them" },
            { num: "3×", txt: "More interview calls with an ATS-optimized resume" },
            { num: "60s", txt: "Time to get your full ATS score and fix list" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "12px" }}>
              <div style={{ fontSize: "30px", fontWeight: 900, color: "#fff" }}>{s.num}</div>
              <div style={{ fontSize: "12px", color: "#a7f3d0", marginTop: "4px", fontWeight: 500 }}>{s.txt}</div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY ATS MATTERS */}
      <section style={{ background: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 700, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "4px 14px", letterSpacing: "0.06em", marginBottom: "14px" }}>WHY IT MATTERS</div>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, color: "#0f172a", marginBottom: "10px" }}>Your Resume Is Being Judged by a Robot First</h2>
            <p style={{ fontSize: "15px", color: "#6b7280", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>Before any recruiter reads your resume, it passes through an ATS filter. If it doesn&apos;t match the keywords — it gets auto-rejected. You never even know.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px", alignItems: "center" }}>
            {/* Facts */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { icon: "🤖", title: "ATS filters out 75% of resumes automatically", desc: "Most companies receive 200+ applications per job. ATS software shortlists only keyword-matched resumes before a human reviews them." },
                { icon: "🔑", title: "1 missing keyword = rejected application", desc: 'ATS looks for exact keywords from the job description. A software engineer with 5 years experience gets rejected if "REST API" isn\'t on their resume.' },
                { icon: "📈", title: "ATS-optimized resumes get 3× more callbacks", desc: "Candidates who tailor their resume to each job description consistently get more interview calls — even with the same experience level." },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px", background: "#f8fafc", borderRadius: "12px", padding: "16px 18px", border: "1px solid #e5e7eb" }}>
                  <span style={{ fontSize: "24px", flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#111827", marginBottom: "3px" }}>{f.title}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pipeline Visual */}
            <div style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)", borderRadius: "20px", padding: "32px", color: "#fff" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#34d399", marginBottom: "20px" }}>🏢 How ATS Works at a Company</h3>
              {[
                { icon: "📄", text: "Resume enters ATS system", note: "200+ applications received for 1 job", pass: false },
                { icon: "🤖", text: "ATS scans for keywords", note: "Checks job title, skills, experience", pass: false },
                { icon: "❌", text: "150 resumes auto-rejected", note: "Low keyword match — never seen by recruiter", pass: false },
                { icon: "✅", text: "50 resumes reach recruiter", note: "High match score — ATS approved", pass: true },
                { icon: "📞", text: "Interview calls go out", note: "Only keyword-optimized resumes make it", pass: true },
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px", padding: "12px 16px", borderRadius: "10px", background: step.pass ? "rgba(5,150,105,0.15)" : "rgba(239,68,68,0.15)", border: `1px solid ${step.pass ? "rgba(5,150,105,0.3)" : "rgba(239,68,68,0.3)"}` }}>
                  <span style={{ fontSize: "20px" }}>{step.icon}</span>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: step.pass ? "#6ee7b7" : "#fca5a5" }}>{step.text}</div>
                    <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "2px" }}>{step.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "#f8fafc", padding: "72px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 700, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "4px 14px", letterSpacing: "0.06em", marginBottom: "14px" }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, color: "#0f172a", marginBottom: "10px" }}>Get Your ATS Score in 3 Simple Steps</h2>
          <p style={{ fontSize: "15px", color: "#6b7280", lineHeight: 1.7 }}>No complex setup. No forms to fill. Just paste and analyze.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px", maxWidth: "900px", margin: "0 auto" }}>
          {[
            { num: "1", title: "Upload Your Resume", desc: "Paste your resume text or upload a PDF/DOCX file. Works with any format — fresher or experienced." },
            { num: "2", title: "Paste the Job Description", desc: "Copy-paste the job description from Naukri, LinkedIn, or any company site. The more complete, the better your analysis." },
            { num: "3", title: "Get Your Score + Fix List", desc: "Instantly see your ATS score, matched keywords, missing keywords, and exactly what to add to get shortlisted." },
          ].map((step, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: "16px", padding: "28px 24px", border: "1px solid #e5e7eb", textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #059669, #34d399)", color: "#fff", fontSize: "18px", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>{step.num}</div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#111827", marginBottom: "8px" }}>{step.title}</div>
              <div style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: "#fff", padding: "72px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 700, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "4px 14px", letterSpacing: "0.06em", marginBottom: "14px" }}>6 POWERFUL TOOLS</div>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, color: "#0f172a", marginBottom: "10px" }}>Everything You Need to Land the Job</h2>
          <p style={{ fontSize: "15px", color: "#6b7280", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>One platform. AI-powered. Built for the Indian job market.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "20px", maxWidth: "1000px", margin: "0 auto" }}>
          {[
            { icon: "🔍", title: "ATS Resume Analyzer", badge: "FREE", badgeBg: "#f0fdf4", badgeColor: "#059669", bg: "#f0fdf4", borderColor: "#bbf7d0", benefit: "Find out why your resume is getting rejected", desc: "Upload your resume + job description. Get your ATS score, matched keywords, and a complete list of what's missing — in 60 seconds.", firstSession: false },
            { icon: "✍️", title: "AI Resume Writer", badge: "PRO", badgeBg: "#fff7ed", badgeColor: "#f97316", bg: "#fff", borderColor: "#e5e7eb", benefit: "Turn weak bullet points into achievements", desc: "Paste any resume line. AI rewrites it with numbers, metrics, and impact — the exact language recruiters and ATS systems look for.", firstSession: true },
            { icon: "📝", title: "Cover Letter Generator", badge: "PRO", badgeBg: "#fff7ed", badgeColor: "#f97316", bg: "#fff", borderColor: "#e5e7eb", benefit: "A tailored cover letter in 30 seconds", desc: "No more staring at a blank page. Enter the role and company — AI writes a professional, personalized cover letter instantly.", firstSession: true },
            { icon: "💼", title: "LinkedIn Optimizer", badge: "PRO", badgeBg: "#fff7ed", badgeColor: "#f97316", bg: "#fff", borderColor: "#e5e7eb", benefit: "Get found by recruiters on LinkedIn", desc: "Optimize your headline and About section with the exact keywords recruiters in your industry search for. More views, more DMs.", firstSession: true },
            { icon: "🎯", title: "JD Analyzer", badge: "PRO", badgeBg: "#fff7ed", badgeColor: "#f97316", bg: "#fff", borderColor: "#e5e7eb", benefit: "Know your fit score before you apply", desc: "Paste any job description — get a detailed match report, skill gaps, resume tweaks, and section-by-section feedback. Don't apply blind.", firstSession: true },
            { icon: "🎤", title: "Interview Prep", badge: "FREE", badgeBg: "#f0fdf4", badgeColor: "#059669", bg: "#fff", borderColor: "#e5e7eb", benefit: "Walk into every interview prepared", desc: "Paste the job description — AI generates role-specific technical questions, behavioral questions, and company research prompts.", firstSession: false },
          ].map((f, i) => (
            <div key={i} style={{ background: f.bg, borderRadius: "16px", padding: "26px", border: `1px solid ${f.borderColor}`, transition: "box-shadow 0.2s" }}>
              <div style={{ fontSize: "32px", marginBottom: "14px" }}>{f.icon}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#111827" }}>{f.title}</span>
                <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", background: f.badgeBg, color: f.badgeColor }}>{f.badge}</span>
              </div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#059669", marginBottom: "6px" }}>{f.benefit}</div>
              <div style={{ fontSize: "13px", color: "#6b7280", lineHeight: 1.6 }}>{f.desc}</div>
              {f.firstSession && (
                <div style={{ fontSize: "10px", color: "#f97316", fontWeight: 700, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "8px", padding: "2px 8px", marginTop: "10px", display: "inline-block" }}>🎁 Free on first login</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section style={{ background: "linear-gradient(135deg, #0f172a 0%, #0d2a4a 100%)", padding: "72px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 700, color: "#34d399", background: "rgba(5,150,105,0.15)", border: "1px solid rgba(5,150,105,0.3)", borderRadius: "20px", padding: "4px 14px", letterSpacing: "0.06em", marginBottom: "14px" }}>REAL RESULTS</div>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, color: "#fff", marginBottom: "10px" }}>Same Resume. Same Experience.<br />Completely Different Result.</h2>
          <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>See what happens when you optimize your resume using our ATS score and keyword suggestions.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", maxWidth: "860px", margin: "0 auto" }}>
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "18px", padding: "28px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "#f87171", marginBottom: "16px" }}>❌ BEFORE — Unoptimized Resume</div>
            <div style={{ fontSize: "48px", fontWeight: 900, color: "#f87171", lineHeight: 1 }}>34%</div>
            <div style={{ fontSize: "13px", color: "#fca5a5", marginBottom: "16px" }}>ATS Score — Auto-Rejected</div>
            <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: 1.9 }}>
              ❌ Missing: Docker, Kubernetes, CI/CD, REST API, Agile<br />
              ❌ No measurable achievements in bullets<br />
              ❌ Skills section doesn&apos;t match JD language<br />
              ❌ Summary too generic — ATS can&apos;t parse role<br />
              ❌ Result: Never reached a human recruiter
            </div>
          </div>
          <div style={{ background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.3)", borderRadius: "18px", padding: "28px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "#34d399", marginBottom: "16px" }}>✅ AFTER — ATS Optimized</div>
            <div style={{ fontSize: "48px", fontWeight: 900, color: "#34d399", lineHeight: 1 }}>91%</div>
            <div style={{ fontSize: "13px", color: "#6ee7b7", marginBottom: "16px" }}>ATS Score — Shortlisted</div>
            <div style={{ fontSize: "12px", color: "#a7f3d0", lineHeight: 1.9 }}>
              ✅ Added missing keywords naturally into bullets<br />
              ✅ Rewrote 4 bullets with metrics using AI Writer<br />
              ✅ Updated skills section to match JD exactly<br />
              ✅ Summary now includes target role + top keywords<br />
              ✅ Result: Interview call within 5 days
            </div>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: "14px", color: "#64748b", marginTop: "28px" }}>Same person. Same experience. <strong style={{ color: "#34d399" }}>Different ATS score = different outcome.</strong></p>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: "#f8fafc", padding: "72px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 700, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "4px 14px", letterSpacing: "0.06em", marginBottom: "14px" }}>WHAT USERS SAY</div>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, color: "#0f172a", marginBottom: "10px" }}>Job Seekers Love Upgrade Your Resume</h2>
          <p style={{ fontSize: "15px", color: "#6b7280", lineHeight: 1.7 }}>Real results from real people who optimized their resumes using our tools.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", maxWidth: "960px", margin: "0 auto" }}>
          {[
            { text: '"I was applying to jobs for 2 months with zero callbacks. Checked my ATS score — it was 28%. Added the missing keywords, score went to 84%. Got 3 interview calls in the same week."', name: "Priya Sharma", role: "Software Engineer · Bangalore", color: "#059669", initial: "P" },
            { text: '"The Cover Letter Generator alone is worth the subscription. Used to spend 45 minutes per application writing cover letters. Now it\'s done in 30 seconds and sounds better than what I wrote."', name: "Rahul Verma", role: "Product Manager · Delhi", color: "#f97316", initial: "R" },
            { text: '"As a fresher, I had no idea my resume was being filtered out by ATS. The JD Analyzer showed me exactly what keywords I was missing. Got my first job offer within 3 weeks of optimizing."', name: "Sneha Patel", role: "Data Analyst · Pune", color: "#06b6d4", initial: "S" },
          ].map((t, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: "16px", padding: "26px", border: "1px solid #e5e7eb", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
              <div style={{ color: "#f59e0b", fontSize: "14px", marginBottom: "14px", letterSpacing: "2px" }}>★★★★★</div>
              <p style={{ fontSize: "14px", color: "#374151", lineHeight: 1.7, fontStyle: "italic", marginBottom: "18px" }}>{t.text}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: t.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 800, color: "#fff", flexShrink: 0 }}>{t.initial}</div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>{t.name}</div>
                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section style={{ background: "#fff", padding: "72px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 700, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "4px 14px", letterSpacing: "0.06em", marginBottom: "14px" }}>PRICING</div>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, color: "#0f172a", marginBottom: "10px" }}>Simple, Honest Pricing</h2>
          <p style={{ fontSize: "15px", color: "#6b7280", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>Less than ₹10/day. Less than one cup of chai — for tools that could get you a job worth ₹5,00,000/year.</p>
        </div>

        {/* First Session Banner */}
        <div style={{ background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)", border: "2px solid #059669", borderRadius: "14px", padding: "18px 24px", maxWidth: "620px", margin: "0 auto 40px", display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "32px", flexShrink: 0 }}>🎁</span>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#047857", marginBottom: "4px" }}>New here? Your first login unlocks every Pro feature — FREE</div>
            <div style={{ fontSize: "13px", color: "#065f46", lineHeight: 1.5 }}>Sign up and explore Resume Writer, Cover Letter, LinkedIn Optimizer, and JD Analyzer with zero restrictions on your first session. No credit card. No trial period. Just full access.</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "20px", maxWidth: "960px", margin: "0 auto" }}>
          {[
            { name: "FREE", nameColor: "#6b7280", price: "₹0", per: "/month", val: "Forever free", valColor: "#059669", features: ["3 ATS scans per month", "ATS score + keywords", "PDF report download", "Interview Prep tool"], btnBg: "#f3f4f6", btnColor: "#374151", btnText: "Start Free", popular: false, popularColor: "", daily: "" },
            { name: "PRO MONTHLY", nameColor: "#059669", price: "₹299", per: "/month", val: "Billed monthly · Cancel anytime", valColor: "#059669", features: ["Unlimited ATS scans", "AI Resume Writer", "Cover Letter Generator", "LinkedIn Optimizer", "JD Analyzer", "Resume PDF Templates"], btnBg: "#059669", btnColor: "#fff", btnText: "Get Pro Monthly", popular: true, popularColor: "#059669", daily: "Just ₹9.96/day" },
            { name: "PRO QUARTERLY", nameColor: "#06b6d4", price: "₹199", per: "/month", val: "Billed ₹597 every 3 months · Save 33%", valColor: "#06b6d4", features: ["Everything in Pro Monthly", "Save ₹300 vs monthly", "Priority support", "Early access features"], btnBg: "#06b6d4", btnColor: "#fff", btnText: "Get Quarterly", popular: false, popularColor: "", daily: "Just ₹6.60/day" },
            { name: "PRO ANNUAL", nameColor: "#f97316", price: "₹149", per: "/month", val: "Billed ₹1,788/year · Save 50%", valColor: "#f97316", features: ["Everything in Pro Monthly", "Save ₹1,800 vs monthly", "Best value plan", "Full year access"], btnBg: "#f97316", btnColor: "#fff", btnText: "Get Annual", popular: false, popularColor: "", daily: "Just ₹4.90/day" },
          ].map((p, i) => (
            <div key={i} style={{ borderRadius: "16px", padding: "26px", border: p.popular ? `2px solid ${p.popularColor}` : "1px solid #e5e7eb", position: "relative", boxShadow: p.popular ? "0 6px 24px rgba(5,150,105,0.18)" : "none" }}>
              {p.popular && <div style={{ position: "absolute", top: "-11px", left: "50%", transform: "translateX(-50%)", background: "#059669", color: "#fff", fontSize: "10px", fontWeight: 800, padding: "3px 14px", borderRadius: "20px", whiteSpace: "nowrap", letterSpacing: "0.05em" }}>⭐ MOST POPULAR</div>}
              <div style={{ fontSize: "13px", fontWeight: 700, color: p.nameColor, marginBottom: "8px" }}>{p.name}</div>
              <div style={{ fontSize: "32px", fontWeight: 900, color: "#111827", marginBottom: "4px" }}>{p.price} <span style={{ fontSize: "12px", fontWeight: 400, color: "#9ca3af" }}>{p.per}</span></div>
              <div style={{ fontSize: "12px", color: p.valColor, fontWeight: 600, marginBottom: "18px" }}>{p.val}</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px" }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ fontSize: "12px", color: "#374151", padding: "4px 0", borderBottom: "1px solid #f1f5f9" }}>✅ {f}</li>
                ))}
              </ul>
              <button onClick={onLogin} style={{ width: "100%", padding: "10px", borderRadius: "9px", fontSize: "13px", fontWeight: 700, color: p.btnColor, background: p.btnBg, border: "none", cursor: "pointer" }}>{p.btnText}</button>
              {p.daily && <div style={{ fontSize: "11px", color: "#9ca3af", textAlign: "center", marginTop: "10px" }}>{p.daily}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#f8fafc", padding: "72px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-block", fontSize: "12px", fontWeight: 700, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "4px 14px", letterSpacing: "0.06em", marginBottom: "14px" }}>FAQ</div>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, color: "#0f172a" }}>Common Questions</h2>
        </div>
        <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { q: "🎁 Do I really get all Pro features free on my first login?", a: "Yes — 100% real, no tricks. When you sign up and log in for the first time, every Pro feature is fully unlocked for your entire first session. That includes AI Resume Writer, Cover Letter Generator, LinkedIn Optimizer, and JD Analyzer. Use all of them, explore everything. No credit card required, no timer counting down. From your second session onwards, you'll be on the free plan unless you upgrade — but by then you'll already know exactly what the tools can do for you.", highlight: true },
            { q: "What is ATS and why does my score matter?", a: "ATS (Applicant Tracking System) is software used by companies to automatically filter resumes. If your resume doesn't contain the right keywords from the job description, ATS rejects it before a recruiter ever sees it. Your ATS score tells you how well your resume matches — and what to fix.", highlight: false },
            { q: "Will this guarantee I get an interview?", a: "We don't guarantee interviews — no tool can. But optimizing your ATS score significantly increases your chances of getting past the first filter. After that, your experience and skills take over. Think of it as removing a barrier you didn't know existed.", highlight: false },
            { q: "Is my resume data safe?", a: "Yes. Resume content you submit for analysis is processed in real-time and not permanently stored on our servers. Your account data is secured in Google Firebase. We never sell or share your personal information.", highlight: false },
            { q: "Does this work for freshers or only experienced professionals?", a: "Works for both. Freshers benefit from understanding what keywords to include in their projects and skills sections. Experienced professionals use it to tailor their resume to specific roles. The JD Analyzer and Interview Prep tools are especially useful for freshers preparing for campus placements.", highlight: false },
            { q: "Can I cancel my Pro subscription?", a: "Yes, you can stop renewing at any time. However, please note that all purchases are non-refundable as per our refund policy. We recommend trying the free plan thoroughly before upgrading.", highlight: false },
            { q: "What's included in the free plan?", a: "The free plan includes 3 ATS resume scans per month, your full ATS score, matched and missing keywords, PDF report download, and the Interview Prep tool. No credit card required. It's genuinely useful — upgrade when you need more scans or want the AI writing tools.", highlight: false },
          ].map((faq, i) => (
            <div key={i} style={{ background: faq.highlight ? "#f0fdf4" : "#fff", borderRadius: "12px", border: faq.highlight ? "2px solid #059669" : "1px solid #e5e7eb", overflow: "hidden" }}>
              <div onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ padding: "18px 20px", fontSize: "14px", fontWeight: 700, color: faq.highlight ? "#047857" : "#111827", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{faq.q}</span>
                <span style={{ color: "#9ca3af", fontSize: "12px", transition: "transform 0.2s", transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block" }}>▼</span>
              </div>
              {openFaq === i && (
                <div style={{ padding: "0 20px 18px", fontSize: "13px", color: faq.highlight ? "#065f46" : "#6b7280", lineHeight: 1.7, background: faq.highlight ? "#f0fdf4" : "#fff" }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ background: "linear-gradient(135deg, #059669, #047857)", padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, color: "#fff", marginBottom: "14px" }}>Stop Applying Blind.<br />Know Your ATS Score Today.</h2>
        <p style={{ fontSize: "15px", color: "#a7f3d0", marginBottom: "36px", maxWidth: "520px", margin: "0 auto 36px" }}>Every day you apply with an unoptimized resume, someone else with the same skills gets the interview. The difference? They knew their ATS score.</p>
        <button onClick={onLogin} style={{ display: "inline-block", padding: "16px 44px", borderRadius: "12px", fontSize: "17px", fontWeight: 800, color: "#059669", background: "#fff", border: "none", cursor: "pointer", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
          Check My Resume Free →
        </button>
        <p style={{ fontSize: "12px", color: "#6ee7b7", marginTop: "14px" }}>🎁 First login — every Pro tool unlocked free &nbsp;·&nbsp; ✅ No credit card &nbsp;·&nbsp; ✅ 60 seconds to your score</p>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0f172a", padding: "36px 24px", textAlign: "center" }}>
        <div style={{ marginBottom: "14px" }}>
          {[
            { href: "/terms.html", label: "Terms & Conditions" },
            { href: "/privacy.html", label: "Privacy Policy" },
            { href: "/refund.html", label: "Refund Policy" },
            { href: "/blog", label: "Blog & Tips" },
          ].map((l, i) => (
            <a key={i} href={l.href} style={{ color: "#475569", fontSize: "12px", margin: "0 12px", textDecoration: "none" }}>{l.label}</a>
          ))}
        </div>
        <p style={{ color: "#334155", fontSize: "12px", margin: 0 }}>© 2026 Upgrade Your Resume. All rights reserved. · upgradeyourresume.com</p>
      </footer>

    </div>
  );
}

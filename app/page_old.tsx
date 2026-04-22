"use client";

import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import { auth, db } from "./firebase";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function Home() {
  const [dark, setDark] = useState(true);
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploadMsg, setUploadMsg] = useState("");

  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const [result, setResult] = useState({
    score: 0,
    matched: [] as string[],
    missing: [] as string[],
    suggestions: [] as string[],
  });

  useEffect(() => {
  const saved = localStorage.getItem("theme");
  setDark(saved !== "light");

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return () => unsubscribe();
}, []);

  useEffect(() => {
    if (user) loadHistory();
  }, [user]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const keywords = useMemo(() => {
    const words = job.toLowerCase().match(/\b[a-zA-Z]{3,}\b/g);
    return Array.from(new Set(words || [])).slice(0, 20);
  }, [job]);

  const card = dark
  ? "linear-gradient(145deg,#111827,#1f2937)"
  : "linear-gradient(145deg,#ffffff,#f8fafc)";
  const text = dark ? "#ffffff" : "#111827";
  const sub = dark ? "#94a3b8" : "#475569";
  const border = dark ? "#243041" : "#cbd5e1";

  const extractPDFText = async (file: File) => {
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs";

      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const pageText = content.items
          .map((item: any) => ("str" in item ? item.str : ""))
          .join(" ");

        fullText += pageText + "\n";
      }

      return fullText;
    } catch {
      return "";
    }
  };

  const analyze = async () => {
    setLoading(true);

    const resumeText = resume.toLowerCase();
    const matched = keywords.filter((k) => resumeText.includes(k));
    const missing = keywords.filter((k) => !resumeText.includes(k));

    const score =
      keywords.length === 0
        ? 0
        : Math.round((matched.length / keywords.length) * 100);

    let suggestions: string[] = [];

    if (score < 50) {
      suggestions = [
        "Add more job keywords naturally.",
        "Highlight tools & technologies.",
        "Add measurable achievements.",
      ];
    } else if (score < 80) {
      suggestions = [
        "Good match. Add more impact metrics.",
        "Improve project descriptions.",
      ];
    } else {
      suggestions = [
        "Excellent match!",
        "Tailor resume for each company.",
      ];
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, job }),
      });

      const data = await res.json();

      if (data?.suggestions?.length) {
        suggestions = data.suggestions;
      }
    } catch {}

    setResult({
      score,
      matched,
      missing,
      suggestions,
    });

    if (user) {
      await addDoc(collection(db, "reports"), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        score,
        matched,
        missing,
        createdAt: serverTimestamp(),
      });

      loadHistory();
    }

    setLoading(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Next Career Lab - ATS Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`ATS Score: ${result.score}%`, 20, 40);

    doc.text("Matched Keywords:", 20, 55);
    doc.text(result.matched.join(", ") || "None", 20, 63);

    doc.text("Missing Keywords:", 20, 80);
    doc.text(result.missing.join(", ") || "None", 20, 88);

    doc.text("Suggestions:", 20, 105);

    let y = 113;
    result.suggestions.forEach((item, i) => {
      doc.text(`${i + 1}. ${item}`, 20, y);
      y += 8;
    });

    doc.save("ATS_Report.pdf");
  };

  const login = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    setUser(res.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setHistory([]);
  };

  const loadHistory = async () => {
    if (!user) return;

    const q = query(
      collection(db, "reports"),
      where("uid", "==", user.uid)
    );

    const snap = await getDocs(q);

    const items = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setHistory(items.reverse());
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: dark ? "#0f172a" : "#eef4ff",
        color: text,
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
style={{
maxWidth: "1180px",
margin: "0 auto",
padding:
typeof window !== "undefined" && window.innerWidth < 900
? "14px"
: "10px",
transition: "all 0.3s ease",
}}
>
        {/* Header */}
        <div
          style={{
  background: card,
border: `1px solid ${border}`,
borderRadius: "22px",
padding: "22px",
marginBottom: "24px",
boxShadow: dark
? "0 10px 30px rgba(0,0,0,0.25)"
: "0 10px 30px rgba(0,0,0,0.08)",
backdropFilter: "blur(12px)",
  boxShadow: dark
    ? "0 12px 30px rgba(0,0,0,0.35)"
    : "0 12px 30px rgba(15,23,42,0.08)",
}}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
              <Logo />
              <div>
                <h1 style={{ margin: 0 }}>Next Career Lab</h1>
                <p style={{ margin: "4px 0 0", color: sub }}>
                  Smart ATS Resume Analyzer
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button style={btn(border, card, text)} onClick={toggleTheme}>
                {dark ? "☀ Light" : "🌙 Dark"}
              </button>

              {user ? (
                <button style={btn(border, card, text)} onClick={logout}>
                  Logout ({user.displayName})
                </button>
              ) : (
                <button style={btn(border, card, text)} onClick={login}>
                  Sign in with Google
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
  typeof window !== "undefined" && window.innerWidth < 900
    ? "1fr"
    : "1.3fr 0.9fr",
            gap: "20px",
          }}
        >
          {/* Left */}
          <div
            style={{
              background: card,
border: `1px solid ${border}`,
borderRadius: "22px",
padding: "24px",
boxShadow: dark
? "0 12px 28px rgba(0,0,0,0.22)"
: "0 12px 28px rgba(0,0,0,0.06)",
transition: "0.3s ease",
              boxShadow: dark
  ? "0 12px 30px rgba(0,0,0,0.35)"
  : "0 12px 30px rgba(15,23,42,0.08)",
            }}
          >
            <label style={uploadBtn(border, card, text)}>
              📄 Upload Resume PDF
              <input
                hidden
                type="file"
                accept=".pdf"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setUploading(true);
                  setFileName(file.name);
                  setUploadMsg("Reading PDF...");

                  const txt = await extractPDFText(file);

                  if (txt.trim()) {
                    setResume(txt);
                    setUploadMsg("✅ Uploaded");
                  } else {
                    setUploadMsg("❌ Could not read PDF");
                  }

                  setUploading(false);
                }}
              />
            </label>

            {fileName && (
              <p style={{ color: sub, fontSize: "14px" }}>
                Selected: {fileName}
              </p>
            )}

            {uploadMsg && (
              <p style={{ color: sub, fontSize: "14px" }}>{uploadMsg}</p>
            )}

            <div style={{ display: "grid", gap: "14px", marginTop: "10px" }}>
              <textarea
                rows={10}
                placeholder="Paste Resume"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                style={box(card, text, border)}
              />

              <textarea
                rows={8}
                placeholder="Paste Job Description"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                style={box(card, text, border)}
              />

              <button
  onClick={analyze}
  disabled={loading || uploading}
  onMouseEnter={(e) =>
    (e.currentTarget.style.transform = "translateY(-2px)")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.transform = "translateY(0px)")
  }
  style={{
    padding: "14px",
    border: "none",
    borderRadius: "14px",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.25s ease",
    background:
      "linear-gradient(90deg,#2563eb,#10b981)",
    width: "100%",
    opacity: loading || uploading ? 0.7 : 1,
  }}
>
  {loading
    ? "⏳ Analyzing..."
    : uploading
    ? "⏳ Uploading..."
    : "🚀 Analyze Resume"}
</button>

              <button
  onClick={downloadPDF}
  onMouseEnter={(e) =>
    (e.currentTarget.style.transform = "translateY(-2px)")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.transform = "translateY(0px)")
  }
  style={{
  padding: "15px",
  border: "none",
  borderRadius: "14px",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
  background: "linear-gradient(135deg,#111827,#1e293b)",
  boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
  transition: "0.3s ease",
  width: "100%",
}}
  }}
>
  📄 Download Report PDF
</button>
            </div>
          </div>

          {/* Right */}
          <div
            style={{
              style={{
padding: "15px",
border: "none",
borderRadius: "14px",
color: "#fff",
fontWeight: 700,
cursor: "pointer",
background:
"linear-gradient(135deg,#2563eb,#14b8a6)",
boxShadow: "0 8px 18px rgba(37,99,235,0.35)",
transition: "0.3s ease",
width: "100%",
}}
              boxShadow: dark
  ? "0 12px 30px rgba(0,0,0,0.35)"
  : "0 12px 30px rgba(15,23,42,0.08)",
            }}
          >
            <CircleMeter score={result.score} dark={dark} />

            <InfoCard
              title="Matched Keywords"
              value={
                result.matched.length
                  ? result.matched.join(", ")
                  : "None"
              }
              text={text}
              border={border}
            />

            <InfoCard
              title="Missing Keywords"
              value={
                result.missing.length
                  ? result.missing.join(", ")
                  : "None"
              }
              text={text}
              border={border}
            />

            <div style={section(border)}>
              <strong>Suggestions</strong>
              <ul style={{ paddingLeft: "18px", marginTop: "10px" }}>
                {result.suggestions.map((s, i) => (
                  <li key={i} style={{ marginBottom: "8px" }}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div style={section(border)}>
              <strong>Your History</strong>

              {history.length === 0 ? (
                <p style={{ marginTop: "10px", color: sub }}>
                  No saved reports yet.
                </p>
              ) : (
                <div
                  style={{
                    marginTop: "10px",
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  {history.map((item, i) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "10px",
                        border: `1px solid ${border}`,
                        borderRadius: "12px",
                      }}
                    >
                      <strong>Report #{i + 1}</strong>
                      <div style={{ fontSize: "14px", marginTop: "4px" }}>
                        Score: {item.score}%
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: sub,
            fontSize: "14px",
          }}
        >
          © 2026 Next Career Lab • Build your future smarter
        </p>
      </div>
    </main>
  );
}

/* Components */

function Logo() {
  return (
    <div
      style={{
        width: "56px",
        height: "56px",
        borderRadius: "16px",
        background: "linear-gradient(135deg,#2563eb,#10b981)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        fontWeight: 900,
      }}
    >
      ↗
    </div>
  );
}

function CircleMeter({
  score,
  dark,
}: {
  score: number;
  dark: boolean;
}) {
  const angle = (score / 100) * 360;

  return (
    <div
      style={{
        width: "180px",
        height: "180px",
        borderRadius: "50%",
        background: `conic-gradient(#10b981 ${angle}deg, ${
          dark ? "#1e293b" : "#cbd5e1"
        } ${angle}deg)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px",
      }}
    >
      <div
        style={{
          width: "130px",
          height: "130px",
          borderRadius: "50%",
          background: dark ? "#0f172a" : "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
        }}
      >
        <div style={{ fontSize: "32px" }}>{score}%</div>
        <div style={{ fontSize: "12px" }}>ATS Score</div>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  value,
  text,
  border,
}: any) {
  return (
    <div style={section(border)}>
      <strong style={{ color: text }}>{title}</strong>
      <p style={{ marginTop: "8px" }}>{value}</p>
    </div>
  );
}

/* Helpers */

function btn(border: string, bg: string, color: string) {
  return {
    padding: "12px 16px",
    borderRadius: "12px",
    border: `1px solid ${border}`,
    background: bg,
    color,
    cursor: "pointer",
    fontWeight: 700,
  } as React.CSSProperties;
}

function uploadBtn(border: string, bg: string, color: string) {
  return {
    display: "inline-block",
    padding: "12px 16px",
    borderRadius: "12px",
    border: `1px solid ${border}`,
    background: bg,
    color,
    cursor: "pointer",
    fontWeight: 700,
  } as React.CSSProperties;
}

function section(border: string) {
  return {
    marginTop: "14px",
    padding: "14px",
    border: `1px solid ${border}`,
    borderRadius: "16px",
  } as React.CSSProperties;
}

function box(
  bg: string,
  color: string,
  border: string
): React.CSSProperties {
  return {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: `1px solid ${border}`,
    background: bg,
    color,
    fontSize: "15px",
    resize: "vertical",
    outline: "none",
  };
}
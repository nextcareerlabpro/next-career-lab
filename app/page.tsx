"use client";

import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import { auth, db } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

export default function Page() {
  const [dark, setDark] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [booting, setBooting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");

  const [history, setHistory] = useState<any[]>([]);
  const [actionState, setActionState] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const [result, setResult] = useState({
    score: 0,
    matched: [] as string[],
    missing: [] as string[],
    suggestions: [] as string[],
  });

  useEffect(() => {
    setDark(localStorage.getItem("theme") !== "light");

    getRedirectResult(auth).catch(console.error);

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setBooting(false);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) loadHistory();
    else setHistory([]);
  }, [user]);

  async function loadHistory() {
    if (!user) return;

    const snap = await getDocs(
      query(collection(db, "reports"), where("uid", "==", user.uid))
    );

    setHistory(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })).reverse()
    );
  }

  function requireLogin() {
    if (!user) {
      alert("Please login first.");
      return false;
    }
    return true;
  }

  async function login() {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        await signInWithRedirect(auth, provider);
      } else {
        await signInWithPopup(auth, provider);
      }
    } catch (e) {
      console.error(e);
      alert("Login failed.");
    }
  }

  async function logout() {
    await signOut(auth);
  }

  async function analyze() {
    if (!requireLogin()) return;
    if (!resume.trim() || !job.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume, job }),
      });

      const data = await res.json();

      setResult(data);

      await addDoc(collection(db, "reports"), {
        uid: user.uid,
        ...data,
        createdAt: serverTimestamp(),
      });

      await loadHistory();
    } catch (e) {
      console.error(e);
      alert("Analyze failed.");
    }

    setLoading(false);
  }

  async function uploadFile(file?: File) {
    if (!file) return;

    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc =
      "https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs";

    const pdf = await pdfjs.getDocument({
      data: await file.arrayBuffer(),
    }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      text +=
        content.items.map((x: any) => x.str || "").join(" ") + "\n";
    }

    setResume(text);
  }

  function clearAll() {
    setResume("");
    setJob("");
    setResult({
      score: 0,
      matched: [],
      missing: [],
      suggestions: [],
    });
  }

  function loadReport(item: any) {
    if (!requireLogin()) return;

    setActionState(item.id + "-opening");

    setResult({
      score: item.score || 0,
      matched: item.matched || [],
      missing: item.missing || [],
      suggestions: item.suggestions || [],
    });

    setTimeout(() => setActionState(""), 800);
  }

  async function removeReport(id: string) {
    if (!requireLogin()) return;

    setActionState(id + "-deleting");

    await deleteDoc(doc(db, "reports", id));
    await loadHistory();

    setActionState("");
  }

  function exportPdf(data?: any) {
    if (!requireLogin()) return;

    const d = data || result;
    setActionState("downloading");

    const pdf = new jsPDF();

    pdf.text("Next Career Lab ATS Report", 20, 20);
    pdf.text(`Score: ${d.score}%`, 20, 35);
    pdf.text(`Matched: ${(d.matched || []).join(", ")}`, 20, 50);
    pdf.text(`Missing: ${(d.missing || []).join(", ")}`, 20, 65);

    pdf.save("ATS_Report.pdf");

    setTimeout(() => setActionState(""), 1000);
  }

  const score = result.score;
  const angle = score * 3.6;

  const ring =
    score < 40 ? "#ef4444" : score < 70 ? "#f59e0b" : "#10b981";

  const status =
    score < 40 ? "Poor Fit" : score < 70 ? "Average Fit" : "Strong Fit";

  const bg = dark
    ? "bg-slate-950 text-white"
    : "bg-slate-100 text-slate-900";

  const card = dark
    ? "bg-slate-900 border-slate-700"
    : "bg-white border-slate-300";

  const soft = dark
    ? "bg-slate-800 border-slate-700"
    : "bg-slate-50 border-slate-300";

  const field = dark
    ? "bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
    : "bg-white border-slate-400 text-slate-900";

  if (booting) return null;

  return (
    <main className={`min-h-screen ${bg}`}>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">

        {/* Header */}
        <section
          className={`rounded-3xl border ${card} shadow-2xl p-6 flex flex-col lg:flex-row gap-5 justify-between items-center`}
        >
          <div>
            <p className="text-xs tracking-[0.35em] opacity-60 uppercase">
              AI Career Tools
            </p>

            <h1 className="text-4xl md:text-5xl font-black mt-2">
              <span className="text-blue-500">Next </span>
              <span>Career </span>
              <span className="text-emerald-500">Lab</span>
            </h1>

            <p className="opacity-70 mt-2">
              Launch Ready ATS Resume Analyzer
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                const n = !dark;
                setDark(n);
                localStorage.setItem("theme", n ? "dark" : "light");
              }}
              className="px-4 py-2 rounded-2xl border bg-indigo-100 text-indigo-700 font-bold"
            >
              {dark ? "☀ Light" : "🌙 Dark"}
            </button>

            {user ? (
              <>
                <div className={`px-4 py-2 rounded-2xl border ${soft}`}>
                  {user.displayName || user.email}
                </div>

                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-2xl bg-rose-600 text-white font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={login}
                className="px-5 py-2 rounded-2xl bg-emerald-600 text-white font-bold"
              >
                Google Login
              </button>
            )}
          </div>
        </section>

        {/* Main Grid */}
        <section
          className={`grid gap-6 grid-cols-1 ${
            sidebarOpen
              ? "xl:grid-cols-[240px_1fr_360px]"
              : "xl:grid-cols-[78px_1fr_360px]"
          }`}
        >
          {/* Sidebar */}
          <aside
            className={`rounded-3xl border ${card} shadow-xl p-4 transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              {sidebarOpen && (
                <h3 className="font-black text-xl">Dashboard</h3>
              )}

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold"
              >
                {sidebarOpen ? "◀" : "▶"}
              </button>
            </div>

            <div className="space-y-3">
              <SideBtn
                icon="✨"
                label="Analyze Resume"
                show={sidebarOpen}
                onClick={() =>
                  document.getElementById("analyzeBox")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                soft={soft}
              />

              <SideBtn
                icon="📄"
                label="Export Report"
                show={sidebarOpen}
                onClick={() => exportPdf()}
                soft={soft}
              />

              <SideBtn
                icon="📚"
                label="Saved History"
                show={sidebarOpen}
                onClick={() =>
                  document.getElementById("historyBox")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                soft={soft}
              />
            </div>
          </aside>

          {/* Analyzer */}
          <section
            id="analyzeBox"
            className={`rounded-3xl border ${card} shadow-xl p-5 space-y-4`}
          >
            <input
              ref={fileRef}
              hidden
              type="file"
              accept=".pdf"
              onChange={(e) => uploadFile(e.target.files?.[0])}
            />

            <button
              onClick={() => fileRef.current?.click()}
              className="w-full py-3 rounded-2xl bg-slate-700 text-white font-bold"
            >
              📄 Upload Resume PDF
            </button>

            <textarea
              rows={10}
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste Resume"
              className={`w-full rounded-2xl border-2 p-4 ${field}`}
            />

            <textarea
              rows={8}
              value={job}
              onChange={(e) => setJob(e.target.value)}
              placeholder="Paste Job Description"
              className={`w-full rounded-2xl border-2 p-4 ${field}`}
            />

            <div className="grid md:grid-cols-3 gap-3">
              <button
                disabled={!resume.trim() || !job.trim()}
                onClick={analyze}
                className="py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "🚀 Analyze"}
              </button>

              <button
                disabled={score === 0}
                onClick={() => exportPdf()}
                className="py-3 rounded-2xl bg-white text-slate-900 font-bold disabled:opacity-50"
              >
                {actionState === "downloading"
                  ? "Downloading..."
                  : "📄 Download PDF"}
              </button>

              <button
                onClick={clearAll}
                className="py-3 rounded-2xl bg-amber-500 text-white font-bold"
              >
                🧹 Clear
              </button>
            </div>
          </section>

          {/* Result */}
          <section
            className={`rounded-3xl border ${card} shadow-xl p-5 space-y-4`}
          >
            <div className="text-center">
              <div
                className="mx-auto w-40 h-40 rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(${ring} ${angle}deg,#cbd5e1 ${angle}deg)`,
                }}
              >
                <div
                  className={`w-28 h-28 rounded-full flex flex-col items-center justify-center ${soft}`}
                >
                  <span className="text-4xl font-black">
                    {score}%
                  </span>
                  <span className="text-xs opacity-70">
                    {status}
                  </span>
                </div>
              </div>

              <p className="opacity-70 mt-3">ATS Score</p>
            </div>

            <Info title="Matched Keywords" data={result.matched} soft={soft} />
            <Info title="Missing Keywords" data={result.missing} soft={soft} />
            <Info title="Suggestions" data={result.suggestions} soft={soft} />

            {/* History */}
            <div id="historyBox">
              <h3 className="font-bold mb-2">History</h3>

              <div className="space-y-2 max-h-72 overflow-auto">
                {history.length ? (
                  history.map((h) => (
                    <div
                      key={h.id}
                      className={`rounded-2xl border p-3 ${soft}`}
                    >
                      <div className="flex justify-between text-xs mb-2">
                        <span>
                          {h.createdAt?.seconds
                            ? new Date(
                                h.createdAt.seconds * 1000
                              ).toLocaleString()
                            : "Saved Report"}
                        </span>

                        <span className="font-bold">
                          {h.score}%
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <button
                          onClick={() => loadReport(h)}
                          className="py-2 rounded bg-blue-600 text-white"
                        >
                          {actionState === h.id + "-opening"
                            ? "Opening..."
                            : "Open"}
                        </button>

                        <button
                          onClick={() => exportPdf(h)}
                          className="py-2 rounded bg-emerald-600 text-white"
                        >
                          {actionState === "downloading"
                            ? "Downloading..."
                            : "PDF"}
                        </button>

                        <button
                          onClick={() => removeReport(h.id)}
                          className="py-2 rounded bg-rose-600 text-white"
                        >
                          {actionState === h.id + "-deleting"
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    className={`rounded-2xl border p-3 text-sm ${soft}`}
                  >
                    No reports yet
                  </div>
                )}
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function SideBtn({
  icon,
  label,
  show,
  onClick,
  soft,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-3 py-3 rounded-2xl border ${soft} font-bold flex items-center gap-3 hover:scale-[1.02] transition`}
    >
      <span>{icon}</span>
      {show && <span>{label}</span>}
    </button>
  );
}

function Info({
  title,
  data,
  soft,
}: {
  title: string;
  data: string[];
  soft: string;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${soft}`}>
      <h3 className="font-bold">{title}</h3>

      <p className="text-sm opacity-80 mt-2">
        {data.length ? data.join(", ") : "None"}
      </p>
    </div>
  );
}
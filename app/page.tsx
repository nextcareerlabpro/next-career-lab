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
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");

  const [history, setHistory] = useState<any[]>([]);
  const [actionState, setActionState] = useState<string>("");

  const [result, setResult] = useState({
    score: 0,
    matched: [] as string[],
    missing: [] as string[],
    suggestions: [] as string[],
  });

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDark(localStorage.getItem("theme") !== "light");

    getRedirectResult(auth).catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setBooting(false);
    });

    return () => unsubscribe();
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
      snap.docs.map((d) => ({ id: d.id, ...d.data() })).reverse()
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
    await signInWithRedirect(auth, provider);
  } catch (err) {
    console.error(err);
    alert("Login failed. Please try again.");
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

      loadHistory();
    } catch (err) {
      console.error(err);
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

  function exportPdf() {
    if (!requireLogin()) return;
    exportCustomPdf(result);
  }

  function exportCustomPdf(data: any) {
    setActionState("downloading");

    const docu = new jsPDF();

    docu.text("Next Career Lab ATS Report", 20, 20);
    docu.text(`Score: ${data.score}%`, 20, 35);
    docu.text(`Matched: ${(data.matched || []).join(", ")}`, 20, 50);
    docu.text(`Missing: ${(data.missing || []).join(", ")}`, 20, 65);

    docu.save("ATS_Report.pdf");

    setTimeout(() => setActionState(""), 1000);
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

  async function deleteHistory(id: string) {
    if (!requireLogin()) return;

    setActionState(id + "-deleting");
    await deleteDoc(doc(db, "reports", id));
    await loadHistory();
    setActionState("");
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

    document
      .getElementById("analyzer")
      ?.scrollIntoView({ behavior: "smooth" });

    setTimeout(() => setActionState(""), 800);
  }

  const bg = dark
    ? "bg-slate-950 text-white"
    : "bg-slate-100 text-slate-900";

  const card = dark
    ? "bg-slate-900 border-slate-700"
    : "bg-white border-slate-300";

  const soft = dark
    ? "bg-slate-800 border-slate-600"
    : "bg-slate-100 border-slate-300";

  const input = dark
    ? "bg-slate-800 border-slate-500 text-white placeholder:text-slate-300"
    : "bg-white border-slate-400 text-slate-900 placeholder:text-slate-500";

  const score = result.score || 0;

  const meterColor =
    score < 40 ? "#ef4444" : score < 70 ? "#f59e0b" : "#10b981";

  const angle = score * 3.6;

  const label =
    score < 40
      ? "Poor Fit"
      : score < 70
      ? "Moderate Fit"
      : "Strong Fit";

  if (booting) return null;

  return (
    <main className={`min-h-screen ${bg}`}>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">

        {/* Header */}
        <header
          className={`rounded-3xl border ${card} shadow-2xl p-6 flex flex-col md:flex-row justify-between gap-4 items-center`}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.3em] opacity-60">
              AI CAREER TOOLS
            </p>

            <h1 className="text-4xl font-black mt-2">
              <span className="text-blue-500">Next </span>
              <span className={dark ? "text-white" : "text-slate-900"}>
                Career
              </span>{" "}
              <span className="text-emerald-500">Lab</span>
            </h1>

            <p className="opacity-70 mt-2">
              Launch Ready ATS Resume Analyzer
            </p>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <button
              onClick={() => {
                const n = !dark;
                setDark(n);
                localStorage.setItem("theme", n ? "dark" : "light");
              }}
              className="px-4 py-2 rounded-2xl border border-indigo-300 bg-indigo-100 text-indigo-700 font-semibold"
            >
              {dark ? "☀ Light" : "🌙 Dark"}
            </button>

            {user ? (
              <>
                <div className={`px-3 py-2 rounded-2xl border ${soft}`}>
                  {user.displayName || user.email}
                </div>

                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-2xl bg-rose-600 text-white font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={login}
                className="px-4 py-2 rounded-2xl bg-emerald-600 text-white font-semibold"
              >
                Google Login
              </button>
            )}
          </div>
        </header>

        {/* Grid */}
        <section
  className={`grid gap-6 ${
    sidebarOpen
      ? "grid-cols-1 lg:grid-cols-[230px_1fr_360px]"
      : "grid-cols-[70px_1fr] lg:grid-cols-[70px_1fr_360px]"
  }`}
>
          {/* Sidebar */}
          <aside
  className={`rounded-3xl border ${card} shadow-xl p-4 transition-all duration-300 ${
    sidebarOpen ? "w-full" : "w-[70px]"
  }`}
>
            <div className="flex justify-between items-center mb-4">
              {sidebarOpen && (
                <h3 className="font-black text-lg">Dashboard</h3>
              )}

              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="px-2 py-1 rounded-lg bg-blue-600 text-white text-sm"
              >
                {sidebarOpen ? "◀" : "▶"}
              </button>
            </div>

            <div className="space-y-3 text-sm">

              <SideBtn
                icon="✨"
                label="Analyze Resume"
                open={sidebarOpen}
                onClick={() =>
                  document
                    .getElementById("analyzer")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                soft={soft}
              />

              <SideBtn
                icon="📄"
                label="Export Report"
                open={sidebarOpen}
                onClick={exportPdf}
                soft={soft}
              />

              <SideBtn
                icon="📚"
                label="Saved History"
                open={sidebarOpen}
                onClick={() =>
                  document
                    .getElementById("historyBox")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                soft={soft}
              />
            </div>
          </aside>

          {/* Analyzer */}
          <section
            id="analyzer"
            className={`rounded-3xl border ${card} shadow-xl p-5 space-y-4`}
          >
            <input
              ref={fileRef}
              hidden
              type="file"
              accept=".pdf"
              onChange={(e) =>
                uploadFile(e.target.files?.[0])
              }
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
              className={`w-full rounded-2xl border-2 p-4 ${input}`}
            />

            <textarea
              rows={8}
              value={job}
              onChange={(e) => setJob(e.target.value)}
              placeholder="Paste Job Description"
              className={`w-full rounded-2xl border-2 p-4 ${input}`}
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
                onClick={exportPdf}
                disabled={score === 0}
                className="py-3 rounded-2xl bg-white text-slate-900 border font-bold disabled:opacity-50"
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

          {/* Results */}
          <section
            className={`rounded-3xl border ${card} shadow-xl p-5 space-y-4`}
          >
            <div className="text-center">
              <div
                className="mx-auto w-40 h-40 rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(${meterColor} ${angle}deg, #cbd5e1 ${angle}deg)`,
                }}
              >
                <div
                  className={`w-28 h-28 rounded-full flex flex-col items-center justify-center ${soft}`}
                >
                  <span className="text-4xl font-black">{score}%</span>
                  <span className="text-xs opacity-70">{label}</span>
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
                      <div className="flex justify-between mb-2 text-xs">
                        <span>
                          {h.createdAt?.seconds
                            ? new Date(
                                h.createdAt.seconds * 1000
                              ).toLocaleString()
                            : "Saved Report"}
                        </span>
                        <span className="font-bold">{h.score}%</span>
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
                          onClick={() => exportCustomPdf(h)}
                          className="py-2 rounded bg-emerald-600 text-white"
                        >
                          {actionState === "downloading"
                            ? "Downloading..."
                            : "PDF"}
                        </button>

                        <button
                          onClick={() => deleteHistory(h.id)}
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
  open,
  onClick,
  soft,
}: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border ${soft} font-bold hover:scale-[1.02] transition`}
    >
      <span>{icon}</span>
      {open && <span>{label}</span>}
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
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm opacity-80 mt-2">
        {data.length ? data.join(", ") : "None"}
      </p>
    </div>
  );
}
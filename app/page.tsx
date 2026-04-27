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

type TabType = "ats" | "resume" | "cover" | "linkedin" | "billing";

export default function Page() {
  const [tab, setTab] = useState<TabType>("ats");
  const [dark, setDark] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [booting, setBooting] = useState(true);
  const [loading, setLoading] = useState(false);

  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");

  const [history, setHistory] = useState<any[]>([]);
  const [actionState, setActionState] = useState("");

  const [resumeLine, setResumeLine] = useState("");
  const [resumeOutput, setResumeOutput] = useState("");

  const [coverRole, setCoverRole] = useState("");
  const [coverCompany, setCoverCompany] = useState("");
  const [coverOutput, setCoverOutput] = useState("");

  const [linkedinRole, setLinkedinRole] = useState("");
  const [linkedinOutput, setLinkedinOutput] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const emptyResult = {
    score: 0,
    matched: [] as string[],
    missing: [] as string[],
    suggestions: [] as string[],
  };

  const [result, setResult] = useState(emptyResult);

  function normalize(data: any) {
    return {
      score: Number(data?.score ?? 0),
      matched: Array.isArray(data?.matched) ? data.matched : [],
      missing: Array.isArray(data?.missing) ? data.missing : [],
      suggestions: Array.isArray(data?.suggestions) ? data.suggestions : [],
    };
  }

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

      try {
        await signInWithPopup(auth, provider);
      } catch {
        await signInWithRedirect(auth, provider);
      }
    } catch {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, job }),
      });

      const data = await res.json();
      const finalData = normalize(data);

      setResult(finalData);

      await addDoc(collection(db, "reports"), {
        uid: user.uid,
        ...finalData,
        createdAt: serverTimestamp(),
      });

      await loadHistory();
    } catch {
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
      text += content.items.map((x: any) => x.str || "").join(" ") + "\n";
    }

    setResume(text);
  }

  function clearAll() {
    setResume("");
    setJob("");
    setResult(emptyResult);
  }

  function loadReport(item: any) {
    setResult(normalize(item));
  }

  async function removeReport(id: string) {
    await deleteDoc(doc(db, "reports", id));
    await loadHistory();
  }

  function exportPdf(data?: any) {
    const d = normalize(data || result);

    if (!d.score) {
      alert("Please analyze first.");
      return;
    }

    const pdf = new jsPDF();
    pdf.text("Next Career Lab ATS Report", 20, 20);
    pdf.text(`Score: ${d.score}%`, 20, 35);
    pdf.text(`Matched: ${d.matched.join(", ")}`, 20, 50);
    pdf.text(`Missing: ${d.missing.join(", ")}`, 20, 65);
    pdf.save("ATS_Report.pdf");
  }

  async function improveResume() {
  if (!resumeLine.trim()) return;

  setResumeOutput("Generating...");

  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Rewrite this resume bullet point professionally with measurable impact:\n${resumeLine}`,
      }),
    });

    const data = await res.json();
    setResumeOutput(data.output);
  } catch {
    setResumeOutput("Failed to generate.");
  }
}

  async function generateCover() {
  if (!coverRole.trim() || !coverCompany.trim()) return;

  setCoverOutput("Generating...");

  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Write a professional cover letter for ${coverRole} role at ${coverCompany}. Keep it concise and impressive.`,
      }),
    });

    const data = await res.json();
    setCoverOutput(data.output);
  } catch {
    setCoverOutput("Failed to generate.");
  }
}

  async function generateLinkedin() {
  if (!linkedinRole.trim()) return;

  setLinkedinOutput("Generating...");

  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Create a strong LinkedIn headline and About section for a ${linkedinRole}. Optimize for recruiter SEO.`,
      }),
    });

    const data = await res.json();
    setLinkedinOutput(data.output);
  } catch {
    setLinkedinOutput("Failed to generate.");
  }
}

  const score = Number(result.score || 0);
  const angle = score * 3.6;

  const ring =
    score < 40 ? "#ef4444" : score < 70 ? "#f59e0b" : "#10b981";

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
    ? "bg-slate-800 border-slate-600 text-white"
    : "bg-white border-slate-400 text-slate-900";

  if (booting) return null;

  return (
    <main className={`min-h-screen ${bg}`}>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">

        <section className={`rounded-3xl border ${card} p-6 flex flex-col md:flex-row justify-between gap-4`}>
          <div>
            <h1 className="text-4xl md:text-5xl font-black">
              <span className="text-blue-500">Next </span>
              Career <span className="text-emerald-500">Lab</span>
            </h1>
            <p className="opacity-70 mt-2">AI Powered Career Suite v2.1</p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                const n = !dark;
                setDark(n);
                localStorage.setItem("theme", n ? "dark" : "light");
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white"
            >
              {dark ? "Light" : "Dark"}
            </button>

            {user ? (
              <>
                <div className={`px-4 py-2 rounded-xl ${soft}`}>
                  {user.displayName || user.email}
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={login}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white"
              >
                Google Login
              </button>
            )}
          </div>
        </section>

        <section className="grid lg:grid-cols-[230px_1fr] gap-6">

          <aside className={`rounded-3xl border ${card} p-4 space-y-3`}>
            <NavBtn label="ATS Analyzer" active={tab==="ats"} onClick={()=>setTab("ats")} />
            <NavBtn label="AI Resume Writer" active={tab==="resume"} onClick={()=>setTab("resume")} />
            <NavBtn label="Cover Letter" active={tab==="cover"} onClick={()=>setTab("cover")} />
            <NavBtn label="LinkedIn Optimizer" active={tab==="linkedin"} onClick={()=>setTab("linkedin")} />
            <NavBtn label="Billing" active={tab==="billing"} onClick={()=>setTab("billing")} />
          </aside>

          <section>

            {tab==="ats" && (
              <div className="grid xl:grid-cols-[1fr_340px] gap-6">

                <div className={`rounded-3xl border ${card} p-5 space-y-4`}>
                  <input
                    ref={fileRef}
                    hidden
                    type="file"
                    accept=".pdf"
                    onChange={(e)=>uploadFile(e.target.files?.[0])}
                  />

                  <button
                    onClick={()=>fileRef.current?.click()}
                    className="w-full py-3 rounded-xl bg-slate-700 text-white"
                  >
                    Upload Resume PDF
                  </button>

                  <textarea
                    rows={8}
                    value={resume}
                    onChange={(e)=>setResume(e.target.value)}
                    placeholder="Paste Resume"
                    className={`w-full p-4 rounded-xl border ${field}`}
                  />

                  <textarea
                    rows={8}
                    value={job}
                    onChange={(e)=>setJob(e.target.value)}
                    placeholder="Paste Job Description"
                    className={`w-full p-4 rounded-xl border ${field}`}
                  />

                  <div className="grid md:grid-cols-3 gap-3">
                    <button
                      onClick={analyze}
                      disabled={!resume.trim() || !job.trim()}
                      className="py-3 rounded-xl bg-blue-600 text-white disabled:opacity-50"
                    >
                      {loading ? "Analyzing..." : "Analyze"}
                    </button>

                    <button
                      onClick={()=>exportPdf()}
                      disabled={score===0}
                      className="py-3 rounded-xl bg-white text-black disabled:opacity-50"
                    >
                      Download PDF
                    </button>

                    <button
                      onClick={clearAll}
                      className="py-3 rounded-xl bg-amber-500 text-white"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className={`rounded-3xl border ${card} p-5 space-y-4`}>

                  <div className="text-center">
                    <div
                      className="mx-auto w-40 h-40 rounded-full flex items-center justify-center"
                      style={{
                        background: `conic-gradient(${ring} ${angle}deg,#cbd5e1 ${angle}deg)`
                      }}
                    >
                      <div className={`w-28 h-28 rounded-full flex items-center justify-center ${soft}`}>
                        <span className="text-3xl font-black">{score}%</span>
                      </div>
                    </div>
                    <p className="mt-2">ATS Score</p>
                  </div>

                  <Info title="Matched Keywords" data={result.matched} soft={soft}/>
                  <Info title="Missing Keywords" data={result.missing} soft={soft}/>
                  <Info title="Suggestions" data={result.suggestions} soft={soft}/>

                  <div>
                    <h3 className="font-bold mb-2">History</h3>

                    <div className="space-y-2 max-h-72 overflow-auto">
                      {history.map((h)=>(
                        <div key={h.id} className={`p-3 rounded-xl ${soft}`}>
                          <div className="flex justify-between text-xs mb-2">
                            <span>
                              {h.createdAt?.seconds
                                ? new Date(h.createdAt.seconds * 1000).toLocaleString()
                                : "Saved Report"}
                            </span>
                            <span>{h.score}%</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <button
                              onClick={()=>loadReport(h)}
                              className="py-2 rounded bg-blue-600 text-white"
                            >
                              Open
                            </button>

                            <button
                              onClick={()=>exportPdf(h)}
                              className="py-2 rounded bg-emerald-600 text-white"
                            >
                              PDF
                            </button>

                            <button
                              onClick={()=>removeReport(h.id)}
                              className="py-2 rounded bg-rose-600 text-white"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {tab==="resume" && (
              <ModuleCard title="AI Resume Writer" card={card} field={field}>
                <textarea rows={6} value={resumeLine} onChange={(e)=>setResumeLine(e.target.value)} placeholder="Paste one bullet..." className={`w-full p-4 rounded-xl border ${field}`} />
                <button onClick={improveResume} className="px-5 py-3 rounded-xl bg-blue-600 text-white">Improve Bullet</button>
                <textarea rows={6} value={resumeOutput} readOnly className={`w-full p-4 rounded-xl border ${field}`} />
              </ModuleCard>
            )}

            {tab==="cover" && (
              <ModuleCard title="Cover Letter Writer" card={card} field={field}>
                <input value={coverRole} onChange={(e)=>setCoverRole(e.target.value)} placeholder="Role" className={`w-full p-4 rounded-xl border ${field}`} />
                <input value={coverCompany} onChange={(e)=>setCoverCompany(e.target.value)} placeholder="Company" className={`w-full p-4 rounded-xl border ${field}`} />
                <button onClick={generateCover} className="px-5 py-3 rounded-xl bg-blue-600 text-white">Generate</button>
                <textarea rows={10} value={coverOutput} readOnly className={`w-full p-4 rounded-xl border ${field}`} />
              </ModuleCard>
            )}

            {tab==="linkedin" && (
              <ModuleCard title="LinkedIn Optimizer" card={card} field={field}>
                <input value={linkedinRole} onChange={(e)=>setLinkedinRole(e.target.value)} placeholder="Target Role" className={`w-full p-4 rounded-xl border ${field}`} />
                <button onClick={generateLinkedin} className="px-5 py-3 rounded-xl bg-blue-600 text-white">Generate</button>
                <textarea rows={10} value={linkedinOutput} readOnly className={`w-full p-4 rounded-xl border ${field}`} />
              </ModuleCard>
            )}

            {tab==="billing" && (
              <ModuleCard title="Billing" card={card} field={field}>
                <div className={`p-5 rounded-xl ${soft}`}>
                  Razorpay / Stripe integration coming next.
                </div>
              </ModuleCard>
            )}

          </section>
        </section>
      </div>
    </main>
  );
}

function NavBtn({label,active,onClick}:any){
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl font-bold ${
        active ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-900"
      }`}
    >
      {label}
    </button>
  );
}

function Info({title,data,soft}:any){
  return (
    <div className={`p-4 rounded-xl ${soft}`}>
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm mt-2">{data.length ? data.join(", ") : "None"}</p>
    </div>
  );
}

function ModuleCard({title,children,card}:any){
  return (
    <div className={`rounded-3xl border ${card} p-5 space-y-4`}>
      <h2 className="text-2xl font-bold">{title}</h2>
      {children}
    </div>
  );
}
"use client";

import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import { auth, db } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";

export default function Page() {
  const [dark, setDark] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [result, setResult] = useState({ score: 0, matched: [], missing: [], suggestions: [] as string[] });
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setDark(localStorage.getItem("theme") !== "light"); return onAuthStateChanged(auth, setUser); }, []);
  useEffect(() => { user ? loadHistory() : setHistory([]); }, [user]);
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setLoading(false);
  });

  return () => unsubscribe();
}, []);
  async function loadHistory() {
    const snap = await getDocs(query(collection(db, "reports"), where("uid", "==", user.uid)));
    setHistory(snap.docs.map(d => ({ id: d.id, ...d.data() })).reverse());
  }

  async function login() { await signInWithPopup(auth, new GoogleAuthProvider()); }
  async function logout() { await signOut(auth); }

  async function analyze() {
    if (!resume.trim() || !job.trim()) return;
    setLoading(true);
    const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resume, job }) });
    const data = await res.json();
    setResult(data);
    if (user) { await addDoc(collection(db, "reports"), { uid: user.uid, ...data, createdAt: serverTimestamp() }); loadHistory(); }
    setLoading(false);
  }

  async function uploadFile(file?: File) {
    if (!file) return;
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs";
    const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((x: any) => x.str || "").join(" ") + "\n";
    }
    setResume(text);
  }

  function exportPdf() { const doc = new jsPDF(); doc.text("Next Career Lab ATS Report", 20, 20); doc.text(`Score: ${result.score}%`, 20, 35); doc.save("ATS_Report.pdf"); }
  function clearAll() { setResume(""); setJob(""); setResult({ score:0, matched:[], missing:[], suggestions:[] }); }

  const bg = dark ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-900";
  const card = dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-300";
  const soft = dark ? "bg-slate-800 border-slate-600" : "bg-slate-100 border-slate-300";
  const input = dark ? "bg-slate-800 border-slate-500 !text-white caret-white placeholder:text-slate-300" : "bg-white border-slate-400 !text-slate-900 caret-slate-900 placeholder:text-slate-500";

  const score = result.score || 0;
  const meterColor = score < 40 ? "#ef4444" : score < 70 ? "#f59e0b" : "#10b981";
  const angle = score * 3.6;
  const label = score < 40 ? "Poor Fit" : score < 70 ? "Moderate Fit" : "Strong Fit";

  return (
    <main className={`min-h-screen ${bg}`}>
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        <header className={`rounded-3xl border ${card} shadow-2xl p-6 flex flex-col md:flex-row justify-between gap-4 items-center`}>
    <div>
  <p className="text-xs uppercase tracking-[0.3em] opacity-60">
    AI Career Tools
  </p>

  <div className="flex items-center gap-4">
    <div className="relative w-16 h-16 flex items-center justify-center">
      <span className="text-6xl font-black bg-gradient-to-b from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent leading-none">
        N
      </span>
      <span className="absolute top-1 right-0 text-2xl text-emerald-500 font-black">
        ↗
      </span>
    </div>

    <div className="leading-none">
      <div className="text-4xl font-black text-blue-500">Next</div>
      <div className={`text-4xl font-black ${dark ? "text-white" : "text-slate-900"}`}>
        Career
      </div>
      <div className="text-4xl font-black text-emerald-500">Lab</div>
    </div>
  </div>

  <p className="opacity-70 mt-2">
    Launch Ready ATS Resume Analyzer
  </p>
</div>
          <div className="flex gap-2 flex-wrap items-center">
            <button onClick={() => { const n=!dark; setDark(n); localStorage.setItem("theme", n?"dark":"light"); }} className="px-4 py-2 rounded-2xl border border-indigo-300 bg-indigo-100 text-indigo-700 font-semibold hover:scale-105 transition">{dark ? "☀ Light" : "🌙 Dark"}</button>
            {user ? <><div className={`px-3 py-2 rounded-2xl border ${soft}`}>{user.displayName || user.email}</div><button onClick={logout} className="px-4 py-2 rounded-2xl bg-rose-600 text-white font-semibold shadow hover:scale-105 transition">Logout</button></> : <button onClick={login} className="px-4 py-2 rounded-2xl bg-emerald-600 text-white font-semibold shadow hover:scale-105 transition">Google Login</button>}
          </div>
        </header>

        <section className="grid lg:grid-cols-[240px_1fr_360px] gap-6">
          <aside className={`rounded-3xl border ${card} shadow-xl p-5`}>
            <h3 className="font-bold text-lg mb-4">Dashboard</h3>
            <div className="space-y-3 text-sm">
              {['✨ Analyze Resume','📄 Export Report','📚 Saved History','🌙 Theme Mode'].map(item => <button key={item} className={`w-full text-left px-3 py-3 rounded-xl border ${soft} shadow font-bold hover:-translate-y-0.5 hover:shadow-lg transition`}>{item}</button>)}
            </div>
          </aside>

          <section className={`rounded-3xl border ${card} shadow-xl p-5 space-y-4`}>
            <input ref={fileRef} hidden type="file" accept=".pdf" onChange={(e)=>uploadFile(e.target.files?.[0])} />
            <button onClick={()=>fileRef.current?.click()} className="w-full py-3 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-600 text-white font-semibold shadow hover:scale-[1.01] transition">📄 Upload Resume PDF</button>
            <textarea rows={10} value={resume} onChange={(e)=>setResume(e.target.value)} placeholder="Paste Resume" className={`w-full rounded-2xl border-2 p-4 ${input} placeholder:opacity-100`} style={{WebkitTextFillColor:'currentColor',color:'currentColor'}} />
            <textarea rows={8} value={job} onChange={(e)=>setJob(e.target.value)} placeholder="Paste Job Description" className={`w-full rounded-2xl border-2 p-4 ${input} placeholder:opacity-100`} style={{WebkitTextFillColor:'currentColor',color:'currentColor'}} />
            <div className="grid md:grid-cols-3 gap-3">
              <button disabled={!resume.trim() || !job.trim()} onClick={analyze} className="py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold shadow hover:scale-[1.02] transition disabled:opacity-50">{loading?"Analyzing...":"🚀 Analyze"}</button>
              <button onClick={exportPdf} className="py-3 rounded-2xl bg-white text-slate-900 border border-slate-300 font-bold shadow hover:bg-slate-50 transition">📄 Download PDF</button>
              <button onClick={clearAll} className="py-3 rounded-2xl bg-amber-500 text-white font-bold shadow hover:bg-amber-600 transition">🧹 Clear</button>
            </div>
          </section>

          <section className={`rounded-3xl border ${card} shadow-xl p-5 space-y-4`}>
            <div className="text-center">
              <div className="mx-auto w-40 h-40 rounded-full flex items-center justify-center" style={{background:`conic-gradient(${meterColor} ${angle}deg, #cbd5e1 ${angle}deg)`}}>
                <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center ${soft}`}>
                  <span className="text-4xl font-black">{score}%</span>
                  <span className="text-xs opacity-70">{label}</span>
                </div>
              </div>
              <p className="opacity-70 mt-3">ATS Score</p>
            </div>
            <Info title="Matched Keywords" data={result.matched} soft={soft} />
            <Info title="Missing Keywords" data={result.missing} soft={soft} />
            <Info title="Suggestions" data={result.suggestions} soft={soft} />
            <div>
              <h3 className="font-semibold mb-2">History</h3>
              <div className="space-y-2 max-h-72 overflow-auto">
                {history.length ? history.map((h,i)=><div key={h.id} className={`rounded-2xl border p-3 ${soft}`}><div className="flex justify-between"><span>Report #{history.length-i}</span><span className="font-bold" style={{color:meterColor}}>{h.score}%</span></div></div>) : <div className={`rounded-2xl border p-3 text-sm ${soft}`}>No reports yet</div>}
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function Info({ title, data, soft }: any) {
  return <div className={`rounded-2xl border p-4 ${soft}`}><h3 className="font-semibold">{title}</h3><p className="text-sm opacity-80 mt-2">{data.length ? data.join(', ') : 'None'}</p></div>;
}

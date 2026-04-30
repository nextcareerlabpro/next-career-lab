"use client";

import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import { auth, db, provider } from "./firebase";
import {
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
  updateDoc,
  where,
} from "firebase/firestore";

type TabType = "ats" | "resume" | "cover" | "linkedin" | "billing";

export default function Page() {
  const [tab, setTab] = useState<TabType>("ats");
  const [dark, setDark] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [booting, setBooting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [scansUsed, setScansUsed] = useState(0);
  const [actionLoading, setActionLoading] = useState<string>("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [scanLimit] = useState(3);
  const [isPro, setIsPro] = useState(false);

  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [history, setHistory] = useState<any[]>([]);

  const [resumeLine, setResumeLine] = useState("");
  const [resumeOutput, setResumeOutput] = useState("");

  const [coverRole, setCoverRole] = useState("");
  const [coverCompany, setCoverCompany] = useState("");
  const [coverOutput, setCoverOutput] = useState("");

  const [linkedinRole, setLinkedinRole] = useState("");
  const [linkedinOutput, setLinkedinOutput] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const emptyResult = { score: 0, matched: [] as string[], missing: [] as string[], suggestions: [] as string[] };
  const [result, setResult] = useState(emptyResult);

  function normalize(data: any) {
    return {
      score: Number(data?.score ?? 0),
      matched: Array.isArray(data?.matched) ? data.matched : [],
      missing: Array.isArray(data?.missing) ? data.missing : [],
      suggestions: Array.isArray(data?.suggestions) ? data.suggestions : [],
    };
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
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
  if (user) {
    loadHistory();
    loadUserPlan();
  } else {
    setHistory([]);
    setScansUsed(0);
    setIsPro(false);
  }
}, [user]);

  async function loadHistory() {
    if (!user) return;
    const snap = await getDocs(query(collection(db, "reports"), where("uid", "==", user.uid)));
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    docs.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    setHistory(docs);
  }

  async function loadUserPlan() {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDocs(
    query(collection(db, "users"), where("uid", "==", user.uid))
  );

  if (userSnap.empty) {
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      email: user.email,
      plan: "free",
      scansUsed: 0,
      scansLimit: 3,
      monthYear: new Date().toISOString().slice(0, 7),
      createdAt: serverTimestamp(),
    });
    setScansUsed(0);
    setIsPro(false);
  } else {
    const userData = userSnap.docs[0].data();
    const currentMonth = new Date().toISOString().slice(0, 7);

    if (userData.monthYear !== currentMonth) {
      await updateDoc(userSnap.docs[0].ref, {
        scansUsed: 0,
        monthYear: currentMonth,
      });
      setScansUsed(0);
    } else {
      setScansUsed(userData.scansUsed || 0);
    }
    setIsPro(userData.plan === "pro");
  }
}

  function requireLogin() {
    if (!user) { alert("Please login first."); return false; }
    return true;
  }

  async function login() {
    try {
      try { await signInWithPopup(auth, provider); }
      catch { await signInWithRedirect(auth, provider); }
    } catch { alert("Login failed."); }
  }

  async function logout() {
    await signOut(auth);
    showToast("Successfully logged out!");
  }

  async function analyze() {
  if (!requireLogin()) return;
  if (!resume.trim() || !job.trim()) return;

  if (!isPro && scansUsed >= scanLimit) {
    showToast("Free limit reached! Upgrade to Pro for unlimited scans.");
    return;
  }

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

      if (!isPro) {
        const userSnap = await getDocs(
          query(collection(db, "users"), where("uid", "==", user.uid))
        );
        if (!userSnap.empty) {
          const newCount = (userSnap.docs[0].data().scansUsed || 0) + 1;
          await updateDoc(userSnap.docs[0].ref, { scansUsed: newCount });
          setScansUsed(newCount);
        }
      }

      await loadHistory();
    } catch { alert("Analyze failed."); }
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

  function clearAll() { setResume(""); setJob(""); setResult(emptyResult); }
  function loadReport(item: any) { setResult(normalize(item)); }

  async function removeReport(id: string) {
  setActionLoading(`delete-${id}`);
  try {
    await deleteDoc(doc(db, "reports", id));
    await loadHistory();
    showToast("Report deleted!");
  } catch {
    showToast("Delete failed. Try again.");
  }
  setActionLoading("");
}

  function exportPdf(data?: any) {
    const d = normalize(data || result);
    if (!d.score) { alert("Please analyze first."); return; }
    const pdf = new jsPDF();
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 0, 210, 40, "F");
    pdf.setTextColor(56, 189, 248);
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text("Next Career Lab", 15, 18);
    pdf.setFontSize(10);
    pdf.setTextColor(148, 163, 184);
    pdf.text("ATS Resume Analysis Report", 15, 28);
    pdf.setTextColor(52, 211, 153);
    pdf.text(new Date().toLocaleDateString(), 160, 28);
    pdf.setFillColor(30, 41, 59);
    pdf.roundedRect(15, 48, 80, 30, 4, 4, "F");
    pdf.setTextColor(56, 189, 248);
    pdf.setFontSize(28);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${d.score}%`, 35, 68);
    pdf.setFontSize(10);
    pdf.setTextColor(148, 163, 184);
    pdf.text("ATS Score", 22, 74);
    const label = d.score >= 70 ? "Strong Match" : d.score >= 40 ? "Moderate Match" : "Needs Improvement";
    const labelColor = d.score >= 70 ? [52, 211, 153] : d.score >= 40 ? [251, 191, 36] : [239, 68, 68];
    pdf.setFillColor(labelColor[0], labelColor[1], labelColor[2]);
    pdf.roundedRect(105, 48, 85, 30, 4, 4, "F");
    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(label, 125, 67);
    pdf.setFillColor(30, 41, 59);
    pdf.roundedRect(15, 88, 180, 35, 4, 4, "F");
    pdf.setTextColor(52, 211, 153);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Matched Keywords", 20, 100);
    pdf.setTextColor(203, 213, 225);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    const matchedLines = pdf.splitTextToSize(d.matched.length ? d.matched.join(", ") : "None", 170);
    pdf.text(matchedLines, 20, 110);
    pdf.setFillColor(30, 41, 59);
    pdf.roundedRect(15, 132, 180, 35, 4, 4, "F");
    pdf.setTextColor(239, 68, 68);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Missing Keywords", 20, 144);
    pdf.setTextColor(203, 213, 225);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    const missingLines = pdf.splitTextToSize(d.missing.length ? d.missing.join(", ") : "None", 170);
    pdf.text(missingLines, 20, 154);
    pdf.setFillColor(30, 41, 59);
    pdf.roundedRect(15, 176, 180, 50, 4, 4, "F");
    pdf.setTextColor(251, 191, 36);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("Improvement Suggestions", 20, 188);
    pdf.setTextColor(203, 213, 225);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    d.suggestions.forEach((s: string, i: number) => { pdf.text(`${i + 1}. ${s}`, 20, 198 + i * 10); });
    pdf.setFillColor(15, 23, 42);
    pdf.rect(0, 280, 210, 20, "F");
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(8);
    pdf.text("Generated by Next Career Lab — AI Powered Career Suite", 15, 291);
    pdf.text("nextcareerlab.vercel.app", 160, 291);
    pdf.save("ATS_Report_NextCareerLab.pdf");
  }

  async function handlePayment() {
  if (!requireLogin()) return;
  setPaymentLoading(true);

  try {
    const res = await fetch("/api/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_order" }),
    });

    const { order } = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Next Career Lab",
      description: "Pro Plan — Monthly",
      order_id: order.id,
      handler: async function (response: any) {
        const verifyRes = await fetch("/api/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "verify_payment",
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          const userSnap = await getDocs(
            query(collection(db, "users"), where("uid", "==", user.uid))
          );
          if (!userSnap.empty) {
            await updateDoc(userSnap.docs[0].ref, { plan: "pro" });
          }
          setIsPro(true);
          showToast("Payment successful! Pro plan activated!");
        } else {
          showToast("Payment verification failed. Contact support.");
        }
      },
      prefill: {
        name: user?.displayName || "",
        email: user?.email || "",
      },
      theme: { color: "#38bdf8" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch {
    showToast("Payment failed. Try again.");
  }

  setPaymentLoading(false);
}
  async function improveResume() {
    if (!resumeLine.trim()) return;
    setResumeOutput("Generating...");
    try {
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: `Rewrite this resume bullet point professionally with measurable impact:\n${resumeLine}` }) });
      const data = await res.json();
      setResumeOutput(data.output);
    } catch { setResumeOutput("Failed to generate."); }
  }

  async function generateCover() {
    if (!coverRole.trim() || !coverCompany.trim()) return;
    setCoverOutput("Generating...");
    try {
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: `Write a professional cover letter for ${coverRole} role at ${coverCompany}. Keep it concise and impressive.` }) });
      const data = await res.json();
      setCoverOutput(data.output);
    } catch { setCoverOutput("Failed to generate."); }
  }

  async function generateLinkedin() {
    if (!linkedinRole.trim()) return;
    setLinkedinOutput("Generating...");
    try {
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: `Create a strong LinkedIn headline and About section for a ${linkedinRole}. Optimize for recruiter SEO.` }) });
      const data = await res.json();
      setLinkedinOutput(data.output);
    } catch { setLinkedinOutput("Failed to generate."); }
  }

  const score = Number(result.score || 0);
  const angle = score * 3.6;
  const ring = score < 40 ? "#ef4444" : score < 70 ? "#f59e0b" : "#10b981";
  const bg = dark ? "bg-[#0f172a] text-white" : "bg-slate-100 text-slate-900";
  const card = dark ? "bg-[#1e293b] border-[#334155]" : "bg-white border-slate-300";
  const soft = dark ? "bg-[#0f172a] border-[#334155]" : "bg-slate-50 border-slate-300";
  const field = dark ? "bg-[#1e293b] border-[#334155] text-white placeholder:text-slate-500" : "bg-white border-slate-400 text-slate-900";

  if (booting) return null;

  return (
    <main className={`min-h-screen ${bg}`}>
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-sm font-bold shadow-lg"
          style={{background:"#1e293b", border:"1px solid #34d399", color:"#34d399"}}>
          {toast}
        </div>
      )}
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">

        <section className="rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{background: dark ? "#1e293b" : "#1e3a5f", border: dark ? "1px solid #334155" : "1px solid #1e3a5f"}}>
          <div>
            <h1 className="text-4xl md:text-5xl font-black">
              <span style={{color:"#38bdf8"}}>Next </span>
              <span className="text-white">Career </span>
              <span style={{color:"#34d399"}}>Lab</span>
            </h1>
            <p style={{color:"#64748b"}} className="mt-1 text-sm">AI Powered Career Suite v2.1</p>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <button
              onClick={() => { const n = !dark; setDark(n); localStorage.setItem("theme", n ? "dark" : "light"); }}
              style={{border:"1px solid #38bdf8", color:"#38bdf8"}}
              className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all">
              {dark ? "Light Mode" : "Dark Mode"}
            </button>
            {user ? (
              <>
                <div className="px-3 py-1.5 rounded-lg text-sm font-semibold"
                  style={{border:"1px solid #34d399", color:"#34d399"}}>
                  {user.displayName?.split(" ")[0] || user.email}
                </div>
                <button onClick={logout}
                  className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
                  style={{background:"#ef4444", color:"#fff", border:"1px solid #f87171"}}>
                  Logout
                </button>
              </>
            ) : (
              <button onClick={login}
                className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
                style={{background:"#38bdf8", color:"#0f172a"}}>
                Sign in with Google
              </button>
            )}
          </div>
        </section>

        <section className="grid lg:grid-cols-[230px_1fr] gap-6">
          <aside className={`rounded-2xl border ${card} p-4 space-y-3`}>
            <NavBtn dark={dark} active={tab==="ats"} onClick={()=>setTab("ats")} label="ATS Analyzer" />
            <NavBtn dark={dark} active={tab==="resume"} onClick={()=>setTab("resume")} label="AI Resume Writer" />
            <NavBtn dark={dark} active={tab==="cover"} onClick={()=>setTab("cover")} label="Cover Letter" />
            <NavBtn dark={dark} active={tab==="linkedin"} onClick={()=>setTab("linkedin")} label="LinkedIn Optimizer" />
            <NavBtn dark={dark} active={tab==="billing"} onClick={()=>setTab("billing")} label="Billing" />
          </aside>

          <section>
           {tab==="ats" && (
  <div className="w-full px-4 py-2 rounded-xl text-sm font-bold mb-3 flex items-center justify-between"
    style={{
      background: isPro ? "#0f2a1a" : scansUsed >= scanLimit ? "#450a0a" : "#0f172a",
      border: isPro ? "1px solid #34d399" : scansUsed >= scanLimit ? "1px solid #ef4444" : "1px solid #38bdf8",
      color: isPro ? "#34d399" : scansUsed >= scanLimit ? "#ef4444" : "#94a3b8"
    }}>
    {isPro ? (
      <>
        <span>✅ Pro Plan Active — {new Date().toLocaleString('default', {month:'long', year:'numeric'})}</span>
        <span style={{color:"#38bdf8"}}>📊 {scansUsed} scans this month</span>
      </>
    ) : (
      <>
        <span>
          {scansUsed >= scanLimit
            ? "🚫 Free limit reached! Upgrade to Pro for unlimited scans."
            : `📊 Free Scans: ${scansUsed}/${scanLimit} used this month`}
        </span>
        {scansUsed >= scanLimit && (
          <button
            onClick={() => setTab("billing")}
            className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
            style={{background:"#ef4444", color:"#fff", border:"1px solid #f87171"}}>
            Upgrade to Pro →
          </button>
        )}
      </>
    )}
  </div>
)}
  <div className="w-full px-4 py-2 rounded-xl text-sm font-bold text-center mb-3 flex items-center justify-center gap-4"
    style={{
      background: scansUsed >= scanLimit ? "#450a0a" : "#0f172a",
      border: scansUsed >= scanLimit ? "1px solid #ef4444" : "1px solid #38bdf8",
      color: scansUsed >= scanLimit ? "#ef4444" : "#94a3b8"
    }}>
    <span>
      {scansUsed >= scanLimit
        ? "🚫 Free limit reached! Upgrade to Pro for unlimited scans."
        : `📊 Free Scans: ${scansUsed}/${scanLimit} used this month`}
    </span>
    {scansUsed >= scanLimit && (
      <button
        onClick={() => setTab("billing")}
        className="px-3 py-1 rounded-lg text-xs font-bold transition-all"
        style={{background:"#ef4444", color:"#fff", border:"1px solid #f87171"}}>
        Upgrade to Pro →
      </button>
    )}
  </div>
  
            {tab==="ats" && (
              <div className="grid xl:grid-cols-[1fr_340px] gap-6">
                <div className={`rounded-2xl border ${card} p-5 space-y-4`}>
                  <input ref={fileRef} hidden type="file" accept=".pdf" onChange={(e)=>uploadFile(e.target.files?.[0])} />
                  <button onClick={()=>fileRef.current?.click()}
                    className="w-full py-3 rounded-xl font-bold transition-all"
                    style={{background:"#1e293b", color:"#38bdf8", border:"1px solid #38bdf8"}}>
                    Upload Resume PDF
                  </button>
                  <textarea rows={8} value={resume} onChange={(e)=>setResume(e.target.value)}
                    placeholder="Paste Resume" className={`w-full p-4 rounded-xl border ${field}`} />
                  <textarea rows={8} value={job} onChange={(e)=>setJob(e.target.value)}
                    placeholder="Paste Job Description" className={`w-full p-4 rounded-xl border ${field}`} />
                  <div className="grid md:grid-cols-3 gap-3">
                    <button onClick={analyze} disabled={!resume.trim()||!job.trim()}
                      className="py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                      style={{background:"#38bdf8", color:"#0f172a"}}>
                      {loading ? "Analyzing..." : "Analyze"}
                    </button>
                    <button onClick={()=>exportPdf()} disabled={score===0}
                      className="py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                      style={{background:"#1e293b", color:"#38bdf8", border:"1px solid #38bdf8"}}>
                      Download PDF
                    </button>
                    <button onClick={clearAll}
                      className="py-3 rounded-xl font-bold transition-all"
                      style={{background:"#334155", color:"#94a3b8", border:"1px solid #475569"}}>
                      Clear
                    </button>
                  </div>
                </div>


                <div className={`rounded-2xl border ${card} p-5 space-y-4`}>
                  <div className="text-center">
                    <div className="mx-auto w-40 h-40 rounded-full flex items-center justify-center"
                      style={{background:`conic-gradient(${ring} ${angle}deg,#1e293b ${angle}deg)`}}>
                      <div className="w-28 h-28 rounded-full flex items-center justify-center"
                        style={{background: dark ? "#0f172a" : "#f1f5f9"}}>
                        <span className="text-3xl font-black" style={{color: ring}}>{score}%</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm" style={{color:"#64748b"}}>ATS Score</p>
                  </div>
                  <Info title="Matched Keywords" data={result.matched} soft={soft} color="#34d399" dark={dark} />
<Info title="Missing Keywords" data={result.missing} soft={soft} color="#ef4444" dark={dark}  />
<Info title="Suggestions" data={result.suggestions} soft={soft} color="#f59e0b" dark={dark}  />
                  <div>
                    <h3 className="font-bold mb-2" style={{color:"#38bdf8"}}>History</h3>
                    <div className="space-y-2 max-h-72 overflow-auto">
                      {history.map((h)=>(
                        <div key={h.id} className={`p-3 rounded-xl ${soft}`}>
                          <div className="flex justify-between text-xs mb-2" style={{color:"#64748b"}}>
                            <span>{h.createdAt?.seconds ? new Date(h.createdAt.seconds*1000).toLocaleString() : "Saved Report"}</span>
                            <span style={{color:"#38bdf8"}}>{h.score}%</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
  <button
    onClick={() => { setActionLoading(`open-${h.id}`); loadReport(h); setActionLoading(""); }}
    className="py-2 rounded font-bold transition-all"
    style={{background: actionLoading===`open-${h.id}` ? "#0ea5e9" : "#38bdf8", color:"#0f172a"}}>
    {actionLoading===`open-${h.id}` ? "Opening..." : "📂 Open"}
  </button>
  <button
    onClick={() => { setActionLoading(`pdf-${h.id}`); exportPdf(h); setActionLoading(""); }}
    className="py-2 rounded font-bold transition-all"
    style={{background: actionLoading===`pdf-${h.id}` ? "#059669" : "#34d399", color:"#0f172a"}}>
    {actionLoading===`pdf-${h.id}` ? "Downloading..." : "⬇ PDF"}
  </button>
  <button
    onClick={() => removeReport(h.id)}
    className="py-2 rounded font-bold transition-all"
    style={{background: actionLoading===`delete-${h.id}` ? "#b91c1c" : "#ef4444", color:"#fff"}}>
    {actionLoading===`delete-${h.id}` ? "Deleting..." : "🗑 Delete"}
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
              <ModuleCard title="AI Resume Writer" card={card}>
                <textarea rows={6} value={resumeLine} onChange={(e)=>setResumeLine(e.target.value)}
                  placeholder="Paste one bullet point..." className={`w-full p-4 rounded-xl border ${field}`} />
                <button onClick={improveResume} className="px-5 py-3 rounded-xl font-bold transition-all"
                  style={{background:"#38bdf8", color:"#0f172a"}}>Improve Bullet</button>
                <textarea rows={6} value={resumeOutput} readOnly className={`w-full p-4 rounded-xl border ${field}`} />
              </ModuleCard>
            )}

            {tab==="cover" && (
              <ModuleCard title="Cover Letter Writer" card={card}>
                <input value={coverRole} onChange={(e)=>setCoverRole(e.target.value)}
                  placeholder="Role (e.g. Software Engineer)" className={`w-full p-4 rounded-xl border ${field}`} />
                <input value={coverCompany} onChange={(e)=>setCoverCompany(e.target.value)}
                  placeholder="Company (e.g. Google)" className={`w-full p-4 rounded-xl border ${field}`} />
                <button onClick={generateCover} className="px-5 py-3 rounded-xl font-bold transition-all"
                  style={{background:"#38bdf8", color:"#0f172a"}}>Generate Cover Letter</button>
                <textarea rows={10} value={coverOutput} readOnly className={`w-full p-4 rounded-xl border ${field}`} />
              </ModuleCard>
            )}

            {tab==="linkedin" && (
              <ModuleCard title="LinkedIn Optimizer" card={card}>
                <input value={linkedinRole} onChange={(e)=>setLinkedinRole(e.target.value)}
                  placeholder="Target Role (e.g. Frontend Developer)" className={`w-full p-4 rounded-xl border ${field}`} />
                <button onClick={generateLinkedin} className="px-5 py-3 rounded-xl font-bold transition-all"
                  style={{background:"#38bdf8", color:"#0f172a"}}>Generate LinkedIn Profile</button>
                <textarea rows={10} value={linkedinOutput} readOnly className={`w-full p-4 rounded-xl border ${field}`} />
              </ModuleCard>
            )}

            {tab==="billing" && (
  <ModuleCard title="Billing & Plans" card={card}>
    <div className="grid md:grid-cols-2 gap-4">
      <div className="p-5 rounded-xl space-y-3"
        style={{background:"#0f172a", border:"2px solid #334155"}}>
        <p className="text-lg font-bold" style={{color:"#94a3b8"}}>Free Plan</p>
        <p className="text-3xl font-black" style={{color:"#ffffff"}}>₹0</p>
        <ul className="space-y-2 text-sm" style={{color:"#64748b"}}>
          <li>✅ 3 ATS scans/month</li>
          <li>❌ AI Resume Writer</li>
          <li>❌ Cover Letter</li>
          <li>❌ LinkedIn Optimizer</li>
        </ul>
        <div className="px-4 py-2 rounded-xl text-center text-sm font-bold"
          style={{background:"#1e293b", color:"#64748b"}}>
          {isPro ? "Not Active" : "Current Plan"}
        </div>
      </div>

      <div className="p-5 rounded-xl space-y-3"
        style={{background:"#0f172a", border:"2px solid #38bdf8"}}>
        <p className="text-lg font-bold" style={{color:"#38bdf8"}}>Pro Plan</p>
        <p className="text-3xl font-black" style={{color:"#ffffff"}}>₹299<span className="text-sm font-normal">/month</span></p>
        <ul className="space-y-2 text-sm" style={{color:"#94a3b8"}}>
          <li>✅ Unlimited ATS scans</li>
          <li>✅ AI Resume Writer</li>
          <li>✅ Cover Letter</li>
          <li>✅ LinkedIn Optimizer</li>
        </ul>
        <button
          onClick={handlePayment}
          disabled={paymentLoading}
          className="w-full py-2 rounded-xl font-bold transition-all"
          style={{background:"#38bdf8", color:"#0f172a"}}>
          {isPro ? "Active ✅" : paymentLoading ? "Processing..." : "Upgrade to Pro — ₹299/month"}
        </button>
      </div>
    </div>
  </ModuleCard>
)}
          </section>
        </section>
      </div>
    </main>
  );
}

function NavBtn({label,active,onClick,dark}:any){
  return (
    <button onClick={onClick} className="w-full text-left px-4 py-3 rounded-xl font-bold transition-all"
      style={{
        background: active ? "#38bdf8" : dark ? "#1e293b" : "#f1f5f9",
        color: active ? "#0f172a" : dark ? "#94a3b8" : "#475569",
        border: active ? "1px solid #38bdf8" : "1px solid #334155"
      }}>
      {label}
    </button>
  );
}

function Info({title,data,soft,color,dark}:any){
  return (
    <div className={`p-4 rounded-xl ${soft}`}>
      <h3 className="font-bold text-sm" style={{color}}>{title}</h3>
      <p className="text-sm mt-2"
        style={{color: dark ? "#ffffff" : "#0f172a", fontWeight:"500"}}>
        {data.length ? data.join(", ") : "None"}
      </p>
    </div>
  );
}

function ModuleCard({title,children,card}:any){
  return (
    <div className={`rounded-2xl border ${card} p-5 space-y-4`}>
      <h2 className="text-2xl font-bold" style={{color:"#38bdf8"}}>{title}</h2>
      {children}
    </div>
  );
}

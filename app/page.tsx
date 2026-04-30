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

type TabType = "ats" | "resume" | "cover" | "linkedin" | "billing" | "help";

export default function Page() {
  const [tab, setTab] = useState<TabType>("ats");
  const [user, setUser] = useState<any>(null);
  const [booting, setBooting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [scansUsed, setScansUsed] = useState(0);
  const [scanLimit] = useState(3);
  const [isPro, setIsPro] = useState(false);
  const [proSince, setProSince] = useState<string>("");
  const [userPlan, setUserPlan] = useState<string>("monthly");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [actionLoading, setActionLoading] = useState<string>("");
  const [helpTab, setHelpTab] = useState("ats");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState<"idle"|"uploading"|"done">("idle");

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

  const theme = {
    bg: "linear-gradient(135deg, #e6faf5 0%, #fef9f0 60%, #fde8e8 100%)",
    primary: "#059669",
    accent: "#f97316",
    text: "#111827",
    textMuted: "#6b7280",
    textLight: "#9ca3af",
    inputBg: "#ffffff",
    inputBorder: "#d1fae5",
  };

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
    setTimeout(() => setToast(""), 3500);
  }

  useEffect(() => {
    getRedirectResult(auth).catch(console.error);
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setBooting(false); });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) { loadHistory(); loadUserPlan(); }
    else { setHistory([]); setScansUsed(0); setIsPro(false); }
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
    const snap = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));
    if (snap.empty) {
      await addDoc(collection(db, "users"), {
        uid: user.uid, email: user.email, plan: "free",
        scansUsed: 0, scansLimit: 3,
        monthYear: new Date().toISOString().slice(0, 7),
        createdAt: serverTimestamp(),
      });
      setScansUsed(0); setIsPro(false);
    } else {
      const data = snap.docs[0].data();
      const currentMonth = new Date().toISOString().slice(0, 7);
      if (data.monthYear !== currentMonth) {
        await updateDoc(snap.docs[0].ref, { scansUsed: 0, monthYear: currentMonth });
        setScansUsed(0);
      } else {
        setScansUsed(data.scansUsed || 0);
      }
      setIsPro(data.plan === "pro");
      setUserPlan(data.proPlan || "monthly");
      if (data.proSince) setProSince(new Date(data.proSince).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }));
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
    if (!isPro && scansUsed >= scanLimit) { showToast("Free limit reached! Upgrade to Pro."); setTab("billing"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resume, job }) });
      const data = await res.json();
      const finalData = normalize(data);
      setResult(finalData);
      await addDoc(collection(db, "reports"), { uid: user.uid, ...finalData, createdAt: serverTimestamp() });
      const snap = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));
      if (!snap.empty) {
        const newCount = (snap.docs[0].data().scansUsed || 0) + 1;
        await updateDoc(snap.docs[0].ref, { scansUsed: newCount });
        setScansUsed(newCount);
      }
      await loadHistory();
    } catch { alert("Analyze failed."); }
    setLoading(false);
  }

  async function uploadFile(file?: File) {
    if (!file) return;
    setUploadFileName(file.name);
    setUploadStatus("uploading");
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(p => { if (p >= 90) { clearInterval(interval); return 90; } return p + 15; });
    }, 200);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase();
      let text = "";
      if (ext === "pdf") {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs";
        const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((x: any) => x.str || "").join(" ") + "\n";
        }
      } else if (ext === "docx") {
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        text = result.value;
      } else if (ext === "txt") {
        text = await file.text();
      } else {
        showToast("Unsupported file. Use PDF, DOCX, or TXT.");
        clearInterval(interval); setUploadStatus("idle"); return;
      }
      setResume(text);
      clearInterval(interval);
      setUploadProgress(100);
      setUploadStatus("done");
      showToast(`${file.name} uploaded!`);
    } catch {
      clearInterval(interval);
      setUploadStatus("idle");
      showToast("Upload failed. Try again.");
    }
  }

  function clearAll() { setResume(""); setJob(""); setResult(emptyResult); setUploadStatus("idle"); setUploadProgress(0); setUploadFileName(""); }
  function loadReport(item: any) { setResult(normalize(item)); }

  async function removeReport(id: string) {
    setActionLoading(`delete-${id}`);
    try { await deleteDoc(doc(db, "reports", id)); await loadHistory(); showToast("Report deleted!"); }
    catch { showToast("Delete failed."); }
    setActionLoading("");
  }

  function exportPdf(data?: any) {
    const d = normalize(data || result);
    if (!d.score) { alert("Please analyze first."); return; }
    const pdf = new jsPDF();
    const W = 210;
    pdf.setFillColor(230, 250, 245); pdf.rect(0, 0, W, 100, "F");
    pdf.setFillColor(254, 249, 240); pdf.rect(0, 100, W, 97, "F");
    pdf.setFillColor(253, 232, 232); pdf.rect(0, 197, W, 100, "F");
    pdf.setFillColor(5, 150, 105); pdf.rect(0, 0, W, 38, "F");
    pdf.setTextColor(255, 255, 255); pdf.setFontSize(20); pdf.setFont("helvetica", "bold");
    pdf.text("Next Career Lab", 15, 16);
    pdf.setFontSize(9); pdf.setFont("helvetica", "normal");
    pdf.setTextColor(167, 243, 208); pdf.text("ATS Resume Analysis Report", 15, 26);
    pdf.setTextColor(253, 232, 200); pdf.text(new Date().toLocaleDateString("en-IN"), 162, 26);
    const sc = d.score >= 70 ? [5,150,105] : d.score >= 40 ? [249,115,22] : [220,38,38];
    pdf.setFillColor(255,255,255); pdf.roundedRect(15, 46, 85, 34, 5, 5, "F");
    pdf.setDrawColor(209,250,229); pdf.setLineWidth(0.5); pdf.roundedRect(15, 46, 85, 34, 5, 5, "S");
    pdf.setTextColor(sc[0],sc[1],sc[2]); pdf.setFontSize(28); pdf.setFont("helvetica","bold");
    pdf.text(`${d.score}%`, 32, 67);
    pdf.setFontSize(9); pdf.setFont("helvetica","normal"); pdf.setTextColor(107,114,128); pdf.text("ATS Score", 22, 75);
    const label = d.score >= 70 ? "Strong Match" : d.score >= 40 ? "Moderate Match" : "Needs Improvement";
    const lbg = d.score >= 70 ? [209,250,229] : d.score >= 40 ? [253,232,200] : [254,226,226];
    pdf.setFillColor(lbg[0],lbg[1],lbg[2]); pdf.roundedRect(108, 46, 82, 34, 5, 5, "F");
    pdf.setTextColor(sc[0],sc[1],sc[2]); pdf.setFontSize(13); pdf.setFont("helvetica","bold"); pdf.text(label, 118, 67);
    pdf.setFillColor(255,255,255); pdf.roundedRect(15, 88, 180, 36, 5, 5, "F");
    pdf.setDrawColor(209,250,229); pdf.roundedRect(15, 88, 180, 36, 5, 5, "S");
    pdf.setTextColor(5,150,105); pdf.setFontSize(10); pdf.setFont("helvetica","bold"); pdf.text("Matched Keywords", 22, 100);
    pdf.setTextColor(55,65,81); pdf.setFontSize(8.5); pdf.setFont("helvetica","normal");
    pdf.text(pdf.splitTextToSize(d.matched.length ? d.matched.join("  •  ") : "None", 168).slice(0,2), 22, 110);
    pdf.setFillColor(255,255,255); pdf.roundedRect(15, 132, 180, 36, 5, 5, "F");
    pdf.setDrawColor(254,226,226); pdf.roundedRect(15, 132, 180, 36, 5, 5, "S");
    pdf.setTextColor(220,38,38); pdf.setFontSize(10); pdf.setFont("helvetica","bold"); pdf.text("Missing Keywords", 22, 144);
    pdf.setTextColor(55,65,81); pdf.setFontSize(8.5); pdf.setFont("helvetica","normal");
    pdf.text(pdf.splitTextToSize(d.missing.length ? d.missing.join("  •  ") : "None", 168).slice(0,2), 22, 154);
    pdf.setFillColor(255,255,255); pdf.roundedRect(15, 176, 180, 68, 5, 5, "F");
    pdf.setDrawColor(253,232,200); pdf.roundedRect(15, 176, 180, 68, 5, 5, "S");
    pdf.setTextColor(249,115,22); pdf.setFontSize(10); pdf.setFont("helvetica","bold"); pdf.text("Improvement Suggestions", 22, 188);
    pdf.setTextColor(55,65,81); pdf.setFontSize(8.5); pdf.setFont("helvetica","normal");
    d.suggestions.forEach((s: string, i: number) => { pdf.text(pdf.splitTextToSize(`${i+1}.  ${s}`, 166)[0], 22, 198 + i * 11); });
    pdf.setFillColor(5,150,105); pdf.rect(0, 282, W, 15, "F");
    pdf.setTextColor(167,243,208); pdf.setFontSize(7.5);
    pdf.text("Generated by Next Career Lab — AI Powered Career Suite", 15, 291);
    pdf.text("nextcareerlab.vercel.app", 162, 291);
    pdf.save("ATS_Report_NextCareerLab.pdf");
  }

  async function handlePayment(planType: string, amount: number) {
    if (!requireLogin()) return;
    setPaymentLoading(true);
    setSelectedPlan(planType);
    try {
      const res = await fetch("/api/razorpay", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create_order", amount }) });
      const { order } = await res.json();
      const planLabels: any = { monthly: "Pro Monthly", quarterly: "Pro Quarterly", annual: "Pro Annual" };
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount, currency: order.currency,
        name: "Next Career Lab", description: planLabels[planType],
        order_id: order.id,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/razorpay", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "verify_payment", ...response }) });
          const v = await verifyRes.json();
          if (v.success) {
            const now = new Date();
            const expiry = new Date(now);
            if (planType === "monthly") expiry.setMonth(expiry.getMonth() + 1);
            else if (planType === "quarterly") expiry.setMonth(expiry.getMonth() + 3);
            else if (planType === "annual") expiry.setFullYear(expiry.getFullYear() + 1);
            const snap = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));
            if (!snap.empty) await updateDoc(snap.docs[0].ref, { plan: "pro", proPlan: planType, proSince: now.toISOString(), proExpiry: expiry.toISOString() });
            setIsPro(true); setUserPlan(planType);
            setProSince(now.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }));
            showToast(`Payment successful! ${planLabels[planType]} activated!`);
          } else { showToast("Verification failed. Contact support."); }
        },
        prefill: { name: user?.displayName || "", email: user?.email || "" },
        theme: { color: planType === "annual" ? "#f97316" : planType === "quarterly" ? "#06b6d4" : "#059669" },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch { showToast("Payment failed. Try again."); }
    setPaymentLoading(false);
  }

  async function improveResume() {
    if (!resumeLine.trim()) return;
    setResumeOutput("Generating...");
    try {
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: `Rewrite this resume bullet point professionally with measurable impact:\n${resumeLine}` }) });
      const data = await res.json(); setResumeOutput(data.output);
    } catch { setResumeOutput("Failed."); }
  }

  async function generateCover() {
    if (!coverRole.trim() || !coverCompany.trim()) return;
    setCoverOutput("Generating...");
    try {
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: `Write a professional cover letter for ${coverRole} role at ${coverCompany}. Keep it concise and impressive.` }) });
      const data = await res.json(); setCoverOutput(data.output);
    } catch { setCoverOutput("Failed."); }
  }

  async function generateLinkedin() {
    if (!linkedinRole.trim()) return;
    setLinkedinOutput("Generating...");
    try {
      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: `Create a strong LinkedIn headline and About section for a ${linkedinRole}. Optimize for recruiter SEO.` }) });
      const data = await res.json(); setLinkedinOutput(data.output);
    } catch { setLinkedinOutput("Failed."); }
  }

  const score = Number(result.score || 0);
  const angle = score * 3.6;
  const ring = score < 40 ? "#dc2626" : score < 70 ? "#f97316" : "#059669";

  function handleLockedTab(t: TabType) {
    if (!isPro && t !== "ats" && t !== "billing" && t !== "help") {
      showToast("This feature requires Pro plan. Upgrade to unlock!"); setTab("billing"); return;
    }
    setTab(t);
  }

  if (booting) return null;

  const inputStyle: any = { background: "#fff", border: "1.5px solid #d1fae5", color: "#111827", borderRadius: "10px", padding: "12px 14px", width: "100%", fontSize: "14px", outline: "none", fontFamily: "inherit" };

  return (
    <main style={{ minHeight: "100vh", background: theme.bg, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {toast && (
        <div style={{ position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 50, padding: "10px 24px", borderRadius: "12px", fontSize: "13px", fontWeight: 600, background: "#fff", border: "1.5px solid #059669", color: "#059669", boxShadow: "0 4px 20px rgba(5,150,105,0.15)" }}>
          {toast}
        </div>
      )}

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 20px" }}>

        {/* Header */}
        <header style={{ background: "#fff", borderRadius: "16px", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", border: "1px solid #d1fae5", boxShadow: "0 2px 12px rgba(5,150,105,0.08)" }}>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 700, lineHeight: 1.2 }}>
              <span style={{ color: "#059669" }}>Next </span>
              <span style={{ color: "#111827" }}>Career </span>
              <span style={{ color: "#f97316" }}>Lab</span>
            </h1>
            <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>AI Powered Career Suite</p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {user ? (
              <>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "6px 14px" }}>
                  {user.displayName?.split(" ")[0] || user.email}
                  {isPro && <span style={{ marginLeft: "6px", color: "#f97316" }}>⭐ PRO</span>}
                </div>
                <button onClick={logout} style={{ fontSize: "13px", fontWeight: 600, color: "#fff", background: "#f97316", border: "none", borderRadius: "8px", padding: "7px 16px", cursor: "pointer" }}>Logout</button>
              </>
            ) : (
              <>
                <button onClick={login} style={{ fontSize: "13px", fontWeight: 600, color: "#374151", background: "#fff", border: "1.5px solid #374151", borderRadius: "8px", padding: "7px 16px", cursor: "pointer" }}>Sign in</button>
                <button onClick={login} style={{ fontSize: "13px", fontWeight: 600, color: "#fff", background: "#059669", border: "none", borderRadius: "8px", padding: "7px 18px", cursor: "pointer" }}>Get Started</button>
              </>
            )}
          </div>
        </header>

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "20px" }}>

          {/* Sidebar */}
          <aside style={{ background: "#fff", borderRadius: "16px", padding: "16px 12px", border: "1px solid #d1fae5", height: "fit-content", boxShadow: "0 2px 12px rgba(5,150,105,0.06)" }}>
            <p style={{ fontSize: "10px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", paddingLeft: "8px" }}>Menu</p>
            {([
              { id: "ats", label: "ATS Analyzer", locked: false },
              { id: "resume", label: "AI Resume Writer", locked: !isPro },
              { id: "cover", label: "Cover Letter", locked: !isPro },
              { id: "linkedin", label: "LinkedIn Optimizer", locked: !isPro },
              { id: "billing", label: "Billing & Plans", locked: false },
              { id: "help", label: "Help & Tutorials", locked: false },
            ] as any[]).map((item) => (
              <button key={item.id} onClick={() => handleLockedTab(item.id as TabType)}
                style={{ width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: "10px", fontSize: "13px", fontWeight: tab === item.id ? 600 : 400, marginBottom: "4px", background: tab === item.id ? "#059669" : "transparent", color: tab === item.id ? "#fff" : item.locked ? "#d1d5db" : "#374151", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{item.label}</span>
                {item.locked && <span style={{ fontSize: "11px" }}>🔒</span>}
              </button>
            ))}
          </aside>

          {/* Content */}
          <section>

            {/* ATS Tab */}
            {tab === "ats" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {user && isPro && (
                  <div style={{ background: "rgba(255,255,255,0.9)", border: "1px solid #a7f3d0", borderRadius: "10px", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", fontWeight: 500 }}>
                    <span style={{ color: "#059669" }}>✅ Pro {userPlan === "quarterly" ? "Quarterly" : userPlan === "annual" ? "Annual" : "Monthly"} Active{proSince ? ` since ${proSince}` : ""}</span>
                    <span style={{ color: "#f97316", fontWeight: 600 }}>{scansUsed} scans this month</span>
                  </div>
                )}
                {user && !isPro && (
                  <div style={{ background: scansUsed >= scanLimit ? "#fff1f2" : "rgba(255,255,255,0.9)", border: `1px solid ${scansUsed >= scanLimit ? "#fecdd3" : "#a7f3d0"}`, borderRadius: "10px", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", fontWeight: 500 }}>
                    <span style={{ color: scansUsed >= scanLimit ? "#e11d48" : "#059669" }}>
                      {scansUsed >= scanLimit ? "Free limit reached! Upgrade to Pro." : `Free Scans: ${scansUsed}/${scanLimit} used this month`}
                    </span>
                    {scansUsed >= scanLimit && (
                      <button onClick={() => setTab("billing")} style={{ fontSize: "12px", fontWeight: 600, color: "#fff", background: "#f97316", border: "none", borderRadius: "6px", padding: "5px 12px", cursor: "pointer" }}>Upgrade →</button>
                    )}
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "16px" }}>
                  <div style={{ background: "rgba(255,255,255,0.92)", borderRadius: "16px", border: "1px solid #d1fae5", padding: "20px", boxShadow: "0 2px 12px rgba(5,150,105,0.06)" }}>
                    <input ref={fileRef} hidden type="file" accept=".pdf,.docx,.txt" onChange={(e) => uploadFile(e.target.files?.[0])} />
                    <div onClick={() => fileRef.current?.click()} style={{ border: "2px dashed #6ee7b7", borderRadius: "12px", padding: "20px", textAlign: "center", background: "rgba(255,255,255,0.7)", cursor: "pointer", marginBottom: "16px" }}>
                      <div style={{ fontSize: "28px", marginBottom: "6px" }}>📄</div>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "#059669" }}>{uploadStatus === "done" ? uploadFileName : "Upload Resume"}</p>
                      <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "3px" }}>{uploadStatus === "idle" ? "Drag & drop or click to browse" : uploadStatus === "uploading" ? "Uploading..." : "Upload complete!"}</p>
                      <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "8px" }}>
                        {["PDF", "DOCX", "TXT"].map(ft => <span key={ft} style={{ fontSize: "10px", padding: "3px 8px", borderRadius: "5px", background: "#fde8d8", color: "#c2410c", fontWeight: 600 }}>{ft}</span>)}
                      </div>
                      {uploadStatus !== "idle" && (
                        <div style={{ marginTop: "10px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9ca3af", marginBottom: "4px" }}>
                            <span>{uploadFileName}</span><span>{uploadProgress}%</span>
                          </div>
                          <div style={{ height: "4px", background: "#d1fae5", borderRadius: "10px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${uploadProgress}%`, background: uploadStatus === "done" ? "#059669" : "linear-gradient(90deg,#059669,#f97316)", borderRadius: "10px", transition: "width 0.3s" }} />
                          </div>
                        </div>
                      )}
                    </div>
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Resume Text</p>
                    <textarea rows={6} value={resume} onChange={(e) => setResume(e.target.value)} placeholder="Or paste your resume text here..." style={{ ...inputStyle, resize: "vertical", marginBottom: "12px" }} />
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>Job Description</p>
                    <textarea rows={6} value={job} onChange={(e) => setJob(e.target.value)} placeholder="Paste the job description here..." style={{ ...inputStyle, resize: "vertical", marginBottom: "16px" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                      <button onClick={analyze} disabled={!resume.trim() || !job.trim()} style={{ padding: "11px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, background: "#059669", color: "#fff", border: "none", cursor: "pointer", opacity: (!resume.trim() || !job.trim()) ? 0.5 : 1 }}>
                        {loading ? "Analyzing..." : "Analyze"}
                      </button>
                      <button onClick={() => exportPdf()} disabled={score === 0} style={{ padding: "11px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, background: "#fff", color: "#059669", border: "1.5px solid #059669", cursor: "pointer", opacity: score === 0 ? 0.5 : 1 }}>
                        Download PDF
                      </button>
                      <button onClick={clearAll} style={{ padding: "11px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, background: "#fef9f0", color: "#9ca3af", border: "1px solid #e5e7eb", cursor: "pointer" }}>
                        Clear
                      </button>
                    </div>
                  </div>

                  <div style={{ background: "rgba(255,255,255,0.92)", borderRadius: "16px", border: "1px solid #d1fae5", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "0 2px 12px rgba(5,150,105,0.06)" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ width: "140px", height: "140px", borderRadius: "50%", background: `conic-gradient(${ring} ${angle}deg,#e5e7eb ${angle}deg)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
                        <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                          <span style={{ fontSize: "28px", fontWeight: 700, color: ring }}>{score}%</span>
                        </div>
                      </div>
                      <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px", fontWeight: 500 }}>ATS Score</p>
                      {score > 0 && (
                        <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 12px", borderRadius: "20px", background: score >= 70 ? "#d1fae5" : score >= 40 ? "#fde8d8" : "#fee2e2", color: score >= 70 ? "#059669" : score >= 40 ? "#c2410c" : "#dc2626" }}>
                          {score >= 70 ? "Strong Match" : score >= 40 ? "Moderate Match" : "Needs Improvement"}
                        </span>
                      )}
                    </div>
                    <KwBox title="Matched Keywords" data={result.matched} color="#059669" tagBg="#d1fae5" tagColor="#065f46" />
                    <KwBox title="Missing Keywords" data={result.missing} color="#dc2626" tagBg="#fee2e2" tagColor="#991b1b" />
                    <KwBox title="Suggestions" data={result.suggestions} color="#f97316" tagBg="#fde8d8" tagColor="#c2410c" isList />
                    <div>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: "#059669", marginBottom: "8px" }}>History</p>
                      <div style={{ maxHeight: "220px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                        {history.map((h) => (
                          <div key={h.id} style={{ background: "rgba(255,255,255,0.8)", borderRadius: "10px", border: "1px solid #e5e7eb", padding: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#9ca3af", marginBottom: "8px" }}>
                              <span>{h.createdAt?.seconds ? new Date(h.createdAt.seconds * 1000).toLocaleString() : "Saved"}</span>
                              <span style={{ fontWeight: 600, color: "#059669" }}>{h.score}%</span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
                              <button onClick={() => { setActionLoading(`open-${h.id}`); loadReport(h); setActionLoading(""); }} style={{ padding: "6px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, background: "#059669", color: "#fff", border: "none", cursor: "pointer" }}>
                                {actionLoading === `open-${h.id}` ? "..." : "📂 Open"}
                              </button>
                              <button onClick={() => { setActionLoading(`pdf-${h.id}`); exportPdf(h); setActionLoading(""); }} style={{ padding: "6px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, background: "#fde8d8", color: "#c2410c", border: "none", cursor: "pointer" }}>
                                {actionLoading === `pdf-${h.id}` ? "..." : "⬇ PDF"}
                              </button>
                              <button onClick={() => removeReport(h.id)} style={{ padding: "6px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, background: "#fee2e2", color: "#dc2626", border: "none", cursor: "pointer" }}>
                                {actionLoading === `delete-${h.id}` ? "..." : "🗑"}
                              </button>
                            </div>
                          </div>
                        ))}
                        {history.length === 0 && <p style={{ fontSize: "12px", color: "#9ca3af", textAlign: "center", padding: "12px 0" }}>No reports yet</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "resume" && isPro && (
              <Card title="AI Resume Writer">
                <Label>Paste a weak bullet point</Label>
                <textarea rows={5} value={resumeLine} onChange={(e) => setResumeLine(e.target.value)} placeholder="e.g. Managed team and handled projects..." style={{ ...inputStyle, resize: "vertical" }} />
                <Btn onClick={improveResume}>Improve Bullet</Btn>
                <Label>Improved Result</Label>
                <textarea rows={6} value={resumeOutput} readOnly style={{ ...inputStyle, background: "#f9fafb", resize: "vertical" }} />
              </Card>
            )}

            {tab === "cover" && isPro && (
              <Card title="Cover Letter Writer">
                <Label>Job Role</Label>
                <input value={coverRole} onChange={(e) => setCoverRole(e.target.value)} placeholder="e.g. Software Engineer" style={inputStyle} />
                <div style={{ height: "12px" }} />
                <Label>Company Name</Label>
                <input value={coverCompany} onChange={(e) => setCoverCompany(e.target.value)} placeholder="e.g. Google" style={inputStyle} />
                <div style={{ height: "12px" }} />
                <Btn onClick={generateCover}>Generate Cover Letter</Btn>
                <Label>Generated Letter</Label>
                <textarea rows={10} value={coverOutput} readOnly style={{ ...inputStyle, background: "#f9fafb", resize: "vertical" }} />
              </Card>
            )}

            {tab === "linkedin" && isPro && (
              <Card title="LinkedIn Optimizer">
                <Label>Target Role</Label>
                <input value={linkedinRole} onChange={(e) => setLinkedinRole(e.target.value)} placeholder="e.g. Frontend Developer" style={inputStyle} />
                <div style={{ height: "12px" }} />
                <Btn onClick={generateLinkedin}>Generate LinkedIn Profile</Btn>
                <Label>Generated Profile</Label>
                <textarea rows={10} value={linkedinOutput} readOnly style={{ ...inputStyle, background: "#f9fafb", resize: "vertical" }} />
              </Card>
            )}

            {tab === "billing" && (
              <Card title="Billing & Plans">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

                  {/* Free */}
                  <div style={{ background: "#fff", borderRadius: "14px", border: !isPro ? "2px solid #059669" : "1px solid #e5e7eb", padding: "20px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#6b7280" }}>Free</p>
                    <p style={{ fontSize: "32px", fontWeight: 700, color: "#111827", margin: "8px 0 4px" }}>₹0<span style={{ fontSize: "13px", fontWeight: 400, color: "#9ca3af" }}>/mo</span></p>
                    <ul style={{ listStyle: "none", fontSize: "12px", color: "#6b7280", lineHeight: "2" }}>
                      <li>✅ 3 ATS scans/month</li>
                      <li>✅ PDF report</li>
                      <li>✅ Keyword analysis</li>
                      <li style={{ color: "#d1d5db" }}>✗ AI Resume Writer</li>
                      <li style={{ color: "#d1d5db" }}>✗ Cover Letter</li>
                      <li style={{ color: "#d1d5db" }}>✗ LinkedIn Optimizer</li>
                    </ul>
                    <div style={{ marginTop: "14px", padding: "8px", borderRadius: "8px", background: "#f9fafb", textAlign: "center", fontSize: "12px", color: "#6b7280", fontWeight: 600 }}>
                      {!isPro ? "Current Plan ✓" : "Not Active"}
                    </div>
                  </div>

                  {/* Pro Monthly */}
                  <div style={{ background: "#fff", borderRadius: "14px", border: isPro && userPlan === "monthly" ? "2px solid #059669" : "1px solid #d1fae5", padding: "20px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#059669" }}>Pro Monthly</p>
                    <p style={{ fontSize: "32px", fontWeight: 700, color: "#111827", margin: "8px 0 2px" }}>₹299<span style={{ fontSize: "13px", fontWeight: 400, color: "#9ca3af" }}>/mo</span></p>
                    <p style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "8px" }}>Billed monthly · ₹9.96/day</p>
                    <ul style={{ listStyle: "none", fontSize: "12px", color: "#6b7280", lineHeight: "2" }}>
                      <li>✅ Unlimited ATS scans</li>
                      <li>✅ AI Resume Writer</li>
                      <li>✅ Cover Letter</li>
                      <li>✅ LinkedIn Optimizer</li>
                      <li>✅ PDF reports</li>
                      <li>✅ Priority support</li>
                    </ul>
                    {!isPro ? (
                      <button onClick={() => handlePayment("monthly", 29900)} disabled={paymentLoading}
                        style={{ marginTop: "14px", width: "100%", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, background: "#059669", color: "#fff", border: "none", cursor: "pointer", opacity: paymentLoading && selectedPlan === "monthly" ? 0.7 : 1 }}>
                        {paymentLoading && selectedPlan === "monthly" ? "Processing..." : "Get Monthly"}
                      </button>
                    ) : (
                      <div style={{ marginTop: "14px", padding: "8px", borderRadius: "8px", background: "#f0fdf4", textAlign: "center", fontSize: "12px", color: "#059669", fontWeight: 600 }}>
                        {userPlan === "monthly" ? "Active ✅" : "Not Active"}
                      </div>
                    )}
                  </div>

                  {/* Pro Quarterly */}
                  <div style={{ background: "linear-gradient(135deg,#f0fdf4,#ecfeff)", borderRadius: "14px", border: isPro && userPlan === "quarterly" ? "2px solid #06b6d4" : "2px solid #06b6d4", padding: "20px", position: "relative" }}>
                    <span style={{ position: "absolute", top: "-10px", left: "14px", background: "#06b6d4", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px" }}>POPULAR</span>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#06b6d4" }}>Pro Quarterly</p>
                    <p style={{ fontSize: "32px", fontWeight: 700, color: "#111827", margin: "8px 0 2px" }}>₹199<span style={{ fontSize: "13px", fontWeight: 400, color: "#9ca3af" }}>/mo</span></p>
                    <p style={{ fontSize: "11px", color: "#06b6d4", marginBottom: "8px" }}>₹597 billed every 3 months · Save 33%</p>
                    <ul style={{ listStyle: "none", fontSize: "12px", color: "#6b7280", lineHeight: "2" }}>
                      <li>✅ Everything in Monthly</li>
                      <li>✅ Unlimited ATS scans</li>
                      <li>✅ All AI tools</li>
                      <li>✅ Priority support</li>
                      <li>✅ Early access features</li>
                      <li>✅ ₹6.63/day only!</li>
                    </ul>
                    {!isPro ? (
                      <button onClick={() => handlePayment("quarterly", 59700)} disabled={paymentLoading}
                        style={{ marginTop: "14px", width: "100%", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, background: "#06b6d4", color: "#fff", border: "none", cursor: "pointer", opacity: paymentLoading && selectedPlan === "quarterly" ? 0.7 : 1 }}>
                        {paymentLoading && selectedPlan === "quarterly" ? "Processing..." : "Get Quarterly — ₹597"}
                      </button>
                    ) : (
                      <div style={{ marginTop: "14px", padding: "8px", borderRadius: "8px", background: "#ecfeff", textAlign: "center", fontSize: "12px", color: "#06b6d4", fontWeight: 600 }}>
                        {userPlan === "quarterly" ? "Active ✅" : "Not Active"}
                      </div>
                    )}
                  </div>

                  {/* Pro Annual */}
                  <div style={{ background: "linear-gradient(135deg,#f0fdf4,#fff7ed)", borderRadius: "14px", border: "2px solid #f97316", padding: "20px", position: "relative" }}>
                    <span style={{ position: "absolute", top: "-10px", right: "14px", background: "#f97316", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px" }}>BEST VALUE</span>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#f97316" }}>Pro Annual</p>
                    <p style={{ fontSize: "32px", fontWeight: 700, color: "#111827", margin: "8px 0 2px" }}>₹149<span style={{ fontSize: "13px", fontWeight: 400, color: "#9ca3af" }}>/mo</span></p>
                    <p style={{ fontSize: "11px", color: "#f97316", marginBottom: "8px" }}>₹1,788/yr · Save 50% · ☕ ₹4.96/day</p>
                    <ul style={{ listStyle: "none", fontSize: "12px", color: "#6b7280", lineHeight: "2" }}>
                      <li>✅ Everything in Quarterly</li>
                      <li>✅ Unlimited everything</li>
                      <li>✅ Resume templates (soon)</li>
                      <li>✅ Interview prep (soon)</li>
                      <li>✅ Dedicated support</li>
                      <li>✅ Less than a cup of chai!</li>
                    </ul>
                    {!isPro ? (
                      <button onClick={() => handlePayment("annual", 178800)} disabled={paymentLoading}
                        style={{ marginTop: "14px", width: "100%", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, background: "#f97316", color: "#fff", border: "none", cursor: "pointer", opacity: paymentLoading && selectedPlan === "annual" ? 0.7 : 1 }}>
                        {paymentLoading && selectedPlan === "annual" ? "Processing..." : "Get Annual — ₹1,788/yr"}
                      </button>
                    ) : (
                      <div style={{ marginTop: "14px", padding: "8px", borderRadius: "8px", background: "#fff7ed", textAlign: "center", fontSize: "12px", color: "#f97316", fontWeight: 600 }}>
                        {userPlan === "annual" ? "Active ✅" : "Not Active"}
                      </div>
                    )}
                  </div>

                </div>
                {isPro && (
                  <div style={{ marginTop: "14px", padding: "12px 18px", borderRadius: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#059669", fontSize: "13px", fontWeight: 500 }}>
                    ✅ You are on Pro {userPlan === "quarterly" ? "Quarterly" : userPlan === "annual" ? "Annual" : "Monthly"} Plan{proSince ? ` since ${proSince}` : ""}. Enjoying unlimited access!
                  </div>
                )}
              </Card>
            )}

            {tab === "help" && (
              <Card title="Help & Tutorials">
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                  {["ats","resume","cover","linkedin"].map((t) => (
                    <button key={t} onClick={() => setHelpTab(t)}
                      style={{ padding: "7px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, background: helpTab === t ? "#059669" : "#fff", color: helpTab === t ? "#fff" : "#374151", border: `1px solid ${helpTab === t ? "#059669" : "#e5e7eb"}`, cursor: "pointer" }}>
                      {t === "ats" ? "ATS Analyzer" : t === "resume" ? "Resume Writer" : t === "cover" ? "Cover Letter" : "LinkedIn"}
                    </button>
                  ))}
                </div>
                {helpTab === "ats" && <HelpSteps title="ATS Analyzer" steps={["Upload your resume PDF, DOCX or TXT — or paste text directly","Paste the full job description from any job portal","Click Analyze — get your ATS score instantly","Green 70%+ = Strong Match. Yellow 40-69% = Moderate. Red = Needs work","Add missing keywords naturally to your resume","Download PDF report to share with career counselor"]} tip="Tailor your resume for each job by naturally adding missing keywords." />}
                {helpTab === "resume" && <HelpSteps title="AI Resume Writer" steps={["Pick a weak bullet point from your resume","Paste it in the text box","Click Improve Bullet","AI rewrites it with measurable impact and action verbs","Copy the improved line and replace in your resume","Repeat for all weak bullet points"]} tip="Include numbers and metrics in your original bullet for even better results." />}
                {helpTab === "cover" && <HelpSteps title="Cover Letter Writer" steps={["Enter the job title you are applying for","Enter the company name","Click Generate Cover Letter","AI writes a personalized professional letter","Review and add personal touches","Paste in your job application"]} tip="Always add 1-2 specific things you know about the company." />}
                {helpTab === "linkedin" && <HelpSteps title="LinkedIn Optimizer" steps={["Enter your target job title","Click Generate LinkedIn Profile","Copy the headline to your LinkedIn profile","Copy the About section to your LinkedIn summary","Update your profile and wait for recruiter messages","Refresh every 3 months to stay relevant"]} tip="Use keywords that recruiters in your industry actually search for." />}
              </Card>
            )}

          </section>
        </div>
      </div>
    </main>
  );
}

function KwBox({ title, data, color, tagBg, tagColor, isList }: any) {
  return (
    <div style={{ background: "rgba(255,255,255,0.8)", borderRadius: "10px", border: "1px solid #e5e7eb", padding: "12px" }}>
      <p style={{ fontSize: "11px", fontWeight: 600, color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>{title}</p>
      {data.length === 0 ? (
        <p style={{ fontSize: "12px", color: "#9ca3af" }}>None</p>
      ) : isList ? (
        <ul style={{ listStyle: "none", fontSize: "12px", color: "#374151", lineHeight: "1.7" }}>
          {data.map((s: string, i: number) => <li key={i}><span style={{ color, fontWeight: 600 }}>{i + 1}.</span> {s}</li>)}
        </ul>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {data.map((kw: string, i: number) => (
            <span key={i} style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "20px", background: tagBg, color: tagColor, fontWeight: 500 }}>{kw}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <div style={{ background: "rgba(255,255,255,0.92)", borderRadius: "16px", border: "1px solid #d1fae5", padding: "24px", boxShadow: "0 2px 12px rgba(5,150,105,0.06)", display: "flex", flexDirection: "column", gap: "14px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#059669" }}>{title}</h2>
      {children}
    </div>
  );
}

function Label({ children }: any) {
  return <p style={{ fontSize: "11px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>{children}</p>;
}

function Btn({ children, onClick }: any) {
  return (
    <button onClick={onClick} style={{ padding: "11px 22px", borderRadius: "10px", fontSize: "13px", fontWeight: 600, background: "#059669", color: "#fff", border: "none", cursor: "pointer", alignSelf: "flex-start" }}>
      {children}
    </button>
  );
}

function HelpSteps({ title, steps, tip }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#059669" }}>{title} — How to use</h3>
      {steps.map((s: string, i: number) => (
        <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", background: "rgba(255,255,255,0.8)", borderRadius: "10px", border: "1px solid #e5e7eb", padding: "12px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#059669", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
          <p style={{ fontSize: "13px", color: "#374151", lineHeight: "1.6" }}>{s}</p>
        </div>
      ))}
      <div style={{ padding: "12px 16px", borderRadius: "10px", background: "#fff7ed", border: "1px solid #fed7aa", color: "#c2410c", fontSize: "13px", fontWeight: 500 }}>
        💡 {tip}
      </div>
    </div>
  );
}

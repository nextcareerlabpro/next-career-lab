export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { sendMail, APP_URL } from "@/lib/emailSender";

const HEADER = `
  <div style="background:linear-gradient(135deg,#059669,#34d399);padding:32px;text-align:center;">
    <h1 style="color:#fff;margin:0;font-size:24px;font-weight:800;">Upgrade Your Resume</h1>
    <p style="color:#d1fae5;margin:6px 0 0;font-size:13px;">AI Powered Career Suite</p>
  </div>`;

const FOOTER = `
  <div style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #e5e7eb;">
    <p style="color:#9ca3af;font-size:11px;margin:0;">© 2026 Upgrade Your Resume &nbsp;·&nbsp;
      <a href="${APP_URL}/unsubscribe" style="color:#9ca3af;">Unsubscribe</a>
    </p>
  </div>`;

function wrap(body: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:20px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(5,150,105,0.10);">
${HEADER}${body}${FOOTER}
</div></body></html>`;
}

function cta(text: string, url: string, color = "#059669") {
  return `<div style="text-align:center;margin:24px 0;">
    <a href="${url}" style="background:${color};color:#fff;text-decoration:none;padding:13px 32px;border-radius:10px;font-size:14px;font-weight:700;display:inline-block;">${text}</a>
  </div>`;
}

// Day 2 — Tips to get more from free plan
function day2Email(name: string) {
  return wrap(`<div style="padding:32px;">
    <h2 style="color:#111827;font-size:20px;margin:0 0 10px;">3 ways to get more from your free plan, ${name}</h2>
    <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 20px;">
      Most users who score <strong style="color:#059669;">85%+</strong> on ATS follow these three steps:
    </p>
    <div style="background:#f0fdf4;border-radius:12px;padding:20px 24px;margin-bottom:20px;">
      <p style="color:#374151;font-size:14px;margin:8px 0;"><strong>1. Use real job descriptions.</strong> Copy the exact JD from the job posting — not a generic one. The more specific, the better your match score.</p>
      <p style="color:#374151;font-size:14px;margin:8px 0;"><strong>2. Add missing keywords naturally.</strong> Don't just stuff them in — weave them into your bullet points and summary.</p>
      <p style="color:#374151;font-size:14px;margin:8px 0;"><strong>3. Re-scan after every edit.</strong> Each iteration improves your score. Most users go from 55% → 82% in 3 scans.</p>
    </div>
    <div style="background:#fff7ed;border-left:4px solid #f97316;border-radius:8px;padding:14px 18px;margin-bottom:20px;">
      <p style="color:#92400e;font-size:13px;margin:0;font-weight:600;">💡 Pro tip: You have 3 free scans/month. Make each one count by targeting a specific job, not a generic role.</p>
    </div>
    ${cta("Run a New Scan Now →", APP_URL)}
  </div>`);
}

// Day 5 — Resume is costing interviews
function day5Email(name: string) {
  return wrap(`<div style="padding:32px;">
    <h2 style="color:#111827;font-size:20px;margin:0 0 10px;">Your resume might be failing silently, ${name}</h2>
    <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 20px;">
      75% of resumes are rejected by ATS software before a human ever reads them. Here's what most people miss:
    </p>
    <div style="background:#fff1f2;border-radius:12px;padding:20px 24px;margin-bottom:20px;">
      <p style="color:#dc2626;font-size:14px;font-weight:700;margin:0 0 10px;">Common reasons for ATS rejection:</p>
      <p style="color:#374151;font-size:14px;margin:6px 0;">❌ Missing keywords from the job description</p>
      <p style="color:#374151;font-size:14px;margin:6px 0;">❌ Generic summary that doesn't match the role</p>
      <p style="color:#374151;font-size:14px;margin:6px 0;">❌ Bullet points without metrics or numbers</p>
      <p style="color:#374151;font-size:14px;margin:6px 0;">❌ Skills section missing industry-specific tools</p>
    </div>
    <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 20px;">
      Paste a job description from a role you want → our ATS Analyzer tells you exactly what's missing.
    </p>
    ${cta("Check My Resume Now →", APP_URL)}
    <p style="color:#9ca3af;font-size:12px;text-align:center;margin:16px 0 0;">Takes 30 seconds. No editing needed to get your score.</p>
  </div>`);
}

// Day 8 — Upgrade nudge
function day8Email(name: string) {
  return wrap(`<div style="padding:32px;">
    <h2 style="color:#111827;font-size:20px;margin:0 0 10px;">You're leaving 5 AI tools on the table, ${name}</h2>
    <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 20px;">
      Your free plan gives you the ATS Analyzer. Pro unlocks everything else — all for less than a cup of coffee a day.
    </p>
    <div style="background:#f0fdf4;border-radius:12px;padding:20px 24px;margin-bottom:16px;">
      <p style="color:#059669;font-weight:700;font-size:14px;margin:0 0 12px;">What Pro users get that you don't (yet):</p>
      <p style="color:#374151;font-size:14px;margin:8px 0;">✍️ <strong>AI Resume Writer</strong> — rewrites your bullets with measurable impact</p>
      <p style="color:#374151;font-size:14px;margin:8px 0;">📝 <strong>Cover Letter Generator</strong> — tailored to each job in seconds</p>
      <p style="color:#374151;font-size:14px;margin:8px 0;">💼 <strong>LinkedIn Optimizer</strong> — headline + summary that gets recruiters to reach out</p>
      <p style="color:#374151;font-size:14px;margin:8px 0;">📄 <strong>6 Resume Templates</strong> — AI-enhanced, ATS-friendly PDF download</p>
      <p style="color:#374151;font-size:14px;margin:8px 0;">🎯 <strong>JD Analyzer</strong> — deep match analysis with section-by-section feedback</p>
    </div>
    <div style="display:flex;gap:12px;margin-bottom:20px;">
      <div style="flex:1;background:#f0fdf4;border-radius:10px;padding:14px;text-align:center;border:2px solid #059669;">
        <p style="color:#059669;font-size:11px;font-weight:700;margin:0 0 4px;">POPULAR</p>
        <p style="color:#111827;font-size:20px;font-weight:800;margin:0;">₹199<span style="font-size:12px;font-weight:400;color:#9ca3af;">/mo</span></p>
        <p style="color:#6b7280;font-size:11px;margin:4px 0 0;">Quarterly — ₹597 total</p>
      </div>
      <div style="flex:1;background:#fff7ed;border-radius:10px;padding:14px;text-align:center;border:2px solid #f97316;">
        <p style="color:#f97316;font-size:11px;font-weight:700;margin:0 0 4px;">BEST VALUE</p>
        <p style="color:#111827;font-size:20px;font-weight:800;margin:0;">₹149<span style="font-size:12px;font-weight:400;color:#9ca3af;">/mo</span></p>
        <p style="color:#6b7280;font-size:11px;margin:4px 0 0;">Annual — ₹1,788/yr</p>
      </div>
    </div>
    ${cta("Upgrade to Pro →", `${APP_URL}?tab=billing`, "linear-gradient(135deg,#059669,#34d399)")}
  </div>`);
}

// Day 15 — Final nudge (free users only)
function day15Email(name: string) {
  return wrap(`<div style="padding:32px;">
    <div style="background:linear-gradient(135deg,#0f172a,#1e3a8a);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
      <p style="color:#f97316;font-size:12px;font-weight:700;margin:0 0 6px;text-transform:uppercase;">Still on Free Plan</p>
      <h2 style="color:#fff;font-size:22px;margin:0 0 8px;">Your career tools are waiting, ${name}</h2>
      <p style="color:#93c5fd;font-size:13px;margin:0;">Pro users land interviews 3x faster on average</p>
    </div>
    <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 20px;">
      You've been using the ATS Analyzer — now imagine having AI rewrite your entire resume, generate tailored cover letters, and optimize your LinkedIn all in one place.
    </p>
    <div style="background:#f0fdf4;border-left:4px solid #059669;border-radius:8px;padding:14px 18px;margin-bottom:20px;">
      <p style="color:#065f46;font-size:13px;margin:0;line-height:1.6;">
        <strong>One job offer pays for a year of Pro 100x over.</strong> At ₹149/month, it's less than what you spend on food in a day — and it could change your career.
      </p>
    </div>
    <p style="color:#374151;font-size:14px;margin:0 0 20px;">Upgrade takes 60 seconds. Cancel anytime.</p>
    ${cta("Get Pro Now — From ₹149/mo →", `${APP_URL}?tab=billing`, "#f97316")}
    <p style="color:#9ca3af;font-size:12px;text-align:center;margin:12px 0 0;">
      Questions? Reply to this email — we respond within 24 hours.
    </p>
  </div>`);
}

const DRIP_SCHEDULE: Array<{ key: string; day: number; subject: (name: string) => string; html: (name: string) => string; freeOnly: boolean }> = [
  {
    key: "d2",
    day: 2,
    subject: (name) => `3 ways to get more from your free plan, ${name}`,
    html: day2Email,
    freeOnly: false,
  },
  {
    key: "d5",
    day: 5,
    subject: () => "Your resume might be failing silently — check this",
    html: day5Email,
    freeOnly: false,
  },
  {
    key: "d8",
    day: 8,
    subject: (name) => `You're leaving 5 AI tools on the table, ${name}`,
    html: day8Email,
    freeOnly: true,
  },
  {
    key: "d15",
    day: 15,
    subject: (name) => `Your career tools are still waiting, ${name}`,
    html: day15Email,
    freeOnly: true,
  },
];

export async function GET(req: Request) {
  // Vercel cron sends Authorization: Bearer <CRON_SECRET>
  const auth = req.headers.get("authorization") || "";
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snap = await adminDb.collection("users").get();
  const now = Date.now();
  let sent = 0;
  let skipped = 0;

  for (const doc of snap.docs) {
    const d = doc.data();
    if (!d.email || !d.createdAt) { skipped++; continue; }

    const createdMs = d.createdAt.toDate?.()?.getTime?.() ?? 0;
    if (!createdMs) { skipped++; continue; }

    const daysSince = Math.floor((now - createdMs) / 86400000);
    const dripSent: Record<string, boolean> = d.dripSent || {};
    const isPro = d.plan === "pro" && (!d.proExpiry || new Date(d.proExpiry) > new Date());
    const name = d.displayName || d.email.split("@")[0] || "there";

    const updates: Record<string, boolean> = {};

    for (const step of DRIP_SCHEDULE) {
      if (dripSent[step.key]) continue;
      if (daysSince < step.day) continue;
      if (step.freeOnly && isPro) { updates[`dripSent.${step.key}`] = true; continue; }

      try {
        await sendMail(d.email, step.subject(name), step.html(name));
        updates[`dripSent.${step.key}`] = true;
        sent++;
      } catch (e) {
        console.error(`Drip ${step.key} failed for ${d.email}:`, e);
      }
    }

    if (Object.keys(updates).length > 0) {
      await doc.ref.update(updates);
    }
  }

  console.log(`Drip cron: sent=${sent} skipped=${skipped} total=${snap.size}`);
  return NextResponse.json({ ok: true, sent, skipped, total: snap.size });
}

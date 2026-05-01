import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const FROM = `"Next Career Lab" <${process.env.GMAIL_USER}>`;

function welcomeEmail(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 4px 24px rgba(5,150,105,0.10);">
    <div style="background:linear-gradient(135deg,#059669,#34d399);padding:36px 32px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:800;">Next Career Lab</h1>
      <p style="color:#d1fae5;margin:8px 0 0;font-size:14px;">AI Powered Career Suite</p>
    </div>
    <div style="padding:36px 32px;">
      <h2 style="color:#111827;font-size:22px;margin:0 0 12px;">Welcome, ${name}! 🎉</h2>
      <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 20px;">
        We're thrilled to have you on board! Your account is ready and you can start using our AI-powered career tools right away.
      </p>
      <div style="background:#f0fdf4;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
        <p style="color:#059669;font-weight:700;font-size:14px;margin:0 0 12px;">What you can do with Next Career Lab:</p>
        <p style="color:#374151;font-size:14px;margin:6px 0;">🔍 <strong>ATS Analyzer</strong> — Check resume vs job match</p>
        <p style="color:#374151;font-size:14px;margin:6px 0;">✍️ <strong>AI Resume Writer</strong> — AI improves your resume</p>
        <p style="color:#374151;font-size:14px;margin:6px 0;">📝 <strong>Cover Letter</strong> — Tailored cover letters instantly</p>
        <p style="color:#374151;font-size:14px;margin:6px 0;">💼 <strong>LinkedIn Optimizer</strong> — Boost your LinkedIn profile</p>
        <p style="color:#374151;font-size:14px;margin:6px 0;">📄 <strong>Resume Templates</strong> — AI-enhanced PDF resumes</p>
      </div>
      <div style="background:#fff7ed;border-left:4px solid #f97316;border-radius:8px;padding:14px 18px;margin-bottom:28px;">
        <p style="color:#c2410c;font-size:13px;margin:0;font-weight:600;">You're on the Free Plan</p>
        <p style="color:#9a3412;font-size:13px;margin:6px 0 0;">Upgrade to Pro starting at just <strong>Rs. 149/month</strong> for unlimited access.</p>
      </div>
      <div style="text-align:center;margin-bottom:28px;">
        <a href="https://y-three-black-14.vercel.app"
           style="background:linear-gradient(135deg,#059669,#34d399);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:700;display:inline-block;">
          Start Using Next Career Lab
        </a>
      </div>
    </div>
    <div style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 Next Career Lab · AI Powered Career Suite</p>
    </div>
  </div>
</body>
</html>`;
}

function paymentEmail(name: string, plan: string, amount: string, orderId: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f0fdf4;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;margin-top:20px;margin-bottom:20px;box-shadow:0 4px 24px rgba(5,150,105,0.10);">
    <div style="background:linear-gradient(135deg,#059669,#34d399);padding:36px 32px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:800;">Next Career Lab</h1>
      <p style="color:#d1fae5;margin:8px 0 0;font-size:14px;">Payment Confirmation</p>
    </div>
    <div style="padding:36px 32px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h2 style="color:#111827;font-size:22px;margin:12px 0 4px;">Payment Successful!</h2>
        <p style="color:#6b7280;font-size:14px;margin:0;">Thank you, ${name}. Your payment has been received.</p>
      </div>
      <div style="background:#f9fafb;border-radius:12px;padding:20px 24px;margin-bottom:24px;border:1px solid #e5e7eb;">
        <p style="color:#374151;font-weight:700;font-size:14px;margin:0 0 14px;">Order Summary</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="color:#6b7280;font-size:13px;padding:6px 0;">Plan</td><td style="color:#111827;font-size:13px;font-weight:600;text-align:right;">${plan}</td></tr>
          <tr><td style="color:#6b7280;font-size:13px;padding:6px 0;">Amount Paid</td><td style="color:#059669;font-size:13px;font-weight:700;text-align:right;">${amount}</td></tr>
          <tr><td style="color:#6b7280;font-size:13px;padding:6px 0;">Order ID</td><td style="color:#111827;font-size:13px;text-align:right;font-family:monospace;">${orderId}</td></tr>
          <tr><td style="color:#6b7280;font-size:13px;padding:6px 0;">Date</td><td style="color:#111827;font-size:13px;text-align:right;">${new Date().toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}</td></tr>
        </table>
      </div>
      <div style="background:#f0fdf4;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
        <p style="color:#059669;font-weight:700;font-size:14px;margin:0 0 12px;">Your Pro Features are Now Active:</p>
        <p style="color:#374151;font-size:14px;margin:6px 0;">✅ Unlimited ATS scans</p>
        <p style="color:#374151;font-size:14px;margin:6px 0;">✅ AI Resume Writer</p>
        <p style="color:#374151;font-size:14px;margin:6px 0;">✅ Cover Letter Generator</p>
        <p style="color:#374151;font-size:14px;margin:6px 0;">✅ LinkedIn Optimizer</p>
        <p style="color:#374151;font-size:14px;margin:6px 0;">✅ All 6 Resume Templates + PDF download</p>
      </div>
      <div style="text-align:center;">
        <a href="https://y-three-black-14.vercel.app"
           style="background:linear-gradient(135deg,#059669,#34d399);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:700;display:inline-block;">
          Start Using Pro Features
        </a>
      </div>
    </div>
    <div style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 Next Career Lab · Keep this email as your payment receipt.</p>
    </div>
  </div>
</body>
</html>`;
}

function proActivationEmail(name: string, plan: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;margin-top:20px;margin-bottom:20px;">
    <div style="background:linear-gradient(135deg,#0f172a,#1e3a8a);padding:36px 32px;text-align:center;">
      <h1 style="color:#ffffff;margin:8px 0 4px;font-size:28px;font-weight:800;">You're Now Pro!</h1>
      <p style="color:#93c5fd;margin:0;font-size:14px;">Next Career Lab — ${plan} Plan Activated</p>
    </div>
    <div style="padding:36px 32px;">
      <h2 style="color:#111827;font-size:20px;margin:0 0 12px;">Congratulations, ${name}!</h2>
      <p style="color:#6b7280;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Your Pro plan is now active. You have full unlimited access to all AI-powered career tools!
      </p>
      <div style="background:linear-gradient(135deg,#0f172a,#1e3a8a);border-radius:12px;padding:20px 24px;margin-bottom:24px;text-align:center;">
        <p style="color:#f97316;font-size:13px;font-weight:700;margin:0 0 6px;text-transform:uppercase;">Active Plan</p>
        <p style="color:#ffffff;font-size:24px;font-weight:800;margin:0;">${plan}</p>
        <p style="color:#93c5fd;font-size:13px;margin:8px 0 0;">All features unlocked — No limits!</p>
      </div>
      <div style="background:#fff7ed;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
        <p style="color:#c2410c;font-weight:700;font-size:14px;margin:0 0 12px;">Pro Tips to Get Started:</p>
        <p style="color:#374151;font-size:14px;margin:6px 0;">1. Upload resume in ATS Analyzer first</p>
        <p style="color:#374151;font-size:14px;margin:6px 0;">2. Go to Resume Templates for AI enhancement</p>
        <p style="color:#374151;font-size:14px;margin:6px 0;">3. Use Cover Letter for every job application</p>
        <p style="color:#374151;font-size:14px;margin:6px 0;">4. Optimize LinkedIn for maximum visibility</p>
      </div>
      <div style="text-align:center;">
        <a href="https://y-three-black-14.vercel.app"
           style="background:linear-gradient(135deg,#f97316,#fb923c);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:700;display:inline-block;">
          Explore Pro Features
        </a>
      </div>
    </div>
    <div style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 Next Career Lab · Thank you for choosing Pro!</p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, email, name, plan, amount, orderId } = body;

    if (!type || !email || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let subject = "";
    let html = "";

    if (type === "welcome") {
      subject = `Welcome to Next Career Lab, ${name}!`;
      html = welcomeEmail(name);
    } else if (type === "payment") {
      subject = `Payment Confirmed — Next Career Lab Pro`;
      html = paymentEmail(name, plan || "Pro", amount || "", orderId || "");
    } else if (type === "pro_activation") {
      subject = `Your Pro Plan is Active — Next Career Lab`;
      html = proActivationEmail(name, plan || "Pro");
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    await transporter.sendMail({
      from: FROM,
      to: email,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}
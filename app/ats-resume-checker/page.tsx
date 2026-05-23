import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free ATS Resume Checker — Instant ATS Score | Upgrade Your Resume",
  description:
    "Check your resume's ATS score free. Upload your resume, paste a job description, and see exactly which keywords you're missing. Beat ATS filters and get more interviews.",
  alternates: { canonical: "https://upgradeyourresume.com/ats-resume-checker" },
  openGraph: {
    title: "Free ATS Resume Checker — Instant ATS Score",
    description:
      "Upload your resume and get your ATS match score instantly. See missing keywords and fix your resume in minutes.",
    url: "https://upgradeyourresume.com/ats-resume-checker",
    type: "website",
    locale: "en_US",
    siteName: "Upgrade Your Resume",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free ATS Resume Checker — Instant ATS Score",
    description: "Upload your resume and get your ATS match score instantly.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a free ATS resume checker?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An ATS resume checker compares your resume against a job description and gives you a match score. It highlights exactly which keywords are missing so you can fix your resume before submitting your application.",
      },
    },
    {
      "@type": "Question",
      name: "Is this ATS resume checker completely free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Your first scan is completely free — no credit card required. Upload your resume, paste the job description, and get your ATS match score instantly.",
      },
    },
    {
      "@type": "Question",
      name: "What ATS score do I need to pass?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most enterprise ATS systems require a 70% match or higher. Resumes scoring below 70% are often auto-rejected before a recruiter sees them. Aim for 80%+ for the best results.",
      },
    },
    {
      "@type": "Question",
      name: "How do I improve my ATS score quickly?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Add the missing keywords from the job description into your resume summary, skills section, and experience bullets. Use the exact phrases from the JD — not synonyms. Our AI Resume Writer does this automatically.",
      },
    },
    {
      "@type": "Question",
      name: "Which file format is best for ATS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PDF is recommended for most modern ATS systems. Avoid Word documents with complex formatting, tables, columns, or graphics — these can confuse ATS parsers and drop your score.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://upgradeyourresume.com" },
    { "@type": "ListItem", position: 2, name: "Free ATS Resume Checker", item: "https://upgradeyourresume.com/ats-resume-checker" },
  ],
};

const otherTools = [
  { href: "/ai-resume-writer", label: "AI Resume Writer", emoji: "✍️", desc: "Rewrite your resume for any job in seconds" },
  { href: "/cover-letter-generator", label: "Cover Letter Generator", emoji: "📝", desc: "AI cover letters tailored to each role" },
  { href: "/linkedin-optimizer", label: "LinkedIn Optimizer", emoji: "💼", desc: "Rank higher in recruiter searches" },
];

export default function ATSResumeCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main style={{ fontFamily: "Inter, -apple-system, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
        {/* Nav */}
        <nav style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "14px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/" style={{ fontWeight: 700, color: "#059669", textDecoration: "none", fontSize: "16px" }}>Upgrade Your Resume</Link>
          <span style={{ color: "#cbd5e1" }}>›</span>
          <span style={{ color: "#64748b", fontSize: "14px" }}>Free ATS Resume Checker</span>
        </nav>

        {/* Hero */}
        <section style={{ background: "linear-gradient(135deg,#ecfdf5 0%,#f0fdf4 60%,#f8fafc 100%)", padding: "64px 24px 56px", textAlign: "center" }}>
          <div style={{ maxWidth: "740px", margin: "0 auto" }}>
            <div style={{ display: "inline-block", background: "#d1fae5", color: "#059669", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", fontWeight: 600, marginBottom: "20px" }}>
              ✅ Free — No Signup Required
            </div>
            <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.15, margin: "0 0 20px" }}>
              Free ATS Resume Checker
            </h1>
            <p style={{ fontSize: "18px", color: "#475569", lineHeight: 1.7, margin: "0 0 12px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
              75% of resumes never reach a human recruiter. Check your ATS match score instantly — see every missing keyword and fix them before you apply.
            </p>
            <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 36px" }}>
              Trusted by 10,000+ job seekers · Average score improvement: +24%
            </p>
            <Link
              href="/?tab=ats"
              style={{ display: "inline-block", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", padding: "16px 40px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", textDecoration: "none", boxShadow: "0 4px 20px rgba(5,150,105,0.3)" }}
            >
              Check My ATS Score Free →
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section style={{ background: "#fff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "28px 24px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "24px", textAlign: "center" }}>
            {[
              { val: "75%", label: "Resumes rejected by ATS" },
              { val: "6–7 sec", label: "Avg. recruiter scan time" },
              { val: "80%+", label: "Score needed to get interviews" },
              { val: "+24%", label: "Avg. improvement after our tool" },
            ].map(({ val, label }) => (
              <div key={label}>
                <p style={{ fontSize: "28px", fontWeight: 800, color: "#059669", margin: "0 0 4px" }}>{val}</p>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginBottom: "12px", textAlign: "center" }}>How the ATS Resume Checker Works</h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: "36px", fontSize: "15px" }}>Four steps — takes under 2 minutes</p>
          <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
            {[
              { step: "1", title: "Upload Your Resume", desc: "Paste your resume text or upload a PDF/DOCX. We extract the content automatically." },
              { step: "2", title: "Add Job Description", desc: "Copy the full job posting and paste it. Our AI extracts all key requirements." },
              { step: "3", title: "Get Your ATS Score", desc: "See your match percentage, which keywords matched, and which are missing." },
              { step: "4", title: "Fix & Re-check", desc: "Add missing keywords to your resume and re-scan until you hit 80%+" },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "24px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", fontWeight: 800, fontSize: "17px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>{step}</div>
                <h3 style={{ fontWeight: 700, color: "#0f172a", marginBottom: "8px", fontSize: "15px", margin: "0 0 8px" }}>{title}</h3>
                <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why it matters */}
        <section style={{ background: "#fff", padding: "56px 24px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>Why Your ATS Score Is the #1 Job Search Factor</h2>
            <p style={{ color: "#475569", lineHeight: 1.75, margin: "0 0 24px", fontSize: "15px" }}>
              Over 99% of Fortune 500 companies and most mid-sized firms use Applicant Tracking Systems to filter resumes automatically. A resume scoring below 70% is auto-rejected — even if the candidate is perfectly qualified. The recruiter never sees it.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                "75% of resumes are auto-rejected by ATS before reaching a human",
                "Adding just 3–5 missing keywords can push your score from 55% to 80%+",
                "Recruiters spend only 6–7 seconds on resumes that do pass",
                "ATS-optimized resumes get 3× more callbacks than generic ones",
              ].map(point => (
                <div key={point} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "14px 18px", background: "#f0fdf4", borderRadius: "10px", border: "1px solid #bbf7d0" }}>
                  <span style={{ color: "#059669", fontWeight: 700, fontSize: "16px", flexShrink: 0 }}>✓</span>
                  <span style={{ color: "#374151", fontSize: "14px", lineHeight: 1.6 }}>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px" }}>
          <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a", margin: "0 0 32px" }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {faqSchema.mainEntity.map((item) => (
              <div key={item.name} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px 24px" }}>
                <h3 style={{ fontWeight: 600, color: "#0f172a", margin: "0 0 8px", fontSize: "15px" }}>{item.name}</h3>
                <p style={{ color: "#64748b", margin: 0, fontSize: "14px", lineHeight: 1.7 }}>{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Other tools */}
        <section style={{ background: "#f1f5f9", padding: "48px 24px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: "0 0 20px" }}>More Free AI Career Tools</h2>
            <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
              {otherTools.map(t => (
                <Link key={t.href} href={t.href} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", textDecoration: "none", display: "block", transition: "border-color 0.2s" }}>
                  <p style={{ fontWeight: 700, color: "#0f172a", margin: "0 0 4px", fontSize: "15px" }}>{t.emoji} {t.label}</p>
                  <p style={{ color: "#64748b", margin: 0, fontSize: "13px" }}>{t.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: "linear-gradient(135deg,#059669,#047857)", padding: "56px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: "560px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", margin: "0 0 12px" }}>Ready to beat the ATS filter?</h2>
            <p style={{ color: "#a7f3d0", margin: "0 0 32px", fontSize: "15px", lineHeight: 1.65 }}>
              Check your ATS score in under 2 minutes — completely free.
            </p>
            <Link href="/?tab=ats" style={{ display: "inline-block", background: "#fff", color: "#059669", padding: "15px 36px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", textDecoration: "none" }}>
              Check My ATS Score Free →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: "#fff", borderTop: "1px solid #e2e8f0", padding: "24px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
          <Link href="/" style={{ color: "#059669", textDecoration: "none", fontWeight: 600 }}>Upgrade Your Resume</Link>
          {" · "}
          <Link href="/blog" style={{ color: "#64748b", textDecoration: "none" }}>Blog</Link>
          {" · "}
          <span>Free ATS resume checker, AI resume writer &amp; career tools</span>
        </footer>
      </main>
    </>
  );
}

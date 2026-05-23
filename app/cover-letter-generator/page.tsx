import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Cover Letter Generator — Free Personalized Cover Letters | Upgrade Your Resume",
  description:
    "Generate a personalized, recruiter-ready cover letter in seconds with AI. Paste the job description and get a tailored cover letter — completely free.",
  alternates: { canonical: "https://upgradeyourresume.com/cover-letter-generator" },
  openGraph: {
    title: "AI Cover Letter Generator — Free & Personalized",
    description:
      "Paste the job description and get a recruiter-ready cover letter in seconds. AI-powered, free, tailored to every role.",
    url: "https://upgradeyourresume.com/cover-letter-generator",
    type: "website",
    locale: "en_US",
    siteName: "Upgrade Your Resume",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Cover Letter Generator Free",
    description: "Get a personalized, recruiter-ready cover letter in seconds. Free AI cover letter tool.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is this AI cover letter generator completely free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Generate your first cover letter free with no signup required. Just paste the job description and your resume, and the AI writes a personalized cover letter in seconds.",
      },
    },
    {
      "@type": "Question",
      name: "How does the AI cover letter generator work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Enter the job title, company name, and paste the job description. The AI analyzes the role requirements and writes a tailored cover letter that matches your experience to the job — including specific keywords and company details.",
      },
    },
    {
      "@type": "Question",
      name: "Will the AI cover letter sound generic or templated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Unlike static templates, our AI uses the specific job description and your resume to generate a cover letter unique to that role. Each output references the job requirements and positions your specific experience as the solution.",
      },
    },
    {
      "@type": "Question",
      name: "Can I edit the AI-generated cover letter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The AI output is fully editable. You can customize the tone, adjust specific sentences, and personalize it further before copying or downloading.",
      },
    },
    {
      "@type": "Question",
      name: "Do recruiters actually read cover letters?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on the company. For smaller companies and competitive roles, cover letters are read carefully. For high-volume hiring, they're often skimmed. Either way, a strong cover letter is the deciding factor when two candidates are equally qualified — so it's always worth submitting one.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://upgradeyourresume.com" },
    { "@type": "ListItem", position: 2, name: "AI Cover Letter Generator", item: "https://upgradeyourresume.com/cover-letter-generator" },
  ],
};

const otherTools = [
  { href: "/ats-resume-checker", label: "ATS Resume Checker", emoji: "🎯", desc: "Score your resume against any job description" },
  { href: "/ai-resume-writer", label: "AI Resume Writer", emoji: "✍️", desc: "Rewrite your resume for any job in seconds" },
  { href: "/linkedin-optimizer", label: "LinkedIn Optimizer", emoji: "💼", desc: "Rank higher in recruiter searches" },
];

export default function CoverLetterGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main style={{ fontFamily: "Inter, -apple-system, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
        {/* Nav */}
        <nav style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "14px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/" style={{ fontWeight: 700, color: "#059669", textDecoration: "none", fontSize: "16px" }}>Upgrade Your Resume</Link>
          <span style={{ color: "#cbd5e1" }}>›</span>
          <span style={{ color: "#64748b", fontSize: "14px" }}>AI Cover Letter Generator</span>
        </nav>

        {/* Hero */}
        <section style={{ background: "linear-gradient(135deg,#ecfdf5 0%,#f0fdf4 60%,#f8fafc 100%)", padding: "64px 24px 56px", textAlign: "center" }}>
          <div style={{ maxWidth: "740px", margin: "0 auto" }}>
            <div style={{ display: "inline-block", background: "#d1fae5", color: "#059669", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", fontWeight: 600, marginBottom: "20px" }}>
              📝 AI Cover Letter Generator — Free
            </div>
            <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.15, margin: "0 0 20px" }}>
              AI Cover Letter Generator
            </h1>
            <p style={{ fontSize: "18px", color: "#475569", lineHeight: 1.7, margin: "0 0 12px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
              Stop writing cover letters from scratch. Paste the job description and get a personalized, recruiter-ready cover letter in seconds — for free.
            </p>
            <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 36px" }}>
              Tailored to each role · Professional tone · No templates
            </p>
            <Link
              href="/?tab=cover"
              style={{ display: "inline-block", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", padding: "16px 40px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", textDecoration: "none", boxShadow: "0 4px 20px rgba(5,150,105,0.3)" }}
            >
              Generate My Cover Letter Free →
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginBottom: "12px", textAlign: "center" }}>Generate a Cover Letter in 3 Steps</h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: "36px", fontSize: "15px" }}>Under 60 seconds from start to done</p>
          <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
            {[
              { step: "1", title: "Paste the Job Description", desc: "Copy the full job posting. The AI extracts what the company needs most from the role." },
              { step: "2", title: "Add Your Resume", desc: "Paste your resume so the AI can match your real experience to the job requirements." },
              { step: "3", title: "Get Your Cover Letter", desc: "A personalized, professional cover letter — tailored to the role and ready to submit." },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "28px 24px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", fontWeight: 800, fontSize: "17px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>{step}</div>
                <h3 style={{ fontWeight: 700, color: "#0f172a", margin: "0 0 8px", fontSize: "15px" }}>{title}</h3>
                <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What makes a good cover letter */}
        <section style={{ background: "#fff", padding: "56px 24px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>What Makes an AI Cover Letter Work</h2>
            <p style={{ color: "#475569", lineHeight: 1.75, margin: "0 0 24px", fontSize: "15px" }}>
              Most cover letters fail because they sound generic. Our AI avoids this by analyzing the specific job description and writing copy that directly addresses what the company needs — using your real experience as proof.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                "Opening line references the company or role specifically — not a generic intro",
                "Uses keywords from the job description naturally throughout",
                "Highlights your most relevant achievement for that specific role",
                "Correct length: 200–280 words — readable and punchy",
                "Professional closing with a clear call to action",
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
                <Link key={t.href} href={t.href} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", textDecoration: "none", display: "block" }}>
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
            <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", margin: "0 0 12px" }}>Write your next cover letter in 60 seconds</h2>
            <p style={{ color: "#a7f3d0", margin: "0 0 32px", fontSize: "15px", lineHeight: 1.65 }}>
              AI-personalized to every role. Professional. Free.
            </p>
            <Link href="/?tab=cover" style={{ display: "inline-block", background: "#fff", color: "#059669", padding: "15px 36px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", textDecoration: "none" }}>
              Generate My Cover Letter Free →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: "#fff", borderTop: "1px solid #e2e8f0", padding: "24px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
          <Link href="/" style={{ color: "#059669", textDecoration: "none", fontWeight: 600 }}>Upgrade Your Resume</Link>
          {" · "}
          <Link href="/blog" style={{ color: "#64748b", textDecoration: "none" }}>Blog</Link>
          {" · "}
          <span>Free AI cover letter generator, resume writer &amp; career tools</span>
        </footer>
      </main>
    </>
  );
}

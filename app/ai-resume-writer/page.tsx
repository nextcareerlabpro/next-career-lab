import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Resume Writer Free — Rewrite Your Resume in Seconds | Upgrade Your Resume",
  description:
    "AI resume writer that rewrites your resume for any job description. Adds missing keywords, improves ATS score, and makes your resume recruiter-ready — free.",
  alternates: { canonical: "https://upgradeyourresume.com/ai-resume-writer" },
  openGraph: {
    title: "AI Resume Writer Free — Rewrite Your Resume for Any Job",
    description:
      "AI rewrites your resume for any job description. Adds missing keywords and boosts your ATS score instantly — free.",
    url: "https://upgradeyourresume.com/ai-resume-writer",
    type: "website",
    locale: "en_US",
    siteName: "Upgrade Your Resume",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Resume Writer Free — Rewrite Your Resume in Seconds",
    description: "AI rewrites your resume for any job description. Adds missing keywords and boosts your ATS score.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is the AI resume writer really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You get one free AI resume rewrite without signing up. Pro users get unlimited rewrites tailored to every job they apply for.",
      },
    },
    {
      "@type": "Question",
      name: "How does the AI resume writer improve my resume?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our AI analyzes the job description to identify required skills and keywords, then rewrites your resume summary, skills section, and experience bullets to match — improving your ATS score and making your resume more relevant to the role.",
      },
    },
    {
      "@type": "Question",
      name: "Will the AI change my job history or make things up?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The AI only rewrites existing content — improving phrasing and adding relevant keywords based on your actual experience. It never invents experience, companies, or dates.",
      },
    },
    {
      "@type": "Question",
      name: "How is AI resume writing different from a resume template?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Templates give you structure. AI resume writing gives you content — it analyzes the specific job you're targeting and rewrites your bullet points and summary to match that job's exact requirements. Every output is unique to the role.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download my AI-rewritten resume as a PDF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. After the AI rewrites your resume, you can export it as a PDF using one of 32 professional resume templates — including ATS-friendly and visually designed layouts.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://upgradeyourresume.com" },
    { "@type": "ListItem", position: 2, name: "AI Resume Writer Free", item: "https://upgradeyourresume.com/ai-resume-writer" },
  ],
};

const otherTools = [
  { href: "/ats-resume-checker", label: "ATS Resume Checker", emoji: "🎯", desc: "Score your resume against any job description" },
  { href: "/cover-letter-generator", label: "Cover Letter Generator", emoji: "📝", desc: "AI cover letters tailored to each role" },
  { href: "/linkedin-optimizer", label: "LinkedIn Optimizer", emoji: "💼", desc: "Rank higher in recruiter searches" },
];

export default function AIResumeWriterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main style={{ fontFamily: "Inter, -apple-system, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
        {/* Nav */}
        <nav style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "14px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/" style={{ fontWeight: 700, color: "#059669", textDecoration: "none", fontSize: "16px" }}>Upgrade Your Resume</Link>
          <span style={{ color: "#cbd5e1" }}>›</span>
          <span style={{ color: "#64748b", fontSize: "14px" }}>AI Resume Writer</span>
        </nav>

        {/* Hero */}
        <section style={{ background: "linear-gradient(135deg,#ecfdf5 0%,#f0fdf4 60%,#f8fafc 100%)", padding: "64px 24px 56px", textAlign: "center" }}>
          <div style={{ maxWidth: "740px", margin: "0 auto" }}>
            <div style={{ display: "inline-block", background: "#d1fae5", color: "#059669", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", fontWeight: 600, marginBottom: "20px" }}>
              ✍️ AI Resume Writer — Free
            </div>
            <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.15, margin: "0 0 20px" }}>
              AI Resume Writer Free
            </h1>
            <p style={{ fontSize: "18px", color: "#475569", lineHeight: 1.7, margin: "0 0 12px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
              Paste a job description and let AI rewrite your resume with the exact keywords recruiters and ATS systems are looking for. Tailored to every job in seconds.
            </p>
            <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 36px" }}>
              No templates. No generic copy. AI-personalized to each role.
            </p>
            <Link
              href="/?tab=resume"
              style={{ display: "inline-block", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", padding: "16px 40px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", textDecoration: "none", boxShadow: "0 4px 20px rgba(5,150,105,0.3)" }}
            >
              Rewrite My Resume Free →
            </Link>
          </div>
        </section>

        {/* Features */}
        <section style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginBottom: "12px", textAlign: "center" }}>What the AI Resume Writer Does</h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: "36px", fontSize: "15px" }}>It doesn&apos;t just format — it rewrites for the specific job</p>
          <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
            {[
              { icon: "🔑", title: "Keyword Injection", desc: "Adds every missing keyword from the JD into your resume naturally — without stuffing." },
              { icon: "📊", title: "ATS Score Boost", desc: "Rewrites your content to consistently hit 80%+ ATS match scores for your target roles." },
              { icon: "✍️", title: "Summary Rewrite", desc: "Crafts a role-specific professional summary that positions you as the exact candidate they described." },
              { icon: "📋", title: "Bullet Point Optimizer", desc: "Rewrites experience bullets to be achievement-focused with measurable results and key terms." },
              { icon: "🎯", title: "Skills Section", desc: "Expands your skills section with the exact tools and technologies mentioned in the job posting." },
              { icon: "📥", title: "PDF Export", desc: "Download your optimized resume as a PDF in any of 32 professional templates instantly." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "22px" }}>
                <p style={{ fontSize: "26px", margin: "0 0 10px" }}>{icon}</p>
                <h3 style={{ fontWeight: 700, color: "#0f172a", margin: "0 0 8px", fontSize: "15px" }}>{title}</h3>
                <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Before/After */}
        <section style={{ background: "#fff", padding: "56px 24px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a", margin: "0 0 8px", textAlign: "center" }}>Before vs. After AI Resume Writer</h2>
            <p style={{ textAlign: "center", color: "#64748b", margin: "0 0 36px", fontSize: "15px" }}>Same experience — different presentation</p>
            <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "20px" }}>
                <p style={{ fontWeight: 700, color: "#dc2626", margin: "0 0 12px", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em" }}>❌ Before</p>
                <p style={{ color: "#374151", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                  &quot;Responsible for managing a team and handling customer issues. Improved processes and helped increase sales.&quot;
                </p>
              </div>
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "20px" }}>
                <p style={{ fontWeight: 700, color: "#059669", margin: "0 0 12px", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em" }}>✅ After AI Rewrite</p>
                <p style={{ color: "#374151", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                  &quot;Led a 12-person cross-functional team to implement a new CRM workflow, reducing customer resolution time by 38% and increasing quarterly sales by ₹18L.&quot;
                </p>
              </div>
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
            <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", margin: "0 0 12px" }}>Let AI rewrite your resume for your dream job</h2>
            <p style={{ color: "#a7f3d0", margin: "0 0 32px", fontSize: "15px", lineHeight: 1.65 }}>
              Paste the job description and get a fully optimized resume in under 60 seconds. Free.
            </p>
            <Link href="/?tab=resume" style={{ display: "inline-block", background: "#fff", color: "#059669", padding: "15px 36px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", textDecoration: "none" }}>
              Rewrite My Resume Free →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: "#fff", borderTop: "1px solid #e2e8f0", padding: "24px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
          <Link href="/" style={{ color: "#059669", textDecoration: "none", fontWeight: 600 }}>Upgrade Your Resume</Link>
          {" · "}
          <Link href="/blog" style={{ color: "#64748b", textDecoration: "none" }}>Blog</Link>
          {" · "}
          <span>Free AI resume writer, ATS checker &amp; career tools</span>
        </footer>
      </main>
    </>
  );
}

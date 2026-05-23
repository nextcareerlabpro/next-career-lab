import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LinkedIn Profile Optimizer Free — Get Found by Recruiters | Upgrade Your Resume",
  description:
    "Optimize your LinkedIn profile for free with AI. Rewrite your headline and About section to rank higher in recruiter searches and get 40x more profile views.",
  alternates: { canonical: "https://upgradeyourresume.com/linkedin-optimizer" },
  openGraph: {
    title: "LinkedIn Profile Optimizer Free — Rank Higher in Recruiter Searches",
    description:
      "AI rewrites your LinkedIn headline and About section with the right keywords. Get found by more recruiters — free.",
    url: "https://upgradeyourresume.com/linkedin-optimizer",
    type: "website",
    locale: "en_US",
    siteName: "Upgrade Your Resume",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkedIn Profile Optimizer Free",
    description: "AI rewrites your LinkedIn headline and About section to rank higher in recruiter searches.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is the LinkedIn profile optimizer free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Generate an optimized LinkedIn headline and About section for free — no signup required. Just enter your job title and target role.",
      },
    },
    {
      "@type": "Question",
      name: "How does the LinkedIn profile optimizer work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Enter your current job title, target role, and key skills. Our AI generates a keyword-optimized LinkedIn headline and About section using language that matches what recruiters search for on LinkedIn.",
      },
    },
    {
      "@type": "Question",
      name: "What LinkedIn sections should I optimize for recruiters?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The three most important sections for recruiter visibility are: your Headline (220 characters that appear in every search result), your About section (2,600 characters to tell your story), and your Skills section (up to 50 skills that act as ranking keywords).",
      },
    },
    {
      "@type": "Question",
      name: "How can I rank higher in LinkedIn recruiter searches?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LinkedIn's algorithm ranks profiles based on keyword relevance, profile completeness (All-Star status), connection degree, and recent activity. Optimizing your headline and About section with the right keywords is the fastest way to improve your ranking.",
      },
    },
    {
      "@type": "Question",
      name: "What is LinkedIn All-Star profile status?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LinkedIn's All-Star status is the highest profile completeness level. It requires: a profile photo, location, industry, education, current position with description, at least 3 skills, and 50+ connections. All-Star profiles rank significantly higher in recruiter search results.",
      },
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://upgradeyourresume.com" },
    { "@type": "ListItem", position: 2, name: "LinkedIn Profile Optimizer Free", item: "https://upgradeyourresume.com/linkedin-optimizer" },
  ],
};

const otherTools = [
  { href: "/ats-resume-checker", label: "ATS Resume Checker", emoji: "🎯", desc: "Score your resume against any job description" },
  { href: "/ai-resume-writer", label: "AI Resume Writer", emoji: "✍️", desc: "Rewrite your resume for any job in seconds" },
  { href: "/cover-letter-generator", label: "Cover Letter Generator", emoji: "📝", desc: "AI cover letters tailored to each role" },
];

export default function LinkedInOptimizerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main style={{ fontFamily: "Inter, -apple-system, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
        {/* Nav */}
        <nav style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "14px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/" style={{ fontWeight: 700, color: "#059669", textDecoration: "none", fontSize: "16px" }}>Upgrade Your Resume</Link>
          <span style={{ color: "#cbd5e1" }}>›</span>
          <span style={{ color: "#64748b", fontSize: "14px" }}>LinkedIn Profile Optimizer</span>
        </nav>

        {/* Hero */}
        <section style={{ background: "linear-gradient(135deg,#ecfdf5 0%,#f0fdf4 60%,#f8fafc 100%)", padding: "64px 24px 56px", textAlign: "center" }}>
          <div style={{ maxWidth: "740px", margin: "0 auto" }}>
            <div style={{ display: "inline-block", background: "#d1fae5", color: "#059669", borderRadius: "20px", padding: "6px 16px", fontSize: "13px", fontWeight: 600, marginBottom: "20px" }}>
              💼 LinkedIn Optimizer — Free
            </div>
            <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.15, margin: "0 0 20px" }}>
              LinkedIn Profile Optimizer Free
            </h1>
            <p style={{ fontSize: "18px", color: "#475569", lineHeight: 1.7, margin: "0 0 12px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
              Recruiters search LinkedIn every day for candidates like you — but only if your profile has the right keywords. Let AI rewrite your headline and About section to get found.
            </p>
            <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 36px" }}>
              Optimized profiles get 40× more opportunities · Rank higher in recruiter searches
            </p>
            <Link
              href="/?tab=linkedin"
              style={{ display: "inline-block", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", padding: "16px 40px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", textDecoration: "none", boxShadow: "0 4px 20px rgba(5,150,105,0.3)" }}
            >
              Optimize My LinkedIn Free →
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section style={{ background: "#fff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: "28px 24px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "24px", textAlign: "center" }}>
            {[
              { val: "900M+", label: "LinkedIn users worldwide" },
              { val: "40×", label: "More opportunities (All-Star)" },
              { val: "87%", label: "Recruiters use LinkedIn to hire" },
              { val: "36%", label: "Jobs never publicly posted" },
            ].map(({ val, label }) => (
              <div key={label}>
                <p style={{ fontSize: "28px", fontWeight: 800, color: "#059669", margin: "0 0 4px" }}>{val}</p>
                <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What we optimize */}
        <section style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#0f172a", marginBottom: "12px", textAlign: "center" }}>What the LinkedIn Optimizer Rewrites</h2>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: "36px", fontSize: "15px" }}>The sections that determine whether recruiters find you</p>
          <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
            {[
              {
                icon: "🏷️",
                title: "LinkedIn Headline",
                desc: "Your 220-character headline appears in every search result. AI rewrites it to include your role, top skills, and industry keywords — not just your job title.",
              },
              {
                icon: "📖",
                title: "About Section",
                desc: "Your 2,600-character story. AI writes a compelling About section with a strong hook, relevant keywords for your target role, and a clear call to action.",
              },
              {
                icon: "🔑",
                title: "Keyword Strategy",
                desc: "AI identifies the exact keywords recruiters in your industry search for and ensures they appear naturally in your profile.",
              },
              {
                icon: "📋",
                title: "Skills Suggestions",
                desc: "Get a list of the most in-demand skills for your target role to add to your Skills section — the primary ranking factor in LinkedIn search.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "22px" }}>
                <p style={{ fontSize: "26px", margin: "0 0 10px" }}>{icon}</p>
                <h3 style={{ fontWeight: 700, color: "#0f172a", margin: "0 0 8px", fontSize: "15px" }}>{title}</h3>
                <p style={{ color: "#64748b", fontSize: "14px", lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Before/After headline */}
        <section style={{ background: "#fff", padding: "56px 24px" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#0f172a", margin: "0 0 8px", textAlign: "center" }}>Before vs. After LinkedIn Headline</h2>
            <p style={{ textAlign: "center", color: "#64748b", margin: "0 0 36px", fontSize: "15px" }}>Same person — completely different recruiter visibility</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ background: "#fff1f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "20px 24px" }}>
                <p style={{ fontWeight: 700, color: "#dc2626", margin: "0 0 8px", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em" }}>❌ Before — Default Job Title</p>
                <p style={{ color: "#374151", fontSize: "15px", margin: 0, fontStyle: "italic" }}>
                  &quot;Software Engineer at TCS&quot;
                </p>
              </div>
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", padding: "20px 24px" }}>
                <p style={{ fontWeight: 700, color: "#059669", margin: "0 0 8px", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em" }}>✅ After AI Optimization</p>
                <p style={{ color: "#374151", fontSize: "15px", margin: 0, fontStyle: "italic" }}>
                  &quot;Senior Software Engineer | Java & Microservices | Building Scalable Systems | Open to Product & FinTech Roles&quot;
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
            <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#fff", margin: "0 0 12px" }}>Let recruiters find you — not the other way around</h2>
            <p style={{ color: "#a7f3d0", margin: "0 0 32px", fontSize: "15px", lineHeight: 1.65 }}>
              AI-optimized LinkedIn headline and About section in 60 seconds. Free.
            </p>
            <Link href="/?tab=linkedin" style={{ display: "inline-block", background: "#fff", color: "#059669", padding: "15px 36px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", textDecoration: "none" }}>
              Optimize My LinkedIn Free →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: "#fff", borderTop: "1px solid #e2e8f0", padding: "24px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
          <Link href="/" style={{ color: "#059669", textDecoration: "none", fontWeight: 600 }}>Upgrade Your Resume</Link>
          {" · "}
          <Link href="/blog" style={{ color: "#64748b", textDecoration: "none" }}>Blog</Link>
          {" · "}
          <span>Free LinkedIn optimizer, AI resume writer &amp; career tools</span>
        </footer>
      </main>
    </>
  );
}

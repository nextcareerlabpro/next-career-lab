import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { jobRoles, getRoleBySlug, getAllRoleSlugs } from "../../../lib/jobRoles";
import {
  getBreadcrumbSchema,
  getFaqSchema,
  getSoftwareApplicationSchema,
} from "../../../lib/seoSchemas";

interface Props {
  params: Promise<{ role: string }>;
}

export async function generateStaticParams() {
  return getAllRoleSlugs().map((slug) => ({
    role: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role: slug } = await params;
  const role = getRoleBySlug(slug);
  if (!role) {
    return {
      title: "Role Not Found — Upgrade Your Resume",
    };
  }

  const canonicalUrl = `https://upgradeyourresume.com/resume-for/${role.slug}`;

  return {
    title: `${role.title} | Upgrade Your Resume`,
    description: role.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: role.title,
      description: role.metaDescription,
      url: canonicalUrl,
      siteName: "Upgrade Your Resume",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: role.title,
      description: role.metaDescription,
    },
  };
}

export default async function RoleResumePage({ params }: Props) {
  const { role: slug } = await params;
  const role = getRoleBySlug(slug);

  if (!role) {
    notFound();
  }

  const relatedRoles = jobRoles.filter((r) => r.slug !== role.slug).slice(0, 4);

  const breadcrumbData = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Resume by Role", item: "/resume-for" },
    { name: role.roleName, item: `/resume-for/${role.slug}` },
  ]);

  const faqData = getFaqSchema(role.faqs);

  const softwareData = getSoftwareApplicationSchema({
    name: `ATS Resume Checker for ${role.roleName}`,
    url: `https://upgradeyourresume.com/ats-resume-checker?role=${role.slug}`,
    description: `Instant AI ATS Resume scanning for ${role.roleName}. Analyzes ${role.targetKeywords.join(", ")} keyword match rates.`,
  });

  return (
    <>
      {/* Rich Snippets / Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareData) }}
      />

      <main className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Breadcrumb Navigation */}
          <nav className="text-sm text-slate-400 flex items-center space-x-2">
            <Link href="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/resume-for" className="hover:text-blue-400 transition-colors">
              Resume by Role
            </Link>
            <span>/</span>
            <span className="text-blue-400 font-medium">{role.roleName}</span>
          </nav>

          {/* Hero Header */}
          <header className="border-b border-slate-800 pb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <span>{role.category}</span>
              <span>•</span>
              <span>{role.experienceLevel}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              {role.roleName}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                ATS Resume Guide & Keywords
              </span>
            </h1>

            <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
              {role.shortDescription} Recruiters use ATS filters like Workday, Taleo, and Greenhouse to scan for exact keywords. Below is your 2026 checklist to pass automated filters and land interview callbacks.
            </p>

            {/* Salary Insight Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-xl">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Average India Package
                </p>
                <p className="text-xl font-bold text-emerald-400 mt-1">{role.salaryInsight.indiaAvg}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Average Global Package
                </p>
                <p className="text-xl font-bold text-sky-400 mt-1">{role.salaryInsight.globalAvg}</p>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <Link
                href={`/ats-resume-checker?targetRole=${role.slug}`}
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Scan Your {role.roleName} Resume Free →
              </Link>
              <span className="text-xs text-slate-400">⚡ 100% Free instant scan • 30-second report</span>
            </div>
          </header>

          {/* Section 1: Must-Have ATS Keywords */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  1. High-Priority ATS Keywords for {role.roleName}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Include at least 6–8 of these terms naturally across your experience and skills sections.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                  Hard Technical Competencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {role.hardSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs rounded-lg bg-blue-950/60 text-blue-300 border border-blue-800/40 font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-purple-400">
                  ATS Ranking Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {role.targetKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs rounded-lg bg-purple-950/60 text-purple-300 border border-purple-800/40 font-mono"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Bullet Point Transformation (Before vs After) */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                2. Resume Bullet Transformation (ATS Score 40% vs 95%)
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Using the <strong>{role.bulletFormula.formulaName}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bad Example */}
              <div className="p-6 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                  Weak Bullet (Fails ATS Filters)
                </div>
                <blockquote className="p-3 bg-red-950/30 rounded-lg text-slate-300 font-mono text-sm border-l-2 border-red-500">
                  "{role.bulletFormula.badExample}"
                </blockquote>
                <p className="text-xs text-red-300/80 leading-relaxed">
                  <strong>Why it fails:</strong> {role.bulletFormula.badReason}
                </p>
              </div>

              {/* Good Example */}
              <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  Optimized Bullet (Scores 95%+)
                </div>
                <blockquote className="p-3 bg-emerald-950/30 rounded-lg text-slate-200 font-mono text-sm border-l-2 border-emerald-500">
                  "{role.bulletFormula.goodExample}"
                </blockquote>
                <p className="text-xs text-emerald-300/80 leading-relaxed">
                  <strong>Why recruiters love it:</strong> {role.bulletFormula.goodReason}
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Professional Summary Formula */}
          <section className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-white">
              3. Professional Summary Blueprint for {role.roleName}
            </h2>
            <p className="text-sm text-slate-400">Replace bracketed tokens with your specific achievements:</p>

            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/60 font-mono text-xs text-amber-300">
              {role.summaryFormula.template}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Production Ready Example:
              </span>
              <p className="text-sm text-slate-200 bg-slate-800/60 p-4 rounded-xl border border-slate-700/40 italic">
                "{role.summaryFormula.example}"
              </p>
            </div>
          </section>

          {/* Section 4: Power Verbs & Red Flags */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white">High-Impact Power Verbs</h2>
              <p className="text-xs text-slate-400">Start each bullet point with an assertive action verb:</p>
              <div className="flex flex-wrap gap-2">
                {role.actionVerbs.map((verb, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs rounded-lg bg-slate-700/60 text-slate-200 font-medium border border-slate-600/40"
                  >
                    {verb}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white">Top Recruiter Red Flags</h2>
              <ul className="space-y-2 text-xs text-slate-300">
                {role.recruiterRedFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✕</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Banner CTA to ATS Checker */}
          <section className="p-8 rounded-3xl bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/30 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Is Your Resume Ready for Top {role.roleName} Openings?
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Our AI ATS Scanner compares your resume against live job descriptions, detects missing keywords, checks table formatting, and delivers an instant 0–100% score.
            </p>
            <div className="pt-2">
              <Link
                href={`/ats-resume-checker?role=${role.slug}`}
                className="inline-block px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-xl shadow-blue-500/30 transition-all transform hover:-translate-y-0.5"
              >
                Upload & Test Your Resume (Free) →
              </Link>
            </div>
          </section>

          {/* Section 5: Role-Specific FAQs (SEO Rich Snippet) */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {role.faqs.map((faq, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
                  <h3 className="font-semibold text-slate-100 text-base">{faq.question}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Related Job Roles */}
          <section className="border-t border-slate-800 pt-8 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Explore Other Job Roles
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedRoles.map((r) => (
                <Link
                  key={r.slug}
                  href={`/resume-for/${r.slug}`}
                  className="p-3 rounded-xl bg-slate-800/30 border border-slate-800/60 hover:border-blue-500/40 hover:bg-slate-800/60 transition-all text-xs text-slate-300 font-medium block"
                >
                  {r.roleName} Resume →
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

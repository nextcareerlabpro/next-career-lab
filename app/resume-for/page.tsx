import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { jobRoles } from "../../lib/jobRoles";

export const metadata: Metadata = {
  title: "ATS Resume Guides & Keywords by Job Role (2026 Directory) | Upgrade Your Resume",
  description:
    "Browse role-specific ATS resume templates, must-have technical keywords, bullet formulas, and salary insights for 20+ top career fields.",
  alternates: {
    canonical: "https://upgradeyourresume.com/resume-for",
  },
  openGraph: {
    title: "ATS Resume Guides by Job Role (2026 Directory)",
    description:
      "Find your target role. Get exact ATS keywords, recruiter-approved bullet formulas, and instant free ATS score checking.",
    url: "https://upgradeyourresume.com/resume-for",
    siteName: "Upgrade Your Resume",
    type: "website",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://upgradeyourresume.com" },
    { "@type": "ListItem", position: 2, name: "Resume by Role", item: "https://upgradeyourresume.com/resume-for" },
  ],
};

export default function ResumeForDirectoryPage() {
  const categories = Array.from(new Set(jobRoles.map((r) => r.category)));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <header className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              Role-Specific ATS Intelligence Directory
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              ATS Resume Guides by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                Job Role
              </span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed">
              Every job category uses different filtering criteria in Applicant Tracking Systems. Select your target profession below to access vetted keywords, bullet formulas, and instant score checking.
            </p>
          </header>

          {/* Directory by Category */}
          <div className="space-y-10">
            {categories.map((cat) => {
              const rolesInCat = jobRoles.filter((r) => r.category === cat);
              return (
                <section key={cat} className="space-y-4">
                  <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-2 flex items-center justify-between">
                    <span>{cat}</span>
                    <span className="text-xs text-slate-500 font-normal">{rolesInCat.length} Roles</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rolesInCat.map((role) => (
                      <Link
                        key={role.slug}
                        href={`/resume-for/${role.slug}`}
                        className="group p-5 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/70 transition-all duration-200 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <span className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
                            {role.experienceLevel}
                          </span>
                          <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
                            {role.roleName}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2">
                            {role.shortDescription}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-800/60 mt-4 flex items-center justify-between text-xs text-slate-400">
                          <span className="text-emerald-400 font-medium">{role.salaryInsight.indiaAvg}</span>
                          <span className="text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                            View Guide →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <section className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">Don't see your specific job title?</h2>
            <p className="text-slate-300 text-sm max-w-lg mx-auto">
              You can still scan any resume against custom job descriptions with our free AI ATS Resume Checker.
            </p>
            <div>
              <Link
                href="/ats-resume-checker"
                className="inline-block px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all"
              >
                Scan Any Resume with AI Checker →
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

import Link from "next/link";
import { blogPosts } from "../../lib/blogPosts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career & Resume Tips Blog | UpgradeYourResume",
  description: "Expert guides on resume writing, ATS optimization, cover letters, and LinkedIn to help you land your next job faster.",
  alternates: { canonical: "https://upgradeyourresume.com/blog" },
  openGraph: {
    title: "Career & Resume Tips Blog | UpgradeYourResume",
    description: "Expert guides on resume writing, ATS optimization, cover letters, and LinkedIn.",
    url: "https://upgradeyourresume.com/blog",
    type: "website",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  "ATS Tips": "bg-blue-100 text-blue-700",
  "Resume Tips": "bg-green-100 text-green-700",
  "Cover Letter": "bg-purple-100 text-purple-700",
  "LinkedIn": "bg-sky-100 text-sky-700",
};

export default function BlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 text-sm text-gray-500 hover:text-gray-700">
            ← Back to App
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Career & Resume Tips</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Practical guides to get your resume past ATS, impress recruiters, and land more interviews.
          </p>
        </div>
      </div>

      {/* Post grid */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {sorted.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-600"}`}>
                  {post.category}
                </span>
                <span className="text-xs text-gray-400">{post.readTime} min read</span>
              </div>
              <h2 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                {post.title}
              </h2>
              <p className="text-sm text-gray-500 line-clamp-2">{post.description}</p>
              <div className="mt-4 text-xs text-gray-400">
                {new Date(post.publishDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </Link>
          ))}
        </div>

        {/* CTA banner */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-xl font-bold mb-2">Ready to put this into action?</h2>
          <p className="text-blue-100 mb-5 text-sm">Check your ATS score, analyze a job description, and get AI-powered suggestions — free.</p>
          <Link
            href="/"
            className="inline-block bg-white text-blue-700 font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Try UpgradeYourResume Free →
          </Link>
        </div>
      </div>
    </main>
  );
}

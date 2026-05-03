import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts, getPostBySlug } from "../../../lib/blogPosts";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = `https://upgradeyourresume.com/blog/${post.slug}`;
  return {
    title: `${post.title} | UpgradeYourResume Blog`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.publishDate,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  "ATS Tips": "bg-blue-100 text-blue-700",
  "Resume Tips": "bg-green-100 text-green-700",
  "Cover Letter": "bg-purple-100 text-purple-700",
  "LinkedIn": "bg-sky-100 text-sky-700",
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishDate,
    author: { "@type": "Organization", name: "UpgradeYourResume" },
    publisher: {
      "@type": "Organization",
      name: "UpgradeYourResume",
      url: "https://upgradeyourresume.com",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://upgradeyourresume.com/blog/${post.slug}` },
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Top nav */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/blog" className="text-sm text-gray-500 hover:text-gray-700">
            ← Blog
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            UpgradeYourResume
          </Link>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-4 py-10">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-600"}`}>
            {post.category}
          </span>
          <span className="text-xs text-gray-400">{post.readTime} min read</span>
          <span className="text-xs text-gray-400">
            {new Date(post.publishDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
        <p className="text-lg text-gray-500 mb-8 leading-relaxed">{post.description}</p>

        {/* Content sections */}
        <div className="prose prose-gray max-w-none">
          {post.sections.map((section, i) => (
            <div key={i} className="mb-7">
              {section.heading && (
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{section.heading}</h2>
              )}
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {section.bullets.map((bullet, j) => (
                    <li key={j} className="flex gap-2 text-gray-600">
                      <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-7 text-white text-center">
          <h2 className="text-lg font-bold mb-2">Ready to apply this?</h2>
          <p className="text-blue-100 text-sm mb-5">
            Use our free AI resume tools to check your ATS score, analyze job descriptions, and get personalized suggestions.
          </p>
          <a
            href={post.cta.href}
            className="inline-block bg-white text-blue-700 font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            {post.cta.text}
          </a>
        </div>

        {/* Related posts */}
        <RelatedPosts currentSlug={post.slug} currentCategory={post.category} />
      </article>
    </main>
  );
}

function RelatedPosts({ currentSlug, currentCategory }: { currentSlug: string; currentCategory: string }) {
  const related = blogPosts
    .filter((p) => p.slug !== currentSlug && p.category === currentCategory)
    .slice(0, 2);

  const others = related.length < 2
    ? blogPosts.filter((p) => p.slug !== currentSlug && p.category !== currentCategory).slice(0, 2 - related.length)
    : [];

  const posts = [...related, ...others].slice(0, 2);
  if (posts.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-base font-semibold text-gray-900 mb-4">More Articles</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <span className="text-xs text-blue-600 font-medium">{p.category}</span>
            <p className="mt-1 text-sm font-medium text-gray-900 group-hover:text-blue-600 leading-snug">{p.title}</p>
            <p className="mt-1 text-xs text-gray-400">{p.readTime} min read</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

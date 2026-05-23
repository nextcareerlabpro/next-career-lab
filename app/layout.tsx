import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ── TASK 2: Fixed metadata — locale en_US, keywords field removed ─────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://upgradeyourresume.com"),
  title: "Upgrade Your Resume — Free ATS Resume Analyzer & AI Career Tools",
  description:
    "Check your ATS score for free. AI Resume Writer, Cover Letter Generator, LinkedIn Optimizer and Job Description Analyzer. Get hired faster with AI-powered career tools.",
  authors: [{ name: "Upgrade Your Resume" }],
  openGraph: {
    title: "Upgrade Your Resume — Free ATS Resume Analyzer & AI Career Tools",
    description:
      "Check your ATS score for free. AI Resume Writer, Cover Letter Generator, LinkedIn Optimizer. Get hired faster.",
    url: "https://upgradeyourresume.com",
    siteName: "Upgrade Your Resume",
    type: "website",
    locale: "en_US", // Fixed from en_IN
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upgrade Your Resume — Free ATS Resume Analyzer & AI Career Tools",
    description:
      "Check your ATS score for free. AI Resume Writer, Cover Letter Generator, LinkedIn Optimizer. Get hired faster.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://upgradeyourresume.com",
  },
  verification: {
    google: "c45870402680d6b9",
  },
};

// ── TASK 1: JSON-LD Schema objects ─────────────────────────────────────────────

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Upgrade Your Resume",
  url: "https://upgradeyourresume.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://upgradeyourresume.com/?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Upgrade Your Resume",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://upgradeyourresume.com",
  description:
    "Free ATS resume analyzer, AI resume writer, cover letter generator, LinkedIn optimizer and job description analyzer.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "500",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is the ATS resume checker free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Upload your resume and paste a job description to get your ATS match score instantly — no signup required for your first scan.",
      },
    },
    {
      "@type": "Question",
      name: "How does the AI resume writer work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our AI analyzes your existing resume and the target job description, then rewrites your resume to include missing keywords and improve ATS compatibility.",
      },
    },
    {
      "@type": "Question",
      name: "Can AI write my cover letter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Paste the job description and your resume, and get a personalized, recruiter-ready cover letter in seconds.",
      },
    },
    {
      "@type": "Question",
      name: "How does the LinkedIn Profile Optimizer help?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our LinkedIn Optimizer rewrites your headline and About section using AI to include the right keywords for your target role, helping you rank higher in recruiter searches.",
      },
    },
    {
      "@type": "Question",
      name: "What is a Job Description Analyzer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The JD Analyzer extracts key skills, responsibilities, and requirements from any job posting so you know exactly what keywords to include in your resume.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* ── TASK 1: JSON-LD structured data ── */}
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
        `}
      </Script>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

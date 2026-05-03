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

export const metadata: Metadata = {
  metadataBase: new URL("https://upgradeyourresume.com"),
  title: "Upgrade Your Resume — Free ATS Resume Analyzer & AI Career Tools",
  description: "Check your ATS score for free. AI Resume Writer, Cover Letter Generator, LinkedIn Optimizer and Job Description Analyzer. Get hired faster with AI-powered career tools.",
  keywords: "ATS resume analyzer, resume score checker, AI resume writer, cover letter generator, LinkedIn optimizer, job description analyzer, free resume checker, ATS score",
  authors: [{ name: "Upgrade Your Resume" }],
  openGraph: {
    title: "Upgrade Your Resume — Free ATS Resume Analyzer & AI Career Tools",
    description: "Check your ATS score for free. AI Resume Writer, Cover Letter Generator, LinkedIn Optimizer. Get hired faster.",
    url: "https://upgradeyourresume.com",
    siteName: "Upgrade Your Resume",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Upgrade Your Resume — Free ATS Resume Analyzer & AI Career Tools",
    description: "Check your ATS score for free. AI Resume Writer, Cover Letter Generator, LinkedIn Optimizer. Get hired faster.",
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

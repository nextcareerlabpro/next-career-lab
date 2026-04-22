import { NextResponse } from "next/server";

function cleanWords(text: string) {
  const stopWords = new Set([
    "the","and","for","with","you","your","are","this","that","from","have",
    "has","had","was","were","will","shall","can","could","would","should",
    "job","role","work","team","using","use","our","their","them","into",
    "a","an","of","to","in","on","at","by","or","as","is","be","it",
    "looking","need","needs","required","require","developer","developers",
    "engineer","engineers","experience","years","year","strong","good",
    "must","plus","preferred","knowledge","skills","skill"
  ]);

  return text
    .toLowerCase()
    .replace(/next\.js/g, "nextjs")
    .replace(/react\.js/g, "react")
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}

export async function POST(req: Request) {
  try {
    const { resume, job } = await req.json();

    const resumeWords = [...new Set(cleanWords(resume))];
    const jobWords = [...new Set(cleanWords(job))];

    const matched = jobWords.filter((word) => resumeWords.includes(word));
    const missing = jobWords.filter((word) => !resumeWords.includes(word));

    const score = Math.min(
      100,
      Math.round((matched.length / Math.max(jobWords.length, 1)) * 100)
    );

    return NextResponse.json({
      score,
      matched: matched.slice(0, 15),
      missing: missing.slice(0, 15),
      suggestions: [
        "Add measurable achievements.",
        "Include relevant technical skills.",
        "Tailor resume to the job description.",
        "Improve project impact statements."
      ],
    });
  } catch {
    return NextResponse.json({
      score: 0,
      matched: [],
      missing: [],
      suggestions: [
        "Add measurable achievements.",
        "Include relevant technical skills.",
        "Tailor resume to the job description.",
        "Improve project impact statements."
      ],
    });
  }
}
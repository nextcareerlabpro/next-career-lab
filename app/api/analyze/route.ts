import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

function cleanWords(text: string = "") {
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
  // Verify Firebase auth token
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Check scan limit in Firestore (server-side, cannot be bypassed)
  const userSnap = await adminDb.collection("users").where("uid", "==", uid).limit(1).get();
  if (!userSnap.empty) {
    const userData = userSnap.docs[0].data();
    const currentMonth = new Date().toISOString().slice(0, 7);
    if (userData.monthYear !== currentMonth) {
      await userSnap.docs[0].ref.update({ scansUsed: 0, monthYear: currentMonth });
    } else if (userData.plan !== "pro" && (userData.scansUsed || 0) >= 3) {
      return NextResponse.json({ error: "Scan limit reached. Upgrade to Pro." }, { status: 403 });
    }
  }

  try {
    const body = await req.json();

    const resume = body.resume || "";
    const job = body.job || body.jobDescription || body.jd || "";

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
        "Improve project impact statements.",
      ],
    });
  } catch {
    return NextResponse.json({
      score: 0,
      matched: [],
      missing: [],
      suggestions: [
        "Unable to analyze now.",
        "Check resume/job description input.",
        "Try again in a moment.",
      ],
    });
  }
}

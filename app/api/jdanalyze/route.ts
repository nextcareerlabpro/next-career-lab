import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    uid = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Read isPro from Firestore — never trust the client value
  let isPro = false;
  const userSnap = await adminDb.collection("users").where("uid", "==", uid).limit(1).get();
  if (!userSnap.empty) {
    const userData = userSnap.docs[0].data();
    isPro =
      (userData.plan === "pro" && (!userData.proExpiry || new Date(userData.proExpiry) >= new Date())) ||
      userData.firstSessionActive === true;
  }

  try {
    const { resume, jdText } = await req.json();
    if (!resume?.trim() || !jdText?.trim()) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: `You are an expert career coach and ATS specialist. Analyze this job description against the candidate's resume and return ONLY a valid JSON object with no explanation, no markdown, no backticks.

Return exactly this JSON structure:
{
  "matchScore": 75,
  "jobTitle": "extracted job title from JD",
  "company": "company name if mentioned",
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "presentKeywords": ["keyword1", "keyword2"],
  "skillGaps": ["gap1", "gap2"],
  "suggestions": ["specific suggestion 1", "specific suggestion 2", "specific suggestion 3"],
  "resumeTweaks": ["specific line to add/change 1", "specific line to add/change 2"],
  "sectionFeedback": {
    "summary": "feedback on summary section",
    "experience": "feedback on experience section",
    "skills": "feedback on skills section"
  },
  "overallVerdict": "one sentence overall assessment"
}

Job Description:
${jdText.substring(0, 3000)}

Resume:
${resume.substring(0, 3000)}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    let parsed: any = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }

    if (!isPro) {
      return NextResponse.json({
        matchScore: parsed.matchScore,
        jobTitle: parsed.jobTitle,
        company: parsed.company,
        missingKeywords: (parsed.missingKeywords || []).slice(0, 2),
        presentKeywords: (parsed.presentKeywords || []).slice(0, 2),
        skillGaps: [],
        suggestions: (parsed.suggestions || []).slice(0, 1),
        resumeTweaks: [],
        sectionFeedback: {},
        overallVerdict: parsed.overallVerdict,
        isProLocked: true,
      });
    }
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("JD Analyze error:", err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

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

  // Check user plan from Firestore — never trust client-side isPro
  let isPro = false;
  try {
    const userSnap = await adminDb.collection("users").where("uid", "==", uid).limit(1).get();
    if (!userSnap.empty) {
      const d = userSnap.docs[0].data();
      isPro =
        (d.plan === "pro" && (!d.proExpiry || new Date(d.proExpiry) >= new Date())) ||
        d.firstSessionActive === true;
    }
  } catch { /* if Firestore check fails, default to requiresUpgrade */ }

  try {
    const body = await req.json();
    const prompt = body.prompt || "";
    if (!prompt.trim()) {
      return NextResponse.json({ output: "No prompt received.", requiresUpgrade: false });
    }
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.GROQ_API_KEY,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 6000,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      const groqError = data?.error?.message || `Groq error ${response.status}`;
      console.error("Groq API error:", groqError);
      return NextResponse.json({ error: groqError }, { status: 502 });
    }
    const output = data?.choices?.[0]?.message?.content || "No response.";
    return NextResponse.json({ output, requiresUpgrade: !isPro });
  } catch (e: any) {
    console.error("AI route error:", e?.message);
    return NextResponse.json({ error: "AI request failed. Try again." }, { status: 500 });
  }
}

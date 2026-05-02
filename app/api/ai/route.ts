import { NextResponse } from "next/server";

async function verifyFirebaseToken(idToken: string): Promise<boolean> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken }) }
    );
    if (!res.ok) return false;
    const data = await res.json();
    return !!data?.users?.[0]?.localId;
  } catch { return false; }
}

export async function POST(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const valid = await verifyFirebaseToken(token);
  if (!valid) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  try {
    const body = await req.json();
    const prompt = body.prompt || "";
    if (!prompt.trim()) {
      return NextResponse.json({ output: "No prompt received." });
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
        max_tokens: 8000,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      const groqError = data?.error?.message || `Groq error ${response.status}`;
      return NextResponse.json({ output: `GROQ_ERROR: ${groqError}` }, { status: 502 });
    }
    const output = data?.choices?.[0]?.message?.content || "No response.";
    return NextResponse.json({ output });
  } catch {
    return NextResponse.json({ output: "AI request failed. Try again." });
  }
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
      }),
    });
    const data = await response.json();
    const output = data?.choices?.[0]?.message?.content || "No response.";
    return NextResponse.json({ output });
  } catch (error) {
    return NextResponse.json({ output: "AI request failed. Try again." });
  }
}
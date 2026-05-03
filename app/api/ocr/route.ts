import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await adminAuth.verifyIdToken(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    const { base64, mimeType } = await req.json();
    if (!base64) return NextResponse.json({ error: "No image data" }, { status: 400 });

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: `data:${mimeType || "image/jpeg"};base64,${base64}` },
              },
              {
                type: "text",
                text: "This is a photo of a resume. Extract ALL text exactly as it appears — preserve names, dates, company names, job titles, bullet points, education, skills, and contact details. Return only the extracted resume text, nothing else.",
              },
            ],
          },
        ],
        max_tokens: 4000,
        temperature: 0.1,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      const errMsg = data?.error?.message || `Groq vision error ${res.status}`;
      console.error("OCR error:", errMsg);
      return NextResponse.json({ error: errMsg }, { status: 502 });
    }

    const text = data.choices?.[0]?.message?.content || "";
    return NextResponse.json({ text });
  } catch (err: any) {
    console.error("OCR route error:", err?.message);
    return NextResponse.json({ error: "OCR failed. Try again." }, { status: 500 });
  }
}

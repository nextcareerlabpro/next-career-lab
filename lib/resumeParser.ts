// lib/resumeParser.ts
// Groq AI powered resume parser + enhancer

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  summary: string;
  skills: string;
  exp1Title: string; exp1Company: string; exp1Duration: string; exp1Points: string;
  exp2Title: string; exp2Company: string; exp2Duration: string; exp2Points: string;
  exp3Title: string; exp3Company: string; exp3Duration: string; exp3Points: string;
  exp4Title: string; exp4Company: string; exp4Duration: string; exp4Points: string;
  exp5Title: string; exp5Company: string; exp5Duration: string; exp5Points: string;
  exp6Title: string; exp6Company: string; exp6Duration: string; exp6Points: string;
  exp7Title: string; exp7Company: string; exp7Duration: string; exp7Points: string;
  edu1Degree: string; edu1School: string; edu1Year: string;
  edu2Degree: string; edu2School: string; edu2Year: string;
  certifications: string;
  languages: string;
  aiImprovements: string;
  totalJobsFound: number;
}

export const emptyResumeData: ResumeData = {
  name: "", email: "", phone: "", location: "",
  role: "", summary: "", skills: "",
  exp1Title: "", exp1Company: "", exp1Duration: "", exp1Points: "",
  exp2Title: "", exp2Company: "", exp2Duration: "", exp2Points: "",
  exp3Title: "", exp3Company: "", exp3Duration: "", exp3Points: "",
  exp4Title: "", exp4Company: "", exp4Duration: "", exp4Points: "",
  exp5Title: "", exp5Company: "", exp5Duration: "", exp5Points: "",
  exp6Title: "", exp6Company: "", exp6Duration: "", exp6Points: "",
  exp7Title: "", exp7Company: "", exp7Duration: "", exp7Points: "",
  edu1Degree: "", edu1School: "", edu1Year: "",
  edu2Degree: "", edu2School: "", edu2Year: "",
  certifications: "", languages: "",
  aiImprovements: "", totalJobsFound: 0,
};

export async function parseAndEnhanceResume(resumeText: string, token: string): Promise<ResumeData> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      prompt: `You are a professional resume writer and ATS expert with 20 years of experience.
Analyze this resume and return ONLY a valid JSON object.

RULES — follow strictly:
1. Include EVERY job from the resume. Do not skip, merge, or summarize any position.
2. Include ALL bullet points from each job — rewrite each one to be achievement-focused with metrics/numbers where the original data supports it. Do NOT reduce the count.
3. Do NOT invent data. Only improve phrasing. Dates, companies, degrees must stay exactly as in the original.
4. Extract ALL skills mentioned anywhere in the resume.
5. Summary: write a strong 3-4 sentence ATS-optimized professional summary.

Return ONLY this JSON (no markdown, no backticks, no explanation):
{
  "name": "full name",
  "email": "email",
  "phone": "phone",
  "location": "city, country",
  "role": "most recent job title",
  "summary": "3-4 sentence ATS-optimized professional summary",
  "skills": "ALL skills from resume, comma separated, properly capitalized",
  "exp1Title": "most recent job title",
  "exp1Company": "company name",
  "exp1Duration": "e.g. Oct 2014 – Present",
  "exp1Points": "ALL bullet points from this job, each rewritten for ATS, separated by |",
  "exp2Title": "2nd job title or empty",
  "exp2Company": "company or empty",
  "exp2Duration": "duration or empty",
  "exp2Points": "ALL bullet points from this job separated by | or empty",
  "exp3Title": "3rd job title or empty",
  "exp3Company": "company or empty",
  "exp3Duration": "duration or empty",
  "exp3Points": "ALL bullet points from this job separated by | or empty",
  "exp4Title": "4th job title or empty",
  "exp4Company": "company or empty",
  "exp4Duration": "duration or empty",
  "exp4Points": "ALL bullet points from this job separated by | or empty",
  "exp5Title": "5th job title or empty",
  "exp5Company": "company or empty",
  "exp5Duration": "duration or empty",
  "exp5Points": "ALL bullet points from this job separated by | or empty",
  "exp6Title": "6th job title or empty",
  "exp6Company": "company or empty",
  "exp6Duration": "duration or empty",
  "exp6Points": "ALL bullet points from this job separated by | or empty",
  "exp7Title": "7th job title or empty",
  "exp7Company": "company or empty",
  "exp7Duration": "duration or empty",
  "exp7Points": "ALL bullet points from this job separated by | or empty",
  "edu1Degree": "highest degree",
  "edu1School": "university/college",
  "edu1Year": "year",
  "edu2Degree": "second degree if any, else empty",
  "edu2School": "school or empty",
  "edu2Year": "year or empty",
  "certifications": "comma separated certifications or empty",
  "languages": "comma separated languages or empty",
  "aiImprovements": "one line: what was improved e.g. Summary rewritten | Bullets made achievement-focused | Skills expanded",
  "totalJobsFound": 0
}

Resume text:
${resumeText}`
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `API error ${res.status}`);
  }

  const data = await res.json();
  if (!data.output || data.output === "No response." || data.output === "AI request failed. Try again.") {
    throw new Error("AI returned no response — check GROQ_API_KEY in .env.local");
  }
  if ((data.output as string).startsWith("GROQ_ERROR:")) {
    throw new Error(data.output);
  }

  let parsed: any = {};

  try {
    parsed = JSON.parse(data.output);
  } catch {
    const match = (data.output as string).match(/\{[\s\S]*\}/);
    if (match) {
      try { parsed = JSON.parse(match[0]); } catch { parsed = {}; }
    }
  }

  return {
    name: parsed.name || "",
    email: parsed.email || "",
    phone: parsed.phone || "",
    location: parsed.location || "",
    role: parsed.role || "",
    summary: parsed.summary || "",
    skills: parsed.skills || "",
    exp1Title: parsed.exp1Title || "", exp1Company: parsed.exp1Company || "", exp1Duration: parsed.exp1Duration || "", exp1Points: parsed.exp1Points || "",
    exp2Title: parsed.exp2Title || "", exp2Company: parsed.exp2Company || "", exp2Duration: parsed.exp2Duration || "", exp2Points: parsed.exp2Points || "",
    exp3Title: parsed.exp3Title || "", exp3Company: parsed.exp3Company || "", exp3Duration: parsed.exp3Duration || "", exp3Points: parsed.exp3Points || "",
    exp4Title: parsed.exp4Title || "", exp4Company: parsed.exp4Company || "", exp4Duration: parsed.exp4Duration || "", exp4Points: parsed.exp4Points || "",
    exp5Title: parsed.exp5Title || "", exp5Company: parsed.exp5Company || "", exp5Duration: parsed.exp5Duration || "", exp5Points: parsed.exp5Points || "",
    exp6Title: parsed.exp6Title || "", exp6Company: parsed.exp6Company || "", exp6Duration: parsed.exp6Duration || "", exp6Points: parsed.exp6Points || "",
    exp7Title: parsed.exp7Title || "", exp7Company: parsed.exp7Company || "", exp7Duration: parsed.exp7Duration || "", exp7Points: parsed.exp7Points || "",
    edu1Degree: parsed.edu1Degree || "", edu1School: parsed.edu1School || "", edu1Year: parsed.edu1Year || "",
    edu2Degree: parsed.edu2Degree || "", edu2School: parsed.edu2School || "", edu2Year: parsed.edu2Year || "",
    certifications: parsed.certifications || "",
    languages: parsed.languages || "",
    aiImprovements: parsed.aiImprovements || "",
    totalJobsFound: Number(parsed.totalJobsFound) || 0,
  };
}

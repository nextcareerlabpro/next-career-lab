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
  exp1Title: string;
  exp1Company: string;
  exp1Duration: string;
  exp1Points: string;
  exp2Title: string;
  exp2Company: string;
  exp2Duration: string;
  exp2Points: string;
  exp3Title: string;
  exp3Company: string;
  exp3Duration: string;
  exp3Points: string;
  additionalExp: string;
  edu1Degree: string;
  edu1School: string;
  edu1Year: string;
  edu2Degree: string;
  edu2School: string;
  edu2Year: string;
  certifications: string;
  languages: string;
  aiImprovements: string;
  totalJobsFound: number;
  selectedJobs: string;
}

export const emptyResumeData: ResumeData = {
  name: "", email: "", phone: "", location: "",
  role: "", summary: "", skills: "",
  exp1Title: "", exp1Company: "", exp1Duration: "", exp1Points: "",
  exp2Title: "", exp2Company: "", exp2Duration: "", exp2Points: "",
  exp3Title: "", exp3Company: "", exp3Duration: "", exp3Points: "",
  additionalExp: "",
  edu1Degree: "", edu1School: "", edu1Year: "",
  edu2Degree: "", edu2School: "", edu2Year: "",
  certifications: "", languages: "",
  aiImprovements: "", totalJobsFound: 0, selectedJobs: "",
};

export async function parseAndEnhanceResume(resumeText: string): Promise<ResumeData> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: `You are a professional resume writer and career coach with 20 years of experience. 
Analyze this resume carefully and return ONLY a valid JSON object.

Your tasks:
1. EXTRACT all data accurately
2. ENHANCE content professionally:
   - Summary: Write powerful 2-3 sentence recruiter-optimized summary with strong action words
   - Bullet points: Convert responsibilities to achievement-focused bullets with metrics/numbers where possible
   - Skills: Clean up, capitalize properly, add relevant technical keywords from their experience
3. SELECT top 3 most recent AND relevant jobs for main display
4. SUMMARIZE remaining jobs in additionalExp as one line each
5. Note exactly what you improved in aiImprovements field

Return ONLY this JSON, no explanation, no markdown, no backticks:
{
  "name": "full name",
  "email": "email address",
  "phone": "phone number",
  "location": "city, country",
  "role": "most recent job title, properly formatted",
  "summary": "powerful 2-3 sentence professional summary, recruiter-optimized with keywords",
  "skills": "top 14 skills, comma separated, properly capitalized",
  "exp1Title": "most recent job title",
  "exp1Company": "most recent company",
  "exp1Duration": "e.g. Jan 2022 – Present",
  "exp1Points": "3 strong achievement bullets separated by | with metrics",
  "exp2Title": "2nd most recent job title",
  "exp2Company": "2nd company",
  "exp2Duration": "duration",
  "exp2Points": "3 achievement bullets separated by |",
  "exp3Title": "3rd most recent job title",
  "exp3Company": "3rd company",
  "exp3Duration": "duration",
  "exp3Points": "2-3 achievement bullets separated by |",
  "additionalExp": "Earlier: CompanyA (Role, Year) | CompanyB (Role, Year) — format for any remaining jobs",
  "edu1Degree": "highest degree",
  "edu1School": "university/college",
  "edu1Year": "year",
  "edu2Degree": "second degree if any, else empty",
  "edu2School": "school name or empty",
  "edu2Year": "year or empty",
  "certifications": "comma separated certifications, or empty",
  "languages": "comma separated languages known, or empty",
  "aiImprovements": "Brief note: what AI improved e.g. Summary rewritten | Skills expanded from 11 to 17 | Bullets converted to achievements with metrics | Top 3 of 6 jobs selected",
  "totalJobsFound": 6,
  "selectedJobs": "CIK Telecom, Navigant Technologies, Mahindra Satyam"
}

Resume text:
${resumeText.substring(0, 12000)}`
    }),
  });

  const data = await res.json();
  let parsed: any = {};

  try {
    parsed = JSON.parse(data.output);
  } catch {
    const match = data.output.match(/\{[\s\S]*\}/);
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
    exp1Title: parsed.exp1Title || "",
    exp1Company: parsed.exp1Company || "",
    exp1Duration: parsed.exp1Duration || "",
    exp1Points: parsed.exp1Points || "",
    exp2Title: parsed.exp2Title || "",
    exp2Company: parsed.exp2Company || "",
    exp2Duration: parsed.exp2Duration || "",
    exp2Points: parsed.exp2Points || "",
    exp3Title: parsed.exp3Title || "",
    exp3Company: parsed.exp3Company || "",
    exp3Duration: parsed.exp3Duration || "",
    exp3Points: parsed.exp3Points || "",
    additionalExp: parsed.additionalExp || "",
    edu1Degree: parsed.edu1Degree || "",
    edu1School: parsed.edu1School || "",
    edu1Year: parsed.edu1Year || "",
    edu2Degree: parsed.edu2Degree || "",
    edu2School: parsed.edu2School || "",
    edu2Year: parsed.edu2Year || "",
    certifications: parsed.certifications || "",
    languages: parsed.languages || "",
    aiImprovements: parsed.aiImprovements || "",
    totalJobsFound: Number(parsed.totalJobsFound) || 0,
    selectedJobs: parsed.selectedJobs || "",
  };
}

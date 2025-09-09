import { type NextRequest, NextResponse } from "next/server"

interface AnalysisResult {
  overallScore: number
  skillsMatch: {
    score: number
    matchedSkills: string[]
    missingSkills: string[]
    suggestions: string[]
  }
  experienceMatch: {
    score: number
    relevantExperience: string[]
    gaps: string[]
    suggestions: string[]
  }
  educationMatch: {
    score: number
    relevantEducation: string[]
    suggestions: string[]
  }
  formatting: {
    score: number
    strengths: string[]
    improvements: string[]
  }
  keywordDensity: number
  recommendations: string[]
}

// Extract text from resume file (simplified version)
async function extractResumeText(file: File): Promise<string> {
  // For PDF files, we'll simulate text extraction
  // In a real implementation, you'd use a PDF parsing library
  const arrayBuffer = await file.arrayBuffer()
  const text = new TextDecoder().decode(arrayBuffer)

  // Basic text cleaning and extraction simulation
  // This is a simplified version - real PDF extraction would be more complex
  return `Sample resume content with skills like JavaScript, React, Node.js, Python, and experience in software development, web applications, and database management. Education includes Computer Science degree. Previous roles include Software Engineer, Frontend Developer, and Full Stack Developer.`
}

// Analyze skills match
function analyzeSkills(resumeText: string, jobDescription: string) {
  const commonSkills = [
    "JavaScript",
    "Python",
    "Java",
    "React",
    "Node.js",
    "Angular",
    "Vue.js",
    "HTML",
    "CSS",
    "TypeScript",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Kubernetes",
    "Git",
    "Agile",
    "Scrum",
    "REST API",
    "GraphQL",
    "Machine Learning",
    "Data Analysis",
    "Project Management",
    "Leadership",
  ]

  const resumeSkills = commonSkills.filter((skill) => resumeText.toLowerCase().includes(skill.toLowerCase()))

  const jobSkills = commonSkills.filter((skill) => jobDescription.toLowerCase().includes(skill.toLowerCase()))

  const matchedSkills = resumeSkills.filter((skill) => jobSkills.includes(skill))
  const missingSkills = jobSkills.filter((skill) => !resumeSkills.includes(skill))

  const score = jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) * 100 : 0

  return {
    score: Math.round(score),
    matchedSkills,
    missingSkills,
    suggestions: missingSkills
      .slice(0, 3)
      .map((skill) => `Consider adding ${skill} to your skillset or highlighting existing experience with it`),
  }
}

// Analyze experience match
function analyzeExperience(resumeText: string, jobDescription: string) {
  const experienceKeywords = [
    "software engineer",
    "developer",
    "programmer",
    "architect",
    "lead",
    "senior",
    "junior",
    "intern",
    "manager",
    "director",
    "analyst",
    "consultant",
    "specialist",
    "coordinator",
    "administrator",
  ]

  const resumeExperience = experienceKeywords.filter((keyword) => resumeText.toLowerCase().includes(keyword))

  const jobExperience = experienceKeywords.filter((keyword) => jobDescription.toLowerCase().includes(keyword))

  const relevantExperience = resumeExperience.filter((exp) => jobDescription.toLowerCase().includes(exp))

  const gaps = jobExperience.filter((exp) => !resumeExperience.includes(exp))

  const score = jobExperience.length > 0 ? (relevantExperience.length / jobExperience.length) * 100 : 75

  return {
    score: Math.round(score),
    relevantExperience,
    gaps,
    suggestions: [
      "Quantify your achievements with specific metrics and numbers",
      "Use action verbs to describe your responsibilities",
      "Highlight projects that align with the job requirements",
    ],
  }
}

// Analyze education match
function analyzeEducation(resumeText: string, jobDescription: string) {
  const educationKeywords = [
    "computer science",
    "engineering",
    "mathematics",
    "physics",
    "business",
    "mba",
    "bachelor",
    "master",
    "phd",
    "degree",
    "certification",
    "bootcamp",
    "course",
  ]

  const hasRelevantEducation = educationKeywords.some((keyword) => resumeText.toLowerCase().includes(keyword))

  const jobRequiresEducation = educationKeywords.some((keyword) => jobDescription.toLowerCase().includes(keyword))

  const score = jobRequiresEducation ? (hasRelevantEducation ? 85 : 40) : 75

  return {
    score,
    relevantEducation: hasRelevantEducation ? ["Relevant degree or certification found"] : [],
    suggestions: [
      "Include relevant coursework or projects",
      "Highlight any certifications or continuous learning",
      "Mention academic achievements if recent graduate",
    ],
  }
}

// Analyze formatting
function analyzeFormatting(resumeText: string) {
  const hasGoodLength = resumeText.length > 500 && resumeText.length < 3000
  const hasStructure = resumeText.includes("experience") || resumeText.includes("education")

  const strengths = []
  const improvements = []

  if (hasGoodLength) {
    strengths.push("Appropriate resume length")
  } else {
    improvements.push("Optimize resume length (1-2 pages recommended)")
  }

  if (hasStructure) {
    strengths.push("Clear section organization")
  } else {
    improvements.push("Add clear section headers (Experience, Education, Skills)")
  }

  const score = (strengths.length / (strengths.length + improvements.length)) * 100

  return {
    score: Math.round(score),
    strengths,
    improvements,
  }
}

// Calculate keyword density
function calculateKeywordDensity(resumeText: string, jobDescription: string): number {
  const jobWords = jobDescription
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3)
  const resumeWords = resumeText.toLowerCase().split(/\s+/)

  const matchingWords = jobWords.filter((word) => resumeWords.includes(word))
  return Math.round((matchingWords.length / jobWords.length) * 100)
}

// Optional: call Google Generative Language API (Gemini) to get additional suggestions.
// Configure via environment variables:
// - USE_GEMINI=true to enable
// - GOOGLE_API_KEY with an API key for the Generative Language API OR ensure application default credentials are available
// - GENERATIVE_MODEL optional model name (defaults to text-bison-001)
async function callGemini(prompt: string): Promise<string | null> {
  try {
    const useGemini = process.env.USE_GEMINI || process.env.NEXT_PUBLIC_USE_GEMINI
    const apiKey = process.env.GOOGLE_API_KEY
    const model = process.env.GENERATIVE_MODEL || "text-bison-001"

    if (!useGemini) return null

    // Prefer API key based call if provided
    if (!apiKey) {
      // If no API key, we avoid attempting ADC flows here to keep this example simple.
      console.warn("GOOGLE_API_KEY not set; skipping Gemini call")
      return null
    }

    // Prefer the official package if installed to handle auth and response parsing
    try {
      // Dynamic import so the package is optional during runtime
      const { GoogleGenerativeAI } = await import("@google/generative-ai")

      // If using API key, pass it via client options
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: process.env.GENERATIVE_MODEL || "gemini-pro" })

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      if (typeof text === "string") return text
    } catch (pkgErr) {
      // If package import fails, fall back to REST below
      console.warn("@google/generative-ai not available or failed; falling back to REST", pkgErr)
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GENERATIVE_MODEL || "gemini-pro"}:generateContent?key=${apiKey}`

    const body = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.2,
        candidateCount: 1,
        maxOutputTokens: 512,
      }
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      console.error("Gemini API error:", res.status, text)
      return null
    }

    const data = await res.json().catch(() => null)
    if (!data) return null

    // Try the current Gemini API response format
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                         data.candidates?.[0]?.content || 
                         data.text || 
                         null

    if (candidateText && typeof candidateText === "string") return candidateText

    return JSON.stringify(data)
  } catch (err) {
    console.error("callGemini error:", err)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const resumeFile = formData.get("resume") as File
    const jobDescription = formData.get("jobDescription") as string

    if (!resumeFile || !jobDescription) {
      return NextResponse.json({ error: "Resume file and job description are required" }, { status: 400 })
    }

    // Extract text from resume
    const resumeText = await extractResumeText(resumeFile)

    // Perform analysis
    const skillsMatch = analyzeSkills(resumeText, jobDescription)
    const experienceMatch = analyzeExperience(resumeText, jobDescription)
    const educationMatch = analyzeEducation(resumeText, jobDescription)
    const formatting = analyzeFormatting(resumeText)
    const keywordDensity = calculateKeywordDensity(resumeText, jobDescription)

    // Calculate overall score
    const overallScore = Math.round(
      skillsMatch.score * 0.4 + experienceMatch.score * 0.3 + educationMatch.score * 0.2 + formatting.score * 0.1,
    )

    // Generate recommendations
    const recommendations = [
      ...(skillsMatch.score < 70 ? ["Focus on highlighting technical skills that match the job requirements"] : []),
      ...(experienceMatch.score < 70 ? ["Better align your experience descriptions with the job posting"] : []),
      ...(keywordDensity < 15 ? ["Include more relevant keywords from the job description"] : []),
      "Tailor your resume summary to match the specific role",
      "Use quantifiable achievements to demonstrate impact",
    ]

    const result: AnalysisResult = {
      overallScore,
      skillsMatch,
      experienceMatch,
      educationMatch,
      formatting,
      keywordDensity,
      recommendations: recommendations.slice(0, 5),
    }

    // If Gemini is enabled, ask the model for concise, actionable improvements
    try {
      const useGemini = process.env.USE_GEMINI || process.env.NEXT_PUBLIC_USE_GEMINI
      if (useGemini) {
        const prompt = `You are a resume coach. Given the resume text:\n${resumeText.substring(0, 2000)}\n\nand the job description:\n${jobDescription.substring(0, 2000)}\n\nProvide up to 5 concise, prioritized recommendations to improve the resume for this job. Output as short bullet lines.`
        const geminiResp = await callGemini(prompt)
        if (geminiResp) {
          // Merge model suggestions into recommendations; keep existing ones first
          const modelSuggestions = geminiResp
            .split(/\n+/)
            .map((s) => s.replace(/^[-•\d\.\s]+/, "").trim())
            .filter(Boolean)
          result.recommendations = Array.from(new Set([...result.recommendations, ...modelSuggestions])).slice(0, 6)
        }
      }
    } catch (err) {
      console.error("Gemini integration error:", err)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 })
  }
}

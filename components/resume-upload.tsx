"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, FileText, Briefcase, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

function AnalysisResults({ result, onBack }: { result: any; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Resume Analysis Results</h2>
        <Button variant="outline" onClick={onBack}>
          Analyze Another Resume
        </Button>
      </div>

      {/* Overall Score */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Overall Match Score</h3>
              <p className="text-sm text-muted-foreground">How well your resume matches the job requirements</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{result.overallScore}%</div>
              <div className="text-sm text-muted-foreground">
                {result.overallScore >= 80
                  ? "Excellent"
                  : result.overallScore >= 60
                    ? "Good"
                    : result.overallScore >= 40
                      ? "Fair"
                      : "Needs Improvement"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Skills Match */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skills Analysis</CardTitle>
            <div className="text-2xl font-bold text-primary">{result.skillsMatch.score}%</div>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.skillsMatch.matchedSkills.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-2">Matched Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {result.skillsMatch.matchedSkills.map((skill: string) => (
                    <span key={skill} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {result.skillsMatch.missingSkills.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-2">Missing Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {result.skillsMatch.missingSkills.slice(0, 5).map((skill: string) => (
                    <span key={skill} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Experience Match */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Experience Analysis</CardTitle>
            <div className="text-2xl font-bold text-primary">{result.experienceMatch.score}%</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.experienceMatch.suggestions.map((suggestion: string, index: number) => (
                <p key={index} className="text-sm text-muted-foreground">
                  • {suggestion}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Education Match */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Education Analysis</CardTitle>
            <div className="text-2xl font-bold text-primary">{result.educationMatch.score}%</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.educationMatch.suggestions.map((suggestion: string, index: number) => (
                <p key={index} className="text-sm text-muted-foreground">
                  • {suggestion}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Formatting */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Formatting Analysis</CardTitle>
            <div className="text-2xl font-bold text-primary">{result.formatting.score}%</div>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.formatting.strengths.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-1">Strengths</h4>
                {result.formatting.strengths.map((strength: string, index: number) => (
                  <p key={index} className="text-sm text-green-600">
                    ✓ {strength}
                  </p>
                ))}
              </div>
            )}
            {result.formatting.improvements.length > 0 && (
              <div>
                <h4 className="font-medium text-foreground mb-1">Improvements</h4>
                {result.formatting.improvements.map((improvement: string, index: number) => (
                  <p key={index} className="text-sm text-muted-foreground">
                    • {improvement}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Recommendations</CardTitle>
          <CardDescription>Actionable steps to improve your resume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.recommendations.map((recommendation: string, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm text-foreground">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Keyword Density */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Keyword Density</h3>
              <p className="text-sm text-muted-foreground">Percentage of job-relevant keywords in your resume</p>
            </div>
            <div className="text-2xl font-bold text-primary">{result.keywordDensity}%</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ResumeUpload() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && (file.type === "application/pdf" || file.type.includes("document"))) {
      setResumeFile(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    multiple: false,
  })

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) return

    setIsAnalyzing(true)
    setAnalysisResult(null)

    try {
      const formData = new FormData()
      formData.append("resume", resumeFile)
      formData.append("jobDescription", jobDescription)

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error("Analysis error:", error)
      // Handle error - could show a toast or error message
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (analysisResult) {
    return <AnalysisResults result={analysisResult} onBack={() => setAnalysisResult(null)} />
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Resume Upload Section */}
      <Card className="border-2 border-dashed border-border hover:border-primary/50 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Upload Your Resume
          </CardTitle>
          <CardDescription>Upload your resume in PDF, DOC, or DOCX format for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
              resumeFile && "border-primary bg-primary/5",
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              {resumeFile ? (
                <div className="text-center">
                  <p className="font-medium text-foreground">{resumeFile.name}</p>
                  <p className="text-sm text-muted-foreground">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-medium text-foreground">
                    {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
                  </p>
                  <p className="text-sm text-muted-foreground">or click to browse files</p>
                </div>
              )}
            </div>
          </div>

          {resumeFile && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full bg-transparent"
              onClick={() => setResumeFile(null)}
            >
              Remove File
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Job Description Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Job Description
          </CardTitle>
          <CardDescription>Paste the job description you're applying for to get targeted feedback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job-description">Job Requirements</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the complete job description here, including required skills, experience, and qualifications..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[200px] resize-none"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              💡 <strong>Tip:</strong> Include the complete job posting for the most accurate analysis
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Button */}
      <div className="md:col-span-2">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Ready to Analyze?</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant AI-powered insights on your resume's match with the job requirements
                </p>
              </div>
              <Button
                onClick={handleAnalyze}
                disabled={!resumeFile || !jobDescription.trim() || isAnalyzing}
                size="lg"
                className="gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Resume
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

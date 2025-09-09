import { ResumeUpload } from "@/components/resume-upload"
import { Header } from "@/components/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">AI-Powered Resume Analyzer</h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Get instant feedback on your resume with our advanced AI analysis. Upload your resume and job description
              to receive personalized insights and recommendations.
            </p>
          </div>

          <ResumeUpload />
        </div>
      </main>
    </div>
  )
}

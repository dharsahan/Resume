# Resume Analyzer

A simple Next.js app that provides AI-powered resume analysis. The app contains a demo analysis API and a frontend for uploading a resume and pasting a job description.

Quick start (fish shell)

```fish
pnpm install
pnpm dev
```

Note: this project optionally uses the official Google Generative AI package `@google-ai/generative`. If you enabled Gemini integration, ensure dependencies are installed with `pnpm install` before running the dev server.

Open http://localhost:3000 and try uploading a resume and pasting a job description.

Environment variables

Copy `.env.example` to `.env.local` (or set the variables in your hosting platform).

- `USE_GEMINI` - set to `true` to enable Google Gemini (Generative Language) model calls from the server API
- `GOOGLE_API_KEY` - (recommended) API key for the Generative Language REST API
- `GENERATIVE_MODEL` - optional model name (default `text-bison-001`)

Example `.env.local` (do not commit your real key):

```
USE_GEMINI=true
GOOGLE_API_KEY=sk-XXXX
GENERATIVE_MODEL=text-bison-001
```

Notes & caveats

- The server `app/api/analyze/route.ts` includes a simple, optional integration with Google Generative Language (Gemini) when `USE_GEMINI` and `GOOGLE_API_KEY` are set. Calls to the model may incur costs and are subject to rate limits.
- The current `extractResumeText` function is a placeholder that returns simulated text. For production-quality resume parsing you should integrate a PDF/DOCX parser (for example `pdf-parse` for PDFs or `mammoth` for DOCX) and add input size limits.
- Keep API keys out of source control and use environment secrets in production.

Want me to wire real PDF/DOCX parsing or add a CI workflow and tests? Reply and I'll implement the next improvement.

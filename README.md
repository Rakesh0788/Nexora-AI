# Nexora AI – Intelligent Career Guidance Platform

> An AI-powered career coaching platform that helps professionals accelerate their career growth with personalized industry insights, AI-enhanced resumes, mock interviews, and cover letter generation — all in one intelligent platform.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📸 Overview

Nexora AI is a full-stack production-grade web application that acts as your personal AI career coach. It combines real-time industry data, AI-powered content generation, and progress tracking to help you land your dream job faster.

Whether you are a fresh graduate or an experienced professional, Nexora AI gives you the tools to understand your industry, build a standout resume, practice interviews, and write compelling cover letters — all personalized to your specific field and skills.

---

## ✨ Features

### 📊 Industry Insights Dashboard
- Real-time salary ranges displayed in an interactive bar chart across Junior, Mid-level, Senior, Lead, and Manager roles
- Market demand level (High / Medium / Low) with visual progress indicator
- Annual industry growth rate percentage
- Market outlook indicator (Positive / Neutral / Negative)
- Top in-demand skills displayed as badges with your personal skill match highlighted
- Key industry trends as numbered cards
- Recommended skills to learn with priority rankings
- Skills demand radar chart showing relative importance of top skills
- Career progress section with profile completeness checklist
- Data automatically refreshes every Sunday via Inngest cron job

### 📝 AI Resume Builder
- Dynamic form with sections for contact info, professional summary, skills, work experience, education, and projects
- Add and remove multiple work experience, education, and project entries on the fly using react-hook-form useFieldArray
- Live markdown preview tab that renders your resume in real time
- AI Improve button that rewrites your entire resume with stronger action verbs, quantified metrics, and ATS-optimized keywords
- Save resume to database with one click
- Download as a clean PDF using html2pdf.js
- Resume stored as markdown and persisted per user in PostgreSQL

### 🎤 Mock Interview System
- Generates 10 multiple-choice questions tailored specifically to your industry and skills using Groq AI
- Interactive quiz interface with one question at a time, A/B/C/D option cards, and a dot navigator to jump between questions
- Previous and Next navigation with question completion tracking
- Detailed results screen showing score percentage, correct/incorrect answers per question, right answer highlighting, and explanation for each question
- Personalized 2-line AI-generated improvement tip based only on the questions you got wrong
- Score progression line chart showing your improvement across multiple quiz attempts
- All results saved to database with full question breakdown

### ✉️ AI Cover Letter Generator
- Enter company name, job title, and paste the full job description
- AI reads your profile (industry, experience, bio, skills) and your saved resume to generate a fully personalized letter
- Generated letter displayed immediately with copy to clipboard button
- Save letters to database for future reference
- Manage all saved letters with expand/collapse view and delete functionality
- Multiple cover letters per user supported

### 📈 Career Progress Tracking
- Profile completeness checklist showing which features you have used
- Interview statistics including total quizzes, average score, best score, and improvement from first to latest attempt
- Mini area chart sparkline showing recent score trends
- Quick action cards linking directly to Resume Builder, Interview Prep, and Cover Letter Generator

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16 (App Router) | Framework, Server Actions, SSR |
| TypeScript | 5 | Full type safety across the codebase |
| Tailwind CSS | 3.4 | Utility-first styling |
| Shadcn UI | Latest | Accessible UI component library |
| Clerk | 6 | Authentication and user management |
| PostgreSQL (Neon DB) | - | Serverless PostgreSQL database |
| Prisma | 6 | Type-safe ORM and database client |
| Groq (Llama 3.3 70B) | - | AI text generation |
| react-hook-form | 7.x | Performant form management |
| Zod | 3.x | Schema validation |
| Inngest | 3.x | Background jobs and cron scheduling |
| Recharts | 2.x | Charts and data visualization |
| @uiw/react-md-editor | 4.x | Markdown editor and preview |
| html2pdf.js | 0.10 | Client-side PDF generation |
| Sonner | 1.x | Toast notifications |
| date-fns | 3.x | Date formatting utilities |
| next-themes | 0.4 | Dark mode support |

---

## 📁 Project Structure
nexora-ai/
├── app/
│   ├── (auth)/                         ← Authentication pages (no sidebar)
│   │   ├── layout.tsx
│   │   ├── sign-in/[[...sign-in]]/
│   │   │   └── page.tsx
│   │   └── sign-up/[[...sign-up]]/
│   │       └── page.tsx
│   ├── (main)/                         ← Protected pages with sidebar layout
│   │   ├── layout.tsx                  ← Checks auth + onboarding status
│   │   ├── error.tsx                   ← Error boundary for protected routes
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── dashboard-content.tsx
│   │   │       └── dashboard-skeleton.tsx
│   │   ├── resume/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── resume-builder.tsx
│   │   │       └── resume-preview.tsx
│   │   ├── interview/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── interview-dashboard.tsx
│   │   │       └── quiz-session.tsx
│   │   └── ai-cover-letter/
│   │       ├── page.tsx
│   │       └── _components/
│   │           └── cover-letter-dashboard.tsx
│   ├── onboarding/                     ← First-time user setup
│   │   ├── page.tsx
│   │   └── _components/
│   │       └── onboarding-form.tsx
│   ├── api/
│   │   └── inngest/
│   │       └── route.ts                ← Inngest webhook handler
│   ├── global-error.tsx                ← Root error boundary
│   ├── not-found.tsx                   ← Custom 404 page
│   ├── globals.css                     ← Global styles and CSS variables
│   ├── layout.tsx                      ← Root layout with providers
│   └── page.tsx                        ← Landing page
│
├── actions/                            ← Next.js Server Actions
│   ├── user.ts                         ← checkUser, updateUser, getCurrentUser
│   ├── dashboard.ts                    ← getIndustryInsights
│   ├── interview.ts                    ← generateQuiz, saveQuizResult, getAssessments
│   ├── resume.ts                       ← saveResume, getResume, improveWithAI
│   ├── coverLetter.ts                  ← generateCoverLetter, saveCoverLetter, deleteCoverLetter
│   └── progress.ts                     ← getCareerProgress
│
├── components/
│   ├── ui/                             ← Shadcn UI components
│   ├── career-progress.tsx             ← Career progress tracking widget
│   ├── header.tsx                      ← Landing page navigation
│   ├── hero.tsx                        ← Landing page hero section
│   ├── mobile-nav.tsx                  ← Mobile top bar and bottom tab nav
│   ├── sidebar.tsx                     ← Desktop sidebar navigation
│   └── theme-provider.tsx             ← Dark mode provider
│
├── hooks/
│   └── useFetch.ts                     ← Custom hook for server actions
│
├── lib/
│   ├── inngest/
│   │   ├── client.ts                   ← Inngest client instance
│   │   └── functions.ts               ← Weekly cron + on-demand refresh jobs
│   ├── gemini.ts                       ← Groq AI client and generateText()
│   ├── prisma.ts                       ← Prisma singleton client
│   ├── resumeHelpers.ts               ← Form data to markdown converter
│   ├── schemas.ts                      ← Zod validation schemas
│   ├── types.ts                        ← TypeScript type definitions
│   └── utils.ts                        ← cn(), cleanAIResponse(), helpers
│
└── prisma/
├── schema.prisma                   ← Database schema with 5 models
└── seed.ts                         ← Seeds initial industry data

---

## 🗄️ Database Schema

The application uses 5 Prisma models:

```prisma
User            → id, clerkUserId, email, name, imageUrl,
                  industry, bio, experience, skills[]

IndustryInsight → industry (unique), salaryRanges (JSON),
                  growthRate, demandLevel, topSkills[],
                  marketOutlook, keyTrends[], recommendedSkills[],
                  lastUpdated, nextUpdate

Assessment      → userId, quizScore, questions (JSON),
                  category, improvementTip

Resume          → userId (unique), content (Markdown)

CoverLetter     → userId, content, jobDescription,
                  companyName, jobTitle
```

---

## 🔄 Application Flow

User visits landing page
↓
Clicks "Get Started" → Clerk sign-up
↓
After sign-up → Onboarding page
(select industry, enter skills, bio, experience)
↓
Onboarding complete → Dashboard
AI generates industry insights → saves to DB → displays charts
↓
Resume Builder
Fill dynamic form → Preview markdown → AI improve → Save → PDF
↓
Interview Prep
AI generates 10 MCQs → Answer quiz → Submit
→ Score calculated → Wrong answers → AI tip → Save to DB
↓
Cover Letter
Enter job details → AI generates letter → Copy or Save
↓
Career Progress (on dashboard)
Completeness checklist + score chart + quick actions
↓
Every Sunday at midnight UTC
Inngest cron job runs → Refreshes all industry data via AI


---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm
- Git

### Step 1 — Clone the repository

```bash
git clone https://github.com/yourusername/nexora-ai.git
cd nexora-ai
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Set up external services

Create free accounts on these platforms:

**Clerk (Authentication)**
1. Go to [clerk.com](https://clerk.com) and create a new application
2. Enable Email and Google sign-in methods
3. Go to API Keys and copy the Publishable Key and Secret Key
4. In the Clerk dashboard go to Paths and set Sign-in URL to `/sign-in` and Sign-up URL to `/sign-up`

**Neon DB (PostgreSQL)**
1. Go to [neon.tech](https://neon.tech) and create a new project
2. Create a database named `nexora`
3. Go to Connection Details
4. Copy the Pooled connection string for `DATABASE_URL`
5. Copy the Direct connection string for `DIRECT_URL`

**Groq (AI)**
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Go to API Keys and create a new key
4. Copy the key for `GROQ_API_KEY`

**Inngest (Background Jobs)**
1. Go to [app.inngest.com](https://app.inngest.com) and create an account
2. Create a new app
3. Copy the Event Key for `INNGEST_EVENT_KEY`
4. Copy the Signing Key for `INNGEST_SIGNING_KEY`

### Step 4 — Configure environment variables

Copy the example file and fill in your real values:

```bash
cp .env.example .env.local
```

Your `.env.local` should look like this:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/onboarding
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding

# Neon PostgreSQL Database
DATABASE_URL="postgresql://username:password@host.neon.tech/nexora?sslmode=require&pgbouncer=true&connect_timeout=15"
DIRECT_URL="postgresql://username:password@host.neon.tech/nexora?sslmode=require&connect_timeout=15"

# Groq AI
GROQ_API_KEY=gsk_your_key_here

# Inngest Background Jobs
INNGEST_EVENT_KEY=evt_your_key_here
INNGEST_SIGNING_KEY=signkey-prod-your_key_here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 5 — Set up the database

```bash
# Generate the Prisma client from schema
npx prisma generate

# Push the schema to your Neon database
npx prisma db push

# Seed initial industry data (4 industries)
npx prisma db seed

# Optional: view your data in a visual UI
npx prisma studio
```

### Step 6 — Run the development server

Open two terminal windows:

```bash
# Terminal 1 — Start the Next.js app
npm run dev

# Terminal 2 — Start Inngest for background jobs
npx inngest-cli@latest dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 7 — Test the full flow

Visit http://localhost:3000
Click "Get Started" → Sign up with your email
Complete the onboarding form (select industry, add skills)
Dashboard loads with AI-generated industry insights
Navigate to Resume Builder → fill form → preview → save
Navigate to Interview Prep → start quiz → answer → submit
Navigate to Cover Letter → enter job details → generate
Return to Dashboard → see your career progress updated


---

## 🧪 Testing Background Jobs

With the Inngest dev server running (`npx inngest-cli@latest dev`):

1. Open [http://localhost:8288](http://localhost:8288) — the Inngest Dev UI
2. Find the `refresh-industry-insights` function
3. Click **Invoke** to manually trigger the weekly refresh
4. Or trigger a single industry refresh by sending this event:

```json
{
  "name": "nexora/industry.refresh",
  "data": {
    "industry": "tech-software-engineering"
  }
}
```

---

## 🔑 Useful Commands

```bash
# Start development server
npm run dev

# View database in visual UI
npx prisma studio

# Push schema changes to database
npx prisma db push

# Regenerate Prisma client after schema changes
npx prisma generate

# Seed initial data
npx prisma db seed

# Clear Next.js cache (fixes most build errors)
# Windows PowerShell:
Remove-Item -Recurse -Force .next

# Mac/Linux:
rm -rf .next

# Check code for errors
npm run lint

# Build for production
npm run build
```

---

## ✅ Feature Checklist

| Feature | Status |
|---------|--------|
| Landing page with hero section | ✅ |
| Clerk authentication (sign-in / sign-up) | ✅ |
| Onboarding flow (industry + skills + bio) | ✅ |
| Protected route middleware | ✅ |
| Desktop sidebar navigation | ✅ |
| Mobile bottom tab navigation | ✅ |
| Industry insights dashboard | ✅ |
| Salary bar chart (Recharts) | ✅ |
| Skills demand radar chart | ✅ |
| Career progress tracking | ✅ |
| Profile completeness checklist | ✅ |
| Resume builder with dynamic fields | ✅ |
| Add/remove experience and education | ✅ |
| Live markdown preview | ✅ |
| AI resume improvement | ✅ |
| PDF download | ✅ |
| Mock interview quiz (10 questions) | ✅ |
| Dot navigator between questions | ✅ |
| Per-question results breakdown | ✅ |
| AI improvement tip for wrong answers | ✅ |
| Score progression line chart | ✅ |
| Cover letter generator | ✅ |
| Save / copy / delete cover letters | ✅ |
| Weekly Inngest Sunday cron job | ✅ |
| On-demand industry refresh event | ✅ |
| Global error boundary | ✅ |
| Scoped route error boundary | ✅ |
| Custom 404 page | ✅ |
| Dark mode support | ✅ |
| Fully responsive (mobile + desktop) | ✅ |

---

## ⚠️ Known Limitations (Free Tier)

| Service | Limitation | Solution |
|---------|-----------|----------|
| Neon DB | Auto-pauses after 5 minutes of inactivity | Visit [console.neon.tech](https://console.neon.tech) to wake it up, or upgrade to paid plan |
| Groq | 14,400 requests per day on free tier | Create a new API key at [console.groq.com](https://console.groq.com) if limit is hit |
| Clerk | Development keys have strict usage limits | Use production keys when deploying |
| Inngest | 50,000 function runs per month on free tier | More than enough for development and small production use |

---

## 🚢 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

Add all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Set up Inngest for production

1. Go to [app.inngest.com](https://app.inngest.com)
2. Navigate to **Apps → Sync**
3. Add your production URL: `https://your-app.vercel.app/api/inngest`
4. Inngest will auto-discover and register your background functions

---

## 🔐 Security

- All AI API keys are stored in environment variables and only accessed in server actions
- The `"use server"` directive ensures sensitive code never reaches the client bundle
- Every server action verifies the authenticated user via Clerk before accessing the database
- Database queries always filter by the authenticated user's ID
- Ownership is verified before any delete operation

---

## 📜 License

MIT License — free to use for learning, portfolios, or as a base for your own applications.

---

## 🙏 Acknowledgements

Built with these amazing open-source tools and services:

- [Next.js](https://nextjs.org) — The React framework for production
- [Shadcn UI](https://ui.shadcn.com) — Beautifully designed components
- [Clerk](https://clerk.com) — The most comprehensive user management platform
- [Neon](https://neon.tech) — Serverless PostgreSQL
- [Groq](https://groq.com) — The fastest AI inference available
- [Inngest](https://inngest.com) — Durable background jobs for any platform
- [Prisma](https://prisma.io) — Next-generation Node.js ORM
- [Recharts](https://recharts.org) — Composable charting library

---

## 👨‍💻 Author

Built by **Rakesh Gandrathi**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [your-linkedin](https://linkedin.com/in/yourprofile)

---

*If you found this project helpful, please give it a ⭐ on GitHub!*
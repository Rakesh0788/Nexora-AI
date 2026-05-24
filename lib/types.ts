// ============================================================
// NEXORA AI - Shared TypeScript Types
// Derived from Prisma schema + additional app types
// ============================================================

import type {
  User,
  IndustryInsight,
  Assessment,
  Resume,
  CoverLetter,
  DemandLevel,
  MarketOutlook,
} from "@prisma/client";

// Re-export Prisma enum types
export type { DemandLevel, MarketOutlook };

// ============================================================
// USER TYPES
// ============================================================

export type UserProfile = Pick<
  User,
  | "id"
  | "clerkUserId"
  | "email"
  | "name"
  | "imageUrl"
  | "industry"
  | "bio"
  | "experience"
  | "skills"
>;

export type OnboardingData = {
  industry: string;
  subIndustry: string;
  bio: string;
  experience: number;
  skills: string[];
};

// ============================================================
// INDUSTRY INSIGHT TYPES
// ============================================================

export type SalaryRange = {
  role: string;
  min: number;
  max: number;
  median: number;
  currency: string;
};

export type IndustryInsightWithSalary = Omit<IndustryInsight, "salaryRanges"> & {
  salaryRanges: SalaryRange[];
};

// ============================================================
// ASSESSMENT TYPES
// ============================================================

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type QuizResult = {
  question: string;
  answer: string;       // correct answer
  userAnswer: string;   // what the user selected
  isCorrect: boolean;
  explanation: string;
};

export type AssessmentWithQuestions = Omit<Assessment, "questions"> & {
  questions: QuizResult[];
};

// ============================================================
// RESUME TYPES
// ============================================================

export type ResumeFormData = {
  contactInfo: ContactInfo;
  summary: string;
  skills: string;
  experience: WorkExperience[];
  education: Education[];
  projects?: Project[];
};

export type ContactInfo = {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
};

export type WorkExperience = {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;       // empty = "Present"
  current: boolean;
  description: string;    // markdown bullets
};

export type Education = {
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  achievements?: string;
};

export type Project = {
  name: string;
  description: string;
  technologies: string;
  url?: string;
  github?: string;
};

// ============================================================
// COVER LETTER TYPES
// ============================================================

export type CoverLetterFormData = {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
};

// ============================================================
// SERVER ACTION RESPONSE TYPES
// ============================================================

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// ============================================================
// ONBOARDING
// ============================================================

export type OnboardingStatus = {
  isOnboarded: boolean;
  user: UserProfile | null;
};

// ============================================================
// INDUSTRY LIST (for onboarding select)
// ============================================================

export const INDUSTRIES = [
  { id: "tech-software-engineering", label: "Software Engineering", category: "Technology" },
  { id: "tech-data-science", label: "Data Science & ML", category: "Technology" },
  { id: "tech-product-management", label: "Product Management", category: "Technology" },
  { id: "tech-devops", label: "DevOps & Cloud", category: "Technology" },
  { id: "tech-cybersecurity", label: "Cybersecurity", category: "Technology" },
  { id: "tech-ux-design", label: "UX/UI Design", category: "Technology" },
  { id: "finance-investment-banking", label: "Investment Banking", category: "Finance" },
  { id: "finance-fintech", label: "FinTech", category: "Finance" },
  { id: "finance-accounting", label: "Accounting & Audit", category: "Finance" },
  { id: "healthcare-clinical", label: "Clinical Medicine", category: "Healthcare" },
  { id: "healthcare-biotech", label: "Biotech & Pharma", category: "Healthcare" },
  { id: "marketing-digital", label: "Digital Marketing", category: "Marketing" },
  { id: "marketing-content", label: "Content & SEO", category: "Marketing" },
  { id: "legal-corporate", label: "Corporate Law", category: "Legal" },
  { id: "education-k12", label: "K-12 Education", category: "Education" },
  { id: "education-higher", label: "Higher Education", category: "Education" },
  { id: "consulting-management", label: "Management Consulting", category: "Consulting" },
  { id: "engineering-mechanical", label: "Mechanical Engineering", category: "Engineering" },
  { id: "engineering-civil", label: "Civil Engineering", category: "Engineering" },
  { id: "creative-media", label: "Media & Entertainment", category: "Creative" },
] as const;

export type IndustryId = (typeof INDUSTRIES)[number]["id"];
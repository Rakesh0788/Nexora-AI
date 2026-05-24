// ============================================================
// NEXORA AI - Zod Validation Schemas
// Used with react-hook-form throughout the app
// ============================================================

import { z } from "zod";

// ============================================================
// ONBOARDING SCHEMA
// ============================================================

export const onboardingSchema = z.object({
  industry: z.string().min(1, "Please select an industry"),
  subIndustry: z.string().min(1, "Please select a specialization"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be under 500 characters"),
  experience: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(50, "Please enter a valid number of years")
    .int("Experience must be a whole number"),
  skills: z
    .string()
    .min(1, "Please enter at least one skill")
    .transform((val) =>
      val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    ),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;

// ============================================================
// CONTACT INFO SCHEMA
// ============================================================

export const contactInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .url("Please enter a valid GitHub URL")
    .optional()
    .or(z.literal("")),
  portfolio: z
    .string()
    .url("Please enter a valid portfolio URL")
    .optional()
    .or(z.literal("")),
});

// ============================================================
// WORK EXPERIENCE SCHEMA
// ============================================================

export const workExperienceSchema = z.object({
  title: z.string().min(2, "Job title is required"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z
    .string()
    .min(10, "Please describe your role and achievements")
    .max(2000, "Description is too long"),
});

// ============================================================
// EDUCATION SCHEMA
// ============================================================

export const educationSchema = z.object({
  degree: z.string().min(2, "Degree is required"),
  institution: z.string().min(2, "Institution name is required"),
  location: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  achievements: z.string().optional(),
});

// ============================================================
// PROJECT SCHEMA
// ============================================================

export const projectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  description: z
    .string()
    .min(10, "Please describe the project")
    .max(1000, "Description is too long"),
  technologies: z.string().min(1, "Please list the technologies used"),
  url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .url("Please enter a valid GitHub URL")
    .optional()
    .or(z.literal("")),
});

// ============================================================
// FULL RESUME SCHEMA
// ============================================================

export const resumeSchema = z.object({
  contactInfo: contactInfoSchema,
  summary: z
    .string()
    .min(20, "Summary must be at least 20 characters")
    .max(600, "Summary must be under 600 characters"),
  skills: z.string().min(1, "Please enter at least one skill"),
  experience: z
    .array(workExperienceSchema)
    .min(1, "Please add at least one work experience"),
  education: z
    .array(educationSchema)
    .min(1, "Please add at least one education entry"),
  projects: z.array(projectSchema).optional(),
});

export type ResumeFormValues = z.infer<typeof resumeSchema>;

// ============================================================
// COVER LETTER SCHEMA
// ============================================================

export const coverLetterSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  jobTitle: z.string().min(2, "Job title is required"),
  jobDescription: z
    .string()
    .min(50, "Please provide a detailed job description (min 50 chars)")
    .max(5000, "Job description is too long"),
});

export type CoverLetterFormValues = z.infer<typeof coverLetterSchema>;

// ============================================================
// QUIZ / INTERVIEW SCHEMA
// ============================================================

export const quizAnswerSchema = z.object({
  answers: z.record(z.string(), z.string()), // { questionIndex: selectedAnswer }
});

export type QuizAnswerValues = z.infer<typeof quizAnswerSchema>;
"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { generateText } from "@/lib/gemini";
import { cleanAIResponse } from "@/lib/utils";
import type { Resume } from "@prisma/client";

// ============================================================
// saveResume
// Upserts resume markdown content for the current user.
// ============================================================
export async function saveResume(content: string): Promise<Resume> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });

  if (!user) throw new Error("User not found.");

  const resume = await db.resume.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      content,
    },
    update: {
      content,
    },
  });

  return resume;
}

// ============================================================
// getResume
// Returns the current user's saved resume, or null.
// ============================================================
export async function getResume(): Promise<Resume | null> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, industry: true, skills: true, experience: true },
  });

  if (!user) return null;

  const resume = await db.resume.findUnique({
    where: { userId: user.id },
  });

  return resume;
}

// ============================================================
// improveWithAI
// Takes the current resume markdown and rewrites it using
// Gemini — adds quantified metrics, stronger action verbs,
// and keyword optimization for the user's industry.
// ============================================================
export async function improveWithAI(currentContent: string): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true, skills: true, experience: true },
  });

  if (!user?.industry) throw new Error("Please complete onboarding first.");

  const prompt = `
You are an expert resume writer and career coach specializing in the ${user.industry} industry.
The candidate has ${user.experience ?? 0} years of experience.
Their skills include: ${user.skills.join(", ")}.

Improve the following resume by:
1. Strengthening bullet points with powerful action verbs (Led, Built, Scaled, Reduced, Increased, etc.)
2. Adding specific quantified metrics where possible (e.g., "Improved performance by 40%", "Managed team of 8")
3. Optimizing for ATS with relevant ${user.industry} keywords
4. Making the professional summary more compelling and specific
5. Ensuring consistent formatting throughout
6. Removing weak filler phrases ("responsible for", "helped with", "worked on")

IMPORTANT: 
- Keep the exact same markdown structure and sections
- Do NOT add new sections or remove existing ones
- Only enhance the content, not the structure
- Return ONLY the improved markdown resume, no explanations or commentary

Here is the resume to improve:

${currentContent}
`;

  const improved = await generateText(prompt);
  return improved.trim();
}
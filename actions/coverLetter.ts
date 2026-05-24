"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { generateText } from "@/lib/gemini";
import type { CoverLetter } from "@prisma/client";

// ============================================================
// generateCoverLetter
// Generates a tailored cover letter using Gemini based on
// the user's profile and the target job description.
// ============================================================
export async function generateCoverLetter(
  companyName: string,
  jobTitle: string,
  jobDescription: string
): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      name: true,
      industry: true,
      bio: true,
      skills: true,
      experience: true,
      resume: { select: { content: true } },
    },
  });

  if (!user) throw new Error("User not found.");

  const resumeContext = user.resume?.content
    ? `\nCandidate's resume summary:\n${user.resume.content.slice(0, 1500)}`
    : "";

  const prompt = `
You are an expert cover letter writer. Write a compelling, personalized cover letter.

Candidate Profile:
- Name: ${user.name ?? "the candidate"}
- Industry: ${user.industry ?? "technology"}
- Years of Experience: ${user.experience ?? 0}
- Key Skills: ${user.skills.join(", ")}
- Bio: ${user.bio ?? "Experienced professional"}
${resumeContext}

Target Position:
- Company: ${companyName}
- Job Title: ${jobTitle}
- Job Description: ${jobDescription.slice(0, 2000)}

Write a professional cover letter that:
1. Opens with a strong, attention-grabbing first paragraph (not "I am applying for...")
2. Connects the candidate's specific experience to the job requirements
3. Highlights 2-3 specific achievements or skills most relevant to this role
4. Shows genuine knowledge and enthusiasm for ${companyName}
5. Closes with a confident, specific call to action
6. Uses a professional but personable tone — not stiff or generic

Format:
- 3-4 paragraphs
- 250-380 words total
- No placeholders like [Your Name] — use the actual candidate name
- Start directly with "Dear Hiring Manager," or "Dear ${companyName} Team,"
- End with "Sincerely," followed by the candidate's name

Return ONLY the cover letter text, no extra commentary.
`;

  const content = await generateText(prompt);
  return content.trim();
}

// ============================================================
// saveCoverLetter
// Persists a generated cover letter to the database.
// ============================================================
export async function saveCoverLetter(
  content: string,
  companyName: string,
  jobTitle: string,
  jobDescription: string
): Promise<CoverLetter> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });

  if (!user) throw new Error("User not found.");

  const coverLetter = await db.coverLetter.create({
    data: {
      userId: user.id,
      content,
      companyName,
      jobTitle,
      jobDescription,
    },
  });

  return coverLetter;
}

// ============================================================
// getCoverLetters
// Returns all cover letters for the current user.
// ============================================================
export async function getCoverLetters(): Promise<CoverLetter[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });

  if (!user) return [];

  return db.coverLetter.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

// ============================================================
// deleteCoverLetter
// Deletes a cover letter by ID (ownership verified).
// ============================================================
export async function deleteCoverLetter(id: string): Promise<void> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });

  if (!user) throw new Error("User not found.");

  // Verify ownership
  const letter = await db.coverLetter.findFirst({
    where: { id, userId: user.id },
  });

  if (!letter) throw new Error("Cover letter not found or unauthorized.");

  await db.coverLetter.delete({ where: { id } });
}
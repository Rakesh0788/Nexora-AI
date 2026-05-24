"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export type CareerProgressData = {
  totalQuizzes: number;
  avgScore: number;
  bestScore: number;
  latestScore: number;
  scoreImprovement: number; // difference between latest and first score
  hasResume: boolean;
  coverLetterCount: number;
  topCategory: string | null;
  recentScores: { date: string; score: number }[];
  skillsCount: number;
  completionScore: number; // 0-100 profile completeness
};

// ============================================================
// getCareerProgress
// Aggregates all user activity into a single progress snapshot.
// ============================================================
export async function getCareerProgress(): Promise<CareerProgressData> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      name: true,
      bio: true,
      industry: true,
      experience: true,
      skills: true,
      resume: { select: { id: true } },
      coverLetters: { select: { id: true } },
      assessments: {
        orderBy: { createdAt: "asc" },
        select: {
          quizScore: true,
          category: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) throw new Error("User not found");

  const assessments = user.assessments;
  const totalQuizzes = assessments.length;

  const avgScore =
    totalQuizzes > 0
      ? Math.round(
          assessments.reduce((sum, a) => sum + a.quizScore, 0) / totalQuizzes
        )
      : 0;

  const bestScore =
    totalQuizzes > 0
      ? Math.round(Math.max(...assessments.map((a) => a.quizScore)))
      : 0;

  const latestScore =
    totalQuizzes > 0
      ? Math.round(assessments[assessments.length - 1].quizScore)
      : 0;

  const firstScore =
    totalQuizzes > 0 ? Math.round(assessments[0].quizScore) : 0;

  const scoreImprovement = latestScore - firstScore;

  // Find most practiced category
  const categoryCount: Record<string, number> = {};
  assessments.forEach((a) => {
    categoryCount[a.category] = (categoryCount[a.category] || 0) + 1;
  });
  const topCategory =
    Object.keys(categoryCount).length > 0
      ? Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0][0]
      : null;

  // Recent scores for sparkline (last 6)
  const recentScores = assessments.slice(-6).map((a) => ({
    date: a.createdAt.toISOString().split("T")[0],
    score: Math.round(a.quizScore),
  }));

  // Profile completeness score (0-100)
  let completionScore = 0;
  if (user.name) completionScore += 15;
  if (user.bio) completionScore += 15;
  if (user.industry) completionScore += 20;
  if (user.experience !== null) completionScore += 10;
  if (user.skills.length > 0) completionScore += 15;
  if (user.resume) completionScore += 15;
  if (user.coverLetters.length > 0) completionScore += 10;

  return {
    totalQuizzes,
    avgScore,
    bestScore,
    latestScore,
    scoreImprovement,
    hasResume: Boolean(user.resume),
    coverLetterCount: user.coverLetters.length,
    topCategory,
    recentScores,
    skillsCount: user.skills.length,
    completionScore,
  };
}
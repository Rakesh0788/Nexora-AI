"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { generateText } from "@/lib/gemini";
import { cleanAIResponse } from "@/lib/utils";
import type { QuizQuestion, QuizResult, AssessmentWithQuestions } from "@/lib/types";

// ============================================================
// generateQuiz
// Generates 10 multiple-choice questions using Gemini
// tailored to the user's industry and skills.
// ============================================================
export async function generateQuiz(): Promise<QuizQuestion[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true, skills: true },
  });

  if (!user?.industry) throw new Error("Please complete onboarding first.");

  const skillsList =
    user.skills.length > 0
      ? user.skills.slice(0, 5).join(", ")
      : "general professional skills";

  const prompt = `
You are a senior technical interviewer. Generate a quiz for a candidate in the "${user.industry}" industry.
Their key skills include: ${skillsList}.

Return ONLY a valid JSON array of exactly 10 questions with this EXACT structure (no markdown, no backticks):
[
  {
    "question": "Clear, specific question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Brief explanation of why this answer is correct."
  }
]

Rules:
- Generate exactly 10 questions
- Each question must have exactly 4 options
- correctAnswer must exactly match one of the options strings
- Mix difficulty: 3 easy, 4 medium, 3 hard
- Cover both technical and situational/behavioral questions
- Make questions specific and practical, not generic
- Return ONLY the JSON array, nothing else
`;

  const raw = await generateText(prompt);
  const cleaned = cleanAIResponse(raw);

  let questions: QuizQuestion[];
  try {
    questions = JSON.parse(cleaned);
  } catch {
    throw new Error("Failed to parse quiz questions from AI response.");
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("AI returned invalid quiz format.");
  }

  return questions;
}

// ============================================================
// saveQuizResult
// Scores the quiz, filters wrong answers, generates a
// 2-line improvement tip via Gemini, and saves to DB.
// ============================================================
export async function saveQuizResult(
  questions: QuizQuestion[],
  userAnswers: Record<number, string>,
  category: string
): Promise<AssessmentWithQuestions> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });

  if (!user) throw new Error("User not found.");

  // Score each question
  const results: QuizResult[] = questions.map((q, index) => {
    const userAnswer = userAnswers[index] ?? "";
    const isCorrect = userAnswer === q.correctAnswer;
    return {
      question: q.question,
      answer: q.correctAnswer,
      userAnswer,
      isCorrect,
      explanation: q.explanation,
    };
  });

  // Calculate score
  const correctCount = results.filter((r) => r.isCorrect).length;
  const quizScore = Math.round((correctCount / questions.length) * 100);

  // Filter only wrong answers for the improvement tip
  const wrongAnswers = results.filter((r) => !r.isCorrect);

  // Generate improvement tip based on wrong answers
  let improvementTip = "Keep practicing consistently to strengthen your knowledge.";

  if (wrongAnswers.length > 0) {
    const wrongTopics = wrongAnswers
      .slice(0, 3)
      .map((r) => `"${r.question}"`)
      .join(", ");

    const tipPrompt = `
A candidate scored ${quizScore}% on a ${category} quiz.
They answered these questions incorrectly: ${wrongTopics}

Write a concise, actionable improvement tip in EXACTLY 2 sentences.
Sentence 1: Identify the specific knowledge gap.
Sentence 2: Give one concrete action they can take this week.
Return only the 2 sentences, no bullet points, no headers, no extra text.
`;

    try {
      const tipRaw = await generateText(tipPrompt);
      improvementTip = tipRaw.trim();
    } catch {
      // Keep default tip on failure
    }
  }

  // Save to DB
  const assessment = await db.assessment.create({
    data: {
      userId: user.id,
      quizScore,
      questions: results,
      category,
      improvementTip,
    },
  });

  return {
    ...assessment,
    questions: assessment.questions as QuizResult[],
  };
}

// ============================================================
// getAssessments
// Returns all past quiz results for the current user,
// ordered by most recent first.
// ============================================================
export async function getAssessments(): Promise<AssessmentWithQuestions[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });

  if (!user) throw new Error("User not found.");

  const assessments = await db.assessment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return assessments.map((a) => ({
    ...a,
    questions: a.questions as QuizResult[],
  }));
}
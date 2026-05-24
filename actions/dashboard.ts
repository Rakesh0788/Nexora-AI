"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { generateText } from "@/lib/gemini";
import { cleanAIResponse } from "@/lib/utils";
import type { IndustryInsightWithSalary } from "@/lib/types";

// ============================================================
// getIndustryInsights
// Fetches industry insights from DB. If stale or missing,
// generates fresh data using Gemini and stores it.
// ============================================================
export async function getIndustryInsights(): Promise<IndustryInsightWithSalary> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Get the user's industry
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true },
  });

  if (!user?.industry) {
    throw new Error("User industry not set. Please complete onboarding.");
  }

  const industry = user.industry;

  // Check if we have fresh data (updated within last 7 days)
  const existing = await db.industryInsight.findUnique({
    where: { industry },
  });

  if (existing && new Date() < new Date(existing.nextUpdate)) {
    return {
      ...existing,
      salaryRanges: existing.salaryRanges as IndustryInsightWithSalary["salaryRanges"],
    };
  }

  // Generate fresh insights using Gemini
  const prompt = `
You are a career data analyst. Generate accurate, current industry insights for: "${industry}"

Return ONLY a valid JSON object with this EXACT structure (no markdown, no backticks, no extra text):
{
  "salaryRanges": [
    { "role": "Junior", "min": 60000, "max": 90000, "median": 75000, "currency": "USD" },
    { "role": "Mid-level", "min": 90000, "max": 130000, "median": 110000, "currency": "USD" },
    { "role": "Senior", "min": 130000, "max": 200000, "median": 160000, "currency": "USD" },
    { "role": "Lead/Staff", "min": 180000, "max": 260000, "median": 220000, "currency": "USD" },
    { "role": "Manager/Director", "min": 160000, "max": 280000, "median": 210000, "currency": "USD" }
  ],
  "growthRate": 15.5,
  "demandLevel": "High",
  "topSkills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5", "Skill6", "Skill7"],
  "marketOutlook": "Positive",
  "keyTrends": [
    "Trend description 1",
    "Trend description 2",
    "Trend description 3",
    "Trend description 4",
    "Trend description 5"
  ],
  "recommendedSkills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5"]
}

Rules:
- demandLevel must be exactly one of: "High", "Medium", "Low"
- marketOutlook must be exactly one of: "Positive", "Neutral", "Negative"
- growthRate is a float (e.g. 12.5 means 12.5% annual growth)
- salaryRanges must have exactly 5 entries
- topSkills must have 6-8 items
- keyTrends must have exactly 5 items
- recommendedSkills must have 4-6 items
- All salary values in USD integers
- Return ONLY the JSON object, nothing else
`;

  const raw = await generateText(prompt);
  const cleaned = cleanAIResponse(raw);

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Failed to parse AI response. Raw: ${cleaned.slice(0, 200)}`);
  }

  // Validate required fields
  if (!parsed.salaryRanges || !parsed.demandLevel || !parsed.marketOutlook) {
    throw new Error("AI response missing required fields.");
  }

  // Set next update to next Sunday midnight
  const nextSunday = getNextSunday();

  // Upsert into DB
  const saved = await db.industryInsight.upsert({
    where: { industry },
    create: {
      industry,
      salaryRanges: parsed.salaryRanges,
      growthRate: parseFloat(parsed.growthRate) || 0,
      demandLevel: parsed.demandLevel,
      topSkills: parsed.topSkills || [],
      marketOutlook: parsed.marketOutlook,
      keyTrends: parsed.keyTrends || [],
      recommendedSkills: parsed.recommendedSkills || [],
      lastUpdated: new Date(),
      nextUpdate: nextSunday,
    },
    update: {
      salaryRanges: parsed.salaryRanges,
      growthRate: parseFloat(parsed.growthRate) || 0,
      demandLevel: parsed.demandLevel,
      topSkills: parsed.topSkills || [],
      marketOutlook: parsed.marketOutlook,
      keyTrends: parsed.keyTrends || [],
      recommendedSkills: parsed.recommendedSkills || [],
      lastUpdated: new Date(),
      nextUpdate: nextSunday,
    },
  });

  return {
    ...saved,
    salaryRanges: saved.salaryRanges as IndustryInsightWithSalary["salaryRanges"],
  };
}

function getNextSunday(): Date {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilSunday);
  next.setHours(0, 0, 0, 0);
  return next;
}
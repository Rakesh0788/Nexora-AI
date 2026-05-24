import { inngest } from "./client";
import { db } from "@/lib/prisma";
import Groq from "groq-sdk";
import { cleanAIResponse } from "@/lib/utils";

export const refreshIndustryInsights = inngest.createFunction(
  {
    id: "refresh-industry-insights",
    name: "Refresh Industry Insights Weekly",
    retries: 2,
  },
  { cron: "0 0 * * 0" },
  async ({ step, logger }) => {
    // Create Groq instance INSIDE the function
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

    const industries = await step.run("fetch-industries", async () => {
      const insights = await db.industryInsight.findMany({
        select: { id: true, industry: true },
      });
      logger.info(`Found ${insights.length} industries to refresh`);
      return insights;
    });

    if (industries.length === 0) {
      return { refreshed: 0 };
    }

    const results = await step.run("refresh-all-industries", async () => {
      const nextSunday = getNextSunday();
      let successCount = 0;
      let failCount = 0;

      for (const { id, industry } of industries) {
        try {
          const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: buildInsightsPrompt(industry) }],
            max_tokens: 2048,
          });

          const raw = completion.choices[0]?.message?.content ?? "";
          const cleaned = cleanAIResponse(raw);

          let parsed;
          try {
            parsed = JSON.parse(cleaned);
          } catch {
            logger.error(`Failed to parse response for ${industry}`);
            failCount++;
            continue;
          }

          if (!parsed.salaryRanges || !parsed.demandLevel || !parsed.marketOutlook) {
            failCount++;
            continue;
          }

          await db.industryInsight.update({
            where: { id },
            data: {
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

          successCount++;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (err) {
          logger.error(`Failed to refresh ${industry}: ${String(err)}`);
          failCount++;
        }
      }

      return { successCount, failCount };
    });

    return {
      refreshed: results.successCount,
      failed: results.failCount,
      timestamp: new Date().toISOString(),
    };
  }
);

export const refreshSingleIndustry = inngest.createFunction(
  {
    id: "refresh-single-industry",
    name: "Refresh Single Industry On Demand",
    retries: 2,
  },
  { event: "nexora/industry.refresh" },
  async ({ event, step, logger }) => {
    const { industry } = event.data as { industry: string };
    if (!industry) throw new Error("Missing field: industry");

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

    const updated = await step.run(`refresh-${industry}`, async () => {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: buildInsightsPrompt(industry) }],
        max_tokens: 2048,
      });

      const raw = completion.choices[0]?.message?.content ?? "";
      const cleaned = cleanAIResponse(raw);
      const parsed = JSON.parse(cleaned);
      const nextSunday = getNextSunday();

      return db.industryInsight.upsert({
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
    });

    return { industry, updated: true };
  }
);

function getNextSunday(): Date {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilSunday);
  next.setHours(0, 0, 0, 0);
  return next;
}

function buildInsightsPrompt(industry: string): string {
  return `
You are a career data analyst. Generate accurate industry insights for: "${industry}"

Return ONLY a valid JSON object, no markdown, no backticks:
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
  "topSkills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5", "Skill6"],
  "marketOutlook": "Positive",
  "keyTrends": ["Trend1", "Trend2", "Trend3", "Trend4", "Trend5"],
  "recommendedSkills": ["Skill1", "Skill2", "Skill3", "Skill4"]
}

Rules:
- demandLevel: exactly "High", "Medium", or "Low"
- marketOutlook: exactly "Positive", "Neutral", or "Negative"
- Return ONLY the JSON object, nothing else
`;
}
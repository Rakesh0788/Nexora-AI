// ============================================================
// NEXORA AI - Database Seed Script
// Run with: npx prisma db seed
// ============================================================

import { PrismaClient, DemandLevel, MarketOutlook } from "@prisma/client";

const prisma = new PrismaClient();

const nextSunday = (): Date => {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon...
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilSunday);
  next.setHours(0, 0, 0, 0);
  return next;
};

async function main() {
  console.log("🌱 Seeding database...");

  // Seed industry insights for common industries
  const industries = [
    {
      industry: "tech-software-engineering",
      salaryRanges: [
        { role: "Junior Software Engineer", min: 70000, max: 110000, median: 90000, currency: "USD" },
        { role: "Mid-level Software Engineer", min: 110000, max: 160000, median: 135000, currency: "USD" },
        { role: "Senior Software Engineer", min: 150000, max: 220000, median: 185000, currency: "USD" },
        { role: "Staff Engineer", min: 200000, max: 300000, median: 250000, currency: "USD" },
        { role: "Engineering Manager", min: 180000, max: 280000, median: 230000, currency: "USD" },
      ],
      growthRate: 25.0,
      demandLevel: DemandLevel.High,
      topSkills: ["React", "TypeScript", "Python", "AWS", "System Design", "Node.js", "Kubernetes"],
      marketOutlook: MarketOutlook.Positive,
      keyTrends: [
        "AI/ML integration in every product",
        "Rise of serverless and edge computing",
        "Increased demand for full-stack engineers",
        "Remote-first culture becomes permanent",
        "Rust adoption growing for systems programming",
      ],
      recommendedSkills: ["LLM APIs", "Rust", "WebAssembly", "Vector Databases", "MLOps"],
      nextUpdate: nextSunday(),
    },
    {
      industry: "tech-data-science",
      salaryRanges: [
        { role: "Data Analyst", min: 60000, max: 95000, median: 78000, currency: "USD" },
        { role: "Data Scientist", min: 100000, max: 155000, median: 128000, currency: "USD" },
        { role: "Senior Data Scientist", min: 140000, max: 200000, median: 170000, currency: "USD" },
        { role: "ML Engineer", min: 130000, max: 195000, median: 162000, currency: "USD" },
        { role: "Head of Data", min: 180000, max: 270000, median: 225000, currency: "USD" },
      ],
      growthRate: 30.0,
      demandLevel: DemandLevel.High,
      topSkills: ["Python", "SQL", "Machine Learning", "TensorFlow", "PyTorch", "Statistics", "Spark"],
      marketOutlook: MarketOutlook.Positive,
      keyTrends: [
        "Generative AI reshaping data workflows",
        "LLM fine-tuning becoming a core skill",
        "Real-time ML inference at scale",
        "Data mesh architecture adoption",
        "AutoML reducing low-level work",
      ],
      recommendedSkills: ["LangChain", "Hugging Face", "dbt", "Databricks", "Vector Search"],
      nextUpdate: nextSunday(),
    },
    {
      industry: "finance-investment-banking",
      salaryRanges: [
        { role: "Analyst", min: 100000, max: 150000, median: 125000, currency: "USD" },
        { role: "Associate", min: 175000, max: 250000, median: 210000, currency: "USD" },
        { role: "Vice President", min: 250000, max: 400000, median: 320000, currency: "USD" },
        { role: "Director", min: 400000, max: 700000, median: 550000, currency: "USD" },
        { role: "Managing Director", min: 700000, max: 2000000, median: 1200000, currency: "USD" },
      ],
      growthRate: 5.0,
      demandLevel: DemandLevel.Medium,
      topSkills: ["Financial Modeling", "Valuation", "Excel", "M&A", "PowerPoint", "Bloomberg", "Python"],
      marketOutlook: MarketOutlook.Neutral,
      keyTrends: [
        "AI-assisted due diligence and deal screening",
        "ESG investing becoming mainstream",
        "Private credit market expansion",
        "Declining IPO market",
        "Increased regulatory scrutiny",
      ],
      recommendedSkills: ["Python for Finance", "ESG Analysis", "Private Credit", "Debt Capital Markets"],
      nextUpdate: nextSunday(),
    },
    {
      industry: "marketing-digital",
      salaryRanges: [
        { role: "Digital Marketing Coordinator", min: 45000, max: 65000, median: 55000, currency: "USD" },
        { role: "Digital Marketing Manager", min: 75000, max: 110000, median: 92000, currency: "USD" },
        { role: "Head of Growth", min: 120000, max: 180000, median: 150000, currency: "USD" },
        { role: "VP Marketing", min: 160000, max: 250000, median: 200000, currency: "USD" },
        { role: "CMO", min: 200000, max: 400000, median: 300000, currency: "USD" },
      ],
      growthRate: 10.0,
      demandLevel: DemandLevel.High,
      topSkills: ["SEO", "Google Ads", "Meta Ads", "Analytics", "Content Strategy", "Email Marketing", "CRO"],
      marketOutlook: MarketOutlook.Positive,
      keyTrends: [
        "AI-generated content at scale",
        "First-party data strategy post-cookie",
        "Short-form video dominance",
        "Performance branding convergence",
        "Influencer marketing matures",
      ],
      recommendedSkills: ["AI Content Tools", "GA4", "CDP Platforms", "TikTok Ads", "Marketing Attribution"],
      nextUpdate: nextSunday(),
    },
  ];

  for (const insight of industries) {
    await prisma.industryInsight.upsert({
      where: { industry: insight.industry },
      update: insight,
      create: insight,
    });
    console.log(`  ✅ Seeded: ${insight.industry}`);
  }

  console.log(`\n✅ Database seeded successfully with ${industries.length} industry insights.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
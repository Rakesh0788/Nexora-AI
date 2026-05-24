import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import {
  refreshIndustryInsights,
  refreshSingleIndustry,
} from "@/lib/inngest/functions";

// Serve Inngest functions via Next.js App Router
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [refreshIndustryInsights, refreshSingleIndustry],
});
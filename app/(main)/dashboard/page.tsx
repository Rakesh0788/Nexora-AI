import { Suspense } from "react";
import { getIndustryInsights } from "@/actions/dashboard";
import { getCurrentUser } from "@/actions/user";
import { getCareerProgress } from "@/actions/progress";
import { DashboardContent } from "./_components/dashboard-content";
import { DashboardSkeleton } from "./_components/dashboard-skeleton";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData />
    </Suspense>
  );
}

async function DashboardData() {
  const [insights, user, progress] = await Promise.all([
    getIndustryInsights(),
    getCurrentUser(),
    getCareerProgress(),
  ]);

  return <DashboardContent insights={insights} user={user} progress={progress} />;
}
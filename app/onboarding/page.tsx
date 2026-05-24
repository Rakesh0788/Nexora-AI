import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";
import { OnboardingForm } from "./_components/onboarding-form";

export default async function OnboardingPage() {
  const { isOnboarded } = await getUserOnboardingStatus();

  // Already onboarded → go straight to dashboard
  if (isOnboarded) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background hero-gradient flex items-center justify-center px-4 py-16">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            Step 1 of 1 — Career Profile Setup
          </div>
          <h1 className="text-4xl font-black gradient-title mb-3">
            Tell Us About Yourself
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Help us personalize your career guidance with AI-powered insights
            tailored to your industry and goals.
          </p>
        </div>

        <OnboardingForm />
      </div>
    </div>
  );
}
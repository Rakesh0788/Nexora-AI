import { getAssessments } from "@/actions/interview";
import { InterviewDashboard } from "./_components/interview-dashboard";

export const metadata = { title: "Interview Prep" };

export default async function InterviewPage() {
  const assessments = await getAssessments();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black gradient-title">Interview Prep</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Practice with AI-generated questions tailored to your industry and
          skills.
        </p>
      </div>
      <InterviewDashboard initialAssessments={assessments} />
    </div>
  );
}
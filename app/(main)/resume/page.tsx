import { getResume } from "@/actions/resume";
import { ResumeBuilder } from "./_components/resume-builder";

export const metadata = { title: "Resume Builder" };

export default async function ResumePage() {
  const resume = await getResume();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black gradient-title">Resume Builder</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Build, enhance and export your resume with AI assistance.
        </p>
      </div>
      <ResumeBuilder initialContent={resume?.content ?? ""} />
    </div>
  );
}
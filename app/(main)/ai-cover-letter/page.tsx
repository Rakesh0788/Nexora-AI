import { getCoverLetters } from "@/actions/coverLetter";
import { CoverLetterDashboard } from "./_components/cover-letter-dashboard";

export const metadata = { title: "AI Cover Letter" };

export default async function CoverLetterPage() {
  const letters = await getCoverLetters();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-black gradient-title">AI Cover Letter</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Generate personalized cover letters for any job in seconds.
        </p>
      </div>
      <CoverLetterDashboard initialLetters={letters} />
    </div>
  );
}
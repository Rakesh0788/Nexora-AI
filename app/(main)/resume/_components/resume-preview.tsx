"use client";

import dynamic from "next/dynamic";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

// Dynamically import the markdown preview to avoid SSR issues
const MDPreview = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

interface ResumePreviewProps {
  content: string;
}

export function ResumePreview({ content }: ResumePreviewProps) {
  const handleDownload = async () => {
    const element = document.getElementById("resume-pdf");
    if (!element) {
      toast.error("Preview not ready. Please wait a moment.");
      return;
    }

    const toastId = toast.loading("Generating PDF...");
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf()
        .set({
          margin: [12, 15, 12, 15],
          filename: "resume.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, letterRendering: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
      toast.dismiss(toastId);
      toast.success("PDF downloaded!");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("PDF generation failed.");
    }
  };

  if (!content) {
    return (
      <Card className="border-border/60 bg-card/60">
        <CardContent className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <Download className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm max-w-xs">
            Fill in your resume details in the Edit tab, then click Preview to
            see it rendered here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={handleDownload}
          size="sm"
          className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>

      {/* Visible preview */}
      <Card className="border-border/60 bg-card/60 overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <div
            data-color-mode="dark"
            className="prose prose-sm dark:prose-invert max-w-none"
          >
            <MDPreview source={content} />
          </div>
        </CardContent>
      </Card>

      {/* Hidden div used by html2pdf — white background for clean PDF */}
      <div className="hidden">
        <div
          id="resume-pdf"
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: "12px",
            lineHeight: "1.6",
            color: "#1a1a1a",
            backgroundColor: "#ffffff",
            padding: "20px",
            maxWidth: "800px",
          }}
        >
          {/* Render plain text version for PDF */}
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "Arial, sans-serif",
              fontSize: "12px",
              lineHeight: "1.7",
            }}
          >
            {content
              .replace(/#{1,6}\s/g, "")
              .replace(/\*\*(.*?)\*\*/g, "$1")
              .replace(/\*(.*?)\*/g, "$1")
              .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")}
          </pre>
        </div>
      </div>
    </div>
  );
}
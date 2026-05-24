"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Sparkles,
  Loader2,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
  Mail,
  Plus,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  generateCoverLetter,
  saveCoverLetter,
  deleteCoverLetter,
} from "@/actions/coverLetter";
import { coverLetterSchema, type CoverLetterFormValues } from "@/lib/schemas";
import type { CoverLetter } from "@prisma/client";

interface CoverLetterDashboardProps {
  initialLetters: CoverLetter[];
}

export function CoverLetterDashboard({
  initialLetters,
}: CoverLetterDashboardProps) {
  const [letters, setLetters] = useState(initialLetters);
  const [generatedContent, setGeneratedContent] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CoverLetterFormValues>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      companyName: "",
      jobTitle: "",
      jobDescription: "",
    },
  });

  const formValues = watch();

  const onGenerate = async (values: CoverLetterFormValues) => {
    setGenerating(true);
    try {
      const content = await generateCoverLetter(
        values.companyName,
        values.jobTitle,
        values.jobDescription
      );
      if (content) {
        setGeneratedContent(content);
        setShowForm(false);
        toast.success("Cover letter generated!");
      }
    } catch (err) {
      toast.error("Failed to generate cover letter. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedContent) return;
    setSaving(true);
    try {
      const saved = await saveCoverLetter(
        generatedContent,
        formValues.companyName,
        formValues.jobTitle,
        formValues.jobDescription
      );
      if (saved) {
        setLetters((prev) => [saved as CoverLetter, ...prev]);
        toast.success("Cover letter saved!");
        setGeneratedContent("");
        reset();
        setShowForm(true);
      }
    } catch (err) {
      toast.error("Failed to save cover letter.");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteCoverLetter(id);
      setLetters((prev) => prev.filter((l) => l.id !== id));
      toast.success("Cover letter deleted.");
    } catch (err) {
      toast.error("Failed to delete cover letter.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Generator Form */}
      {showForm ? (
        <Card className="border-border/60 bg-card/60">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-400" />
              </div>
              <CardTitle className="text-base font-semibold">
                Generate New Cover Letter
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onGenerate)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Company Name *
                  </Label>
                  <Input
                    placeholder="Google"
                    className="bg-background border-border"
                    {...register("companyName")}
                  />
                  {errors.companyName && (
                    <p className="text-destructive text-xs">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Job Title *
                  </Label>
                  <Input
                    placeholder="Senior Software Engineer"
                    className="bg-background border-border"
                    {...register("jobTitle")}
                  />
                  {errors.jobTitle && (
                    <p className="text-destructive text-xs">
                      {errors.jobTitle.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Job Description *
                </Label>
                <Textarea
                  rows={8}
                  placeholder="Paste the full job description here..."
                  className="resize-none bg-background border-border font-mono text-xs"
                  {...register("jobDescription")}
                />
                {errors.jobDescription && (
                  <p className="text-destructive text-xs">
                    {errors.jobDescription.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={generating}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white h-11 gap-2"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating your cover letter...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Cover Letter
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        /* Generated result */
        <Card className="border-violet-500/30 bg-card/60">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle className="text-base font-semibold">
                  Generated Cover Letter
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formValues.jobTitle} at {formValues.companyName}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-1.5 h-8"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5 h-8"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setGeneratedContent("");
                    setShowForm(true);
                  }}
                  className="gap-1.5 h-8 text-muted-foreground"
                >
                  New
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-background border border-border/60 text-sm leading-relaxed whitespace-pre-wrap">
              {generatedContent}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Letters */}
      {letters.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">
            Saved Cover Letters
            <Badge variant="secondary" className="ml-2 text-xs">
              {letters.length}
            </Badge>
          </h2>
          <div className="space-y-3">
            {letters.map((letter) => {
              const isExpanded = expandedId === letter.id;
              return (
                <Card
                  key={letter.id}
                  className="border-border/60 bg-card/60 overflow-hidden"
                >
                  {/* ✅ Changed from <button> to <div> to fix nested button error */}
                  <div
                    className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors cursor-pointer select-none"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : letter.id)
                    }
                  >
                    <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {letter.jobTitle}{" "}
                        <span className="text-muted-foreground font-normal">
                          at
                        </span>{" "}
                        {letter.companyName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(letter.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(letter.id);
                        }}
                        disabled={deleting}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-border/40 pt-4 space-y-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 h-7 text-xs"
                        onClick={async () => {
                          await navigator.clipboard.writeText(letter.content);
                          toast.success("Copied!");
                        }}
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </Button>
                      <div className="p-4 rounded-lg bg-background border border-border/60 text-sm leading-relaxed whitespace-pre-wrap">
                        {letter.content}
                      </div>
                      {letter.jobDescription && (
                        <>
                          <Separator />
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1.5">
                              Original Job Description
                            </p>
                            <p className="text-xs text-muted-foreground/70 leading-relaxed line-clamp-4">
                              {letter.jobDescription}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {letters.length === 0 && !generatedContent && showForm && (
        <Card className="border-dashed border-border/60 bg-card/30">
          <CardContent className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
              <Mail className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Generate your first cover letter above and save it here for easy
              access later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
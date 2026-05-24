"use client";

import { useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Download,
  Loader2,
  Plus,
  Sparkles,
  Save,
  Trash2,
  Eye,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { resumeSchema, type ResumeFormValues } from "@/lib/schemas";
import { resumeToMarkdown } from "@/lib/resumeHelpers";
import { saveResume, improveWithAI } from "@/actions/resume";
import { useFetch } from "@/hooks/useFetch";
import { ResumePreview } from "./resume-preview";

interface ResumeBuilderProps {
  initialContent: string;
}

const defaultValues: ResumeFormValues = {
  contactInfo: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  summary: "",
  skills: "",
  experience: [
    {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  ],
  education: [
    {
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
      achievements: "",
    },
  ],
  projects: [],
};

export function ResumeBuilder({ initialContent }: ResumeBuilderProps) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent);

  const { loading: saving, fn: fnSave } = useFetch(saveResume);
  const { loading: improving, fn: fnImprove, data: improvedContent } = useFetch(improveWithAI);

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues,
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  // Dynamic arrays
  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({ control, name: "experience" });

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({ control, name: "education" });

  const {
    fields: projFields,
    append: appendProj,
    remove: removeProj,
  } = useFieldArray({ control, name: "projects" });

  // Convert form → markdown and switch to preview tab
  const handlePreview = useCallback(() => {
    const values = watch();
    const md = resumeToMarkdown(values);
    setPreviewContent(md);
    setActiveTab("preview");
  }, [watch]);

  // Save to DB
  const handleSave = async () => {
    const values = watch();
    const md = resumeToMarkdown(values);
    await fnSave(md);
    toast.success("Resume saved successfully!");
  };

  // AI improve current markdown
  const handleImprove = async () => {
    const values = watch();
    const md = resumeToMarkdown(values);
    if (!md.trim()) {
      toast.error("Please fill in your resume first.");
      return;
    }
    await fnImprove(md);
    if (improvedContent) {
      setPreviewContent(improvedContent as string);
      setActiveTab("preview");
      toast.success("Resume enhanced with AI!");
    }
  };

  // Download PDF
  const handleDownload = async () => {
    const element = document.getElementById("resume-pdf");
    if (!element) return;

    toast.loading("Generating PDF...");
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      await html2pdf()
        .set({
          margin: [10, 15, 10, 15],
          filename: "resume.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
      toast.dismiss();
      toast.success("PDF downloaded!");
    } catch {
      toast.dismiss();
      toast.error("PDF generation failed. Please try again.");
    }
  };

  const onSubmit = async (values: ResumeFormValues) => {
    const md = resumeToMarkdown(values);
    await fnSave(md);
    toast.success("Resume saved!");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={handlePreview}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Eye className="w-4 h-4" /> Preview
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save
        </Button>
        <Button
          onClick={handleImprove}
          disabled={improving}
          size="sm"
          className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
        >
          {improving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {improving ? "Enhancing..." : "AI Improve"}
        </Button>
        <Button
          onClick={handleDownload}
          variant="outline"
          size="sm"
          className="gap-2 ml-auto"
        >
          <Download className="w-4 h-4" /> Download PDF
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/60">
          <TabsTrigger value="edit" className="gap-2">
            <FileText className="w-3.5 h-3.5" /> Edit
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="w-3.5 h-3.5" /> Preview
          </TabsTrigger>
        </TabsList>

        {/* ── EDIT TAB ──────────────────────────────────── */}
        <TabsContent value="edit" className="mt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Contact Info */}
            <Card className="border-border/60 bg-card/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Full Name *" error={errors.contactInfo?.name?.message}>
                  <Input placeholder="Jane Smith" {...register("contactInfo.name")} />
                </FormField>
                <FormField label="Email *" error={errors.contactInfo?.email?.message}>
                  <Input placeholder="jane@example.com" {...register("contactInfo.email")} />
                </FormField>
                <FormField label="Phone" error={errors.contactInfo?.phone?.message}>
                  <Input placeholder="+1 (555) 000-0000" {...register("contactInfo.phone")} />
                </FormField>
                <FormField label="Location" error={errors.contactInfo?.location?.message}>
                  <Input placeholder="San Francisco, CA" {...register("contactInfo.location")} />
                </FormField>
                <FormField label="LinkedIn URL" error={errors.contactInfo?.linkedin?.message}>
                  <Input placeholder="https://linkedin.com/in/..." {...register("contactInfo.linkedin")} />
                </FormField>
                <FormField label="GitHub URL" error={errors.contactInfo?.github?.message}>
                  <Input placeholder="https://github.com/..." {...register("contactInfo.github")} />
                </FormField>
                <FormField label="Portfolio URL" error={errors.contactInfo?.portfolio?.message} className="sm:col-span-2">
                  <Input placeholder="https://yourportfolio.com" {...register("contactInfo.portfolio")} />
                </FormField>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="border-border/60 bg-card/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Professional Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField label="Summary *" error={errors.summary?.message}>
                  <Textarea
                    rows={4}
                    placeholder="Results-driven software engineer with 5+ years building scalable web applications..."
                    className="resize-none"
                    {...register("summary")}
                  />
                </FormField>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-border/60 bg-card/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField label="Skills (comma-separated) *" error={errors.skills?.message}>
                  <Input
                    placeholder="React, TypeScript, Node.js, PostgreSQL, AWS, Docker..."
                    {...register("skills")}
                  />
                </FormField>
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card className="border-border/60 bg-card/60">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Work Experience
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 h-8"
                  onClick={() =>
                    appendExp({
                      title: "",
                      company: "",
                      location: "",
                      startDate: "",
                      endDate: "",
                      current: false,
                      description: "",
                    })
                  }
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {expFields.map((field, index) => (
                  <div key={field.id} className="relative">
                    {index > 0 && <Separator className="mb-6" />}
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="text-xs">
                        Position {index + 1}
                      </Badge>
                      {expFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => removeExp(index)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Job Title *" error={errors.experience?.[index]?.title?.message}>
                        <Input placeholder="Senior Software Engineer" {...register(`experience.${index}.title`)} />
                      </FormField>
                      <FormField label="Company *" error={errors.experience?.[index]?.company?.message}>
                        <Input placeholder="Acme Corp" {...register(`experience.${index}.company`)} />
                      </FormField>
                      <FormField label="Location" error={errors.experience?.[index]?.location?.message}>
                        <Input placeholder="Remote / New York, NY" {...register(`experience.${index}.location`)} />
                      </FormField>
                      <FormField label="Start Date *" error={errors.experience?.[index]?.startDate?.message}>
                        <Input placeholder="Jan 2022" {...register(`experience.${index}.startDate`)} />
                      </FormField>
                      <FormField label="End Date" error={errors.experience?.[index]?.endDate?.message}>
                        <Input
                          placeholder="Dec 2024 (leave blank if current)"
                          {...register(`experience.${index}.endDate`)}
                        />
                      </FormField>
                      <FormField label="Description *" error={errors.experience?.[index]?.description?.message} className="sm:col-span-2">
                        <Textarea
                          rows={4}
                          placeholder={`- Led migration of monolith to microservices, reducing deploy time by 60%\n- Built real-time dashboard serving 50K daily active users\n- Mentored 3 junior engineers`}
                          className="resize-none font-mono text-xs"
                          {...register(`experience.${index}.description`)}
                        />
                      </FormField>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="border-border/60 bg-card/60">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Education
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 h-8"
                  onClick={() =>
                    appendEdu({
                      degree: "",
                      institution: "",
                      location: "",
                      startDate: "",
                      endDate: "",
                      gpa: "",
                      achievements: "",
                    })
                  }
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {eduFields.map((field, index) => (
                  <div key={field.id}>
                    {index > 0 && <Separator className="mb-6" />}
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary" className="text-xs">
                        Education {index + 1}
                      </Badge>
                      {eduFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => removeEdu(index)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField label="Degree *" error={errors.education?.[index]?.degree?.message}>
                        <Input placeholder="B.S. Computer Science" {...register(`education.${index}.degree`)} />
                      </FormField>
                      <FormField label="Institution *" error={errors.education?.[index]?.institution?.message}>
                        <Input placeholder="MIT" {...register(`education.${index}.institution`)} />
                      </FormField>
                      <FormField label="Location" error={errors.education?.[index]?.location?.message}>
                        <Input placeholder="Cambridge, MA" {...register(`education.${index}.location`)} />
                      </FormField>
                      <FormField label="Start Year" error={errors.education?.[index]?.startDate?.message}>
                        <Input placeholder="2018" {...register(`education.${index}.startDate`)} />
                      </FormField>
                      <FormField label="End Year" error={errors.education?.[index]?.endDate?.message}>
                        <Input placeholder="2022" {...register(`education.${index}.endDate`)} />
                      </FormField>
                      <FormField label="GPA" error={errors.education?.[index]?.gpa?.message}>
                        <Input placeholder="3.8 / 4.0" {...register(`education.${index}.gpa`)} />
                      </FormField>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Projects (optional) */}
            <Card className="border-border/60 bg-card/60">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Projects{" "}
                  <span className="text-muted-foreground/50 normal-case font-normal">
                    (optional)
                  </span>
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 h-8"
                  onClick={() =>
                    appendProj({
                      name: "",
                      description: "",
                      technologies: "",
                      url: "",
                      github: "",
                    })
                  }
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </Button>
              </CardHeader>
              {projFields.length > 0 && (
                <CardContent className="space-y-6">
                  {projFields.map((field, index) => (
                    <div key={field.id}>
                      {index > 0 && <Separator className="mb-6" />}
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary" className="text-xs">
                          Project {index + 1}
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => removeProj(index)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField label="Project Name *" error={errors.projects?.[index]?.name?.message}>
                          <Input placeholder="Nexora AI" {...register(`projects.${index}.name`)} />
                        </FormField>
                        <FormField label="Technologies *" error={errors.projects?.[index]?.technologies?.message}>
                          <Input placeholder="Next.js, TypeScript, PostgreSQL" {...register(`projects.${index}.technologies`)} />
                        </FormField>
                        <FormField label="Live URL" error={errors.projects?.[index]?.url?.message}>
                          <Input placeholder="https://..." {...register(`projects.${index}.url`)} />
                        </FormField>
                        <FormField label="GitHub URL" error={errors.projects?.[index]?.github?.message}>
                          <Input placeholder="https://github.com/..." {...register(`projects.${index}.github`)} />
                        </FormField>
                        <FormField label="Description *" error={errors.projects?.[index]?.description?.message} className="sm:col-span-2">
                          <Textarea
                            rows={3}
                            placeholder="AI-powered career platform built with Next.js 15 and Google Gemini..."
                            className="resize-none"
                            {...register(`projects.${index}.description`)}
                          />
                        </FormField>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>

            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white h-11"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Save Resume</>
              )}
            </Button>
          </form>
        </TabsContent>

        {/* ── PREVIEW TAB ───────────────────────────────── */}
        <TabsContent value="preview" className="mt-4">
          <ResumePreview
            content={improvedContent ? (improvedContent as string) : previewContent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Small helper component for consistent form field layout
function FormField({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Briefcase, User, Zap, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

import { onboardingSchema, type OnboardingFormValues } from "@/lib/schemas";
import { INDUSTRIES } from "@/lib/types";
import { updateUser } from "@/actions/user";
import { useFetch } from "@/hooks/useFetch";

// Group industries by category
const groupedIndustries = INDUSTRIES.reduce(
  (acc, industry) => {
    if (!acc[industry.category]) acc[industry.category] = [];
    acc[industry.category].push(industry);
    return acc;
  },
  {} as Record<string, typeof INDUSTRIES[number][]>
);

export function OnboardingForm() {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");

  const { loading, fn: submitOnboarding } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      industry: "",
      subIndustry: "",
      bio: "",
      experience: 0,
      skills: "",
    },
  });

  // Find sub-industries based on selected top-level category
  const selectedCategory = watch("industry");

  const onSubmit = async (values: OnboardingFormValues) => {
    // skills comes in as string, transform to array via schema
    const skillsArray =
      typeof values.skills === "string"
        ? values.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : values.skills;

    await submitOnboarding({
      industry: values.subIndustry || values.industry,
      subIndustry: values.subIndustry,
      bio: values.bio,
      experience: Number(values.experience),
      skills: skillsArray as string[],
    });

    toast.success("Profile saved! Setting up your dashboard...");
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Industry Selection */}
      <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
        <CardContent className="pt-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-md bg-violet-500/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-violet-400" />
            </div>
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Industry & Specialization
            </h2>
          </div>

          {/* Industry Category */}
          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select
              onValueChange={(val) => {
                setValue("industry", val);
                setValue("subIndustry", "");
                setSelectedIndustry(val);
              }}
            >
              <SelectTrigger
                id="industry"
                className="bg-background border-border"
              >
                <SelectValue placeholder="Select your industry category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(groupedIndustries).map((category) => (
                  <SelectGroup key={category}>
                    <SelectLabel className="text-muted-foreground text-xs uppercase tracking-wider">
                      {category}
                    </SelectLabel>
                    {groupedIndustries[category].map((ind) => (
                      <SelectItem key={ind.id} value={ind.id}>
                        {ind.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-destructive text-xs mt-1">
                {errors.industry.message}
              </p>
            )}
          </div>

          {/* Sub-industry / specialization */}
          <div className="space-y-2">
            <Label htmlFor="subIndustry">Specialization *</Label>
            <Input
              id="subIndustry"
              placeholder="e.g. Frontend Development, Quantitative Finance..."
              className="bg-background border-border"
              {...register("subIndustry")}
            />
            {errors.subIndustry && (
              <p className="text-destructive text-xs mt-1">
                {errors.subIndustry.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
        <CardContent className="pt-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-md bg-violet-500/10 flex items-center justify-center">
              <User className="w-4 h-4 text-violet-400" />
            </div>
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Professional Background
            </h2>
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience *</Label>
            <Input
              id="experience"
              type="number"
              min={0}
              max={50}
              placeholder="e.g. 3"
              className="bg-background border-border"
              {...register("experience", { valueAsNumber: true })}
            />
            {errors.experience && (
              <p className="text-destructive text-xs mt-1">
                {errors.experience.message}
              </p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">
              Professional Bio{" "}
              <span className="text-muted-foreground font-normal">
                (10–500 chars)
              </span>
            </Label>
            <Textarea
              id="bio"
              rows={4}
              placeholder="Brief summary of your background, expertise, and career goals..."
              className="bg-background border-border resize-none"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-destructive text-xs mt-1">
                {errors.bio.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
        <CardContent className="pt-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-md bg-violet-500/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-violet-400" />
            </div>
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Skills
            </h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">
              Your Skills{" "}
              <span className="text-muted-foreground font-normal">
                (comma-separated)
              </span>
            </Label>
            <Input
              id="skills"
              placeholder="e.g. React, TypeScript, Node.js, PostgreSQL, AWS"
              className="bg-background border-border"
              {...register("skills")}
            />
            <p className="text-xs text-muted-foreground">
              Separate each skill with a comma. These help us personalize
              AI-generated insights for you.
            </p>
            {errors.skills && (
              <p className="text-destructive text-xs mt-1">
                {errors.skills.message as string}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-base shadow-lg shadow-violet-500/25"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving your profile...
          </>
        ) : (
          <>
            Complete Setup & Go to Dashboard
            <ChevronRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </form>
  );
}
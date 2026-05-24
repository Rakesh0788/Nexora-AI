"use client";

import Link from "next/link";
import {
  FileText,
  Mic,
  Mail,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CareerProgressData } from "@/actions/progress";
import { cn } from "@/lib/utils";

interface CareerProgressProps {
  data: CareerProgressData;
}

export function CareerProgress({ data }: CareerProgressProps) {
  const {
    totalQuizzes,
    avgScore,
    bestScore,
    scoreImprovement,
    hasResume,
    coverLetterCount,
    topCategory,
    recentScores,
    skillsCount,
    completionScore,
  } = data;

  // Profile checklist items
  const checklistItems = [
    {
      label: "Set your industry",
      done: true, // always done if they reached dashboard
      href: "/onboarding",
    },
    {
      label: "Add your skills",
      done: skillsCount > 0,
      href: "/onboarding",
    },
    {
      label: "Build your resume",
      done: hasResume,
      href: "/resume",
    },
    {
      label: "Take a mock interview",
      done: totalQuizzes > 0,
      href: "/interview",
    },
    {
      label: "Generate a cover letter",
      done: coverLetterCount > 0,
      href: "/ai-cover-letter",
    },
  ];

  const ImprovementIcon =
    scoreImprovement > 0
      ? TrendingUp
      : scoreImprovement < 0
      ? TrendingDown
      : Minus;

  const improvementColor =
    scoreImprovement > 0
      ? "text-emerald-400"
      : scoreImprovement < 0
      ? "text-rose-400"
      : "text-muted-foreground";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Completeness */}
      <Card className="border-border/60 bg-card/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Career Profile
            </CardTitle>
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-bold",
                completionScore === 100
                  ? "border-emerald-500/40 text-emerald-400"
                  : "border-violet-500/40 text-violet-400"
              )}
            >
              {completionScore}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Profile completeness</span>
              <span>{completionScore}%</span>
            </div>
            <Progress value={completionScore} className="h-2" />
          </div>

          <div className="space-y-2">
            {checklistItems.map((item) => (
              <Link
                key={item.label}
                href={item.done ? "#" : item.href}
                className={cn(
                  "flex items-center gap-2.5 p-2 rounded-lg text-xs transition-colors",
                  item.done
                    ? "opacity-60 cursor-default"
                    : "hover:bg-muted/50 group"
                )}
              >
                {item.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                <span
                  className={cn(
                    "flex-1",
                    item.done
                      ? "line-through text-muted-foreground"
                      : "font-medium"
                  )}
                >
                  {item.label}
                </span>
                {!item.done && (
                  <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interview Stats */}
      <Card className="border-border/60 bg-card/60">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-violet-400" />
            <CardTitle className="text-base font-semibold">
              Interview Progress
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {totalQuizzes > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/40 text-center">
                  <p className="text-2xl font-black text-foreground">
                    {totalQuizzes}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">
                    Quizzes
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/40 text-center">
                  <p className="text-2xl font-black text-emerald-400">
                    {bestScore}%
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">
                    Best Score
                  </p>
                </div>
              </div>

              {/* Score improvement */}
              <div className="flex items-center gap-2 text-sm">
                <ImprovementIcon className={cn("w-4 h-4", improvementColor)} />
                <span className={cn("font-semibold", improvementColor)}>
                  {scoreImprovement > 0 ? "+" : ""}
                  {scoreImprovement}%
                </span>
                <span className="text-muted-foreground text-xs">
                  from first to latest quiz
                </span>
              </div>

              {/* Mini score chart */}
              {recentScores.length >= 2 && (
                <ResponsiveContainer width="100%" height={80}>
                  <AreaChart data={recentScores}>
                    <defs>
                      <linearGradient
                        id="scoreGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" hide />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip
                      formatter={(v: number) => [`${v}%`, "Score"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                        fontSize: "11px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      fill="url(#scoreGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {topCategory && (
                <p className="text-xs text-muted-foreground">
                  Most practiced:{" "}
                  <span className="text-foreground font-medium">
                    {topCategory}
                  </span>
                </p>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 gap-3 text-center">
              <p className="text-sm text-muted-foreground">
                No quizzes taken yet.
              </p>
              <Button asChild size="sm" variant="outline" className="gap-2">
                <Link href="/interview">
                  <Mic className="w-3.5 h-3.5" /> Start Practice
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-border/60 bg-card/60">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <CardTitle className="text-base font-semibold">
              Quick Actions
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {[
            {
              href: "/resume",
              icon: FileText,
              label: hasResume ? "Update Resume" : "Build Resume",
              description: hasResume
                ? "Enhance with AI"
                : "Create your first resume",
              color: "text-violet-400",
              bg: "bg-violet-500/10 hover:bg-violet-500/15",
              badge: hasResume ? null : "New",
            },
            {
              href: "/interview",
              icon: Mic,
              label: "Practice Interview",
              description:
                totalQuizzes > 0
                  ? `${totalQuizzes} quizzes · avg ${avgScore}%`
                  : "Start your first quiz",
              color: "text-blue-400",
              bg: "bg-blue-500/10 hover:bg-blue-500/15",
              badge: null,
            },
            {
              href: "/ai-cover-letter",
              icon: Mail,
              label: "Generate Cover Letter",
              description:
                coverLetterCount > 0
                  ? `${coverLetterCount} letter${coverLetterCount > 1 ? "s" : ""} saved`
                  : "Tailored to any job",
              color: "text-emerald-400",
              bg: "bg-emerald-500/10 hover:bg-emerald-500/15",
              badge: null,
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border border-border/40 transition-all duration-200 group",
                action.bg
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-background/50"
                )}
              >
                <action.icon className={cn("w-4 h-4", action.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate">
                    {action.label}
                  </p>
                  {action.badge && (
                    <Badge className="text-[9px] px-1.5 py-0.5 bg-violet-500 text-white border-0 h-4">
                      {action.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {action.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Mic,
  Plus,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  BarChart2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { generateQuiz, saveQuizResult } from "@/actions/interview";
import { useFetch } from "@/hooks/useFetch";
import { QuizSession } from "./quiz-session";
import type { AssessmentWithQuestions } from "@/lib/types";
import { cn } from "@/lib/utils";

type View = "dashboard" | "quiz";

interface InterviewDashboardProps {
  initialAssessments: AssessmentWithQuestions[];
}

export function InterviewDashboard({ initialAssessments }: InterviewDashboardProps) {
  const [view, setView] = useState<View>("dashboard");
  const [assessments, setAssessments] = useState(initialAssessments);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const {
    loading: generating,
    fn: fnGenerate,
    data: questions,
  } = useFetch(generateQuiz);

  const handleStartQuiz = async () => {
    await fnGenerate();
    if (!generating) setView("quiz");
  };

  const handleQuizComplete = (newAssessment: AssessmentWithQuestions) => {
    setAssessments((prev) => [newAssessment, ...prev]);
    setView("dashboard");
  };

  // Chart data from assessment history
  const chartData = [...assessments]
    .reverse()
    .slice(-8)
    .map((a, i) => ({
      attempt: `#${i + 1}`,
      score: Math.round(a.quizScore),
      date: format(new Date(a.createdAt), "MMM d"),
    }));

  const avgScore =
    assessments.length > 0
      ? Math.round(
          assessments.reduce((sum, a) => sum + a.quizScore, 0) /
            assessments.length
        )
      : 0;

  const bestScore =
    assessments.length > 0
      ? Math.round(Math.max(...assessments.map((a) => a.quizScore)))
      : 0;

  // Redirect to quiz view once questions are ready
  if (view === "quiz" && questions && Array.isArray(questions) && questions.length > 0) {
    return (
      <QuizSession
        questions={questions}
        onComplete={handleQuizComplete}
        onCancel={() => setView("dashboard")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Start Quiz CTA */}
      <Card className="border-violet-500/30 bg-violet-500/5">
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold">Start a Mock Interview</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                10 AI-generated questions tailored to your industry and skills.
                Takes ~10 minutes.
              </p>
            </div>
          </div>
          <Button
            onClick={handleStartQuiz}
            disabled={generating}
            className="bg-violet-600 hover:bg-violet-700 text-white shrink-0 gap-2"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Start Quiz
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Stats Row */}
      {assessments.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-border/60 bg-card/60">
              <CardContent className="pt-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Quizzes Taken
                </p>
                <p className="text-3xl font-black">{assessments.length}</p>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card/60">
              <CardContent className="pt-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Average Score
                </p>
                <p
                  className={cn(
                    "text-3xl font-black",
                    avgScore >= 70
                      ? "text-emerald-400"
                      : avgScore >= 50
                      ? "text-amber-400"
                      : "text-rose-400"
                  )}
                >
                  {avgScore}%
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-card/60">
              <CardContent className="pt-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Best Score
                </p>
                <p className="text-3xl font-black text-emerald-400">
                  {bestScore}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Score trend chart */}
          {chartData.length >= 2 && (
            <Card className="border-border/60 bg-card/60">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-violet-400" />
                  <CardTitle className="text-base font-semibold">
                    Score Progression
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="attempt"
                      tick={{
                        fontSize: 11,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{
                        fontSize: 11,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                      tickFormatter={(v) => `${v}%`}
                      width={40}
                    />
                    <Tooltip
                      formatter={(v: number) => [`${v}%`, "Score"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2.5}
                      dot={{
                        fill: "hsl(var(--chart-1))",
                        strokeWidth: 0,
                        r: 4,
                      }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Past assessments list */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Past Assessments</h2>
            <div className="space-y-3">
              {assessments.map((assessment) => {
                const isExpanded = expandedId === assessment.id;
                const scoreColor =
                  assessment.quizScore >= 70
                    ? "text-emerald-400"
                    : assessment.quizScore >= 50
                    ? "text-amber-400"
                    : "text-rose-400";

                return (
                  <Card
                    key={assessment.id}
                    className="border-border/60 bg-card/60 overflow-hidden"
                  >
                    {/* Header row */}
                    <button
                      className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : assessment.id)
                      }
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-black text-lg",
                          assessment.quizScore >= 70
                            ? "bg-emerald-500/10 text-emerald-400"
                            : assessment.quizScore >= 50
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-rose-500/10 text-rose-400"
                        )}
                      >
                        {Math.round(assessment.quizScore)}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm truncate">
                            {assessment.category}
                          </p>
                          <Badge
                            variant="secondary"
                            className="text-[10px] shrink-0"
                          >
                            {assessment.questions.length} questions
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(
                            new Date(assessment.createdAt),
                            "MMM d, yyyy · h:mm a"
                          )}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-border/40 pt-4 space-y-4">
                        {/* Improvement tip */}
                        <div className="flex gap-3 p-3 rounded-lg bg-violet-500/8 border border-violet-500/20">
                          <Lightbulb className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {assessment.improvementTip}
                          </p>
                        </div>

                        {/* Score bar */}
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                            <span>Score</span>
                            <span className={cn("font-semibold", scoreColor)}>
                              {Math.round(assessment.quizScore)}%
                            </span>
                          </div>
                          <Progress
                            value={assessment.quizScore}
                            className="h-2"
                          />
                        </div>

                        {/* Questions breakdown */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Question Breakdown
                          </p>
                          {assessment.questions.map((q, i) => (
                            <div
                              key={i}
                              className={cn(
                                "flex items-start gap-2.5 p-2.5 rounded-lg text-xs",
                                q.isCorrect
                                  ? "bg-emerald-500/5 border border-emerald-500/15"
                                  : "bg-rose-500/5 border border-rose-500/15"
                              )}
                            >
                              {q.isCorrect ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium leading-snug">
                                  {q.question}
                                </p>
                                {!q.isCorrect && (
                                  <p className="text-muted-foreground mt-1">
                                    <span className="text-rose-400">
                                      You: {q.userAnswer}
                                    </span>{" "}
                                    ·{" "}
                                    <span className="text-emerald-400">
                                      Correct: {q.answer}
                                    </span>
                                  </p>
                                )}
                                <p className="text-muted-foreground/70 mt-0.5 italic">
                                  {q.explanation}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {assessments.length === 0 && (
        <Card className="border-dashed border-border/60 bg-card/30">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
              <Trophy className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-semibold">No quizzes yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Take your first mock interview to start tracking your progress and
              getting personalized improvement tips.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Trophy,
  RotateCcw,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import { saveQuizResult } from "@/actions/interview";
import { useFetch } from "@/hooks/useFetch";
import { cn } from "@/lib/utils";
import type { QuizQuestion, AssessmentWithQuestions } from "@/lib/types";

interface QuizSessionProps {
  questions: QuizQuestion[];
  onComplete: (assessment: AssessmentWithQuestions) => void;
  onCancel: () => void;
}

type QuizPhase = "active" | "reviewing" | "submitting";

export function QuizSession({ questions, onComplete, onCancel }: QuizSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [phase, setPhase] = useState<QuizPhase>("active");

  const { loading: saving, fn: fnSave } = useFetch(saveQuizResult);

  const current = questions[currentIndex];
  const totalAnswered = Object.keys(answers).length;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (option: string) => {
    if (phase !== "active") return;
    setAnswers((prev) => ({ ...prev, [currentIndex]: option }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSubmit = async () => {
    if (totalAnswered < questions.length) {
      const unanswered = questions.length - totalAnswered;
      toast.warning(
        `You have ${unanswered} unanswered question${unanswered > 1 ? "s" : ""}. Submitting anyway.`
      );
    }

    setPhase("submitting");
    const category = "Industry Assessment";

    await fnSave(questions, answers, category);
    // Result lands in useFetch's data — we'll show results inline
    setPhase("reviewing");
  };

  // Calculate results for review phase
  const results = questions.map((q, i) => ({
    ...q,
    userAnswer: answers[i] ?? "(skipped)",
    isCorrect: answers[i] === q.correctAnswer,
  }));

  const score = Math.round(
    (results.filter((r) => r.isCorrect).length / questions.length) * 100
  );

  // ── REVIEW PHASE ─────────────────────────────────────────
  if (phase === "reviewing" || phase === "submitting") {
    return (
      <div className="space-y-6">
        {/* Score banner */}
        <Card
          className={cn(
            "border-2",
            score >= 70
              ? "border-emerald-500/30 bg-emerald-500/5"
              : score >= 50
              ? "border-amber-500/30 bg-amber-500/5"
              : "border-rose-500/30 bg-rose-500/5"
          )}
        >
          <CardContent className="pt-6 pb-6 text-center">
            <div
              className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl font-black",
                score >= 70
                  ? "bg-emerald-500/15 text-emerald-400"
                  : score >= 50
                  ? "bg-amber-500/15 text-amber-400"
                  : "bg-rose-500/15 text-rose-400"
              )}
            >
              {score}%
            </div>
            <h2 className="text-xl font-bold mb-1">
              {score >= 80
                ? "Excellent Work! 🎉"
                : score >= 60
                ? "Good Effort! 💪"
                : "Keep Practicing! 📚"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {results.filter((r) => r.isCorrect).length} of {questions.length}{" "}
              correct
            </p>

            {phase === "submitting" && (
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving results...
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            className="gap-2"
            disabled={phase === "submitting"}
          >
            <RotateCcw className="w-4 h-4" /> Back to Dashboard
          </Button>
        </div>

        {/* Per-question results */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
            Detailed Results
          </h3>
          {results.map((result, i) => (
            <Card
              key={i}
              className={cn(
                "border",
                result.isCorrect
                  ? "border-emerald-500/20 bg-emerald-500/3"
                  : "border-rose-500/20 bg-rose-500/3"
              )}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {result.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium leading-snug">
                      <span className="text-muted-foreground mr-2">Q{i + 1}.</span>
                      {result.question}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-md",
                          result.isCorrect
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        )}
                      >
                        Your answer: {result.userAnswer}
                      </span>
                      {!result.isCorrect && (
                        <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400">
                          Correct: {result.correctAnswer}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      {result.explanation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // ── ACTIVE QUIZ PHASE ────────────────────────────────────
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="gap-1.5 text-muted-foreground h-8"
          >
            <X className="w-3.5 h-3.5" /> Cancel
          </Button>
          <Badge variant="secondary" className="font-mono text-xs">
            {currentIndex + 1} / {questions.length}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          {totalAnswered} answered
        </span>
      </div>

      {/* Progress bar */}
      <Progress value={progress} className="h-1.5" />

      {/* Question card */}
      <Card className="border-border/60 bg-card/70">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold leading-snug">
            <span className="text-muted-foreground font-normal mr-2">
              Q{currentIndex + 1}.
            </span>
            {current.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {current.options.map((option, i) => {
            const isSelected = answers[currentIndex] === option;
            return (
              <button
                key={i}
                onClick={() => handleAnswer(option)}
                className={cn(
                  "w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-150",
                  isSelected
                    ? "border-violet-500/60 bg-violet-500/15 text-violet-300"
                    : "border-border/60 bg-background/50 hover:border-violet-500/30 hover:bg-violet-500/5 text-foreground"
                )}
              >
                <span className="inline-flex items-center gap-3">
                  <span
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border",
                      isSelected
                        ? "bg-violet-500 border-violet-400 text-white"
                        : "border-border text-muted-foreground"
                    )}
                  >
                    {["A", "B", "C", "D"][i]}
                  </span>
                  {option}
                </span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>

        {currentIndex < questions.length - 1 ? (
          <Button
            size="sm"
            onClick={handleNext}
            className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={saving}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trophy className="w-4 h-4" />
            )}
            Submit Quiz
          </Button>
        )}
      </div>

      {/* Question dots navigator */}
      <div className="flex flex-wrap gap-1.5 justify-center pt-2">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              "w-6 h-6 rounded-full text-[10px] font-bold transition-all",
              i === currentIndex
                ? "bg-violet-500 text-white"
                : answers[i]
                ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                : "bg-muted text-muted-foreground border border-border/60"
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
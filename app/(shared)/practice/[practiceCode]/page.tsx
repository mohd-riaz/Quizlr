"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import PracticeQuestionView from "@/components/game/practice-question-view";
import PracticeScoreReveal from "@/components/game/practice-score-reveal";

type PracticePhase =
  | { phase: "start" }
  | { phase: "question"; questionIndex: number; questionStartedAt: number; score: number }
  | { phase: "reveal"; questionIndex: number; selectedIndex: number | null; pointsEarned: number; score: number }
  | { phase: "finished"; totalScore: number };

export default function PracticePage() {
  const { practiceCode } = useParams<{ practiceCode: string }>();
  const router = useRouter();
  const [current, setCurrent] = useState<PracticePhase>({ phase: "start" });

  const quiz = useQuery(api.quizzes.getByPracticeCode, { practiceCode });

  if (quiz === undefined) return null;

  if (quiz === null) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-20">
        <p className="text-foreground text-center text-lg font-semibold">Quiz not found.</p>
        <Button variant="link" onClick={() => router.push("/")} className="text-primary text-sm">
          Go to home
        </Button>
      </div>
    );
  }

  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-20">
        <p className="text-foreground text-center text-lg font-semibold">
          This quiz has no questions yet.
        </p>
        <Button variant="link" onClick={() => router.push("/")} className="text-primary text-sm">
          Go to home
        </Button>
      </div>
    );
  }

  const handleStart = () => {
    setCurrent({ phase: "question", questionIndex: 0, questionStartedAt: Date.now(), score: 0 });
  };

  const handleAnswer = (selectedIndex: number | null, pointsEarned: number) => {
    setCurrent((prev) => {
      if (prev.phase !== "question") return prev;
      return {
        phase: "reveal",
        questionIndex: prev.questionIndex,
        selectedIndex,
        pointsEarned,
        score: prev.score + pointsEarned,
      };
    });
  };

  const handleNext = () => {
    setCurrent((prev) => {
      if (prev.phase !== "reveal") return prev;
      const nextIndex = prev.questionIndex + 1;
      if (nextIndex >= quiz.questions.length) {
        return { phase: "finished", totalScore: prev.score };
      }
      return {
        phase: "question",
        questionIndex: nextIndex,
        questionStartedAt: Date.now(),
        score: prev.score,
      };
    });
  };

  if (current.phase === "start") {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-20 pb-20 flex flex-col items-center text-center gap-6">
        <div>
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Practice
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-1">{quiz.title}</h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-center text-sm text-muted-foreground font-mono">
          <span>
            {quiz.questions.length}{" "}
            {quiz.questions.length === 1 ? "question" : "questions"}
          </span>
          <span className="text-border">·</span>
          <span>{quiz.timeLimit}s per question</span>
        </div>
        <button
          onClick={handleStart}
          className="inline-flex items-center gap-2 h-11 px-8 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Start Practice
        </button>
      </div>
    );
  }

  if (current.phase === "question") {
    const question = quiz.questions[current.questionIndex];
    return (
      <PracticeQuestionView
        question={question}
        questionIndex={current.questionIndex}
        totalQuestions={quiz.questions.length}
        timeLimit={quiz.timeLimit}
        questionStartedAt={current.questionStartedAt}
        onAnswer={handleAnswer}
      />
    );
  }

  if (current.phase === "reveal") {
    const question = quiz.questions[current.questionIndex];
    return (
      <PracticeScoreReveal
        question={question}
        questionIndex={current.questionIndex}
        totalQuestions={quiz.questions.length}
        selectedIndex={current.selectedIndex}
        pointsEarned={current.pointsEarned}
        onNext={handleNext}
      />
    );
  }

  if (current.phase === "finished") {
    const maxScore = quiz.questions.length * 1000;
    const pct = Math.round((current.totalScore / maxScore) * 100);
    return (
      <div className="max-w-2xl mx-auto px-6 pt-20 pb-20 flex flex-col items-center text-center gap-6">
        <div>
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Practice complete
          </span>
          <h2 className="text-2xl font-bold tracking-tight mt-1">You&apos;re done!</h2>
        </div>
        <div className="bg-card border border-border rounded-xl px-8 py-6 w-full max-w-xs">
          <p className="text-sm font-mono text-muted-foreground mb-1">Your score</p>
          <p className="text-4xl font-black tabular-nums text-foreground">
            {current.totalScore.toLocaleString()}
          </p>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            {pct}% of {maxScore.toLocaleString()} max
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button
            onClick={handleStart}
            className="w-full h-11 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full h-11 rounded-lg border border-border bg-transparent text-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            Exit
          </button>
        </div>
      </div>
    );
  }

  return null;
}

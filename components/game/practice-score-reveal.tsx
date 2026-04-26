"use client";

import AnswerButton, { AnswerState } from "@/components/game/answer-button";

interface Question {
  _id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface PracticeScoreRevealProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedIndex: number | null;
  pointsEarned: number;
  onNext: () => void;
}

export default function PracticeScoreReveal({
  question,
  questionIndex,
  totalQuestions,
  selectedIndex,
  pointsEarned,
  onNext,
}: PracticeScoreRevealProps) {
  const isCorrect = selectedIndex !== null && selectedIndex === question.correctIndex;

  const getRevealState = (i: number): AnswerState => {
    if (i === question.correctIndex) return "correct";
    if (selectedIndex !== null && selectedIndex === i && !isCorrect) return "wrong";
    return "dimmed";
  };

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-20">
      <div className="mb-6 text-center">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Answer reveal
        </span>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-5">
        <p className="text-lg font-semibold tracking-tight leading-snug text-center">
          {question.text}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-2.5">
        {question.options.map((opt, i) => (
          <AnswerButton
            key={i}
            index={i}
            text={opt}
            state={getRevealState(i)}
            disabled
          />
        ))}
      </div>

      {question.explanation && (
        <p className="mt-5 text-sm font-mono text-muted-foreground text-center italic">
          {question.explanation}
        </p>
      )}

      <div className={[
        "mt-5 rounded-lg border px-5 py-4 text-center",
        selectedIndex !== null
          ? isCorrect
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-rose-500/30 bg-rose-500/5"
          : "border-border bg-muted/30",
      ].join(" ")}>
        {selectedIndex !== null ? (
          <>
            <p className={`text-sm font-semibold mb-1 ${isCorrect ? "text-emerald-500" : "text-rose-500"}`}>
              {isCorrect ? "Correct!" : "Wrong"}
            </p>
            {isCorrect && (
              <p className="text-foreground font-black text-3xl tabular-nums">
                +{pointsEarned.toLocaleString()}
              </p>
            )}
          </>
        ) : (
          <p className="text-muted-foreground text-sm font-mono">
            You didn&apos;t answer in time.
          </p>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {questionIndex + 1 >= totalQuestions ? "See Results" : "Next Question"}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

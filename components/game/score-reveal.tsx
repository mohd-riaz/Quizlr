"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import AnswerButton, { AnswerState } from "@/components/game/answer-button";

interface Question {
  _id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface ScoreRevealProps {
  question: Question;
  sessionId: string;
  participantId: string;
  isHost: boolean;
  questionIndex: number;
  totalQuestions: number;
  onNext: () => void;
}

export default function ScoreReveal({
  question,
  sessionId,
  participantId,
  isHost,
  questionIndex,
  totalQuestions,
  onNext,
}: ScoreRevealProps) {
  const answers = useQuery(api.answers.listBySessionAndQuestion, {
    sessionId: sessionId as Id<"sessions">,
    questionId: question._id as Id<"questions">,
  });

  const myAnswer = answers?.find((a) => a.participantId === participantId);
  const totalAnswers = answers?.length ?? 0;
  const correctCount = answers?.filter((a) => a.isCorrect).length ?? 0;

  const getRevealState = (i: number): AnswerState => {
    if (i === question.correctIndex) return "correct";
    if (myAnswer && myAnswer.selectedIndex === i && !myAnswer.isCorrect) return "wrong";
    return "dimmed";
  };

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-20">
      <div className="mb-6 text-center">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Answer reveal
        </span>
      </div>

      {/* Question */}
      <div className="bg-card border border-border rounded-xl p-6 mb-5">
        <p className="text-lg font-semibold tracking-tight leading-snug text-center">
          {question.text}
        </p>
      </div>

      {/* Options */}
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

      {/* Explanation */}
      {question.explanation && (
        <p className="mt-5 text-sm font-mono text-muted-foreground text-center italic">
          {question.explanation}
        </p>
      )}

      {/* Stats row */}
      <div className="mt-5 flex items-center justify-center gap-1.5 text-xs font-mono text-muted-foreground">
        <span className="font-semibold text-foreground">{correctCount}</span>
        <span>/</span>
        <span className="font-semibold text-foreground">{totalAnswers}</span>
        <span>answered correctly</span>
      </div>

      {/* Player result */}
      {!isHost && (
        <div className={[
          "mt-5 rounded-lg border px-5 py-4 text-center",
          myAnswer
            ? myAnswer.isCorrect
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-rose-500/30 bg-rose-500/5"
            : "border-border bg-muted/30",
        ].join(" ")}>
          {myAnswer ? (
            <>
              <p className={`text-sm font-semibold mb-1 ${myAnswer.isCorrect ? "text-emerald-500" : "text-rose-500"}`}>
                {myAnswer.isCorrect ? "Correct!" : "Wrong"}
              </p>
              {myAnswer.isCorrect && (
                <p className="text-foreground font-black text-3xl tabular-nums">
                  +{myAnswer.pointsEarned.toLocaleString()}
                </p>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-sm font-mono">
              You didn&apos;t answer in time.
            </p>
          )}
        </div>
      )}

      {/* Host next button */}
      {isHost && (
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
      )}
    </div>
  );
}

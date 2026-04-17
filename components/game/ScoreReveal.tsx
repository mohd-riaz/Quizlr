"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  onNext: () => void; // host triggers next question / finish
}

const OPTION_COLORS = [
  "bg-rose-500",
  "bg-blue-500",
  "bg-yellow-400",
  "bg-emerald-500",
];
const SHAPES = ["▲", "◆", "●", "■"];

export default function ScoreReveal({
  question,
  sessionId,
  participantId,
  isHost,
  onNext,
}: ScoreRevealProps) {
  const answers = useQuery(api.answers.listBySessionAndQuestion, {
    sessionId: sessionId as Id<"sessions">,
    questionId: question._id as Id<"questions">,
  });

  // Find this participant's answer
  const myAnswer = answers?.find(
    (a) => a.participantId === participantId
  );

  const totalAnswers = answers?.length ?? 0;
  const correctCount =
    answers?.filter((a) => a.isCorrect).length ?? 0;

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-foreground text-center text-lg font-semibold">
        Answer Reveal
      </h2>

      {/* Question */}
      <div className="bg-card rounded-2xl px-6 py-4">
        <p className="text-foreground font-semibold text-lg sm:text-xl text-center">
          {question.text}
        </p>
      </div>

      {/* Options with correct highlighted */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correctIndex;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 border-b-4 ${
                isCorrect
                  ? `${OPTION_COLORS[i]} border-b-black/20`
                  : "bg-muted/50 border-b-border opacity-50"
              }`}
            >
              <span className="text-xl w-6">{SHAPES[i]}</span>
              <span className="flex-1 text-white font-semibold text-sm sm:text-base">
                {opt}
              </span>
              {isCorrect && <Check className="w-5 h-5 text-white" />}
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {question.explanation && (
        <p className="text-muted-foreground text-sm text-center italic">
          {question.explanation}
        </p>
      )}

      {/* Stats */}
      <div className="bg-card rounded-xl px-5 py-3 text-center text-foreground text-sm">
        {correctCount} / {totalAnswers} players answered correctly
      </div>

      {/* Player: points earned */}
      {!isHost && myAnswer && (
        <div
          className={`rounded-xl px-5 py-4 text-center ${
            myAnswer.isCorrect
              ? "bg-emerald-900/50 border border-emerald-700"
              : "bg-rose-900/50 border border-rose-700"
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            {myAnswer.isCorrect ? (
              <Check className="w-5 h-5 text-emerald-400" />
            ) : (
              <X className="w-5 h-5 text-rose-400" />
            )}
            <span
              className={`font-bold text-lg ${
                myAnswer.isCorrect ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {myAnswer.isCorrect ? "Correct!" : "Wrong"}
            </span>
          </div>
          {myAnswer.isCorrect && (
            <p className="text-white font-black text-3xl">
              +{myAnswer.pointsEarned}
            </p>
          )}
        </div>
      )}
      {!isHost && !myAnswer && (
        <div className="rounded-xl px-5 py-4 text-center bg-card">
          <p className="text-muted-foreground">You didn&apos;t answer in time.</p>
        </div>
      )}

      {/* Host: next button */}
      {isHost && (
        <Button
          onClick={onNext}
          className="self-center font-semibold px-8"
        >
          Next Question →
        </Button>
      )}
    </div>
  );
}

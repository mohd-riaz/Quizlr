"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import TimerBar from "@/components/game/TimerBar";
import AnswerButton, { AnswerState } from "@/components/game/AnswerButton";
import { Button } from "@/components/ui/button";

interface Question {
  _id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface QuestionViewProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  sessionId: string;
  participantId: string;
  questionStartedAt: number;
  timeLimit: number;
  isHost: boolean;
  onEndQuestion: () => void; // host only
}

export default function QuestionView({
  question,
  questionIndex,
  totalQuestions,
  sessionId,
  participantId,
  questionStartedAt,
  timeLimit,
  isHost,
  onEndQuestion,
}: QuestionViewProps) {
  const submitAnswer = useMutation(api.answers.submit);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);

  // Reset per question
  useEffect(() => {
    setSelectedIndex(null);
    setIsSubmitting(false);
    setTimerExpired(false);
  }, [question._id]);

  const handleSelect = async (idx: number) => {
    if (selectedIndex !== null || isSubmitting || timerExpired || isHost) return;
    setSelectedIndex(idx);
    setIsSubmitting(true);
    try {
      await submitAnswer({
        sessionId: sessionId as Id<"sessions">,
        questionId: question._id as Id<"questions">,
        participantId: participantId as Id<"participants">,
        selectedIndex: idx,
      });
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimerExpire = () => {
    setTimerExpired(true);
    if (isHost) onEndQuestion();
  };

  const getState = (idx: number): AnswerState => {
    if (selectedIndex === idx) return "selected";
    return "idle";
  };

  const locked = selectedIndex !== null || timerExpired;

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto px-4 py-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-muted-foreground text-sm">
        <span>
          Question {questionIndex + 1} of {totalQuestions}
        </span>
        {isHost && (
          <span className="text-primary font-medium text-xs uppercase tracking-wide">
            Host view
          </span>
        )}
      </div>

      {/* Timer */}
      <TimerBar
        questionStartedAt={questionStartedAt}
        timeLimit={timeLimit}
        onExpire={handleTimerExpire}
      />

      {/* Question text */}
      <div className="bg-card rounded-2xl px-6 py-5">
        <p className="text-foreground font-semibold text-xl sm:text-2xl leading-snug text-center">
          {question.text}
        </p>
      </div>

      {/* Answer options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options.map((opt, i) => (
          <AnswerButton
            key={i}
            index={i}
            text={opt}
            state={getState(i)}
            onClick={() => handleSelect(i)}
            disabled={isHost || locked}
          />
        ))}
      </div>

      {/* Player feedback */}
      {!isHost && selectedIndex !== null && (
        <p className="text-center text-muted-foreground text-sm animate-pulse">
          Answer submitted — waiting for results…
        </p>
      )}
      {!isHost && timerExpired && selectedIndex === null && (
        <p className="text-center text-destructive text-sm font-medium">
          Time&apos;s up! You didn&apos;t answer in time.
        </p>
      )}

      {isHost && !timerExpired && (
        <Button
          onClick={onEndQuestion}
          className="self-center font-semibold px-6"
        >
          End Early
        </Button>
      )}
    </div>
  );
}

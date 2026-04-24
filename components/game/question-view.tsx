"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import TimerBar from "@/components/game/timer-bar";
import AnswerButton, { AnswerState } from "@/components/game/answer-button";
import { cn } from "@/lib/utils";

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
  totalPlayers?: number;
  onEndQuestion: () => void;
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
  totalPlayers = 0,
  onEndQuestion,
}: QuestionViewProps) {
  const submitAnswer = useMutation(api.answers.submit);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const [remaining, setRemaining] = useState(timeLimit);

  const answeredCount = useQuery(
    api.answers.listBySessionAndQuestion,
    isHost
      ? { sessionId: sessionId as Id<"sessions">, questionId: question._id as Id<"questions"> }
      : "skip"
  )?.length ?? 0;

  useEffect(() => {
    setSelectedIndex(null);
    setIsSubmitting(false);
    setTimerExpired(false);
    setRemaining(timeLimit);
  }, [question._id, timeLimit]);

  const handleSelect = async (idx: number) => {
    if (isHost || selectedIndex !== null || timerExpired || isSubmitting) return;
    setSelectedIndex(idx);
    setIsSubmitting(true);
    try {
      await submitAnswer({
        sessionId: sessionId as Id<"sessions">,
        questionId: question._id as Id<"questions">,
        participantId: participantId as Id<"participants">,
        selectedIndex: idx,
      });
    } catch {}
    finally { setIsSubmitting(false); }
  };

  // Keep latest handleSelect in a ref so the keyboard listener (mounted once) stays fresh
  const handleSelectRef = useRef(handleSelect);
  handleSelectRef.current = handleSelect;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const idx = ["1", "2", "3", "4"].indexOf(e.key);
      if (idx >= 0) handleSelectRef.current(idx);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleTimerExpire = () => {
    setTimerExpired(true);
    if (isHost) onEndQuestion();
  };

  const getState = (idx: number): AnswerState => {
    if (selectedIndex === idx) return "selected";
    if (selectedIndex !== null) return "dimmed";
    return "idle";
  };

  const locked = selectedIndex !== null || timerExpired;
  const secs = Math.ceil(remaining);
  const pct = (remaining / timeLimit) * 100;

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-20">
      {/* Progress header */}
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="font-mono text-muted-foreground">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
        <span className={cn(
          "font-mono font-semibold tabular-nums text-base",
          pct <= 25 ? "text-rose-500" : "text-foreground",
        )}>
          {secs}
        </span>
      </div>

      <div className="mb-8">
        <TimerBar
          questionStartedAt={questionStartedAt}
          timeLimit={timeLimit}
          onExpire={handleTimerExpire}
          onTick={setRemaining}
        />
      </div>

      {/* Question */}
      <div className="bg-card border border-border rounded-xl p-6 md:p-8 mb-5">
        <p className="text-lg md:text-xl font-semibold tracking-tight leading-snug text-center">
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
            state={getState(i)}
            onClick={() => handleSelect(i)}
            disabled={isHost || locked}
            isHost={isHost}
          />
        ))}
      </div>

      {/* Host controls */}
      {isHost && !timerExpired && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={onEndQuestion}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-card text-foreground text-[0.8125rem] font-medium hover:bg-muted transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
            End early
          </button>
          <span className="text-xs font-mono text-muted-foreground">
            {answeredCount} / {totalPlayers} answered
          </span>
        </div>
      )}

      {/* Player keyboard hint */}
      {!isHost && !locked && (
        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground">
          {["1", "2", "3", "4"].map((k) => (
            <span
              key={k}
              className="font-mono text-[0.68rem] border border-b-2 border-border rounded bg-background text-muted-foreground px-[5px] py-px leading-[1.4]"
            >
              {k}
            </span>
          ))}
          <span>to answer</span>
        </div>
      )}

      {/* Player feedback */}
      {!isHost && selectedIndex !== null && (
        <p className="mt-8 text-center text-sm font-mono text-muted-foreground">
          Answer locked in — waiting for results…
        </p>
      )}
      {!isHost && timerExpired && selectedIndex === null && (
        <p className="mt-8 text-center text-sm font-mono text-rose-500">
          Time&apos;s up — no answer submitted.
        </p>
      )}
    </div>
  );
}

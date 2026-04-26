"use client";

import { useState, useEffect, useRef } from "react";
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

interface PracticeQuestionViewProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  timeLimit: number;
  questionStartedAt: number;
  onAnswer: (selectedIndex: number | null, pointsEarned: number) => void;
}

export default function PracticeQuestionView({
  question,
  questionIndex,
  totalQuestions,
  timeLimit,
  questionStartedAt,
  onAnswer,
}: PracticeQuestionViewProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [timerExpired, setTimerExpired] = useState(false);
  const [remaining, setRemaining] = useState(timeLimit);
  const hasAnsweredRef = useRef(false);

  useEffect(() => {
    setSelectedIndex(null);
    setTimerExpired(false);
    setRemaining(timeLimit);
    hasAnsweredRef.current = false;
  }, [question._id, timeLimit]);

  const callOnAnswer = (idx: number | null, points: number) => {
    if (hasAnsweredRef.current) return;
    hasAnsweredRef.current = true;
    onAnswer(idx, points);
  };

  const handleSelect = (idx: number) => {
    if (selectedIndex !== null || timerExpired) return;
    setSelectedIndex(idx);
    const elapsedMs = Date.now() - questionStartedAt;
    const isCorrect = idx === question.correctIndex;
    const points = isCorrect
      ? Math.round(Math.max(400, Math.min(1000, 400 + 600 * (1 - elapsedMs / (timeLimit * 1000)))))
      : 0;
    callOnAnswer(idx, points);
  };

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
    callOnAnswer(null, 0);
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

      <div className="bg-card border border-border rounded-xl p-6 md:p-8 mb-5">
        <p className="text-lg md:text-xl font-semibold tracking-tight leading-snug text-center">
          {question.text}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-2.5">
        {question.options.map((opt, i) => (
          <AnswerButton
            key={i}
            index={i}
            text={opt}
            state={getState(i)}
            onClick={() => handleSelect(i)}
            disabled={locked}
          />
        ))}
      </div>

      {!locked && (
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

      {selectedIndex !== null && (
        <p className="mt-8 text-center text-sm font-mono text-muted-foreground">
          Answer locked in — waiting for results…
        </p>
      )}
      {timerExpired && selectedIndex === null && (
        <p className="mt-8 text-center text-sm font-mono text-rose-500">
          Time&apos;s up — no answer submitted.
        </p>
      )}
    </div>
  );
}

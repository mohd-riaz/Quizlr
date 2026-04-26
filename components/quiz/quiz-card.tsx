"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { timeAgo } from "@/lib/time";

interface QuizCardProps {
  quiz: {
    _id: string;
    title: string;
    description?: string;
    timeLimit: number;
    updatedAt: number;
    questionCount: number;
    practiceCode?: string;
  };
  onHost: (quizId: string) => void;
  onPractice: (quizId: string) => void;
  isHosting?: boolean;
}

export default function QuizCard({ quiz, onHost, onPractice, isHosting }: QuizCardProps) {
  const router = useRouter();
  return (
    <article className="bg-card border border-border rounded-[calc(var(--radius)+4px)] p-5 flex flex-col gap-4 transition-all duration-150 hover:-translate-y-px hover:border-[color-mix(in_oklch,var(--foreground)_25%,var(--border))] hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="leading-tight">
          <h3 className="text-base font-semibold tracking-tight">{quiz.title}</h3>
          {quiz.description && (
            <p className="text-sm mt-1 text-muted-foreground line-clamp-2">{quiz.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-xs font-medium border border-border bg-card text-muted-foreground">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h4zM15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4z" />
          </svg>
          {quiz.questionCount} {quiz.questionCount === 1 ? "question" : "questions"}
        </span>
        <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-xs font-medium border border-border bg-card text-muted-foreground">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
          </svg>
          {quiz.timeLimit}s / question
        </span>
        <span className="ml-auto text-xs font-mono text-muted-foreground">
          updated {timeAgo(quiz.updatedAt)}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onHost(quiz._id)}
          disabled={isHosting}
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-3.5 text-sm font-medium rounded-[var(--radius)] bg-foreground text-background transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
        >
          {isHosting ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" />Starting…</>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
              Host
            </>
          )}
        </button>
        <button
          onClick={() => onPractice(quiz._id)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-3.5 text-sm font-medium rounded-[var(--radius)] bg-card border border-border text-foreground transition-colors hover:bg-muted cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Practice
        </button>
        <button
          onClick={() => router.push(`/quiz/${quiz._id}/edit`)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-3.5 text-sm font-medium rounded-[var(--radius)] bg-card border border-border text-foreground transition-colors hover:bg-muted cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          Edit
        </button>
      </div>
    </article>
  );
}

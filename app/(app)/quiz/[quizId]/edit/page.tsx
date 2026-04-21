"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import QuizEditor from "@/components/quiz/QuizEditor";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditQuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const quiz = useQuery(api.quizzes.getById, {
    quizId: quizId as Id<"quizzes">,
  });

  return (
    <>
      {quiz === undefined ? (
        // Loading
        <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ) : quiz === null ? (
        <div className="max-w-3xl mx-auto px-4 py-16 text-center text-muted-foreground">
          Quiz not found.
        </div>
      ) : (
        <QuizEditor
          quizId={quizId}
          initialTitle={quiz.title}
          initialDescription={quiz.description}
          initialTimeLimit={quiz.timeLimit}
          initialQuestions={quiz.questions}
        />
      )}
    </>
  );
}

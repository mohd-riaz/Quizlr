"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/time";
import { Clock, HelpCircle, Loader2 } from "lucide-react";

interface QuizCardProps {
  quiz: {
    _id: string;
    title: string;
    description?: string;
    timeLimit: number;
    updatedAt: number;
    questionCount: number;
  };
  onHost: (quizId: string) => void;
  isHosting?: boolean;
}

export default function QuizCard({ quiz, onHost, isHosting }: QuizCardProps) {
  const router = useRouter();
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-2">
            {quiz.title}
          </h3>
        </div>
        {quiz.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{quiz.description}</p>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            <HelpCircle className="w-3 h-3" />
            {quiz.questionCount} {quiz.questionCount === 1 ? "question" : "questions"}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <Clock className="w-3 h-3" />
            {quiz.timeLimit}s per question
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Updated {timeAgo(quiz.updatedAt)}
        </p>
      </CardContent>

      <CardFooter className="flex gap-2 pt-2">
        <Button
          className="flex-1 cursor-pointer"
          size="sm"
          onClick={() => onHost(quiz._id)}
          disabled={isHosting}
        >
          {isHosting ? (
            <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Starting…</>
          ) : (
            "Host"
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 cursor-pointer"
          onClick={() => router.push(`/quiz/${quiz._id}/edit`)}
        >
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}

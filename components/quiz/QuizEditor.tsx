"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Loader2, ArrowLeft, Save } from "lucide-react";
import QuestionManager from "@/components/quiz/QuestionManager";
import { QuestionItem } from "@/components/quiz/QuestionCard";

interface ExistingQuestion {
  _id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  order: number;
}

interface QuizEditorProps {
  quizId: string;
  initialTitle: string;
  initialDescription?: string;
  initialTimeLimit: number;
  initialQuestions: ExistingQuestion[];
}

export default function QuizEditor({
  quizId,
  initialTitle,
  initialDescription,
  initialTimeLimit,
  initialQuestions,
}: QuizEditorProps) {
  const router = useRouter();
  const updateQuiz = useMutation(api.quizzes.update);

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription ?? "");
  const [timeLimit, setTimeLimit] = useState(
    initialTimeLimit >= 5 && initialTimeLimit <= 60 ? initialTimeLimit : 20
  );
  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setQuestions(initialQuestions.map((q) => ({
      id: crypto.randomUUID(),
      text: q.text,
      options: q.options as [string, string, string, string],
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!title.trim()) { setSaveError("Title is required."); return; }
    if (questions.length === 0) { setSaveError("Add at least one question before saving."); return; }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) { setSaveError(`Question ${i + 1} has no text.`); return; }
      if (q.options.some((o) => !o.trim())) { setSaveError(`Question ${i + 1} has empty options.`); return; }
    }
    setIsSaving(true);
    setSaveError(null);
    try {
      await updateQuiz({
        quizId: quizId as Id<"quizzes">,
        title: title.trim(),
        description: description.trim() || undefined,
        timeLimit,
        questions: questions.map((q) => ({
          text: q.text,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
        })),
      });
      router.push("/dashboard");
    } catch (err) {
      setSaveError("Something went wrong — please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 pt-12 pb-24">

      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold tracking-tight mb-1">Edit quiz</h1>
      <p className="text-sm text-muted-foreground mb-8">Update details and questions.</p>

      {/* Meta fields */}
      <div className="space-y-5 mb-8">
        <div>
          <label htmlFor="edit-title" className="text-sm font-medium mb-1.5 block">
            Title <span className="text-muted-foreground">*</span>
          </label>
          <Input
            id="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
          />
        </div>

        <div>
          <label htmlFor="edit-desc" className="text-sm font-medium mb-1.5 block">
            Description <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <Textarea
            id="edit-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-3 flex items-center justify-between">
            <span>Time per question</span>
            <span className="font-mono text-sm tabular-nums">{timeLimit}s</span>
          </label>
          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[11px] font-mono mt-2 text-muted-foreground">
            <span>5s</span>
            <span>60s</span>
          </div>
        </div>
      </div>

      {/* Questions heading */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Questions</h2>
          <p className="text-sm text-muted-foreground mt-1">Generate with AI, or add your own.</p>
        </div>
        <span className="inline-flex items-center h-6 px-2.5 rounded-full text-xs font-mono font-medium border border-border bg-card text-muted-foreground">
          {questions.length} {questions.length === 1 ? "question" : "questions"}
        </span>
      </div>

      <QuestionManager
        questions={questions}
        onChange={setQuestions}
        timeLimit={timeLimit}
      />

      {saveError && (
        <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-lg p-3 mt-4">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <div className="flex justify-end mt-10">
        <Button className="cursor-pointer" onClick={handleSave} disabled={isSaving}>
          {isSaving
            ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
            : <><Save className="w-4 h-4" />Save Changes</>}
        </Button>
      </div>
    </div>
  );
}

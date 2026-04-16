"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, Save, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import QuestionCard, {
  QuestionItem,
  createBlankQuestion,
} from "@/components/quiz/QuestionCard";
import { cn } from "@/lib/utils";

const TIME_LIMIT_OPTIONS = [10, 15, 20, 30] as const;
type TimeLimit = (typeof TIME_LIMIT_OPTIONS)[number];

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
  const [timeLimit, setTimeLimit] = useState<TimeLimit>(
    (TIME_LIMIT_OPTIONS.includes(initialTimeLimit as TimeLimit)
      ? initialTimeLimit
      : 20) as TimeLimit
  );
  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Initialise questions from server data
  useEffect(() => {
    const items: QuestionItem[] = initialQuestions.map((q) => ({
      id: crypto.randomUUID(),
      text: q.text,
      options: q.options as [string, string, string, string],
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    }));
    setQuestions(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setQuestions((prev) => {
        const oldIndex = prev.findIndex((q) => q.id === active.id);
        const newIndex = prev.findIndex((q) => q.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const updateQuestion = (index: number, updated: QuestionItem) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
  };

  const deleteQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createBlankQuestion()]);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setSaveError("Title is required.");
      return;
    }
    if (questions.length === 0) {
      setSaveError("Add at least one question before saving.");
      return;
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        setSaveError(`Question ${i + 1} has no text.`);
        return;
      }
      if (q.options.some((o) => !o.trim())) {
        setSaveError(`Question ${i + 1} has empty options.`);
        return;
      }
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
      setSaveError(
        err instanceof Error ? err.message : "Failed to save — try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-slate-500 hover:text-slate-700 transition-colors"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Edit Quiz</h1>
      </div>

      {/* Meta fields */}
      <div className="bg-white border rounded-xl p-5 mb-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-title">Title *</Label>
          <Input
            id="edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-desc">
            Description{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </Label>
          <Textarea
            id="edit-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="resize-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Time per question</Label>
          <div className="flex gap-2">
            {TIME_LIMIT_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setTimeLimit(t)}
                className={cn(
                  "flex-1 py-2 rounded-lg border-2 text-sm font-semibold transition-colors",
                  timeLimit === t
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "border-slate-200 text-slate-600 hover:border-indigo-300"
                )}
              >
                {t}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Question list */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-slate-700">
          Questions ({questions.length})
        </h2>
      </div>

      {questions.length === 0 && (
        <div className="text-center py-12 text-slate-400 text-sm border-2 border-dashed rounded-xl mb-4">
          No questions — add one below.
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3 mb-4">
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                onChange={(updated) => updateQuestion(i, updated)}
                onDelete={() => deleteQuestion(i)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Button
        variant="outline"
        className="cursor-pointer mb-6"
        onClick={addQuestion}
      >
        <PlusCircle className="w-4 h-4 mr-2" />
        Add question
      </Button>

      {saveError && (
        <div className="flex items-start gap-2 text-rose-600 text-sm bg-rose-50 border border-rose-200 rounded-lg p-3 mb-4">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <Separator className="mb-4" />

      <div className="flex justify-end">
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

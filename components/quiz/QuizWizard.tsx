"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
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
import { PlusCircle, Wand2, AlertCircle, Loader2, ArrowLeft, ArrowRight, Check } from "lucide-react";
import QuestionCard, {
  QuestionItem,
  createBlankQuestion,
} from "@/components/quiz/QuestionCard";
import { cn } from "@/lib/utils";

const TIME_LIMIT_OPTIONS = [10, 15, 20, 30] as const;
type TimeLimit = (typeof TIME_LIMIT_OPTIONS)[number];

const STEPS = ["Quiz Details", "Generate Questions", "Review & Edit"];

export default function QuizWizard() {
  const router = useRouter();
  const createQuiz = useMutation(api.quizzes.create);
  const generateQuestions = useAction(api.ai.generateQuestions);

  // Step
  const [step, setStep] = useState(0); // 0-indexed

  // Step 1 state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [timeLimit, setTimeLimit] = useState<TimeLimit>(20);

  // Step 2 state
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Step 3 state
  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // ── Step 1 validation ────────────────────────────────────────
  const step1Valid = title.trim().length > 0;

  // ── Step 2: Generate via AI ──────────────────────────────────
  const handleGenerate = async () => {
    if (!topic.trim()) {
      setGenerateError("Please enter a topic before generating.");
      return;
    }
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const result = await generateQuestions({
        topic: topic.trim(),
        count: questionCount,
        timeLimit,
      });
      const items: QuestionItem[] = result.map((q) => ({
        id: crypto.randomUUID(),
        text: q.text,
        options: q.options as [string, string, string, string],
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      }));
      setQuestions(items);
      setStep(2);
    } catch (err) {
      setGenerateError(
        err instanceof Error ? err.message : "Generation failed — try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // ── Step 3: Question management ──────────────────────────────
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

  // ── Save ─────────────────────────────────────────────────────
  const handleSave = async () => {
    if (questions.length === 0) {
      setSaveError("Add at least one question before saving.");
      return;
    }
    // Basic question validation
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
      await createQuiz({
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
        err instanceof Error ? err.message : "Failed to save quiz — try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors",
                  i < step
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : i === step
                      ? "border-indigo-600 text-indigo-600 bg-white"
                      : "border-slate-300 text-slate-400 bg-white"
                )}
              >
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-sm font-medium hidden sm:block",
                  i === step ? "text-slate-800" : "text-slate-400"
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  i < step ? "bg-indigo-600" : "bg-slate-200"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 1: Quiz Details ─────────────────────────────── */}
      {step === 0 && (
        <div className="flex flex-col gap-5">
          <h2 className="text-xl font-semibold text-slate-800">Quiz Details</h2>

          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g. World Geography"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">
              Description{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="What is this quiz about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
            />
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <Label>
              Number of questions:{" "}
              <span className="font-semibold">{questionCount}</span>
            </Label>
            <input
              type="range"
              min={1}
              max={20}
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>1</span>
              <span>20</span>
            </div>
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

          <div className="flex justify-end mt-2">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
              onClick={() => setStep(1)}
              disabled={!step1Valid}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Generate Questions ───────────────────────── */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <h2 className="text-xl font-semibold text-slate-800">
            Generate Questions
          </h2>
          <p className="text-sm text-slate-500">
            Describe the topic and let AI generate {questionCount} questions for
            you. You&apos;ll be able to edit them in the next step.
          </p>

          <div className="flex flex-col gap-2">
            <Label htmlFor="topic">Topic or content</Label>
            <Textarea
              id="topic"
              placeholder={`e.g. "Basic JavaScript concepts for beginners" or paste a paragraph of text`}
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setGenerateError(null);
              }}
              className="resize-none min-h-[100px]"
            />
          </div>

          {generateError && (
            <div className="flex items-start gap-2 text-rose-600 text-sm bg-rose-50 border border-rose-200 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{generateError}</span>
            </div>
          )}

          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer self-start"
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate with AI
              </>
            )}
          </Button>

          <Separator />

          <div>
            <p className="text-sm text-slate-500 mb-2">
              Or skip AI and add questions manually:
            </p>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => {
                setQuestions([createBlankQuestion()]);
                setStep(2);
              }}
            >
              Add questions manually
            </Button>
          </div>

          <div className="flex justify-start mt-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setStep(0)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Review & Edit ────────────────────────────── */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              Review &amp; Edit Questions
            </h2>
            <span className="text-sm text-slate-500">
              {questions.length} question{questions.length !== 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-sm text-slate-500 -mt-2">
            Click an option letter to mark the correct answer. Drag{" "}
            <span className="font-medium">⠿</span> to reorder.
          </p>

          {questions.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-sm border-2 border-dashed rounded-xl">
              No questions yet — add one below.
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
              <div className="flex flex-col gap-3">
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
            className="cursor-pointer self-start"
            onClick={addQuestion}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add question
          </Button>

          {saveError && (
            <div className="flex items-start gap-2 text-rose-600 text-sm bg-rose-50 border border-rose-200 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setStep(1)}
              disabled={isSaving}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
              onClick={handleSave}
              disabled={isSaving || questions.length === 0}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Save Quiz
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { useAction } from "convex/react";
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
import { Textarea } from "@/components/ui/textarea";
import { Wand2, AlertCircle, Loader2, PlusCircle, X } from "lucide-react";
import QuestionCard, { QuestionItem, createBlankQuestion } from "@/components/quiz/QuestionCard";

interface QuestionManagerProps {
  questions: QuestionItem[];
  onChange: (questions: QuestionItem[]) => void;
  timeLimit: number;
}

export default function QuestionManager({ questions, onChange, timeLimit }: QuestionManagerProps) {
  const generateQuestions = useAction(api.ai.generateQuestions);

  const [topic, setTopic] = useState("");
  const [genCount, setGenCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [pendingReplace, setPendingReplace] = useState(false);

  // Cancel flags — refs so they're readable inside async closures without stale state
  const bulkCancelledRef = useRef(false);
  const cancelledQuestionsRef = useRef<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const runGenerate = async () => {
    if (!topic.trim()) { setGenerateError("Enter a topic first."); return; }
    bulkCancelledRef.current = false;
    setIsGenerating(true);
    setGenerateError(null);
    setPendingReplace(false);
    try {
      const result = await generateQuestions({ topic: topic.trim(), count: genCount, timeLimit });
      if (bulkCancelledRef.current) return;
      onChange(result.map((q) => ({
        id: crypto.randomUUID(),
        text: q.text,
        options: q.options as [string, string, string, string],
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      })));
    } catch {
      if (!bulkCancelledRef.current) setGenerateError("Something went wrong — please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancelBulk = () => {
    bulkCancelledRef.current = true;
    setIsGenerating(false);
  };

  const handleGenerateAll = () => {
    if (questions.length > 0) { setPendingReplace(true); return; }
    runGenerate();
  };

  const handleAiGenerateQuestion = async (questionId: string, index: number, prompt: string) => {
    cancelledQuestionsRef.current.delete(questionId);
    const result = await generateQuestions({ topic: prompt, count: 1, timeLimit });
    if (cancelledQuestionsRef.current.has(questionId)) return;
    const q = result[0];
    const next = [...questions];
    next[index] = {
      ...questions[index],
      text: q.text,
      options: q.options as [string, string, string, string],
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    };
    onChange(next);
  };

  const handleCancelQuestionGen = (questionId: string) => {
    cancelledQuestionsRef.current.add(questionId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);
      onChange(arrayMove(questions, oldIndex, newIndex));
    }
  };

  const updateQuestion = (index: number, updated: QuestionItem) => {
    const next = [...questions];
    next[index] = updated;
    onChange(next);
  };

  return (
    <>
      {/* AI generator card */}
      <div className="bg-card border border-border rounded-[calc(var(--radius)+4px)] p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-7 h-7 rounded-md grid place-items-center flex-shrink-0"
            style={{
              background: "color-mix(in oklch, oklch(0.55 0.18 265) 15%, var(--card))",
              color: "oklch(0.55 0.18 265)",
              border: "1px solid color-mix(in oklch, oklch(0.55 0.18 265) 30%, var(--border))",
            }}
          >
            <Wand2 className="w-3.5 h-3.5" />
          </span>
          <span className="text-sm font-semibold">Generate with AI</span>
        </div>

        <Textarea
          placeholder={`e.g. "Basic JavaScript concepts for beginners" or paste a paragraph of text`}
          value={topic}
          onChange={(e) => { setTopic(e.target.value); setGenerateError(null); setPendingReplace(false); }}
          className="resize-none min-h-[80px] text-sm mb-4"
        />

        <div className="mb-4">
          <label className="text-sm font-medium mb-3 flex items-center justify-between">
            <span>Questions</span>
            <span className="font-mono text-sm tabular-nums">{genCount}</span>
          </label>
          <input
            type="range"
            min={1}
            max={30}
            value={genCount}
            onChange={(e) => setGenCount(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {generateError && (
          <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-3">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{generateError}</span>
          </div>
        )}

        {pendingReplace && !isGenerating && (
          <div className="flex items-center gap-3 bg-muted/60 border border-border rounded-lg px-3 py-2 text-sm mb-3">
            <span className="flex-1 text-muted-foreground">
              This will replace {questions.length} existing question{questions.length !== 1 ? "s" : ""}. Continue?
            </span>
            <button onClick={runGenerate} className="text-destructive font-medium hover:underline cursor-pointer">
              Replace
            </button>
            <button onClick={() => setPendingReplace(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
              Cancel
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button className="cursor-pointer" onClick={handleGenerateAll} disabled={isGenerating || !topic.trim()}>
            {isGenerating
              ? <><Loader2 className="w-4 h-4 animate-spin" />Generating…</>
              : <><Wand2 className="w-4 h-4" />Generate</>}
          </Button>
          {isGenerating && (
            <Button variant="outline" className="cursor-pointer" onClick={handleCancelBulk}>
              <X className="w-4 h-4" />Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {questions.length === 0 && (
        <div className="bg-card border border-dashed border-border rounded-[calc(var(--radius)+4px)] p-10 text-center text-sm text-muted-foreground">
          No questions yet — generate with AI above or add one manually.
        </div>
      )}

      {/* Question list */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2 mb-4">
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                onChange={(updated) => updateQuestion(i, updated)}
                onDelete={() => onChange(questions.filter((_, j) => j !== i))}
                onAiGenerate={(prompt) => handleAiGenerateQuestion(q.id, i, prompt)}
                onAiCancel={() => handleCancelQuestionGen(q.id)}
                defaultTopic={topic}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add question */}
      <button
        onClick={() => onChange([...questions, createBlankQuestion()])}
        className="inline-flex items-center gap-2 h-9 px-3.5 text-sm font-medium rounded-lg border border-border bg-card hover:bg-muted transition-colors cursor-pointer mt-4"
      >
        <PlusCircle className="w-4 h-4" />
        Add question
      </button>
    </>
  );
}

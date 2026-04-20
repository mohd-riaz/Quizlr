"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, ChevronDown, ChevronUp, Wand2, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function AutoInput({ value, onChange, placeholder, className }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);
  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "flex w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none overflow-hidden leading-snug",
        className
      )}
    />
  );
}

export interface QuestionItem {
  id: string;
  text: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation?: string;
}

const OPTION_COLORS = [
  "bg-transparent border-border text-muted-foreground",
  "bg-transparent border-border text-muted-foreground",
  "bg-transparent border-border text-muted-foreground",
  "bg-transparent border-border text-muted-foreground",
];

const OPTION_CORRECT_COLORS = [
  "bg-green-500 border-green-600 text-white",
  "bg-green-500 border-green-600 text-white",
  "bg-green-500 border-green-600 text-white",
  "bg-green-500 border-green-600 text-white",
];

const OPTION_LABELS = ["A", "B", "C", "D"];

interface QuestionCardProps {
  question: QuestionItem;
  index: number;
  onChange: (updated: QuestionItem) => void;
  onDelete: () => void;
  onAiGenerate?: (prompt: string) => Promise<void>;
  defaultTopic?: string;
}

export default function QuestionCard({
  question,
  index,
  onChange,
  onDelete,
  onAiGenerate,
  defaultTopic = "",
}: QuestionCardProps) {
  const [showExplanation, setShowExplanation] = useState(!!question.explanation);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const updateOption = (idx: number, value: string) => {
    const newOptions = [...question.options] as [string, string, string, string];
    newOptions[idx] = value;
    onChange({ ...question, options: newOptions });
  };

  const handleOpenAiPanel = () => {
    if (!showAiPanel) setAiPrompt(defaultTopic);
    setShowAiPanel((v) => !v);
  };

  const handleAiGenerate = async () => {
    if (!onAiGenerate || !aiPrompt.trim()) return;
    setIsAiGenerating(true);
    try {
      await onAiGenerate(aiPrompt.trim());
      setShowAiPanel(false);
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-card border border-border rounded-xl p-4",
        isDragging && "opacity-50 shadow-lg ring-2 ring-primary/50"
      )}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-muted-foreground">Question {index + 1}</p>
        <div className="flex items-center gap-1">
          {onAiGenerate && (
            <button
              onClick={handleOpenAiPanel}
              className={cn(
                "p-1 transition-colors",
                showAiPanel
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Generate with AI"
              title="Generate with AI"
            >
              <Wand2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
            aria-label="Delete question"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            {...attributes}
            {...listeners}
            className="p-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
      <Textarea
        value={question.text}
        onChange={(e) => onChange({ ...question, text: e.target.value })}
        placeholder="Enter your question…"
        className="text-sm resize-none min-h-[60px] mb-3"
      />

      {/* AI panel */}
      {showAiPanel && onAiGenerate && (
        <div className="mb-3 flex flex-col gap-2 bg-muted/40 border border-border rounded-lg p-3">
          <p className="text-xs font-medium text-muted-foreground">
            Describe what this question should be about
          </p>
          <Textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g. The causes of World War I — focus on the assassination of Franz Ferdinand"
            className="text-sm resize-none min-h-[60px]"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAiGenerate}
              disabled={isAiGenerating || !aiPrompt.trim()}
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-md bg-foreground text-background hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
            >
              {isAiGenerating ? (
                <><Loader2 className="w-3 h-3 animate-spin" />Generating…</>
              ) : (
                <><Wand2 className="w-3 h-3" />Generate</>
              )}
            </button>
            <button
              onClick={() => setShowAiPanel(false)}
              className="inline-flex items-center h-8 px-3 text-xs font-medium rounded-md border border-border hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        {question.options.map((opt, i) => {
          const isCorrect = question.correctIndex === i;
          return (
            <div key={i} className="flex items-center gap-2">
              <button
                onClick={() => onChange({ ...question, correctIndex: i })}
                className={cn(
                  "flex-shrink-0 w-7 h-7 rounded-md border-2 text-xs font-bold transition-colors cursor-pointer",
                  isCorrect ? OPTION_CORRECT_COLORS[i] : OPTION_COLORS[i]
                )}
                title={isCorrect ? "Correct answer" : "Set as correct"}
              >
                {OPTION_LABELS[i]}
              </button>
              <AutoInput
                value={opt}
                onChange={(v) => updateOption(i, v)}
                placeholder={`Option ${OPTION_LABELS[i]}`}
                className="text-sm min-h-8"
              />
            </div>
          );
        })}
      </div>

      {/* Explanation toggle */}
      <div>
        <button
          onClick={() => setShowExplanation((v) => !v)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-1"
        >
          {showExplanation ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {showExplanation ? "Hide explanation" : "Add explanation (optional)"}
        </button>
        {showExplanation && (
          <AutoInput
            value={question.explanation ?? ""}
            onChange={(v) => onChange({ ...question, explanation: v || undefined })}
            placeholder="Explain the correct answer…"
            className="text-sm min-h-8"
          />
        )}
      </div>
    </div>
  );
}

export function createBlankQuestion(): QuestionItem {
  return {
    id: crypto.randomUUID(),
    text: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: undefined,
  };
}

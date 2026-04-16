"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface QuestionItem {
  id: string;
  text: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation?: string;
}

const OPTION_COLORS = [
  "bg-red-100 border-red-300 text-red-800",
  "bg-blue-100 border-blue-300 text-blue-800",
  "bg-yellow-100 border-yellow-300 text-yellow-800",
  "bg-green-100 border-green-300 text-green-800",
];

const OPTION_CORRECT_COLORS = [
  "bg-red-500 border-red-600 text-white",
  "bg-blue-500 border-blue-600 text-white",
  "bg-yellow-500 border-yellow-600 text-white",
  "bg-green-500 border-green-600 text-white",
];

const OPTION_LABELS = ["A", "B", "C", "D"];

interface QuestionCardProps {
  question: QuestionItem;
  index: number;
  onChange: (updated: QuestionItem) => void;
  onDelete: () => void;
}

export default function QuestionCard({
  question,
  index,
  onChange,
  onDelete,
}: QuestionCardProps) {
  const [showExplanation, setShowExplanation] = useState(
    !!question.explanation
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const updateOption = (idx: number, value: string) => {
    const newOptions = [...question.options] as [
      string,
      string,
      string,
      string,
    ];
    newOptions[idx] = value;
    onChange({ ...question, options: newOptions });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white border rounded-xl p-4 shadow-sm",
        isDragging && "opacity-50 shadow-lg ring-2 ring-indigo-300"
      )}
    >
      {/* Header row */}
      <div className="flex items-start gap-2 mb-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-1 p-1 text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Question number + text */}
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-400 mb-1">
            Question {index + 1}
          </p>
          <Textarea
            value={question.text}
            onChange={(e) => onChange({ ...question, text: e.target.value })}
            placeholder="Enter your question…"
            className="text-sm resize-none min-h-[60px]"
          />
        </div>

        {/* Delete */}
        <button
          onClick={onDelete}
          className="mt-1 p-1 text-slate-400 hover:text-rose-500 transition-colors"
          aria-label="Delete question"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 ml-6">
        {question.options.map((opt, i) => {
          const isCorrect = question.correctIndex === i;
          return (
            <div key={i} className="flex items-center gap-2">
              {/* Correct-answer toggle */}
              <button
                onClick={() => onChange({ ...question, correctIndex: i })}
                className={cn(
                  "flex-shrink-0 w-7 h-7 rounded-md border-2 text-xs font-bold transition-colors",
                  isCorrect
                    ? OPTION_CORRECT_COLORS[i]
                    : OPTION_COLORS[i]
                )}
                title={isCorrect ? "Correct answer" : "Set as correct"}
              >
                {OPTION_LABELS[i]}
              </button>
              <Input
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`Option ${OPTION_LABELS[i]}`}
                className="text-sm h-8"
              />
            </div>
          );
        })}
      </div>

      {/* Explanation toggle */}
      <div className="ml-6">
        <button
          onClick={() => setShowExplanation((v) => !v)}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 mb-1"
        >
          {showExplanation ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
          {showExplanation ? "Hide explanation" : "Add explanation (optional)"}
        </button>
        {showExplanation && (
          <Input
            value={question.explanation ?? ""}
            onChange={(e) =>
              onChange({ ...question, explanation: e.target.value || undefined })
            }
            placeholder="Explain the correct answer…"
            className="text-sm h-8"
          />
        )}
      </div>
    </div>
  );
}

// Blank question factory
export function createBlankQuestion(): QuestionItem {
  return {
    id: crypto.randomUUID(),
    text: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    explanation: undefined,
  };
}

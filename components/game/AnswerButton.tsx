import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

export type AnswerState = "idle" | "selected" | "correct" | "wrong" | "reveal";

const SHAPES = ["▲", "◆", "●", "■"];

const BASE_COLORS = [
  "bg-rose-500 hover:bg-rose-600 border-rose-700",
  "bg-blue-500 hover:bg-blue-600 border-blue-700",
  "bg-yellow-400 hover:bg-yellow-500 border-yellow-600",
  "bg-emerald-500 hover:bg-emerald-600 border-emerald-700",
];

const DIMMED_COLORS = [
  "bg-rose-800/50 border-rose-900 opacity-60",
  "bg-blue-800/50 border-blue-900 opacity-60",
  "bg-yellow-800/50 border-yellow-900 opacity-60",
  "bg-emerald-800/50 border-emerald-900 opacity-60",
];

interface AnswerButtonProps {
  index: number;
  text: string;
  state: AnswerState;
  onClick?: () => void;
  disabled?: boolean;
}

export default function AnswerButton({
  index,
  text,
  state,
  onClick,
  disabled,
}: AnswerButtonProps) {
  const isCorrect = state === "correct";
  const isWrong = state === "wrong";
  const isDimmed = state === "reveal" || (state === "idle" && disabled);

  return (
    <button
      onClick={onClick}
      disabled={disabled || state !== "idle"}
      className={cn(
        "w-full min-h-[72px] rounded-xl border-b-4 px-4 py-3 flex items-center gap-3",
        "text-white font-semibold text-left transition-all duration-150",
        "disabled:cursor-not-allowed",
        isDimmed ? DIMMED_COLORS[index] : BASE_COLORS[index],
        isCorrect && "ring-4 ring-white/70 opacity-100",
        isWrong && "ring-4 ring-white/30",
        state === "selected" && "ring-4 ring-white/70"
      )}
    >
      <span className="text-xl select-none w-6 flex-shrink-0">
        {SHAPES[index]}
      </span>
      <span className="flex-1 text-sm sm:text-base leading-snug">{text}</span>
      {isCorrect && <Check className="w-5 h-5 flex-shrink-0" />}
      {isWrong && <X className="w-5 h-5 flex-shrink-0" />}
    </button>
  );
}

import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

export type AnswerState = "idle" | "selected" | "dimmed" | "correct" | "wrong";

const LETTERS = ["A", "B", "C", "D"];

const TILE = [
  {
    stripe: "bg-rose-500",
    tint: "bg-rose-500/10",
    tintSelected: "bg-rose-500/20",
    label: "text-rose-500",
    borderSelected: "border-rose-500/60",
    hover: "enabled:hover:-translate-y-px enabled:hover:border-rose-500/50",
  },
  {
    stripe: "bg-blue-500",
    tint: "bg-blue-500/10",
    tintSelected: "bg-blue-500/20",
    label: "text-blue-500",
    borderSelected: "border-blue-500/60",
    hover: "enabled:hover:-translate-y-px enabled:hover:border-blue-500/50",
  },
  {
    stripe: "bg-amber-400",
    tint: "bg-amber-400/10",
    tintSelected: "bg-amber-400/20",
    label: "text-amber-500",
    borderSelected: "border-amber-400/60",
    hover: "enabled:hover:-translate-y-px enabled:hover:border-amber-400/50",
  },
  {
    stripe: "bg-emerald-500",
    tint: "bg-emerald-500/10",
    tintSelected: "bg-emerald-500/20",
    label: "text-emerald-600",
    borderSelected: "border-emerald-500/60",
    hover: "enabled:hover:-translate-y-px enabled:hover:border-emerald-500/50",
  },
] as const;

interface AnswerButtonProps {
  index: number;
  text: string;
  state: AnswerState;
  onClick?: () => void;
  disabled?: boolean;
  isHost?: boolean;
}

export default function AnswerButton({
  index,
  text,
  state,
  onClick,
  disabled,
  isHost = false,
}: AnswerButtonProps) {
  const tile = TILE[index];
  const isSelected = state === "selected";
  const isCorrect = state === "correct";
  const isWrong = state === "wrong";
  const isDimmed = state === "dimmed";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative overflow-hidden w-full min-h-16 rounded-lg",
        "border bg-card text-left",
        isSelected ? tile.borderSelected : "border-border",
        "transition-[transform,border-color,opacity] duration-150",
        !isSelected && tile.hover,
        isDimmed && "opacity-45",
        isSelected && "-translate-y-0.5",
        "disabled:cursor-default",
      )}
    >
      {/* Tint overlay */}
      <div className={cn("absolute inset-0 pointer-events-none", isSelected ? tile.tintSelected : tile.tint)} />
      {/* Left stripe */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-[3px]", tile.stripe)} />
      {/* Content */}
      <div className="relative z-10 flex items-center gap-3.5 pl-5 pr-4 py-4">
        <span className={cn("font-mono text-[13px] font-semibold w-3.5 text-center shrink-0", tile.label)}>
          {LETTERS[index]}
        </span>
        <span className={cn(
          "flex-1 font-medium text-[15px] leading-snug",
          isHost ? "text-muted-foreground" : "text-foreground",
        )}>
          {text}
        </span>
        {!isHost && !isCorrect && !isWrong && (
          <span className="font-mono text-[0.68rem] border border-b-2 border-border rounded bg-background text-muted-foreground px-[5px] py-px leading-[1.4] shrink-0">
            {index + 1}
          </span>
        )}
        {isCorrect && <Check className="w-4 h-4 shrink-0 text-emerald-500" />}
        {isWrong && <X className="w-4 h-4 shrink-0 text-rose-500" />}
      </div>
    </button>
  );
}

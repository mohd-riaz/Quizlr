"use client";

import { useRef, useState, useCallback, KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowRight } from "lucide-react";

export default function JoinPage() {
  const router = useRouter();
  const convex = useConvex();

  const [values, setValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const [joining, setJoining] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const allFilled = values.every((v) => v.length === 1);
  const filledCount = values.filter((v) => v.length === 1).length;

  const updateValue = useCallback((index: number, char: string) => {
    setError(false);
    setValues((prev) => {
      const next = [...prev];
      next[index] = char.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 1);
      return next;
    });
  }, []);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(-1);
    updateValue(index, char);
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
    if (e.key === "Enter" && allFilled) {
      handleJoin();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z0-9]/g, "");
    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < 6; i++) next[i] = text[i] ?? "";
    setValues(next);
    setError(false);
    const focusIdx = Math.min(text.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleJoin = async () => {
    if (!allFilled || joining) return;
    const code = values.join("");
    setJoining(true);
    setError(false);
    try {
      const session = await convex.query(api.sessions.getByJoinCode, { joinCode: code });
      if (!session) {
        setError(true);
        inputRefs.current[0]?.focus();
        return;
      }
      router.push(`/game/${session._id}`);
    } catch {
      setError(true);
    } finally {
      setJoining(false);
    }
  };

  const statusText = () => {
    if (allFilled) return `ready to join · ${values.join("")}`;
    if (filledCount === 0) return "waiting for code…";
    return `${filledCount} / 6 characters`;
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-border bg-background/80">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-[17px] font-bold tracking-tight">
            Quiz<span className="text-muted-foreground">lr</span>
          </span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 pt-20 pb-24">
        {/* Hero */}
        <div className="text-center mb-10">
          {/* <div className="inline-flex items-center gap-2 border border-border bg-card text-muted-foreground rounded-full text-xs font-medium px-2.5 h-6 mb-5">
            <span className="relative inline-flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-green-500" />
            </span>
            Live sessions
          </div> */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Join a quiz.
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-character code from your host.
          </p>
        </div>

        {/* Code input */}
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <CodeTile
                key={i}
                index={i}
                value={values[i]}
                error={error}
                inputRef={(el) => { inputRefs.current[i] = el; }}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                autoFocus={i === 0}
              />
            ))}
            <span className="mx-1 text-muted-foreground select-none">–</span>
            {[3, 4, 5].map((i) => (
              <CodeTile
                key={i}
                index={i}
                value={values[i]}
                error={error}
                inputRef={(el) => { inputRefs.current[i] = el; }}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
              />
            ))}
          </div>

          <div className="text-center text-xs font-mono text-muted-foreground">
            <span className={allFilled ? "text-foreground" : ""}>
              {statusText()}
            </span>
          </div>

          {error && (
            <p className="text-destructive text-sm text-center -mt-3">
              No active session found with that code.
            </p>
          )}

          <button
            onClick={handleJoin}
            disabled={!allFilled || joining}
            className="w-full h-11 rounded-[10px] bg-foreground text-background font-medium text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {joining ? "Joining…" : (
              <>
                Join
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </>
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            Don&apos;t have a code?{" "}
            <span className="text-foreground">
              Ask your host
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}

interface CodeTileProps {
  index: number;
  value: string;
  error: boolean;
  inputRef: (el: HTMLInputElement | null) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: ClipboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
}

function CodeTile({ value, error, inputRef, onChange, onKeyDown, onPaste, autoFocus }: CodeTileProps) {
  const filled = value.length === 1;

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      maxLength={2}
      autoFocus={autoFocus}
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      inputMode="text"
      className={[
        "w-13 h-16 rounded-[10px] border bg-card text-foreground",
        "font-mono font-semibold text-2xl text-center uppercase",
        "outline-none transition-all duration-150 select-none",
        "focus:border-foreground focus:shadow-[0_0_0_3px_oklch(from_var(--foreground)_l_c_h/0.1)]",
        filled && !error ? "border-foreground/40" : "border-border",
        error ? "border-red-500 animate-[shake_0.35s_ease]" : "",
      ].filter(Boolean).join(" ")}
      style={error ? { animation: "shake 0.35s ease" } : undefined}
    />
  );
}

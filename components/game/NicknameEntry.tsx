"use client";

import { useState, KeyboardEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ArrowRight } from "lucide-react";

interface NicknameEntryProps {
  sessionId: string;
  quizTitle: string;
  onJoined: (participantId: string, nickname: string) => void;
}

export default function NicknameEntry({
  sessionId,
  quizTitle,
  onJoined,
}: NicknameEntryProps) {
  const joinSession = useMutation(api.participants.join);
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  const canSubmit = nickname.trim().length > 0;

  const handleJoin = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) { setError("Please enter a nickname."); return; }
    if (trimmed.length > 24) { setError("Nickname must be 24 characters or fewer."); return; }
    setIsJoining(true);
    setError(null);
    try {
      const participantId = await joinSession({
        sessionId: sessionId as Id<"sessions">,
        nickname: trimmed,
      });
      localStorage.setItem(`quizlr_participant_${sessionId}`, participantId);
      onJoined(participantId, trimmed);
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-border bg-background/80">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center">
          <span className="text-[17px] font-bold tracking-tight">
            Quiz<span className="text-muted-foreground">lr</span>
          </span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 pt-20 pb-24">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Join the game.
          </h1>
          <p className="text-sm text-muted-foreground truncate max-w-xs mx-auto">
            {quizTitle}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Your nickname…"
              value={nickname}
              onChange={(e) => { setNickname(e.target.value.slice(0, 24)); setError(null); }}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && canSubmit && handleJoin()}
              autoFocus
              autoComplete="off"
              className="w-full h-14 rounded-[10px] border border-border bg-card text-foreground text-center text-lg font-semibold placeholder:text-muted-foreground placeholder:font-normal outline-none focus:border-foreground focus:shadow-[0_0_0_3px_oklch(from_var(--foreground)_l_c_h_/_0.1)] transition-all duration-150"
            />
            <div className="text-center text-xs font-mono text-muted-foreground">
              {nickname.trim().length === 0 ? (
                "choose a name your opponents will fear"
              ) : (
                <span className="text-foreground">{nickname.trim()}</span>
              )}
            </div>
          </div>

          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleJoin}
            disabled={!canSubmit || isJoining}
            className="w-full h-11 rounded-[10px] bg-foreground text-background font-medium text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isJoining ? "Joining…" : (
              <>
                Join Game
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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

  const handleJoin = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      setError("Please enter a nickname.");
      return;
    }
    if (trimmed.length > 24) {
      setError("Nickname must be 24 characters or fewer.");
      return;
    }
    setIsJoining(true);
    setError(null);
    try {
      const participantId = await joinSession({
        sessionId: sessionId as Id<"sessions">,
        nickname: trimmed,
      });
      // Persist to localStorage
      localStorage.setItem(`quizlr_participant_${sessionId}`, participantId);
      onJoined(participantId, trimmed);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to join — try again."
      );
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-black text-foreground mb-1">
            Quiz<span className="text-primary">lr</span>
          </h1>
          <p className="text-foreground font-semibold text-lg">{quizTitle}</p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nickname" className="text-foreground">
              Your nickname
            </Label>
            <Input
              id="nickname"
              placeholder="e.g. QuizMaster99"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              maxLength={24}
              autoFocus
              className="text-center text-lg font-semibold"
            />
          </div>
          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}
          <Button
            onClick={handleJoin}
            disabled={isJoining || !nickname.trim()}
            className="w-full font-bold text-lg py-6"
            size="lg"
          >
            {isJoining ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Joining…
              </>
            ) : (
              "Join Game"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

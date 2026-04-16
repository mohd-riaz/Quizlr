"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          <h1 className="text-4xl font-black text-white mb-1">
            Quiz<span className="text-indigo-400">lr</span>
          </h1>
          <p className="text-slate-300 font-semibold text-lg">{quizTitle}</p>
        </div>

        {/* Form */}
        <div className="bg-slate-800 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nickname" className="text-slate-300">
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
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 text-center text-lg font-semibold"
            />
          </div>
          {error && (
            <p className="text-rose-400 text-sm text-center">{error}</p>
          )}
          <button
            onClick={handleJoin}
            disabled={isJoining || !nickname.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-lg py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isJoining ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Joining…
              </>
            ) : (
              "Join Game"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

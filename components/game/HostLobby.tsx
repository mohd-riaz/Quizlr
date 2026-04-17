"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import JoinCodeDisplay from "@/components/game/JoinCodeDisplay";
import ParticipantList from "@/components/game/ParticipantList";
import { Button } from "@/components/ui/button";
import { Users, Play } from "lucide-react";

interface Participant {
  _id: string;
  nickname: string;
  isHost: boolean;
  score: number;
}

interface HostLobbyProps {
  sessionId: string;
  joinCode: string;
  quizTitle: string;
  questionCount: number;
  participants: Participant[];
}

export default function HostLobby({
  sessionId,
  joinCode,
  quizTitle,
  questionCount,
  participants,
}: HostLobbyProps) {
  const startSession = useMutation(api.sessions.start);
  const playerCount = participants.filter((p) => !p.isHost).length;

  const handleStart = async () => {
    try {
      await startSession({ sessionId: sessionId as Id<"sessions"> });
    } catch (err) {
      console.error("Failed to start session:", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto px-4 py-10">
      {/* Quiz title */}
      <div className="text-center">
        <p className="text-muted-foreground text-sm uppercase tracking-widest mb-1">
          Hosting
        </p>
        <h1 className="text-foreground text-3xl font-black">{quizTitle}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {questionCount} question{questionCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Join code */}
      <JoinCodeDisplay joinCode={joinCode} sessionId={sessionId} />

      {/* Participant list */}
      <div className="w-full bg-card rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground text-sm font-medium">Players</span>
        </div>
        <ParticipantList participants={participants} />
      </div>

      {/* Start button */}
      <Button
        onClick={handleStart}
        disabled={playerCount === 0}
        className="w-full flex items-center justify-center gap-3 font-bold text-lg py-6 rounded-2xl"
        size="lg"
      >
        <Play className="w-5 h-5" />
        Start Quiz
      </Button>
      {playerCount === 0 && (
        <p className="text-muted-foreground text-sm -mt-4 text-center">
          Waiting for at least one player to join
        </p>
      )}
    </div>
  );
}

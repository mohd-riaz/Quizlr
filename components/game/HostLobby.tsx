"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import JoinCodeDisplay from "@/components/game/JoinCodeDisplay";
import ParticipantList from "@/components/game/ParticipantList";
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
        <p className="text-slate-400 text-sm uppercase tracking-widest mb-1">
          Hosting
        </p>
        <h1 className="text-white text-3xl font-black">{quizTitle}</h1>
        <p className="text-slate-400 text-sm mt-1">
          {questionCount} question{questionCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Join code */}
      <JoinCodeDisplay joinCode={joinCode} sessionId={sessionId} />

      {/* Participant list */}
      <div className="w-full bg-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400 text-sm font-medium">Players</span>
        </div>
        <ParticipantList participants={participants} />
      </div>

      {/* Start button */}
      <button
        onClick={handleStart}
        disabled={playerCount === 0}
        className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-2xl transition-colors"
      >
        <Play className="w-5 h-5" />
        Start Quiz
      </button>
      {playerCount === 0 && (
        <p className="text-slate-500 text-sm -mt-4 text-center">
          Waiting for at least one player to join
        </p>
      )}
    </div>
  );
}

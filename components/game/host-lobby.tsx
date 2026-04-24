"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

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
  const [copied, setCopied] = useState(false);
  const players = participants.filter((p) => !p.isHost);

  const handleStart = async () => {
    try { await startSession({ sessionId: sessionId as Id<"sessions"> }); } catch {}
  };

  const handleCopy = async () => {
    const url = `${window.location.origin}/game/${sessionId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto px-6 pt-12 pb-20">
      {/* Quiz title */}
      <div className="text-center mb-8">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Hosting
        </span>
        <h1 className="text-2xl font-bold tracking-tight mt-1">{quizTitle}</h1>
        <p className="text-sm text-muted-foreground mt-1 font-mono">
          {questionCount} question{questionCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Join code */}
      <div className="bg-card border border-border rounded-xl p-6 text-center mb-4">
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">
          Join code
        </p>
        <span className="font-mono text-5xl font-black tracking-[0.2em] text-foreground select-all">
          {joinCode}
        </span>
        <div className="mt-4">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Link copied!
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy join link
              </>
            )}
          </button>
        </div>
      </div>

      {/* Players */}
      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <p className="font-mono text-xs text-muted-foreground mb-3">
          {players.length} player{players.length !== 1 ? "s" : ""} joined
        </p>
        {players.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">Waiting for players to join…</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {players.map((p) => (
              <span
                key={p._id}
                className="inline-flex items-center h-6 px-2.5 rounded-full text-xs font-medium font-mono border border-border bg-muted text-foreground"
              >
                {p.nickname}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Start */}
      <button
        onClick={handleStart}
        disabled={players.length === 0}
        className="w-full h-11 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Start quiz
      </button>
      {players.length === 0 && (
        <p className="mt-3 text-center text-xs font-mono text-muted-foreground">
          Waiting for at least one player to join
        </p>
      )}
    </div>
  );
}

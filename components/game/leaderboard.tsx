"use client";

import { useRouter } from "next/navigation";

interface Participant {
  _id: string;
  nickname: string;
  isHost: boolean;
  score: number;
}

interface LeaderboardProps {
  participants: Participant[];
  participantId: string;
  isHost: boolean;
  isFinal: boolean;
  onHostAgain?: () => void;
}

const RANK_COLORS = ["text-amber-500", "text-zinc-400", "text-amber-700"];

export default function Leaderboard({
  participants,
  participantId,
  isHost,
  isFinal,
  onHostAgain,
}: LeaderboardProps) {
  const router = useRouter();
  const players = participants
    .filter((p) => !p.isHost)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-20">
      <div className="mb-8 text-center">
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
          {isFinal ? "Final results" : "Leaderboard"}
        </span>
        <h2 className="text-2xl font-bold tracking-tight mt-1">
          {isFinal ? "The results are in." : "Current standings"}
        </h2>
      </div>

      {players.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground font-mono">No players yet.</p>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {players.map((p, i) => {
            const isMe = p._id === participantId;
            return (
              <div
                key={p._id}
                className={[
                  "flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0",
                  isMe ? "bg-muted/60" : "",
                ].join(" ")}
              >
                <span className={[
                  "font-mono font-bold text-sm w-5 text-right shrink-0 tabular-nums",
                  RANK_COLORS[i] ?? "text-muted-foreground",
                ].join(" ")}>
                  {i + 1}
                </span>
                <span className="flex-1 font-medium text-sm text-foreground truncate">
                  {p.nickname}
                  {isMe && (
                    <span className="text-muted-foreground font-normal"> · you</span>
                  )}
                </span>
                <span className="font-mono font-semibold text-sm tabular-nums text-foreground">
                  {p.score.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {isFinal && (
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          {isHost && onHostAgain && (
            <button
              onClick={onHostAgain}
              className="w-full h-11 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Back to dashboard
            </button>
          )}
          {!isHost && (
            <button
              onClick={() => router.push("/")}
              className="w-full h-11 rounded-lg border border-border bg-transparent text-foreground text-sm font-medium hover:bg-muted transition-colors"
            >
              Exit
            </button>
          )}
        </div>
      )}
    </div>
  );
}

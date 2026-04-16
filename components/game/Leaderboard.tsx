"use client";

import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";

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

const MEDAL_COLORS = ["text-yellow-400", "text-slate-300", "text-amber-600"];
const PODIUM_BG = [
  "bg-yellow-500/20 border-yellow-500/40",
  "bg-slate-500/20 border-slate-500/40",
  "bg-amber-600/20 border-amber-600/40",
];

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

  const podium = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-center gap-3">
        <Trophy className="w-7 h-7 text-yellow-400" />
        <h2 className="text-white text-2xl font-black">
          {isFinal ? "Final Results" : "Leaderboard"}
        </h2>
        <Trophy className="w-7 h-7 text-yellow-400" />
      </div>

      {/* Podium */}
      {podium.length > 0 && (
        <div className="flex gap-3">
          {podium.map((p, i) => (
            <div
              key={p._id}
              className={`flex-1 flex flex-col items-center gap-2 rounded-xl border px-3 py-4 ${PODIUM_BG[i]} ${
                p._id === participantId ? "ring-2 ring-white/50" : ""
              }`}
            >
              <span className={`text-2xl font-black ${MEDAL_COLORS[i]}`}>
                #{i + 1}
              </span>
              <span className="text-white font-semibold text-sm text-center truncate w-full text-center">
                {p.nickname}
                {p._id === participantId && " (you)"}
              </span>
              <span className="text-slate-300 font-bold tabular-nums">
                {p.score.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Rest */}
      {rest.length > 0 && (
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          {rest.map((p, i) => (
            <div
              key={p._id}
              className={`flex items-center gap-3 px-4 py-3 border-b border-slate-700 last:border-0 ${
                p._id === participantId ? "bg-indigo-900/40" : ""
              }`}
            >
              <span className="text-slate-400 w-6 text-sm tabular-nums">
                #{i + 4}
              </span>
              <span className="flex-1 text-white font-medium text-sm">
                {p.nickname}
                {p._id === participantId && (
                  <span className="text-slate-400"> (you)</span>
                )}
              </span>
              <span className="text-slate-300 font-bold tabular-nums text-sm">
                {p.score.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {players.length === 0 && (
        <p className="text-center text-slate-500 text-sm">No players yet.</p>
      )}

      {/* Actions */}
      {isFinal && (
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          {isHost && onHostAgain && (
            <button
              onClick={onHostAgain}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Host Again
            </button>
          )}
          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {isHost ? "Dashboard" : "Exit"}
          </button>
        </div>
      )}
    </div>
  );
}

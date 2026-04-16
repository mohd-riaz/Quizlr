"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import NicknameEntry from "@/components/game/NicknameEntry";
import HostLobby from "@/components/game/HostLobby";
import PlayerWaiting from "@/components/game/PlayerWaiting";
import QuestionView from "@/components/game/QuestionView";
import ScoreReveal from "@/components/game/ScoreReveal";
import Leaderboard from "@/components/game/Leaderboard";

export default function GamePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();

  // LocalStorage participant ID
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`quizlr_participant_${sessionId}`);
    if (stored) setParticipantId(stored);
    setMounted(true);
  }, [sessionId]);

  // ── Convex subscriptions ─────────────────────────────────────────────────
  const session = useQuery(api.sessions.getById, {
    sessionId: sessionId as Id<"sessions">,
  });
  const quiz = useQuery(
    api.quizzes.getById,
    session ? { quizId: session.quizId } : "skip"
  );
  const participants = useQuery(api.participants.listBySession, {
    sessionId: sessionId as Id<"sessions">,
  });
  const participant = useQuery(
    api.participants.getById,
    participantId ? { participantId: participantId as Id<"participants"> } : "skip"
  );

  // ── Mutations ────────────────────────────────────────────────────────────
  const endQuestion = useMutation(api.sessions.endQuestion);
  const advanceQuestion = useMutation(api.sessions.advanceQuestion);

  const handleEndQuestion = async () => {
    try {
      await endQuestion({ sessionId: sessionId as Id<"sessions"> });
    } catch (err) {
      console.error("endQuestion error:", err);
    }
  };

  const handleAdvanceQuestion = async () => {
    try {
      await advanceQuestion({ sessionId: sessionId as Id<"sessions"> });
    } catch (err) {
      console.error("advanceQuestion error:", err);
    }
  };

  const handleHostAgain = () => {
    if (quiz) router.push(`/dashboard`);
  };

  // ── Handle NicknameEntry join ────────────────────────────────────────────
  const handleJoined = (pid: string, nick: string) => {
    setParticipantId(pid);
    setNickname(nick);
  };

  // ── Render guards ────────────────────────────────────────────────────────
  if (!mounted || session === undefined || participants === undefined) {
    return <GameShell>{null}</GameShell>;
  }

  if (session === null) {
    return (
      <GameShell>
        <div className="text-center py-20 text-slate-400">
          Session not found.
        </div>
      </GameShell>
    );
  }

  // No participant stored and session is no longer in lobby
  if (!participantId && session.status !== "lobby") {
    return (
      <GameShell>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
          <p className="text-slate-300 text-center text-lg font-semibold">
            This session has already started.
          </p>
          <button
            onClick={() => router.push("/")}
            className="text-indigo-400 hover:text-indigo-300 text-sm underline"
          >
            Go to home
          </button>
        </div>
      </GameShell>
    );
  }

  // No participant — show nickname entry (lobby only)
  if (!participantId) {
    return (
      <GameShell>
        <NicknameEntry
          sessionId={sessionId}
          quizTitle={quiz?.title ?? "Loading…"}
          onJoined={handleJoined}
        />
      </GameShell>
    );
  }

  // Wait for participant + quiz to load
  if (participant === undefined || quiz === undefined) {
    return <GameShell>{null}</GameShell>;
  }
  if (participant === null || quiz === null) {
    return (
      <GameShell>
        <div className="text-center py-20 text-slate-400">Data not found.</div>
      </GameShell>
    );
  }

  const isHost = participant.isHost;
  const currentQuestion = quiz.questions?.[session.currentQuestionIndex];
  const myNickname = nickname || participant.nickname;

  // ── Lobby ────────────────────────────────────────────────────────────────
  if (session.status === "lobby") {
    if (isHost) {
      return (
        <GameShell>
          <HostLobby
            sessionId={sessionId}
            joinCode={session.joinCode}
            quizTitle={quiz.title}
            questionCount={quiz.questions?.length ?? 0}
            participants={participants}
          />
        </GameShell>
      );
    } else {
      return (
        <GameShell>
          <PlayerWaiting
            quizTitle={quiz.title}
            nickname={myNickname}
            participants={participants}
          />
        </GameShell>
      );
    }
  }

  // ── Active question ──────────────────────────────────────────────────────
  if (session.status === "active" && currentQuestion) {
    return (
      <GameShell>
        <QuestionView
          question={currentQuestion}
          questionIndex={session.currentQuestionIndex}
          totalQuestions={quiz.questions?.length ?? 0}
          sessionId={sessionId}
          participantId={participantId}
          questionStartedAt={session.questionStartedAt ?? Date.now()}
          timeLimit={quiz.timeLimit}
          isHost={isHost}
          onEndQuestion={handleEndQuestion}
        />
      </GameShell>
    );
  }

  // ── Question end / reveal ─────────────────────────────────────────────────
  if (session.status === "question_end" && currentQuestion) {
    return (
      <GameShell>
        <ScoreReveal
          question={currentQuestion}
          sessionId={sessionId}
          participantId={participantId}
          isHost={isHost}
          onNext={handleAdvanceQuestion}
        />
      </GameShell>
    );
  }

  // ── Finished ──────────────────────────────────────────────────────────────
  if (session.status === "finished") {
    return (
      <GameShell>
        <Leaderboard
          participants={participants}
          participantId={participantId}
          isHost={isHost}
          isFinal={true}
          onHostAgain={handleHostAgain}
        />
      </GameShell>
    );
  }

  // Fallback
  return (
    <GameShell>
      <div className="text-center py-20 text-slate-400">Loading…</div>
    </GameShell>
  );
}

function GameShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">{children}</div>
  );
}

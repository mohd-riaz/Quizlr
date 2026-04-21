"use client";

import { useState, useSyncExternalStore } from "react";
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
import { Button } from "@/components/ui/button";

export default function GamePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();

  // Read participantId from localStorage — useSyncExternalStore handles SSR
  // by returning null on the server and the real value on the client.
  const storedParticipantId = useSyncExternalStore(
    () => () => {},
    () => localStorage.getItem(`quizlr_participant_${sessionId}`),
    () => null
  );
  // Holds the id immediately after joining (before a page refresh)
  const [joinedParticipantId, setJoinedParticipantId] = useState<string | null>(null);
  const participantId = joinedParticipantId ?? storedParticipantId;

  const [nickname, setNickname] = useState<string>("");

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
    } catch {
    }
  };

  const handleAdvanceQuestion = async () => {
    try {
      await advanceQuestion({ sessionId: sessionId as Id<"sessions"> });
    } catch {
    }
  };

  const handleHostAgain = () => {
    if (quiz) router.push(`/dashboard`);
  };

  // ── Handle NicknameEntry join ────────────────────────────────────────────
  const handleJoined = (pid: string, nick: string) => {
    setJoinedParticipantId(pid);
    setNickname(nick);
  };

  // ── Render guards ────────────────────────────────────────────────────────
  if (session === undefined || participants === undefined) {
    return <GameShell>{null}</GameShell>;
  }

  if (session === null) {
    return (
      <GameShell>
        <div className="text-center py-20 text-muted-foreground">
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
          <p className="text-foreground text-center text-lg font-semibold">
            This session has already started.
          </p>
          <Button
            variant="link"
            onClick={() => router.push("/")}
            className="text-primary text-sm"
          >
            Go to home
          </Button>
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
        <div className="text-center py-20 text-muted-foreground">Data not found.</div>
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
          questionStartedAt={session.questionStartedAt ?? (new Date()).getTime()}
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
      <div className="text-center py-20 text-muted-foreground">Loading…</div>
    </GameShell>
  );
}

function GameShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-screen bg-background text-foreground">{children}</div>
  );
}

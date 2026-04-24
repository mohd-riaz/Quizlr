"use client";

import { useState, useSyncExternalStore } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import NicknameEntry from "@/components/game/nickname-entry";
import HostLobby from "@/components/game/host-lobby";
import PlayerWaiting from "@/components/game/player-waiting";
import QuestionView from "@/components/game/question-view";
import ScoreReveal from "@/components/game/score-reveal";
import Leaderboard from "@/components/game/leaderboard";
import { Button } from "@/components/ui/button";

export default function GamePage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();

  const storedParticipantId = useSyncExternalStore(
    () => () => {},
    () => localStorage.getItem(`quizlr_participant_${sessionId}`),
    () => null
  );
  const [joinedParticipantId, setJoinedParticipantId] = useState<string | null>(null);
  const participantId = joinedParticipantId ?? storedParticipantId;

  const [nickname, setNickname] = useState<string>("");

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

  const endQuestion = useMutation(api.sessions.endQuestion);
  const advanceQuestion = useMutation(api.sessions.advanceQuestion);

  const handleEndQuestion = async () => {
    try {
      await endQuestion({ sessionId: sessionId as Id<"sessions"> });
    } catch {}
  };

  const handleAdvanceQuestion = async () => {
    try {
      await advanceQuestion({ sessionId: sessionId as Id<"sessions"> });
    } catch {}
  };

  const handleHostAgain = () => {
    if (quiz) router.push(`/dashboard`);
  };

  const handleJoined = (pid: string, nick: string) => {
    setJoinedParticipantId(pid);
    setNickname(nick);
  };

  if (session === undefined || participants === undefined) {
    return null;
  }

  if (session === null) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Session not found.
      </div>
    );
  }

  if (!participantId && session.status !== "lobby") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 px-4 py-12">
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
    );
  }

  if (!participantId) {
    return (
      <NicknameEntry
        sessionId={sessionId}
        quizTitle={quiz?.title ?? "Loading…"}
        onJoined={handleJoined}
      />
    );
  }

  if (participant === undefined || quiz === undefined) {
    return null;
  }
  if (participant === null || quiz === null) {
    return (
      <div className="text-center py-20 text-muted-foreground">Data not found.</div>
    );
  }

  const isHost = participant.isHost;
  const currentQuestion = quiz.questions?.[session.currentQuestionIndex];
  const myNickname = nickname || participant.nickname;

  if (session.status === "lobby") {
    if (isHost) {
      return (
        <HostLobby
          sessionId={sessionId}
          joinCode={session.joinCode}
          quizTitle={quiz.title}
          questionCount={quiz.questions?.length ?? 0}
          participants={participants}
        />
      );
    } else {
      return (
        <PlayerWaiting
          quizTitle={quiz.title}
          nickname={myNickname}
          participants={participants}
        />
      );
    }
  }

  if (session.status === "active" && currentQuestion) {
    const totalPlayers = participants.filter((p) => !p.isHost).length;
    return (
      <QuestionView
        question={currentQuestion}
        questionIndex={session.currentQuestionIndex}
        totalQuestions={quiz.questions?.length ?? 0}
        sessionId={sessionId}
        participantId={participantId}
        questionStartedAt={session.questionStartedAt ?? (new Date()).getTime()}
        timeLimit={quiz.timeLimit}
        isHost={isHost}
        totalPlayers={totalPlayers}
        onEndQuestion={handleEndQuestion}
      />
    );
  }

  if (session.status === "question_end" && currentQuestion) {
    return (
      <ScoreReveal
        question={currentQuestion}
        sessionId={sessionId}
        participantId={participantId}
        isHost={isHost}
        questionIndex={session.currentQuestionIndex}
        totalQuestions={quiz.questions?.length ?? 0}
        onNext={handleAdvanceQuestion}
      />
    );
  }

  if (session.status === "finished") {
    return (
      <Leaderboard
        participants={participants}
        participantId={participantId}
        isHost={isHost}
        isFinal={true}
        onHostAgain={handleHostAgain}
      />
    );
  }

  return (
    <div className="text-center py-20 text-muted-foreground">Loading…</div>
  );
}

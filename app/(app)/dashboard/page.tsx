"use client";

import { useState } from "react";
import { useQuery, useConvex, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import DashboardNav from "@/components/dashboard/DashboardNav";
import QuizCard from "@/components/quiz/QuizCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DashboardPage() {
  const router = useRouter();
  const convex = useConvex();
  const quizzes = useQuery(api.quizzes.listByHost);
  const createSession = useMutation(api.sessions.create);

  const [search, setSearch] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [hostingQuizId, setHostingQuizId] = useState<string | null>(null);

  const handleHost = async (quizId: string) => {
    setHostingQuizId(quizId);
    try {
      const result = await createSession({ quizId: quizId as Id<"quizzes"> });
      localStorage.setItem(`quizlr_participant_${result.sessionId}`, result.hostParticipantId);
      router.push(`/game/${result.sessionId}`);
    } catch {
    } finally {
      setHostingQuizId(null);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) { setJoinError("Please enter a join code."); return; }
    setJoining(true);
    setJoinError(null);
    try {
      const session = await convex.query(api.sessions.getByJoinCode, { joinCode: joinCode.trim() });
      if (!session) { setJoinError("No active session found with that code."); return; }
      router.push(`/game/${session._id}`);
    } catch {
      setJoinError("Something went wrong. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  const q = search.trim().toLowerCase();
  const filtered = quizzes?.filter((quiz) => {
    if (!q) return true;
    return (
      quiz.title.toLowerCase().includes(q) ||
      (quiz.description ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main>
        <div className="max-w-5xl mx-auto px-6 pt-14 pb-24">

          {/* Page heading + CTAs */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              Your quizzes.
            </h1>
            <div className="mt-6 flex items-center gap-2">
              <button
                onClick={() => router.push("/quiz/new")}
                className="inline-flex items-center gap-2 h-9 px-3.5 text-sm font-medium rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Create Quiz
              </button>
              <button
                onClick={() => setJoinOpen(true)}
                className="inline-flex items-center gap-2 h-9 px-3.5 text-sm font-medium rounded-lg bg-card border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 11h-6M19 8v6" />
                </svg>
                Join Quiz
              </button>
            </div>
          </div>

          {/* Section header */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <h2
              className="text-xs font-semibold uppercase tracking-[0.04em] text-muted-foreground"
            >
              Your Quizzes
            </h2>
            {quizzes !== undefined && (
              <span className="inline-flex items-center h-6 px-2.5 rounded-full text-xs font-mono font-medium border border-border bg-card text-muted-foreground">
                {quizzes.length}
              </span>
            )}
            <div className="ml-auto flex items-center gap-2 pl-3 pr-2 h-9 rounded-md border border-border bg-card w-full sm:w-72">
              <svg className="w-3.5 h-3.5 text-muted-foreground shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
                placeholder="Search quizzes…"
              />
            </div>
          </div>

          {/* Content */}
          {quizzes === undefined ? (
            <div className="grid md:grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-[calc(var(--radius)+4px)] p-5 flex flex-col gap-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 flex-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : q && filtered?.length === 0 ? (
            <div className="bg-card border border-border rounded-[calc(var(--radius)+4px)] p-10 text-center text-sm text-muted-foreground">
              No quizzes match that search.
            </div>
          ) : quizzes.length === 0 ? (
            <div className="grid md:grid-cols-2 gap-3">
              <NewQuizTile onClick={() => router.push("/quiz/new")} />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {(filtered ?? quizzes).map((quiz) => (
                <QuizCard
                  key={quiz._id}
                  quiz={quiz}
                  onHost={handleHost}
                  isHosting={hostingQuizId === quiz._id}
                />
              ))}
              {!q && <NewQuizTile onClick={() => router.push("/quiz/new")} />}
            </div>
          )}
        </div>
      </main>

      {/* Join dialog */}
      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Join a Quiz</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-2">
            <input
              placeholder="e.g. AB12CD"
              value={joinCode}
              onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); setJoinError(null); }}
              maxLength={6}
              className="h-10 w-full rounded-lg border border-border bg-card px-3 text-center text-lg font-mono tracking-widest uppercase outline-none focus:ring-1 focus:ring-foreground"
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            />
            {joinError && <p className="text-sm text-destructive">{joinError}</p>}
            <button
              onClick={handleJoin}
              disabled={joining}
              className="h-9 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-opacity cursor-pointer"
            >
              {joining ? "Joining…" : "Join"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NewQuizTile({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-transparent border border-border border-dashed rounded-[calc(var(--radius)+4px)] p-5 flex flex-col items-start text-left gap-3 transition-all duration-150 hover:-translate-y-px hover:border-[color-mix(in_oklch,var(--foreground)_25%,var(--border))] cursor-pointer w-full"
    >
      <span className="w-9 h-9 rounded-md grid place-items-center bg-muted text-foreground">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
      <div>
        <div className="text-base font-semibold tracking-tight">New quiz</div>
        <div className="text-sm mt-0.5 text-muted-foreground">Paste a topic. AI does the rest.</div>
      </div>
    </button>
  );
}

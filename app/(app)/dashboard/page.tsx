"use client";

import { useState } from "react";
import { useQuery, useConvex, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuizCard from "@/components/quiz/QuizCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusCircle, Users } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const convex = useConvex();
  const quizzes = useQuery(api.quizzes.listByHost);
  const createSession = useMutation(api.sessions.create);

  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [hostingQuizId, setHostingQuizId] = useState<string | null>(null);

  const handleHost = async (quizId: string) => {
    setHostingQuizId(quizId);
    try {
      const result = await createSession({ quizId: quizId as Id<"quizzes"> });
      // Store host participant ID so the game page recognises this browser as host
      localStorage.setItem(
        `quizlr_participant_${result.sessionId}`,
        result.hostParticipantId
      );
      router.push(`/game/${result.sessionId}`);
    } catch (err) {
      console.error("Failed to create session:", err);
    } finally {
      setHostingQuizId(null);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) {
      setJoinError("Please enter a join code.");
      return;
    }
    setJoining(true);
    setJoinError(null);
    try {
      const session = await convex.query(api.sessions.getByJoinCode, {
        joinCode: joinCode.trim(),
      });
      if (!session) {
        setJoinError("No active session found with that code.");
        return;
      }
      router.push(`/game/${session._id}`);
    } catch {
      setJoinError("Something went wrong. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Top actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Button
            className="cursor-pointer"
            onClick={() => router.push("/quiz/new")}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Create Quiz
          </Button>

          <Button variant="outline" className="cursor-pointer" onClick={() => setJoinOpen(true)}>
            <Users className="w-4 h-4 mr-2" />
            Join Quiz
          </Button>

          <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Join a Quiz</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="joinCode">Enter join code</Label>
                  <Input
                    id="joinCode"
                    placeholder="e.g. AB12CD"
                    value={joinCode}
                    onChange={(e) => {
                      setJoinCode(e.target.value.toUpperCase());
                      setJoinError(null);
                    }}
                    maxLength={6}
                    className="uppercase tracking-widest text-center text-lg font-mono"
                    onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  />
                </div>
                {joinError && (
                  <p className="text-sm text-destructive">{joinError}</p>
                )}
                <Button
                  className="cursor-pointer"
                  onClick={handleJoin}
                  disabled={joining}
                >
                  {joining ? "Joining..." : "Join"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quiz grid */}
        {quizzes === undefined ? (
          // Loading skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 p-5 rounded-xl border bg-card">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </div>
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <PlusCircle className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">No quizzes yet</h2>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Create your first quiz and start hosting real-time sessions.
            </p>
            <Button
              className="cursor-pointer"
              onClick={() => router.push("/quiz/new")}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create your first quiz
            </Button>
          </div>
        ) : (
          // Quiz grid
          <>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Your Quizzes ({quizzes.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz) => (
                <QuizCard
                  key={quiz._id}
                  quiz={quiz}
                  onHost={handleHost}
                  isHosting={hostingQuizId === quiz._id}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

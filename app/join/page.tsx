"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function JoinPage() {
  const router = useRouter();
  const convex = useConvex();

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) { setError("Please enter a join code."); return; }
    setJoining(true);
    setError(null);
    try {
      const session = await convex.query(api.sessions.getByJoinCode, { joinCode: trimmed });
      if (!session) { setError("No active session found with that code."); return; }
      router.push(`/game/${session._id}`);
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="dark flex flex-col items-center justify-center min-h-screen px-4 bg-background text-foreground">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-4xl font-black text-foreground mb-1">
            Quiz<span className="text-primary">lr</span>
          </h1>
          <p className="text-foreground font-semibold text-lg">Enter a join code</p>
        </div>

        <div className="bg-card rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="code" className="text-foreground">Join code</Label>
            <Input
              id="code"
              placeholder="ABC123"
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              maxLength={6}
              autoFocus
              className="text-center text-lg font-semibold tracking-widest uppercase"
            />
          </div>
          {error && (
            <p className="text-destructive text-sm text-center">{error}</p>
          )}
          <Button
            onClick={handleJoin}
            disabled={joining || !code.trim()}
            className="w-full font-bold text-lg py-6"
            size="lg"
          >
            {joining ? (
              <><Loader2 className="w-5 h-5 animate-spin" />Joining…</>
            ) : (
              "Join Game"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JoinCodeDisplayProps {
  joinCode: string;
  sessionId: string;
}

export default function JoinCodeDisplay({
  joinCode,
  sessionId,
}: JoinCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/game/${sessionId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
        Join Code
      </p>
      <div className="bg-card rounded-2xl px-8 py-4 border">
        <span className="text-5xl font-black tracking-[0.3em] text-foreground font-mono">
          {joinCode.trim()}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-foreground" />
            <span className="text-foreground">Link copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy join link
          </>
        )}
      </Button>
    </div>
  );
}

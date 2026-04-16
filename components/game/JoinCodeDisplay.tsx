"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

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
      <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">
        Join Code
      </p>
      <div className="bg-slate-800 rounded-2xl px-8 py-4">
        <span className="text-5xl font-black tracking-[0.3em] text-white font-mono">
          {joinCode}
        </span>
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400">Link copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy join link
          </>
        )}
      </button>
    </div>
  );
}

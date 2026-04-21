"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TimerBarProps {
  questionStartedAt: number;
  timeLimit: number; // seconds
  onExpire?: () => void;
}

export default function TimerBar({
  questionStartedAt,
  timeLimit,
  onExpire,
}: TimerBarProps) {
  const [remaining, setRemaining] = useState(timeLimit);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  // Keep the callback ref fresh so we don't need it in the dep array
  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    expiredRef.current = false;
    setRemaining(timeLimit);

    const tick = () => {
      const elapsed = (Date.now() - questionStartedAt) / 1000;
      const left = Math.max(0, timeLimit - elapsed);
      setRemaining(left);
      if (left === 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpireRef.current?.();
      }
    };

    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [questionStartedAt, timeLimit]);

  const pct = (remaining / timeLimit) * 100;
  const secs = Math.ceil(remaining);

  const barColor =
    pct > 50
      ? "bg-emerald-500"
      : pct > 25
        ? "bg-yellow-400"
        : "bg-rose-500";

  return (
    <div className="w-full flex items-center gap-3">
      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-[width] duration-[250ms]", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className={cn(
          "w-8 text-right tabular-nums font-bold text-lg",
          pct <= 25 ? "text-destructive" : "text-foreground"
        )}
      >
        {secs}
      </span>
    </div>
  );
}

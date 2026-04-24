"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TimerBarProps {
  questionStartedAt: number;
  timeLimit: number;
  onExpire?: () => void;
  onTick?: (remaining: number) => void;
}

export default function TimerBar({
  questionStartedAt,
  timeLimit,
  onExpire,
  onTick,
}: TimerBarProps) {
  const [pct, setPct] = useState(100);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  const onTickRef = useRef(onTick);

  useEffect(() => { onExpireRef.current = onExpire; });
  useEffect(() => { onTickRef.current = onTick; });

  useEffect(() => {
    expiredRef.current = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPct(100);

    const tick = () => {
      const elapsed = (Date.now() - questionStartedAt) / 1000;
      const left = Math.max(0, timeLimit - elapsed);
      const p = (left / timeLimit) * 100;
      setPct(p);
      onTickRef.current?.(left);
      if (left === 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpireRef.current?.();
      }
    };

    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [questionStartedAt, timeLimit]);

  const barColor =
    pct > 50 ? "bg-emerald-500" : pct > 25 ? "bg-amber-400" : "bg-rose-500";

  return (
    <div className="h-1.5 rounded-full overflow-hidden bg-muted">
      <div
        className={cn("h-full rounded-full transition-[width,background-color] duration-300", barColor)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

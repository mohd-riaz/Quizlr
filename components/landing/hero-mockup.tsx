import { Badge, Card, PulsingDot } from "../primitives";

type Player = { name: string; color: string; score: number; id: number };

const OPT_COLORS = [
  "oklch(0.7 0.16 25)",
  "oklch(0.7 0.16 145)",
  "oklch(0.7 0.16 255)",
  "oklch(0.7 0.14 85)",
];
const OPTIONS = [
  { label: "A", text: "Mercury", pct: 18, state: "wrong" },
  { label: "B", text: "Venus", pct: 62, state: "correct" },
  { label: "C", text: "Mars", pct: 12, state: "wrong" },
  { label: "D", text: "Jupiter", pct: 8, state: "wrong" },
];

export function HeroMockup({
  timer,
  answeredCount,
  players,
  lbUpdated,
  floatVisible,
  floatName,
  floatColor,
  floatTotal,
}: {
  timer: number;
  answeredCount: number;
  players: Player[];
  lbUpdated: string;
  floatVisible: boolean;
  floatName: string;
  floatColor: string;
  floatTotal: number;
}) {
  const timerBarW = (timer / 18) * 100;

  return (
    <div className="relative">
      {/* Aurora glow */}
      <div
        className="absolute pointer-events-none opacity-55 dark:opacity-35"
        style={{
          inset: "-20% -10% auto -10%",
          height: 420,
          background:
            "radial-gradient(40% 60% at 20% 40%, color-mix(in oklch, var(--lp-accent) 45%, transparent), transparent 70%), radial-gradient(35% 50% at 80% 30%, color-mix(in oklch, var(--lp-success) 30%, transparent), transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <Card
        className="p-0 overflow-hidden"
        style={{ boxShadow: "0 40px 60px -40px color-mix(in oklch, var(--foreground) 30%, transparent)" }}
      >
        {/* Window chrome */}
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b border-border"
          style={{ background: "color-mix(in oklch, var(--muted) 50%, var(--card))" }}
        >
          <div className="flex items-center gap-1.5">
            {["oklch(0.7 0.16 25)", "oklch(0.8 0.14 90)", "oklch(0.72 0.16 145)"].map((bg) => (
              <span key={bg} className="w-2.5 h-2.5 rounded-full" style={{ background: bg }} />
            ))}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground hidden sm:flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            quizlr.mohdriaz.com/game/7KX-2M
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
            <PulsingDot /> live
          </div>
        </div>

        {/* Content: question + leaderboard */}
        <div className="grid sm:grid-cols-[1.4fr_1fr]">
          {/* Question panel */}
          <div className="p-4 sm:p-6 sm:border-r border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge className="font-mono">Q 03 / 10</Badge>
                <Badge style={{ color: "var(--foreground)" }}>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 22h20L12 2z" />
                  </svg>
                  <span className="hidden sm:inline">Space &amp; Astronomy</span>
                  <span className="sm:hidden">Space</span>
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                </svg>
                <span className="font-mono text-sm tabular-nums">{timer}s</span>
              </div>
            </div>

            <div className="text-base sm:text-[22px] font-semibold leading-snug tracking-tight mb-4">
              Which planet has a day longer than its year?
            </div>

            <div className="h-1 rounded-full mb-4 overflow-hidden bg-muted">
              <div
                className="h-full transition-all duration-300"
                style={{ background: "var(--foreground)", width: `${timerBarW}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {OPTIONS.map((o, i) => (
                <div
                  key={o.label}
                  className="p-3 flex items-center gap-2 border rounded-lg relative overflow-hidden"
                  style={{
                    background:
                      o.state === "correct"
                        ? "color-mix(in oklch, var(--lp-success) 12%, var(--card))"
                        : o.state === "wrong"
                        ? "color-mix(in oklch, var(--lp-wrong) 8%, var(--card))"
                        : "var(--card)",
                    borderColor:
                      o.state === "correct"
                        ? "color-mix(in oklch, var(--lp-success) 50%, var(--border))"
                        : "color-mix(in oklch, var(--lp-wrong) 40%, var(--border))",
                    opacity: o.state === "wrong" ? 0.7 : 1,
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-md grid place-items-center font-mono text-xs font-semibold shrink-0"
                    style={{
                      background: `${OPT_COLORS[i]}22`,
                      color: OPT_COLORS[i],
                      border: `1px solid ${OPT_COLORS[i]}55`,
                    }}
                  >
                    {o.label}
                  </span>
                  <span className="text-xs sm:text-sm font-medium flex-1 truncate">{o.text}</span>
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground">{o.pct}%</span>
                  <div
                    className="absolute inset-x-0 bottom-0 h-[3px]"
                    style={{
                      background: o.state === "correct" ? "var(--lp-success)" : "color-mix(in oklch, var(--foreground) 25%, transparent)",
                      transform: `scaleX(${o.pct / 100})`,
                      transformOrigin: "left",
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>{answeredCount} / 24 answered</span>
              <span className="hidden sm:flex items-center gap-1">
                {["1", "2", "3", "4"].map((k) => (
                  <span key={k} className="border border-b-2 border-border rounded px-1 py-0.5 bg-card text-[9px]">{k}</span>
                ))}
              </span>
            </div>
          </div>

          {/* Leaderboard panel — hidden on mobile */}
          <div className="hidden sm:block p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Leaderboard</div>
              <div className="text-[11px] font-mono text-muted-foreground">{lbUpdated}</div>
            </div>
            <ol className="space-y-1.5">
              {players.slice(0, 6).map((p, rank) => (
                <li
                  key={p.id}
                  className="lp-rank-up flex items-center gap-3 px-2.5 py-1.5 rounded-md"
                  style={{
                    background: rank === 0 ? "color-mix(in oklch, var(--lp-accent) 10%, var(--card))" : "transparent",
                    border: `1px solid ${rank === 0 ? "color-mix(in oklch, var(--lp-accent) 40%, var(--border))" : "var(--border)"}`,
                  }}
                >
                  <span className="font-mono text-xs w-4 text-muted-foreground">{rank + 1}</span>
                  <span className="w-5 h-5 rounded-full shrink-0" style={{ background: p.color }} />
                  <span className="text-sm font-medium flex-1 truncate">{p.name}</span>
                  <span className="font-mono text-xs tabular-nums">{p.score.toLocaleString()}</span>
                </li>
              ))}
            </ol>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="text-[11px] font-mono uppercase tracking-wider mb-2 text-muted-foreground">Room</div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-2 text-xl tracking-[0.25em] font-mono font-semibold rounded-lg border border-border bg-card">
                  7KX2M
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-medium">24 players</div>
                  <div className="text-xs font-mono text-muted-foreground">+3 joined 2s ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Floating join chip */}
      <div
        className="absolute -bottom-4 left-4 sm:-left-4 bg-card border border-border rounded-[calc(var(--radius)+4px)] px-3 py-2 text-xs flex items-center gap-2 transition-all duration-300"
        style={{
          boxShadow: "0 10px 30px -10px color-mix(in oklch, var(--foreground) 30%, transparent)",
          opacity: floatVisible ? 1 : 0,
          transform: floatVisible ? "translateY(0)" : "translateY(6px)",
        }}
      >
        <span className="w-6 h-6 rounded-full shrink-0" style={{ background: floatColor }} />
        <div className="leading-tight">
          <div className="font-medium">{floatName} just joined</div>
          <div className="font-mono text-muted-foreground">+1 player → {floatTotal}</div>
        </div>
      </div>
    </div>
  );
}

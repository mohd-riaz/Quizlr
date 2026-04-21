import { Badge, Btn, Icons, PulsingDot } from "../primitives";
import { HeroMockup } from "./hero-mockup";

const JOIN_CODE = ["7", "K", "X", "2", "M", "9"];

type Player = { name: string; color: string; score: number; id: number };

export function HeroSection({
  timer, answeredCount, players, lbUpdated,
  floatVisible, floatName, floatColor, floatTotal,
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
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 lp-bg-grid lp-radial-fade pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* Copy */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <Badge>
                <PulsingDot />
                <span>Live sessions · 6-char join codes</span>
              </Badge>
              <Badge className="font-mono hidden sm:inline-flex">v0.4 · beta</Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[0.98] font-bold tracking-tight">
              Turn any topic into a{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--foreground) 0%, var(--foreground) 40%, color-mix(in oklch, var(--foreground) 60%, var(--lp-accent)) 70%, var(--lp-accent) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                room-shaking quiz
              </span>
              .
            </h1>

            <p className="mt-5 text-base sm:text-lg max-w-xl text-muted-foreground">
              Quizlr spins up multiplayer quiz games in seconds. Generate questions with AI,
              host a live room, and watch the leaderboard shuffle in real time — no installs,
              no accounts for players.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Btn href="/signup" size="lg" className="lp-sheen w-full sm:w-auto justify-center">
                Start a quiz — it&apos;s free {Icons.arrow}
              </Btn>
              <Btn href="/join" variant="outline" size="lg" className="w-full sm:w-auto justify-center">
                {Icons.lock} I have a join code
              </Btn>
            </div>

            {/* Join code tiles */}
            <div className="mt-7 flex items-center gap-3">
              <div className="flex gap-1.5">
                {JOIN_CODE.map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-10 sm:w-9 sm:h-11 grid place-items-center text-base sm:text-lg font-mono font-semibold rounded-lg border border-border bg-card"
                    style={i === 5 ? { borderColor: "var(--lp-accent)", color: "var(--lp-accent)" } : undefined}
                  >
                    {i === 5 ? <span className="lp-pulse-ring-accent">{c}</span> : c}
                  </div>
                ))}
              </div>
              <span className="text-xs font-mono text-muted-foreground">enter code to join</span>
            </div>

            {/* Trust row */}
            <div className="mt-8 flex items-center gap-5 text-xs text-muted-foreground">
              <div className="flex -space-x-2 shrink-0">
                {["oklch(0.7 0.16 25)", "oklch(0.7 0.16 145)", "oklch(0.7 0.16 255)"].map((bg, i) => (
                  <span key={i} className="w-7 h-7 rounded-full border-2 border-background" style={{ background: bg }} />
                ))}
                <span className="w-7 h-7 rounded-full border-2 border-background font-mono text-[10px] flex items-center justify-center bg-muted text-foreground">+9k</span>
              </div>
              <div className="leading-tight">
                <div className="font-medium text-foreground">9,412 quizzes hosted this week</div>
                <div className="hidden sm:block">Avg. session starts in 4.2s · &lt;90ms answer latency</div>
              </div>
            </div>
          </div>

          {/* Mockup */}
          <div className="lg:col-span-6 mt-4 lg:mt-0">
            <HeroMockup
              timer={timer}
              answeredCount={answeredCount}
              players={players}
              lbUpdated={lbUpdated}
              floatVisible={floatVisible}
              floatName={floatName}
              floatColor={floatColor}
              floatTotal={floatTotal}
            />
          </div>
        </div>
      </div>

      {/* Marquee — commented out */}
      {/* <div
        className="relative border-y border-border overflow-hidden py-3 lp-no-scrollbar mt-8 sm:mt-0"
        style={{ background: "color-mix(in oklch, var(--muted) 40%, transparent)" }}
      >
        <div className="flex gap-8 lp-marquee whitespace-nowrap text-xs font-mono text-muted-foreground">
          {[...MARQUEE_TOPICS, ...MARQUEE_TOPICS].map((t, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-current" />{t}
            </span>
          ))}
        </div>
      </div> */}
    </section>
  );
}

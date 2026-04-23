import { Badge, Btn, Icons, PulsingDot } from "../primitives";
import { HeroMockup } from "./hero-mockup";

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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-18 pb-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* Copy */}
          <div className="lg:col-span-6 mt-5">
            {/* <div className="flex items-center gap-2 mb-5 flex-wrap">
              <Badge>
                <PulsingDot />
                <span>Live sessions · 6-char join codes</span>
              </Badge>
              <Badge className="font-mono hidden sm:inline-flex">v0.4 · beta</Badge>
            </div> */}

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

            {/* Trust row */}
            <div className="mt-8 flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              {["Real-time", "No account to play", "Open source"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center h-7 px-3 rounded-full text-xs font-medium border border-border bg-card text-muted-foreground"
                >
                  {item}
                </span>
              ))}
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

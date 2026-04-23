import { Badge, Btn, Icons } from "../primitives";

export function CtaSection() {
  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 lp-bg-grid lp-radial-fade pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 60%, color-mix(in oklch, var(--lp-accent) 20%, transparent), transparent 70%)" }}
      />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Badge className="mb-6 font-mono">04 · Start</Badge>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
          Your first room<br />opens in&nbsp;
          <span
            style={{
              background: "linear-gradient(135deg, var(--foreground) 0%, var(--foreground) 40%, color-mix(in oklch, var(--foreground) 60%, var(--lp-accent)) 70%, var(--lp-accent) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            4 seconds
          </span>
          .
        </h2>
        <p className="mt-5 text-sm sm:text-base text-muted-foreground">
          Sign up with email, GitHub, or Google. Players join without any of that.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Btn href="/signup" size="lg" className="w-full sm:w-auto justify-center">
            Create free account {Icons.arrow}
          </Btn>
          {/* <Btn href="/signup" variant="outline" size="lg" className="w-full sm:w-auto justify-center">
            See a demo quiz
          </Btn> */}
        </div>
        <div className="mt-6 text-xs font-mono text-muted-foreground">
          No credit card · free for hobby use ·{" "}
          <span style={{ color: "var(--foreground)" }}>quizlr.mohdriaz.com</span>
        </div>
      </div>
    </section>
  );
}

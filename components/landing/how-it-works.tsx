import { Badge, Card } from "../primitives";

export function HowItWorks({ step1Text }: { step1Text: string }) {
  return (
    <section id="how" className="py-16 sm:py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <Badge className="mb-4 font-mono">01 · Flow</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]">
              From idea to live game<br className="hidden sm:block" /> in three&nbsp;steps.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-muted-foreground sm:text-right">
            Build, host, play. The whole loop is under a minute — whether you&apos;re
            prepping a classroom warm-up or a product launch party.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Step 1 */}
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-muted-foreground">STEP 01</span>
              <span className="font-mono text-xs text-muted-foreground">~ 20s</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight">Generate questions</h3>
            <p className="text-sm mt-1.5 mb-5 text-muted-foreground">
              Paste a topic or some notes. Our model writes structured MCQs with an answer key.
            </p>
            <div
              className="rounded-md border p-3 font-mono text-[12px] leading-relaxed border-border"
              style={{ background: "var(--muted)" }}
            >
              <div className="text-muted-foreground">$ topic</div>
              <div className="lp-caret min-h-[1.4em]">{step1Text}</div>
              <div className="mt-2 text-muted-foreground">→ 10 questions · 4 options · explanations ✓</div>
            </div>
          </Card>

          {/* Step 2 */}
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-muted-foreground">STEP 02</span>
              <span className="font-mono text-xs text-muted-foreground">~ 5s</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight">Share a code</h3>
            <p className="text-sm mt-1.5 mb-5 text-muted-foreground">
              Players join from any device with a 6-character code. No app, no login.
            </p>
            <div className="flex items-center justify-center py-2">
              <div className="flex gap-1.5">
                {["7", "K", "X", "2", "M"].map((c) => (
                  <span key={c} className="w-8 h-10 sm:w-9 sm:h-11 grid place-items-center text-base sm:text-lg font-mono font-semibold rounded-lg border border-border bg-card">{c}</span>
                ))}
                <span
                  className="w-8 h-10 sm:w-9 sm:h-11 grid place-items-center text-base sm:text-lg font-mono font-semibold rounded-lg border lp-pulse-ring-accent"
                  style={{ borderColor: "var(--lp-accent)", color: "var(--lp-accent)", background: "var(--card)" }}
                >9</span>
              </div>
            </div>
          </Card>

          {/* Step 3 — full width on sm (2-col grid), normal on lg */}
          <Card className="p-5 sm:p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-muted-foreground">STEP 03</span>
              <span className="font-mono text-xs text-muted-foreground">10–20s / Q</span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight">Play in real time</h3>
            <p className="text-sm mt-1.5 mb-5 text-muted-foreground">
              Faster answers score more. The leaderboard shuffles live on every screen.
            </p>
            <div className="space-y-1.5 max-w-xs sm:max-w-none mx-auto">
              {[["Priya", "2,840"], ["Jordan", "2,705"], ["Mika", "2,612"]].map(([name, score], i) => (
                <div key={name} className="flex items-center justify-between px-3 py-1.5 rounded-md bg-muted">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{i + 1}</span>
                    <span className="text-sm font-medium">{name}</span>
                  </div>
                  <span className="font-mono text-xs">{score}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

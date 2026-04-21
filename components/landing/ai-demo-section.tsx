import { Badge, Btn, Card, Icons, PulsingDot } from "../primitives";

const AI_SAMPLE = [
  { q: "In what year did Apollo 11 land on the Moon?", opts: ["1967", "1969", "1971", "1973"], a: 1 },
  { q: "Who was the first human to walk on the Moon?", opts: ["Buzz Aldrin", "Neil Armstrong", "Michael Collins", "Alan Shepard"], a: 1 },
  { q: "Which Apollo mission was aborted en route to the Moon?", opts: ["Apollo 8", "Apollo 11", "Apollo 13", "Apollo 17"], a: 2 },
];

export function AiDemoSection({
  aiCount,
  aiDone,
  aiTopicText,
}: {
  aiCount: number;
  aiDone: boolean;
  aiTopicText: string;
}) {
  return (
    <section id="ai" className="py-16 sm:py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Left: copy */}
          <div className="lg:col-span-5">
            <Badge className="mb-4 font-mono">03 · Generation</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]">
              Paste a topic.<br />Get a&nbsp;quiz.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground">
              Quizlr wraps OpenRouter-backed models behind a strict JSON schema, so you
              never wrestle with malformed output or hallucinated answers.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Structured output — validated before it's ever saved.",
                "Pick difficulty, count, and style per quiz.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 w-4 h-4 rounded-full grid place-items-center text-[10px] shrink-0 font-medium"
                    style={{ background: "var(--lp-success)", color: "var(--primary-foreground)" }}
                  >✓</span>
                  <span>{item}</span>
                </li>
              ))}
              <li className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 w-4 h-4 rounded-full grid place-items-center text-[10px] shrink-0 font-medium"
                  style={{ background: "var(--lp-success)", color: "var(--primary-foreground)" }}
                >✓</span>
                <span className="flex items-center gap-2 flex-wrap">
                  PDF &amp; text upload
                  <span className="inline-flex items-center h-5 px-2 rounded-full text-[0.65rem] font-medium border border-border bg-card text-muted-foreground">soon</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Right: demo card */}
          <div className="lg:col-span-7">
            <Card className="p-0 overflow-hidden">
              <div
                className="px-4 py-3 border-b border-border flex items-center justify-between gap-2"
                style={{ background: "color-mix(in oklch, var(--muted) 50%, var(--card))" }}
              >
                <div className="text-[11px] font-mono text-muted-foreground truncate">new-quiz · generate</div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className="font-mono text-[10px]">model · auto</Badge>
                  <Badge className="font-mono text-[10px] hidden sm:inline-flex">count · 10</Badge>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="text-xs font-medium block mb-1.5 text-muted-foreground">Topic or source</label>
                  <div className="rounded-md border px-3 py-2.5 text-sm min-h-[52px] border-border bg-card lp-caret">
                    {aiTopicText}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Btn size="md">{Icons.play} Generate</Btn>
                  <Btn variant="outline">Advanced</Btn>
                  <span className="ml-auto text-xs font-mono flex items-center gap-1.5 text-muted-foreground">
                    {aiDone ? (
                      <><span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--lp-success)" }} /> 10 of 10 · valid</>
                    ) : (
                      <><PulsingDot accent /> streaming…</>
                    )}
                  </span>
                </div>

                {aiCount > 0 && (
                  <div className="divide-y rounded-md border overflow-hidden border-border">
                    {AI_SAMPLE.slice(0, aiCount).map((s, i) => (
                      <div key={i} className="p-3 sm:p-4 flex items-start gap-3 bg-card">
                        <span className="font-mono text-xs mt-0.5 w-5 shrink-0 text-muted-foreground">0{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium mb-2">{s.q}</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {s.opts.map((o, j) => (
                              <div
                                key={j}
                                className="text-[12px] px-2.5 py-1.5 rounded border flex items-center gap-2"
                                style={{
                                  borderColor: j === s.a ? "color-mix(in oklch, var(--lp-success) 50%, var(--border))" : "var(--border)",
                                  background: j === s.a ? "color-mix(in oklch, var(--lp-success) 10%, var(--card))" : "var(--card)",
                                }}
                              >
                                <span className="font-mono text-[10px] text-muted-foreground">{String.fromCharCode(65 + j)}</span>
                                <span className="truncate">{o}</span>
                                {j === s.a && <span className="ml-auto text-[10px] shrink-0" style={{ color: "var(--lp-success)" }}>✓</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                        <button
                          className="inline-flex items-center justify-center h-8 w-8 shrink-0 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                          aria-label="Regenerate question"
                        >
                          {Icons.regen}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

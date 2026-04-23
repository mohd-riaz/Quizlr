import { Badge } from "../primitives";

const DEMO_QUESTION = {
  text: "In what year did Apollo 11 land on the Moon?",
  options: ["1967", "1969", "1971", "1973"],
  correctIndex: 1,
};
const OPTION_LABELS = ["A", "B", "C", "D"];

const IconWand = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" />
    <path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" />
    <path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);

const IconGrip = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="5" r="1" fill="currentColor" stroke="none" />
    <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="9" cy="19" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="5" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="15" cy="19" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export function AiDemoSection({ aiTopicText }: { aiTopicText: string }) {
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
              Quizlr uses AI with real-time Tavily web search to generate up-to-date
              questions behind a strict JSON schema — no malformed output,
              no hallucinated answers.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Live web search via Tavily — questions stay current.",
                "Structured output — validated before it's ever saved.",
                // "Pick difficulty, count, and style per quiz.",
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

          {/* Right: demo */}
          <div className="lg:col-span-7 space-y-2">

            {/* AI generator card — matches question-manager.tsx */}
            <div className="bg-card border border-border rounded-[calc(var(--radius)+4px)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-7 h-7 rounded-md grid place-items-center shrink-0"
                  style={{
                    background: "color-mix(in oklch, oklch(0.55 0.18 265) 15%, var(--card))",
                    color: "oklch(0.55 0.18 265)",
                    border: "1px solid color-mix(in oklch, oklch(0.55 0.18 265) 30%, var(--border))",
                  }}
                >
                  <IconWand />
                </span>
                <span className="text-sm font-semibold">Generate with AI</span>
              </div>

              <div className="rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm min-h-16 mb-4 text-foreground lp-caret">
                {aiTopicText}
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium mb-3 flex items-center justify-between">
                  <span>Questions</span>
                  <span className="font-mono text-sm tabular-nums">10</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={30}
                  defaultValue={10}
                  className="w-full accent-primary pointer-events-none"
                />
              </div>

              <button className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium rounded-md cursor-default" style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                <IconWand />
                Generate
              </button>
            </div>

            {/* Question card — matches question-card.tsx */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground">Question 1</p>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span className="p-1"><IconWand /></span>
                  <span className="p-1"><IconTrash /></span>
                  <span className="p-1"><IconGrip /></span>
                </div>
              </div>

              <div className="rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm min-h-[60px] mb-3">
                {DEMO_QUESTION.text}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DEMO_QUESTION.options.map((opt, i) => {
                  const isCorrect = i === DEMO_QUESTION.correctIndex;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="flex-shrink-0 w-7 h-7 rounded-md border-2 text-xs font-bold flex items-center justify-center"
                        style={isCorrect
                          ? { background: "var(--primary)", borderColor: "var(--primary)", color: "var(--primary-foreground)" }
                          : { background: "transparent", borderColor: "var(--border)", color: "var(--muted-foreground)" }
                        }
                      >
                        {OPTION_LABELS[i]}
                      </div>
                      <div className="flex-1 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm">
                        {opt}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

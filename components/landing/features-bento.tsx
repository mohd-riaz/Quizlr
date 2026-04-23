import { Badge, Card, PulsingDot } from "../primitives";

export function FeaturesBento({ sparkData, aps }: { sparkData: number[]; aps: number }) {
  return (
    <section
      id="features"
      className="py-16 sm:py-20 md:py-28"
      style={{ background: "color-mix(in oklch, var(--muted) 40%, var(--background))" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-10 sm:mb-12">
          <Badge className="mb-4 font-mono">02 · Features</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]">
            Built on a real-time spine.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground">
            Every answer is a live event. Every score update is a push. No polling, no refresh,
            no &quot;who&apos;s still loading?&quot; — just the room you expected.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">

          {/* Real-time sync — spans full on mobile, 3 cols on lg */}
          <Card className="p-5 sm:p-6 lg:col-span-3 lg:row-span-2">
            <FeatureIcon>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 12a10 10 0 0 1 20 0" /><path d="M6 12a6 6 0 0 1 12 0" /><circle cx="12" cy="12" r="2" />
              </svg>
            </FeatureIcon>
            <h3 className="text-lg font-semibold mt-0">Sub-100ms answer sync</h3>
            <p className="text-sm max-w-md mt-2 mb-5 text-muted-foreground">
              Convex subscriptions push every answer the instant it lands. No socket wrangling.
            </p>
            <div
              className="rounded-md border p-4 font-mono text-xs border-border"
              style={{ background: "color-mix(in oklch, var(--muted) 60%, var(--card))" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted-foreground">answers/sec · last 30s</span>
                <span className="flex items-center gap-1.5">
                  <PulsingDot /> {aps}/s
                </span>
              </div>
              <div className="flex items-end gap-[3px] h-16 sm:h-20">
                {sparkData.map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-[1px] transition-all duration-300"
                    style={{
                      height: `${v * 100}%`,
                      background: i >= sparkData.length - 3
                        ? "var(--foreground)"
                        : "color-mix(in oklch, var(--foreground) 30%, transparent)",
                    }}
                  />
                ))}
              </div>
              <div className="mt-3 flex justify-between text-muted-foreground">
                <span>-30s</span><span>-20s</span><span>-10s</span><span>now</span>
              </div>
            </div>
          </Card>

          {/* AI generation */}
          <Card className="p-5 sm:p-6 lg:col-span-3">
            <FeatureIcon accent>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </FeatureIcon>
            <h3 className="text-lg font-semibold mt-0">AI question generation</h3>
            <p className="text-sm mt-2 mb-4 text-muted-foreground">
              Paste a topic, doc, or URL. Get validated, structured MCQs with explanations.
            </p>
            <div className="rounded-md border overflow-hidden border-border bg-card">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border text-xs font-mono text-muted-foreground">
                <span>generate.ts</span>
                <span className="ml-auto flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--lp-success)" }} />valid JSON
                </span>
              </div>
              <pre className="p-3 text-[11px] font-mono leading-relaxed overflow-x-auto">
                <span style={{ color: "var(--muted-foreground)" }}>{`{`}</span>{"\n"}
                {"  "}<span style={{ color: "var(--lp-accent)" }}>&quot;question&quot;</span>: &quot;Which element is a noble gas?&quot;,{"\n"}
                {"  "}<span style={{ color: "var(--lp-accent)" }}>&quot;options&quot;</span>: [&quot;Neon&quot;, &quot;Iron&quot;, &quot;Carbon&quot;, &quot;Sodium&quot;],{"\n"}
                {"  "}<span style={{ color: "var(--lp-accent)" }}>&quot;answer&quot;</span>: 0{"\n"}
                <span style={{ color: "var(--muted-foreground)" }}>{`}`}</span>
              </pre>
            </div>
          </Card>

          {/* No-login guests */}
          <Card className="p-5 sm:p-6 lg:col-span-3">
            <FeatureIcon>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 11h-6M19 8v6" />
              </svg>
            </FeatureIcon>
            <h3 className="text-lg font-semibold mt-0">No-login guests</h3>
            <p className="text-sm mt-2 text-muted-foreground">
              Players type a nickname and go. Hosts are authenticated; everyone else just plays.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {["@priya", "@mika", "@jordan", "@sol", "@ines", "@alex", "@teo"].map((n) => (
                <span key={n} className="inline-flex items-center h-6 px-2.5 rounded-full text-xs font-medium font-mono border border-border bg-card text-muted-foreground">{n}</span>
              ))}
              <span className="inline-flex items-center h-6 px-2.5 rounded-full text-xs font-medium font-mono border bg-card" style={{ borderColor: "color-mix(in oklch, var(--foreground) 40%, var(--border))", color: "var(--foreground)" }}>+ 17 more</span>
            </div>
          </Card>

          {/* Podium */}
          {/* <Card className="p-5 sm:p-6 lg:col-span-3">
            <FeatureIcon>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 21V9h8v12M4 21V13h4v8M16 21v-6h4v6M2 21h20" />
              </svg>
            </FeatureIcon>
            <h3 className="text-lg font-semibold mt-0">Podium finale</h3>
            <p className="text-sm mt-2 mb-4 text-muted-foreground">
              Top-three reveal with a full leaderboard. Rematch or export results.
            </p>
            <div className="flex items-end justify-center gap-2 h-24">
              <PodiumBar rank={2} name="Jordan" height="70%" />
              <PodiumBar rank={1} name="Priya" height="100%" accent />
              <PodiumBar rank={3} name="Mika" height="55%" />
            </div>
          </Card> */}

          {/* Small tiles */}
          {SMALL_TILES.map(({ icon, title, desc }) => (
            <Card key={title} className="p-5 sm:p-6 lg:col-span-3">
              <FeatureIcon>{icon}</FeatureIcon>
              <h3 className="text-base sm:text-lg font-semibold mt-0">{title}</h3>
              <p className="text-sm mt-2 text-muted-foreground">{desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureIcon({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className="w-8 h-8 grid place-items-center rounded-md mb-3"
      style={
        accent
          ? { background: "var(--lp-accent-soft)", color: "var(--lp-accent)" }
          : { background: "var(--muted)" }
      }
    >
      {children}
    </span>
  );
}

function PodiumBar({ rank, name, height, accent = false }: { rank: number; name: string; height: string; accent?: boolean }) {
  return (
    <div
      className="w-14 sm:w-16 rounded-t-md flex flex-col items-center justify-end pb-2 relative border border-b-0"
      style={{
        height,
        background: accent ? "color-mix(in oklch, var(--lp-accent) 18%, var(--card))" : "var(--muted)",
        borderColor: accent ? "color-mix(in oklch, var(--lp-accent) 50%, var(--border))" : "var(--border)",
      }}
    >
      {accent && (
        <svg className="absolute -top-4 w-5 h-5" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--lp-accent)" }}>
          <path d="M5 16L3 6l5.5 4L12 4l3.5 6L21 6l-2 10H5zm0 2h14v2H5z" />
        </svg>
      )}
      <span className="font-mono text-[11px]" style={{ color: accent ? "var(--lp-accent)" : "var(--muted-foreground)" }}>{rank}</span>
      <span className="text-xs font-medium">{name}</span>
    </div>
  );
}

const SMALL_TILES = [
  {
    title: "Any device",
    desc: "Responsive host and player views. Works on a projector and a phone simultaneously.",
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  },
  {
    title: "Edit & regenerate",
    desc: "Tweak any question inline. Regenerate a single one without losing the rest.",
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  },
  // {
  //   title: "Free to start",
  //   desc: "Hobby tier covers small classrooms and teams. Serverless from day one.",
  //   icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 0 1 0-4h12v4"/><path d="M4 6v12a2 2 0 0 0 2 2h14v-4"/><circle cx="16" cy="14" r="2"/></svg>,
  // },
];

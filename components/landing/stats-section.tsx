const STATS = [
  { val: "9,412", label: "quizzes hosted this week" },
  { val: "87ms", label: "median answer latency" },
  { val: "4.2s", label: "avg. time to first game" },
  { val: "124k", label: "players this month" },
];

export function StatsSection() {
  return (
    <section
      className="py-12 sm:py-16 border-y border-border"
      style={{ background: "color-mix(in oklch, var(--muted) 30%, var(--background))" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:grid sm:grid-cols-4 gap-6 sm:gap-8 items-start sm:items-center">
          <div className="sm:col-span-1">
            <div className="text-xs font-mono uppercase tracking-wider mb-2 text-muted-foreground">Used for</div>
            <div className="text-xl sm:text-2xl font-semibold tracking-tight leading-tight">
              Classrooms, offsites, trivia nights, onboarding, launch parties.
            </div>
          </div>
          <div className="sm:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {STATS.map(({ val, label }) => (
              <div key={label}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{val}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

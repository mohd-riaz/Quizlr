const USE_CASES = [
  { label: "Classrooms", desc: "Test knowledge after a lesson with live results." },
  { label: "Trivia nights", desc: "Host competitive rounds for any size group." },
  { label: "Team onboarding", desc: "Turn policy docs into an engaging quiz." },
  { label: "Launch parties", desc: "A quick game to kick off any event." },
];

export function StatsSection() {
  return (
    <section
      className="py-10 sm:py-14 border-y border-border"
      style={{ background: "color-mix(in oklch, var(--muted) 30%, var(--background))" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-xs font-mono uppercase tracking-wider mb-6 text-muted-foreground">Built for</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 sm:gap-y-0">
          {USE_CASES.map(({ label, desc }, i) => (
            <div
              key={label}
              className={`flex flex-col gap-1.5 ${i > 0 ? "sm:border-l sm:border-border sm:pl-6" : ""}`}
            >
              <div className="text-base font-semibold">{label}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

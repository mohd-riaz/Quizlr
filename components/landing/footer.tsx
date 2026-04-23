import { PulsingDot } from "../primitives";

export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
        <span className="font-sans text-[15px] font-bold tracking-tight text-foreground">
          Quiz<span style={{ color: "var(--muted-foreground)" }}>lr</span>
        </span>
        <span>© 2026 Quizlr</span>
        <span className="flex items-center gap-1.5">
          <PulsingDot /> all systems normal
        </span>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Btn, Icons } from "./primitives";

export function Nav({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: () => void }) {
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md border-b border-border"
      style={{ background: "color-mix(in oklch, var(--background) 80%, transparent)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Quiz<span style={{ color: "var(--muted-foreground)" }}>lr</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
          {[
            { href: "#how", label: "How it works" },
            { href: "#features", label: "Features" },
            { href: "#ai", label: "AI generation" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="inline-flex items-center h-8 px-3 rounded-lg hover:bg-muted hover:text-foreground transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-1 sm:gap-2 shrink-0">
          <button
            onClick={onToggleTheme}
            className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? Icons.sun : Icons.moon}
          </button>
          <Link
            href="/signin"
            className="hidden sm:inline-flex items-center h-8 px-3 text-sm font-medium rounded-lg hover:bg-muted transition-colors whitespace-nowrap"
          >
            Sign in
          </Link>
          <Btn href="/signup" size="sm">
            <span className="hidden sm:inline">Get started</span>
            <span className="sm:hidden">Sign up</span>
            {Icons.arrow}
          </Btn>
        </div>
      </div>
    </header>
  );
}

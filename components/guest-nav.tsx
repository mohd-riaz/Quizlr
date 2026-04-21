"use client";

import Link from "next/link";
import ThemeToggle from "./theme-toggle";

export default function GuestNav() {
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md border-b border-border"
      style={{ background: "color-mix(in oklch, var(--background) 80%, transparent)" }}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Quiz<span style={{ color: "var(--muted-foreground)" }}>lr</span>
        </Link>

          <ThemeToggle />
      </div>
    </header>
  );
}

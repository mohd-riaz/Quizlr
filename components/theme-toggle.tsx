"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Icons } from "./primitives";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      {mounted ? (isDark ? Icons.sun : Icons.moon) : <span className="w-4 h-4" />}
    </button>
  );
}

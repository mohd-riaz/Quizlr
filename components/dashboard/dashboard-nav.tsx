"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function DashboardNav() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { signOut } = useAuthActions();
  const router = useRouter();
  const user = useQuery(api.users.current);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const initial = user?.email ? user.email[0].toUpperCase() : "?";

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    router.push("/signin");
  };

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md border-b border-border"
      style={{ background: "color-mix(in oklch, var(--background) 80%, transparent)" }}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold tracking-tight">
          Quiz<span className="text-muted-foreground">lr</span>
        </Link>

        <div className="relative">
          <button
            ref={btnRef}
            onClick={() => setOpen((o) => !o)}
            className="w-8 h-8 rounded-full grid place-items-center text-[12px] font-semibold bg-foreground text-background transition-all cursor-pointer"
            aria-haspopup="menu"
            aria-expanded={open}
          >
            {initial}
          </button>

          {open && (
            <div
              ref={menuRef}
              role="menu"
              className="absolute right-0 top-11 w-56 bg-card border border-border rounded-[calc(var(--radius)+4px)] overflow-hidden shadow-md"
            >
              <div className="px-3 py-2.5 border-b border-border">
                <div className="text-xs font-medium truncate">{user?.email ?? "…"}</div>
                <div className="text-[11px] font-mono mt-0.5 text-muted-foreground">Signed in</div>
              </div>

              <div className="p-1.5">
                <div className="px-2 pt-1.5 pb-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Theme
                </div>
                <div className="grid grid-cols-2 gap-1 p-1">
                  <button
                    onClick={() => setTheme("light")}
                    className="inline-flex items-center gap-1.5 h-8 px-2 text-[13px] font-medium rounded-md transition-colors hover:bg-muted cursor-pointer"
                    style={{ background: theme === "light" ? "var(--muted)" : "transparent" }}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </svg>
                    Light
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className="inline-flex items-center gap-1.5 h-8 px-2 text-[13px] font-medium rounded-md transition-colors hover:bg-muted cursor-pointer"
                    style={{ background: theme === "dark" ? "var(--muted)" : "transparent" }}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                    Dark
                  </button>
                </div>
              </div>

              <div className="p-1.5 border-t border-border">
                <button
                  onClick={handleSignOut}
                  className="w-full inline-flex items-center gap-1.5 h-8 px-2 text-[13px] font-medium rounded-md transition-colors hover:bg-muted cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge as UiBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const VARIANT_MAP = {
  primary: "default",
  outline: "outline",
  ghost:   "ghost",
} as const;

// shadcn size + any per-size overrides
const SIZE_MAP = {
  sm: { size: "default" as const, cls: "px-3" },
  md: { size: "lg"      as const, cls: "px-4" },
  lg: { size: "lg"      as const, cls: "h-11 px-5 text-[0.95rem] rounded-[calc(var(--radius)+2px)]" },
};

export function Btn({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  onClick,
  type,
  target,
}: {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  target ?: string;
}) {
  const v = VARIANT_MAP[variant];
  const { size: s, cls } = SIZE_MAP[size];
  const merged = cn(cls, "overflow-hidden", className);

  if (href) {
    return (
      <Link href={href} className={cn(buttonVariants({ variant: v, size: s }), merged)} target={target}>
        {children}
      </Link>
    );
  }
  return (
    <Button type={type ?? "button"} variant={v} size={s} className={merged} onClick={onClick}>
      {children}
    </Button>
  );
}

export function Badge({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <UiBadge
      variant="outline"
      className={cn("h-6 rounded-full px-2.5 bg-card text-muted-foreground", className)}
      style={style}
    >
      {children}
    </UiBadge>
  );
}

export function Card({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("bg-card text-card-foreground border border-border rounded-[calc(var(--radius)+4px)]", className)}
      style={style}
    >
      {children}
    </div>
  );
}

export function PulsingDot({ accent = false }: { accent?: boolean }) {
  return (
    <span
      className="relative inline-flex w-1.5 h-1.5 rounded-full"
      style={{ background: accent ? "var(--lp-accent)" : "var(--lp-success)" }}
    >
      <span
        className={`absolute inset-0 rounded-full ${accent ? "lp-pulse-ring-accent" : "lp-pulse-ring"}`}
        style={{ background: accent ? "var(--lp-accent)" : "var(--lp-success)" }}
      />
    </span>
  );
}

export const Icons = {
  arrow: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  ),
  lock: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  sun: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  ),
  moon: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  github: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),
  regen: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  play: (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 3l14 9-14 9V3z" />
    </svg>
  ),
};

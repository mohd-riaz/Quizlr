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
}: {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const v = VARIANT_MAP[variant];
  const { size: s, cls } = SIZE_MAP[size];
  const merged = cn(cls, "overflow-hidden", className);

  if (href) {
    return (
      <Link href={href} className={cn(buttonVariants({ variant: v, size: s }), merged)}>
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

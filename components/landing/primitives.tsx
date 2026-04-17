import Link from "next/link";

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
  const base =
    "inline-flex items-center justify-center gap-2 font-medium text-sm transition-all cursor-pointer select-none whitespace-nowrap border overflow-hidden";
  const variants = {
    primary: "bg-primary text-primary-foreground border-transparent hover:opacity-90",
    outline: "bg-transparent text-foreground border-border hover:bg-muted",
    ghost: "bg-transparent text-foreground border-transparent hover:bg-muted",
  };
  const sizes = {
    sm: "h-8 px-3 text-sm rounded-md",
    md: "h-10 px-4 rounded-lg",
    lg: "h-11 px-5 text-[0.95rem] rounded-[calc(var(--radius)+2px)]",
  };
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type={type ?? "button"} className={cls} onClick={onClick}>{children}</button>;
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
    <span
      className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-xs font-medium border border-border bg-card text-muted-foreground ${className}`}
      style={style}
    >
      {children}
    </span>
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
      className={`bg-card text-card-foreground border border-border rounded-[calc(var(--radius)+4px)] ${className}`}
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

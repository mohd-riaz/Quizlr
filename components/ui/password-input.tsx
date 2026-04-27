"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function PasswordInput({
  className,
  disabled,
  ...props
}: React.ComponentProps<"input">) {
  const [show, setShow] = useState(false);
  return (
    <div
      className={cn(
        "flex h-8 w-full items-center rounded-lg border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40",
        disabled && "pointer-events-none bg-input/50 opacity-50 dark:bg-input/80"
      )}
    >
      <input
        {...props}
        suppressHydrationWarning
        type={show ? "text" : "password"}
        disabled={disabled}
        className={cn(
          "h-full flex-1 min-w-0 bg-transparent pl-2.5 pr-1 py-1 text-sm outline-none placeholder:text-muted-foreground",
          className
        )}
      />
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        onClick={() => setShow((v) => !v)}
        className="flex shrink-0 items-center pr-2.5 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

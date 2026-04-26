import ThemeToggle from "@/components/theme-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full mx-auto px-6 h-14 flex items-center justify-end">
        <ThemeToggle />
      </div>
      <div className="flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center gap-6 bg-background px-6 md:px-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </>
  );
}

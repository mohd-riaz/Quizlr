import ThemeToggle from "@/components/theme-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeToggle className="absolute z-50 top-3 right-6"/>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background px-6 md:px-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </>
  );
}

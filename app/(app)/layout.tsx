import DashboardNav from "@/components/dashboard/DashboardNav";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await convexAuthNextjsToken();
  if (!token) redirect("/signin");
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      {children}
    </div>
  );
}

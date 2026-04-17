import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";

export default async function Home() {
  const token = await convexAuthNextjsToken();
  if (token) redirect("/dashboard");
  return <LandingPage />;
}

import DashboardNav from "@/components/dashboard/dashboard-nav";
import GuestNav from "@/components/guest-nav";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

export default async function Layout({children}:{children:React.ReactNode}) {
  const token = await convexAuthNextjsToken();
  return (
    <div>{token?<DashboardNav/>:<GuestNav/>}{children}</div>
  )
}
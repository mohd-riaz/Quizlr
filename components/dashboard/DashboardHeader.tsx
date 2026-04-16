"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  const { signOut } = useAuthActions();
  const router = useRouter();
  const user = useQuery(api.users.current);

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-indigo-600 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          Quiz<span className="text-indigo-200">lr</span>
        </h1>
        <div className="flex items-center gap-3">
          {user?.email && (
            <span className="text-sm text-indigo-100 hidden sm:inline">
              {user.email}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white cursor-pointer"
          >
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
